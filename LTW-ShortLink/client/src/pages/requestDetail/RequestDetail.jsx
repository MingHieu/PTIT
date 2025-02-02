import React, { useEffect, useRef, useState } from 'react'
import Sidebar from '../../components/sidebar'
import classNames from 'classnames'
import { Button, Card } from 'antd'
import Images from '../../assets/images'
import styles from './style.module.scss'
import { useParams } from 'react-router-dom'
import { getOneRequest, updateRequest } from '../../api/api'
import { formatDate } from '../../api/helper'

const RequestDetail = () => {
  const fields = [
    {
      title: 'Số tiền',
      key: 'value'
    },
    {
      title: 'Yêu cầu',
      key: 'type'
    },
    {
      title: 'Trạng thái',
      key: 'status'
    },
    {
      title: 'Người tạo',
      key: 'user'
    },
    {
      title: 'Thời gian tạo',
      key: 'createAt'
    }
  ]

  const [data, setData] = useState({})
  const { id } = useParams()

  useEffect(() => {
    getOneRequest(id).then(({ data }) => {
      setData({
        ...data,
        user: data.user.username,
        createAt: formatDate(data.createAt)
      })
    })
  }, [])

  const reject = () => {
    updateRequest({
      id,
      status: 'REJECTED' //  REJECTED, ACCEPTED
    })
      .then(() => {
        location.replace('/admin/requests')
      })
      .catch((err) => {
        alert(err.message)
      })
  }

  const accept = () => {
    updateRequest({
      id,
      status: 'ACCEPTED' //  REJECTED, ACCEPTED
    })
      .then(() => {
        location.replace('/admin/requests')
      })
      .catch((err) => {
        alert(err.message)
      })
  }

  return (
    <div className={classNames('w-screen min-h-screen h-screen flex')}>
      <Sidebar />
      <div className='flex-1  flex items-center justify-center bg-[#f7f5f1]'>
        <div className='w-11/12 min-h-[870px] drop-shadow-2xl bg-white rounded-xl items-center flex flex-col p-10 gap-10 '>
          <Card
            title={
              <span className='flex gap-2.5'>
                <img src={Images.infoIcon} alt='' className='inline' />
                <span className={styles.title}>Thông tin yêu cầu</span>
              </span>
            }
            className={classNames(styles.card, 'pt-[10px] w-full border-none')}
            bodyStyle={{ paddingTop: 0 }}
          >
            <hr />
            {fields.map((field) => (
              <div key={field.key} className={styles.info}>
                <p className={styles.info__label}>{field.title}</p>
                <p className={styles.info__value}>{data[field.key]}</p>
              </div>
            ))}
          </Card>
          <div
            className={classNames(
              'self-end pr-20 flex gap-10',
              styles.buttonGroup
            )}
          >
            {data.status === 'PENDING' ? (
              <>
                <Button className='bg-red-500' onClick={reject}>
                  Từ chối
                </Button>
                <Button className='bg-blue-500' onClick={accept}>
                  Xác nhận
                </Button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RequestDetail
