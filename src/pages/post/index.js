import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Tabs } from 'antd'

import { Page } from 'components'

@connect(({ post, loading }) => ({ post, loading }))
class Post extends PureComponent {
  render() {

    return (
      <Page inner>
        <div>post</div>
      </Page>
    )
  }
}

Post.propTypes = {
  post: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

export default Post
