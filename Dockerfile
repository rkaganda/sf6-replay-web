FROM node:latest

WORKDIR /usr/src/sf6_combo_app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN prisma generate

RUN yarn build

EXPOSE 3000

CMD [ "yarn", "start" ]