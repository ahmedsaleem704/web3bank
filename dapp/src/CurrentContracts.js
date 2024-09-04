import React, { useEffect, useState } from 'react';
import UserDashboard from './UserDashboard';
import DataService from './services/data';
import ContractCard from './components/ContractCard';
import Spinner from './components/Spinner';
import { useUserContext } from './contexts/userContext';

function CurrentContracts() {
    const [contractsData, setContractsData] = useState([])
    const [loading, setLoading] = useState(false)

    const { userState: { site } } = useUserContext()

    useEffect(() => {
        setLoading(true)
        DataService.getContractsListMine()
            .then((resp) => {
                setContractsData(resp.data.contracts)
            }).finally(() => {
                setLoading(false)
            })
    }, [])

    return <div>
        <UserDashboard selectedNav="all-contracts" />
        <div className='flex flex-col mx-[25%]'>
        <div className="font-bold text-center">My Contracts</div>
            {
                contractsData && contractsData.length ? contractsData.map((contract) => (
                    <ContractCard contract={contract} key={contract._id} />
                )) : <div className='text-center'>
                    {loading ? <Spinner size={10} /> : 'No Contracts Available. Accept an offer to start one.'}
                </div>
            }
        </div>

    </div>
}

export default CurrentContracts;
