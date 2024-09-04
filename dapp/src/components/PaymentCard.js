import React, { useEffect, useState } from 'react'
import DataService from '../services/data'
import Button from './Button'
import { useUserContext } from '../contexts/userContext'
import { formatDate, shortAddress } from '../utils'
import ImageModal from './ImageModal'

export default function PaymentCard({ payment, select, customCss }) {
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false)
    
    const { userState: { site } } = useUserContext()
    
    const [pending, setPending] = useState(false)
    const [isSender, setIsSender] = useState(false)
    const [payDescription, setPayDescription] = useState('')
    const [payProofModalOpen, setPayProofModalOpen] = useState(false)

    useEffect(() => {
        const isPending = /pending|open/.test(payment.status)
        setPending(isPending)

        const isSender = site._id === payment.sender._id
        setIsSender(isSender)
        const amount = `${payment.amount.code} ${payment.amount.value}`

        let action = isSender ? 'paid' : 'received'
        if (isPending) {
            action = `have to ${isSender ? 'pay' : 'receive'}`
        }

        setPayDescription(`You ${action} ${amount} ${isSender ? 'to' : 'from'} ${isSender ? payment.recipient.email : payment.sender.email}`)
    }, [payment])

    const handlePaymentAttempt = () => {
        setDisabled(true)
        setLoading(true)

        DataService
            .initPayment(payment._id)
            .then((result) => {
                select(result.data.details)
            })
            .catch((err) => {
                console.error(err)
                alert('Sorry couldn\'t initiate payment, check console for more')
            })

        setLoading(false)
    }

    const handleConfirmation = () => {
        setDisabled(true)
        setLoading(true)

        DataService.confirmPayment(payment._id)
        .then(() => {
            alert('success!')
        })
        .catch((err) => {
            alert("Couldn't complete the request, see console for more")
            console.error(err)
            setDisabled(false)
        })

        setLoading(false)
    }

    return (
        <div className={customCss ? customCss : 'min-w-[500px] font-sans font-normal  space-y-1 p-6 shadow-sm shadow-black rounded-3xl border-[1px] mt-6'}>
            <ImageModal
                data={payment}
                isOpen={payProofModalOpen}
                setIsOpen={setPayProofModalOpen}
            />
            <ul>{payDescription}{pending && ' (Pending)'}</ul>

            <ul><b>Sender:</b> {`${payment.sender.email} (${shortAddress(payment.sender.walletAddress)})`}</ul>
            <ul><b>Recipient:</b> {`${payment.recipient.email} (${shortAddress(payment.recipient.walletAddress)})`}</ul>
            <div className='flex flex-col items-end space-y-2'>
                <ul className='w-fit'>Status: {payment.status}</ul>
                {isSender && <Button
                    disabled={!pending || disabled}
                    loading={loading}
                    onClick={handlePaymentAttempt}
                    text={pending ? (loading ? 'Paying' : 'Pay') : 'Paid'}
                />}
                {!isSender && <Button
                    disabled={payment.status !== "completed" || disabled}
                    loading={loading}
                    onClick={handleConfirmation}
                    text={payment.status === "confirmed" ? 'Confirmed' : (loading ? 'Confirming' : 'Confirm')}
                />}
                {(isSender || (!isSender && payment.screenshot)) && <Button
                    disabled={false}
                    loading={loading}
                    onClick={() => setPayProofModalOpen(true)}
                    text={'Proof'}
                />}
            </div>
            <ul>Contract ID: {payment.contract._id}</ul>
            <div className='flex justify-between'>
                <ul title={payment.created}>Initiated {formatDate(payment.created)}</ul>
                {payment.completed &&
                    <ul>Completed: {formatDate(payment.completed)}</ul>
                }
            </div>
        </div>
    )
}
