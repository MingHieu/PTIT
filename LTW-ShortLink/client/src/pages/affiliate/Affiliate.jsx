import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/sidebar'
import { Button, Table, Tag } from 'antd'
import Title from '../../components/title'
import {
  acceptAffiliate,
  getAllAffiliateLink,
  getAllMeAffiliateLink
} from '../../api/api'
import { encode, formatDate } from '../../api/helper'

const user = JSON.parse(localStorage.getItem('user'))

const columns_1 = [
  {
    title: 'STT',
    dataIndex: 'stt',
    key: 'stt'
  },
  {
    title: 'Short Link',
    dataIndex: 'links',
    key: 'links',
    render: (_, { links }) => (
      <div className='flex flex-col'>
        <a
          href={location.origin + '/s/' + links.shortLink + '?' + user.username}
          target='_blank'
          rel='noreferrer'
        >
          {location.origin + '/s/' + links.shortLink}
        </a>
        <span className='text-gray-500'>{links.realLink} </span>
      </div>
    )
  },
  {
    title: 'Money per click',
    key: 'moneyPerClick',
    dataIndex: 'moneyPerClick'
  },
  {
    title: 'Create At',
    key: 'createAt',
    dataIndex: 'createAt'
  },
  {
    title: 'Action',
    key: 'action',
    dataIndex: 'action',
    render: (_, { id }) => (
      <Button
        onClick={() => {
          acceptAffiliate(id).then(() => {
            location.reload()
          })
        }}
      >
        ACCEPTED
      </Button>
    )
  }
]

const columns_2 = [
  {
    title: 'STT',
    dataIndex: 'stt',
    key: 'stt'
  },
  {
    title: 'Short Link',
    dataIndex: 'links',
    key: 'links',
    render: (_, { links }) => (
      <div className='flex flex-col'>
        <a
          href={location.origin + '/s/' + links.shortLink + '?' + user.username}
          target='_blank'
          rel='noreferrer'
        >
          {location.origin + '/s/' + links.shortLink}
        </a>
        <span className='text-gray-500'>{links.realLink} </span>
      </div>
    )
  },
  {
    title: 'Money per click',
    key: 'moneyPerClick',
    dataIndex: 'moneyPerClick'
  },
  {
    title: 'Create At',
    key: 'createAt',
    dataIndex: 'createAt'
  }
]

const Affiliate = () => {
  const [data, setData] = useState()
  const [data2, setData2] = useState()

  useEffect(() => {
    getAllAffiliateLink({
      page: 0,
      per_page: 10
    }).then(({ data }) => {
      console.log(data)
      setData(
        data.data.map((item, index) => ({
          ...item,
          stt: index + 1,
          links: {
            shortLink: encode(item.id),
            realLink: item.url
          },
          moneyPerClick: item.money / item.expectedClicks + ' VND',
          createAt: formatDate(item.createAt)
        }))
      )
    })

    getAllMeAffiliateLink().then(({ data }) => {
      console.log(data)
      setData2(
        data.map((item, index) => ({
          ...item,
          stt: index + 1,
          links: {
            shortLink: encode(item.id),
            realLink: item.url
          },
          moneyPerClick: item.money / item.expectedClicks + ' VND',
          createAt: formatDate(item.createAt)
        }))
      )
    })
  }, [])

  return (
    <div className={classNames('min-h-screen  flex')}>
      <Sidebar />
      <div className='flex-1 flex items-center justify-center bg-[#f7f5f1] py-8'>
        <div className='w-11/12 min-h-[870px] drop-shadow-2xl bg-white rounded-xl items-center justify-start flex flex-col pt-20'>
          <Title title={'Link tiếp thị'} />
          <Table
            columns={columns_1}
            dataSource={data}
            bordered={true}
            className={classNames('mx-5 mt-10 w-11/12')}
          />
          <br />
          <br />
          <br />
          <Title title={'Link đã nhận'} />
          <Table
            columns={columns_2}
            dataSource={data2}
            bordered={true}
            className={classNames('mx-5 mt-10 w-11/12')}
          />
        </div>
      </div>
    </div>
  )
}

export default Affiliate
