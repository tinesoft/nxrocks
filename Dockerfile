FROM node:17-alpine as source
LABEL author="Tine Kondo"
WORKDIR /usr/src/app
COPY package.json yarn.lock ./

FROM source as tester
RUN yarn
COPY . .
RUN yarn run ts-node -P ./tools/tsconfig.tools.json ./tools/patch-nx-project.ts
