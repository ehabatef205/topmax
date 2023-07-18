FROM node:14.19.3

WORKDIR /pay_topmax_App

COPY package.json .

RUN npm install --force

COPY . .

EXPOSE 7011

CMD ["npm","run","start"]