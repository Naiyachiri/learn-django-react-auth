# pull official base image
FROM node:18-slim

# set working directory
WORKDIR /usr/local/frontend

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/local/frontend/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json .
COPY package-lock.json .
RUN npm ci

# start app
CMD ["vite", "--host"]
