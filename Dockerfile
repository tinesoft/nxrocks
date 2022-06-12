FROM node:17-alpine as source
LABEL author="Tine Kondo"
WORKDIR /usr/src/app
COPY package.json yarn.lock ./

FROM source as builder
RUN yarn
COPY . .
RUN yarn ts-node -P ./tools/tsconfig.tools.json ./tools/patch-nx-project.ts
#RUN yarn nx run-many --target=build --all --parallel

FROM builder as tester
COPY  . .
VOLUME ./tmp-e2e:./tmp
#RUN yarn nx e2e nx-spring-boot-e2e
#RUN yarn nx run-many --target=test --projects=nx-quarkus --para 