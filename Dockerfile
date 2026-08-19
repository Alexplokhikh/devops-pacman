FROM node:20.20.2-bookworm-slim

LABEL maintainer="Alex Plokhikh <https://plokhikh.netlify.app/>"

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["npm", "start"]