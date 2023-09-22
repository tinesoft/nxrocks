FROM node:17-alpine AS source
LABEL author="Tine Kondo"
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml ./

FROM source AS builder
RUN pnpm
COPY . .
RUN pnpm ts-node -P ./tools/tsconfig.tools.json ./tools/patch-nx-project.ts
#RUN pnpm nx run-many --target=build --all --parallel

FROM builder AS tester
COPY  . .
VOLUME ./tmp-e2e:./tmp
#RUN pnpm nx e2e nx-spring-boot-e2e
#RUN pnpm nx run-many --target=test --projects=nx-quarkus --para 