import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/sidebar'
import classNames from 'classnames'
import styles from './style.module.scss'
import { Space, Table, Tag } from 'antd'
import { getAllUsers } from '../../api/api'
import { DEFAULT_CURRENT, DEFAULT_PAGE_SIZE } from '../../constants/constant'

const columns = [
  {
    title: 'STT',
    dataIndex: 'stt',
    key: 'stt',
    render: (text) => <a>{text}</a>
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Username',
    dataIndex: 'username',
    key: 'username'
  },
  {
    title: 'Roles',
    key: 'role',
    dataIndex: 'role',
    filters: [
      {
        text: 'Admin',
        value: 'admin'
      },
      {
        text: 'User',
        value: 'user'
      }
    ],
    onFilter: (value, record) => record.role == value,
    render: (role) => {
      let color = 'geekbue'
      switch (role) {
        case 'admin':
          color = 'green'
          break
        case 'user':
          color = 'red'
          break
        default:
          break
      }
      return (
        <Tag color={color} key={role}>
          {role.toUpperCase()}
        </Tag>
      )
    }
  }
]

const AdminUsers = () => {
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState({
    page: DEFAULT_CURRENT,
    per_page: DEFAULT_PAGE_SIZE
  })

  useEffect(() => {
    getAllUsers({ ...pagination }).then((data) => {
      const newListUser = data?.data?.data?.map((user, index) => {
        const newUser = {
          stt: index + 1,
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role,
          money: user.money
        }
        return newUser
      })

      setData(newListUser)
    })
  }, [])

  const getDetail = (record) => {
    window.location.href = `users/detail/${record.username}`
  }

  return (
    <div
      className={classNames(
        'w-screen min-h-screen h-screen flex',
        styles.dashboard
      )}
    >
      <Sidebar />
      <div className='flex-1  flex items-center justify-center bg-[#f7f5f1]'>
        <div className='w-11/12 min-h-[870px] drop-shadow-2xl bg-white rounded-xl items-start pt-20 px-20'>
          <h2 className='mb-10 text-center text-black font-bold text-4xl'>
            Người dùng
          </h2>
          <Table
            columns={columns}
            dataSource={data}
            bordered={true}
            className={classNames('mx-5 w-11/12', styles.users)}
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

export default AdminUsers
