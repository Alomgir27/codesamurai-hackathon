# syntax=docker/dockerfile:1
FROM node:18.19.0-bookworm-slim

WORKDIR /app

COPY . .

RUN bash -c "npm install"

EXPOSE 3000

RUN bash -c "npm run clean"

CMD ["npm", "start"]
