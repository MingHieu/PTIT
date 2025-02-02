import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/sidebar'
import { Button, Checkbox, Form, Input, Space } from 'antd'
import classNames from 'classnames'
import styles from './style.module.scss'
import { createNewLink, getLinkByShortLink } from '../../api/api'
import { useForm } from 'antd/es/form/Form'

const DashBoard = () => {
  const [shortenLink, setShortenLink] = useState(null)
  const [realLink, setRealLink] = useState(null)
  const [form] = useForm()

  const onFinish = (values) => {
    createNewLink(values)
      .then((res) => setShortenLink(res?.data.url))
      .then(() => form.resetFields())
  }
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  const [isVisibility, setIsVisibility] = useState(false)
  const handleClick = () => {
    setIsVisibility((prev) => !prev)
  }

  const handleClickShortLink = (link) => {
    getLinkByShortLink(link).then((res) => {
      setRealLink(res?.data?.url)
    })
  }

  return (
    <div className={classNames('min-h-screen h-screen flex', styles.dashboard)}>
      <Sidebar />
      <div className='flex-1  flex items-center justify-center bg-[#f7f5f1]'>
        <div
          className='w-11/12 min-h-[870px] drop-shadow-2xl bg-white rounded-xl items-start flex flex-col
         pt-20'
        >
          <h2 className='mb-10 text-center text-black font-bold text-4xl self-center'>
            Rút gọn link
          </h2>
          <Form
            className='w-10/12 self-center'
            name='form-dashboard'
            layout='vertical'
            initialValues={{
              remember: true
            }}
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete='off'
          >
            <Form.Item label='Tiêu đề' name='title'>
              <Input size='large' />
            </Form.Item>
            <Form.Item
              label='Đường dẫn'
              name='url'
              required
              rules={[
                {
                  required: true,
                  message: 'Please input your link!'
                }
              ]}
            >
              <Input />
            </Form.Item>
            <div
              className={`gap-5 ${isVisibility ? 'flex flex-col' : 'hidden'}`}
            >
              <Form.Item
                label='Số tiền sẽ trả'
                name='money'
                required={isVisibility ? true : false}
                rules={[
                  {
                    message: 'Please input your link!'
                  }
                ]}
              >
                <Input type='number' />
              </Form.Item>
              <Form.Item
                label='Số lượt click mong muốn'
                name='expectedClicks'
                required={isVisibility ? true : false}
                rules={[
                  {
                    message: 'Please input your link!'
                  }
                ]}
              >
                <Input type='number' />
              </Form.Item>
            </div>

            <Form.Item className={styles.buttonGroup}>
              <Form.Item name='isAffiliate' valuePropName='checked' noStyle>
                <Checkbox onClick={handleClick}>Link tiếp thị</Checkbox>
              </Form.Item>

              <Button type='primary' htmlType='submit'>
                Rút gọn
              </Button>
            </Form.Item>
          </Form>

          {shortenLink && (
            <div className='self-center font-bold'>
              Your Shorten Link:
              <a
                className='ml-5'
                href={`http://localhost:3000/s/${shortenLink}`}
                target='_blank'
                rel=''
                onClick={handleClickShortLink(shortenLink)}
              >
                http://localhost:3000/s/{shortenLink}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashBoard
