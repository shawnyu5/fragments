# This file dockerizes the fragments service
FROM node:16.15 AS build

# We default to use port 8080 in our service
# Use /app as our working directory. This will create the directory and enter it.
WORKDIR /app

# Copy the package.json and package-lock.json files into /app
COPY package*.json ./
COPY ./tsconfig.json ./
# Install node dependencies defined in package-lock.json
RUN npm ci

# Copy src to /app/src/
COPY ./src ./src
COPY ./tests/.htpasswd ./tests/.htpasswd

# compile the source code into js
RUN npm run build

FROM node:16.15-alpine AS production

# define meta data about this container
LABEL maintainer="Shawn Yu <hyu126@myseneca.ca"
LABEL description="Fragments node.js microservice"

WORKDIR /app

ENV PORT=8080
# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn
# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

COPY ./package*.json ./
COPY ./tsconfig.json ./
RUN npm ci --omit=dev
COPY ./tests/.htpasswd ./tests/.htpasswd

COPY --from=build /app/build ./build

# CMD [ "ls" ]
CMD ["npm", "start"]

# We run our service on port 8080, and have it accessible on port 8080 from outside the container
EXPOSE 8080
