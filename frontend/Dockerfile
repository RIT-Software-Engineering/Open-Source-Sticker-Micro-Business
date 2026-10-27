ARG NODE_VERSION=24.14.0-alpine
FROM node:${NODE_VERSION} AS dev
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN chown -R node:node /app
USER node
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]