import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/sidebar'
import classNames from 'classnames'
import styles from './style.module.scss'
import { Avatar, Card, Tag } from 'antd'
import Images from '../../assets/images'

const Profile = () => {
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
    name: 'John Wick',
    username: 'john go',
    dateOfBirth: '29/09/1999',
    email: 'example@gmail.com',
    phoneNumber: '0123456789',
    money: 0
  }

  const [userDetail, setUserDetail] = useState(initial)
  const user = JSON.parse(localStorage.getItem('user'))
  console.log(user)
  useEffect(() => {
    const newUser = {
      name: user.name,
      username: user.username
    }

    setUserDetail({
      ...userDetail,
      ...newUser
    })
  }, [])

  console.log(userDetail)

  return (
    <div className={classNames('w-screen min-h-screen h-screen flex')}>
      <Sidebar />
      <div className='flex-1  flex items-center justify-center bg-[#f7f5f1]'>
        <div className='w-11/12 min-h-[870px] drop-shadow-2xl bg-white rounded-xl items-center flex flex-col pt-10 gap-10 relative'>
          <Avatar size={200} icon={<img src={Images.avatar} />} />

          <Tag className='absolute right-12 top-16 p-3 font-bold text-xl border-none bg-blue-400 drop-shadow-[15px_35px_35px_rgba(62,225,246,0.8)]'>
            Amount: <span className='text-white'>{userDetail.money} VND</span>
          </Tag>

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

export default Profile
