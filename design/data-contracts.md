# Data Contracts

This document defines the API responses used by the dashboard.

## /api/tempest/current

Source: Tempest weather station

Fields:

- tempF
- dewF
- feelsLikeF
- humidity
- pressureIn
- pressureMb
- windSpeed
- windGust
- windDir
- rainDailyIn
- rainRateInHr
- todayHighF
- todayLowF
- updatedAt

## /api/nws-forecast

Source: National Weather Service

Returns:
- periods[]

Each period includes:

- name
- temperature
- temperatureUnit
- shortForecast
- detailedForecast
- probabilityOfPrecipitation

## /api/nws-alerts

Source: National Weather Service

Returns:
- alerts[]

Fields:

- event
- headline
- description
- area
- expires
- ends

## /api/regional-temps

Returns:

cities[]

Each city:

- name
- tempF
- x
- y

Used by:
- regional map screen

## /api/history/temperature

Used for:
- temperature graph

Returns:

- points[]
- startOfDayMs
- endOfDayMs
- todayHighF
- todayLowF

## /api/history/pressure

Used for:
- pressure graph

Returns:

- points[]
- startMs
- endMs

## /api/tempest/lightning

Lightning strike information.

Fields may include:

- lastStrikeEpoch
- lastStrikeDistanceMiles
- minuteCount
- hourCount
- todayCount
