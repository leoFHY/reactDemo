import React, { Component } from 'react'
import { connect } from 'dva'
// import { hashHistory } from 'dva/router'
// import PropTypes from 'prop-types'
import UserContent from './components/content'
import Trees from '../components/tree'

const UserManagement = ({
  userManagement,
  dispatch,
}) => {
  /* 重新获取树数据 */
  const handleReload = () => {
    dispatch({
      type: 'userManagement/getTree',
      payload: {
      },
    })
  }
  /* 选中树节点 */
  const handleTreeSelect = (selectedKeys, info) => {
    console.log(selectedKeys);
    console.log(info);
    const selectedNodes = info.selectedNodes[0]
    const dataRef = selectedNodes && selectedNodes.props && selectedNodes.props.dataRef
    // companyId: selectedKeys,
    // officeId:
    let data = {
      companyId: '',
      officeId: '',
    }
    if (dataRef && dataRef.type === '1') {
      data = {
        companyId: selectedKeys[0],
        officeId: '',
      }
    } else if (dataRef && dataRef.type === '2') {
      data = {
        companyId: '',
        officeId: selectedKeys[0],
      }
    } else {
      // return
    }
    /* 存储treeId */
    dispatch({
      type: 'userManagement/setSearch',
      payload: {
        ...data,
      },
    })
    /* 获取用户列表 */
    dispatch({
      type: 'userManagement/getUserList',
      payload: {
        ...data,
      },
    })
  }
  const contents = {
    contents: <UserContent />,
    name: userManagement,
    handleReload,
    handleTreeSelect,

  }
  return (
    <Trees {...contents} />
  )
}

export default connect(({ userManagement }) => ({ userManagement }))(UserManagement)
