import React, { useEffect, useState } from 'react'
import Modal from './Modal'
import { useUserContext } from '../contexts/userContext';
import Spinner from './Spinner';
import { shortAddress } from '../utils';
import DataService from '../services/data';

function PaymentModal({ data, isOpen, setIsOpen }) {
    const { userState: { chain } } = useUserContext()

    const [loading, setLoading] = useState(false)

    const [desciption, setDesciption] = useState('')
    const [isFiat, setIsFiat] = useState(true)
    useEffect(() => {
        if (!data || !data.payment) {
            return
        }
        const _isFiat = data.payment.amount.type === "fiat"
        const amount = `${data.payment.amount.code} ${data.payment.amount.value}`
        const account = _isFiat ? `${data.payment.recipient.title} (${data.payment.recipient.name})` : shortAddress(data.payment.recipient)
 
        setDesciption(`Pay amount of ${amount} to ${account}`)
        setIsFiat(_isFiat)
    }, [data])

    const handleInitiatePayment = () => {
        setLoading(true)

        const errorHandler = (msg) => (err) => {
            setLoading(false)
            console.error('transaction error', err)
            alert(`${msg} ${err.message}`)
        }
        const successHandler = (receipt) => {
            setLoading(false)
            console.log('transaction receipt', receipt)
            alert('Success!')
            setIsOpen(false)
        }

        if (isFiat) {
            DataService.payPayment(data.payment.id)
                .then(successHandler)
                .catch(errorHandler('Transaction Failed!'))
        } else {
            const _walletAddress = data.payment.recipient
            const _amount = data.payment.amount.value

            const recipient = _walletAddress
            const amount = chain.web3.utils.toWei(String(_amount), 'ether')

            chain.contract.methods.transfer(recipient, amount).send({
                from: chain.account,
                gas: 100000,
                gasPrice: chain.web3.utils.toWei('10', 'gwei'),
                value: amount,
            })
            .then((receipt) => {
                DataService
                    .payPayment(data.payment.id)
                    .then((res) => successHandler(receipt))
                    .catch(errorHandler('transaction succeeded, but confirmation failed'))
            })
            .catch(errorHandler('Transaction Failed!'))
        }
    }


    return (
        <>
            {isOpen && data && data.payment && (
                <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
                    <h3 className="mb-5 text-lg font-normal text-black-500">Payment Required</h3>
                    {/* <svg aria-hidden="true" className="mx-auto mb-4 text-gray-400 w-14 h-14 " fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> */}
                    <div className="mb-5 text-md font-normal text-gray-500">
                        Payment is required to proceed with the contract.
                        Details:
                        <ul className='mt-3 text-xs'>
                            {data.offer && <li>Offer Accepted (ID: {data.offer})</li>}
                            {data.contract && <li>Contract Created (ID: {data.contract})</li>}
                        </ul>
                        <br />
                        <span className='text-sm'>
                            <p>
                                {!isFiat ? 'Clicking the button would initiate payment' : 'Transfer the amount to following account details, and then click the button'}
                            </p>
                            <ul className='mx-auto w-fit text-left'>
                                {!isFiat ? <>
                                    <li><b>Amount</b>: {data.payment.amount.code} {data.payment.amount.value}</li>
                                    <li><b>Wallet Address</b>: {data.payment.recipient}</li>
                                </> : <>
                                    <li><b>Amount</b>: {data.payment.amount.code} {data.payment.amount.value}</li>
                                    <li><b>Account Title</b>: {data.payment.recipient.title}</li>
                                    <li><b>Account Number</b>: {data.payment.recipient.number}</li>
                                    <li><b>Bank Name</b>: {data.payment.recipient.name}</li>
                                </>}
                            </ul>
                        </span>
                    </div>
                    <button
                        type="button"
                        className="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                        onClick={handleInitiatePayment}
                    >
                        {!loading ? desciption : <><Spinner />In Progress</>}
                    </button>
                {/* <button type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10">No, cancel</button> */}
                </Modal>
            )}
        </>
    );
}

export default PaymentModal
