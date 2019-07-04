/* global window */
import modelExtend from 'dva-model-extend'
import { filterModelNoPage,filterModel } from 'utils/pmodel'
import { message } from 'antd';
import {
  areaList,
  productShowcaseList,
  helanpaiPage,
  deleteSpecialOffer,
  upDateHelanpaiStatus,
  specialOfferDetail,
  addOrUpdate,
  discountHouse,
  downHelanpais,
  helanpaiExport
} from '../services';

export default modelExtend(
  // filterModelNoPage({ reqFn: helanpaiPage, namespace: 'Netherlands'}),
  filterModel({ reqFn: helanpaiPage, namespace: 'Netherlands',downloadFn : helanpaiExport}),
  {
    namespace: 'Netherlands',
    state: {
      // 区域下拉框列表
      areaList:[],
      // 更新商品名称列表
      updateGoodsList: [],
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
      listImg: [],
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
      downHelanpaisList:[]
       
    },
    subscriptions: {
      setup({ dispatch, history }) {
        history.listen(location => {
          if (location.pathname === '/netherlands') {
            dispatch({
              type: 'getPageList',
              payload: {
                  pageNum:1,
                  pageSize:10
              },
            });
            dispatch({
              type: 'getAreaList',
              payload: {},
            });
            dispatch({
              type: 'getProductShowcaseList',
              payload: {},
            });
            dispatch({
              type: 'getUpdateGoods',
              payload: {},
            });
            
          }
        });
      },
    },

    effects: {
       // 区域下拉框
      *getAreaList({ payload}, { put, call, select }) {
        const ret = yield call(areaList, payload);
        const { code,data } = ret
        
        if (code === 'S000000') {
          console.log(data)
          yield put ({
            type: 'saveAreaList',
            payload: data
          })
         
        } else {
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
          success && success()
          // console.log(payload)
          message.success(payload.status==='1'?'发布成功':'下架成功')
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
        const ret = yield call(discountHouse, payload);
        const { code, data } = ret
        // console.log(111)
        if (code === 'S000000') {
          console.log(data)
          const dataList = []
          const generateList = (data) => {
            let children = []
            for (let i = 0; i < data.length; i += 1) {
              const node = data[i]
              const name = node.houseName
              children.push({
                key: node.houseId,
                title: name,
              })
              if (node.houseList) {
                children[i].children = generateList(node.houseList)
              }

            }
            return children
          }
          // generateList(data)
          data.forEach((v, i) => {
            dataList.push({
              key: v.buildingId,
              title: v.buildingName,
              disable: '0',
              children: generateList(v.houseList)
            })
          })
          // return
          
          yield put({
            type: 'saveHouseList',
            payload: dataList,
          })
           
          success && success()
          
        } else {
          message.warning(ret.message)
        }
      },

      //未上架荷兰拍列表
      *getDownHelanpais ({ payload,success }, { put, call, select }) {
        const ret = yield call(downHelanpais, payload);
        const { code, data } = ret
        // console.log(111)
        if (code === 'S000000') {
          console.log(data)
          // success && success()
          yield put({
            type: 'saveDownHelanpaisList',
            payload: data,
          })
           
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
      saveDownHelanpaisList (state, { payload }) {
        return {
          ...state,
          downHelanpaisList:payload
        }
      },
      
    } 
  });
