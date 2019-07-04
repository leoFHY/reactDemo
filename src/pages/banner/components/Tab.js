import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'

@connect(({ banner, loading }) => ({ banner, loading }))
class Tab extends PureComponent {
  state = {
     bgColor: 0,
  }
   render() {
     const { banner } = this.props
     const handelClick = (id, i) => {
      
       this.props.dispatch({
         type: 'banner/getList',
         payload:{
           userType: id,
         },
         success: () => {
            this.setState({
              bgColor: i
            })
         }
       })
     }
     return(
        <div className = { styles.box }>
           身份类型:
           {
             banner.typeList.map((v, i) =>
              < span style = {
                {
                  backgroundColor: this.state.bgColor === i ? '#40a9ff' : '#fff',
                  color: this.state.bgColor === i ? '#fff' : 'rgba(153, 153, 153, 0.847058823529412)'
                }
              }
              key = {
                v.id
              }
              onClick = {
                () => {
                  handelClick(v.id, i)
                }
              } > {
                v.name
              } </span>
            )
           }
         </div>
      )
   }
  
}


Tab.propTypes = {
  visible : PropTypes.bool,
  handleOk : PropTypes.func,
  handleCancel: PropTypes.func, 
  filter: PropTypes.object,
}
export default Tab