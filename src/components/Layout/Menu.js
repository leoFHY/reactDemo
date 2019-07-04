import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon } from 'antd'
import Navlink from 'umi/navlink'
import withRouter from 'umi/withRouter'
import {
  arrayToTree,
  queryAncestors,
  pathMatchRegexp,
  addLangPrefix,
  queryArray
} from 'utils'
import store from 'store'

const SubMenu = Menu.SubMenu;

@withRouter
class SiderMenu extends PureComponent {
  state = {
    openKeys: store.get('openKeys') || [],
  }

  onOpenChange = openKeys => {
    const { menus } = this.props
    // const rootSubmenuKeys = menus.filter(_ => !_.menuParentId).map(_ => _.id)
    const rootSubmenuKeys = menus.filter(_ => !_.mpid).map(_ => _.id)
    const latestOpenKey = openKeys.find(
      key => this.state.openKeys.indexOf(key) === -1
    )

    let newOpenKeys = openKeys
    if (rootSubmenuKeys.indexOf(latestOpenKey) !== -1) {
      newOpenKeys = latestOpenKey ? [latestOpenKey] : []
    }

    this.setState({
      openKeys: newOpenKeys,
    })
    store.set('openKeys', newOpenKeys)
  }

  generateMenus = data => {
    return data.map(item => {
      if (item.children) {
        return (
          <SubMenu
            key={item.id}
            title={
              <Fragment>
                {item.icon && <Icon type={item.icon} />}
                <span>{item.name}</span>
              </Fragment>
            }
          >
            {this.generateMenus(item.children)}
          </SubMenu>
        )
      }
      return (
        <Menu.Item key={item.id}>
          <Navlink to={addLangPrefix(item.router) || '#'}>
            {item.icon && <Icon type={item.icon} />}
            <span>{item.name}</span>
          </Navlink>
        </Menu.Item>
      )
    })
  }

  render() {
    const {
      collapsed,
      theme,
      menus,
      location,
      isMobile,
      onCollapseChange,
    } = this.props

    // Generating tree-structured data for menu content.
    const menuTree = arrayToTree(menus, 'id', 'mpid')

    // Find a menu that matches the pathname.
    const currentMenu = menus.find(
      _ => _.route && pathMatchRegexp(_.route, location.pathname)
    )

    // Find the key that should be selected according to the current menu.
    // const selectedKeys = currentMenu
    //   ? queryAncestors(menus, currentMenu, 'menuParentId').map(_ => _.id)
    //   : []

    let selectedKeys
    const getPathArray = (array, current, pid, id) => {
      let result = [String(current[id])]
      const getPath = (item) => {
        if (item && item[pid]) {
          if (item[pid] === '-1') {
            result.unshift(String(item['bpid']))
          } else {
            result.unshift(String(item[pid]))
            getPath(queryArray(array, item[pid], id))
          }
        }
      }
      getPath(current)
      return result
    }
    if (currentMenu) {
      selectedKeys = getPathArray(menus, currentMenu, 'mpid', 'id')
    }
    if (!selectedKeys) {
      selectedKeys = []
    }
    const menuProps = collapsed
      ? {}
      : {
          openKeys: this.state.openKeys,
        }


    return (
      <Menu
        mode="inline"
        theme={theme}
        onOpenChange={this.onOpenChange}
        inlineCollapsed={collapsed}
        selectedKeys={selectedKeys}
        onClick={
          isMobile
            ? () => {
                onCollapseChange(true)
              }
            : undefined
        }
        {...menuProps}
      >
        {this.generateMenus(menuTree)}
      </Menu>
    )
  }
}

SiderMenu.propTypes = {
  menus: PropTypes.array,
  theme: PropTypes.string,
  isMobile: PropTypes.bool,
  collapsed: PropTypes.bool,
  onCollapseChange: PropTypes.func,
}

export default SiderMenu
