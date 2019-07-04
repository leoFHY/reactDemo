import React, { Component } from 'react'
import { connect } from 'dva'
import { Button, Modal, Tree, Col, Row } from 'antd'
import { hashHistory } from 'dva/router'
import RoleMemberList from './roleMember'
import RoleDetail from './roleDetail'

const confirm = Modal.confirm
const TreeNode = Tree.TreeNode
class RoleDistribution extends Component {
  constructor (props) {
    super(props)
    this.state = {
      visible: false,
    }
  }
  handleDistributionRole () {
    this.setState({
      visible: true,
    })
    this.props.dispatch({
      type: 'roleManagement/setSelectUserList',
      payload: {
        userList: [...this.props.roleManagement.userByRoleList],
      },
    })
  }
  handleCancel () {
    this.setState({
      visible: false,
    })
  }
  handleAdd () {
    let userIds = []
    let type = ''
    userIds = this.props.roleManagement.selectUserByRoleList.map((e) => {
      return e.id
    })
    type = 'add'
    this.props.dispatch({
      type: 'roleManagement/addRoleUser',
      payload: {
        userIds,
        roleId: this.props.roleManagement.selectRole.id,
        type,
      },
    })
    this.setState({
      visible: false,
    })
  }
  handleRemove () {
    const that = this
    confirm({
      title: '删除确认',
      content: '确定清空用户吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk () {
        let userIds = []
        let type = ''
        userIds = []
        type = 'remove'

        that.props.dispatch({
          type: 'roleManagement/addRoleUser',
          payload: {
            userIds,
            roleId: that.props.roleManagement.selectRole.id,
            type,
          },
        })
      },
      onCancel () {
      },
    })
  }
  handleTreeSelectOffice (selectedKeys, info) {
    let data = {}
    if (info.selectedNodes[0].props.dataRef.type === '1') {
      data = {
        companyId: selectedKeys[0],
        officeId: '',
      }
    } else {
      data = {
        companyId: '',
        officeId: selectedKeys[0],
      }
    }
    this.props.dispatch({
      type: 'roleManagement/getUserById',
      payload: {
        ...data,
        pageSize: 999,
      },
    })
  }
  handleTreeSelectUser (selectedKeys, info) {
    let userList = this.props.roleManagement.selectUserByRoleList.map((e) => {
      // return e.id !== info.selectedNodes[0].props.dataRef.id
      if (e.id === info.selectedNodes[0].props.dataRef.id) {
        return e
      }
      return e
    })
    // let userList = new Set([...userList, info.selectedNodes[0].props.dataRef])
    // Array.from(namesSet)
    this.props.dispatch({
      type: 'roleManagement/setSelectUserList',
      payload: {
        userList: [...userList, info.selectedNodes[0].props.dataRef],
      },
    })
  }
  handleTreeRemoveUser (selectedKeys, info) {
    let userList = this.props.roleManagement.selectUserByRoleList.filter((e) => {
      return selectedKeys[0] !== e.id
    })

    this.props.dispatch({
      type: 'roleManagement/setSelectUserList',
      payload: {
        userList: [...userList],
      },
    })
  }
  renderTreeNodes (data) {
    return data.map((item) => {
      if (item.children) {
        return (<TreeNode title={item.name} key={item.id} dataRef={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>)
      }
      return (<TreeNode title={item.name} key={item.id} dataRef={item} />)
    })
  }
  render () {
    const style = {
      content: {
        marginBottom: '20px',
      },
      btn: {
        marginRight: '20px',
      },
    }
    return (
      <div>
        <div style={style.content} >
          <Modal
            title="分配角色"
            visible={this.state.visible}
            onCancel={this.handleCancel.bind(this)}
            footer={[
              <Button key="submit" onClick={this.handleAdd.bind(this)} type="primary">确定分配</Button>,
              <Button key="clear" onClick={this.handleRemove.bind(this)}>清除已选</Button>,
              <Button key="close" onClick={this.handleCancel.bind(this)}>关闭</Button>,
            ]}
          >
            <Row>
              <Col span="8">
                <p>所在部门：</p>
                <Tree showLine onSelect={this.handleTreeSelectOffice.bind(this)}>
                  {this.renderTreeNodes(this.props.roleManagement.treeList)}
                </Tree>
              </Col>
              <Col span="8">
                <p>待选人员：</p>
                <Tree showLine onSelect={this.handleTreeSelectUser.bind(this)}>
                  {this.renderTreeNodes(this.props.roleManagement.user)}
                </Tree>
              </Col>
              <Col span="8">
                <p>已选人员：</p>
                <Tree showLine onSelect={this.handleTreeRemoveUser.bind(this)}>
                  {this.renderTreeNodes(this.props.roleManagement.selectUserByRoleList)}
                </Tree>
              </Col>
            </Row>
          </Modal>
        </div>
        <RoleDetail />
        <Button onClick={this.handleDistributionRole.bind(this)} type="primary" style={{ marginBottom: '20px' }} >分配角色</Button>
        <RoleMemberList />
      </div>
    )
  }
}


export default connect(({ roleManagement }) => ({ roleManagement }))(RoleDistribution)
