import React from 'react';
import { Modal, Form, Upload } from 'antd';
import { deepCopy } from 'utils/copy'
import PropTypes from 'prop-types'
import styles from './index.less'
import { getValue } from 'utils/transformData'
const DetailModal = ({
    visible,
    handleOk,
    handleCancel,
    raffle,
    dispatch
  }) => {
    const { editList,listImg1,listImg2,previewSrc,previewShow,prizeTypeList } = raffle
    const ImgPicList1 = [],ImgPicList2 = []
    if (listImg1) {
      listImg1.forEach((item, i) =>  {
        ImgPicList1[i] = {}
        ImgPicList1[i].uid = i
        ImgPicList1[i].url = item.prizePic
      })
    }
    if (listImg2) {
      listImg2.forEach((item, i) => {
        ImgPicList2[i] = {}
        ImgPicList2[i].uid = i
        ImgPicList2[i].url = item.prizePic
      })
    }
  return(
    <div>
      <Modal title = '查看详情'
          visible={visible}
          onOk={handleOk} 
          onCancel={handleCancel}
          okText = "确认"
          cancelText = "取消"
          width = {800}
          style={{top:40}}
          maskClosable = {false}
      > 
        <ul className = {styles.box} >
          <li>
            <span>奖品名称 :</span>
            <span>{editList.prizeName}</span>
          </li>
          <li>
            <span>数量 :</span>
            <span>{editList.prizeCount}</span>
          </li>
          <li>
            <span>类型 :</span>
            <span>{getValue(editList.prizeType,prizeTypeList)}</span>
          </li>
          <li>
            <span>图片1 :</span>
            <div className= {styles.img}>
              <Upload
                    fileList = { deepCopy(ImgPicList1) }
                    listType="picture-card"
                    onPreview={
                      (file) => {
                        dispatch({
                          type: 'raffle/openPreview',
                          payload: {
                              previewSrc: file.url || file.thumbUrl,
                              previewShow: true,
                          }
                        })
                      }
                    }
                    showUploadList = {
                      {showRemoveIcon: false}
                    }
                  >   
              </Upload>
            </div>
          </li>
          <li>
            <span>图片2 :</span>
            <div className= {styles.img}>
                <Upload
                      fileList = { deepCopy(ImgPicList2) }
                      listType="picture-card"
                      onPreview={
                        (file) => {
                          dispatch({
                            type: 'raffle/openPreview',
                            payload: {
                                previewSrc: file.url || file.thumbUrl,
                                previewShow: true,
                            }
                          })
                        }
                      }
                    >   
                </Upload>
            </div>
          </li>
        </ul>
        <Modal visible={previewShow} footer={null} onCancel={
              () => {
                dispatch({
                  type: 'raffle/openPreview',
                  payload: {
                    previewSrc: '',
                    previewShow: false,
                  }
                })
              }
            }
            maskClosable = {false}
            >
                <img alt="example" style={{ width: '100%' }} src={previewSrc} />
          </Modal>
      </Modal>
    </div>
  )
}

DetailModal.propTypes = {
  visible : PropTypes.bool,
  handleOk : PropTypes.func,
  handleCancel: PropTypes.func, 
}
export default DetailModal