import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/sidebar'
import classNames from 'classnames'
import styles from './style.module.scss'
import { Button, Card } from 'antd'
import Images from '../../assets/images'
import { getDetailLinkById } from '../../api/api'
import { encode, formatDate } from '../../api/helper'
import { useParams } from 'react-router-dom'

const urlDetail = () => {
  const fields = [
    {
      title: 'Tiêu đề',
      key: 'title'
    },
    {
      title: 'Link rút gon',
      key: 'short_link'
    },
    {
      title: 'Link gốc',
      key: 'real_link'
    },
    {
      title: 'Trạng thái',
      key: 'affiliate'
      // render:
    },
    {
      title: 'Người tạo',
      key: 'user_create'
    },
    {
      title: 'Thời gian tạo',
      key: 'createAt'
    }
  ]

  const initial = {
    title: '',
    short_link: '',
    real_link: '',
    affiliate: '',
    user_create: '',
    createAt: ''
  }

  const onChange = (e) => {
    console.log(`checked = ${e.target.checked}`)
  }

  const [urlDetail, setUrlDetail] = useState(initial)

  const { id } = useParams()

  useEffect(() => {
    getDetailLinkById(id).then((data) => {
      console.log(data)
      const url = data?.data
      const newUrl = {
        title: url.title,
        short_link: location.origin + '/s/' + encode(url.id),
        real_link: url.url,
        affiliate: url.affiliate ? 'Link affiliate' : 'Link bình thường',
        user_create: url.user?.name ?? '',
        createAt: formatDate(url.createAt)
      }

      setUrlDetail(newUrl)
    })
  }, [])

  return (
    <div className={classNames('w-screen min-h-screen h-screen flex')}>
      <Sidebar />
      <div className='flex-1  flex items-center justify-center bg-[#f7f5f1]'>
        <div className='w-11/12 min-h-[870px] drop-shadow-2xl bg-white rounded-xl items-center flex flex-col p-10 gap-10 '>
          {/* <Avatar size={200} icon={<img src={Images.avatar} />} /> */}
          <Card
            title={
              <span className='flex gap-2.5'>
                <img src={Images.infoIcon} alt='' className='inline' />
                <span className={styles.title}>Thông tin link</span>
              </span>
            }
            className={classNames(styles.card, 'pt-[10px] w-full border-none')}
            bodyStyle={{ paddingTop: 0 }}
          >
            <hr />
            {fields.map((field) => (
              <div key={field.key} className={styles.info}>
                <p className={styles.info__label}>{field.title}</p>
                <p className={styles.info__value}>{urlDetail[field.key]}</p>
              </div>
            ))}
          </Card>
          <div
            className={classNames(
              'self-end pr-20 flex gap-10',
              styles.buttonGroup
            )}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default urlDetail
