import { formatDistance } from 'date-fns'

const formatDate = (date) => {
    return date ? formatDistance(new Date(date), new Date(), { addSuffix: true }) : 'N/A'
}

const shortAddress = (address, limit = 4) => {
    if (typeof address !== 'string') {
        return ''
    }
    return address.substring(0, limit + 2) + '...' + address.substring(address.length - limit)
}

// A wrapper for localStorage to allow setting Expiry
class appStorage {
    static setItem(key, value, expirationSec = 24 * 60 * 60) {
        const item = {
            value: value,
            expiry: Date.now() + (expirationSec * 1000),
        }
        localStorage.setItem(key, JSON.stringify(item))
    }

    static getItem(key) {
        const item = localStorage.getItem(key)
        if (!item) {
            return null
        }

        const parsedItem = JSON.parse(item)
        const { value, expiry } = parsedItem

        if (expiry && Date.now() > expiry) {
            localStorage.removeItem(key)
            return null // Item has expired, return null or handle accordingly
        }

        return value
    }

    static removeItem(key) {
        return localStorage.removeItem(key)
    }
}

export {
    formatDate,
    shortAddress,
    appStorage
}
