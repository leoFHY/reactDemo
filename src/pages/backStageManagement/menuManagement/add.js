import React, { Component } from 'react'
import { connect } from 'dva'
import { Form, Input, InputNumber, Button, Radio, TreeSelect, Upload, Icon, Modal, message } from 'antd'
import { routerRedux } from 'dva/router'
// import { onFileSelectChange, beforeUpload, openFileUpload } from '../../../utils/ossUploadUtils'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const TextArea = Input.TextArea
const formatPageList = (data, id = '') => {
  let pageListTree = []
  data.forEach((v) => {
    if (v.id === id) {
      return
    }
    let o = {}
    o.label = v.name
    o.title = v.name
    o.value = v.id
    o.key = v.id
    if (v.children) {
      o.children = formatPageList(v.children, id)
    }
    pageListTree.push(o)
  })
  return pageListTree
}

class Add extends Component {
  constructor (props) {
    super(props)
    this.state = {
      previewVisible: false,
      imgMaxSize: false,
      options: [
        'lock', 'unlock', 'area-chart', 'pie-chart', 'bar-chart', 'dot-chart',
        'bars', 'book', 'calendar', 'cloud', 'cloud-download', 'code',
        'code-o', 'copy', 'credit-card', 'delete', 'desktop', 'download',
        'edit', 'ellipsis', 'file', 'file-text', 'file-unknown', 'file-pdf',
        'file-excel', 'file-jpg', 'file-ppt', 'file-add', 'folder', 'folder-open',
        'folder-add', 'hdd', 'frown', 'frown-o', 'meh', 'meh-o',
        'smile', 'smile-o', 'inbox', 'laptop', 'appstore-o', 'appstore',
        'line-chart', 'link', 'mail', 'mobile', 'notification', 'paper-clip',
        'picture', 'poweroff', 'reload', 'search', 'setting', 'share-alt',
        'shopping-cart', 'tablet', 'tag', 'tag-o', 'tags', 'tags-o',
        'to-top', 'upload', 'user', 'video-camera', 'home', 'loading',
        'loading-3-quarters', 'cloud-upload-o', 'cloud-download-o', 'cloud-upload', 'cloud-o', 'star-o',
        'star', 'heart-o', 'heart', 'environment', 'environment-o', 'eye',
        'eye-o', 'camera', 'camera-o', 'save', 'team', 'solution',
        'phone', 'filter', 'exception', 'export', 'customer-service', 'qrcode',
        'scan', 'like', 'like-o', 'dislike', 'dislike-o', 'message',
        'pay-circle', 'pay-circle-o', 'calculator', 'pushpin', 'pushpin-o', 'bulb',
        'select', 'switcher', 'rocket', 'bell', 'disconnect', 'database',
        'compass', 'barcode', 'hourglass', 'key', 'flag', 'layout',
        'printer', 'sound', 'usb', 'skin', 'tool', 'sync',
        'wifi', 'car', 'schedule', 'user-add', 'user-delete', 'usergroup-add',
        'usergroup-delete', 'man', 'woman', 'shop', 'gift', 'idcard',
        'red-envelope', 'coffee', 'copyright', 'trademark', 'safety',
        'wallet', 'bank', 'trophy', 'contacts', 'global', 'shake',
        'api', 'fork', 'dashboard', 'project', 'profile', 'filter', 'line-chart', 'user',
        'check-circle',
      ],
    }
  }
  backIndex = () => {
    // hashHistory.push({
    //   pathname: '/menuManagement',
    //   query: {
    //   },
    // })
    this.props.dispatch(routerRedux.push({
      pathname: '/backStageManagement/menuManagement',
    }))
  }
  handleSubmit (e) {
    e.preventDefault()
    const id = this.props.menuManagement.detailData.id
    const typeItem = this.props.menuManagement.detailData.typeItem
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        /* if (values.icon.length) {
          values.icon = values.icon[0].url
        } else {
          values.icon = ''
        } */
        if (id && typeItem) {
          this.props.dispatch({
            type: 'menuManagement/updateMenu',
            payload: { ...values, id },
            backIndex: this.backIndex,
          })
        } else {
          this.props.dispatch({
            type: 'menuManagement/add',
            payload: { ...values },
            backIndex: this.backIndex,
          })
        }
      }
    })
  }

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    })
  }
  resertAll () {
    this.props.form.resetFields()
    // this.state.parentId = ''
  }
  parentId (value, label, extra) {
    let m = extra.selected ? extra.triggerValue : ''
    this.state.parentId = m
  }
  render () {
    const model = this.props.menuManagement
    const isUpdate = this.props.location.query.item === 'update'
    const { getFieldDecorator, getFieldValue } = this.props.form
    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 14,
      },
    }
    return (
      <div>
        <Form onSubmit={this.handleSubmit.bind(this)} autoComplete="off">
          <FormItem {...formItemLayout} label="上级菜单" key="parentId">
            {getFieldDecorator('parentId', {
              initialValue: model.detailData.parentId,
              rules: [{
                required: true, message: '上级菜单为必填',
              }],
            })(
              <TreeSelect
                showSearch
                treeNodeFilterProp="label"
                // allowClear
                dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                treeData={formatPageList(model.pageList, model.detailData.id)}
                placeholder="请填写上级菜单"
                // onChange={this.parentId.bind(this)}
                onSelect={(value) => {
                  setTimeout(() => {
                    this.props.form.setFieldsValue({ parentId: value })
                  }, 50)
                }}
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="菜单名称" key="name">
            {getFieldDecorator('name', {
              initialValue: model.detailData.name,
              rules: [{
                required: true, message: '菜单名称为必填',
              }],
            })(
              <Input placeholder="请填写菜单名称" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="菜单链接" key="href">
            {getFieldDecorator('href', {
              initialValue: model.detailData.href,
              rules: [{
                // required: true, message: '菜单链接为必填',
              }],
            })(
              <Input placeholder="点击菜单跳转的页面" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="目标" key="target">
            {getFieldDecorator('target', {
              initialValue: model.detailData.target,
              rules: [{
                required: false,
                message: '目标最多10个字符',
              }],
            })(
              <Input maxLength="10" placeholder="链接地址打开的目标窗口，默认：mainFrame" />
            )}
          </FormItem>
          {/**
          <FormItem {...formItemLayout} label="图标" key="icon">
            <div className="clearfix" onClick={(e) => { openFileUpload(e, this.props.dispatch) }}>
              {getFieldDecorator('icon', {
                valuePropName: 'fileList',
                initialValue: model.detailData.icon[0].url ? model.detailData.icon : [],
                // rules: [{
                //   required: false, message: '图标为必填',
                // }],
                getValueFromEvent: (e) => {
                  if (this.state.imgMaxSize) {
                    return []
                  }
                  let result = onFileSelectChange(e, this.props.bucket)
                  return result
                },
              })(
                <Upload name="file" action={this.props.bucket.host}
                  accept="image/*"
                  listType="picture-card"
                  data={this.props.bucket.bucketData}
                  onPreview={this.handlePreview}
                  beforeUpload={(e) => {
                    const max = model.imgMaxSize
                    let imgMaxSize = e.size / 1024 > max
                    if (imgMaxSize) {
                      message.warn(`图片大小不能超过${max}kb,请重新上传!`)
                      this.state.imgMaxSize = true
                      return !imgMaxSize
                    }
                    this.state.imgMaxSize = false
                    beforeUpload(e, this.props.dispatch)
                    return !imgMaxSize
                  }}
                >
                  {
                    !getFieldValue('icon') || !getFieldValue('icon').length ?
                      <div>
                        <Icon type="plus" />
                        <div className="ant-upload-text">Upload</div>
                      </div> : ''
                  }
                </Upload>
              )}
            </div>
          </FormItem>
          */}
          <FormItem {...formItemLayout} label="排序" key="sort">
            {getFieldDecorator('sort', {
              initialValue: model.detailData.sort,
              rules: [{
                required: true, message: '排序必填，只能为数字', type: 'integer',
              }],
            })(
              <InputNumber min={1} precision={0} style={{ width: '100%' }} placeholder="请填写排序" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="可见" key="isShow">
            {getFieldDecorator('isShow', {
              initialValue: model.detailData.isShow || '1',
              rules: [{
                // required: true, message: '是否可见为必填',
              }],
            })(
              <RadioGroup>
                {model.showList.map((item) => {
                  return (<Radio value={item.id} key={item.id}><span style={{ marginRight: 8 }}>{item.name}</span></Radio>)
                })}
              </RadioGroup>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="权限标识" key="permission">
            {getFieldDecorator('permission', {
              initialValue: model.detailData.permission,
              rules: [{
                // required: true, message: '权限标识为必填',
              }],
            })(
              <Input placeholder="控制器中定义的权限标识，如：@RequiresPermissions(权限标识)" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="备注" key="remarks">
            {getFieldDecorator('remarks', {
              initialValue: model.detailData.remarks,
              rules: [{
                // required: true, message: '备注为必填',
              }],
            })(
              <TextArea placeholder="请填写备注" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="图标" key="icon">
            {getFieldDecorator('icon', {
              initialValue: model.detailData.icon,
            })(
              <RadioGroup>
                {
                  this.state.options.map((e, index) => <Radio key={index} value={e}>
                    <Icon type={e} style={{ fontSize: 16 }} />
                  </Radio>)
                }
              </RadioGroup>
            )}
          </FormItem>
          <div style={{ textAlign: 'center' }}>
            <Button onClick={this.backIndex}>返回</Button>
            <Button style={{ marginLeft: 30 }} type="primary" htmlType="submit">保存</Button>
            {!isUpdate ?
              <Button onClick={this.resertAll.bind(this)} style={{ marginLeft: 30 }}>重置</Button>
              : ''}
          </div>
        </Form>
        <Modal visible={this.state.previewVisible} footer={null} onCancel={() => this.setState({ previewVisible: false })}>
          <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
        </Modal>
      </div>
    )
  }
}

export default connect(({ menuManagement, bucket }) => ({ menuManagement, bucket }))(Form.create()(Add))
