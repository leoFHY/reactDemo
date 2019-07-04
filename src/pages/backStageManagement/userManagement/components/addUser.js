import React from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Input, Button, Form, Select, TreeSelect, Checkbox, Upload, Icon, message } from 'antd'
// import { hashHistory } from 'dva/router'
import { onFileSelectChange, beforeUpload, openFileUpload } from 'utils/ossUploadUtils'
import { relativeTimeRounding } from 'moment';

const TreeNode = TreeSelect.TreeNode
const FormItem = Form.Item
const { TextArea } = Input
const CheckboxGroup = Checkbox.Group

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
}
const style = {
  butn: {
    textAlign: 'center',
  },
  butnStyle: {
    margin: '0 20px',
  },
}
const Filter = ({
  dispatch,
  userManagement,
  form,
  bucket,
  argumes,
  app
}) => {
  let imgMaxSize
  const { getFieldDecorator, getFieldValue } = form
  const checkPassword = (rule, value, callback) => {
    if (value && value !== form.getFieldValue('password')) {
      callback('两次的密码不一致!')
    } else {
      callback()
    }
  }
  const checkConfirm = (rule, value, callback) => {
    if (value && userManagement.confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()
  }
  // const handleConfirmBlur = (e) => {
  // const value = e.target.value
  // this.setState({ confirmDirty: userManagement.confirmDirty || !!value })
  // }
  const handleCallBack = () => {
    form.resetFields()
    dispatch({
      type: 'userManagement/setTabKeys',
      payload: {
        key: '1',
        text: '新增',
        userID: '',
      },
    })
  }
  const handleReset = () => {
    form.resetFields()
  }
  argumes(handleReset)
  const handleSubmit = (e) => {
    e.preventDefault()
    form.validateFields((error, value) => {
      if (!error) {
        value.id = app.user.userId || ''
        if (!value.id){
          message.warning('没有获取到用户id,请查看是否登录')
          return
        }
        let list = []
        if (value.buildings.length){
          value.buildings.map((item) => {
            list.push(String(item))
          })
        }
         value.buildings = list
        if (userManagement.tabText === '修改') {
          dispatch({
            type: 'userManagement/getEditUser',
            payload: {
              ...value,
              photo: value.photo && value.photo[0] ? value.photo[0].url : '',
            },
          })
        } else {
          dispatch({
            type: 'userManagement/getAddUser',
            payload: {
              ...value,
              photo: value.photo && value.photo[0] ? value.photo[0].url : '',
            },
          })
        }
        form.resetFields()
      }
    })
  }
  const renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (<TreeNode title={item.name} key={item.id} dataRef={item} value={item.id} selectable2={(() => {
          if (item.type === '2') {
            return false
          }
          return true
        })()}
        selectable={item.type === '2'}
        >
          {renderTreeNodes(item.children)}
        </TreeNode>)
      }
      return (<TreeNode title={item.name} key={item.id} dataRef={item} value={item.id}
        selectable={item.type === '2'}
      />)
    })
  }
  const renderTreeNodes1 = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (<TreeNode title={item.name} key={item.id} dataRef={item} value={item.id}>
          {renderTreeNodes1(item.children)}
        </TreeNode>)
      }
      return (<TreeNode title={item.name} key={item.id} dataRef={item} value={item.id}/>)
    })
  }
  const mediaChange = (e) => {
    // console.log(e)
    const roleList = userManagement.roleList
    let hasMedia = false
    for (let index = 0; index < roleList.length; index++) {
      if(e.includes(roleList[index].id) && roleList[index].name === '媒体'){
        hasMedia = true
        // return
      }
    }
    dispatch({
      type: 'userManagement/mediaChange',
      payload: hasMedia,
    })
    // console.log(hasMedia);
  }
  
  return (
    <Form onSubmit={handleSubmit}>
      {/* <FormItem label={'头像:'} extra="请上传头像" {...formItemLayout} >
        <div className="clearfix" onClick={(e) => { openFileUpload(e, dispatch) }}>
          {getFieldDecorator('photo', {
            valuePropName: 'fileList',
            initialValue: userManagement.tabText === '修改' ? userManagement.userDetail.photo : [],
            getValueFromEvent: (e) => {
              if (imgMaxSize) {
                return []
              }
              return onFileSelectChange(e, bucket)
            },
          })(
            <Upload
              name="file"
              action={bucket.host}
              listType="picture-card"
              accept="image/*"
              data={bucket.bucketData}
              onPreview={bucket.handlePreview}
              beforeUpload={(e) => {
                const isSize = e.size / 1024 > 200
                let reg = new RegExp(/^image\/jpeg|gif|jpg|png$/, 'i')
                if (!reg.test(e.type)) {
                  imgMaxSize = true
                  message.warn('图片格式不正确,请重新上传!')
                  return false
                }
                if (isSize) {
                  imgMaxSize = true
                  message.error('图片大小不能超过200kb,请重新上传!')
                  return !isSize
                }
                imgMaxSize = false
                beforeUpload(e, dispatch)
                return !isSize
              }}
              // onChange={(e) => {
              //   const file = e.fileList[0]
              //   if (file && file.status === 'done') {
              //
              //   } else {
              //     const isSize = e.file.size / 1024 > 200
              //     if (isSize) {
              //       // e.file = ''
              //       e.fileList[0].status = 'removed'
              //     }
              //   }
              // }
              // }
            >
              {
                !getFieldValue('photo') || !getFieldValue('photo').length ?
                  <div>
                    <Icon type="plus" />
                    <div className="ant-upload-text">Upload</div>
                  </div> : null
              }
            </Upload>
          )}
        </div>
      </FormItem> */}
      {/* <FormItem label={'归属公司:'} {...formItemLayout} >
        {getFieldDecorator('companyId', {
          rules: [{
            required: true,
            message: '归属公司必填!',
          }],
          initialValue: userManagement.tabText === '修改' ?
            userManagement.userDetail.companyId : userManagement.companyList[0].id,
        })(
          <TreeSelect
            treeNodeFilterProp="label"
            showSearch
            // allowClear
            treeData={userManagement.companyList}
            treeDefaultExpandAll
            onSelect={(value) => {
              setTimeout(() => {
                form.setFieldsValue({ companyId: value })
              }, 50)
            }}
          />
        )}
      </FormItem> */}
      <FormItem label={'归属部门:'} {...formItemLayout} >
        {getFieldDecorator('officeId', {
          rules: [{
            required: true,
            message: '归属部门必填!',
          }],
          initialValue: userManagement.tabText === '修改' ?
            userManagement.userDetail.officeId : userManagement.defOfficeId,
        })(
          <TreeSelect
            treeNodeFilterProp="title"
            showSearch
            allowClear
            treeDefaultExpandAll
            onSelect={(value) => {
              setTimeout(() => {
                form.setFieldsValue({ officeId: value })
              }, 50)
            }}
          >
            {renderTreeNodes1(userManagement.treeList)}
          </TreeSelect>
        )}
      </FormItem>
      <FormItem label={'工号:'} {...formItemLayout} >
        {getFieldDecorator('no', {
          // rules: [{
          //   required: true,
          //   message: '工号必填!',
          // }],
          initialValue: userManagement.tabText === '修改' ? userManagement.userDetail.no : '',
        })(
          <Input />
        )}
      </FormItem>
      <FormItem label={'姓名:'} {...formItemLayout} >
        {getFieldDecorator('name', {
          rules: [{
            required: true,
            message: '姓名必填!',
          }],
          initialValue: userManagement.tabText === '修改' ? userManagement.userDetail.name : '',
        })(
          <Input />
        )}
      </FormItem>
      <FormItem label={'登录名:'} {...formItemLayout} >
        {getFieldDecorator('loginName', {
          rules: [{
            required: true,
            message: '登录名必填!',
          }],
          initialValue: userManagement.tabText === '修改' ? userManagement.userDetail.loginName : '',
        })(
          <Input />
        )}
      </FormItem>
      {
        // userManagement.tabText === '修改' ? '' :
        <div>
          <FormItem label={'密码:'} {...formItemLayout} extra={userManagement.tabText === '修改' ? '若不修改密码，请留空。' : ''} >
            {getFieldDecorator('password', {
              rules: [
                userManagement.tabText === '修改' ? {} :
                  {
                    required: true,
                    message: '密码必填!',
                  },
                {
                  validator: checkConfirm,
                },
              ],
            })(
              <Input type="password" />
            )}
          </FormItem>
          <FormItem label={'确认密码:'} {...formItemLayout} >
            {getFieldDecorator('confirm', {
              rules: [
                userManagement.tabText === '修改' ? {} :
                  {
                    required: true,
                    message: '密码必填!',
                  },
                {
                  validator: checkPassword,
                },
              ],
            })(
              <Input type="password" />
            )}
          </FormItem>
        </div>
      }
      <FormItem label={'邮箱:'} {...formItemLayout} >
        {getFieldDecorator('email', {
          rules: [{
            type: 'email',
            message: '请输入正确的邮箱!',
          },
          ],
          initialValue: userManagement.tabText === '修改' ? userManagement.userDetail.email : '',
        })(
          <Input />
        )}
      </FormItem>
      <FormItem label={'电话:'} {...formItemLayout} >
        {getFieldDecorator('phone', {
          initialValue: userManagement.tabText === '修改' ? userManagement.userDetail.phone : '',
        })(
          <Input />
        )}
      </FormItem>
      <FormItem label={'手机:'} {...formItemLayout} >
        {getFieldDecorator('mobile', {
          rules: [{
            pattern: /^([1-9][0-9]*)$/,
            message: '请输入正确的手机号格式！',
          },
          ],
          initialValue: userManagement.tabText === '修改' ? userManagement.userDetail.mobile : '',
        })(
          <Input />
        )}
      </FormItem>
      <FormItem label={'是否允许登陆:'} extra="“是”代表此账号允许登录,“否”则表示此账号不允许登录" {...formItemLayout} >
        {getFieldDecorator('loginFlag', {
          rules: [{
            required: true,
            message: '必填!',
          }],
          initialValue: userManagement.tabText === '修改' ? userManagement.userDetail.loginFlag : '1',
        })(
          <Select>
            <Select.Option value="1">是</Select.Option>
            <Select.Option value="0">否</Select.Option>
          </Select>
        )}
      </FormItem>
      {/* <FormItem label={'用户类型:'} {...formItemLayout} >
        {getFieldDecorator('userType', {
          initialValue: userManagement.tabText === '修改' ? '' : '0',
        })(
          <Select>
            <Option value="0">任务分配</Option>
            <Option value="1">管理角色</Option>
            <Option value="2">普通角色</Option>
          </Select>
      )}
      </FormItem> */}
      <FormItem label={'用户角色:'} {...formItemLayout} >
        {getFieldDecorator('userRoles', {
          rules: [{
            required: true,
            message: '用户角色必选!',
          }],
          /* initialValue: ['0'], */
          initialValue: userManagement.tabText === '修改' ? userManagement.userDetail.userRoles : [],
        })(
          <CheckboxGroup onChange={mediaChange} options={userManagement.roleList} />
        )}
      </FormItem>
      <FormItem label={'楼盘:'} {...formItemLayout} >
        {getFieldDecorator('buildings', {
          initialValue: userManagement.tabText === '修改' ? userManagement.userDetail.buildings : [],
        })(
          // <CheckboxGroup options={userManagement.buildList} />
          <TreeSelect multiple treeNodeFilterProp="label" treeCheckable showCheckedStrategy={TreeSelect.SHOW_PARENT}>
            {
               renderTreeNodes1(userManagement.buildList)
            }
          </TreeSelect>
        )}
      </FormItem>
      {/* <FormItem label={'所属媒体:'} {...formItemLayout}>
        {getFieldDecorator('mediaId', {
          initialValue: userManagement.tabText === '修改' ? userManagement.userDetail.mediaId : '',
          rules: [{
            required: true,
            message: '所属媒体必选!',
          }],
        })(
          <Select>
            <Select.Option value={''} key={''}>不设置</Select.Option>
            {
              userManagement.mediaList.map(v => (
                <Select.Option value={v.id} key={v.id}>{v.value}</Select.Option>
              ))
            }
          </Select>
        )}
      </FormItem>
      <FormItem label={'用户类型:'} {...formItemLayout} >
        {getFieldDecorator('userType', {
          initialValue: userManagement.tabText === '修改' ? userManagement.userDetail.userType : '',
          rules: [{
            required: true,
            message: '用户类型必选!',
          }],
        })(
          <Select>
            {
              userManagement.dictList.map(v => (
                <Select.Option title={v.label} value={v.id} key={v.id}>{v.label}</Select.Option>
              ))
            }
          </Select>
        )}
      </FormItem> */}
      <FormItem label={'备注:'} {...formItemLayout} >
        {getFieldDecorator('remarks', {
          initialValue: userManagement.tabText === '修改' ? userManagement.userDetail.remarks : '',
        })(
          <TextArea autosize={{ minRows: 2, maxRows: 6 }} />
        )}
      </FormItem>
      {
        userManagement.tabText === '修改' ?
          <div>
            <FormItem label={'创建时间:'} {...formItemLayout} >
              <p>{`${userManagement.userDetail.createDate ? userManagement.userDetail.createDate : ''}`}</p>
            </FormItem>
            <FormItem label={'最后登陆:'} {...formItemLayout} >
              <p>
                {`IP: ${userManagement.userDetail.loginIp ? userManagement.userDetail.loginIp : ''}
                  时间：${userManagement.userDetail.loginDate ? userManagement.userDetail.loginDate : ''}`}
              </p>
            </FormItem>
          </div> : ''
      }
      <FormItem style={style.butn}>
        <Button size="large" onClick={handleCallBack}>返回</Button>
        <Button size="large" type="primary" htmlType="submit" style={style.butnStyle}>
        提交
        </Button>
        {
          userManagement.tabText === '修改' ? '' :
            <Button size="large" onClick={handleReset}>
          重置
            </Button>
        }
      </FormItem>
    </Form>
  )
}

const AddUser = Form.create()(Filter)
export default connect(({ userManagement, bucket , app }) => ({ userManagement, bucket, app }))(AddUser)
