import React from 'react'
import { connect } from 'dva'
import { Input, Form, Row, Col, Button, Select, TreeSelect, InputNumber } from 'antd'

const TreeNode = TreeSelect.TreeNode
const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
}
const formList = ({
  dispatch,
  form,
  areaManage,
  argums,
}) => {
  const { getFieldDecorator, getFieldValue, setFieldsValue, resetFields } = form
  const handleSubmit = (e) => {
    e.preventDefault()
    form.validateFields((error, value) => {
      if (!error) {
        if (areaManage.tabText === '修改') {
          dispatch({
            type: 'areaManage/updateArea',
            payload: {
              id: areaManage.selectAre.id,
              code: value.code.toString(),
              name: value.name,
              parentId: value.parentId,
              remarks: value.remarks,
              type: value.type,
            },
          })
        } else {
          dispatch({
            type: 'areaManage/addArea',
            payload: {
              code: value.code.toString(),
              name: value.name,
              parentId: value.parentId,
              remarks: value.remarks,
              type: value.type,
            },
          })
        }
        form.resetFields()
      }
    })
  }
  const handleCallBack = () => {
    form.resetFields()
    dispatch({
      type: 'areaManage/setTabKeys',
      payload: {
        tabKeys: '1',
        tabText: '新增',
        parentId: '',
        type: 'add',
      },
    })
  }
  const handleReset = () => {
    form.resetFields()
  }
  argums.getHandleReset(handleReset)
  const renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.id === areaManage.selectAre.id && areaManage.tabText === '修改') {
        return ''
      }
      if (item.children) {
        return (<TreeNode title={item.name} key={item.id} dataRef={item} value={item.id}>
          {renderTreeNodes(item.children)}
        </TreeNode>)
      }
      return (<TreeNode title={item.name} key={item.id} dataRef={item} value={item.id} />)
    })
  }
  return (
    <Form onSubmit={handleSubmit}>
      <FormItem label={'上级区域:'} {...formItemLayout}>
        {getFieldDecorator('parentId', {
          rules: [{
            required: true,
            message: '上级区域必填!',
          }],
          initialValue: areaManage.tabText === '修改' ? areaManage.selectAre.parentId : (areaManage.type === 'add' ? '1' : areaManage.parentId),
        })(
          <TreeSelect
            treeNodeFilterProp="title"
            showSearch
            allowClear
            treeDefaultExpandAll
            disabled={!!((areaManage.selectAre.parentId === '0' && areaManage.type === 'Modify'))}
            onSelect={(value) => {
              setTimeout(() => {
                form.setFieldsValue({ parentId: value })
              }, 50)
            }}
          >
            {renderTreeNodes(areaManage.AreList)}
          </TreeSelect>
        )}
      </FormItem>
      <FormItem label={'区域名称:'} {...formItemLayout}>
        {getFieldDecorator('name', {
          rules: [{
            required: true,
            message: '区域名称必填!',
          }],
          initialValue: areaManage.tabText === '修改' ? areaManage.selectAre.name : '',
        })(
          <Input size="large" />
        )}
      </FormItem>
      <FormItem label={'区域编码:'} {...formItemLayout}>
        {getFieldDecorator('code', {
          initialValue: areaManage.tabText === '修改' ? areaManage.selectAre.code : '',
        })(
          <InputNumber size="large" />
        )}
      </FormItem>
      <FormItem label={'区域类型:'} {...formItemLayout}>
        {getFieldDecorator('type', {
          initialValue: areaManage.tabText === '修改' ? areaManage.selectAre.type : '1',
          rules: [{
            required: true,
            message: '区域类型必填!',
          }],
        })(
          <Select>
            {
              areaManage.typeList.map(e =>
                <Option value={e.id} key={e.id} >{e.name}</Option>
              )
            }
          </Select>
        )}
      </FormItem>
      <FormItem label={'备注:'} {...formItemLayout}>
        {getFieldDecorator('remarks', {
          initialValue: areaManage.tabText === '修改' ? areaManage.selectAre.remarks : '',
        })(
          <TextArea autosize={{ minRows: 2, maxRows: 6 }} />
        )}
      </FormItem>
      <FormItem style={{ textAlign: 'center' }}>
        <Button onClick={handleCallBack}>返回</Button>
        <Button size="large" type="primary" htmlType="submit" style={{ margin: '0 20px' }}>
        保存
        </Button>
        {
          areaManage.tabText === '修改' ? '' :
            <Button onClick={handleReset}>重置</Button>
        }
      </FormItem>
    </Form>
  )
}

export default connect(({ areaManage }) => ({ areaManage }))(Form.create()(formList))
