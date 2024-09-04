import React, { useState, useEffect } from 'react'
import { paymentProofFields } from '../../data/FormFields'
import DataService from '../../services/data'
import Input from '../Input'
import Button from '../Button'

const fieldKeys = paymentProofFields.map(f => f.id)
const initialState = Object.fromEntries(fieldKeys.map(k => [k, null]))

function PaymentProof({ select }) {
    const [formData, setFormData] = useState(initialState)
    const [loading, setLoading] = useState(false)


    const setFileInData = (file) => {
        setFormData({ ...formData, image: file })
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        setFileInData(file)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)

        const _formData = new FormData()
        _formData.append('image', formData.image, formData.image.name, formData.image.type)

        DataService.uploadImage(_formData)
            .then((resp) => {
                select(resp.data.id)
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
                {/* <h2 className='font-bold'>Payment Screenshot (Payment Proof)</h2> */}
                {paymentProofFields.map((field, index) => (
                    <Input key={index} handleChange={handleFileChange} {...field} customClass='w-80 h-11 rounded-lg px-3' />
                ))}
                <Button
                    color='#093545'
                    text={loading ? 'Uploading' : 'Upload'}
                    loading={loading}
                />
            </form>
        </div>
    )
}

export default PaymentProof
