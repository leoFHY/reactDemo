import React from 'react'
import { message } from 'antd'
const uploadByFormDataExcel = ({
  title, // 显示名
  fileCallBack,
  fileUploadName, //上传文件名
}) => {

  // 存放上传表格的文件名
  const fileUpload = (e) => {
    const list = e.target.files
    if(list[0].size > 1024 * 1024 * 10) {
      message.error('文件不能大于10M')
      e.target.value = null
      return
    }
    var name = ''
    // 处理多文件上传
    for(let i = 0;i < list.length;i++){
      if( i === list.length-1 ){
        name += list[i].name
      }else{
        name += list[i].name+'、'
      }
    }
    // dispatch({
    //   type: filePath,
    //   payload: list[0],
    // })
    //目前针对单文件上传
    fileCallBack(name,list[0])
    e.target.value = null
  }

  const styles = {
    upload: {
      color: '#999999',
      padding: '5px 11px',
      border: '1px solid #ccc',
      position: 'relative',
      textDecoration: 'none',
      cursor: 'pointer',
    },
    hiddenInput: {
      width:'100%',
      position: 'absolute',
      overflow: 'hidden',
      right: '0',
      top: '0',
      opacity: '0',
      cursor: 'pointer',
    },
    fileName: {
      marginLeft: '10px',
    },
  }
  return (
    <div>
      <a style = {styles.upload} >{title}
        <input
          type="file" onChange={fileUpload}
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          style = {styles.hiddenInput}
        />
      </a>
      <span style = {styles.fileName}>{fileUploadName}</span>
    </div>
  )
}

export default uploadByFormDataExcel
