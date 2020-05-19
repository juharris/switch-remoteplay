# Server

# Setup
Follow the setup instructions for https://github.com/mart1nro/joycontrol

```bash
pip install -e .
```

# Start
Ideally we'll use server.py to start it but for now:
```bash
# Append '-r <Switch MAC address>' to reconnect to an already paired Switch.
SECRET_KEY='something random-ish' sudo python3 switchremoteplay/run_controller_cli.py PRO_CONTROLLER
```

# Testing
```bash
pip install -e .[test]
pytest
```
