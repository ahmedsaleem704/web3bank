const { User } = require("../models")
const authLib = require("./auth")
const { USER } = require("./enum")
const { containsAllowedFieldsOnly } = require("./util")

const create = async ({ firstName, lastName, email, phone, password, address, walletAddress, cnic }) => {
    const newUser = new User({
        firstName,
        lastName,
        role: USER.ROLE.USER,
        email,
        phone,
        address,
        walletAddress,
        cnic,
        permissions: ['default'],
        password: await authLib.passwordEncrypt(password),
    })

    return newUser.save()
}

const getUserInfo = async ({ id, email }, all = false, strict = false, lean = true) => {
    const user = await User
        .findOne({
            ...(id && { _id: id }),
            ...(email && { email: email }),
        })
        .select(!all ? '-password -__v' : null)
        .lean(lean)
    if (strict && !user) {
        throw new Error(`user with id ${userId} does not exist`)
    }

    return user
}

const updateUserFields = async (userId, data) => {
    const user = await getUserInfo({ id: userId }, false, true, false)

    if (!containsAllowedFieldsOnly(data, ['phone', 'paymentDetails'])) {
        throw new Error(`cannot change restricted fields`)
    }

    Object.assign(user, data)
    return user.save()
}

const authenticateUser = async (email, password) => {
    const user = await getUserInfo({ email }, true)

    if (!user) {
        throw new Error("account doesn't exist")
    }

    if (!(await authLib.passwordValidate(password, user.password))) {
        throw new Error("invalid password")
    }

    const token = await authLib.getSignedAuthToken(user)

    return {
        user: {
            email: user.email,
            id: user._id,
            role: user.role
        },
        accessToken: token
    }
}

module.exports = {
    create,
    getUserInfo,
    updateUserFields,
    authenticateUser,
}
