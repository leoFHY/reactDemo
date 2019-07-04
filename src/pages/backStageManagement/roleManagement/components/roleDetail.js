import React, { Component } from 'react'
import { connect } from 'dva'
import { Row, Col } from 'antd'


const RoleDetail = ({
  roleManagement,
}) => {
  const tableStyle = {
    table: {
      backgroundColor: '#fff',
      borderRight: '1px solid #f4f4f4',
      borderBottom: '1px solid #f4f4f4',
      marginBottom: '30px',
    },
    tr: {

    },
    td: {

    },
    span: {
      border: '1px solid #f4f4f4',
      borderBottom: '0px',
      borderRight: '0px',
      height: '40px',
      lineHeight: '40px',
      verticalAlign: 'middle',
      padding: '0 5px',
      overflow: 'hidden',
    },
  }
  const tableList = [
    [
      { title: '角色名称', text: roleManagement.selectRole.name },
      { title: '归属机构', text: roleManagement.selectRole.officeName },
      { title: '英文名称', text: roleManagement.selectRole.enname },
    ],
    [
      { title: '角色类型', text: roleManagement.selectRole.roleType },
      { title: '', text: '' },
      { title: '', text: '' },
    ],
  ]
  return (
    <div>
      <Row style={tableStyle.table} cellPadding={'0'} cellSpacing={'0'}>
        {tableList.map((i, index) =>
          <Row style={tableStyle.tr} key={index} >
            {i.map((a, b) =>
              <Col style={tableStyle.td} colSpan={a.col ? a.col : ''} span={8} key={b} >
                <Col style={tableStyle.span} span={8}>{a.title}{a.title === '' ? '' : ':'}</Col>
                <Col style={tableStyle.span} span={16}>{a.text}</Col>
              </Col>
            )}
          </Row>)}
      </Row>
    </div>
  )
}

export default connect(({ roleManagement }) => ({ roleManagement }))(RoleDetail)
