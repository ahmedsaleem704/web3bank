const { CURRENCY, TIME } = require("./enum")

// Calculations
const calculateInterest = (principalAmount, annualRate, duration) => {
    const dailyInterestRate = annualRate / 365

    let time = duration.amount
    // if (TIME.DURATION.DAYS === duration.type) {
    //     time = duration.amount
    // }

    const interestEarned = (principalAmount * dailyInterestRate * time) / 100
    const totalPayback = interestEarned + principalAmount

    return [interestEarned, totalPayback]
}

// Exchange Rate
const exchangeRate = {
    [CURRENCY.FIAT.PKR]: {
        [CURRENCY.CRYPTO.ETH]: 0.0002,
    },

    [CURRENCY.FIAT.USD]: {
        [CURRENCY.CRYPTO.ETH]: 0.002,
    },

    [CURRENCY.CRYPTO.ETH]: {
        [CURRENCY.FIAT.PKR]: 5000,
        [CURRENCY.FIAT.USD]: 500,
    }
}

/**
 * converts from one currency to another (fiat/crypto)
 * @param {number} amount money value
 * @param {enum} from currency code (CURENCIES enum)
 * @param {enum} to currency code (CURENCIES enum)
 * @returns {number} converted value in destination currency
 */
const convertCurrencies = (amount, from, to) => {
    if (isNaN(amount)) {
        throw new Error("invalid argument amount: must be a number")
    }

    return amount * exchangeRate[from][to]
}

/**
 * converts crypto currency value to default fiat currency value
 * @param {number} amount crypto value
 * @param {enum} from cypto currency code (CURRENCY enum)
 * @returns {number} converted value in fiat currency
 */
const convertCryptoDefault = (amount, from) => {
    return convertCurrencies(amount, from, CURRENCY.FIAT._DEFAULT)
}

/**
 * converts fiat currency value to default crypto currency value
 * @param {number} amount fiat value
 * @param {enum} from fiat currency code (CURRENCY enum)
 * @returns {number} converted value in crypto currency
 */
const convertFiatDefault = (amount, from) => {
    return convertCurrencies(amount, from, CURRENCY.CRYPTO._DEFAULT)
}

const convertPkrToEth = (amount) => {
    return convertCurrencies(amount, CURRENCY.FIAT.PKR, CURRENCY.CRYPTO.ETH)
}

const convertEthToPkr = (amount) => {
    return convertCurrencies(amount, CURRENCY.CRYPTO.ETH, CURRENCY.FIAT.PKR)
}

module.exports = {
    calculateInterest,

    convertCurrencies,
    convertCryptoDefault,
    convertFiatDefault,

    convertPkrToEth,
    convertEthToPkr,
}
