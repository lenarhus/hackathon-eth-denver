FROM node

WORKDIR /app

COPY . .

RUN rm -rf node_modules/
RUN npm update
RUN export NODE_PATH=node modules
RUN npm i

ENV BOT_TOKEN=789513127:AAGbzb_u4vOURg8w6tQuZvUE9bJkJuGTdoA
ENV URL=54.82.112.107:27017
ENV LOGIN=admin
ENV PASSWORD=denverButton
ENV DB=denver
ENV INFURA_TOKEN=1u84gV2YFYHHTTnh8uVl
ENV REDIS_HOST=172.17.0.1

EXPOSE 3000
EXPOSE 6379
EXPOSE 27017
EXPOSE 8545

ENTRYPOINT ["node", "app.js"]


