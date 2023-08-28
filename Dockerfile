FROM node:16.14.0-alpine

WORKDIR /app
COPY api/package.json ./

RUN apk --no-cache add nodejs yarn --repository=http://dl-cdn.alpinelinux.org/alpine/edge/community
RUN yarn install --production

COPY api ./

RUN yarn add -D typescript tscpaths
RUN yarn build

ENV NODE_ENV production
ENV PORT 3000

EXPOSE 3000

CMD ["yarn","start"]