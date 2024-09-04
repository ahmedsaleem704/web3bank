const { deepFreeze } = require("./util")

//
const USER = {
    ROLE: {
        USER: "user",
        ADMIN: "admin",
    }
}

//
const OFFER = {
    STATUS: {
        PENDING: "pending",
        APPROVED: "approved",
        ACCEPTED: "accepted",
        CONVERTED: "converted", // to contract
        REJECTED: "rejected",
        EXPIRED: "expired",
    },
    TYPE: {
        LEND: "lend",
        BORROW: "borrow",
    }
}

OFFER.STATUS._DEFAULT = OFFER.STATUS.PENDING

//
const CONTRACT = {
    STATUS: {
        STARTED: "started",
        IN_EFFECT: "ineffect",
        MATURED: "matured",
        ENDED: "ended",
    }
}

CONTRACT.STATUS._DEFAULT = CONTRACT.STATUS.STARTED

//
const PAYMENT = {
    STATUS: {
        PENDING: "pending",
        OPEN: "open",
        FAILED: "failed",
        PAST_DUE: "past-due",
        COMPLETED: "completed",
        CONFIRMED: "confirmed",
    }
}

PAYMENT.STATUS._DEFAULT = PAYMENT.STATUS.PENDING

//
const CURRENCY = {
    TYPE: {
        FIAT: "fiat",
        CRYPTO: "crypto"
    },

    FIAT: {
        PKR: "PKR",
        USD: "USD",
    },

    CRYPTO: {
        ETH: "ETH",
    }
}

CURRENCY.FIAT._DEFAULT = CURRENCY.FIAT.PKR
CURRENCY.CRYPTO._DEFAULT = CURRENCY.CRYPTO.ETH

//
const EVENTS = {
    PAYMENT: {
        PAY: "pay",
        INITIATE: "initiate",
        CONFIRM: "confirm",
        ATTACH_PROOF: "attach-proof",
    }
}

//
const TIME = {
    DURATION: {
        DAYS: "days",
        MONTHS: "months",
        YEARS: "years"
    }
}

TIME.DURATION._DEFAULT = TIME.DURATION.DAYS

//
for (const obj of [USER, OFFER, CONTRACT, CURRENCY]) {
    deepFreeze(obj)
}

// helper functions
const isValidEnum = (path, value) => {
    return Object.values(path).includes(value)
}


module.exports = {
    USER,
    OFFER,
    CONTRACT,
    PAYMENT,
    CURRENCY,

    EVENTS,
    TIME,

    isValidEnum,
}
