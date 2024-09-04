import React from 'react'

const Heading = ({text}) => {
  return (
    <div>
        <h1 className="text-6xl font-semibold leading-[5rem] mb-3">
            {text}
        </h1>
    </div>
  )
}

export default Heading
