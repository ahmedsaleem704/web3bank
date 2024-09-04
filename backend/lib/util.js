// Filters
const userBasic = ["firstName", "lastName", "email", "_id"]
const userPayment = ["walletAddress", "paymentDetails", ...userBasic]
const offerContract = ["offerer", "acceptor", "rate", "amount", "created", "_id"]

const _filters = {
    userBasic,
    userPayment,
    offerContract
}

const filters = Object.keys(_filters).reduce((obj, key) => {
    obj[key] = _filters[key].join(" ")
    return obj
}, {})

// UTILITY Functions
function deepFreeze(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    Object.freeze(obj);

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            deepFreeze(obj[key]);
        }
    }

    return obj;
}

// handle both types, either a reference Id or expanded object with _id
const getId = (obj) => {
    if (typeof obj === 'object' && obj !== null && obj.hasOwnProperty('_id')) {
        return obj._id || obj.id
    } else {
        return obj // plan Id
    }
}

const isEqualId = (id1, id2) => {
    return getId(id1).toString() === getId(id2).toString()
}

// remove empty fields from form data
const filterFormData = (formData) => {
    return Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== '')
    )
}

// convert empty enries to some value (for e.g. NULL)
const convertEntriesEmptyTo = (object, newValue = null) => {
    return Object.fromEntries(
        Object.entries(object).map(([k, v]) => ([k, v === '' ? newValue : v]))
    )
}

// all of the provided fields must be present in the object
const checkFieldsExistence = (obj, fields) => {
    return fields.every(field => field in obj)
}

// all of the provided fields must be absent from the object
const checkFieldsAbsence = (obj, fields) => {
    return !fields.some(field => field in obj)
}

// only allowed fields exist in the object
const containsAllowedFieldsOnly = (obj, allowedFields = []) => {
    const keys = Object.keys(obj)
    return keys.every(key => allowedFields.includes(key))
}

// collection sorting function, that will first sort by an alphabetic property
// (ascending), and then a date property (descending) 
const collectionSortFnTypeA = (alphabeticProp, dateProp) => (a, b) => {
    if (a[alphabeticProp] !== b[alphabeticProp]) {
        return a[alphabeticProp].localeCompare(b[alphabeticProp])
    } else {
        return (new Date(b[dateProp])) - (new Date(a[dateProp]))
    }
}

module.exports = {
    deepFreeze,
    getId,
    isEqualId,
    filterFormData,

    checkFieldsExistence,
    checkFieldsAbsence,
    containsAllowedFieldsOnly,

    collectionSortFnTypeA,

    filters,
}