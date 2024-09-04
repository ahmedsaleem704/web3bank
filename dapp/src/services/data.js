import { postReq, getReq } from "./common"
import AuthService from "./auth"

// Uesrs
const getCurrentUserDetails = async () => {
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser) {
        return
    }
    return getReq(`/users/${currentUser.id}`)
}

const updateCurrentUserDetails = async (data) => {
    return postReq('/users/update', data)
}

// Offers
const getOffersList = async () => {
    return getReq('/offers/list')
}

const getOffersListMine = async () => {
    return getReq(`/offers/list/user`)
}

const getOffersByType = async (type) => {
    return getReq(`/offers/list/${type}`)
}

const createNewOffer = async ({ rate, amount, type, details, duration }) => {
    return postReq('/offers/create', { rate, amount, type, details, duration })
}

const acceptOffer = async ({ id }) => { // and convert to contract
    return getReq(`/offers/${id}/convert`)
}

// Contracts
const getContractsList = async () => {
    return getReq('/contracts/list')
}

const getContractsListMine = async () => {
    return getReq('/contracts/list/user')
}

// Payments
const getPaymentsListMine = async () => {
    return getReq('/payments/list/user')
}

const initPayment = async (id, data) => {
    return postReq(`/payments/pay/${id}`, { ...data, action: "initiate" })
}

const payPayment = async (id, data) => {
    return postReq(`/payments/pay/${id}`, { ...data, action: "pay" })
}

const confirmPayment = async (id, data) => {
    return postReq(`/payments/pay/${id}`, { ...data, action: "confirm" })
}

const provePayment = async (id, data) => {
    return postReq(`/payments/pay/${id}`, { ...data, action: "attach-proof" })
}

// Images
const uploadImage = async (data) => {
    return postReq('/images/upload', data)
}

const getImage = async (id) => {
    if (!id) {
        return
    }
    return getReq(`/images/${id}`)
}

const DataService = {
    getCurrentUserDetails,
    updateCurrentUserDetails,

    getOffersList,
    getOffersListMine,
    getOffersByType,
    createNewOffer,
    acceptOffer,

    getContractsList,
    getContractsListMine,

    getPaymentsListMine,
    initPayment,
    payPayment,
    confirmPayment,
    provePayment,

    uploadImage,
    getImage,
}

export default DataService
