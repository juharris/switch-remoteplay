# Client
This client runs as a website and communicates with the service.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Docker Setup
```bash
docker run --rm -d -p 5000:5000 --name switch-remoteplay-client juharris/switch-remoteplay-client:latest
```

## Dev Setup
Development setup:
```bash
yarn install
yarn start
```
jubuntu.eastus.cloudapp.azure.com
### Building the Container
This is mainly if you need to edit the code, otherwise you can use the already published version.
```bash
docker build -t switch-remoteplay-client .
```

To run that container:
```bash
docker run --rm -d -p 5000:5000 --name switch-remoteplay-client switch-remoteplay-client:latest
```

#### Updateing the Public Image
You will need permission to push a new image to Docker Hub.
```
docker login
docker tag switch-remoteplay-client juharris/switch-remoteplay-client:latest
docker push juharris/switch-remoteplay-client:latest
```

## Linting
Run `yarn lint` to check for style issues in the code.

Run `yarn lint-fix` to automaticly correct some style issues in the code.



## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
