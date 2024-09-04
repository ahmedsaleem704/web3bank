import React, { useEffect, useState } from 'react';
import UserDashboard from './UserDashboard';
import DataService from './services/data';
import Spinner from './components/Spinner';
import { useUserContext } from './contexts/userContext';
import PaymentCard from './components/PaymentCard';
import PaymentModal from './components/PaymentModal';

function MyPayments() {
    const { userState: { site } } = useUserContext()
    const [loading, setLoading] = useState(false)
    
    const [payments, setPayments] = useState({pending: [], other: []})
    const [paymentModalOpen, setPaymentModalOpen] = useState(false)
    const [paymentData, setPaymentData] = useState({})

    const isUserInvolved = (lender, borrower) => {
        return site._id === lender._id || site._id === borrower._id
    }

    useEffect(() => {
        setLoading(true)
        DataService.getPaymentsListMine()
            .then((resp) => {
                const pending = resp.data.payments.filter(p => p.status === "pending")
                const other = resp.data.payments.filter(p => p.status !== "pending")
                setPayments({
                    pending, other
                })
            }).finally(() => {
                setLoading(false)
            })
    }, [])

    const handlePayment = (data, mode = 'payment') => {
        setPaymentData(data)
        setPaymentModalOpen(true)
    }

    return <div>
        <UserDashboard selectedNav="my-payments" />
        <PaymentModal
            data={paymentData}
            isOpen={paymentModalOpen}
            setIsOpen={setPaymentData}
        />
        <div className="font-bold text-center">My Payments</div>
        <div className='flex flex-col mx-[25%]'>
            {
                payments && (payments.pending.length || payments.other.length)
                ? <>
                    <div className='my-2'>Pending Payments</div>
                    {payments.pending.map((payment) => <PaymentCard payment={payment} select={handlePayment} key={payment._id} />)}
                    <div className='my-2 pt-3'>Other Payments</div>
                    {payments.other.map((payment) => <PaymentCard payment={payment} select={handlePayment} key={payment._id} />)}
                </>
                : <div className='text-center'>
                    {loading ? <Spinner size={10} /> : 'No Payments Found'}
                </div>
            }
        </div>

    </div>
}

export default MyPayments;
