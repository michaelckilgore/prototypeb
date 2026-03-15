# Data Contracts

## `/api/tempest/current`

Purpose: return normalized current local weather conditions.

Representative fields:
- `tempF`
- `dewF`
- `feelsLikeF`
- `humidity`
- `pressureIn`
- `pressureMb`
- `windSpeed`
- `windGust`
- `windDir`
- `rainDailyIn`
- `rainRateInHr`
- `todayHighF`
- `todayLowF`
- `condition`
- `updatedAt`

## `/api/nws-forecast`

Purpose: return forecast periods from NWS.

Shape:
- `periods` array
- `updatedAt`

## `/api/nws-forecast-detailed`

Currently mirrors `/api/nws-forecast`.

## `/api/nws-alerts`

Purpose: return active alerts affecting the configured home point.

Alert object fields currently returned:
- `event`
- `headline`
- `description`
- `area`
- `expires`
- `ends`

Envelope:
- `alerts`

## `/api/regional-temps`

Purpose: return current temperatures for regional cities.

Envelope fields:
- `cities`
- `updatedAt`
- `asOfLabel`

City object fields:
- `name`
- `tempF`
- `x`
- `y`

## `/api/history/temperature`

Current state: placeholder.

Currently returns:
- `points` as an empty array
- `startOfDayMs`
- `endOfDayMs`
- `todayHighF`
- `todayLowF`

## `/api/history/pressure`

Current state: placeholder.

Currently returns:
- `points` as an empty array
- `startMs`
- `endMs`

## `/api/tempest/lightning`

Current state: placeholder.

Currently returns an empty object.

## `/api/spc-watches`

Purpose: return active severe watch numbers derived from NWS alerts.

Current response shape:
- `watches` array of numbers

Future desired expansion:
- watch type
- headline
- areas affected
- expiration time
