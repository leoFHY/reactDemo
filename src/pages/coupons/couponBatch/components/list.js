import React, { Component } from 'react'
import { Table } from 'antd'

const List = ({
  loading,
  dataSource,
  pagination,
  showDetail,
  exportfile,
  makeCouponBatch,
  onDelete,
  onEdit,
}) => {
  const columns = [{
    title: '批次号',
    dataIndex: 'id',
    key: 'id',
  }, {
    title: '批次名称',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '卡券外观',
    dataIndex: 'dispayName',
    key: 'dispayName',
  }, {
    title: '优惠券模版',
    dataIndex: 'defName',
    key: 'defName',
  }, {
    title: '有效期',
    dataIndex: 'time',
    key: 'time',
  }, {
    title: '制作数量',
    dataIndex: 'batchCount',
    key: 'batchCount',
  }, {
    title: '入库数量',
    dataIndex: 'entryCount',
    key: 'entryCount',
  }, {
    title: '可售数量',
    dataIndex: 'saleCount',
    key: 'saleCount',
  }, {
    title: '冻结数量',
    dataIndex: 'frozenCount',
    key: 'frozenCount',
  }, {
    title: '状态',
    dataIndex: 'state',
    key: 'state',
  }, {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
  }, {
    title: '操作',
    key: 'action',
    render: (text) => {
      switch (text.state) {
        case '新建':
          return (<span>
            <a
              onClick={showDetail.bind(this, text)}
            >
              查看
            </a>
            <span className="ant-divider" />
            <a
              onClick={onEdit.bind(this, text)}
            >编辑</a>
            <span className="ant-divider" />
            <a onClick={onDelete.bind(this, text.id)}>删除</a>
            <span className="ant-divider" />
            <a onClick={makeCouponBatch.bind(this, text.id)}>制作</a>
          </span>)
        case '入库':
          return (<span>
            <a
              onClick={showDetail.bind(this, text)}
            >
              查看
            </a>
            <span className="ant-divider" />
            <a onClick={exportfile.bind(this, text.id)}>导出</a>
          </span>)
        case '删除':
          return (<span>
            <a
              onClick={showDetail.bind(this, text)}
            >
            查看
          </a>
          </span>)
        default :
          return ''
      }
    },
  }]
  return (
    <Table
      bordered
      style={{ background: '#fff', border: '1px solid #ebebeb' }}
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      rowKey="id"
      pagination={pagination}
    />
  )
}

export default List
