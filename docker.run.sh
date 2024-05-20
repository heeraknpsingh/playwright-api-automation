docker build -t playwright-docker . &&
docker run -it playwright-docker:latest npm run test4