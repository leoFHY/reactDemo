import React from 'react'
import { connect } from 'dva'
import { Table, Modal, Button, Input, InputNumber, message, Icon } from 'antd'
import { routerRedux } from 'dva/router'

import indexStyles from '../index.less'

const confirm = Modal.confirm

const List = ({ dispatch, menuManagement, loading }) => {
  let sortData = []
  const updateData = (menuId) => {
    // hashHistory.push({
    //   pathname: '/menuManagement/add',
    //   query: {
    //     item: 'update',
    //     menuId,
    //   },
    // })
    dispatch(routerRedux.push({
      pathname: '/backStageManagement/menuManagement/add',
      query: {
        item: 'update',
        menuId,
      },
    }))
    // dispatch({
    //   type: 'menuManagement/detail',
    //   payload: {
    //     menuId,
    //   },
    //   item: 'update',
    // })
  }
  const sortDataChange = (value, id) => {
    let hasId = false
    let o = {
      id,
      sort: value || (value === 0 ? value : ''),
    }
    sortData.forEach((v) => {
      if (v.id === o.id) {
        v.sort = o.sort
        hasId = true
      }
    })
    if (hasId === false) {
      sortData.push(o)
    }
  }
  const backIndex = () => {
    dispatch(routerRedux.push({
      pathname: '/backStageManagement/menuManagement',
      query: {
      },
    }))
  }

  const addNewData = (parentId) => {
    dispatch(routerRedux.push({
      pathname: '/backStageManagement/menuManagement/add',
      query: {
        item: 'listAdd',
        parentId,
      },
    }))
    // dispatch({
    //   type: 'menuManagement/detail',
    //   payload: {
    //     parentId,
    //   },
    //   item: 'listAdd',
    // })
  }
  const deleteData = (id) => {
    confirm({
      title: '删除确认',
      content: '确定删除该机构吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'menuManagement/deletes',
          payload: {
            menuId: id,
          },
          backIndex,
        })
      },
      onCancel () {
      },
    })
  }
  const updateSort = () => {
    let free = false
    if (sortData.length < 1) {
      message.warn('没有修改排序')
      return
    }
    sortData.forEach((v) => {
      if (!v.sort) {
        free = true
      }
    })
    if (free) {
      message.warn('排序不能为空')
      return
    }
    dispatch({
      type: 'menuManagement/updateSort',
      payload: {
        sortData,
      },
      backIndex,
    })
    // sortData = []
  }
  const sortChange = (value, id) => {
    sortDataChange(value, id)
    // dispatch({
    //   type: 'menuManagement/sortChange',
    //   payload: {
    //     id,
    //     value,
    //   },
    // })
  }
  const columns = [{
    title: '名称',
    // dataIndex: 'name',
    key: 'name',
    width: '25%',
    render: (text, recode) => (
      <span>
        {recode.icon ?
          <Icon type={recode.icon} style={{ marginRight: 3 }} />
          : ''}
        <span>{recode.name}</span>
      </span>
    ),
  }, {
    title: '链接',
    dataIndex: 'href',
    key: 'href',
    width: '20%',
  }, {
    title: '排序',
    // dataIndex: 'sort',
    key: 'sort',
    width: '10%',
    render: (text) => {
      if (!menuManagement.loadDefaultValue) {
        return <Input value={text.sort} readOnly />
      }
      return (
        <InputNumber min={1} precision={0} defaultValue={text.sort} onChange={e => sortChange(e, text.id)} />
      )
    },
  }, {
    title: '可见',
    // dataIndex: 'isShow',
    key: 'isShow',
    width: '10%',
    render: text => (
      text.isShow === '1' ? '显示' : '隐藏'
    ),
  }, {
    title: '权限标识',
    dataIndex: 'permission',
    key: 'permission',
    width: '15%',
  }, {
    title: '操作',
    // dataIndex: 'action',
    key: 'action',
    render: text => (
      <div>
        <a className={text.id} tabIndex={-90} onClick={() => updateData(text.id)}>修改</a><span className="ant-divider" />
        <a tabIndex={-80} onClick={() => deleteData(text.id)}>删除</a><span className="ant-divider" />
        <a tabIndex={-70} onClick={() => addNewData(text.id)}>添加下级菜单</a>
      </div>
    ),
  }]
  return (
    <div>
      <Table
        className={indexStyles.table} bordered rowKey="id" loading={loading} defaultExpandAllRows
        style={{ background: '#fff', border: '1px solid #ebebeb' }}
        columns={columns} dataSource={menuManagement.pageList[0].children} pagination={false}
      />
      <Button type="primary" style={{ marginTop: 10 }} onClick={updateSort}>保存排序</Button>
    </div>
  )
}

// export default connect(({ menuManagement }) => ({ menuManagement }))(List)
export default connect(({ menuManagement, loading }) => ({ menuManagement, loading: loading.models.menuManagement }))(List)
