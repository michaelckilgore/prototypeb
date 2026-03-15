# Data Sources

## Tempest Personal Weather Station

Provider: WeatherFlow / Tempest

Current station ID:
- `211052`

Used for live local conditions including:
- air temperature
- dew point
- feels like temperature
- relative humidity
- station pressure
- wind speed
- wind gust
- wind direction
- local daily precipitation
- short-interval precipitation

Backend converts source metric values into:
- Fahrenheit
- miles per hour
- inches of mercury
- inches of rain

## National Weather Service API

Base API:
- `https://api.weather.gov`

Used for:
- point metadata
- forecast retrieval
- active alerts at home point
- regional station observations
- nationwide Tornado Watch and Severe Thunderstorm Watch detection

Headers currently used by backend:
- `User-Agent: SugarHillDashboard/1.0`
- `Accept: application/geo+json`

## Home location

Current configured home point:
- latitude: `39.6092`
- longitude: `-85.4464`

## Regional observation stations

Current station list:
- KIND — Indianapolis
- KMIE — Muncie
- KGEZ — Shelbyville
- KBAK — Columbus
- KBMG — Bloomington
- KLUK — Cincinnati
