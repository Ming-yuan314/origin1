FROM nginx:alpine
MAINTAINER Champion Jockey Club

RUN ln -sf /dev/stdout /var/log/nginx/access.log
RUN ln -sf /dev/stderr /var/log/nginx/error.log

RUN mkdir -p /app/web/luckywins-interface/

COPY ./dist /app/web/luckywins-interface/

COPY ./nginx.conf /etc/nginx/nginx.conf

RUN chmod -R 777 /app/web/luckywins-interface/

EXPOSE 443 80

CMD sh -c "exec nginx -g 'daemon off;'"
