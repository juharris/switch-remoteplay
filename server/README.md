# Server

# Setup
```bash
conda create --name switch-remoteplay-server 'python>=3.7'
conda activate switch-remoteplay-server
pip install -e .

```

# Testing
```bash
pip install -e .[test]
pytest
```