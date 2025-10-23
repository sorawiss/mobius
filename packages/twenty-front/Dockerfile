FROM node:20
WORKDIR /app
RUN corepack enable && corepack prepare yarn@4.9.2 --activate
COPY package.json yarn.lock ./
COPY packages/twenty-front ./packages/twenty-front
RUN yarn install --immutable
RUN yarn build -w twenty-front
WORKDIR /app/packages/twenty-front
CMD ["yarn", "start:prod"]