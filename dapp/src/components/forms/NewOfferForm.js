import React, { useState } from 'react'
import { newOfferFields } from '../../data/FormFields'
import DataService from '../../services/data'
import Input from '../Input'
import Button from '../Button'

function NewOfferForm() {
    const [formData, setFormData] = useState({
        amount: '',
        rate: '',
        details: '',
        type: '',
        duration: '',
    })

    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)

        DataService.createNewOffer(formData)
            .then(() => {
                alert("Offer Created")
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
                <h2 className='font-bold'>New Offer</h2>
                {newOfferFields.map((field, index) => (
                    (index == 0) ? <div key="select">
                        <label className='mr-3' htmlFor="type">Offer Mode: </label>
                        <select
                            type='text'
                            className='w-40 h-10 px-2 shadow-sm shadow-black rounded-lg text-white bg-[#093545]'
                            value={formData[field.name]}
                            onChange={handleChange}
                            required={true}
                            name="type"
                            id="type" {...field}
                        >
                            <option key="none" value="" disabled>--Select Option--</option>
                            <option key="lend" value="lend">Lend</option>
                            <option key="borrow" value="borrow">Borrow</option>
                        </select>
                    </div> :
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

export default NewOfferForm
