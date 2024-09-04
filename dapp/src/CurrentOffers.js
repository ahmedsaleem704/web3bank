import React, { useEffect, useState } from 'react';
import UserDashboard from './UserDashboard';

import DataService from './services/data';
import OfferCard from './components/OfferCard';
import PaymentModal from './components/PaymentModal';
import Spinner from './components/Spinner';

function CurrentOffers() {
    const [loading, setLoading] = useState(false)

    const [offersData, setOffersData] = useState([])
    const [paymentData, setPaymentData] = useState(null)
    const [paymentModalOpen, setPaymentModalOpen] = useState(false)

    const handlePayment = (paymentObject) => {
        setPaymentData(paymentObject)
    }

    useEffect(() => {
        setLoading(true)
        DataService.getOffersList()
            .then((resp) => {
                setOffersData(resp.data.offers)
            }).finally(() => {
                setLoading(false)
            })
        // // testing
        // setPaymentData({
        //     // "payment": {
        //     //   "amount": {
        //     //     "value": "0.318",
        //     //     "code": "ETH",
        //     //     "type": "crypto"
        //     //   },
        //     //   "recipient": "0x23dA0bE05032511774DEcB55A33b46C736F1050E"
        //     // },
        //     "payment": {
        //         "id": "6489e8ddeabc12d75d7ae157",
        //         "amount": {
        //             "value": 5000,
        //             "type": "fiat",
        //             "code": "PKR"
        //         },
        //         "recipient": {
        //             "title": "Ayyan Ali",
        //             "number": "1295SAMBA182",
        //             "name": "Samba Bank"
        //         }
        //     },
        //     "offer": "6432aa2e7cab1ef0f8d1e12e",
        //     "contract": {
        //       "details": "You wont get a better rate than this",
        //       "_id": "64345a843d039258e0bc8348",
        //     }
        //   })
    }, [])

    useEffect(() => {
        if (paymentData) {
            setPaymentModalOpen(true)
        }
    }, [paymentData])


    return <div>
        <UserDashboard selectedNav="my-offers" />
        <PaymentModal
            isOpen={paymentModalOpen}
            setIsOpen={setPaymentModalOpen}
            data={paymentData}
        />
        <div className="font-bold text-center">Available Offers</div>
        <div className='flex flex-col mx-[25%]'>
            {
                offersData && offersData.length ? offersData.map((offer) => (
                    <OfferCard offer={offer} select={handlePayment} key={offer._id} />
                )) : <div className='text-center'>
                    {loading ? <Spinner size={10} /> : 'Sorry, Currently there are no offers available.'}
                </div>
            }
        </div>
    </div>
}

export default CurrentOffers;