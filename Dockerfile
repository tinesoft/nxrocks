FROM node:17-alpine as source
LABEL author="Tine Kondo"
WORKDIR /usr/src/app
COPY package.json package-lock.json ./

FROM source as builder
RUN npm ci
COPY . .
RUN npx --no-install ts-node -P ./tools/tsconfig.tools.json ./tools/patch-nx-project.ts
RUN npx --no-install nx run-many --target=build --all --parallel

#FROM builder as tester
#COPY . .
#RUN npx --no-install nx run-many --target=test --projects=nx-quarkus --parallel