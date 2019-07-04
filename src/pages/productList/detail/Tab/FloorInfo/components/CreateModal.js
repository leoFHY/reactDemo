import React, { PureComponent } from 'react';
import { Modal, Input, Tree, message, Icon, Button } from 'antd';
import { connect } from 'dva'
import PropTypes from 'prop-types'
import './index.less'
const TreeNode = Tree.TreeNode

@connect(({ filterDetail, loading, app }) => ({ filterDetail, loading, app }))

class Create extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      searchName: ''
    }
  }
  render() {
    const { filterDetail, visible, app } = this.props
    const { user } = app
    const { loginName } = user
    const { treeList, bfProjectId, createClickShow } = filterDetail;
    const { searchValue, expandedKeys, autoExpandParent, searchName } = this.state;
    const dataList = [];
    const generateList = (data) => {
      for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const key = node.key;
        dataList.push({ key, title: node.title });
        if (node.children) {
          generateList(node.children, node.title);
        }
      }
    };
    generateList(treeList);

    const getParentKey = (title, tree) => {
      let parentKey;
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children) {
          if (node.children.some(item => item.title === title)) {
            parentKey = node.key;
          } else if (getParentKey(title, node.children)) {
            parentKey = getParentKey(title, node.children);
          }
        }
      }
      return parentKey;
    };
    const onExpand = (expandedKeys) => {
      this.setState({
        expandedKeys,
        autoExpandParent: false,
      })
    }
    const handleReset = () => {
       this.setState({
         expandedKeys: [],
         searchValue: '',
         autoExpandParent: false,
         searchName: '',
       })
    }
    const handleSearch = () => {
      const value = this.refs.search.input.value
      if (value == '') {
        message.success('搜索值不能为空')
        alert('搜索值不能为空')
        return
      }
      const expandedKeys = dataList.map((item) => {
        if (item.title.indexOf(value) > -1) {
          //  console.log('父节点', getParentKey(item.title, this.props.list))
          return getParentKey(item.title, treeList)
        }
        return null
      }).filter((item, i, self) => item && self.indexOf(item) === i)
      const expandedIds = []
      expandedKeys.forEach((v) => {
        dataList.forEach((val) => {
          if (val.key === v) {
            expandedIds.push(val.key)
          }
        })
      })
      this.setState({
        expandedKeys: expandedIds,
        searchValue: value,
        autoExpandParent: true,
      })
    }
    const handleEnterKey = (e) => {
        const value = e.target.value
        if (value == '') {
          message.success('搜索值不能为空')
          alert('搜索值不能为空')
          return
        }
        const expandedKeys = dataList.map((item) => {
          if (item.title.indexOf(value) > -1) {
            //  console.log('父节点', getParentKey(item.title, this.props.list))
            return getParentKey(item.title, treeList)
          }
          return null
        }).filter((item, i, self) => item && self.indexOf(item) === i)
        const expandedIds = []
        expandedKeys.forEach((v) => {
          dataList.forEach((val) => {
            if (val.key === v) {
              expandedIds.push(val.key)
            }
          })
        })
        this.setState({
          expandedKeys: expandedIds,
          searchValue: value,
          autoExpandParent: true,
        })
      }
      const changeSearch = (e) => {
        this.setState({ searchName: e.target.value });
      }
      // 添加楼栋弹出框确定
      const handleOk = () => {
       if (createClickShow){
          message.loading('正在提交，请稍后', 10)
         this.props.dispatch({
           type: 'filterDetail/setClickShow',
           payload: false,
         })
          this.props.dispatch({
            type: 'filterDetail/submitFloor',
            payload: {
              bfProjectId,
              buildingIds: this.state.checkedKeys,
              loginName
            },
            success: () => {
              this.props.dispatch({
                type: 'filterDetail/createIsShow',
                payload: false,
              })
              this.props.dispatch({
                type: 'filterDetail/setClickShow',
                payload: true,
              })
              this.setState({
                expandedKeys: [],
                searchValue: '',
                autoExpandParent: true,
              });
               message.destroy()
            }
          })
       }
        
        
      }
      // 添加楼栋弹出框取消
      const handleCancel = (e) => {
        this.props.dispatch({
          type: 'filterDetail/createIsShow',
          payload: false,
        })
      }
         
       
   
    const loop = data => data.map((item) => {
      // const index = item.key.search(searchValue);
      const index = item.title.indexOf(searchValue)
      const beforeStr = item.title.substr(0, index);
      const afterStr = item.title.substr(index + searchValue.length);
      const title = index > -1 ? (
        <span>
          {beforeStr}
          <span style={{ color: '#f50' }}>{searchValue}</span>
          {afterStr}
        </span>
      ) : <span>{item.title}</span>;
      if (item.children) {
        return (
          <TreeNode key={item.key} title={title} name={item.title} disableCheckbox={item.disable === '0'}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} title={title} name={item.title} />;
    });
    const onCheck = (checkedKeys, info) => {
      this.setState({
        checkedKeys,
      });
    }
    const onSelect = (selectedKeys, info) => {
      this.setState({ selectedKeys });
    }
    return (
      <div>
        <Modal title="添加销售楼栋"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
          okText = "确认"
          cancelText = "取消"
          maskClosable = {false}
        >
         {/* placeholder = "Search" */}
          <Input style={{ width: 300 }} onPressEnter={handleEnterKey} value = {searchName} onChange={changeSearch} ref="search" />
          &nbsp;&nbsp;
          <Button type="primary" onClick = {handleSearch}>搜索</Button>
          &nbsp;&nbsp;
          <Button  onClick = {handleReset}>重置</Button>
          <Tree
            checkable
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            // defaultExpandedKeys={['0-0-0', '0-0']}
            onSelect={onSelect}
            selectedKeys={this.state.selectedKeys}
            onCheck={onCheck}
            checkedKeys={this.state.checkedKeys}
          >
            {
              loop(treeList)
            }
          </Tree>
        </Modal>
      </div>
    )
  }

}

Create.propTypes = {
  visible: PropTypes.bool,
  handleOk: PropTypes.func,
  handleCancel: PropTypes.func,
  // searchList: PropTypes.array,
}
export default Create
