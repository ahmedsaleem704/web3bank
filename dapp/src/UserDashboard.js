import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from './services/auth';
import { useUserContext } from './contexts/userContext';
import { USER } from './constants/actions';
import Button from './components/Button';

function UserDashboard({ selectedNav = 'my-offers', userName }) {
    let navigate = useNavigate();

    const { userDispatch } = useUserContext()

    const handleLogout = () => {
        AuthService.logout()
            .then(() => {
                userDispatch({ type: USER.LOGOUT })
                navigate('/account/login')
                window.location.reload()
            })
    }

    return <div className='mb-5'>
        <nav className='bg-[#093545] text-white  h-24 flex justify-evenly items-center' >
            <div className={`${selectedNav === 'user-profile' && 'font-bold'} cursor-pointer`} onClick={() => {navigate('/dashboard/profile')}}>
                {userName ? `Hi ${userName}!` : 'Profile'}
            </div>
            <div className={`${selectedNav === 'my-offers' && 'font-bold'} cursor-pointer`} onClick={() => {navigate('/dashboard/offers')}}>
                Offers
            </div>
            <div className={`${selectedNav === 'all-contracts' && 'font-bold'} cursor-pointer`} onClick={() => {navigate('/dashboard/contracts')}}>
                Contracts
            </div>
            <div className={`${selectedNav === 'my-payments' && 'font-bold'} cursor-pointer`} onClick={() => {navigate('/dashboard/payments')}}>
                Payments
            </div>
            <div className={`${selectedNav === 'new-offer' && 'font-bold'} cursor-pointer`} onClick={() => {navigate('/dashboard/create-offer')}}>
                Post New Offer
            </div>
            <Button
                onClick={handleLogout}
                text='Logout'
                color='black'
            />
        </nav>
    </div>
}

export default UserDashboard;