# This file dockerizes the fragments service

# Use node version 16.13.2
FROM node:16.13.2

# define meta data about this container
LABEL maintainer="Shawn Yu <hyu126@myseneca.ca"
LABEL description="Fragments node.js microservice"

# We default to use port 8080 in our service
ENV PORT=8080

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Use /app as our working directory. This will create the directory and enter it.
WORKDIR /app

# Copy the package.json and package-lock.json files into /app
COPY package*.json ./

# Install node dependencies defined in package-lock.json
RUN npm install

# Copy src to /app/src/
COPY ./src ./src

# copy over enviroment.ts
COPY ./enviroments/ ./enviroments/

# Start the container by running our server
CMD npm start

# We run our service on port 8080, and have it accessible on port 8080 from outside the container
EXPOSE 8080
