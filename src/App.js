import React, { useState } from 'react';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError('Please enter a city name.');
      setWeather(null);
      return;
    }
    setLoading(true);
    setError('');
    setWeather(null);

    try {
      // Geocode the city name to get latitude and longitude
      const geoResp = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`
      );
      const geoData = await geoResp.json();

      if (!geoData.length) {
        setError('City not found. Please try another.');
        setLoading(false);
        return;
      }

    const { lat, lon } = geoData[0];

// Fetch weather data from Open-Meteo
const weatherResp = await fetch(
  `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
);
const weatherData = await weatherResp.json();

      if (!weatherData.current_weather) {
        setError('Weather data not available.');
      } else {
        setWeather(weatherData.current_weather);
      }
    } catch (err) {
      setError('Error fetching data. Please check your internet connection.');
    }

    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Segoe UI, Arial, sans-serif'
    }}>
      <h1 style={{
        marginBottom: '2rem',
        color: '#153677',
        fontWeight: 'bold',
        fontSize: '2.5rem',
        textShadow: '1px 1px 8px #fff'
      }}>Weather Now</h1>
      <div style={{
        background: '#ffffffee',
        padding: '2rem 2rem 1rem 2rem',
        borderRadius: '1rem',
        boxShadow: '0 4px 24px rgba(21,54,119,0.14)',
        minWidth: '320px',
        maxWidth: '95vw'
      }}>
        <input
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '16px',
            borderRadius: '7px',
            border: '1px solid #66a6ff',
            fontSize: '1.1rem'
          }}
          type="text"
          value={city}
          placeholder="Enter city name"
          onChange={(e) => setCity(e.target.value)}
          disabled={loading}
        />
        <button
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '7px',
            border: 'none',
            background: loading ? '#ccdbee' : '#66a6ff',
            color: '#fff',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 8px rgba(102,166,255,0.12)'
          }}
          onClick={fetchWeather}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Get Weather'}
        </button>
        {error && <p style={{
          color: '#ff3860',
          fontSize: '1rem',
          marginTop: '1rem',
          textAlign: 'center',
          fontWeight: 500
        }}>{error}</p>}
        {weather && (
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            borderRadius: '10px',
            background: '#f6f8fa',
            boxShadow: '0 2px 6px rgba(102,166,255,0.15)'
          }}>
            <h2 style={{
              fontWeight: 'bold',
              color: '#153677',
              marginBottom: '1rem',
              fontSize: '1.2rem'
            }}>
              Weather in {city}
            </h2>
            <div style={{ marginBottom: '8px', fontSize: '1.05rem' }}>
              <span style={{ fontWeight: 600, color: '#66a6ff', marginRight: 5 }}>🌡 Temperature:</span>
              {weather.temperature}°C
            </div>
            <div style={{ marginBottom: '8px', fontSize: '1.05rem' }}>
              <span style={{ fontWeight: 600, color: '#66a6ff', marginRight: 5 }}>💨 Wind Speed:</span>
              {weather.windspeed} km/h
            </div>
            <div style={{ marginBottom: '8px', fontSize: '1.05rem' }}>
              <span style={{ fontWeight: 600, color: '#66a6ff', marginRight: 5 }}>⛅ Weather Code:</span>
              {weather.weathercode}
            </div>
            <div style={{ marginBottom: '8px', fontSize: '1.05rem' }}>
              <span style={{ fontWeight: 600, color: '#66a6ff', marginRight: 5 }}>🕒 Time:</span>
              {weather.time}
            </div>
          </div>
        )}
      </div>
      <footer style={{
        marginTop: '2rem',
        fontSize: '0.9rem',
        color: '#153677cc',
        textAlign: 'center'
      }}>
        <span>Powered by Open-Meteo & OpenStreetMap</span>
      </footer>
    </div>
  );
}

export default App;