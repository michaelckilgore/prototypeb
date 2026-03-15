
# Tempest API Lessons Learned

Problem:
The Tempest API format changed from an OBS ARRAY to an OBS OBJECT.

Old assumption:
obs[7] = temperature
obs[8] = humidity

Actual payload:
obs.air_temperature
obs.relative_humidity

This caused all dashboard values to show blank because the code was reading
array indexes that no longer exist.

Fix:
Switch parsing to the object format returned by the API.

Important fields:

air_temperature
relative_humidity
station_pressure
wind_avg
wind_gust
wind_direction
precip
precip_accum_local_day
lightning_strike_last_distance
lightning_strike_count

Units are already returned in imperial.
No conversions required.
