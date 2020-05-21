from distutils.core import setup

from setuptools import find_packages

install_requires = [
	'eventlet',
	# 'joycontrol @ git+ssh://git@github.com/juharris/joycontrol.git@e90499393be4d829015785f7949566d6dc1561ba',
	'flask-socketio',
]

test_deps = [
	'pytest',
]

setup(
	name='switch-remoteplay-server',
	version='0.2.0',
	packages=find_packages(),
	url='https://github.com/juharris/switch-remoteplay',
	license='MIT',
	author="Justin D. Harris",
	author_email='',
	description="Play your Nintendo Switch remotely. Run this on a device that can connect to a Switch.",
	install_requires=install_requires,
	tests_require=test_deps,
	extras_require=dict(
			test=test_deps,
	),
)
