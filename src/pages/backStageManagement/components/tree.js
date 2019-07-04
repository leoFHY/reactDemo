import React, { Component } from 'react'
import { Tree, Col, Row, Layout, Icon, Spin } from 'antd'

const { Content, Sider } = Layout

const TreeNode = Tree.TreeNode


class Trees extends Component {
  constructor (props) {
    super(props)
    this.state = {
      collapsed: false,
    }
  }
  toggle () {
    this.setState({
      collapsed: !this.state.collapsed,
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
      textAlign: 'center',
      height: '35px',
      lineHeight: '35px',
      fontSize: '14px',
      backgroundColor: '#f4f4f4',
      color: '#108ee9',
    }
    const { name, handleReload, handleTreeSelect, contents } = this.props
    return (
      <Layout style={{ background: 'content-box' }}>
        <Sider width={200}
          style={{ background: '#fff', border: '1px solid #eee' }}
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
          collapsedWidth="0"
        >
          <Row type="flex" justify="space-between" style={style}>
            <Col span="10">组织机构</Col>
            <Col span="4">
              <Icon
                className="trigger"
                type="reload"
                spin={name.isreload}
                onClick={handleReload.bind(this)}
              />
            </Col>
          </Row>
          <Row style={{ paddingBottom: '40px', overflow: 'auto' }}>
            <div style={{ textAlign: 'center', position: 'absolute', top: 20, zIndex: 100, left: 85 }}>
              <Spin spinning={name.isreload} />
            </div>
            { name.treeList && name.treeList.length ?
              <Tree defaultExpandAll showLine onSelect={handleTreeSelect.bind(this)}>
                {this.renderTreeNodes(name.treeList)}
              </Tree>
              : ''}
          </Row>
        </Sider>

        <Row type="flex" justify="space-around" align="middle">
          <Col span={4}>
            <Icon
              className="trigger"
              type={this.state.collapsed ? 'double-right' : 'double-left'}
              onClick={this.toggle.bind(this)}
              style={{
                cursor: 'pointer',
              }}
            />
          </Col>
        </Row>
        <Content style={{ padding: '0 24px', minHeight: 280 }}>
          {contents}
        </Content>
      </Layout>
    )
  }
}

export default Trees
