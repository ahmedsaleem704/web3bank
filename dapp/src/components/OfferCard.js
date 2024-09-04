import React, { useEffect, useState } from 'react'
import DataService from '../services/data'
import Button from './Button'

import { useUserContext } from '../contexts/userContext'

import { formatDate } from '../utils'

export default function OfferCard({ offer, select, customCss }) {
    const [loading, setLoading] = useState(false);
    const [isMine, setIsMine] = useState(false)
    const [accepted, setAccepted] = useState(false)
    const [disabled, setDisabled] = useState(false)

    const { userState: { site } } = useUserContext()

    useEffect(() => {
        setIsMine(site._id === offer.offerer._id)
        setDisabled(!/pending/.test(offer.status))
    }, [])

    const handleAcceptance = ({ _id }) => {
        setDisabled(true)
        setLoading(true)
        DataService.acceptOffer({ id: _id })
            .then((paymentObject) => {
                setLoading(false)
                alert("Offer Accepted & Contract Created")
                setAccepted(true)
                select(paymentObject.data)
            })
            .catch((err) => {
                setLoading(false)
                alert("Couldn't accept, error occured. See console for more")
                console.error(err)
                setDisabled(false)
            })
    }

    return (
        <div key={offer._id} className={customCss ? customCss : 'min-w-[500px] font-sans font-normal  space-y-1 p-6 shadow-sm shadow-black rounded-3xl border-[1px] mt-6'}>
            <ul>{isMine ? `You (${offer.offerer.email}) want` : `${offer.offerer.email} wants`} to <b>{offer.type}</b></ul>
            <ul>Offered Amount: {offer.amount} {offer.currency.code}</ul>
            <ul>Interest Rate: {offer.rate}% (annual)</ul>
            <div className='flex flex-col items-end space-y-2'>
                <ul className='w-fit'>Status: {offer.status}</ul>
                {!isMine && <Button
                    disabled={disabled}
                    loading={loading}
                    onClick={() => { handleAcceptance(offer) }}
                    text={accepted ? 'Accepted' : 'Accept'}
                />}
            </div>
            <ul>Details: {offer.details}</ul>
            <ul>OfferID: {offer._id}</ul>
            <div className='flex justify-between'>
                <ul title={offer.created}>Created: {formatDate(offer.created)}</ul>
                {offer.expiry &&
                    <ul>Expires {formatDate(offer.created)}</ul>
                }
                {offer.duration &&
                    <ul>Duration {offer.duration.amount} days</ul>
                }
            </div>
        </div>
    )
}
