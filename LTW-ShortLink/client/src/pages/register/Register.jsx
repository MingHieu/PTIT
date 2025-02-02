import React, { useEffect } from 'react'
import { Button, Checkbox, Form, Input } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import classNames from 'classnames'
import styles from './style.module.scss'
import { useNavigate } from 'react-router-dom'
import { register } from '../../api/api'

const Register = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  useEffect(() => {
    if (token) {
      navigate('/dashboard')
    }
  }, [])
  const onFinish = (values) => {
    if (values.password === values.confirmPassword) {
    }
    register(values.username, values.password).then(() => {
      navigate('/dashboard')
    })
  }

  return (
    <div
      className={classNames(
        'flex flex-1 items-center justify-center h-screen bg-[#f7f5f1]'
      )}
    >
      <Form
        className='bg-white p-20 w-[500px] rounded-xl shadow-lg'
        name='normal_login'
        onFinish={onFinish}
      >
        <h1 className='text-center text-black font-bold text-3xl mb-14'>
          Shorten Link
        </h1>
        <Form.Item
          name='username'
          rules={[
            {
              required: true,
              message: 'Please input your Username!'
            }
          ]}
        >
          <Input
            prefix={<UserOutlined className='w-10/12' />}
            placeholder='Username'
            size='large'
          />
        </Form.Item>
        <Form.Item
          name='password'
          rules={[
            {
              required: true,
              message: 'Please input your Password!'
            }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className='site-form-item-icon' />}
            type='password'
            placeholder='Password'
            size='large'
          />
        </Form.Item>
        {/* <Form.Item
          name='confirmPassword'
          rules={[
            {
              required: true,
              message: 'Please input your Confirm Password!'
            }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className='site-form-item-icon' />}
            type='password'
            placeholder='Confirm Password'
            size='large'
          />
        </Form.Item> */}

        <Form.Item
          className={
            (classNames('flex flex - col justify - center items - center'),
            styles.register)
          }
        >
          <Button
            type='primary'
            htmlType='submit'
            className='login-form-button'
          >
            Register
          </Button>
          Or <a href='/login'>Login now!</a>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Register
