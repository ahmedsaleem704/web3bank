import { useEffect, useState } from "react"
import DataService from "./services/data"
import UserDashboard from "./UserDashboard"
import { useUserContext } from "./contexts/userContext"
import { USER } from "./constants/actions"
import { formatDate } from "./utils"
import EditProfileDetails from "./components/forms/EditProfileDetails"

function ProfilePage() {
    const [offersData, setoffersData] = useState([])
    const [userData, setUserData] = useState({})
    const { userState: { chain }, userDispatch } = useUserContext()

    useEffect(() => {
        DataService.getCurrentUserDetails()
            .then((response) => {
                userDispatch({ type: USER.SITE_INIT, payload: response.data })

                const { firstName, lastName, _id, verified, ..._user } = response.data
                setUserData({
                    name: `${firstName} ${lastName}`,
                    ...userData,
                    ..._user,
                    id: _id,
                })
            })

        DataService.getOffersListMine()
            .then((response) => {
                setoffersData(response.data.offers)
            })
            .catch((err) => {
                console.error(err)
                alert("There has been an error. See console for more")
            })
    }, [])

    return <div>
        <UserDashboard selectedNav="user-profile" userName={userData.name} />
        <div className="flex flex-col items-center">
            <div className="font-bold">Personal Detail</div>
            <div className="mx-32 w-fit p-9 w-min-[300px] shadow-sm shadow-black rounded-3xl border-[1px] mt-6">
                <div className="mt-1">
                    {Object.keys(userData).map((keyName, k) => {
                        let value = userData[keyName]
                        if (keyName == "walletAddress") {
                            value = `${value} (${chain?.account === value ? 'Connected' : 'Disconnected'})`
                        } else if (keyName === "paymentDetails") {
                            return
                        }
                        return (
                            <div key={k}>
                                <span className="font-bold capitalize">{keyName}: </span>{value}
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className='min-h-fit flex flex-col mx-[25%] min-w-[500px] font-sans font-normal  space-y-1 p-6 shadow-sm shadow-black rounded-3xl border-[1px] mt-6'>
                <EditProfileDetails profile={userData} />
            </div>
            <div className="font-sans font-bold mt-6">Your Lending/Borrowing History</div>
            <div>
                {
                    offersData && offersData.length ? offersData.map((offer) => {
                        const myAction = () => {
                            if (userData.id === offer.offerer._id) {
                                return "offered to"
                            } else if (offer.acceptor && userData.id === offer.acceptor._id) {
                                return "accepted a"
                            }
                        }

                        const offerType = () => {
                            const action = myAction()
                            const resultMap = {
                                "lend": "borrow request",
                                "borrow": "lend"
                            }
                            if (/accepted/.test(action)) {
                                return `${action} ${resultMap[offer.type]}`
                            }
                            return `${action} ${offer.type}`
                        }
                        return <div key={offer._id} className='mx-28 w-[400px] flex flex-col items-center font-sans font-normal space-y-2 p-6 shadow-sm shadow-black rounded-3xl border-[1px] mt-6'>
                            <ul>You {offerType()}</ul>
                            <ul>{offer.amount}{offer.currency.code} at {offer.rate}% interest rate</ul>
                            <ul>Offer Status: {offer.status}</ul>
                            {offer.created && <ul>Created: {formatDate(offer.created)}</ul>}
                            {offer.expiry && <ul>Expiry: {offer.expiry}</ul>}
                        </div>
                    }) : <div className="text-center mt-14">
                        You Have No History Of Lending Money
                    </div>
                }
            </div>
        </div>
    </div>
}

export default ProfilePage
