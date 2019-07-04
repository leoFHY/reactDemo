import React from 'react';
import { Modal, Button } from 'antd';
import PropTypes from 'prop-types'


const QrCodeModal = ({
    visible,
    handleCancel,
    url,
    code,
    onDown1,
    onDown2,
  }) => {
  return(
    <div>
      < Modal title = "查看二维码"
          visible={visible}
          onCancel={() => handleCancel()}
          width = {400}
          style = {{textAlign: 'center'}}
          footer={null}
          maskClosable = {
            false
          }
          >
           <div style = {{padding: '0 10px'}}>
                <div style={{ padding: '15px',border: '1px solid #ccc',textAlign: 'center'}}>
                    <div style={{ color: '#8f949a',marginBottom: '10px'}}>微信</div>
                    {/* <QrCode value={url} size={120}/>
                    <QrCode value={url} size={500} style = {{display: 'none'}}/>
                    <QrCode value={url} size={1000} style = {{display: 'none'}}/> */}
                     <img src={`http://${url}`} style={{width:"128px",height:"128px"}} />
                    <div style={{ color: '#8f949a',marginTop: '10px'}}>识别码 : {code}</div>
                </div>
           </div>
           <div style = {{marginTop: '20px',textAlign: 'center'}}> 
                  <Button type="primary" onClick= {() => onDown1(code,`http://${url}`)}>500X500下载</Button>
                  {/* &nbsp;&nbsp;
                  <Button type="primary" onClick= {() => onDown2(code)}>1000X1000下载</Button> */}
            </div>  
      </Modal>
    </div>
  )
}


QrCodeModal.propTypes = {
  visible : PropTypes.bool,
  handleOk : PropTypes.func,
  handleCancel: PropTypes.func, 
}
export default QrCodeModal