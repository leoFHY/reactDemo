import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import UserContent from './components/main'
import Trees from '../components/tree'

const Index = ({
  organizationManagement,
  dispatch,
  location,
  children,
}) => {
  /* 重新获取树数据 */
  const handleReload = () => {
    dispatch({
      type: 'organizationManagement/getLeftTreeData',
      payload: {
      },
    })
  }
  /* 选中树节点 */
  const handleTreeSelect = (selectedKeys, info) => {
    if (selectedKeys[0]) {
      dispatch({
        type: 'organizationManagement/getList',
        payload: {
          officeId: selectedKeys[0],
        },
      })
      if (location.pathname !== '/backStageManagement/organizationManagement') {
        // hashHistory.push({
        //   pathname: '/organizationManagement',
        //   query: {
        //   },
        //   state: {
        //     officeId: selectedKeys[0],
        //   },
        // })
        dispatch(routerRedux.push({
          pathname: '/backStageManagement/organizationManagement',
          state: {
            officeId: selectedKeys[0],
          },
        }))
      }
    }
  }
  const contents = {
    contents: <UserContent location={location} add={children} />,
    name: organizationManagement,
    handleReload,
    handleTreeSelect,
  }
  return (
    <Trees {...contents} />
  )
}

// Index.propTypes = {
//   organizationManagement: PropTypes.object.isRequired,
//   dispatch: PropTypes.func.isRequired,
// }

export default connect(({ organizationManagement }) => ({ organizationManagement }))(Index)
