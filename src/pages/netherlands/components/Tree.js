import React, { PureComponent } from 'react';
import { Modal, Input, Tree, message, Button} from 'antd';
import { connect } from 'dva'
import PropTypes from 'prop-types'
import './index.less'
const TreeNode = Tree.TreeNode

@connect(({ Netherlands, loading, app }) => ({ Netherlands, loading, app }))

class Create extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      houseName: '',
      selectedKeys: [],
      searchName: ''
    }
  }
  componentDidMount() {
   
  }
  render() {
    const { Netherlands, visible } = this.props
    const { treeList } = Netherlands;
    const { searchValue, expandedKeys, autoExpandParent,houseName, selectedKeys,searchName } = this.state;
    const dataList = [];
    console.log(treeList)
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
      });
    }
    
      
      // 添加楼栋弹出框确定
      const handleOk = () => {
        const list = selectedKeys.slice(0, 1).join('')
         this.props.dispatch({
           type: 'Netherlands/saveHouseId',
           payload: {
            houseName,
            houseId: list
           },
         })
         this.props.dispatch({
           type: 'Netherlands/changeTreeShow',
           payload: false,
         })
         this.setState({
           selectedKeys: [],
         });
      }
      // 添加楼栋弹出框取消
      const handleCancel = (e) => {
        this.props.dispatch({
          type: 'Netherlands/changeTreeShow',
          payload: false,
        })
        this.setState({
          checkedKeys: '',
        })
      }
         
       
   
    const loop = data => data.map((item) => {
      // return 1
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
          <TreeNode key={item.key} title={title} name={item.title} disabled={item.disable === '0'} >
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} title={title} name={item.title} disabled={item.disable === '0'}/>;
    });
   
    const onSelect = (selectedKeys, e) => {
      console.log(selectedKeys)
      if (e.selected) {
        this.setState({
          houseName: e.node.props.name,
        });
      }
      this.setState({ selectedKeys });
    }
    const handleReset = () => {
      this.setState({
        expandedKeys: [],
        searchValue: '',
        autoExpandParent: false,
        searchName: '',
      })
    }
    const handleSearch = (e) => {
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
      this.setState({
        searchName: e.target.value
      });
    }
    return (
      <div >
        < Modal title = "选择房源"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
          okText = "确认"
          cancelText = "取消"
          style={{zIndex: '1001'}}
          maskClosable = {false}
        >
          <Input style={{ width: 300 }} onPressEnter={handleEnterKey} value = {searchName} onChange={changeSearch} ref="search" />
          &nbsp;&nbsp;
          <Button type="primary" onClick = {handleSearch}>搜索</Button>
          &nbsp;&nbsp;
          <Button  onClick = {handleReset}>重置</Button>
          <Tree
            // checkable
            // multiple
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            // defaultExpandedKeys={['0-0-0', '0-0']}
            onSelect={onSelect}
            selectedKeys={this.state.selectedKeys}
            // onCheck={onCheck}
            // checkedKeys={this.state.checkedKeys}
            multiple = {false}
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
