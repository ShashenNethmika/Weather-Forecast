
---

# Weather Forecast Web Application

A modern, responsive weather forecast web application built with HTML, CSS, and JavaScript. This project fetches real-time weather data from the OpenWeatherMap API and displays it with an interactive UI, including animated weather icons, glow effects, and clickable links to detailed weather information.



## Features

- **Real-Time Weather Data**: Fetches current weather, hourly, and 5-day forecast data using the OpenWeatherMap API.
- **Animated Weather Icons**: Main weather icon is animated (sourced from amCharts) and clickable, linking to OpenWeatherMap city pages.
- **Glow Effects**: Hover over city names, labels, and values to see a glowing text effect.
- **Dark/Light Mode**: Toggle between light and dark themes with local storage persistence.
- **Geolocation Support**: Use your current location to fetch weather data.
- **Responsive Design**: Works seamlessly on desktop and mobile devices.
- **Unit Conversion**: Switch between Celsius and Fahrenheit for temperature.
- **City Autocomplete**: Suggests cities as you type in the search bar.
- **Error Handling**: Displays user-friendly error messages for invalid inputs or API failures.



## Installation

Follow these steps to set up the project locally:

### Prerequisites
- A modern web browser (Chrome, Firefox, etc.)
- An OpenWeatherMap API key (free tier available)

### Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ShashenNethmika/weather-forecast.git
   cd weather-forecast
   ```

2. **Get an API Key**:
   - Sign up at [OpenWeatherMap](https://openweathermap.org/) and generate an API key.
   - Open `script.js` and replace the `apiKey` value with your own:
     ```javascript
     const apiKey = 'YOUR_API_KEY_HERE';
     ```

3. **Open the Project**:
   - Open `index.html` in your browser directly, or use a local server (e.g., via VS Code Live Server extension) for the best experience.

## Project Structure

```
weather-forecast/
│
├── index.html      # Main HTML file
├── style.css       # Stylesheet with light/dark themes and glow effects
├── script.js       # JavaScript logic for API calls and interactivity
└── README.md       # Project documentation
```

## Usage

1. **Search Weather**:
   - Type a city name (e.g., "Colombo") in the search bar and click "Search" or press Enter.
   - Use the autocomplete suggestions to select a city.

2. **Use Geolocation**:
   - Click "Use My Location" to fetch weather data based on your current coordinates.

3. **Toggle Theme**:
   - Click "Light Mode" or "Dark Mode" to switch themes.

4. **Explore Weather**:
   - Hover over text (e.g., "Temperature:", "Colombo") for glow effects.
   - Click the main weather icon to visit the OpenWeatherMap page for that city.
   - Scroll through hourly and daily forecasts.

## Technologies Used

- **HTML5**: Structure of the web page.
- **CSS3**: Styling with custom variables, animations, and responsive design.
- **JavaScript (ES6)**: Logic for API integration, DOM manipulation, and interactivity.
- **OpenWeatherMap API**: Weather data source.
- **amCharts**: Animated SVG weather icons.

## Screenshots



### Light Mode


### Dark Mode


## Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for the weather API.
- [amCharts](https://www.amcharts.com/) for animated weather icons.
- [Poppins Font](https://fonts.google.com/specimen/Poppins) from Google Fonts.

## Contact

For questions or feedback, reach out to [your-email@example.com](mailto:your-email@example.com) or open an issue on GitHub.

---
