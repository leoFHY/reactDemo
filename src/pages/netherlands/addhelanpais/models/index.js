/* global window */
import modelExtend from 'dva-model-extend'
import { filterModelNoPage,filterModel } from 'utils/pmodel'
import { message } from 'antd';
import { deepCopy } from 'utils/copy'
import {

  productShowcaseList,
  helanpaiPage,
  deleteSpecialOffer,
  upDateHelanpaiStatus,
  specialOfferDetail,
  addOrUpdate,
  discountHouse,
  downHelanpais,
  saveDownHelanpais,
  houseList,
  BfProjectAreaByHouseId
} from '../services';

export default modelExtend(
  // filterModelNoPage({ reqFn: helanpaiPage, namespace: 'Netherlands'}),
  filterModel({ reqFn: downHelanpais, namespace: 'Addhelanpais'}),
  {
    namespace: 'Addhelanpais',
    state: {
      // 区域下拉框列表
      areaList:[],
      // 更新商品名称列表
      updateGoodsList: [],
      editData: {},
      offerDetailData:{},
      // 多选框使用
      typeCheck: [{
        value: '1',
        label: '蓝光员工',
      }, {
        value: '2',
        label: '业主／租户／商户',
      }, {
        value: '3',
        label: '供应商',
      }, 
      // {
      //   value: '5',
      //   label: '手牵手',
      // }
      {
        value: '6',
        label: '蓝朋友',
      }
    ],
      // 房源列表
      treeList: [],
      // 房源显示与否
      treeShow: false,
      treeShow2: false,
      // 房源id
      houseId: '',
      houseName: '',
      // 编辑回显数据
      editData: {},
      // 详情数据
      detailData: {}, 
      // 保存图片
      listImg: [
        // {
        // uid:0,
        // }
      ],
      houseId:[], 
      houseName:[], 
      previewShow:false, 
      previewSrc:'',
      productShowcaseList:[],
      bfProjectStatus:[
        {status:'0',name:'下架'},
        {status:'1',name:'上架'},
        ],
      activityStatus:[
        {status:'0',name:'未开始'},
        {status:'1',name:'进行中'},
        {status:'2',name:'已结束'},
        ],
      page:1,
      downHelanpaisList:[],
      
      previewShow:false,
      previewSrc:'',
       
    },
    subscriptions: {
      setup({ dispatch, history }) {
        history.listen(location => {
          if (location.pathname === '/netherlands/addhelanpais') {
            console.log(1111)
            dispatch({
              type: 'getPageList',
              payload: {
                  pageNum:1,
                  pageSize:10
              },
            });
  
          }
        });
      },
    },

    effects: {
      *getPageList({ payload}, { put, call, select }) {
        const ret = yield call(downHelanpais, payload);
        const { code,data } = ret
        console.log(payload)
        if (code === 'S000000') {
          console.log(data)
          // return
          yield put ({
            type: 'savePageList',
            payload: data
          })
          let arr = deepCopy(data)
          let list = []
          arr.map((v, i) => {
            list.push(
              {
                url : v.houseDiscountPic,
                uid : i,
                status : 'done'
              })   
          })
          console.log(list)
          // return
          yield put ({
            type: 'saveMediaImages',
            payload: {
              data:list
            }
          })
         
        } else {
          message.warning(ret.message)
        }
      },
       // 保存列表
      *getDownHelanpais({ payload,success}, { put, call, select }) {
        const ret = yield call(saveDownHelanpais, payload);
        const { code,data } = ret
        
        if (code === 'S000000') {
          success && success()
          console.log(data)
          yield put ({
            type: 'savePageList',
            payload: data
          })
         
        }else if(code === 'error'){
          message.warning('重复房源，无法保存')
        }
        else {
          message.warning(ret.message)
        }
      },
      //项目名称列表
      *getProductShowcaseList({ payload}, { put, call, select }) {
        const ret = yield call(productShowcaseList, payload);
        const { code,data } = ret
        
        if (code === 'S000000') {
          console.log(data)
          yield put ({
            type: 'saveProductShowcaseList',
            payload: data
          })
         
        } else {
          message.warning(ret.message)
        }
      },
      
       //下架上架
       *getUpDateStatus({ payload,success}, { put, call, select }) {
         console.log(payload)
        //  return
        const ret = yield call(upDateHelanpaiStatus, payload);
        const { code,data } = ret
        
        if (code === 'S000000') {
          
          // console.log(payload)
          message.success(payload.status==='1'?'发布成功':'下架成功')
          success && success()
          return
          yield put ({
            type: 'saveUpDateStatus',
            payload: data
          })
         
        } else {
          message.warning(ret.message)
        }
      },

      //删除
       *del ({ payload,success }, { put, call, select }) {
        const ret = yield call(deleteSpecialOffer, payload);
        const { code, data } = ret
        if (code === 'S000000') {
            message.success('删除成功')
            success && success()
        } else {
          message.warning(ret.message)
        }
      },
      //优惠详情
      *getOfferDetail ({ payload,success }, { put, call, select }) {
        const ret = yield call(specialOfferDetail, payload);
        const { code, data } = ret
        // console.log(111)
        if (code === 'S000000') {
          yield put({
            type: 'saveOfferDetailData',
            payload: data,
          })
           
          // success && success()
          
        } else {
          message.warning(ret.message)
        }
      },
      //优惠详情
      *getAddOrUpdate ({ payload,success }, { put, call, select }) {
        const ret = yield call(addOrUpdate, payload);
        const { code, data } = ret
        // console.log(111)
        if (code === 'S000000') {
          success && success()
          // yield put({
          //   type: 'saveOfferDetailData',
          //   payload: data,
          // })
           
          // success && success()
          
        } else {
          message.warning(ret.message)
        }
      },
      //优惠房源列表
      *getHouseList({ payload,success }, { put, call, select }) {
        const ret = yield call(houseList, payload);
        const { code, data } = ret
        // console.log(111)
        if (code === 'S000000') {
          // console.log(data)
          // const { treeList } =  yield select(state => state.treeList)
          // console.log(treeList)
          const dataList = []
          if(payload.type === '1'){
            data.map(v => {
              dataList.push({key:v.id,title:v.name,children:[],type:'1'})
            })
            console.log(dataList)
            yield put({
              type: 'saveHouseList',
              payload:dataList,
            })
           
          }
          if(payload.type === '2'){
            const treeList  = yield select(state => state.Addhelanpais.treeList)
            let dataList = deepCopy(treeList)
            dataList.map(one => {
              if(one.key === payload.id) {
                if(one.children[0]) {
                  
                  one.children = []
                }
                data.map(v => {
                  
                  one.children.push({key:v.id,title:v.name,children:[],type:'2',groupid:payload.id})  
                })
              } 
            })
            
            yield put({
              type: 'saveHouseList',
              payload:dataList,
            })
            
          }

          if(payload.type === '3'){
            const treeList  = yield select(state => state.Addhelanpais.treeList)
            let dataList = deepCopy(treeList)
            dataList.map(one => {
              // console.log(j)
              if(one.children[0]){
                if(one.key === one.children[0].groupid) {
                  one.children.map(two => {
                    if(two.key === payload.id ) {
                      if(two.children[0]) {return}
                      data.map(v => {
                        two.children.push({key:v.id,title:v.name,children:[],type:'3',groupid:payload.id})  
                      })
                    } 
                 
                })
                
                } 
              }
            })
            
            yield put({
              type: 'saveHouseList',
              payload:dataList,
            })
          }
          if(payload.type === '4'){
            const treeList  = yield select(state => state.Addhelanpais.treeList)
            let dataList = deepCopy(treeList)
            // console.log(dataList)
            // console.log(payload.id)
            // console.log(data)
            dataList.map(one => {
              // console.log(j)
              if(one.children[0]){
                if(one.key === one.children[0].groupid) {
                // console.log(one)
                one.children.map(two => {
                  
                  // console.log(two)
                  two.children.map(three => {
                    // console.log(three)
                    if(three.key === payload.id){
                      if(three.children[0]) {return}
                      data.map(v => {
                        three.children.push({key:v.id,title:v.name,children:[],type:'4',groupid:payload.id})
                      })
                    }
                  })

                  // if(n.key === payload.id ) {
                  //   if(n.children[0]) {return}
                  //   data.map(v => {
                  //     n.children.push({key:v.id,title:v.name,children:[],type:'3',groupid:payload.id})  
                  //   })
                  // } 
                 
                })
                
                } 
              }
            })
            
            yield put({
              type: 'saveHouseList',
              payload:dataList,
            })
            // console.log(dataList)
          }


          success && success()
          
        } else {
          message.warning(ret.message)
        }
      },
      *getBfProjectAreaByHouseId ({ payload,success }, { put, call, select }) {
        const ret = yield call(BfProjectAreaByHouseId, payload);
        const { code, data } = ret
        // console.log(111)
        if (code === 'S000000') {
          console.log(data)
          success && success(data)
          // yield put({
          //   type: 'saveOfferDetailData',
          //   payload: data,
          // })
           
          // success && success()
          
        } else {
          message.warning(ret.message)
        }
      },
    },
    reducers: {
      // 保存区域下拉框列表
      saveAreaList (state, { payload }) {
        console.log(payload)
        return {
          ...state,
          areaList: payload,
        };
      },
      
      // 保存项目名称列表
      saveProductShowcaseList (state, { payload }) {
        // console.log(payload)
        return {
          ...state,
          productShowcaseList: payload,
        };
      },
      saveUpdateGoods (state, { payload }) {
        return {
          ...state,
          updateGoodsList: payload.data,
        };
      },
      saveList (state, { payload }) {
        return {
          ...state,
          editData: payload,
        };
      },
      openPreview (state, { payload }) {
        return {
          ...state,
          previewShow: payload.previewShow,
          previewSrc: payload.previewSrc,
        };
      },
      // 保存图片
      saveMediaImages (state, { payload }) {
        console.log(payload)
        return {
          ...state,
          listImg: payload.data,
        };
      },
      //保存分页
      saveOnchangePage (state, { payload }) {
        return {
          ...state,
          page: payload,
        };
      },
      //保存分页
      saveUpDateStatus (state, { payload }) {
        return
        return {
          ...state,
          page: payload,
        };
      },
      
      //优惠详情
      saveOfferDetailData (state, { payload }) {
        return {
          ...state,
          offerDetailData: payload,
        };
      },
      
      //优惠房源列表
      saveHouseList (state, { payload }) {
        return {
          ...state,
          treeList: payload,
        };
      },
      changeTreeShow (state, { payload }) {
        return {
          ...state,
          treeShow:payload
        }
      },
      changeTreeShow2 (state, { payload }) {
        return {
          ...state,
          treeShow2:payload
        }
      },
      saveHouseId (state, { payload }) {
        return {
          ...state,
          houseId:payload.houseId,
          houseName:payload.houseName
        }
      },
      
      //保存未上架荷兰拍列表
      savePageList (state, { payload }) {
        return {
          ...state,
          downHelanpaisList:payload
        }
      },

      openPreview (state, { payload }) {
        return {
          ...state,
          previewShow: payload.previewShow,
          previewSrc: payload.previewSrc,
        };
      },
      
    } 
  });
