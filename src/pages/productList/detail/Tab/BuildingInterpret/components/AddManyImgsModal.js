import React from 'react'
import { Button, Modal } from 'antd'
import AddAndSortImgs from './AddAndSortImgs'

const AddManyImgsModal = ({
visible,
onCancel,
toAddUeditorImgs,
ueditorImgs,
addAndSortImgsProps,
}) => {
  addAndSortImgsProps.goodsIntroImgList = ueditorImgs
  return (
    <div>
      <Modal
        style={{ height: '500px' }}
        width="60%"
        visible={visible}
        closable={false}
        onCancel={onCancel}
        onOk={toAddUeditorImgs}
        maskClosable = {false}
      >
        <AddAndSortImgs visible={visible} {...addAndSortImgsProps} />
      </Modal>
    </div>
  )
}

export default AddManyImgsModal
