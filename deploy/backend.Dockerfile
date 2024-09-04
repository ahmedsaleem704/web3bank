# use a base image with Node.js for the image
FROM node:18

# install yarn and truffle
RUN yarn --version

# set working directory for the app
WORKDIR /usr/src/app

# copy the package and lock files
COPY package.json yarn.lock ./

# install the packages
RUN yarn install --silent

# copy the remaining files
COPY ./ ./

# expose necessary ports
EXPOSE 5000

# Start the frontend (dapp) and move to background
CMD ["yarn", "start"]

