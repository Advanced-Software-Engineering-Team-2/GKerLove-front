FROM nginx

RUN mkdir -p /home/gkerlove-front

WORKDIR /home/gkerlove-front

COPY dist /home/gkerlove-front

COPY nginx.conf /etc/nginx/nginx.conf