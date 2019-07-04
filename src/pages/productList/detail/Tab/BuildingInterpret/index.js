import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Input, Button, message } from 'antd';
import ReactUeditor from 'components/Editor/ReactUeditor.js'
import { renewBucketData, imageUpload, onFileSelectChange, beforeUpload, openFileUpload  } from 'utils/ossUploadUtils'
import AddManyImgsModal from './components/AddManyImgsModal'
@connect(({ filterDetail, loading, bucket , app}) => ({ filterDetail, loading, bucket, app }))
class BuildingInterpret extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
     
    }
  }
  componentWillReceiveProps() {
    this.forceUpdate()
  

  }
  render() {
    const { dispatch,filterDetail,bucket,getDestory, app } = this.props
    const { initHyperText,ueditorInfo,bfProjectId, status } = filterDetail
    const { user } = app
    const { loginName } = user
    const getUeditor = (ueditorObj) => {
      if (ueditorObj) {
        dispatch({
          type: 'filterDetail/saveUeditor',
          payload: ueditorObj,
        })
      }
    }
    const saveUeditorInfo = (content) => {
      if (content) {
        // let mes = JSON.stringify(content)
        dispatch({
          type: 'filterDetail/saveUeditorInfo',
          payload: content,
        })
      }
    }
    const submitUeditorInfo = () => {
      if (status === '1') {
        message.warning('请下架商品后再操作')
        return
      }
      dispatch({
        type: 'filterDetail/submitUeditorInfo',
        payload: {
          readInfo: ueditorInfo,
          bfProjectId,
          loginName,
        },
        // sucess: () => {
        //   // 富文本信息查询
        //  dispatch({
        //     type: 'filterDetail/getUeditorInfo',
        //     payload: {
        //       bfProjectId,
        //     },
        //   })
        // }
      })
    }
    const onCancel = () => {

    }
    const onOk = () => {

    }
    const addAndSortImgsProps = {
      openFileUpload,
      dispatch,
      onFileSelectChange,
      bucket,
      beforeUpload,
      // goodsIntroImgList,
      // getRdmStr,
      // floatL,
      // getFieldDecorator,
      // handlePreview,
      // removeMultipleImgs,
      // isLook,
      // toLeft,
      // toRight,
      // previewVisible,
      // addMultipleImageProps,
      // previewImage,
    }
    return (
      <div>
        <Button type="primary" onClick={ submitUeditorInfo } style={{marginBottom: '20px'}}>保存</Button>
        <Input type="hidden" />
        <ReactUeditor
          value={initHyperText || ''}
          ueditorPath="/ueditor"
          plugins={['uploadImage', 'insertCode']}
          onChange={(content) => saveUeditorInfo(content) }
          uploadImage={(e) => {
            imageUpload(e, bucket, ReactUeditor)
          }}
          beforeUpload={() => renewBucketData(dispatch)}
          isManyImg={false}
          dispatch={dispatch}
          getUeditor={getUeditor}
          style={{width:'100%',minHeight:'400px'}}
          getDestory = {getDestory}
        />
        {/* <AddManyImgsModal
          visible={isShowModal}
          onCancel={onCancel}
          toAddUeditorImgs={onOk}
          ueditorImgs={ueditorImgs}
          addAndSortImgsProps={addAndSortImgsProps}
        /> */}
      </div>
    )
  }
}

BuildingInterpret.propTypes = {
  filterDetail: PropTypes.object,
  // dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default BuildingInterpret
