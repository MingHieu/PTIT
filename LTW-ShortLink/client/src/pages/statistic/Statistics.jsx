import classNames from 'classnames'
import React from 'react'
import styles from './style.module.scss'
import Sidebar from '../../components/sidebar'
import { Column } from '@ant-design/charts'
import Title from '../../components/title'

const data = [
  { month: 'Jan', clicks: 123 },
  { month: 'Feb', clicks: 234 },
  { month: 'Mar', clicks: 345 },
  { month: 'Apr', clicks: 456 },
  { month: 'May', clicks: 800 },
  { month: 'Jun', clicks: 678 },
  { month: 'Jul', clicks: 789 },
  { month: 'Aug', clicks: 890 },
  { month: 'Sep', clicks: 901 },
  { month: 'Oct', clicks: 700 },
  { month: 'Nov', clicks: 823 },
  { month: 'Dec', clicks: 734 }
]

const ClicksChart = () => {
  const config = {
    data,
    xField: 'month',
    yField: 'clicks',
    height: 400,
    xAxis: {
      label: {
        autoRotate: false
      }
    },
    legend: {
      position: 'top'
    },
    seriesField: 'clicks',
    color: ['#1890ff', '#f5222d', '#faad14', '#52c41a']
  }

  return <Column {...config} />
}

const Statistics = () => {
  return (
    <div
      className={classNames(
        'w-screen min-h-screen h-screen flex',
        styles.dashboard
      )}
    >
      <Sidebar />
      <div className='flex-1  flex items-center justify-center bg-[#f7f5f1]'>
        <div className='w-11/12 min-h-[870px] drop-shadow-2xl bg-white rounded-xl items-center justify-start flex flex-col pt-20'>
          <Title title={'Statistics clicks'} />

          <div className='w-11/12 '>
            <ClicksChart />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Statistics
