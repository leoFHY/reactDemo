import React, { Component } from 'react'
import { Upload, Icon, Modal } from 'antd'
import { connect } from 'dva'
import moment from 'moment'
import 'moment/locale/zh-cn'

moment.locale('zh-cn')

const style = {
  listBody: {
    width: '100%',
  },
}
class imagesUpLoad extends Component {
  constructor (props) {
    super(props)
    this.state = {
      previewVisible: false,
      previewImage: '',
      bucketData: null,
      bannerImg: '',
      imgList: [],
      fileList: [],
      // pageLength: this.porps.pageLength ? this.porps.pageLength : 1
    }
    this.open = this.open.bind(this)
    this.beforeUpload = this.beforeUpload.bind(this)
  }
  componentWillMount () {
    let homePage = []
    if (this.props.dataList > 0) {
      let home = this.dataList
      for (let i = 0; i < home.length; i++) {
        let image = home[i]
        let model = {
          uid: image,
          name: image,
          status: 'done',
          url: image,
          thumbUrl: image,
        }
        homePage.push(model)
      }
      console.log('=========组图', homePage)
      this.setState({
        filesList: homePage,
      })
    }
  }
  open () {
    console.log('=========打开')
    this.props.dispatch({
      type: 'app/bucketList',
    })
  }

  beforeUpload (file) {
    // let error = false
    let bucketData = {
      OSSAccessKeyId: '',
      policy: '',
      signature: '',
      success_action_status: '200',
      key: '',
    }
    const isJPG = file.type === 'image/jpeg'
    if (!isJPG) {
      this.setState({
        errorImg: true,
      })
      // return
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      this.setState({
        errorImg: true,
      })
      // return
    }
    console.log('==============oss', this.props.app.ossBuckedData)
    if (this.props.app.ossBuckedData) {
      let date = Date.parse(new Date())
      bucketData = {
        ...bucketData,
        OSSAccessKeyId: this.props.app.ossBuckedData.accessid,
        policy: this.props.app.ossBuckedData.policy,
        signature: this.props.app.ossBuckedData.signature,
        key: `${this.props.app.ossBuckedData.dir}${file.uid}${date}`,
      }
      this.setState({
        bucketData,
      })
      if (this.state.fileList) {
        let list = this.state.fileList
        let url = `${this.props.app.ossBuckedData.host}/${this.props.ossBuckedData.bucketData.dir}${file.uid}${date}`
        let img = { path: url }
        list.push(img)
        // console.log('----------------组图', url)
        this.setState({
          imgList: list,
        })
      } else {
        let url = `${this.props.app.ossBuckedData.host}/${this.props.app.ossBuckedData.dir}${file.uid}${date}`
        // console.log('----------------主图', url)
        this.setState({
          bannerImg: url,
        })
      }
      this.setState({
        errorImg: false,
      })
    }
    // return
    // return error
  }

  handleCancel = () => {
    this.setState({ previewVisible: false })
  }
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    })
  }
  render () {
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    )
    const fileList = this.props.filterDetail.projectInformation.fileList
    return (
      <div className="clearfix" onClick={this.open} >
        <Upload
          action={this.props.app.ossBuckedData ? this.props.app.ossBuckedData.host : null}
          listType="picture-card"
          data={this.state.bucketData}
          defaultFileList={fileList}
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          onRemove={this.props.onRemove}
          beforeUpload={this.beforeUpload}
          accept = "image/*"
        >
          {/* {
            filterDetail.projectInformation.fileList.length >= this.props.pageLength ? null : uploadButton
          } */}
        </Upload>
        <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel} maskClosable = {false}>
          <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} 
          />
        </Modal>
      </div>
    )
  }
}


export default connect(({ app,filterDetail }) => ({ app,filterDetail }))(imagesUpLoad)
