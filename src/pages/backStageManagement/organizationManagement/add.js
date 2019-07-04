import React, { Component } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Form, Input, Button, Select, TreeSelect, Checkbox } from 'antd'

const FormItem = Form.Item
const Option = Select.Option
const CheckboxGroup = Checkbox.Group
const TextArea = Input.TextArea
const TreeNode = TreeSelect.TreeNode
const formatPageList = (data, id = '') => {
  let pageListTree = []
  data.forEach((v) => {
    if (v.id === id) {
      return
    }
    let o = {}
    o.label = v.name
    o.title = v.name
    o.id = v.id
    o.name = v.name
    o.value = v.id
    o.key = v.id
    if (v.children) {
      o.children = formatPageList(v.children, id)
    }
    pageListTree.push(o)
  })
  return pageListTree
}
const treeNodeSelectable = (node) => {
  let bool = false
  if (node) {
    bool = true
  }
  return bool
}

const renderTreeNode = (data) => {
  return data.map((item) => {
    if (item.children) {
      return (<TreeNode title={item.label} key={item.key} dataRef={item} value={item.value}
        selectable={treeNodeSelectable(item.node)}
      >
        {renderTreeNode(item.children)}
      </TreeNode>)
    }
    return (<TreeNode title={item.label} key={item.key} dataRef={item} value={item.value}
      selectable={treeNodeSelectable(item.node)}
    />)
  })
}

