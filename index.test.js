const { getWeatherEmoji, displayError, getWeatherData, displayWeatherInfo } = require('./index');

// getWeatherEmoji tests

test('returns thunderstorm emoji for 2xx codes', () => {
  expect(getWeatherEmoji(201)).toBe("🌩️");
});

test('returns drizzle emoji for 3xx codes', () => {
  expect(getWeatherEmoji(301)).toBe("🌧️");
});

test('returns rain emoji for 5xx codes', () => {
  expect(getWeatherEmoji(501)).toBe("🌧️");
});

test('returns snow emoji for 6xx codes', () => {
  expect(getWeatherEmoji(601)).toBe("❄️");
});

test('returns fog emoji for 7xx codes', () => {
  expect(getWeatherEmoji(701)).toBe("🌫️");
});

test('returns sun emoji for 800', () => {
  expect(getWeatherEmoji(800)).toBe("☀️");
});

test('returns cloud emoji for 801-899', () => {
  expect(getWeatherEmoji(850)).toBe("☁️");
});

test('getWeatherEmoji returns "?" for unknown codes', () => {
  expect(getWeatherEmoji(9999)).toBe("?");
  expect(getWeatherEmoji(-1)).toBe("?");
  expect(getWeatherEmoji(undefined)).toBe("?");
  expect(getWeatherEmoji(null)).toBe("?");
});

// displayError tests

test('displayError adds error message to card', () => {
  document.body.innerHTML = `<div class="card"></div>`;
  const card = document.querySelector('.card');
  displayError('Test error', card);
  expect(card.textContent).toBe('Test error');
  expect(card.style.display).toBe('flex');
  expect(card.querySelector('p.errorDisplay')).not.toBeNull();
});

test('displayError overwrites previous error', () => {
  document.body.innerHTML = `<div class="card"><p>Old error</p></div>`;
  const card = document.querySelector('.card');
  displayError('New error', card);
  expect(card.textContent).toBe('New error');
  expect(card.querySelectorAll('p').length).toBe(1);
});

test('displayError adds correct class to error element', () => {
  document.body.innerHTML = `<div class="card"></div>`;
  const card = document.querySelector('.card');
  displayError('Class test', card);
  const errorP = card.querySelector('p');
  expect(errorP.classList.contains('errorDisplay')).toBe(true);
});

// getWeatherData tests

global.fetch = jest.fn();

afterEach(() => {
  fetch.mockClear();
});

test('getWeatherData returns weather data for a valid city', async () => {
  const mockResponse = { weather: [{ id: 800, description: "clear sky" }], main: { temp: 300, humidity: 50 }, name: "Berlin" };
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockResponse,
  });

  const data = await getWeatherData("Berlin");
  expect(data).toEqual(mockResponse);
  expect(fetch).toHaveBeenCalledWith(expect.stringContaining("Berlin"));
});

test('getWeatherData throws error for invalid city', async () => {
  fetch.mockResolvedValueOnce({
    ok: false,
  });

  await expect(getWeatherData("InvalidCity")).rejects.toThrow("City not found or API error.");
});

test('getWeatherData throws error if fetch fails', async () => {
  fetch.mockRejectedValueOnce(new Error('Network error'));
  await expect(getWeatherData("Berlin")).rejects.toThrow("Network error");
});

// displayWeatherInfo tests

test('displayWeatherInfo displays weather data correctly', () => {
  document.body.innerHTML = `<div class="card"></div>`;
  const card = document.querySelector('.card');
  const mockData = {
    name: "Berlin",
    main: { temp: 300, humidity: 50 },
    weather: [{ description: "clear sky", id: 800 }],
  };

  displayWeatherInfo(mockData, card);

  const h1 = card.querySelector('h1');
  expect(h1).not.toBeNull();
  expect(h1.textContent).toBe("Berlin");
  const temp = card.querySelector('.tempDisplay');
  expect(temp).not.toBeNull();
  expect(temp.textContent).toBe("Temperature: 26.9°C");
  const humidity = card.querySelector('.humidityDisplay');
  expect(humidity).not.toBeNull();
  expect(humidity.textContent).toBe("Humidity: 50%");
  const desc = card.querySelector('.descDisplay');
  expect(desc).not.toBeNull();
  expect(desc.textContent).toBe("Description: clear sky");
  const emoji = card.querySelector('p:last-child');
  expect(emoji).not.toBeNull();
  expect(emoji.textContent).toBe("☀️");
});

