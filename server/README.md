# Server

# Setup
```bash
conda create --name switch-remoteplay-server 'python>=3.7'
conda activate switch-remoteplay-server

# Follow the setup instructions for https://github.com/mart1nro/joycontrol

# Now back the setup for this code:
pip install -e .
```

# Start
```bash
SECRET_KEY='something random-ish' python3 switchremoteplay/server.py
```

# Testing
```bash
pip install -e .[test]
pytest
```
