FROM node:20
WORKDIR /app
RUN corepack enable && corepack prepare yarn@4.9.2 --activate
COPY package.json yarn.lock ./
COPY packages/twenty-server ./packages/twenty-server
RUN yarn install --immutable
RUN yarn build -w twenty-server
WORKDIR /app/packages/twenty-server
CMD ["yarn", "start:prod"]