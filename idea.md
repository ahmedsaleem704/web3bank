## Rough Idea
- web3bank - crypto lending

- flexibility to lend/borrow in fiat/cyrpto currency
- interest is always on the crypto currency (or converted rate)
- borrower will pay the interest always

- user story
    - lender/borrower posts an offer
    - offer gets accepted, contract gets created

    - offeror (userA) -is- cyrpto borrower (fiat lender)
        - (acceptor, userB) crypto lender needs to pays immideately to the app
        - userA pays in local currency
        - userB confirms receipt
        - funds released to userA's crypto account
    - offeror (userA) -is- crypto lender (fiat borrower)
        - (acceptor, userB) accepts the offer
        - userA pays crypto to the app
        - userB pays in local local currency
        - userA confirms receipt
        - funds released to userB's crypto account

- server
  - stores offers, contracts and data
  - fiat-crypto conversion rate via an exchange (hard code initally)
  - interacts with the smart contract for funds release

## Models

### Offers
- id
- offerer (=users.id)
- acceptor (=users.id)
- details (text)
- type (lend|borrow)
- amount
- currency {type, code}
- rate (%)
- created (date)
- expiry (date)
- status (pending|approved|accepted|inprogress|completed|expired)

### Contract (Accepted Offer)
- id
- offerId

### Users
- id
- firstName
- lastName
- email
- password
- phone
- role (user|admin)
- permissions
- verfied
