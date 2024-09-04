import React from 'react'
import Spinner from './Spinner'

function Button({ disabled, loading, onClick, text, color, ...props }) {
    if (!color) {
        color = '#20DF7F'
    }
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            // className={`text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2`}
            className={`w-28 h-8 shadow-sm shadow-black rounded-lg text-white ${disabled ? 'bg-gray-500' : `bg-[${color}]`}`}
            {...props}
        >
            {loading && <Spinner color={color} />}
            {text}
        </button>
    )
}

export default Button
