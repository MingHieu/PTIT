import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/sidebar'
import classNames from 'classnames'
import styles from './style.module.scss'
import { Avatar, Card } from 'antd'
import Images from '../../assets/images'
import { AntDesignOutlined } from '@ant-design/icons'
import { getUser } from '../../api/api'
import { useParams } from 'react-router-dom'

const UserDetail = () => {
  const fields = [
    {
      title: 'Họ và Tên',
      key: 'name'
    },
    {
      title: 'Username',
      key: 'username'
    },
    {
      title: 'Ngày sinh',
      key: 'dateOfBirth'
    },
    {
      title: 'Email',
      key: 'email'
    },
    {
      title: 'SĐT',
      key: 'phoneNumber'
    }
  ]

  const initial = {
    name: '',
    username: '',
    dateOfBirth: '29/09/1999',
    email: 'example@gmail.com',
    phoneNumber: '0123456789'
  }

  const [userDetail, setUserDetail] = useState(initial)
  const [money, setMoney] = useState()
  const { username } = useParams()

  useEffect(() => {
    getUser(username).then((data) => {
      console.log(data)
      const user = data?.data
      const newUser = {
        name: user.name,
        username: user.username
      }

      setUserDetail({ ...userDetail, ...newUser })
    })
  }, [])

  return (
    <div className={classNames('w-screen min-h-screen h-screen flex')}>
      <Sidebar />
      <div className='flex-1  flex items-center justify-center bg-[#f7f5f1]'>
        <div className='w-11/12 min-h-[870px] drop-shadow-2xl bg-white rounded-xl items-center flex flex-col pt-10 gap-10 '>
          <Avatar size={200} icon={<img src={Images.avatar} />} />

          <Card
            title={
              <span className='flex gap-2.5'>
                <img src={Images.infoIcon} alt='' className='inline' />
                <span className={styles.title}>Thông tin người dùng</span>
              </span>
            }
            className={classNames(
              styles.card,
              'pt-[10px] w-full flex-1 border-none px-10'
            )}
            bodyStyle={{ paddingTop: 0 }}
          >
            <hr />
            {fields.map((field) => (
              <div key={field.key} className={styles.info}>
                <p className={styles.info__label}>{field.title}</p>
                <p className={styles.info__value}>{userDetail[field.key]}</p>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  )
}

export default UserDetail
