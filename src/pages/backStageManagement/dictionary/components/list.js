import React from 'react'
import { Table, Select, Input, Button, Form, Row, Col } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

const List = ({
  tableProps, form, typeList, type, description, loading,
  typeSelect, updateData, deleteData, addNewData, resert, queryList,
}) => {
  const { getFieldDecorator, setFieldsValue, resetFields, validateFields } = form
  const columns = [{
    title: '键值',
    dataIndex: 'value',
    key: 'value',
    width: '15%',
  }, {
    title: '标签',
    dataIndex: 'label',
    key: 'label',
    width: '20%',
  }, {
    title: '类型',
    // dataIndex: 'type',
    key: 'type',
    width: '20%',
    render: text => (
      <a tabIndex={-97} onClick={() => typeSelect(text.type, setFieldsValue)}>{text.type}</a>
    ),
  }, {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
    width: '15%',
  }, {
    title: '排序',
    dataIndex: 'sort',
    key: 'sort',
    width: '10%',
  }, {
    title: '操作',
    // dataIndex: 'action',
    key: 'action',
    render: text => (
      <div>
        <a tabIndex={-90} onClick={() => updateData(text.id)}>修改</a><span className="ant-divider" />
        <a tabIndex={-80} onClick={() => deleteData(text.id)}>删除</a><span className="ant-divider" />
        <a tabIndex={-70} onClick={() => addNewData(text.type, text.description, text.sort)}>添加键值</a>
      </div>
    ),
  }]

  return (
    <div>
      <Form onSubmit={e => queryList(e, validateFields)} autoComplete="off">
        <div>
          <Row>
            <Col span={6}>
              <FormItem className={`type:${type}`} labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} label={'类型'} key="type">
                {getFieldDecorator('type', {
                  initialValue: type || '全部',
                })(
                  <Select showSearch>
                    <Option value={'全部'} key={''}>全部</Option>
                    {typeList.map((v, i) => {
                      let typeListIndex = i
                      return (<Option value={v} key={`${v}${typeListIndex}`}>{v}</Option>)
                    })}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem className={`description:${description}`} labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} label={'描述'} key="description">
                {getFieldDecorator('description', {
                  initialValue: description,
                })(
                  <Input style={{ marginRight: 20 }} placeholder="描述" />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <Col span={3}>&nbsp;</Col>
              <Col span={18}>
                <Button size="large" type="primary" htmlType="submit">搜索</Button>
                <Button size="large" style={{ marginLeft: 20 }} onClick={() => resert(resetFields)}>重置</Button>
              </Col>
            </Col>
          </Row>
        </div>
      </Form>
      <Table bordered rowKey="id" loading={loading} columns={columns} {...tableProps}
        style={{ background: '#fff', border: '1px solid #ebebeb' }}
      />
    </div>
  )
}

export default (Form.create()(List))
