import React from 'react'
import { Table } from 'antd'
import PropTypes from 'prop-types'

const List = ({ dataSource, columns, loading, pagination }) => {
  return (
      <Table
        bordered
        style={{ background: '#fff', border: '1px solid #ebebeb' }}
        loading={loading}
        rowKey={(record,i) => i}
        pagination={pagination}
        dataSource={dataSource}
        columns={columns}
      />
  )
}
List.propTypes = {
  dataSource: PropTypes.array,
  columns: PropTypes.array,
  // pagination: PropTypes.object,
}
export default List;
