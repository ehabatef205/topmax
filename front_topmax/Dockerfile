FROM node:14.19.3

WORKDIR /React_front_topmax

COPY package.json .

RUN npm install --force

COPY . .

EXPOSE 4000

CMD ["npm","run","start"]