test('displayWeatherInfo handles empty data', () => {
  document.body.innerHTML = `<div class="card"></div>`;
  const card = document.querySelector('.card');
  displayWeatherInfo({}, card);
  expect(card.textContent).toBe("");
});

test('displayWeatherInfo handles missing fields', () => {
  document.body.innerHTML = `<div class="card"></div>`;
  const card = document.querySelector('.card');
  const mockData = {
    name: "Berlin",
    main: { temp: 300 },
    weather: [],
  };

  displayWeatherInfo(mockData, card);

  const h1 = card.querySelector('h1');
  expect(h1).not.toBeNull();
  expect(h1.textContent).toBe("Berlin");
  const temp = card.querySelector('.tempDisplay');
  expect(temp).not.toBeNull();
  expect(temp.textContent).toBe("Temperature: 26.9°C");
  expect(card.querySelector('.humidityDisplay')).toBeNull();
  expect(card.querySelector('.descDisplay')).toBeNull();
});

test('displayWeatherInfo handles undefined data', () => {
  document.body.innerHTML = `<div class="card"></div>`;
  const card = document.querySelector('.card');
  displayWeatherInfo(undefined, card);
  expect(card.textContent).toBe("");
});

test('displayWeatherInfo does nothing if card is missing', () => {
  expect(() => displayWeatherInfo({ name: "Berlin", main: { temp: 300 }, weather: [] }, null)).not.toThrow();
});

test('displayWeatherInfo shows correct emoji for thunderstorm', () => {
  document.body.innerHTML = `<div class="card"></div>`;
  const card = document.querySelector('.card');
  const mockData = {
    name: "Berlin",
    main: { temp: 300, humidity: 50 },
    weather: [{ description: "thunderstorm", id: 201 }],
  };
  displayWeatherInfo(mockData, card);
  const emoji = card.querySelector('p:last-child');
  expect(emoji).not.toBeNull();
  expect(emoji.textContent).toBe("🌩️");
});

// Test for browser-only code

if (typeof window !== "undefined" && typeof document !== "undefined") {
  test('browser event listener submits and displays weather info', async () => {
    document.body.innerHTML = `
      <form class="weatherForm">
        <input type="text" class="cityInput" value="Berlin">
        <button type="submit">Get Weather</button>
      </form>
      <div class="card"></div>
    `;

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        name: "Berlin",
        main: { temp: 300, humidity: 50 },
        weather: [{ description: "clear sky", id: 800 }],
      }),
    });

    jest.resetModules();
    require('./index');

    const weatherForm = document.querySelector('.weatherForm');
    weatherForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    await new Promise(r => setTimeout(r, 10));

    const card = document.querySelector('.card');
    const h1 = card.querySelector('h1');
    expect(h1).not.toBeNull();
    expect(h1.textContent).toBe("Berlin");
  });

  test('browser event listener shows error for empty city input', async () => {
    document.body.innerHTML = `
      <form class="weatherForm">
        <input type="text" class="cityInput" value="">
        <button type="submit">Get Weather</button>
      </form>
      <div class="card"></div>
    `;

    jest.resetModules();
    require('./index');

    const weatherForm = document.querySelector('.weatherForm');
    weatherForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    await new Promise(r => setTimeout(r, 10));

    const card = document.querySelector('.card');
    const error = card.querySelector('p.errorDisplay');
    expect(error).not.toBeNull();
    expect(error.textContent).toBe("Please enter a city name.");
  });
}