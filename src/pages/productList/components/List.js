import React from 'react';
import { Table } from 'antd';
import PropTypes from 'prop-types'

const List = ({ dataSource, columns, loading, pagination, rowSelection  }) => {
  return (
    <div>
      <Table
        bordered
        style={{ background: '#fff', border: '1px solid #ebebeb' }}
        loading={loading}
        rowKey={record => record.bfProjectId}
        pagination={pagination}
        dataSource={dataSource}
        columns={columns}
        rowSelection={rowSelection}
      />
    </div>
  );
};
List.propTypes = {
  dataSource: PropTypes.array,
  columns: PropTypes.array,
  pagination: PropTypes.object,
}
export default List;
