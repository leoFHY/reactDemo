import React from 'react'
import { connect } from 'dva'
import { Input, Button, Form, TreeSelect, Col, Row } from 'antd'
// import { hashHistory } from 'dva/router'
// import PropTypes from 'prop-types'

const TreeNode = TreeSelect.TreeNode
const FormItem = Form.Item
const styles = {
  formItemLayout: {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 14,
    },
  },
}
const formItemLayout = styles.formItemLayout
const Filter = ({
  dispatch,
  form,
  userManagement,
}) => {
  const handleReset = () => {
    dispatch({
      type: 'userManagement/setSearch',
      payload: {
        companyId: '',
        name: '',
        officeId: '',
        loginName: '',
      },
    })
    dispatch({
      type: 'userManagement/getUserList',
      payload: {
        companyId: '',
        name: '',
        officeId: '',
        loginName: '',
        pageNum: 1,
      },
    })
    form.resetFields()
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    form.validateFields((error, values) => {
      if (!error) {
        dispatch({
          type: 'userManagement/setSearch',
          payload: {
            companyId: values.companyId,
            name: values.filterName,
            officeId: values.officeId,
            loginName: values.filterLoginName,
          },
        })
        dispatch({
          type: 'userManagement/getUserList',
          payload: {
            companyId: values.companyId,
            name: values.filterName,
            officeId: values.officeId,
            loginName: values.filterLoginName,
            pageNum: 1,
          },
        })
      }
    })
  }
  const renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (<TreeNode title={item.name} key={item.id} dataRef={item} value={item.id} selectable={(() => {
          if (item.type === '1') {
            return false
          }
          return true
        })()}
        >
          {renderTreeNodes(item.children)}
        </TreeNode>)
      }
      return (<TreeNode title={item.name} key={item.id} dataRef={item} value={item.id} selectable />)
    })
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col span="8">
          <FormItem label={'姓名:'} {...formItemLayout}>
            {form.getFieldDecorator('filterName', {
              initialValue: userManagement.filterName,
            })(
              <Input size="large" />
            )}
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label={'归属公司:'} {...formItemLayout}>
            {form.getFieldDecorator('companyId', {
              initialValue: userManagement.companyId,
            })(
              <TreeSelect
                treeNodeFilterProp="title"
                showSearch
                allowClear
                treeData={userManagement.companyList}
                treeDefaultExpandAll
              />
            )}
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label={'归属部门:'} {...formItemLayout}>
            {form.getFieldDecorator('officeId', {
              initialValue: userManagement.officeId,
            })(
              <TreeSelect
                treeNodeFilterProp="title"
                showSearch
                allowClear
                treeDefaultExpandAll
              >
                {renderTreeNodes(userManagement.treeList)}
              </TreeSelect>
            )}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="8">
          <FormItem label={'登录名:'} {...formItemLayout}>
            {form.getFieldDecorator('filterLoginName', {
              initialValue: userManagement.filterLoginName,
            })(
              <Input size="large" />
            )}
          </FormItem>
        </Col>
        <Col>
          <Button size="large" type="primary" htmlType="submit">
          搜索
          </Button>
          <Button size="large" onClick={handleReset} style={{ margin: '0 10px' }}>
          重置
          </Button>
          {/* <Button size="large" onClick={handleExport} style={{ margin: '0 10px' }}>
          导出
          </Button>
          <Button size="large" onClick={handleImport}>
          导入
          </Button> */}
        </Col>
      </Row>
    </Form>
  )
}

const UserFilter = Form.create()(Filter)
export default connect(({ userManagement }) => ({ userManagement }))(UserFilter)
