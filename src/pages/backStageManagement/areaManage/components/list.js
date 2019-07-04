import React from 'react'
import { connect } from 'dva'
import { hashHistory } from 'dva/router'
import { Table, Modal } from 'antd'
import indexStyles from '../../menuManagement/index.less'

const confirm = Modal.confirm
const areaList = ({
  dispatch,
  areaManage,
}) => {
  const addArea = (text) => {
    dispatch({
      type: 'areaManage/getParentAreas',
      payload: {
        areaId: text.id,
      },
    })
    dispatch({
      type: 'areaManage/setTabKeys',
      payload: {
        tabKeys: '2',
        tabText: '新增',
        parentId: text.id,
        type: 'addChild',
      },
    })
  }
  const deleteArea = (text) => {
    confirm({
      title: '删除确认',
      content: '确定删除该区域吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk () {
        dispatch({
          type: 'areaManage/deleteArea',
          payload: {
            areaId: text.id,
          },
        })
      },
      onCancel () {
      },
    })
  }
  const modifyArea = (text) => {
    /* dispatch({
      type: 'areaManage/getParentAreas',
      payload: {
        areaId: text.id,
      },
    }) */
    dispatch({
      type: 'areaManage/setModifyArea',
      payload: {
        tabKeys: '2',
        tabText: '修改',
        type: 'Modify',
        selectAre: text,
      },
    })
  }
  const columns = [{
    title: '区域名称',
    dataIndex: 'name',
    key: 'name',
    width: '30%',
  }, {
    title: '区域编码',
    dataIndex: 'code',
    key: 'code',
    width: '10%',
  }, {
    title: '区域类型',
    dataIndex: 'typeName',
    key: 'typeName',
    width: '20%',
  }, {
    title: '备注',
    dataIndex: 'remarks',
    key: 'remarks',
    width: '20%',
  }, {
    title: '操作',
    key: 'action',
    width: '20%',
    render: text => (
      <span>
        <a
          onClick={modifyArea.bind(null, text)}
        >修改</a>
        <span className="ant-divider" />
        <a
          onClick={deleteArea.bind(null, text)}
        >删除</a>
        <span className="ant-divider" />
        <a
          onClick={addArea.bind(null, text)}
        >添加下级区域</a>
      </span>
    ),
  }]
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
    },
    onSelect: (record, selected, selectedRows) => {
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
    },
  }
  return (
    <div>
      {
        (areaManage.AreList && areaManage.AreList.length > 0) ?
          <Table
            className={indexStyles.table}
            columns={columns}
            dataSource={areaManage.AreList}
            style={{ background: '#fff' }}
            bordered
            defaultExpandAllRows
            rowKey={record => record.id}
            pagination={false}
            loading={areaManage.isLoading}
          /> : ''
      }
    </div>
  )
}
export default connect(({ areaManage }) => ({ areaManage }))(areaList)
