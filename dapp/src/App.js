import React, { useEffect, useState } from 'react'
import { Route, Routes, BrowserRouter, useNavigate, Navigate } from 'react-router-dom'
import Web3 from 'web3'

import web3BankJson from './contracts/Web3Bank.json'

import CurrentOffers from './CurrentOffers'
import CurrentContracts from './CurrentContracts'
import MyPayments from './MyPayments'
import CreateNewOffer from './CreateNewOffer'

import ProtectedRoute from './ProtectedRoute'
import LoginPage from './LoginPage'
import SignUpPage from './SignUpPage'
import AuthService from './services/auth'
import ProfilePage from './ProfilePage'

import { UserProvider, useUserContext } from './contexts/userContext'
import { USER } from './constants/actions'

const AppContent = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const { userDispatch } = useUserContext()
    const loadBlockchainData = async (artifact) => {
        if (!window.ethereum && !window.web3) {
            return alert("Your browser doesn't support blockchain apps, consider using Metamask!")
        }

        const _provider = Web3.givenProvider || "http://localhost:7545"
        const web3 = new Web3(_provider)

        const [accounts, networkID] = await Promise.all([
            web3.eth.requestAccounts(),
            web3.eth.net.getId(),
        ])

        if (!artifact.networks[networkID]) {
            return alert(`Please check your connection to the blockchain on network ID ${networkID}`)
        }

        let address, contract
        try {
            address = artifact.networks[networkID].address
            contract = new web3.eth.Contract(artifact.abi, address)
        } catch (err) {
            console.error('blockchain data init', err)
        }

        userDispatch({
            type: USER.CHAIN_INIT,
            payload: { web3, accounts, contract, networkID, account: accounts[0] }
        })
    }

    const navigate = useNavigate()
    const redirectUsers = {
        depends: isLoggedIn,
        fn: () => {
            if (isLoggedIn) {
                navigate('/dashboard/profile?m=redirectUsers')
            }
        }
    }

    useEffect(() => {
        setIsLoggedIn(!!AuthService.getCurrentUser())
        loadBlockchainData(web3BankJson)
    }, [])

    return (
        <Routes>
            <Route path="/">
                <Route index path="" element={<LoginPage onEnter={redirectUsers} />} />
                <Route path="account">
                    <Route path="signup" element={<SignUpPage onEnter={redirectUsers} />} />
                    <Route path="login" element={<LoginPage onEnter={redirectUsers} />} />
                </Route>
                <Route element={<ProtectedRoute isLogged={isLoggedIn} />}>
                    <Route path="dashboard">
                        <Route path="offers" element={<CurrentOffers />} />
                        <Route path="contracts" element={<CurrentContracts />} />
                        <Route path="payments" element={<MyPayments />} />
                        <Route path="create-offer" element={<CreateNewOffer />} />
                        <Route path="profile" element={<ProfilePage />} />
                    </Route>
                </Route>
            </Route>
            <Route path="*" element={
                <div>
                    <h1>404</h1>
                    <h2>No Page Found</h2>
                </div>
            } />
        </Routes>
    )
}

function App() {
    return (
        <UserProvider>
            <BrowserRouter>
                <React.StrictMode>
                    <AppContent />
                </React.StrictMode>
            </BrowserRouter>
        </UserProvider>
    );
}

export default App
