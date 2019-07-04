import React from 'react'
import { Upload, message, Icon ,Modal,Form} from 'antd'
import './common.less'
import {
  multipleImageUploadFan,
  openFileUpload,
} from 'utils/ossUploadUtils'

const AddMultipleImage = ({
  bucket,
  dispatch,
  saveMultipleImgs,
  previewImage,
  previewVisible,
  fileName,
  listImg,
  fileList,
  multiple
}) => {
  const imgsList = []
  const handleCancel = () => {
    dispatch({
      type: 'filterDetail/onCancel',
      payload: {
        previewVisible: false,
      },
    })
  }
  return (
    <div 
    //  className="clearfix uploadImg-w-h-80"
      onClick={(e) => { 
        openFileUpload(e, dispatch,fileName)
      }}
      style = {{
        // width:'1000px',
        display: 'inline-block'}}
    >
      <Upload name="file"
        listType={'picture-card'}
        multiple = {multiple}
        accept="image/*"
        // defaultFileList={fileList}
        fileList={[]}
        beforeUpload={(e) => {
          // if (listImg.length && listImg.length > 8) {
          //   message.warn('图片最多上传8张，请重新上传')
          //   return false
          // }
          // let isLt200k = e.size / 1024 > 200
          // if (isLt200k) {
          //   message.warn('图片大小不能超过200kb,请重新上传!')
          //   return !isLt200k
          // }
          imgsList.push(multipleImageUploadFan(e, bucket))
          return false
        }}
        onPreview = {
          (file) => {
            dispatch({
              type: 'filterDetail/onPreview',
              payload: {
                previewImage: file.url || file.thumbUrl,
                previewVisible: true,
              },
            })
          }
        }
        onChange={(e) => {
          message.destroy()
          message.loading('图片正在上传中，请稍后',10)
          
          // return
          if (imgsList.length === e.fileList.length) {
            Promise.all(imgsList).then((res) => {
              message.destroy()
              saveMultipleImgs(res)    
            }, (rej) => {
              message.warning(rej)
            }).catch((err) => {
              // message.warning(err)
              console.log('err',err)           
            })
          }
        }}
      >
       <div>
          <Icon type="plus" />
        </div>
      </Upload>
      {/* <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal> */}
    </div>
  )
}

export default AddMultipleImage
