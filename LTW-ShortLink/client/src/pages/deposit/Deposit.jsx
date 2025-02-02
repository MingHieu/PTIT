import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/sidebar'
import { Button, Form, Input, Radio, Table, Tag } from 'antd'
import Images from '../../assets/images'
import styles from './style.module.scss'
import { createRequest, getRequestByUsername } from '../../api/api'
import { DEFAULT_CURRENT, DEFAULT_PAGE_SIZE } from '../../constants/constant'
import { formatDate } from '../../api/helper'
import Title from '../../components/title'

const columns = [
  {
    title: 'Value',
    dataIndex: 'value',
    key: 'value'
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type'
  },



  
  {
    title: 'Create At',
    dataIndex: 'create_at',
    key: 'create_at'
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

const Deposit = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  // const [resetTable, setResetTable] = useState(false)

  const [data, setData] = useState()
  const [pagination, setPagination] = useState({
    page: DEFAULT_CURRENT,
    per_page: DEFAULT_PAGE_SIZE
  })
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    getRequestByUsername(user.username, { ...pagination }).then((res) => {
      const newRequests = res.data.data.map((request) => {
        return {
          id: request.id,
          type: request.type,
          status: request.status,
          create_at: formatDate(request.createAt),
          value: request.value
        }
      })
      setData(newRequests)
    })
  }, [])

  const onFinish = (values) => {
    // setResetTable((prev) => !prev)
    createRequest({
      type: values.type,
      value: Number(values.value)
    })
      .then((res) => {
        setData([
          ...data,
          {
            id: res.data.id,
            type: res.data.type,
            status: res.data.status,
            value: res.data.value,
            create_at: formatDate(res.data.createAt)
          }
        ])
      })
      .then(() => form.resetFields())
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <div className={classNames('max-h-screen h-screen flex')}>
      <Sidebar />
      <div className='flex-1 h-full  flex items-center justify-center bg-[#f7f5f1]'>
        <div className='w-11/12 min-h-[870px] drop-shadow-2xl bg-white rounded-xl items-center justify-start flex flex-col pt-20'>
          <div className='flex flex-col items-center p-5 rounded-md mt-8 w-5/12'>
            <Title title={'Tạo yêu cầu mới'} />
            <Form
              className='w-full'
              form={form}
              name='deposit-form'
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              layout='vertical'
            >
                <Form.Item label='Số tài khoản' required name='cardNumber'>
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

          {data && (
            <Table
              columns={columns}
              dataSource={data}
              bordered={true}
              className={classNames('mx-5 mt-10 w-11/12')}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Deposit
