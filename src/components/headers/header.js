import React from 'react'

const header = ({title="Home"}) => {
  return (
    <div className='default-header'>
        <p className="default-header-title">{title}</p>
    </div>
  )
}

export default header