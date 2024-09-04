import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signupFields } from './data/FormFields'
import Input from './components/Input'
import Heading from './components/Heading'

import AuthService from './services/auth'

const signUpFieldsData = signupFields
let fieldsState = {}

function SignUpPage({ onEnter }) {
    let navigate = useNavigate()
    const [signUpState, setSignUpState] = useState(fieldsState)

    signUpFieldsData.forEach(field => fieldsState[field.id] = '')

    const handleChange = (e) => {
        setSignUpState({ ...signUpState, [e.target.id]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        AuthService.register(signUpState)
            .then(() => {
                navigate('/dashboard/offers')
            })
            .catch((err) => {
                alert("An error occured. See console for more info")
                console.error(err)
            })
    }

    useEffect(() => {
        onEnter.fn()
    }, [onEnter.depends])

    return <div className='h-screen flex items-center justify-center bg-neutral-200'>
        <div className="text-[#224957] font-sans font-normal text-center flex flex-col items-center">
            <Heading text="Sign Up" />
            <h3 className="text-base mb-9">Create an account to get better experience of our services</h3>
            <form
                className="text-white flex flex-col gap-5"
                onSubmit={handleSubmit}
            >
                <div className="flex justify-between">
                    {signUpFieldsData
                        .filter((field) => /Name/.test(field.id))
                        .map(field =>
                            <Input
                                key={field.id}
                                customClass={'w-36 h-11 bg-[#224957] rounded-lg px-3'}
                                handleChange={handleChange}
                                value={signUpState[field.id]}
                                hideLabel={true}
                                {...field}
                            />
                        )
                    }
                </div>

                {signUpFieldsData
                    .filter((field) => !/Name/.test(field.id))
                    .map(field =>
                        <Input
                            key={field.id}
                            customClass={'w-80 h-11 bg-[#224957] rounded-lg px-3'}
                            handleChange={handleChange}
                            value={signUpState[field.id]}
                            hideLabel={true}
                            {...field}
                        />
                    )
                }

                <button className="mt-4 w-52 h-12 shadow-sm shadow-black rounded-lg bg-[#20DF7F] self-center">Create Account</button>
            </form>
            <div className="mt-7">
                <p>Already Have An Account? <span onClick={() => {
                    navigate('/account/login')
                }} className="border-b-[1px] cursor-pointer border-b-slate-800">Sign In</span></p>
            </div>
        </div>
    </div>
}

export default SignUpPage