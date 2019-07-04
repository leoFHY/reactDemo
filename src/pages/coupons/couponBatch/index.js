import React from 'react'
import { connect } from 'dva'
import { router } from 'utils'
import { Modal } from 'antd'
import FilterForm from './components/filter'
import List from './components/list'

const confirm = Modal.confirm
const CouponBtach = ({ dispatch, couponBatch, loading }) => {
  const filterProps = {
    states: couponBatch.filterStates,
    pageSize: couponBatch.pageSize,
    dateFormat: couponBatch.dateFormat,
    stateList: couponBatch.stateList,
    onSearch (fieldsValue) {
      dispatch({
        type: 'couponBatch/getPageList',
        payload: {
          type: 'search',
          data: fieldsValue,
        },
      })
    },
    handleResetModel () {
      dispatch({
        type: 'couponBatch/getPageList',
        payload: {
          type: 'search',
          data: {
            pageNum: '1',
            pageSize: couponBatch.pageSize,
          },
        },
      })
    },
    setState (states) {
      console.log(states)
      // return
      dispatch({
        type: 'couponBatch/handleStates',
        payload: states,
      })
    },
  }

  const listProps = {
    loading,
    dataSource: couponBatch.pageList,
    pagination: {
      current: Math.floor(couponBatch.pageNum),
      total: couponBatch.pageCount,
      onChange: (page) => {
        dispatch({
          type: 'couponBatch/getPageList',
          payload: {
            pageSize: couponBatch.pageSize,
            pageNum: page,
          },
        })
      },
    },
    onEdit (text) {
      router.push({
        pathname: '/coupons/couponBatch/Form',
        query: {
          type: 'edit',
          id: text.id,
        },
      })
    },
    showDetail (text) {
      router.push({
        pathname: '/coupons/couponBatch/view',
        query: {
          type: 'look',
          id: text.id,
        },
      })
    },
    exportfile (id) {
      dispatch({
        type: 'couponBatch/downLoadBatch',
        payload: {
          id,
        },
      })
    },
    makeCouponBatch (id) {
      dispatch({
        type: 'couponBatch/makeCouponBatch',
        payload: {
          id,
        },
      })
    },
    onDelete (id) {
      confirm({
        title: '确定要删除这条数据吗?',
        content: '',
        okText: '是',
        okType: 'danger',
        cancelText: '否',
        onOk: () => {
          dispatch({
            type: 'couponBatch/deleteBacth',
            payload: {
              id,
            },
          })
        },
        onCancel () {
          console.log('Cancel')
        },
      })
    },
  }

  return (
    <div>
      <FilterForm {...filterProps} />
      <List {...listProps} />
    </div>
  )
}

export default connect(({ couponBatch, loading }) => ({
  couponBatch,
  loading: loading.models.couponBatch,
}))(CouponBtach)
