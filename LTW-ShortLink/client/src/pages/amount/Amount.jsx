import classNames from 'classnames'
import React, { useState } from 'react'
import Sidebar from '../../components/sidebar'
import { Button, Form, Input, Radio, Table } from 'antd'
import styles from './style.module.scss'
import Title from '../../components/title'

const columns = [
  {
    title: 'STT',
    dataIndex: 'stt',
    key: 'stt',
    width: '10%'
  },
  {
    title: 'Short Link',
    dataIndex: 'links',
    key: 'links',
    width: '30%',
    render: (_, { links }) => (
      <div className='flex flex-col'>
        <a href={links.shortLink} target='_blank' rel='noreferrer'>
          {links.shortLink}
        </a>
        <span className='text-gray-500'>{links.realLink} </span>
      </div>
    )
  },
  {
    title: 'Earnings',
    dataIndex: 'earnings',
    key: 'earnings',
    sorter: (a, b) => a.earnings - b.earnings,
    render: (earnings) => {
      if (earnings > 1000)
        return (
          <span className='text-green-500 font-medium text-base'>
            {earnings}$
          </span>
        )
      else if (earnings > 100)
        return (
          <span className='text-blue-500 font-medium text-base'>
            {earnings}$
          </span>
        )
      else if (earnings > 10)
        return (
          <span className='text-yellow-500 font-medium text-base'>
            {earnings}$
          </span>
        )
      else
        return (
          <span className='text-red-500 font-medium text-base'>
            {earnings}$
          </span>
        )
    }
  },
  {
    title: 'Create At',
    key: 'create_at',
    dataIndex: 'create_at'
  }
]

const data = [
  // {
  //   stt: '1',
  //   links: {
  //     shortLink: 'https://abcdef',
  //     realLink: 'https://www.basttu.com'
  //   },
  //   earnings: 50,
  //   create_at: '2023-03-01'
  // },
  // {
  //   stt: '2',
  //   links: {
  //     shortLink: 'https://abcdef',
  //     realLink: 'https://www.basttu.com'
  //   },
  //   earnings: 10,
  //   create_at: '2023-03-01'
  // },
  // {
  //   stt: '3',
  //   links: {
  //     shortLink: 'https://abcdef',
  //     realLink: 'https://www.basttu.com'
  //   },
  //   earnings: 10,
  //   create_at: '2023-03-01'
  // }
]

const Amount = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const onFinish = () => {}
  const onFinishFailed = () => {}

  return (
    <div className={classNames('w-screen min-h-screen h-screen flex')}>
      <Sidebar />
      <div className='flex-1  flex items-center justify-center bg-[#f7f5f1]'>
        <div className='w-11/12 min-h-[870px] drop-shadow-2xl bg-white rounded-xl items-center pt-20 flex flex-col'>
          <div className='flex flex-col items-center p-5 rounded-md mt-8 w-5/12'>
            <Title title={'Amount'} />
            <Form
              className='w-full'
              form={form}
              name='amount-form'
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              layout='vertical'
            >
                <Form.Item label='Card Number' required name='cardNumber'>
                  <Input size='large' />
                </Form.Item>

                <Form.Item label='Số tiền thanh toán:' required name='value'>
                  <Input type='number' size='large' />
                </Form.Item>

                <Form.Item name='type' label='Phương thức:' required>
                  <Radio.Group>
                    <Radio value='WITHDRAW'>WITHDRAW</Radio>
                    <Radio value='DEPOSIT'>DEPOSIT</Radio>
                  </Radio.Group>
                </Form.Item>
              <Form.Item className='float-right'>
                <Button type='primary' htmlType='submit' loading={loading}>
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>

          <Table
            columns={columns}
            dataSource={data}
            bordered={true}
            className={classNames('mx-5 w-11/12', styles)}
          />
        </div>
      </div>
    </div>
  )
}

export default Amount
