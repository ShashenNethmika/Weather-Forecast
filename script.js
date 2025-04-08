document.addEventListener("DOMContentLoaded", () => {
  const locationInput = document.getElementById("location-input");
  const searchButton = document.getElementById("search-button");
  const geolocationButton = document.getElementById("geolocation-button");
  const themeToggleButton = document.getElementById("theme-toggle");
  const weatherInfo = document.getElementById("weather-info");
  const cityNameElement = document.getElementById("city-name");
  const temperatureElement = document.getElementById("temperature");
  const descriptionElement = document.getElementById("description");
  const humidityElement = document.getElementById("humidity");
  const windSpeedElement = document.getElementById("wind-speed");
  const weatherIcon = document.getElementById("weather-icon");
  const errorMessageElement = document.getElementById("error-message");
  const conditionElement = document.getElementById("condition");
  const unitToggle = document.getElementById("unit-toggle");
  const suggestionsDiv = document.getElementById("suggestions");
  const hourlyForecastContainer = document.getElementById("hourly-forecast");
  const dailyForecastContainer = document.getElementById("daily-forecast");
  const customMessage = document.getElementById("custom-message");
  const messageClose = document.getElementById("message-close");

  const apiKey = "502881aadda5ce1478fdaceb0a63f6fa";
  let originalTemp;
  let currentUnit = "C";

  // Load saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark-mode") {
    document.body.classList.add("dark-mode");
    themeToggleButton.textContent = "Light Mode";
  } else {
    themeToggleButton.textContent = "Dark Mode";
  }

  // Theme toggle
  themeToggleButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDarkMode = document.body.classList.contains("dark-mode");
    themeToggleButton.textContent = isDarkMode ? "Light Mode" : "Dark Mode";
    localStorage.setItem("theme", isDarkMode ? "dark-mode" : "");
  });

  // Debounce function
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // Fetch city suggestions
  async function fetchCitySuggestions(query) {
    if (!query) {
      suggestionsDiv.classList.remove("visible");
      return;
    }
    try {
      const url = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
        query
      )}&limit=5&appid=${apiKey}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("API request failed");
      const data = await response.json();

      suggestionsDiv.innerHTML = "";
      if (data.length > 0) {
        data.forEach((city) => {
          const suggestion = document.createElement("div");
          const fullName = `${city.name}, ${city.country}${
            city.state ? `, ${city.state}` : ""
          }`;
          suggestion.textContent = fullName;
          suggestion.addEventListener("click", () => {
            locationInput.value = fullName;
            suggestionsDiv.classList.remove("visible");
            fetchWeatherData();
          });
          suggestionsDiv.appendChild(suggestion);
        });
        suggestionsDiv.classList.add("visible");
      } else {
        suggestionsDiv.classList.remove("visible");
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      suggestionsDiv.classList.remove("visible");
    }
  }

  locationInput.addEventListener(
    "input",
    debounce(() => {
      const query = locationInput.value.trim();
      fetchCitySuggestions(query);
    }, 300)
  );

  document.addEventListener("click", (e) => {
    if (!suggestionsDiv.contains(e.target) && e.target !== locationInput) {
      suggestionsDiv.classList.remove("visible");
    }
  });

  function showCustomMessage() {
    customMessage.classList.add("visible");
  }

  messageClose.addEventListener("click", () => {
    customMessage.classList.remove("visible");
  });

  async function fetchWeatherData() {
    const location = locationInput.value.trim();
    if (!location) {
      showCustomMessage();
      return;
    }
    searchButton.textContent = "Searching...";
    searchButton.disabled = true;
    try {
      const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
      const currentResponse = await fetch(currentWeatherUrl);
      if (!currentResponse.ok)
        throw new Error(
          `Current weather data not found: ${currentResponse.status}`
        );
      const currentData = await currentResponse.json();

      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;
      const forecastResponse = await fetch(forecastUrl);
      if (!forecastResponse.ok)
        throw new Error(`Forecast data not found: ${currentResponse.status}`);
      const forecastData = await forecastResponse.json();

      displayWeather(currentData, forecastData);
      searchButton.textContent = "Search";
      searchButton.disabled = false;
    } catch (error) {
      console.error("Fetch error:", error);
      errorMessageElement.textContent = error.message;
      errorMessageElement.classList.add("visible");
      weatherInfo.style.display = "none";
      searchButton.textContent = "Search";
      searchButton.disabled = false;
    }
  }

  async function fetchWeatherDataByCoords(lat, lon) {
    searchButton.textContent = "Searching...";
    searchButton.disabled = true;
    try {
      const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      const currentResponse = await fetch(currentWeatherUrl);
      if (!currentResponse.ok)
        throw new Error(
          `Current weather data not found: ${currentResponse.status}`
        );
      const currentData = await currentResponse.json();

      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      const forecastResponse = await fetch(forecastUrl);
      if (!forecastResponse.ok)
        throw new Error(`Forecast data not found: ${currentResponse.status}`);
      const forecastData = await forecastResponse.json();

      displayWeather(currentData, forecastData);
      searchButton.textContent = "Search";
      searchButton.disabled = false;
    } catch (error) {
      console.error("Fetch error:", error);
      errorMessageElement.textContent = error.message;
      errorMessageElement.classList.add("visible");
      weatherInfo.style.display = "none";
      searchButton.textContent = "Search";
      searchButton.disabled = false;
    }
  }

  function getStaticIconUrl(iconCode) {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }

  function getConditionText(iconCode) {
    if (!iconCode) return "Unknown";
    if (iconCode.startsWith("01")) return "Clear Sky";
    if (iconCode.startsWith("02")) return "Few Clouds";
    if (iconCode.startsWith("03")) return "Scattered Clouds";
    if (iconCode.startsWith("04")) return "Broken Clouds";
    if (iconCode.startsWith("09")) return "Shower Rain";
    if (iconCode.startsWith("10")) return "Rain";
    if (iconCode.startsWith("11")) return "Thunderstorm";
    if (iconCode.startsWith("13")) return "Snow";
    if (iconCode.startsWith("50")) return "Mist";
    return "Unknown";
  }

  function loadWeatherIcon(container, iconCode) {
    container.innerHTML = "";
    const staticIconUrl = getStaticIconUrl(iconCode);
    const img = document.createElement("img");
    img.src = staticIconUrl;
    img.alt = "Weather Icon";
    img.style.width = "100%";
    img.style.height = "100%";
    img.onerror = () =>
      console.error(`Failed to load static icon: ${staticIconUrl}`);
    img.onload = () => console.log(`Static icon loaded: ${staticIconUrl}`);
    container.appendChild(img);
  }

  function displayWeather(currentData, forecastData) {
    cityNameElement.textContent = currentData.name || "Unknown City";
    originalTemp = currentData.main.temp || 0;
    temperatureElement.textContent = `${Math.round(originalTemp)}°C`;
    descriptionElement.textContent =
      currentData.weather[0].description || "No description";
    humidityElement.textContent = `${currentData.main.humidity || 0}%`;
    windSpeedElement.textContent = `${currentData.wind.speed || 0} m/s`;

    const iconCode = currentData.weather[0].icon || "01d";
    loadWeatherIcon(weatherIcon, iconCode);

    const conditionText = getConditionText(iconCode);
    conditionElement.textContent = conditionText;

    const weatherClasses = [
      "clear-sky",
      "few-clouds",
      "scattered-clouds",
      "broken-clouds",
      "shower-rain",
      "rain",
      "thunderstorm",
      "snow",
      "mist",
    ];
    document.body.classList.remove(...weatherClasses);
    document.body.classList.add(conditionText.toLowerCase().replace(/ /g, "-"));

    hourlyForecastContainer.innerHTML = "";
    forecastData.list.slice(0, 4).forEach((hour) => {
      const time = new Date(hour.dt * 1000).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });
      const temp = Math.round(hour.main.temp);
      const icon = hour.weather[0].icon || "01d";
      const hourlyItem = document.createElement("div");
      hourlyItem.classList.add("hourly-item");
      const animationDiv = document.createElement("div");
      loadWeatherIcon(animationDiv, icon);
      hourlyItem.innerHTML = `<span>${time}</span>`;
      hourlyItem.appendChild(animationDiv);
      hourlyItem.innerHTML += `<span>${temp}°C</span>`;
      hourlyForecastContainer.appendChild(hourlyItem);
    });

    dailyForecastContainer.innerHTML = "";
    const dailyData = {};
    forecastData.list.forEach((item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString([], {
        weekday: "short",
      });
      if (!dailyData[date]) {
        dailyData[date] = {
          minTemp: item.main.temp_min,
          maxTemp: item.main.temp_max,
          icon: item.weather[0].icon || "01d",
          description: item.weather[0].description,
        };
      } else {
        dailyData[date].minTemp = Math.min(
          dailyData[date].minTemp,
          item.main.temp_min
        );
        dailyData[date].maxTemp = Math.max(
          dailyData[date].maxTemp,
          item.main.temp_max
        );
      }
    });

    Object.keys(dailyData)
      .slice(0, 5)
      .forEach((date) => {
        const dailyItem = document.createElement("div");
        dailyItem.classList.add("daily-item");
        const animationDiv = document.createElement("div");
        loadWeatherIcon(animationDiv, dailyData[date].icon);
        dailyItem.innerHTML = `<span>${date}</span>`;
        dailyItem.appendChild(animationDiv);
        dailyItem.innerHTML += `<span>${Math.round(
          dailyData[date].minTemp
        )}°C / ${Math.round(dailyData[date].maxTemp)}°C</span>`;
        dailyForecastContainer.appendChild(dailyItem);
      });

    weatherInfo.style.display = "block";
    setTimeout(() => weatherInfo.classList.add("visible"), 10);
    errorMessageElement.classList.remove("visible");
    locationInput.value = "";
    currentUnit = "C";
    unitToggle.textContent = "°C";
  }

  unitToggle.addEventListener("click", () => {
    temperatureElement.classList.add("changing");
    setTimeout(() => {
      if (currentUnit === "C") {
        const tempF = (originalTemp * 9) / 5 + 32;
        temperatureElement.textContent = `${Math.round(tempF)}°F`;
        currentUnit = "F";
        unitToggle.textContent = "°F";
      } else {
        temperatureElement.textContent = `${Math.round(originalTemp)}°C`;
        currentUnit = "C";
        unitToggle.textContent = "°C";
      }
      setTimeout(() => temperatureElement.classList.remove("changing"), 300);
    }, 0);
  });

  searchButton.addEventListener("click", fetchWeatherData);
  locationInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") fetchWeatherData();
  });

  geolocationButton.addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          fetchWeatherDataByCoords(lat, lon);
        },
        (error) => {
          console.error(error);
          alert("Unable to retrieve your location");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  });
});
