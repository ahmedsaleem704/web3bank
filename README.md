# Web3Bank
Lending &amp; Borrowing using Blockchain

## Docker Deployment
Run Docker Compose to fire up the containers (*Note:* Blockchain lives outside this)
```bash
docker-compose up
```
**OR**, set them up yourselves,
Build the docker images uisng
```bash
docker build -t web3bank-server . -f ./deploy/backend.Dockerfile
docker build -t web3bank-client . -f ./deploy/dapp.Dockerfile
```
Run the app in container
```bash
docker run --rm -p 5000:5000 --name web3bank-server-cntr web3bank-server
docker run --rm -p 3000:3000 -p 8545:8545 --name web3bank-client-cntr web3bank-client
```

## Local Deployment
### Client
```bash
cd dapp
```
```bash
yarn start
```

### Server
```bash
cd backend
```
- Start server with `nodemon`
```bash
yarn dev
```

### Blockchain
1. Download and install [Ganache](https://trufflesuite.com/ganache/). Set up a workspace. ([See QuickStart Guide](https://trufflesuite.com/docs/ganache/quickstart/))
2. Install Truffle
    ```bash
    npm install -g truffle
    ```
3. Build and Deploy Contracts to blockchain
    ```bash
    cd dapp
    truffle build
    truffle migrate
    ```
4. Install Metamask in your browser ([Firefox](https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/))
5. Add local network (Ganache) to Metamask, and add one more more accounts

Now, navigate to [localhost:3000](http://localhost:3000). App is ready to interact with.

## API Endpoints
<details close>
<summary>View Endpoints</summary>

#### Account
- `POST`     `/account/login`     - login, get accessToken
- `POST`     `/account/signup`    - register account
- `GET`      `/account/logout`    - end user session

#### Internal: Users
- `GET`      `/users`             - list all users
- `GET`      `/users/<id>`        - get single user details
- `POST`     `/users/create`      - create new user
- `DELETE`   `/users/<id>`        - delete a user

#### Internal: Offers
- `POST`     `/offers/create`     - create a new offer (auth required)
- `GET`      `/offers/<id>/accept`- accept the offer (auth required)
- `GET`      `/offers/<id>`       - get details of an offer
- `GET`      `/offers/`           - get all offers
- `GET`      `/offers/all`        - get all offers
- `GET`      `/offers/lend`       - get all lend offers
- `GET`      `/offers/borrow`     - get all borrow offers

</details>


## Enviroment Configuration
- Client and Server have separate `.env` files
    - Client `dapp/.env`
    ```
    NODE_ENV=development
    CLIENT_PORT=3000
    ```

    - Server: `backend/.env`
    ```
    APP_VERSION='20230619.05'

    NODE_ENV=development
    SERVER_PORT=5000
    
    DEBUG=backend:*

    DB_URI_ATLAS=<mongodb-url>
    AUTH_SECRET=<auth-secret>
    ```

### Code Quality
- Run `yarn eslint` and fix the errors/warning before commiting

### Idea
[See Here](./idea.md)
