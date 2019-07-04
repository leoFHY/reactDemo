import React from 'react'
import { connect } from 'dva'
import { Tabs, Modal } from 'antd'
import { routerRedux } from 'dva/router'
import List from './components/list'

const confirm = Modal.confirm
const TabPane = Tabs.TabPane

const Index = ({ dispatch, dictionary, children, location, loading }) => {
  const isUpdate = location.query.item === 'update'
  const isIndex = location.pathname === '/backStageManagement/dictionary'
  const { pageList, typeList, type = '', description = '' } = dictionary
  const onTabClick = (key) => {
    dispatch(routerRedux.push({
      pathname: `/backStageManagement/dictionary${key === '1' ? '' : '/add'}`,
      query: {
        item: `${key === '1' ? '' : 'tabAdd'}`,
      },
      state: {
        item: `${key === '1' ? '1' : ''}`,
      },
    }))
  }
  const listProp = {
    loading,
    typeList,
    type,
    description,
    updateData: (dictId) => {
      dispatch(routerRedux.push({
        pathname: '/backStageManagement/dictionary/add',
        query: {
          item: 'update',
          dictId,
        },
      }))
    },
    addNewData: (type2, description2, sort) => {
      dispatch(routerRedux.push({
        pathname: '/backStageManagement/dictionary/add',
        query: {
          item: 'listAdd',
        },
        state: {
          type: type2, description: description2, sort,
        },
      }))
    },
    deleteData: (dictId) => {
      confirm({
        title: '删除确认',
        content: '确定删除该字典吗？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          dispatch({
            type: 'dictionary/deletes',
            payload: {
              dictId,
            },
          })
        },
        onCancel () {
        },
      })
    },
    typeSelect: (type2, setFieldsValue) => {
      dispatch({
        type: 'dictionary/getList',
        payload: {
          pageNum: 1,
          type: type2,
          description,
        },
      })
      setFieldsValue({ type: type2 })
    },
    resert: (resetFields) => {
      dispatch({
        type: 'dictionary/getList',
        payload: {
          pageNum: 1,
          type: '',
          description: '',
        },
      })
      resetFields()
    },
    queryList: (e, validateFields) => {
      e.preventDefault()
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'dictionary/getList',
            payload: {
              pageNum: 1,
              type: values.type === '全部' ? '' : (values.type || ''),
              description: values.description || '',
            },
          })
        }
      })
    },
    tableProps: {
      dataSource: pageList.list,
      pagination: {
        current: Math.floor(pageList.pageNum),
        total: pageList.total,
        onChange: (page) => {
          dispatch({
            type: 'dictionary/getList',
            payload: {
              pageNum: page,
              type,
              description,
            },
          })
        },
      },
    },
  }
  return (
    <div>
      <Tabs type="card" activeKey={isIndex ? '1' : '2'} onChange={(key) => { onTabClick(key) }}>
        <TabPane tab="字典列表" key="1">
          <List {...listProp} />
        </TabPane>
        <TabPane tab={isUpdate ? '字典修改' : '字典添加'} key="2">
          {children}
        </TabPane>
      </Tabs>
    </div>
  )
}

export default connect(({ dictionary, loading }) => ({ dictionary, loading: loading.models.dictionary }))(Index)
