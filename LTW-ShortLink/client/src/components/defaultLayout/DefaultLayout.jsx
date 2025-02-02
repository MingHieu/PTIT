import React from 'react'

const DefaultLayout = ({ children }) => {
  return (
    <div className={classNames('w-screen min-h-screen h-screen flex')}>
      <Sidebar />
      <div className='flex-1  flex items-center justify-center bg-[#f7f5f1]'>
        <div className='w-11/12 min-h-[870px] drop-shadow-2xl bg-white rounded-xl items-start pt-20'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default DefaultLayout
