import React from 'react'
import { Button, Upload, Modal } from 'antd'
import AddMultipleImage from 'components/Upload/AddMultipleImage'

const AddAndSortImgs = ({
    goodsIntroImgList,
    openFileUpload,
    dispatch,
    onFileSelectChange,
    bucket,
    beforeUpload,
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
    // visible
}) => {
  return (
    <div>
      {goodsIntroImgList.map((v, i) => {
        return (
          <div key={getRdmStr(8)} style={{ ...floatL }} className="clearfix" onClick={(e) => { openFileUpload(e, dispatch) }} >
            {getFieldDecorator(`avator${i}`, {
                        //  rules: [{
                        //    required: true, message: '橱窗图组不能为空!',
                        //  }],
              valuePropName: 'fileList',
              initialValue: [
                            { uid: getRdmStr(8), url: v },
              ],
              getValueFromEvent: e => onFileSelectChange(e, bucket),
            })(
              <Upload name="file" action={bucket.host}
                accept="image/*"
                listType="picture-card"
                data={bucket.bucketData}
                onPreview={handlePreview.bind(this, '1')}
                beforeUpload={e => beforeUpload(e, dispatch)}
                onRemove={() => {
                  !isLook && removeMultipleImgs(i)
                  return false
                }}
              />
                    )}
            <div>
              <Button style={{ marginBottom: 10 }} size="small" onClick={toLeft.bind(this, i)}>左移</Button>
              <Button size="small"
                onClick={toRight.bind(this, i)}
                style={{ marginLeft: 10, marginBottom: 10 }}
              >右移</Button>
            </div>
          </div>
        )
      })}
      {(goodsIntroImgList.length >= 5 || isLook) && !visible ? '' :
      <AddMultipleImage style={{ ...floatL }} {...addMultipleImageProps} />}

      <Modal visible={previewVisible} footer={null} onCancel={handlePreview.bind(this, '0')} maskClosable = {false}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  )
}

export default AddAndSortImgs
