import React, { PureComponent } from 'react'
import { Menu, Dropdown, Icon,Row, Col, Button, Modal, message } from 'antd';
import { connect } from 'dva'
import PropTypes from 'prop-types'
import styles from '../index.less'
import './index.less'
import { deepCopy } from 'utils/copy'
import { bfProject, bfStatus, bfSwitchStatus } from 'utils/transformData'
const confirm = Modal.confirm;
import { router } from 'utils'
@connect(({ filterDetail, filter, loading, app }) => ({ filterDetail, loading, filter, app }))

class Header extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      status: 0,
      switchStatus: ''
    }
  }
  componentDidMount() {
    this.setState({
      name: this.props.query.name,
      status: this.props.query.status,
      switchStatus: this.props.query.switchStatus,
    })
  }
  onClick = ({ key}) => {
    const showProductList = this.props.filter.showProductList
    message.loading('正在切换请求请稍后', 3);
    const names = bfProject(key, showProductList) || '--'
    const status = bfStatus(key, showProductList) || ''
    const switchStatus = bfSwitchStatus(key, showProductList) || ''
    this.setState({
      name: names,
      status,
      switchStatus,
    })
    router.replace({
      pathname: '/productList/detail',
      query: {
        bfProjectId: key,
        status,
        switchStatus,
        name: names,
      },
    })
    this.props.dispatch({
      type: 'filterDetail/saveQuery',
      payload: {
        bfProjectId: key,
        status,
      },
    })
    //获取所属楼栋列表
    this.props.dispatch({
      type: 'filterDetail/getBuildinglist',
      payload: {
        bfProjectId: key,
      },
      success: (id) => {
        this.props.dispatch({
          type: 'filterDetail/getHouseListByBuildingId',
          payload: {
            data: {
              bfProjectId: key,
              buildingId: id,
            },
          },
        })
      }
    })
    // 日志列表
    this.props.dispatch({
      type: 'filterDetail/getLoglist',
      payload: {
        data: {
          bfProjectId: key,
        }
      },
    })
    // 楼栋信息列表
    this.props.dispatch({
      type: 'filterDetail/getPageList',
      payload: {
        bfProjectId: key,
      },
    })
    // 楼栋展示名称列表
    this.props.dispatch({
      type: 'filterDetail/getBuildingShowNameList',
      payload: {
        bfProjectId: key,
      },
    })
    // oa楼栋名称列表
    this.props.dispatch({
      type: 'filterDetail/getOaBuildingNameList',
      payload: {
        bfProjectId: key,
      },
    })
    // 楼盘信息查询
    this.props.dispatch({
      type: 'filterDetail/searchProjectInfo',
      payload: {
        bfProjectId: key,
      },
    })
    // 富文本信息查询
    this.props.dispatch({
      type: 'filterDetail/getUeditorInfo',
      payload: {
        bfProjectId: key,
      },
    })
    // 优惠政策信息查询
    this.props.dispatch({
      type: 'filterDetail/getUeditorPreInfo',
      payload: {
        bfProjectId: key,
      },
    })
    // 关注和浏览
    this.props.dispatch({
      type: 'filterDetail/followBrowse',
      payload: {
        bfProjectId: key,
      },
    })
    // 户型优惠
    this.props.dispatch({
      type: 'filterDetail/houseTypeDiscountList',
      payload: {
        bfProjectId: key,
      },
    })
    // 优惠户型列表
    this.props.dispatch({
      type: 'detailActivity/getPageList',
      payload: {
        bfProjectId: key,
      },
    })
    // 户型管理
    //户型名称列表
    this.props.dispatch({
      type: 'HouseManagement/gethouseTypeNameList',
      payload: {
        bfProjectId: key,
      },
    })
    //户型结构列表
    this.props.dispatch({
      type: 'HouseManagement/gethouseTypeStructureList',
      payload: {
        bfProjectId: key,
      },
    })
    this.props.dispatch({
      type: 'HouseManagement/getPageList',
      payload: {
        data: {
          bfProjectId: key
        },
        type: 'page',
      },
      // type:'page'
    })
    // 楼盘信息查询
    this.props.dispatch({
      type: 'buildingInfo/searchProjectInfo',
      payload: {
        bfProjectId: key,
      },
      success:(data) => {
        // console.log(data)
        this.props.dispatch({
          type: 'buildingInfo/getProvince',
          payload: {
          },
        })
        this.props.dispatch({
          type: 'buildingInfo/getCity',
          payload: {
            provinceId: data.lgProvinceName
          },
        })
        this.props.dispatch({
          type: 'buildingInfo/saveMediaImages',
          payload: {
            data:data.fileList
          },
        })
        this.props.dispatch({
          type: 'buildingInfo/saveMediaImages1',
          payload: {
            data: data.fileList1
          },
        })
        this.props.dispatch({
          type: 'buildingInfo/savelgMapAddress',
          payload: {
            data:data.lgMapAddress
          },
        })

      }
    })
    // 标签列表查询
    this.props.dispatch({
      type: 'buildingInfo/getTagList',
      payload: {
        bfProjectId: key,
      },
    })
    // 佣金信息
    this.props.dispatch({
      type: 'commission/getInfo',
      payload: {
        bfProjectId: key,
      },
    })
    // 楼盘动态
    this.props.dispatch({
      type: 'dynamic/getPageList',
      payload: {
        bfProjectId: key,
      },
    })
    
  };
  handelShow = () => {
    let that = this
    confirm({
      title: '确定要展示该房源吗？',
      content: '展示后，前端用户可查看此房源信息。',
      onOk() {
        that.props.dispatch({
          type: 'filter/showSwitch',
          payload: {
            bfProjectId: that.props.query.bfProjectId,
            switchStatus: 'ON'
          },
          success: () => {
            that.setState({
              switchStatus: 'ON',
            })
            router.replace({
              pathname: '/productList/detail',
              query: {
                bfProjectId: that.props.filterDetail.bfProjectId,
                status: that.state.status,
                switchStatus: 'ON',
              }
            })
          }
        })
      },
      onCancel() {},
    });
  } 
   handelHidden = () => {
     let that = this
     confirm({
      title: '确定要隐藏该房源吗？',
       content: '隐藏后，该商品信息在前端不可见。',
       onOk() {
         that.props.dispatch({
           type: 'filter/showSwitch',
           payload: {
             bfProjectId: that.props.query.bfProjectId,
             switchStatus: 'OFF'
           },
           success: () => {
             that.setState({
               switchStatus: 'OFF',
             })
             router.replace({
               pathname: '/productList/detail',
               query: {
                 bfProjectId: that.props.filterDetail.bfProjectId,
                 status: that.state.status,
                 switchStatus: 'OFF',
               }
             })
           }

         })
       },
       onCancel() {},
     });
   }
  // 发布
  handelRelease = () =>{
    let that =this
    confirm({
      title: '确定要发布该商品吗？',
      content: '发布后， 前端用户可查看商品信息',
      onOk() {
        that.props.dispatch({
          type: 'filter/downUp',
          payload: {
            id: that.props.query.bfProjectId,
            status: '1',
            loginName: that.props.app.user.loginName
          },
          success: () => {
            that.setState({
              status: '1',
            })
            router.replace({
              pathname: '/productList/detail',
              query: {
               bfProjectId: that.props.filterDetail.bfProjectId,
               status: '1',
               switchStatus: that.state.switchStatus
              }
            })
            that.props.dispatch({
              type: 'filterDetail/saveStatus',
              payload: {
                status: '1'
              },
            })
            // window.history.replaceState(that.props.query.bfProjectId, '', '?bfProjectId=' + that.props.filterDetail.bfProjectId + '&status=' + '1')
          }
          
        })
      },
      onCancel() {},
    });
  }
  // 下架
    handelOut = () => {
      let that = this
      confirm({
        title: '确定要下架该商品吗？',
        content: '下架后，该商品信息在前端不可见。',
        onOk() {
          that.props.dispatch({
            type: 'filter/downUp',
            payload: {
              id: that.props.query.bfProjectId,
              status: '0',
              loginName: that.props.app.user.loginName
            },
            success: () => {
              router.replace({
                pathname: '/productList/detail',
                query: {
                  bfProjectId: that.props.filterDetail.bfProjectId,
                  status: '0',
                  switchStatus: that.state.switchStatus
                }
              })
              that.setState({
                status: '0',
              })
              that.props.dispatch({
                type: 'filterDetail/saveStatus',
                payload: {
                  status: '0'
                },
              })
              // window.history.replaceState(that.props.query.bfProjectId, '', '?bfProjectId=' + that.props.query.bfProjectId + '&status=' + '0')
            }
          })
        },
        onCancel() {},
      });
    }
  // 同步更新
  handelUpdate = () => {
    this.props.dispatch({
      type: 'filter/goUpdate',
      payload: {
        bfProjectId: this.props.query.bfProjectId,
      }
    })
    const key = this.props.query.bfProjectId
     //获取所属楼栋列表
     this.props.dispatch({
       type: 'filterDetail/getBuildinglist',
       payload: {
         bfProjectId: key,
       },
       success: (id) => {
         this.props.dispatch({
           type: 'filterDetail/getHouseListByBuildingId',
           payload: {
             data: {
               bfProjectId: key,
               buildingId: id,
             },
           },
         })
       }
     })
     // 日志列表
     this.props.dispatch({
       type: 'filterDetail/getLoglist',
       payload: {
         data: {
           bfProjectId: key,
         }
       },
     })
     // 楼栋信息列表
     this.props.dispatch({
       type: 'filterDetail/getPageList',
       payload: {
         bfProjectId: key,
       },
     })
     // 楼栋展示名称列表
     this.props.dispatch({
       type: 'filterDetail/getBuildingShowNameList',
       payload: {
         bfProjectId: key,
       },
     })
     // oa楼栋名称列表
     this.props.dispatch({
       type: 'filterDetail/getOaBuildingNameList',
       payload: {
         bfProjectId: key,
       },
     })
     // 楼盘信息查询
     this.props.dispatch({
       type: 'filterDetail/searchProjectInfo',
       payload: {
         bfProjectId: key,
       },
     })
     // 富文本信息查询
     this.props.dispatch({
       type: 'filterDetail/getUeditorInfo',
       payload: {
         bfProjectId: key,
       },
     })
     // 优惠政策信息查询
     this.props.dispatch({
       type: 'filterDetail/getUeditorPreInfo',
       payload: {
         bfProjectId: key,
       },
     })
     // 关注和浏览
     this.props.dispatch({
       type: 'filterDetail/followBrowse',
       payload: {
         bfProjectId: key,
       },
     })
     // 户型优惠
     this.props.dispatch({
       type: 'filterDetail/houseTypeDiscountList',
       payload: {
         bfProjectId: key,
       },
     })
     // 优惠户型列表
     this.props.dispatch({
       type: 'detailActivity/getPageList',
       payload: {
         bfProjectId: key,
       },
     })
     
  }
  render() {
      const { filterDetail,filter  } = this.props
      const { countAndScan } = filterDetail
      const { showProductList } = filter
      
      const menu = (list) => {
        return(
          <Menu onClick={this.onClick}>
            {
              list.map(item =>
                <Menu.Item  key={item.bfProjectId} name={item.bfProjectName}>{item.bfProjectName}</Menu.Item>
              )
            } 
          </Menu>
        )
      }
       
      return (
        <div className={styles.bg} id = "dropdown" style={{position:'relative'}}>
            <Dropdown overlay={menu(showProductList)}  trigger={['click']} getPopupContainer={() => document.getElementById('dropdown')}>
              <a  href="#" className={styles.drop}>
                {this.state.name} < Icon type = "caret-down" className={styles.icon} />
              </a>
            </Dropdown>
            <Row gutter={24} className={styles.statistical}>
              <Col span={3}>
                  <div>浏览数:</div>
                  <span className={styles.num}>{countAndScan.browseCount}</span>
              </Col>
              <Col span={3}>
                  <div>关注数:</div>
                  <span className={styles.num}>{countAndScan.collectCount}</span>
              </Col>
            </Row>
            <div style={{position:'absolute',right:'15px',top:'15px'}}>
                {
                  this.props.query.status == '0' ? < Button type = "primary"
                  onClick = {
                    this.handelRelease
                  } > 发布 </Button>
                  :  <Button type="primary" onClick={this.handelOut}>下架</Button>
                }
                &nbsp;&nbsp;
                {/* <Button onClick={this.handelUpdate}><Icon type="reload" />同步更新</Button>
                &nbsp;&nbsp; */}
                {
                  this.props.query.switchStatus == 'ON' ? < Button
                  onClick = {
                    this.handelHidden
                  } > 隐藏房源 </Button>
                  :  <Button onClick={this.handelShow}>展示房源</Button>
                }
            </div>
        </div>
      );
   }   
};

{/* // Header.propTypes = {
//   resetValue: PropTypes.func,
//   handleSubmit: PropTypes.func,
//   filter: PropTypes.object,
// } */}
export default Header;
