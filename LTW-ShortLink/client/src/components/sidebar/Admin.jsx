import React from 'react'
import { BsCreditCard2BackFill } from 'react-icons/bs'
import { MdOutlineLink } from 'react-icons/md'
import { FaUserFriends } from 'react-icons/fa'
import { AiOutlineBarChart } from 'react-icons/ai'

const Admin = () => {
  return (
    <ul className='list-none'>
      <li className='m-4'>
        <a
          className='no-underline text-black text-xl font-medium flex items-center hover:no-underline'
          href='/admin/dashboard'
        >
          <AiOutlineBarChart size={24} className='mr-3' />
          Thống kê
        </a>
      </li>
      <li className='m-4'>
        <a
          className='no-underline text-black text-xl font-medium flex items-center hover:no-underline'
          href='/admin/users'
        >
          <FaUserFriends size={24} className='mr-3' />
          Người dùng
        </a>
      </li>
      <li className='m-4'>
        <a
          className='no-underline text-black text-xl font-medium flex items-center hover:no-underline'
          href='/admin/links'
        >
          <MdOutlineLink size={24} className='mr-3' />
          Đường dẫn
        </a>
      </li>
      <li className='m-4'>
        <a
          className='no-underline text-black text-xl font-medium flex items-center hover:no-underline'
          href='/admin/requests'
        >
          <BsCreditCard2BackFill size={24} className='mr-3' />
          Yêu cầu
        </a>
      </li>
    </ul>
  )
}

export default Admin
