import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/sidebar'
import { Table } from 'antd'
import styles from './style.module.scss'
import { getAllUrls } from '../../api/api'
import { encode, formatDate } from '../../api/helper'
import { DEFAULT_CURRENT, DEFAULT_PAGE_SIZE } from '../../constants/constant'
import Title from '../../components/title'

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
    render: (_, { links }) => location.origin + '/s/' + links.shortLink
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

const AdminLinks = () => {
  const [data, setData] = useState()
  const [pagination, setPagination] = useState({
    page: DEFAULT_CURRENT,
    per_page: DEFAULT_PAGE_SIZE
  })

  useEffect(() => {
    getAllUrls({ ...pagination }).then((data) => {
      const newUrls = data?.data?.data?.map((url, index) => {
        const newUrl = {
          stt: index + 1,
          id: url.id,
          links: {
            shortLink: encode(url.id),
            realLink: url.url
          },
          user: url.user?.username,
          title: url.title,
          clicks: url.clicks,
          createdAt: formatDate(url.createdAt),
          affiliate: url.affiliate
        }
        return newUrl
      })

      setData(newUrls)
    })
  }, [])

  const getDetail = (record) => {
    window.location.href = `/links/detail/${record.id}`
  }

  return (
    <div className={classNames('w-screen min-h-screen h-screen flex')}>
      <Sidebar />
      <div className='flex-1  flex items-center justify-center bg-[#f7f5f1]'>
        <div className='w-11/12 min-h-[870px] drop-shadow-2xl bg-white rounded-xl items-start pt-20'>
          <Title title={'Đường dẫn'} />
          <Table
            columns={columns}
            dataSource={data}
            bordered={true}
            className={classNames('mx-5', styles.links)}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => getDetail(record)
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default AdminLinks
