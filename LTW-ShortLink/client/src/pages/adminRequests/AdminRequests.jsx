import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/sidebar'
import { Table, Tag } from 'antd'
import styles from './style.module.scss'
import { DEFAULT_CURRENT, DEFAULT_PAGE_SIZE } from '../../constants/constant'
import { getAllRequest } from '../../api/api'
import { formatDate } from '../../api/helper'

const AdminRequests = () => {
  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
      render: (text) => <a>{text}</a>
    },
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      render: (user) => {
        return (
          <div className='flex flex-col'>
            {user.username}
            <span className='text-gray-500'>{user.name || '-'}</span>
          </div>
        )
      }
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date'
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount'
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        return <Tag color='yellow'>{type}</Tag>
      }
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (status) => {
        let color = ''
        switch (status) {
          case 'PENDING':
            color = 'blue'
            break
          case 'ACCEPTED':
            color = 'green'
            break
          case 'REJECTED':
            color = 'red'
            break
          default:
            color = 'black'
            break
        }

        return <Tag color={color}>{status}</Tag>
      }
    }
  ]

  const [data, setData] = useState([])
  const [pagination, setPagination] = useState({
    page: DEFAULT_CURRENT,
    per_page: DEFAULT_PAGE_SIZE
  })

  useEffect(() => {
    getAllRequest({ ...pagination }).then((data) => {
      const requests = data?.data?.data?.map((request, index) => {
        return {
          stt: index + 1,
          id: request.id,
          date: formatDate(request.createAt),
          amount: request.value,
          user: {
            username: request.user.username,
            name: request.user.name
          },
          status: request.status,
          type: request.type
        }
      })

      setData(requests)
    })
  }, [])

  const getDetail = (record) => {
    window.location.href = `requests/${record.id}`
  }

  return (
    <div className={classNames('min-h-screen h-screen flex')}>
      <Sidebar />
      <div className='flex-1  flex items-center justify-center bg-[#f7f5f1]'>
        <div className='w-11/12 min-h-[870px] drop-shadow-2xl bg-white rounded-xl items-start justify-center pt-20 px-20'>
          <h2 className='mb-10 text-center text-black font-bold text-4xl'>
            Yêu cầu
          </h2>
          <Table
            columns={columns}
            dataSource={data}
            bordered={true}
            className={classNames('', styles.requests)}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => getDetail(record) // double click row
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default AdminRequests
