import React from 'react'
import { BsHouseFill } from 'react-icons/bs'
import { MdLinkOff, MdOutlineLink } from 'react-icons/md'
import { AiOutlineLineChart } from 'react-icons/ai'
import { FaWallet } from 'react-icons/fa'
import { BiMoneyWithdraw } from 'react-icons/bi'

const User = () => {
  return (
    <ul className='list-none'>
      <li className='m-4'>
        <a
          href='/dashboard'
          className='no-underline text-black text-xl font-medium flex items-center hover:no-underline'
        >
          <BsHouseFill size={24} className='mr-3' />
          Rút gọn link
        </a>
      </li>
      <li className='m-4'>
        <a
          href='/my-urls'
          className='no-underline text-black text-xl font-medium flex items-center hover:no-underline'
        >
          <MdOutlineLink size={24} className='mr-3' />
          Lịch sử rút gọn
        </a>
      </li>
      <li className='m-4'>
        <a
          href='/link-affiliate'
          className='no-underline text-black text-xl font-medium flex items-center hover:no-underline'
        >
          <MdLinkOff size={24} className='mr-3' />
          Tiếp thị liên kết
        </a>
      </li>
      <li className='m-4'>
        <a
          href='/deposit'
          className='no-underline text-black text-xl font-medium flex items-center hover:no-underline'
        >
          <BiMoneyWithdraw size={24} className='mr-3' />
          Yêu cầu nạp/rút tiền
        </a>
      </li>
    </ul>
  )
}

export default User
