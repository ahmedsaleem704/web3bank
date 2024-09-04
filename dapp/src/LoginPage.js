import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginFields } from './data/FormFields'
import Input from './components/Input'
import Heading from './components/Heading'

import AuthService from './services/auth'

const loginFieldsData = loginFields
let fieldsState = {}

function LoginPage({ onEnter }) {
    let navigate = useNavigate()
    const [loginState, setLoginState] = useState(fieldsState)

    loginFieldsData.forEach(field => fieldsState[field.id] = '')

    const handleChange = (e) => {
        setLoginState({ ...loginState, [e.target.id]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const { email, password } = loginState
        AuthService.login(email, password)
            .then(() => {
                // navigate('/dashboard/profile')
                window.location.reload()
            })
            .catch((err) => {
                alert("An error occured. See console for more info")
                console.error(err)
            })

    }

    useEffect(() => {
        onEnter.fn()
    }, [onEnter.depends])

    return <div className="">
        <div className='h-screen flex items-center justify-center bg-neutral-200'>
            <div className="text-[#224957] font-sans font-normal text-center flex flex-col items-center">
                <Heading text="Sign In" />
                <h3 className="text-base mb-9">
                    Login your account to get better experience of our services
                </h3>

                <form
                    className="text-white flex flex-col gap-5"
                    onSubmit={handleSubmit}
                >
                    {loginFieldsData.map((field) =>
                        <Input
                            key={field.id}
                            customClass={'w-80 h-11 bg-[#224957] rounded-lg px-3'}
                            handleChange={handleChange}
                            value={loginState[field.id]}
                            hideLabel={true}
                            {...field}
                        />
                    )}

                    <button
                        className="mt-4 w-52 h-12 shadow-sm shadow-black rounded-lg bg-[#20DF7F] self-center"
                    >
                        Login
                    </button>
                </form>
                <div className="mt-7">
                    <p>
                        Create Your Account &nbsp;
                        <span
                            onClick={() => { navigate('/account/signup') }}
                            className="border-b-[1px] cursor-pointer border-b-slate-800"
                        >
                            SignUp
                        </span>
                    </p>
                </div>
            </div>
        </div>
    </div>
}

export default LoginPage