FROM node:22-bookworm-slim

WORKDIR /app

COPY package*.json ./
COPY .npmrc ./
RUN npm install

COPY static/hello-world/package*.json ./static/hello-world/
RUN cd static/hello-world && npm install

COPY . .

CMD ["npm", "run", "build", "--prefix", "static/hello-world"]