import React, { PureComponent } from 'react';
import { Modal, Input, Tree, message, Button} from 'antd';
import { connect } from 'dva'
import PropTypes from 'prop-types'
import './index.less'
import { deepCopy } from 'utils/copy'
import { isArray } from 'util';
const TreeNode = Tree.TreeNode

@connect(({ Netherlands, Addhelanpais,loading, app }) => ({ Netherlands,Addhelanpais, loading, app }))

class Create extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      houseName: '',
      selectedKeys: [],
      searchName: '',
      houseIds:[],
      type:''
    }
  }
  componentDidMount() {
   
  }
  render() {
    const { Netherlands,Addhelanpais, visible, dispatch } = this.props
    const { treeList, listImg } = Addhelanpais;
    const { searchValue, expandedKeys, autoExpandParent,houseName, selectedKeys,searchName } = this.state;
    const dataList = [];
    // console.log(treeList)
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
    // console.log(treeList)

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
    
      
      // 添加出框确定
      const handleOk = () => {
        // console.log(treeList)
        console.log(this.state.houseIds)
        dispatch({
          type: 'Addhelanpais/getBfProjectAreaByHouseId',
          payload:{
            houseIds:this.state.houseIds
          },
          success:(data) => {
            // let values = deepCopy(data)
            // console.log(data)
            let imgs = deepCopy(listImg)
            data.map((v,i) => {
              // v.houseDiscountPic = ''
              //重点重点--------------------------------------
              imgs.push({uid:i +  Addhelanpais.downHelanpaisList.length , url:'',status:'done'})
            })
            // console.log(data)
            let list = deepCopy(Addhelanpais.downHelanpaisList)
            let arr = [...list,...data]
            let result = [];
            let obj = {};
            arr.map((v,i) => {
              // console.log(newArr)
              if(!obj[arr[i].houseId]){
                result.push(arr[i]);
                obj[arr[i].houseId] = true;
             }
            })
            // console.log(arr)
            // console.log(result)
            console.log(imgs)
            
            // return
            dispatch({
              type: 'Addhelanpais/saveMediaImages',
              payload:{
                data:imgs
              }
              
            })
            dispatch({
              type: 'Addhelanpais/changeTreeShow2',
              payload: false,
            })
            dispatch({
              type: 'Addhelanpais/savePageList',
              payload:result
              
            })
            
          }
        })
      }
      // 添加楼栋弹出框取消
      const handleCancel = (e) => {
        this.props.dispatch({
          type: 'Addhelanpais/changeTreeShow2',
          payload: false,
        })
        this.setState({
          checkedKeys: '',
        })
      }
         
       
   
    const loop = data => data.map((item) => {
      // return 1
      // this.setState({
      //   type:item.type
      // })
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
          <TreeNode key={item.key} title={title} name={item.title} disableCheckbox={item.type === '1' || item.type === '2' || item.type === '3'} type={item.type}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} title={title} name={item.title} type={item.type}/>;
    });
   
    const onSelect = (selectedKeys, e) => {
      // console.log(selectedKeys)
      // console.log( e.node.props.name)
      // console.log(e)
      if (e.selected) {
        if(e.node.props.type === '1'){
          dispatch({
            type:'Addhelanpais/getHouseList',
            payload:{
              id:selectedKeys[0],
              type:'2' 
            }
          })
        }else if(e.node.props.type === '2'){
          dispatch({
            type:'Addhelanpais/getHouseList',
            payload:{
              id:selectedKeys[0],
              type:'3' 
            }
          })
        }else if(e.node.props.type === '3'){
          dispatch({
            type:'Addhelanpais/getHouseList',
            payload:{
              id:selectedKeys[0],
              type:'4' 
            }
          })
        }
        
        // this.setState({
        //   houseName: e.node.props.name,
        // });
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
    const onCheck = (checkedKeys,e) => {
      console.log(checkedKeys)
      this.setState({
        houseIds: checkedKeys
      })
      console.log(e)
    }
   
    return (
      <div >
        < Modal title = "添加优惠房源"
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
            checkable={true}
            // multiple
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            // defaultExpandedKeys={['0-0-0', '0-0']}
            onSelect={onSelect}
            selectedKeys={this.state.selectedKeys}
            onCheck={onCheck}
            // checkedKeys={this.state.checkedKeys}
            multiple = {false}
            // expandAction = {'doubleClick'}
            // loadData = { () => loop(treeList) }
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
