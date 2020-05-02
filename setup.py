from distutils.core import setup

from setuptools import find_packages

install_requires = [
  
]

test_deps = [
    'pytest',
]

setup(
    name='switch-remoteplay',
    version='0.1.0',
    packages=find_packages(),
    url='https://github.com/juharris/switch-remoteplay',
    license='MIT',
    author="Justin D. Harris",
    author_email='',
    description="Play your Nintendo Switch remotely.",
    install_requires=install_requires,
    tests_require=test_deps,
    extras_require=dict(
        test=test_deps,
    ),
)
