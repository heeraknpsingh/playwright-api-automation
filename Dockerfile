FROM node:16
FROM mcr.microsoft.com/playwright:focal
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/
COPY tests/ /app/tests/
COPY .env /app/
COPY playwright.config.ts /app/
COPY global_setup.ts /app/
COPY global_teardown.ts /app/
COPY test-options.ts /app/
COPY .auth/ /app/.auth/
COPY test-data/ /app/test-data/
RUN apt-get update && apt-get -y install libnss3 libatk-bridge2.0-0 libdrm-dev libxkbcommon-dev libgbm-dev libasound-dev libatspi2.0-0 libxshmfence-dev
RUN npm install