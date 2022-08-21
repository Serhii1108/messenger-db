FROM node:lts-alpine3.16

EXPOSE ${PORT}

WORKDIR /home/app/

COPY src ./src
COPY dist ./dist

COPY package*.json tsconfig.json tsconfig.build.json ./

RUN npm ci
RUN npm run build
