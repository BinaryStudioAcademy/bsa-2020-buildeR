FROM node:lts as builder
COPY package.json package-lock.json ./
RUN npm install && mkdir /builder && mv ./node_modules ./builder
WORKDIR /builder
COPY . .
RUN npm run ng build -- --prod

FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /builder/dist/* /usr/share/nginx/html
EXPOSE 80 443
ENTRYPOINT ["nginx", "-g", "daemon off;"]