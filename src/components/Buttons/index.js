
import React from 'react'
import { Button } from 'antd'
import PropTypes from 'prop-types'
import styles from './index.less'

const Buttons = ({
  onClick,
  name,
  lineShow
}) => {
  return(
    <div className={ !lineShow ? styles.dashed : '' }>
       <Button type="primary" onClick={ onClick }>{name}</Button>
    </div>
  )
}

Buttons.propTypes = {
  onClick: PropTypes.func,
  name: PropTypes.string,
}

export default Buttons