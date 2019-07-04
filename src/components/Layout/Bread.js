import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Breadcrumb, Icon } from 'antd'
import Link from 'umi/navlink'
import withRouter from 'umi/withRouter'
import { withI18n } from '@lingui/react'
import { pathMatchRegexp, queryAncestors, addLangPrefix } from 'utils'
import styles from './Bread.less'

@withI18n()
@withRouter
class Bread extends PureComponent {
  generateBreadcrumbs = paths => {
    return paths.map((item, key) => {
      // const content = (
      //   <Fragment>
      //     {
      //       !item.icon ? null :  (
      //       <Icon type={item.icon} style={{ marginRight: 4 }} />
      //        ) 
      //     }
      //     {item.name}
      //   </Fragment>
      // )

      return (
        null
        // <Breadcrumb.Item key={key}>
        //   {paths.length - 1 !== key ? (
        //     <Link to={addLangPrefix(item.route) || '#'}>{content}</Link>
        //   ) : (
        //     content
        //   )}
        // </Breadcrumb.Item>
        // <Breadcrumb.Item key={key}>
        //   {paths.length - 1 !== key ? (
        //     <Link to={ addLangPrefix(item.router) || '#'}>{content}</Link>
        //   ) : (
        //     content
        //   )}
        // </Breadcrumb.Item>

        // <Breadcrumb.Item key={key}>
        //   {paths.length - 1 !== key ? (
        //     <Link to={addLangPrefix(item.route) || '#'}>{content}</Link>
        //   ) : (
        //     content
        //   )}
        // </Breadcrumb.Item>
      )
    })
  }
  render() {
    const { routeList, location, i18n } = this.props

    // Find a route that matches the pathname.
    // 防止面包屑生成Not Found，因为有些隐藏模块或详情页路由地址是没有通过菜单传递过来，不兼容此框架自带的面包屑生成
    let pathName = ''
    switch (location.pathname) {
    //  case '/productList/detail':
    //       pathName = '/productList'
    //       break;
    //  case '/backStageManagement/menuManagement/add':
    //       pathName = '/backStageManagement/menuManagement'
    //       break;
    //  case '/customer/detail':
    //       pathName = '/customer'
    //       break;
     default:
          pathName = location.pathname
    }
    
    // const currentRoute = routeList.find(
    //   _ => _.router && pathMatchRegexp(_.router, pathName)
    // )
    const currentRoute = routeList.find(
      _ => _.route && pathMatchRegexp(_.route, location.pathname)
    )
    console.log('currentRoute', location.pathname,currentRoute);
   
    // Find the breadcrumb navigation of the current route match and all its ancestors.
    const paths = currentRoute
      ? queryAncestors(routeList, currentRoute, 'breadcrumbParentId').reverse()
      : [
          routeList[0],
          {
            id: 404,
            name: i18n.t`Not Found`,
          },
        ]
    // const paths = currentRoute ?
    //   queryAncestors(routeList, currentRoute, 'mpid').reverse():
    //   [
    //     routeList[0],
    //     {
    //       id: 404,
    //       name: i18n.t `Not Found`,
    //     },
    //   ]
     console.log('paths',paths);
     
    return (
      <Breadcrumb className={styles.bread}>
        {this.generateBreadcrumbs(paths)}
      </Breadcrumb>
    )
  }
}

Bread.propTypes = {
  routeList: PropTypes.array,
}

export default Bread
