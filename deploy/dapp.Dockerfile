# use a base image with Node.js for the image
FROM node:18

# install yarn and truffle
RUN yarn --version
RUN npm install -g truffle

# set working directory for the app
WORKDIR /usr/src/app

# copy the package and lock files
COPY package.json yarn.lock ./

# install the packages
RUN yarn install --silent

# copy the remaining backend and frontend files
COPY ./ ./

# expose necessary ports
EXPOSE 3000
# Ganache RPC port
EXPOSE 8545 

# Start the frontend (dapp) and move to background
CMD ["yarn", "start"]
