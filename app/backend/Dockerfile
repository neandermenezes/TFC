FROM node:16-alpine AS app_backend

WORKDIR /app/backend

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "start"]