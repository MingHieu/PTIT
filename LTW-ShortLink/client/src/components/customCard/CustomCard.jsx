import { Card, CardProps } from "antd"
import classNames from "classnames"
import styles from './styles.module.scss'


const CustomCard = (props) => {
  return (
    <Card
      {...props}
      className={classNames(styles.card, 'drop-shadow-2xl', props.className)}
    />
  )
}

export default CustomCard