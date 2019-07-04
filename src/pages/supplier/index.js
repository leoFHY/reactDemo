import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Page } from 'components'
import styles from './index.less';
import { Modal } from 'antd';
import Filter from './components/Filter';
import List from './components/List';
import Create from './components/CreateModal';
import Edit from './components/CreateModal';
import QrCode from './components/QrCode';
import Buttons from 'components/Buttons'
const confirm = Modal.confirm;

@connect(({ supplier, loading }) => ({ supplier, loading }))
class Project extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      visibleEdit: false,
      supplierId: '',
      url: '',
      visibleQrCode: false,
      code: '',
    }
  }

  render() {
    const { dispatch, supplier } = this.props
    const { dataSource,pagination } = supplier
    const { visible,visibleEdit,supplierId,url,visibleQrCode,code } = this.state
    // 搜索   
    const handleSubmit = cbFn => {
      cbFn((err, values) => {
        if (!err) {
          dispatch({
            type: 'supplier/getPageList',
            payload: {
              data: values,
              type: 'search',
            },
          })
        }
      })
    }
    // 分页
    const onChange = page => {
      dispatch({
        type: 'supplier/getPageList',
        payload: {
          pageNum: page,
          pageSize: 10,
        },
      })
      dispatch({
        type: 'supplier/saveOnchangePage',
        payload: page
      })
    }
    // 重置
    const handleReset = cbFn => {
      cbFn && cbFn();
      dispatch({
        type: 'supplier/getPageList',
        payload: {
          data: {},
          type: 'reset',
        },
      });
      dispatch({
        type: 'supplier/saveOnchangePage',
        payload: 1
      })
    };
    // 创建商品
    const createProject = () => {
       this.setState({
          visible: true
        })
      
    }
    // 弹出框取消
    const handleCancel = (rtFn) => {
      rtFn && rtFn()
      this.setState({
        visible: false,
      });
    }
    // 弹出框确定
    const handleOk = (cbFn,rtFn) => {
      cbFn((err, values) => {
        if (!err) {
           dispatch({
             type: 'supplier/editSupplier',
             payload: {
               data: values,
               type: 'create',
             },
             success: () => {
               this.setState({
                 visible: false,
               });
              //  dispatch({
              //    type: 'supplier/saveOnchangePage',
              //    payload: 1
              //  })
             }
           })
        }
      });
      rtFn && rtFn()
    }
   
   
    
    const modalProps = { 
      visible : visible,
      handleOk,
      handleCancel,
      supplier,
      name: '新建渠道',
      supplierName: ''
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
          values.supplierId = supplierId
          dispatch({
            type: 'supplier/editSupplier',
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
       supplier,
       name: '编辑',
       supplierName: supplier.supplierName,
     }
    const onEdit = (record) => {
      this.setState({
        supplierId: record.supplierId,
        visibleEdit: true,
      })
      dispatch({
          type: 'supplier/saveEdit',
          payload: {
            data: record.supplierName
          }
      })
    }
    const viewQrCode = (url, code) => {
      this.setState({
        url,
        visibleQrCode: true,
        code,
      })
    }

    // 弹出框取消
    const clickCancel = () => {
      this.setState({
        visibleQrCode: false,
      })
    }
    
    
    const onDown1 = (code, url) => {
      let a = document.createElement('a')
      a.href = url
      a.download = `${code}.png`
      a.click()
    }
    const onDown2 = (code) => {
      // let canvas = document.getElementsByTagName('canvas')[2]
      // var type = "image/png";
      // var imgData = canvas.toDataURL(type);
      // var filename = `${code}1000X1000.png`;
      // saveFile(imgData, filename);
    }
    const qrCodeProps = {
      visible: visibleQrCode,
      url: url,
      handleCancel: clickCancel,
      supplier,
      code,
      onDown1,
      onDown2,
    }
    
    const onDel = (supplierId) => {
      confirm({
        title: '确定要删除该渠道吗？',
        content: '删除后用户将不可见',
        onOk() {
          dispatch({
            type: 'supplier/del',
            payload: {
              supplierId
            }
          })
        },
        onCancel() {},
      });
    }

    const columns = [
          {
            title: '供应商名称',
            dataIndex: 'supplierName',
            key: 'supplierName',
            render: text => text || '--',
          },
          {
            title: '供应商识别码',
            dataIndex: 'code',
            key: 'code',
            render: text => text || '--',
          },
          {
            title: '操作',
            dataIndex: 'operate',
            key: 'operate',
            render: (text,record) => {
              return (
                <span>
                  <a onClick={ () => onEdit(record)  }>编辑</a>
                   &nbsp;&nbsp;
                  <a onClick={ () => onDel(record.supplierId)  }>删除</a>
                  &nbsp;&nbsp;
                  <a onClick={() => viewQrCode(record.qrCodeUrl,record.code) }>查看二维码</a>
                </span>
              )
            }
          },
        ]
    return (
      <Page className={styles.bg}>
          <Filter handleSubmit={handleSubmit} resetValue={handleReset} supplier={supplier} />
          <Buttons name='新建供应商' onClick={ createProject } />
          <List columns={columns} dataSource={dataSource} paginationpagination={{...pagination,onChange}}  />
          <Create {...modalProps} />
          <Edit  {...editProps}/>
          <QrCode {...qrCodeProps} />
      </Page>
    )
  }
}

Project.propTypes = {
  filter: PropTypes.object,
  // dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default Project
