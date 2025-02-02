import React, { useEffect, useState } from 'react'
import { Button, Checkbox, Form, Image, Input, Space } from 'antd'
import classNames from 'classnames'

import styles from './style.module.scss'
import facebook from '../../assets/images/facebook.png'
import instagram from '../../assets/images/instagram.png'
import telegram from '../../assets/images/telegram.png'
import twitter from '../../assets/images/twitter.png'
import whatsapp from '../../assets/images/whatsapp.png'
import { createNewLink, getLinkByShortLink } from '../../api/api'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  useEffect(() => {
    if (token) {
      navigate('/dashboard')
    }
  }, [])

  const [shortenLink, setShortenLink] = useState(null)
  const [realLink, setRealLink] = useState(null)

  const onFinish = (values) => {
    createNewLink({ title: '', isAffiliate: false, url: values.url }).then(
      (data) => {
        setShortenLink(data?.data?.url)
        // console.log(data)
      }
    )
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  const handleClickShortLink = (link) => {
    getLinkByShortLink(link).then((res) => {
      setRealLink(res?.data?.url)
    })
  }

  return (
    <div className=' min-h-screen h-screen flex flex-col'>
      <Space className='flex items-center justify-between'>
        <a href='/' className='hover:no-underline'>
          <h1 className='font-extrabold text-5xl text-black m-5'>
            Shorten Link
          </h1>
        </a>

        <Button
          type='primary'
          size='large'
          className='mr-10 hover:no-underline font-bold drop-shadow-md'
          href='/login'
        >
          Get started
        </Button>
      </Space>

      <div className='w-full py-10 px-40 bg-[#f7f5f1] flex items-center flex-col'>
        <Form
          className={classNames('w-10/12 flex flex-1 gap-5', styles.form)}
          name='basic'
          layout='vertical'
          initialValues={{
            remember: true
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete='off'
        >
          <Form.Item className='text-xl flex-1' name='url'>
            <Input placeholder='Your URL' />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit'>
              Create
            </Button>
          </Form.Item>
        </Form>
        <>
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
                {location.origin}/s/{shortenLink}
              </a>
            </div>
          )}
        </>
      </div>

      <Space className={classNames('py-10 px-40', styles.stats)}>
        <div className=''>
          <div className='text-8xl font-bold'>20m</div>
          <div className='text-lg mt-4 uppercase '>REDIRECTS PER DAY</div>
        </div>
        <div className=''>
          <div className='text-8xl font-bold'>5300k</div>
          <div className='text-lg mt-4 uppercase'>customers</div>
        </div>
        <div className='pr-[50px]'>
          <p className='text-lg'>
            <strong>
              We process 20,000,000 redirects per day for 200,000 happy
              customers.{' '}
            </strong>
            "It’s our goal to provide reliable service allowing businesses to
            focus on their priorities."
          </p>
        </div>
      </Space>

      <div
        className={classNames(
          'py-10 px-20 flex flex-col justify-center items-center',
          styles.brands
        )}
      >
        <h2 className='text-2xl font-semibold text-center mb-8'>
          Trusted worldwide by
        </h2>
        <ul className='flex gap-10 flex-wrap justify-center'>
          <li className='h-[150px]'>
            <img className='w-full h-full' src={facebook} />
          </li>
          <li className='h-[150px]'>
            <img className='w-full h-full' src={instagram} />
          </li>
          <li className='h-[150px]'>
            <img className='w-full h-full' src={telegram} />
          </li>
          <li className='h-[150px]'>
            <img className='w-full h-full' src={twitter} />
          </li>
          <li className='h-[150px]'>
            <img className='w-full h-full' src={whatsapp} />
          </li>
        </ul>
      </div>

      <div className='w-full py-10 bg-[#f7f5f1] flex justify-center'>
        <h2>It's easy to get started</h2>
        <div>
          <p>And it's free — two things everyone loves.</p>
          <a href='/login'>
            <button>Get started</button>
          </a>
        </div>
      </div>

      <footer className='flex flex-col justify-center items-center'>
        <span>© Copyright 2023 Team 10 Class WEB. All Rights Reserved.</span>
        <div className='flex gap-8'>
          <a href=''>Terms & Conditions</a>
          <a href=''>Privacy Policy and GDPR</a>
        </div>
      </footer>
    </div>
  )
}

export default Home