class Add extends Component {
  constructor (props) {
    super(props)
    this.state = {
      // parentId: '',
    }
  }
  handleSubmit (e) {
    e.preventDefault()
    // const state = this.state
    const id = this.props.organizationManagement.detailData.id
    const typeItem = this.props.organizationManagement.detailData.typeItem
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (id && typeItem) {
          values.parentId = values.parentId === '' ? '0' : values.parentId
          this.props.dispatch({
            type: 'organizationManagement/update',
            payload: { ...values, id },
          })
        } else {
          this.props.dispatch({
            type: 'organizationManagement/add',
            payload: { ...values },
          })
        }
      }
    })
  }
  back () {
    this.props.dispatch(routerRedux.push({
      pathname: '/backStageManagement/organizationManagement',
      query: {
      },
      state: {
        item: 'back',
        officeId: this.props.organizationManagement.saveOfficeId,
      },
    }))
  }
  resertAll () {
    this.props.form.resetFields()
    // this.state.parentId = ''
  }
  parentId (value, label, extra) {
    let m = extra.selected ? extra.triggerValue : ''
    this.state.parentId = m
  }
  render () {
    const model = this.props.organizationManagement
    const { getFieldDecorator } = this.props.form
    const isUpdate = this.props.location.query.item === 'update'
    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 14,
      },
    }
    return (
      <div>
        <Form onSubmit={this.handleSubmit.bind(this)} autoComplete="off">
          <FormItem {...formItemLayout} label="上级机构" hasFeedback key="parentId">
            {getFieldDecorator('parentId', {
              initialValue: model.detailData.parentId === '0' ? '' : model.detailData.parentId,
              rules: [{
                // required: true, message: '上级机构为必填',
              }],
            })(
              <TreeSelect
                showSearch
                allowClear
                treeNodeFilterProp="label"
                dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                // treeData={formatPageList(model.treeList, model.detailData.id)}
                treeData={formatPageList(model.treeList || [], model.detailData.id)}
                placeholder="请选择上级机构"
                onSelect={(value) => {
                  setTimeout(() => {
                    this.props.form.setFieldsValue({ parentId: value })
                  }, 50)
                }}
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="机构名称" hasFeedback key="name">
            {getFieldDecorator('name', {
              initialValue: model.detailData.name,
              rules: [{
                required: true, message: '机构名称为必填',
              }],
            })(
              <Input placeholder="请填写机构名称" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="备注" hasFeedback key="remarks">
            {getFieldDecorator('remarks', {
              initialValue: model.detailData.remarks,
              rules: [{
                // required: true, message: '备注为必填',
              }],
            })(
              <TextArea placeholder="请填写备注" />
            )}
          </FormItem>
          {/* <FormItem {...formItemLayout} label="归属区域" hasFeedback key="areaId">
            {getFieldDecorator('areaId', {
              initialValue: model.detailData.areaId,
              rules: [{
                required: true, message: '归属区域为必填',
              }],
            })(
              <TreeSelect
                showSearch
                allowClear
                treeNodeFilterProp="label"
                dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                treeData={formatPageList(model.treeDataAreaList)}
                placeholder="请选择归属区域"
                onSelect={(value) => {
                  setTimeout(() => {
                    this.props.form.setFieldsValue({ areaId: value })
                  }, 100)
                }}
              />
            )}
          </FormItem>
          
          <FormItem {...formItemLayout} label="机构编码" hasFeedback key="code">
            {getFieldDecorator('code', {
              initialValue: model.detailData.code,
              rules: [{
                // required: true, message: '机构编码为必填',
              }],
            })(
              <Input placeholder="请填写机构编码" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="机构类型" hasFeedback key="type">
            {getFieldDecorator('type', {
              initialValue: model.detailData.type || '2',
              rules: [{
                required: true, message: '机构类型为必填',
              }],
            })(
              <Select placeholder="请选择机构类型">
                {model.typeList.map((item) => {
                  return (<Option value={item.id} key={item.id}>{item.name}</Option>)
                })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="机构级别" hasFeedback key="grade">
            {getFieldDecorator('grade', {
              initialValue: model.detailData.grade || '1',
              rules: [{
                required: true, message: '机构级别为必填',
              }],
            })(
              <Select placeholder="请选择机构级别">
                {model.gradeList.map((item) => {
                  return (<Option value={item.id} key={item.id}>{item.name}</Option>)
                })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="是否可用" hasFeedback key="useable">
            {getFieldDecorator('useable', {
              initialValue: model.detailData.useable || '1',
              rules: [{
                required: true, message: '是否可用为必填',
              }],
            })(
              <Select placeholder="请选择是否可用">
                {model.useableList.map((item) => {
                  return (<Option value={item.id} key={item.id}>{item.name}</Option>)
                })}
              </Select>
            )}
          </FormItem> */}
          {/*
          <FormItem {...formItemLayout} label="主负责人" hasFeedback key="primaryPerson">
            {getFieldDecorator('primaryPerson', {
              initialValue: model.detailData.primaryPerson,
              rules: [{
                // required: true, message: '主负责人为必填',
              }],
            })(
              <TreeSelect
                showSearch
                allowClear
                dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                // treeData={model.treeDataUserList}
                placeholder="请选择主负责人"
                // onChange={this.person.bind(this)}
              >
                {renderTreeNode(model.treeDataUserList)}
              </TreeSelect>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="副负责人" hasFeedback key="deputyPerson">
            {getFieldDecorator('deputyPerson', {
              initialValue: model.detailData.deputyPerson,
              rules: [{
                // required: true, message: '副负责人为必填',
              }],
            })(
              <TreeSelect
                showSearch
                allowClear
                dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                // treeData={model.treeDataUserList}
                placeholder="请选择副负责人"
              >
                {renderTreeNode(model.treeDataUserList)}
              </TreeSelect>
            )}
          </FormItem>
          */}
          {/* <FormItem {...formItemLayout} label="联系地址" hasFeedback key="address">
            {getFieldDecorator('address', {
              initialValue: model.detailData.address,
              rules: [{
                // required: true, message: '联系地址为必填',
              }],
            })(
              <Input placeholder="请填写联系地址" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="邮政编码" hasFeedback key="zipCode">
            {getFieldDecorator('zipCode', {
              initialValue: model.detailData.zipCode,
              rules: [{
                required: false, message: '请填写正确的邮政编码', // pattern: /^[1-9][0-9]{5}$/,
              }],
            })(
              <Input placeholder="请填写邮政编码" />
            )}
          </FormItem> */}
          {/*
            <FormItem {...formItemLayout} label="负责人" hasFeedback key="master">
              {getFieldDecorator('master', {
                initialValue: model.detailData.master,
                rules: [{
                  // required: true, message: '负责人为必填',
                }],
              })(
                <Input placeholder="请填写负责人" />
              )}
            </FormItem>
          */}
          {/* <FormItem {...formItemLayout} label="电话" hasFeedback key="phone">
            {getFieldDecorator('phone', {
              initialValue: model.detailData.phone,
              rules: [{
                required: false, message: '请填写正确的电话',
                // pattern: (/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/ || /^1(3|4|5|7|8)\d{9}$/)
              }],
            })(
              <Input placeholder="请填写电话" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="传真" hasFeedback key="fax">
            {getFieldDecorator('fax', {
              initialValue: model.detailData.fax,
              rules: [{
                // required: true, message: '传真为必填',
              }],
            })(
              <Input placeholder="请填写传真" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="邮箱" hasFeedback key="email">
            {getFieldDecorator('email', {
              initialValue: model.detailData.email,
              rules: [{
                required: false, message: '请填写正确的邮箱', type: 'email',
              }],
            })(
              <Input placeholder="请填写邮箱" />
            )}
          </FormItem>
          
          {!isUpdate ?
            <FormItem {...formItemLayout} label="快速添加下级部门" key="childName">
              {getFieldDecorator('childName', {
                initialValue: [],
              })(
                <CheckboxGroup>
                  {model.fastSectionList.map((item) => {
                    return (<Checkbox value={item.name} key={item.id} style={{ marginRight: 8 }}>{item.name}</Checkbox>)
                  })}
                </CheckboxGroup>
              )}
            </FormItem> */}
            : ''}
          <div style={{ textAlign: 'center' }}>
            <Button onClick={this.back.bind(this)}>返回</Button>
            <Button style={{ marginLeft: 30 }} type="primary" htmlType="submit">保存</Button>
            {!isUpdate ?
              <Button onClick={this.resertAll.bind(this)} style={{ marginLeft: 30 }}>重置</Button>
              : ''}
          </div>
        </Form>
      </div>
    )
  }
}

export default connect(({ organizationManagement }) => ({ organizationManagement }))(Form.create()(Add))
