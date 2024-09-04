import React, { useState, useEffect } from 'react'
import { editProfileFields } from '../../data/FormFields'
import DataService from '../../services/data'
import Input from '../Input'
import Button from '../Button'


const fieldKeys = editProfileFields.map(f => f.id)
const initialState = Object.fromEntries(fieldKeys.map(k => [k, '']))

function EditProfileDetails({ profile }) {
    const [formData, setFormData] = useState(initialState)

    const [loading, setLoading] = useState(false)

    const setFieldInData = (key, value) => {
        setFormData({ ...formData, [key]: value })
    }

    useEffect(() => {
        if (!profile) {
            return
        }

        let updateData = {}
        for (const field of fieldKeys) {
            let value

            if (/bank/.test(field) && profile.paymentDetails) {
                value = profile.paymentDetails.bankAccount[field.split('bank')[1].toLowerCase()]
            } else if (profile[field] !== undefined) {
                value = profile[field]
            }

            updateData = {...updateData, [field]: value}
        }

        setFormData(updateData)
    }, [profile])

    const handleChange = (e) => {
        setFieldInData(e.target.name, e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)

        const sendFormData = Object.fromEntries(
            Object.entries(formData).filter(([k, v]) => profile[k] !== v)
        )

        if (!Object.keys(sendFormData).length) {
            setTimeout(() => setLoading(false), 500)
            return true
        }

        DataService.updateCurrentUserDetails(sendFormData)
            .then(() => {
                alert("Details updated successfuly")
            })
            .catch((err) => {
                alert("There has been an error. See console for more info")
                console.error(err)
            }).finally(() => {
                setLoading(false)
            })

        return true
    }

    return (
        <div>
            <form className='flex flex-col items-center space-y-4' onSubmit={handleSubmit}>
                <h2 className='font-bold'>Edit Profile Details</h2>
                {editProfileFields.map((field, index) => (
                    <Input key={index} value={formData[field.name]} handleChange={handleChange} {...field} />
                ))}
                <Button
                    color='#093545'
                    text='Submit'
                    loading={loading}
                />
            </form>
        </div>
    )
}

export default EditProfileDetails
