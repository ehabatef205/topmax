FROM node:14.19.3

WORKDIR /back_topmax_App

COPY package.json .

RUN npm install --force

COPY . .

EXPOSE 5000

CMD ["npm","run","start"]