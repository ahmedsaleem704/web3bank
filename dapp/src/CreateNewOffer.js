import React, { useState } from 'react';
import NewOfferForm from './components/forms/NewOfferForm';
import UserDashboard from './UserDashboard';

function CreateNewOffer() {
    return <div >
        <UserDashboard selectedNav='new-offer'/>
        <div className='min-h-fit flex flex-col mx-[25%] min-w-[500px] font-sans font-normal  space-y-1 p-6 shadow-sm shadow-black rounded-3xl border-[1px] mt-6'>
            <NewOfferForm />
        </div>

    </div>
}

export default CreateNewOffer;