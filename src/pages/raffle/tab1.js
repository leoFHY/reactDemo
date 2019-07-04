import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Page } from 'components'
import styles from './index.less'
import Filter from './components/Filter'
import List from './components/List'
import Buttons from 'components/Buttons'
import Create from './components/CreateModal'
import DetailModal from './components/DetailModal'
import Edit from './components/CreateModal'
import { deepCopy } from 'utils/copy'
import { Modal, message } from 'antd'

const confirm = Modal.confirm;
@connect(({ raffle, loading, bucket }) => ({ raffle, loading, bucket }))
class Tab1 extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      visibleEdit: false,
      previewImage: '',
      previewVisible: false,
      id: '',
      visibleDetail: false
    }
  }

  render() {
    const { dispatch, raffle, bucket } = this.props
    let { dataSource, pagination, listImg1, listImg2 } = raffle
    const { visible, visibleEdit, previewImage, previewVisible, id, visibleDetail } = this.state
      
    // 搜索   
    const handleSubmit = cbFn => {
      cbFn((err, values) => {
        if (!err) {
          dispatch({
            type: 'raffle/getPageList',
            payload: {
              data: values,
              type: 'search',
            },
          });
        }
      });
    };
    // 分页
    const onChange = page => {
      dispatch({
        type: 'raffle/getPageList',
        payload: {
          pageNum: page,
          pageSize: 10,
        },
      });
      dispatch({
        type: 'raffle/saveOnchangePage',
        payload: page
      })
    };
    // 重置
    const handleReset = cbFn => {
      cbFn && cbFn();
      dispatch({
        type: 'raffle/getPageList',
        payload: {
          data: {},
          type: 'reset',
        },
      });
      dispatch({
        type: 'raffle/saveOnchangePage',
        payload: 1
      })
    };
    // 弹出框取消
    const handleCancel = (rtFn) => {
      rtFn && rtFn()
      this.setState({
        visible: false,
      });
    }
    // 弹出框确定
    const handleOk = (cbFn, rtFn) => {
      cbFn((err, values) => {
        if (!err) {
          if (!listImg1.length || !listImg2.length) {
            message.warning('图片1和图片2必须传一张图片')
            return
          }
          values.prizePic1List = deepCopy(listImg1)
          values.prizePic2List = deepCopy(listImg2)
          values.prizePic1List.forEach((v, i) => {
            return v.sort = i + 1
          })
          values.prizePic2List.forEach((v, i) => {
            return v.sort = i + 1
          })
          
          dispatch({
            type: 'raffle/updateRaffle',
            payload: {
              data: values,
              type: 'create',
            },
            success: () => {
              this.setState({
                visible: false,
              });
            }
          })
        }
      });
      rtFn && rtFn()
    }
    
     const modalProps = {
       visible,
       handleOk,
       handleCancel,
       raffle,
       name: '添加奖品',
       bucket,
       dispatch,
     }
     const detailOk = () => {
       this.setState({
         visibleDetail: false
       })
     }
     const detailCancel = () => {
       this.setState({
         visibleDetail: false
       })
     }
     const detailProps = {
       visible:visibleDetail,
       handleOk: detailOk,
       handleCancel: detailCancel,
       raffle,
       dispatch,
     }
    // 创建商品
    const createProject = () => {
       this.setState({
          visible: true
        })
        dispatch({
          type: 'raffle/saveEditList',
          payload: {
           data:{
             editList: {},
             prizePic1List: [],
             prizePic2List: []
           } 
          }
        })
    }
   
   
     // 弹出框取消
     const onCancel = (rtFn) => {
       rtFn && rtFn()
       this.setState({
         visibleEdit: false,
       });
     }
     // 弹出框确定
     const onOk = (cbFn, rtFn) => {
       cbFn((err, values) => {
         if (!err) {
           if (!listImg1.length || !listImg2.length) {
             message.warning('图片1和图片2必须传一张图片')
             return
           }
           values.prizePic1List = deepCopy(listImg1)
           values.prizePic2List = deepCopy(listImg2)
           values.prizePic1List.forEach((v, i) => {
             return v.sort = i + 1
           })
          
           values.prizePic2List.forEach((v, i) => {
             return v.sort = i + 1
           })
           values.id = id
           dispatch({
             type: 'raffle/updateRaffle',
              payload: {
                data: values,
                type: 'edit',
              },
             success: () => {
               this.setState({
                 visibleEdit: false,
               });
             }
           })
         }
       });
       rtFn && rtFn()
     }
   const editProps = {
     visible: visibleEdit,
     handleOk: onOk,
     handleCancel: onCancel,
     raffle,
     name: '编辑奖品 ',
     bucket,
     dispatch,
   }
    const onEdit = (id) => {
      this.setState({
        visibleEdit: true,
        id,
      })
      dispatch({
          type: 'raffle/saveEdit',
          payload: {
            id,
          }
      })
    }
    
    const onDel = (id) => {
      confirm({
        title: '确定要删除该渠道吗？',
        content: '删除后用户将不可见',
        onOk() {
          dispatch({
            type: 'raffle/onDel',
            payload: {
              id
            }
          })
        },
        onCancel() {},
      });
    }
    const onDetail = (id) => {
       this.setState({
        visibleDetail: true,
        id,
      })
      dispatch({
          type: 'raffle/saveEdit',
          payload: {
            id,
          }
      })
    }
    const previewCancel = () => {
      this.setState({
        previewVisible: false
      })
    }
    const columns = [
          {
            title: '奖品名称',
            dataIndex: 'prizeName',
            key: 'prizeName',
            render: text => text || '--',
          },
          {
            title: '数量（个）',
            dataIndex: 'prizeCount',
            key: 'prizeCount',
            render: text => text || 0,
          },
           {
             title: '已领数量（个）',
             dataIndex: 'alreadyReceived',
             key: 'alreadyReceived',
             render: text => text || 0,
           },
          // {
          //   title: '图片1',
          //   dataIndex: 'prizePic1',
          //   key: 'prizePic1',
          //   render: (text) => {
          //       let fileList = [];
          //       if (text) {
          //         fileList[0] = {}
          //         fileList[0].uid = 1
          //         fileList[0].status = 'done'
          //         fileList[0].url = text
          //       }
          //       return( 
          //         <Upload
          //             listType="picture-card"
          //             fileList = {
          //               deepCopy(fileList) 
          //             }
          //             onPreview = {
          //               (file) => {
          //                 this.setState({
          //                     previewImage: file.url || file.thumbUrl,
          //                     previewVisible: true,
          //                 })
          //               }
          //             }
          //             showUploadList = {
          //               {showRemoveIcon: false}
          //             }
          //           >
          //           </Upload>
          //         )
          //    }
          // }
          {
            title: '操作',
            dataIndex: 'operate',
            key: 'operate',
            render: (text,record) => {
              return (
                <span>
                  <a onClick={ () => onEdit(record.id)  }>编辑</a>
                   &nbsp;&nbsp;
                  <a onClick={ () => onDel(record.id) }>删除</a>
                   &nbsp;&nbsp;
                  <a onClick={ () => onDetail(record.id) }>查看详情</a>
                </span>
              )
            }
          },
        ]
    return (
      <Page className={styles.page}>
          <Filter handleSubmit={handleSubmit} resetValue={handleReset} raffle={raffle} />
          <Buttons name='添加奖品' onClick={ createProject } />
          <List columns={columns}  dataSource={dataSource} pagination={{...pagination,onChange}}/>
          <Create {...modalProps} />
          <DetailModal {...detailProps}/>
          <Edit  {...editProps}/>
          <Modal visible={previewVisible} footer={null} onCancel={previewCancel}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
      </Page>
    )
  }
}

Tab1.propTypes = {
  filter: PropTypes.object,
  // dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default Tab1
