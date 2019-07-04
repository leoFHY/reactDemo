import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Page } from 'components'
import { Modal , message } from 'antd';
import Filter from './components/Filter';
import List from './components/List';
import Edit from './components/EditModal';
import Buttons from 'components/Buttons'
import Create from './components/CreateModal';
const confirm = Modal.confirm;

@connect(({ filterDetail, loading, app }) => ({ filterDetail, loading, app }))
class FloorInfo extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      visibleCreate: false,
      showName: ''
    }
  }
   componentDidMount() {
    
   }
  render() {
    const { dispatch, filterDetail, app  } = this.props
    const { dataSource,bfProjectId, visibleCreate,pagination,createFloorShow, status } = filterDetail
    const { user } = app
    const { loginName } = user
    // 搜索   
    const handleSubmit = cbFn => {
      cbFn((err, values) => {
        if (!err) {
          values.bfProjectId = bfProjectId
          dispatch({
            type: 'filterDetail/getPageList',
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
        type: 'filterDetail/getPageList',
        payload: {
          data: {
            bfProjectId
          },
          type: 'reset',
        },
      });
      dispatch({
        type: 'filterDetail/saveOnchangePage',
        payload: 1
      })
    };
    // 分页
    const onChange = page => {
      dispatch({
        type: 'filterDetail/getPageList',
        payload: {
          pageNum: page,
          pageSize: 10,
          bfProjectId,
        },
      });
      dispatch({
        type: 'filterDetail/saveOnchangePage',
        payload: page
      })
    };
    // 编辑
    const handelEdit = (record) => {
      if (status === '1') {
        message.warning('请下架商品后再操作')
        return
      }
       this.setState({
         visible: true,
         showName: record.saleName
       });
       dispatch({
         type: 'filterDetail/saveBfBuildingId',
         payload: {
           bfBuildingId: record.id,
         },
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
            type: 'filterDetail/goDel',
            payload: {
              bfBuildingId: id,
              loginName,
            },
          });
        },
        onCancel() {},
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
    const handleOk = (cbFn,rtFn) => {
      cbFn((err, values) => {
        if (!err) {
          values.bfBuildingId = this.props.filterDetail.bfBuildingId
          values.loginName = loginName
           dispatch({
             type: 'filterDetail/editShowName',
             payload:values,
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
    const createFloor = () => {
      if (status === '1') {
        message.warning('请下架商品后再操作')
        return
      }
      // 查询 添加销售楼栋 列表
      if (createFloorShow){
         this.props.dispatch({
           type: "filterDetail/setFloorShow",
           payload: false,
         })
         message.loading('正在加载数据请稍后',10)
         this.props.dispatch({
           type: 'filterDetail/searchAddBuildingList',
           payload: {},
           success: () => {
             this.props.dispatch({
               type: 'filterDetail/createIsShow',
               payload: true,
             })
             this.props.dispatch({
               type: "filterDetail/setFloorShow",
               payload: true,
             })
             dispatch({
               type: 'filterDetail/saveOnchangePage',
               payload: 1
             })
            message.destroy()
           }
         })
      }
     
    }
    
    
    const columns = [
          {
            title: '楼栋展示名称',
            dataIndex: 'saleName',
            key: 'saleName',
            render: text => text || '--',
          },
          {
            title: 'OA楼栋名称',
            dataIndex: 'oaBuildingName',
            key: 'oaBuildingName',
            render: text => text || '--',
          },
          {
            title: 'OA楼栋ID',
            dataIndex: 'oaBuildingId',
            key: 'oaBuildingId',
            render: text => text || '--',
          },
          {
            title: 'OA楼盘名称',
            dataIndex: 'oaProjectName',
            key: 'oaProjectName',
            render: text => text || '--',
          },
          {
            title: '操作',
            dataIndex: 'operate',
            key: 'operate',
            render: (text,record) => {
              return (
                <span>
                   <a onClick={() => handelEdit(record)}>编辑</a>
                  &nbsp;&nbsp;
                  <a onClick={() => handelDel(record.id)}>删除</a>
                </span>
              )
            }
          },
        ]
    const editProps = {
      visible: this.state.visible,
      handleOk,
      handleCancel,
      showName: this.state.showName
    }
    const createProps = {
      filterDetail,
      visible: visibleCreate,
      showName: ''
    }
    return (
      <Page>
          <Filter handleSubmit={handleSubmit} resetValue={handleReset} filterDetail={filterDetail} />
          <Buttons name='添加销售楼栋' onClick={ createFloor } />
          <List columns={columns} dataSource={dataSource} pagination={{...pagination,onChange}} />
          <Edit {...editProps} />
          <Create {...createProps} />
          {/* <SearchTree me={this.props}  list={treeList} searchKeysList={[]} /> */}
          
      </Page>
    )
  }
}

FloorInfo.propTypes = {
  filterDetail: PropTypes.object,
  // dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default FloorInfo
