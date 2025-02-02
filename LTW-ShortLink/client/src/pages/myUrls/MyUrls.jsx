import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/sidebar'
import { Table } from 'antd'
import styles from './style.module.scss'
import { DEFAULT_CURRENT, DEFAULT_PAGE_SIZE } from '../../constants/constant'
import { getAllUrlsByUsername } from '../../api/api'
import { encode, formatDate } from '../../api/helper'

const columns = [
  {
    title: 'STT',
    dataIndex: 'stt',
    key: 'stt',
    render: (text) => <a>{text}</a>
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title'
  },
  {
    title: 'Url',
    dataIndex: 'links',
    key: 'links',
    render: (_, { links }) => links.realLink
  },
  {
    title: 'Short url',
    dataIndex: 'links',
    key: 'links',
    render: (_, { links }) => (
      <a
        href={`${location.origin}/s/${links.shortLink}`}
        target='_blank'
        rel='noopener'
      >
        {`${location.origin}/s/${links.shortLink}`}
      </a>
    )
  },
  {
    title: 'Clicks',
    dataIndex: 'clicks',
    key: 'clicks'
  },
  {
    title: 'Created at',
    key: 'createdAt',
    dataIndex: 'createdAt'
  }
]

const MyUrls = () => {
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState({
    page: DEFAULT_CURRENT,
    per_page: DEFAULT_PAGE_SIZE
  })
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    getAllUrlsByUsername(user.username, { ...pagination }).then((data) => {
      const newData = data?.data?.data?.map((item, index) => {
        const newUrl = {
          stt: index + 1,
          id: item.id,
          links: {
            shortLink: encode(item.id),
            realLink: item.url
          },
          user: item.user?.username,
          title: item.title,
          clicks: item.clicks,
          createdAt: formatDate(item.createdAt),
          affiliate: item.affiliate
        }
        return newUrl
      })

      setData(newData)
    })
  }, [])

  return (
    <div className={classNames('w-screen min-h-screen h-screen flex')}>
      <Sidebar />
      <div className='flex-1  flex items-center justify-center bg-[#f7f5f1]'>
        <div className='w-11/12 min-h-[870px] drop-shadow-2xl bg-white rounded-xl items-start pt-20 px-20'>
          <h2 className='mb-10 text-center text-black font-bold text-4xl'>
            Lịch sử rút gọn
          </h2>
          <Table
            columns={columns}
            dataSource={data}
            bordered={true}
            className={classNames('mx-5', styles.myUrls)}
          />
        </div>
      </div>
    </div>
  )
}

export default MyUrls
