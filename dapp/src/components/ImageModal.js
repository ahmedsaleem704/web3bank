import React, { useEffect, useState } from 'react'
import Modal from './Modal'
import Spinner from './Spinner';
import DataService from '../services/data';
import PaymentProof from './forms/PaymentProof';
import Button from './Button';

function ImageModal({ data, isOpen, setIsOpen }) {
    
    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState(null)
    const [viewOnly, setViewOnly] = useState(false)
    const [imageUrl, setImageUrl] = useState(null)

    useEffect(() => {
        if (image) {
            DataService
                .getImage(image)
                .then((resp) => {
                    setImageUrl(resp.data)
                })
        }
    }, [image])

    useEffect(() => {
        if (data && data.screenshot) {
            setViewOnly(true)
            setImage(data.screenshot)
        }
    }, [data])

    const handleAttachment = (e) => {
        e.preventDefault()
        setLoading(true)

        DataService
            .provePayment(data._id, { imageId: image })
            .then((resp) => {
                alert("proof attached succesfuly")
                setLoading(false)
                setIsOpen(false)
            })
            .catch((err) => {
                alert("couldnot attach proof, please try again")
                console.error(err)
            })
    }

    return (
        <>
            {isOpen && (
                <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
                    <h3 className="mb-5 text-lg font-normal text-black-500">Payment Proof (Screenshot)</h3>
                    {!image
                    ? <PaymentProof select={setImage}/>
                    : <>
                        <div className="h-0 overflow-hidden pb-[50%] relative max-h-[300px] max-w-[600px]">
                            <img className="absolute top-0 left-0 w-full h-full object-contain" src={imageUrl} alt="Image" />
                        </div>

                        {!viewOnly && <>
                            <p>Image upload successfuly. Press the button below to submit</p>
                            <Button
                                onClick={handleAttachment}
                                text={!loading ? 'Submit' : <><Spinner />Submitting</>}
                                className='text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2 mt-5'
                            />
                        </>}
                    </>}

                </Modal>
            )}
        </>
    )
}

export default ImageModal
