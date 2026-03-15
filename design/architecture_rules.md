
# Dashboard Architecture Rule

The project must follow a strict rule:

Fix ONE subsystem at a time.

Subsystem order:

1. Tempest current conditions
2. Forecast API
3. Alert system
4. Severe weather modules
5. Rotation engine

Mixing multiple subsystems caused repeated regressions.
