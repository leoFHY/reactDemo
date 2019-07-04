import React from 'react';
import { Table } from 'antd';
import PropTypes from 'prop-types'
import  './index.less'
const List = ({ dataSource, columns, loading }) => {
  return (
    <div className = 'box'>
      <Table
        bordered
        style={{ background: '#fff', border: '1px solid #ebebeb' }}
        loading={loading}
        rowKey={(record,i) => i}
        dataSource={dataSource}
        columns={columns}
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
