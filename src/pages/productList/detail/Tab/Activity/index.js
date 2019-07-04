import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Page } from 'components'
import { Modal , message } from 'antd';
import Filter from './components/Filter';
import List from './components/List';
import Buttons from 'components/Buttons'
import Create from './components/CreateModal';
import Detail from './components/DetailModal';
import moment from 'moment'
import { getValue } from 'utils/transformData'
import { deepCopy } from 'utils/copy'
const confirm = Modal.confirm;

@connect(({ detailActivity, loading, app, filterDetail, bucket }) => ({ detailActivity, loading, app, filterDetail, bucket }))
class Activity extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      detailShow: false,
      editId: '',
      editShow: false,
      clickTree: true,
    }
  }
   componentDidMount() {
    
   }
  render() {
    const { dispatch, detailActivity, app , filterDetail, bucket } = this.props
    const { status } = filterDetail
    const {
      dataSource,
      typeList,
      activityStatus,
      houseId,
      listImg
    } = detailActivity
    const bfProjectId = this.props.bfProjectId
    
    const { user } = app
    const { loginName } = user
    
    // 搜索   
    const handleSubmit = cbFn => {
      cbFn((err, values) => {
        if (!err) {
          values.bfProjectId = bfProjectId
          dispatch({
            type: 'detailActivity/getPageList',
            payload: {
              data:values,
              type: 'search',
            },
          });
        }
      });
    };
    // 重置
    const handleReset = cbFn => {
      cbFn && cbFn();
      dispatch({
        type: 'detailActivity/getPageList',
        payload: {
          data:{
             bfProjectId
          },
          type: 'reset',
        },
      });
    };
    
    // 编辑
    const handelEdit = (id) => {
      if (status === '1') {
        message.warning('请下架商品后再操作')
        return
      }
       dispatch({
         type: 'detailActivity/editOpen',
         payload: {
           id,
         },
         success: ()=>{
           this.setState({
            editShow: true,
            editId : id,
          });
         }
       });
    }
    // 删除
    const handelDel = (id) => {
      if (status === '1') {
        message.warning('请下架商品后再操作')
        return
      }
      confirm({
        title: '确定要删除该楼栋吗？',
        content: '删除后用户将看不到该楼栋在前端不可见。',
        onOk() {
          dispatch({
            type: 'detailActivity/goDel',
            payload: {
              id
            },
          });
        },
        onCancel() {},
      });
    }
    // 查看详情
    const handelView = (id) => {
       
         dispatch({
           type: 'detailActivity/getDetail',
           payload: {
             id
           },
           success: () => {
             this.setState({
                detailShow: true
              })
           }
         });
    }
    // 编辑弹出框取消
    const handleCancel = rtFn => {
      rtFn && rtFn();
      this.setState({
        visible: false,
      });
    }
    // 编辑弹出框确定
    const editOk = (cbFn, rtFn) => {
      let that = this
      cbFn((err, values) => {
        if (!err) {
          values.bfProjectId = that.props.bfProjectId
          values.id = that.state.editId
          if (houseId) {
            values.houseId = houseId
            values.houseName = null
          }else{
            message.warning('必须选择一个优惠房源，否则无法提交')
          }
          if (values.time.length) {
            values.startDate = values.time[0].format('YYYY-MM-DD HH:mm:ss') || ''
            values.endDate = values.time[1].format('YYYY-MM-DD HH:mm:ss') || ''
            values.time = null
          }
          if (values.types.length) {
            values.identityTypes = values.types.join(',')
            values.types =null
          } else {
            message.warning('必须选择一个身份，否则无法提交')
            return
          }
          if (!values.discountType) {
             message.warning('必须选择一个优惠类型，否则无法提交')
             return
          }
          if (parseFloat(values.minAmount) >= parseFloat(values.startAmount)) {
             message.warning('底价需要低于起始价才可创建')
             return
          }
          values.houseDiscountPic = listImg[0].url
           dispatch({
             type: 'detailActivity/editShow',
             payload:values,
             success: () => {
                that.setState({
                  editShow: false,
                });
                rtFn && rtFn();
               
             }
           })
        }
      });
    }

    // 编辑弹出框取消
    const editCancel = rtFn => {
      rtFn && rtFn();
      this.setState({
        editShow: false,
      });
     
    }
    // 编辑弹出框确定
    const handleOk = (cbFn, rtFn) => {
      let that = this
      cbFn((err, values) => {
        if (!err) {
          values.bfProjectId = that.props.bfProjectId
          if(houseId){
             values.houseId = houseId
             values.houseName = null
          } else {
            message.warning('必须选择一个优惠房源，否则无法提交')
          }
          if (values.time.length) {
            values.startDate = values.time[0].format('YYYY-MM-DD HH:mm:ss') || ''
            values.endDate = values.time[1].format('YYYY-MM-DD HH:mm:ss') || ''
            values.time = null
          }
          if (values.types.length) {
            values.identityTypes = values.types.join(',')
            values.types = null
          } else {
            message.warning('必须选择一个身份，否则无法提交')
            return
          }
          if (!values.discountType) {
            message.warning('必须选择一个优惠类型，否则无法提交')
            return
          }
          if (parseFloat(values.minAmount) >= parseFloat(values.startAmount)) {
            message.warning('底价需要低于起始价才可创建')
            return
          }
          values.houseDiscountPic = listImg[0].url
          dispatch({
            type: 'detailActivity/editShow',
            payload: values,
            success: () => {
              this.setState({
                visible: false,
              });
              rtFn && rtFn();
              
            }
          })
        }
      });
    }
    // 添加销售楼栋
    const createActivity = () => {
      if (status === '1') {
        message.warning('请下架商品后再操作')
        return
      }
      this.setState({
        visible: true
      })
      dispatch({
        type: 'detailActivity/saveEditData',
        payload: {
            list: {},
            listImg: [],
        },
      })
      dispatch({
        type: 'detailActivity/saveHouseId',
        payload: {
          houseName: '',
          houseId: ''
        },
      })
    }
   
    const onCancel = () => {
      this.setState({
        detailShow: false
      })
    }
    const onOk = () => {
      this.setState({
        detailShow: false
      })
    }
    const openTree = () =>{
       if (this.state.clickTree) {
         message.loading('加载数据中，请稍后')
         this.setState({
           clickTree: false
         })
         dispatch({
          type: 'detailActivity/getHouse',
          payload: {
            bfProjectId,
          },
          success: () => {
              message.destroy()
              message.loading('数据加载完成')
              dispatch({
                type: 'detailActivity/changeTreeShow',
                payload: true,
              })  
              this.setState({
                clickTree: true
              })
          }
        })
       }
       
      
    }
    const columns = [
          {
            title: '优惠名称',
            dataIndex: 'discountName',
            key: 'discountName',
            render: text => text || '--',
          },
          {
            title: '活动时间段',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (text,record) => {
                const start = moment(text).format('YYYY-MM-DD HH:mm:ss')
                const end = moment(record.endDate).format('YYYY-MM-DD HH:mm:ss')
                return `${start}至${end}`
            },
          },
          {
            title: '身份类型',
            dataIndex: 'identityTypes',
            key: 'identityTypes',
            render: text => {
              let list = text.split(',')
              return list.map((v, i) => {
                return (
                  <span key = {i}>{getValue(v,typeList)} &nbsp;</span>
                )
              })
            },
          },
          {
            title: '优惠类型',
            dataIndex: 'discountType',
            key: 'discountType',
            render: text => {
              const config = {
                '1': '拍卖'
              }
              return config[text]
            }
          },
          {
            title: '活动状态',
            dataIndex: 'offerStatus',
            key: 'offerStatus',
            render: text => getValue(text, activityStatus),
          },
          {
            title: '拍卖结果',
            dataIndex: 'saleStatus',
            key: 'saleStatus',
            render: text => {
              const config = {
                '0': '未卖出',
                '1': '已卖出',
              }
              return config[text]
            },
          },
          {
            title: '操作',
            dataIndex: 'operate',
            key: 'operate',
            render: (text,record) => {
              return (
                <span>
                   <a onClick={() => handelEdit(record.id)}>编辑</a>
                  &nbsp;&nbsp;
                  <a onClick={() => handelDel(record.id)}>删除</a>
                  &nbsp;&nbsp;
                  <a onClick={() => handelView(record.id)}>查看详情</a>
                </span>
              )
            }
          },
        ]
    const saveMultipleImgs = (url) => {
      message.destroy()
      message.info('上传图片成功')
      let listImg = []
      listImg[0] = {}
      listImg[0].uid = 1
      //  listImg[0].status = 'done'
      //  listImg[0] = Object.assign({'status':'done'}, listImg[0])
      listImg[0].url = url[0]

      this.props.dispatch({
        type: 'detailActivity/saveMediaImages',
        payload: {
          data: deepCopy(listImg),
        },
      })
    }
    const createProps = {
      detailActivity,
      visible: this.state.visible,
      handleCancel,
      handleOk,
      openTree,
      name: '添加优惠活动',
      dispatch,
      saveMultipleImgs,
      listImg,
      bucket
    }
    const editProps = {
      detailActivity,
      visible: this.state.editShow,
      handleCancel: editCancel,
      handleOk: editOk,
      openTree,
      name: '编辑优惠活动',
      dispatch,
      saveMultipleImgs,
      listImg,
      bucket
    }
    const detailProps = {
      detailActivity,
      visible: this.state.detailShow,
      onCancel,
      onOk
    }
    return (
      <Page>
          
          <Filter handleSubmit={handleSubmit} resetValue={handleReset} detailActivity={detailActivity} />
          <Buttons name='添加优惠活动' onClick={ createActivity } />
          <List columns={columns} dataSource={dataSource}  />
          <Create {...createProps} />
          <Create {...editProps} />
          <Detail {...detailProps}/>
          
      </Page>
    )
  }
}

Activity.propTypes = {
  detailActivity: PropTypes.object,
  // dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default Activity
