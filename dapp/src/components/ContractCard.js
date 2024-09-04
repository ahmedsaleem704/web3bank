import React, { useEffect, useState } from 'react'
import DataService from '../services/data'
import { formatDate } from '../utils'

export default function ContractCard({ contract, customCss }) {
    const [loading, setLoading] = useState(false);
    const [accepted, setAccepted] = useState(false)
    const [disabled, setDisabled] = useState(false)

    useEffect(() => {
        setDisabled(!/pending/.test(contract.status))
    }, [])

    return (
        <div key={contract._id} className={customCss ? customCss : 'min-w-[500px] font-sans font-normal  space-y-1 p-6 shadow-sm shadow-black rounded-3xl border-[1px] mt-6'}>
            <div className='flex justify-between'>
                <ul>Lender: {contract.lender.email}</ul>
                <ul>Borrower: {contract.borrower.email}</ul>
            </div>
            <div className='flex justify-between'>
                <ul>Amount: {contract.amount.fiat.value} {contract.amount.fiat.currencyCode} ({contract.amount.crypto.value} {contract.amount.crypto.currencyCode})</ul>
                <ul>Interest Rate: {contract.rate}% / month</ul>
            </div>
            <div className='flex flex-col items-end space-y-2'>
                <ul className='w-fit'>Status: {contract.status}</ul>
            </div>
            <ul>Details: {contract.details}</ul>
            <ul>Contract ID: {contract._id}</ul>
            <ul>Offer ID: {contract.offer._id}</ul>
            <div className='flex justify-between'>
                <ul title={contract.created}>Created: {formatDate(contract.created)}</ul>
                {/* <ul>Started: {formatDate(contract.started)}</ul> */}
                {contract.expiry &&
                    <ul>Expires {formatDate(contract.expiry)}</ul>
                }
                {contract.endDate &&
                    <ul>Completes {formatDate(contract.endDate)}</ul>
                }
            </div>
        </div>
    )
}
