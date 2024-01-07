FROM node:19-slim
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install --include=dev
RUN npm ci --production
RUN npm cache clean --force
ENV NODE_ENV="production"
COPY . .
RUN npm run build
CMD [ "npm", "start" ]
