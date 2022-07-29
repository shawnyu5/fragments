FROM shawnyu5/fragments:latest

COPY ./tests/.htpasswd ./tests/.htpasswd
ENV PORT=8080
ENV NODE_ENV=production
ENV PRODUCTION=false
ENV HTPASSWD_FILE=./tests/.htpasswd

CMD ["npm", "start"]

EXPOSE 8080
