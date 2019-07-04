import React, { Component } from 'react'
import { connect } from 'dva'
import { Input, Button, Form, Row, Col, Select, TreeSelect } from 'antd'
import { hashHistory } from 'dva/router'

const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option
const TreeNode = TreeSelect.TreeNode

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
}
const style = {
  butn: {
    textAlign: 'center',
  },
  butnStyle: {
    margin: '0 20px',
  },
  fromStyle: {
    position: 'relative',
  },
}
const Filter = ({
  dispatch,
  form,
  roleManagement,
  argums,
}) => {
  const handleCallBack = () => {
    dispatch({
      type: 'roleManagement/setTabKeys',
      payload: {
        key: '1',
        text: '新增',
      },
    })
    form.resetFields()
  }
  const handleReset = () => {
    form.resetFields()
  }
  argums.getHandleReset(handleReset)
  const handleSubmit = (e) => {
    e.preventDefault()
    form.validateFields((error, value) => {
      if (!error) {
        if (roleManagement.tabText === '修改') {
          value.id = roleManagement.roleDetail.id
        }
        dispatch({
          type: 'roleManagement/addRoleSubmit',
          payload: {
            ...value,
          },
        })
        form.resetFields()
      }
    })
  }
  const handleSelect = (e) => {
  }
  const renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (<TreeNode title={item.name} key={item.id} dataRef={item} value={item.id}>
          {renderTreeNodes(item.children)}
        </TreeNode>)
      }
      return (<TreeNode title={item.name} key={item.id} dataRef={item} value={item.id} />)
    })
  }
  const renderTreeNodesRool = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (<TreeNode title={item.name} key={item.id} dataRef={item} value={item.id} selectable={false}>
          {renderTreeNodes(item.children)}
        </TreeNode>)
      }
      return (<TreeNode title={item.name} key={item.id} dataRef={item} value={item.id} />)
    })
  }
  return (
    <Form onSubmit={handleSubmit}>
      {/* <FormItem label={'归属机构:'} {...formItemLayout} style={style.fromStyle} >
        {form.getFieldDecorator('officeId', {
          rules: [{
            required: true,
            message: '归属机构必填！',
          }],
          initialValue: roleManagement.tabText === '修改' ? roleManagement.roleDetail.officeId : '',
        })(
          <TreeSelect
            treeNodeFilterProp="title"
            showSearch
            allowClear
            treeDefaultExpandAll
            onSelect={(value) => {
              setTimeout(() => {
                form.setFieldsValue({ officeId: value })
              }, 50)
            }}
          >
            {renderTreeNodes(roleManagement.treeList)}
          </TreeSelect>
        )}
      </FormItem> */}
      <FormItem label={'角色名称:'} {...formItemLayout} >
        {form.getFieldDecorator('name', {
          rules: [{
            required: true,
            message: '角色名称必填！',
          }],
          initialValue: roleManagement.tabText === '修改' ? roleManagement.roleDetail.name : '',
        })(
          <Input />
        )}
      </FormItem>
      <FormItem label={'英文名称:'} extra="工作流用户组标识" {...formItemLayout} >
        {form.getFieldDecorator('enname', {
          rules: [{
            required: true,
            message: '英文名称必填！',
          },
          {
            pattern: /^[A-Za-z]+$/,
            message: '请输入英文！',
          },
          ],
          initialValue: roleManagement.tabText === '修改' ? roleManagement.roleDetail.enname : '',
        })(
          <Input />
        )}
      </FormItem>
      {/* <FormItem label={'角色类型:'} extra="工作流组用户组类型(任务分配：assignment、管理角色：security-role、普通角色：user)" {...formItemLayout} >
        {form.getFieldDecorator('roleType', {
          initialValue: roleManagement.tabText === '修改' ? roleManagement.roleDetail.roleType : 'assignment',
        })(
          <Select>
            <Option value="assignment">任务分配</Option>
            <Option value="security-role">管理角色</Option>
            <Option value="user">普通角色</Option>
          </Select>
        )}
      </FormItem> */}
      {/* <FormItem label={'是否系统数据:'} extra="“是”代表此数据只有超级管理员能进行修改,“否”则表示拥有角色修改人员的权限都能进行修改" {...formItemLayout} >
        {form.getFieldDecorator('isSys', {
          initialValue: roleManagement.tabText === '修改' ? roleManagement.roleDetail.isSys : '1',
        })(
          <Select>
            <Option value="1">是</Option>
            <Option value="0">否</Option>
          </Select>
      )}
      </FormItem> */}
      <FormItem label={'是否可用:'} extra="“是”代表此数据可用,“否”则表示此数据不可用" {...formItemLayout} >
        {form.getFieldDecorator('useable', {
          initialValue: roleManagement.tabText === '修改' ? roleManagement.roleDetail.useable : '1',
        })(
          <Select>
            <Option value="1">是</Option>
            <Option value="0">否</Option>
          </Select>
        )}
      </FormItem>
      {/* <FormItem label={'数据范围:'} extra="特殊情况下,设置为“按明细设置”,可进行跨机构授权" {...formItemLayout} >
        {this.props.form.getFieldDecorator('dataRange', {
          initialValue: this.props.roleManagement.roleDetail.dataScope,
        })(
          <Select>{
              this.props.roleManagement.dataRange.map((e) => <Option value={e.ID} key={e.ID}>{e.text}</Option>)
          }</Select>
      )}
      </FormItem> */}
      <FormItem label={'角色授权:'} {...formItemLayout} >
        {form.getFieldDecorator('menuIds', {
          initialValue: roleManagement.tabText === '修改' ? roleManagement.roleDetail.menuIds : [],
        })(
          <TreeSelect
            // treeCheckable
            allowClear
            // treeData={this.props.roleManagement.roleTree}
            treeDefaultExpandAll
            // onChange={handleSelect}
            multiple
          >
            {renderTreeNodesRool(roleManagement.roleTree)}
          </TreeSelect>
        )}
      </FormItem>
      <FormItem label={'备注:'} {...formItemLayout} >
        {form.getFieldDecorator('remarks', {
          initialValue: roleManagement.tabText === '修改' ? roleManagement.roleDetail.remarks : '',
        })(
          <TextArea autosize={{ minRows: 2, maxRows: 6 }} />
        )}
      </FormItem>

      <FormItem style={style.butn}>
        <Button size="large" onClick={handleCallBack}>返回</Button>
        <Button size="large" type="primary" htmlType="submit" style={style.butnStyle}>
        提交
        </Button>
        {
          roleManagement.tabText === '修改' ? '' :
            <Button size="large" onClick={handleReset}>
          重置
            </Button>
        }
      </FormItem>
    </Form>
  )
}

const AddRole = Form.create()(Filter)
export default connect(({ roleManagement }) => ({ roleManagement }))(AddRole)
