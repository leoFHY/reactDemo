/**
 * Created by Ranshaw on 2017/10/24.
 */
import React, { Component } from 'react'
import { Tree, Input } from 'antd'
import PropTypes from 'prop-types'
import styles from './index.less'

const TreeNode = Tree.TreeNode
const Search = Input.Search


const getParentKey = (key, tree) => {
  let parentKey
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children)
      }
    }
  }
  return parentKey
}

class SearchTree extends Component {

  static propTypes = {
    me: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    list: PropTypes.array.isRequired,
	  options: PropTypes.object,
  }

  state = {
    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
  }
  onChange = (e) => {
    const value = e.target.value
    const dataList = this.props.searchKeysList
    const expandedKeys = dataList.map((item) => {
      if (item.title.indexOf(value) > -1) {
      //  console.log('父节点', getParentKey(item.title, this.props.list))
        return getParentKey(item.title, this.props.list)
      }
      return null
    }).filter((item, i, self) => item && self.indexOf(item) === i)
    console.log('状态expandedKeys', expandedKeys)
    const expandedIds = []
    expandedKeys.forEach((v) => {
      dataList.forEach((val) => {
        if (val.title === v) {
          expandedIds.push(val.key)
        }
      })
    })
    console.log('expandedIds', expandedIds)
    this.setState({
      expandedKeys: expandedIds,
      searchValue: value,
      autoExpandParent: true,
    })
  }
  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    })
  }
  getClickId = (value, node) => {
    console.log('value', value)
    console.log('node', node)
    console.log('name', node.node.props.name)
    this.props.me.dispatch({
      type: this.props.type,
      payload: {
        id: value[0] || '',
        name: value[0] ? node.node.props.name : '根节点',
      },
    })
  }
  render () {
    const { searchValue, expandedKeys, autoExpandParent } = this.state

  //  console.log('this.props.list', this.props.list)
    const loop = data => data.map((item) => {
      // const index = item.key.indexOf(searchValue)
      const beforeStr = item.key.substr(0, index)
      const afterStr = item.key.substr(index + searchValue.length)
      /*
      TreeNode的key属性被树的 (default)ExpandedKeys / (default)CheckedKeys / (default)SelectedKeys 属性所用。注意：整个树范围内的所有节点的 key 值不能重复！
       搜索的时候将获取到的title转化为id值
       */
      const title = index > -1 ? (
        <span>
          {beforeStr}
          <span style={{ color: '#f50' }}>{searchValue}</span>
          {afterStr}
        </span>) : <span>{item.key}</span>
      if (item.children) {
        return (
          <TreeNode key={item.id} name={item.key} title={title}>
            {loop(item.children)}
          </TreeNode>
        )
      }
      return <TreeNode key={item.id} name={item.key} title={title} />
    })
    return (
      <div>
        <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onChange}
          className={this.props.displayCategory ? styles.input : null}
        />
        <Tree
          onExpand={this.onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          onSelect={this.getClickId}
          defaultSelectedKeys={[]}
          defaultExpandedKeys={[]}
          className={this.props.displayCategory ? styles.tree : null}
        >
          {loop(this.props.list)}
        </Tree>
      </div>
    )
  }
}

export default SearchTree
