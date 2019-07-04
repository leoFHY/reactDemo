import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Page } from 'components'
import { Table,  Modal, message  } from 'antd';
import Create from './components/CreateModal';
import List from './components/List';
import { getValue } from 'utils/transformData'
const confirm = Modal.confirm;

@connect(({ filterDetail, loading }) => ({ filterDetail, loading }))
class HouseType extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      radioValue: '0',
      inputValue: '',
      record: {},
      visibleEdit: false,
    }
  }
  componentDidMount() {
  }
  render() {
    const { dispatch, filterDetail } = this.props
    const { visible, record, radioValue, inputValue, visibleEdit } = this.state
    const { houseTypeDiscountList, bfProjectId, discountPagination, discountPage, status } = filterDetail
    const onEdit = record => {
      if (status === '1') {
        message.warning('请下架商品后再操作')
        return
      }
       this.setState({
          visibleEdit: true,
          record: record,
          inputValue: record.discountNum,
          radioValue: record.discountType,
        });
    }
    const onDel = id => {
      if (status === '1') {
        message.warning('请下架商品后再操作')
        return
      }
      confirm({
        title: '确定要删除该渠道吗？',
        content: '删除后用户将不可见',
        onOk() {
          dispatch({
            type:"filterDetail/delDiscount",
            payload: {
              id
            },
            success: () => {
              // 优惠户型列表
              dispatch({
                type: 'filterDetail/houseTypeDiscountList',
                payload: {
                  bfProjectId,
                  pageNum: discountPage,
                  pageSize: 10,
                },
              })           
            }
        })
        },
        onCancel() {},
      });
         
    }
    const handelAdd = (record) => {
        this.setState({
          visible: true,
          record: record
        });

    }
     // 弹出框取消
     const handleCancel = (rtFn) => {
       rtFn && rtFn();
       this.setState({
         visible: false,
         radioValue: '0',
         inputValue: ''
       });
     }
     // 弹出框确定
     const handleOk = (cbFn,rtFn) => {
       cbFn((err, values) => {
         if (!err) {
           
           values.discountNum = inputValue
           values.bfProjectId = bfProjectId
           values.houseTypeId = record.houseTypeId
           values.houseTypeName = record.houseTypeName
           dispatch({
             type:"filterDetail/editDiscount",
             payload: values,
             success: () => {
               this.setState({
                   visible: false,
                   radioValue: '0',
                   inputValue: ''
               });
               // 优惠户型列表
              dispatch({
                type: 'filterDetail/houseTypeDiscountList',
                payload: {
                  bfProjectId,
                  pageNum: discountPage,
                  pageSize: 10,
                },
              })
              rtFn && rtFn();              
             }
           })
         }
       });
     }
     const radioChange = (e) => {
         this.setState({
           radioValue: e.target.value,
           inputValue: '',
         });
     }
     const inputChange = (e) => {
         this.setState({
           inputValue: e.target.value,
         });
     }
   
    const payType = [{
      id: '0',
      name: '不区分支付方式'
    },{
      id: '1',
      name: '分期贷款'
    },{
      id: '2',
      name: '分期全款'
    },{
      id: '3',
      name: '一次性付清'
    },]
    const discountType = [{
      id: '1',
      name: '减免'
    },{
      id: '2',
      name: '折扣'
    }]
    const modalProps = {
      visible,
      handleOk,
      handleCancel,
      name: '设置优惠类型',
      radioChange,
      radioValue,
      inputChange,
      inputValue,
      payType,
      record: {}
    }
    // 弹出框取消
     const onCancel = (rtFn) => {
       rtFn && rtFn()
       this.setState({
         visibleEdit: false,
         inputValue: '',
         radioValue: '0',
       });
     }
     // 弹出框确定
     const onOk = (cbFn,rtFn) => {
       cbFn((err, values) => {
         if (!err) {
           values.discountNum = inputValue
           values.bfProjectId = bfProjectId
           values.houseTypeId = record.houseTypeId
           values.houseTypeName = record.houseTypeName
           values.id = record.id
           dispatch({
             type:"filterDetail/editDiscount",
             payload: values,
             success: () => {
               this.setState({
                   visibleEdit: false,
                   inputValue: '',
                   radioValue: '0',
               });
               // 优惠户型列表
              dispatch({
                type: 'filterDetail/houseTypeDiscountList',
                payload: {
                  bfProjectId,
                },
              })
               rtFn && rtFn();
             }

           })
         }
       });
     }
    const editProps = {
      visible:visibleEdit,
      handleOk: onOk,
      handleCancel: onCancel,
      name: '编辑优惠类型',
      radioChange,
      radioValue,
      inputChange,
      inputValue,
      payType,
      record,
    }

    // 分页事件
  const onChange = page => {
    dispatch({
      type: 'filterDetail/houseTypeDiscountList',
      payload: {
        pageNum: page,
        bfProjectId,
        pageSize: 10,
      },
    });
    dispatch({
        type: 'filterDetail/saveDiscountOnchangePage',
        payload: page
      })
  };
    const columns = [{
      title: '户型名称',
      dataIndex: 'houseTypeName',
      key: 'houseTypeName',
      className: 'center',
      render: (text, record) => {
        const obj = { 
            children : 
            <div>
              <div>
              {text}
              </div>
              <a onClick={() => handelAdd(record)}>添加优惠</a>
            </div>,
            props : {},
        }
         obj.props.rowSpan = record.rowSpan;
         return obj
        
      },
    }, {
      title: '优惠名称',
      dataIndex: 'discountName',
      key: 'discountName',
      render: text => text || '--',
    }, {
      title: '优惠类型',
      dataIndex: 'payType',
      key: 'payType',
      render: text => getValue(text,payType) || '--',
    }, {
      title: '优惠方式',
      dataIndex: 'discountType',
      key: 'discountType',
      render: (text,record) => {
        return (
          <span>
            {getValue(text,discountType)} {record.discountNum}
            {
              text === '1' ? '元' : null
            }
            {
              text === '2' ? '%' : null
            }
          </span>
        )
      },
    },{
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      render: (text,record) => {
        if (!record.discountName) return null
        return (
          <span>
            <a onClick={ () => onEdit(record)  }>编辑</a>
              &nbsp;&nbsp;
            <a onClick={ () => onDel(record.id)  }>删除</a>
          </span>
        )
      }
    }];
  
    return (
      <Page>
        <List columns={columns} dataSource={houseTypeDiscountList} pagination = {{...discountPagination,onChange}}/>
        <Create {...modalProps} />
        <Create {...editProps} />
      </Page>
    )
  }
}

HouseType.propTypes = {
  filterDetail: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}


export default HouseType
