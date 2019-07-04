import { Mock, Constant, qs, randomAvatar } from './_utils'

const { ApiPrefix } = Constant

let usersListData = Mock.mock({
  'data|80-100': [
    {
      id: '@id',
      name: '@name',
      nickName: '@last',
      phone: /^1[34578]\d{9}$/,
      'age|11-99': 1,
      address: '@county(true)',
      isMale: '@boolean',
      email: '@email',
      createTime: '@datetime',
      avatar() {
        return randomAvatar()
      },
    },
  ],
})

let database = usersListData.data

const EnumRoleType = {
  ADMIN: 'admin',
  DEFAULT: 'guest',
  DEVELOPER: 'developer',
}

const userPermission = {
  DEFAULT: {
    visit: ['1', '2', '21', '7', '5', '51', '52', '53'],
    role: EnumRoleType.DEFAULT,
  },
  ADMIN: {
    role: EnumRoleType.ADMIN,
  },
  DEVELOPER: {
    role: EnumRoleType.DEVELOPER,
  },
}

const adminUsers = [
  {
    id: 0,
    username: 'admin',
    password: 'admin',
    permissions: userPermission.ADMIN,
    avatar: randomAvatar(),
  },
  {
    id: 1,
    username: 'guest',
    password: 'guest',
    permissions: userPermission.DEFAULT,
    avatar: randomAvatar(),
  },
  {
    id: 2,
    username: '吴彦祖',
    password: '123456',
    permissions: userPermission.DEVELOPER,
    avatar: randomAvatar(),
  },
]

const queryArray = (array, key, keyAlias = 'key') => {
  if (!(array instanceof Array)) {
    return null
  }
  let data

  for (let item of array) {
    if (item[keyAlias] === key) {
      data = item
      break
    }
  }

  if (data) {
    return data
  }
  return null
}

const NOTFOUND = {
  message: 'Not Found',
  documentation_url: 'http://localhost:8000/request',
}

module.exports = {
  [`POST ${ApiPrefix}/user/login`](req, res) {
    const { username, password } = req.body
    const user = adminUsers.filter(item => item.username === username)

    if (user.length > 0 && user[0].password === password) {
      const now = new Date()
      now.setDate(now.getDate() + 1)
      res.cookie(
        'token',
        JSON.stringify({ id: user[0].id, deadline: now.getTime() }),
        {
          maxAge: 900000,
          httpOnly: true,
        }
      )
      res.json({ success: true, message: 'Ok' })
    } else {
      res.status(400).end()
    }
  },

  [`GET ${ApiPrefix}/user/logout`](req, res) {
    res.clearCookie('token')
    res.status(200).end()
  },

  [`GET ${ApiPrefix}/user`](req, res) {
    const cookie = req.headers.cookie || ''
    const cookies = qs.parse(cookie.replace(/\s/g, ''), { delimiter: ';' })
    const response = {}
    let user = {}
    if (!cookies.token) {
      res.status(200).send({ message: 'Not Login' })
      return
    }
    const token = JSON.parse(cookies.token)
    if (token) {
      response.success = token.deadline > new Date().getTime()
    }
    if (response.success) {
      const userItem = adminUsers.find(_ => _.id === token.id)
      if (userItem) {
        const { password, ...other } = userItem
        user = other
      }
    }
    response.user = user
    res.json(response)
  },

  [`GET ${ApiPrefix}/users`](req, res) {
    const { query } = req
    let { pageSize, page, ...other } = query
    pageSize = pageSize || 10
    page = page || 1

    let newData = database
    for (let key in other) {
      if ({}.hasOwnProperty.call(other, key)) {
        newData = newData.filter(item => {
          if ({}.hasOwnProperty.call(item, key)) {
            if (key === 'address') {
              return other[key].every(iitem => item[key].indexOf(iitem) > -1)
            } else if (key === 'createTime') {
              const start = new Date(other[key][0]).getTime()
              const end = new Date(other[key][1]).getTime()
              const now = new Date(item[key]).getTime()

              if (start && end) {
                return now >= start && now <= end
              }
              return true
            }
            return (
              String(item[key])
                .trim()
                .indexOf(decodeURI(other[key]).trim()) > -1
            )
          }
          return true
        })
      }
    }

    res.status(200).json({
      data: newData.slice((page - 1) * pageSize, page * pageSize),
      total: newData.length,
    })
  },

  [`POST ${ApiPrefix}/users/delete`](req, res) {
    const { ids=[] } = req.body
    database = database.filter(item => !ids.some(_ => _ === item.id))
    res.status(204).end()
  },

  [`POST ${ApiPrefix}/user`](req, res) {
    const newData = req.body
    newData.createTime = Mock.mock('@now')
    newData.avatar =
      newData.avatar ||
      Mock.Random.image(
        '100x100',
        Mock.Random.color(),
        '#757575',
        'png',
        newData.nickName.substr(0, 1)
      )
    newData.id = Mock.mock('@id')

    database.unshift(newData)

    res.status(200).end()
  },

  [`GET ${ApiPrefix}/user/:id`](req, res) {
    const { id } = req.params
    const data = queryArray(database, id, 'id')
    if (data) {
      res.status(200).json(data)
    } else {
      res.status(200).json(NOTFOUND)
    }
  },

  [`DELETE ${ApiPrefix}/user/:id`](req, res) {
    const { id } = req.params
    const data = queryArray(database, id, 'id')
    if (data) {
      database = database.filter(item => item.id !== id)
      res.status(204).end()
    } else {
      res.status(200).json(NOTFOUND)
    }
  },

  [`PATCH ${ApiPrefix}/user/:id`](req, res) {
    const { id } = req.params
    const editItem = req.body
    let isExist = false

    database = database.map(item => {
      if (item.id === id) {
        isExist = true
        return Object.assign({}, item, editItem)
      }
      return item
    })

    if (isExist) {
      res.status(201).end()
    } else {
      res.status(200).json(NOTFOUND)
    }
  },

  [`POST ${ApiPrefix}/user/getList`](req, res) {
    const { query } = req;
    const pageNum = req.body.pageNum || 1;
    const pageData = {
      code: 'S000000',
      message: '请求成功',
      data: {
        pageNum: 1,
        pageSize: 10,
        pageCount: 3,
        total: 3,
        list: [{
            city:'上海',
            projectName: '雍景园',
            buildingName: '白鹭',
            buildingId: '09581',
            extension: '0512-5643289',
            status: 0,
          }, {
            city: '苏州',
            projectName: '雍景园',
            buildingName: '白鹭',
            buildingId: '09582',
            extension: '0512-5643289',
            status: 1,
          }, {
            city: '南京',
            projectName: '雍景园',
            buildingName: '白鹭',
            buildingId: '09583',
            extension: '0512-5643289',
            status: 2,
          }
          
        ],
      },
    };
    const listArr = [];
    const len = 4;
    for (let i = 1; i < len; i++) {
      const _pageData = JSON.parse(JSON.stringify(pageData));
      _pageData.data.pageNum = i;
      _pageData.data.list[0].transferReceiptNo = `page${i}`;
      listArr.push(_pageData);
    }

    res.status(200).json(
      listArr.filter(v => {
        return v.data.pageNum === pageNum;
      })[0]
    );
  },

  [`POST ${ApiPrefix}/user/houseInfo`](req, res) {
    const { query } = req;
    const pageData = {
      "code": "S000000",
      "message": "请求成功",
      "data": [{
        "id": "r4f34g3t_0",
        "houseNo": "301",
        "floorArea": "68.1",
        "unitPrice": 9988.00,
        "totalAmount": 680183.00,
        "houseStatus": "0",
        "showName": "2号楼1单元301",
        "name": "2号楼1单元301",
        "houseType": "1035085325907759106",
        "houseTypeName": "户型Z",
        "unit": "1",
        "floor": 3,
        "projectId": "1035077253957128199",
        "buildingId": "5694569745079460",
        "houseTypeId": null,
        "unint": null,
        "unitStructure": null,
        "typePic": null,
        "typeName": null,
        "floorNumber": null,
        "houseName": null,
        "totalPrice": null,
        "totalPrice1": null,
        "discountPrice": null,
        "length": null,
        "width": null,
        "propertyRightTime": null
      }, {
        "id": "24g3t657h_0",
        "houseNo": "302",
        "floorArea": "68.1",
        "unitPrice": 9988.00,
        "totalAmount": 680183.00,
        "houseStatus": "0",
        "showName": "2号楼1单元302",
        "name": "2号楼1单元302",
        "houseType": "1035085325907759106",
        "houseTypeName": "户型Z",
        "unit": "1",
        "floor": 3,
        "projectId": "1035077253957128199",
        "buildingId": "5694569745079460",
        "houseTypeId": null,
        "unint": null,
        "unitStructure": null,
        "typePic": null,
        "typeName": null,
        "floorNumber": null,
        "houseName": null,
        "totalPrice": null,
        "totalPrice1": null,
        "discountPrice": null,
        "length": null,
        "width": null,
        "propertyRightTime": null
      }, {
        "id": "f2f2r4fgt54gy_0",
        "houseNo": "303",
        "floorArea": "68.1",
        "unitPrice": 9988.00,
        "totalAmount": 680183.00,
        "houseStatus": "0",
        "showName": "2号楼1单元303",
        "name": "2号楼1单元303",
        "houseType": "1035085325907759106",
        "houseTypeName": "户型Z",
        "unit": "1",
        "floor": 3,
        "projectId": "1035077253957128199",
        "buildingId": "5694569745079460",
        "houseTypeId": null,
        "unint": null,
        "unitStructure": null,
        "typePic": null,
        "typeName": null,
        "floorNumber": null,
        "houseName": null,
        "totalPrice": null,
        "totalPrice1": null,
        "discountPrice": null,
        "length": null,
        "width": null,
        "propertyRightTime": null
      }, {
        "id": "efrgt546gyhy6_0",
        "houseNo": "304",
        "floorArea": "68.1",
        "unitPrice": 9988.00,
        "totalAmount": 680183.00,
        "houseStatus": "0",
        "showName": "2号楼1单元304",
        "name": "2号楼1单元304",
        "houseType": "1035085325907759106",
        "houseTypeName": "户型Z",
        "unit": "1",
        "floor": 3,
        "projectId": "1035077253957128199",
        "buildingId": "5694569745079460",
        "houseTypeId": null,
        "unint": null,
        "unitStructure": null,
        "typePic": null,
        "typeName": null,
        "floorNumber": null,
        "houseName": null,
        "totalPrice": null,
        "totalPrice1": null,
        "discountPrice": null,
        "length": null,
        "width": null,
        "propertyRightTime": null
      }, {
        "id": "3565462563_0",
        "houseNo": "301",
        "floorArea": "68.1",
        "unitPrice": 9988.00,
        "totalAmount": 680183.00,
        "houseStatus": "0",
        "showName": "2号楼3单元301",
        "name": "2号楼3单元301",
        "houseType": "1035085447106367490",
        "houseTypeName": "户型Y",
        "unit": "3",
        "floor": 3,
        "projectId": "1035077253957128199",
        "buildingId": "5694569745079460",
        "houseTypeId": null,
        "unint": null,
        "unitStructure": null,
        "typePic": null,
        "typeName": null,
        "floorNumber": null,
        "houseName": null,
        "totalPrice": null,
        "totalPrice1": null,
        "discountPrice": null,
        "length": null,
        "width": null,
        "propertyRightTime": null
      }, {
        "id": "jf84u8549_0",
        "houseNo": "302",
        "floorArea": "68.1",
        "unitPrice": 9988.00,
        "totalAmount": 680183.00,
        "houseStatus": "0",
        "showName": "2号楼3单元302",
        "name": "2号楼3单元302",
        "houseType": "1035085447106367490",
        "houseTypeName": "户型Y",
        "unit": "3",
        "floor": 3,
        "projectId": "1035077253957128199",
        "buildingId": "5694569745079460",
        "houseTypeId": null,
        "unint": null,
        "unitStructure": null,
        "typePic": null,
        "typeName": null,
        "floorNumber": null,
        "houseName": null,
        "totalPrice": null,
        "totalPrice1": null,
        "discountPrice": null,
        "length": null,
        "width": null,
        "propertyRightTime": null
      }, {
        "id": "0245g9g050_0",
        "houseNo": "303",
        "floorArea": "68.1",
        "unitPrice": 9988.00,
        "totalAmount": 680183.00,
        "houseStatus": "0",
        "showName": "2号楼3单元303",
        "name": "2号楼3单元303",
        "houseType": "1035085447106367490",
        "houseTypeName": "户型Y",
        "unit": "3",
        "floor": 3,
        "projectId": "1035077253957128199",
        "buildingId": "5694569745079460",
        "houseTypeId": null,
        "unint": null,
        "unitStructure": null,
        "typePic": null,
        "typeName": null,
        "floorNumber": null,
        "houseName": null,
        "totalPrice": null,
        "totalPrice1": null,
        "discountPrice": null,
        "length": null,
        "width": null,
        "propertyRightTime": null
      }, {
        "id": "g904gj4kgg_0",
        "houseNo": "304",
        "floorArea": "68.1",
        "unitPrice": 9988.00,
        "totalAmount": 680183.00,
        "houseStatus": "0",
        "showName": "2号楼3单元304",
        "name": "2号楼3单元304",
        "houseType": "1035085447106367490",
        "houseTypeName": "户型Y",
        "unit": "3",
        "floor": 3,
        "projectId": "1035077253957128199",
        "buildingId": "5694569745079460",
        "houseTypeId": null,
        "unint": null,
        "unitStructure": null,
        "typePic": null,
        "typeName": null,
        "floorNumber": null,
        "houseName": null,
        "totalPrice": null,
        "totalPrice1": null,
        "discountPrice": null,
        "length": null,
        "width": null,
        "propertyRightTime": null
      }, {
        "id": "fr43y356gv3g45_0",
        "houseNo": "401",
        "floorArea": "68.1",
        "unitPrice": 9988.00,
        "totalAmount": 680183.00,
        "houseStatus": "0",
        "showName": "2号楼1单元401",
        "name": "2号楼1单元401",
        "houseType": "1035085325907759106",
        "houseTypeName": "户型Z",
        "unit": "1",
        "floor": 4,
        "projectId": "1035077253957128199",
        "buildingId": "5694569745079460",
        "houseTypeId": null,
        "unint": null,
        "unitStructure": null,
        "typePic": null,
        "typeName": null,
        "floorNumber": null,
        "houseName": null,
        "totalPrice": null,
        "totalPrice1": null,
        "discountPrice": null,
        "length": null,
        "width": null,
        "propertyRightTime": null
      }, {
        "id": "67hg4yh4_0",
        "houseNo": "402",
        "floorArea": "68.1",
        "unitPrice": 9988.00,
        "totalAmount": 680183.00,
        "houseStatus": "0",
        "showName": "2号楼1单元402",
        "name": "2号楼1单元402",
        "houseType": "1035085325907759106",
        "houseTypeName": "户型Z",
        "unit": "1",
        "floor": 4,
        "projectId": "1035077253957128199",
        "buildingId": "5694569745079460",
        "houseTypeId": null,
        "unint": null,
        "unitStructure": null,
        "typePic": null,
        "typeName": null,
        "floorNumber": null,
        "houseName": null,
        "totalPrice": null,
        "totalPrice1": null,
        "discountPrice": null,
        "length": null,
        "width": null,
        "propertyRightTime": null
      }, {
        "id": "34tg45hy4h6_0",
        "houseNo": "403",
        "floorArea": "68.1",
        "unitPrice": 9988.00,
        "totalAmount": 680183.00,
        "houseStatus": "0",
        "showName": "2号楼1单元403",
        "name": "2号楼1单元403",
        "houseType": "1035085325907759106",
        "houseTypeName": "户型Z",
        "unit": "1",
        "floor": 4,
        "projectId": "1035077253957128199",
        "buildingId": "5694569745079460",
        "houseTypeId": null,
        "unint": null,
        "unitStructure": null,
        "typePic": null,
        "typeName": null,
        "floorNumber": null,
        "houseName": null,
        "totalPrice": null,
        "totalPrice1": null,
        "discountPrice": null,
        "length": null,
        "width": null,
        "propertyRightTime": null
      }, {
        "id": "vgt335tvb3tb_0",
        "houseNo": "404",
        "floorArea": "68.1",
        "unitPrice": 9988.00,
        "totalAmount": 680183.00,
        "houseStatus": "0",
        "showName": "2号楼1单元404",
        "name": "2号楼1单元404",
        "houseType": "1035085325907759106",
        "houseTypeName": "户型Z",
        "unit": "1",
        "floor": 4,
        "projectId": "1035077253957128199",
        "buildingId": "5694569745079460",
        "houseTypeId": null,
        "unint": null,
        "unitStructure": null,
        "typePic": null,
        "typeName": null,
        "floorNumber": null,
        "houseName": null,
        "totalPrice": null,
        "totalPrice1": null,
        "discountPrice": null,
        "length": null,
        "width": null,
        "propertyRightTime": null
      }, {
        "id": "fg24g5345g_0",
        "houseNo": "401",
        "floorArea": "68.1",
        "unitPrice": 9988.00,
        "totalAmount": 680183.00,
        "houseStatus": "0",
        "showName": "2号楼3单元401",
        "name": "2号楼3单元401",
        "houseType": "1035085447106367490",
        "houseTypeName": "户型Y",
        "unit": "3",
        "floor": 4,
        "projectId": "1035077253957128199",
        "buildingId": "5694569745079460",
        "houseTypeId": null,
        "unint": null,
        "unitStructure": null,
        "typePic": null,
        "typeName": null,
        "floorNumber": null,
        "houseName": null,
        "totalPrice": null,
        "totalPrice1": null,
        "discountPrice": null,
        "length": null,
        "width": null,
        "propertyRightTime": null
      }, {
        "id": "g3wgt3345_0",
        "houseNo": "402",
        "floorArea": "68.1",
        "unitPrice": 9988.00,
        "totalAmount": 680183.00,
        "houseStatus": "0",
        "showName": "2号楼3单元402",
        "name": "2号楼3单元402",
        "houseType": "1035085447106367490",
        "houseTypeName": "户型Y",
        "unit": "3",
        "floor": 4,
        "projectId": "1035077253957128199",
        "buildingId": "5694569745079460",
        "houseTypeId": null,
        "unint": null,
        "unitStructure": null,
        "typePic": null,
        "typeName": null,
        "floorNumber": null,
        "houseName": null,
        "totalPrice": null,
        "totalPrice1": null,
        "discountPrice": null,
        "length": null,
        "width": null,
        "propertyRightTime": null
      }, {
        "id": "g234g3t5_0",
        "houseNo": "403",
        "floorArea": "68.1",
        "unitPrice": 9988.00,
        "totalAmount": 680183.00,
        "houseStatus": "0",
        "showName": "2号楼3单元403",
        "name": "2号楼3单元403",
        "houseType": "1035085447106367490",
        "houseTypeName": "户型Y",
        "unit": "3",
        "floor": 4,
        "projectId": "1035077253957128199",
        "buildingId": "5694569745079460",
        "houseTypeId": null,
        "unint": null,
        "unitStructure": null,
        "typePic": null,
        "typeName": null,
        "floorNumber": null,
        "houseName": null,
        "totalPrice": null,
        "totalPrice1": null,
        "discountPrice": null,
        "length": null,
        "width": null,
        "propertyRightTime": null
      }, {
        "id": "g32tgh4y5h4y_0",
        "houseNo": "404",
        "floorArea": "68.1",
        "unitPrice": 9988.00,
        "totalAmount": 680183.00,
        "houseStatus": "0",
        "showName": "2号楼3单元404",
        "name": "2号楼3单元404",
        "houseType": "1035085447106367490",
        "houseTypeName": "户型Y",
        "unit": "3",
        "floor": 4,
        "projectId": "1035077253957128199",
        "buildingId": "5694569745079460",
        "houseTypeId": null,
        "unint": null,
        "unitStructure": null,
        "typePic": null,
        "typeName": null,
        "floorNumber": null,
        "houseName": null,
        "totalPrice": null,
        "totalPrice1": null,
        "discountPrice": null,
        "length": null,
        "width": null,
        "propertyRightTime": null
      }, {
        "id": "3tg4yhj5764_0",
        "houseNo": "501",
        "floorArea": "68.1",
        "unitPrice": 9988.00,
        "totalAmount": 680183.00,
        "houseStatus": "0",
        "showName": "2号楼1单元501",
        "name": "2号楼1单元501",
        "houseType": "1035085325907759106",
        "houseTypeName": "户型Z",
        "unit": "1",
        "floor": 5,
        "projectId": "1035077253957128199",
        "buildingId": "5694569745079460",
        "houseTypeId": null,
        "unint": null,
        "unitStructure": null,
        "typePic": null,
        "typeName": null,
        "floorNumber": null,
        "houseName": null,
        "totalPrice": null,
        "totalPrice1": null,
        "discountPrice": null,
        "length": null,
        "width": null,
        "propertyRightTime": null
      }, {
        "id": "eq2cfrvf3tgvt_0",
        "houseNo": "502",
        "floorArea": "68.1",
        "unitPrice": 9988.00,
        "totalAmount": 680183.00,
        "houseStatus": "0",
        "showName": "2号楼1单元502",
        "name": "2号楼1单元502",
        "houseType": "1035085325907759106",
        "houseTypeName": "户型Z",
        "unit": "1",
        "floor": 5,
        "projectId": "1035077253957128199",
        "buildingId": "5694569745079460",
        "houseTypeId": null,
        "unint": null,
        "unitStructure": null,
        "typePic": null,
        "typeName": null,
        "floorNumber": null,
        "houseName": null,
        "totalPrice": null,
        "totalPrice1": null,
        "discountPrice": null,
        "length": null,
        "width": null,
        "propertyRightTime": null
      }, {
        "id": "vf3tgh6yh56_0",
        "houseNo": "503",
        "floorArea": "68.1",
        "unitPrice": 9988.00,
        "totalAmount": 680183.00,
        "houseStatus": "0",
        "showName": "2号楼1单元503",
        "name": "2号楼1单元503",
        "houseType": "1035085447106367490",
        "houseTypeName": "户型Y",
        "unit": "1",
        "floor": 5,
        "projectId": "1035077253957128199",
        "buildingId": "5694569745079460",
        "houseTypeId": null,
        "unint": null,
        "unitStructure": null,
        "typePic": null,
        "typeName": null,
        "floorNumber": null,
        "houseName": null,
        "totalPrice": null,
        "totalPrice1": null,
        "discountPrice": null,
        "length": null,
        "width": null,
        "propertyRightTime": null
      }, {
        "id": "eqrv23rtvgy4by_0",
        "houseNo": "504",
        "floorArea": "68.1",
        "unitPrice": 9988.00,
        "totalAmount": 680183.00,
        "houseStatus": "0",
        "showName": "2号楼1单元504",
        "name": "2号楼1单元504",
        "houseType": "1035085447106367490",
        "houseTypeName": "户型Y",
        "unit": "1",
        "floor": 5,
        "projectId": "1035077253957128199",
        "buildingId": "5694569745079460",
        "houseTypeId": null,
        "unint": null,
        "unitStructure": null,
        "typePic": null,
        "typeName": null,
        "floorNumber": null,
        "houseName": null,
        "totalPrice": null,
        "totalPrice1": null,
        "discountPrice": null,
        "length": null,
        "width": null,
        "propertyRightTime": null
      }, {
        "id": "56uy6h4yt3_0",
        "houseNo": "501",
        "floorArea": "68.1",
        "unitPrice": 9988.00,
        "totalAmount": 680183.00,
        "houseStatus": "0",
        "showName": "2号楼3单元501",
        "name": "2号楼3单元501",
        "houseType": "1035085447106367490",
        "houseTypeName": "户型Y",
        "unit": "3",
        "floor": 5,
        "projectId": "1035077253957128199",
        "buildingId": "5694569745079460",
        "houseTypeId": null,
        "unint": null,
        "unitStructure": null,
        "typePic": null,
        "typeName": null,
        "floorNumber": null,
        "houseName": null,
        "totalPrice": null,
        "totalPrice1": null,
        "discountPrice": null,
        "length": null,
        "width": null,
        "propertyRightTime": null
      }, {
        "id": "86gtg3g34_0",
        "houseNo": "502",
        "floorArea": "68.1",
        "unitPrice": 9988.00,
        "totalAmount": 680183.00,
        "houseStatus": "0",
        "showName": "2号楼3单元502",
        "name": "2号楼3单元502",
        "houseType": "1035085447106367490",
        "houseTypeName": "户型Y",
        "unit": "3",
        "floor": 5,
        "projectId": "1035077253957128199",
        "buildingId": "5694569745079460",
        "houseTypeId": null,
        "unint": null,
        "unitStructure": null,
        "typePic": null,
        "typeName": null,
        "floorNumber": null,
        "houseName": null,
        "totalPrice": null,
        "totalPrice1": null,
        "discountPrice": null,
        "length": null,
        "width": null,
        "propertyRightTime": null
      }, {
        "id": "364hy76w3rtg3_0",
        "houseNo": "503",
        "floorArea": "68.1",
        "unitPrice": 9988.00,
        "totalAmount": 680183.00,
        "houseStatus": "0",
        "showName": "2号楼3单元503",
        "name": "2号楼3单元503",
        "houseType": "1035085447106367490",
        "houseTypeName": "户型Y",
        "unit": "3",
        "floor": 5,
        "projectId": "1035077253957128199",
        "buildingId": "5694569745079460",
        "houseTypeId": null,
        "unint": null,
        "unitStructure": null,
        "typePic": null,
        "typeName": null,
        "floorNumber": null,
        "houseName": null,
        "totalPrice": null,
        "totalPrice1": null,
        "discountPrice": null,
        "length": null,
        "width": null,
        "propertyRightTime": null
      }, {
        "id": "4g45yhg4_0",
        "houseNo": "504",
        "floorArea": "68.1",
        "unitPrice": 9988.00,
        "totalAmount": 680183.00,
        "houseStatus": "0",
        "showName": "2号楼3单元504",
        "name": "2号楼3单元504",
        "houseType": "1035085447106367490",
        "houseTypeName": "户型Y",
        "unit": "3",
        "floor": 5,
        "projectId": "1035077253957128199",
        "buildingId": "5694569745079460",
        "houseTypeId": null,
        "unint": null,
        "unitStructure": null,
        "typePic": null,
        "typeName": null,
        "floorNumber": null,
        "houseName": null,
        "totalPrice": null,
        "totalPrice1": null,
        "discountPrice": null,
        "length": null,
        "width": null,
        "propertyRightTime": null
      }, {
        "id": "2rfvrvtbg44tyhg4_0",
        "houseNo": "601",
        "floorArea": "68.1",
        "unitPrice": 9988.00,
        "totalAmount": 680183.00,
        "houseStatus": "0",
        "showName": "2号楼1单元601",
        "name": "2号楼1单元601",
        "houseType": "1035085325907759106",
        "houseTypeName": "户型Z",
        "unit": "1",
        "floor": 6,
        "projectId": "1035077253957128199",
        "buildingId": "5694569745079460",
        "houseTypeId": null,
        "unint": null,
        "unitStructure": null,
        "typePic": null,
        "typeName": null,
        "floorNumber": null,
        "houseName": null,
        "totalPrice": null,
        "totalPrice1": null,
        "discountPrice": null,
        "length": null,
        "width": null,
        "propertyRightTime": null
      }, {
        "id": "678fr4fg34f3r_0",
        "houseNo": "602",
        "floorArea": "68.1",
        "unitPrice": 9988.00,
        "totalAmount": 680183.00,
        "houseStatus": "0",
        "showName": "2号楼1单元602",
        "name": "2号楼1单元602",
        "houseType": "1035085325907759106",
        "houseTypeName": "户型Z",
        "unit": "1",
        "floor": 6,
        "projectId": "1035077253957128199",
        "buildingId": "5694569745079460",
        "houseTypeId": null,
        "unint": null,
        "unitStructure": null,
        "typePic": null,
        "typeName": null,
        "floorNumber": null,
        "houseName": null,
        "totalPrice": null,
        "totalPrice1": null,
        "discountPrice": null,
        "length": null,
        "width": null,
        "propertyRightTime": null
      }, {
        "id": "2frfgt5g46_0",
        "houseNo": "603",
        "floorArea": "68.1",
        "unitPrice": 9988.00,
        "totalAmount": 680183.00,
        "houseStatus": "0",
        "showName": "2号楼1单元603",
        "name": "2号楼1单元603",
        "houseType": "1035085447106367490",
        "houseTypeName": "户型Y",
        "unit": "1",
        "floor": 6,
        "projectId": "1035077253957128199",
        "buildingId": "5694569745079460",
        "houseTypeId": null,
        "unint": null,
        "unitStructure": null,
        "typePic": null,
        "typeName": null,
        "floorNumber": null,
        "houseName": null,
        "totalPrice": null,
        "totalPrice1": null,
        "discountPrice": null,
        "length": null,
        "width": null,
        "propertyRightTime": null
      }, {
        "id": "cwrevij9r48j_0",
        "houseNo": "604",
        "floorArea": "68.1",
        "unitPrice": 9988.00,
        "totalAmount": 680183.00,
        "houseStatus": "0",
        "showName": "2号楼1单元604",
        "name": "2号楼1单元604",
        "houseType": "1035085447106367490",
        "houseTypeName": "户型Y",
        "unit": "1",
        "floor": 6,
        "projectId": "1035077253957128199",
        "buildingId": "5694569745079460",
        "houseTypeId": null,
        "unint": null,
        "unitStructure": null,
        "typePic": null,
        "typeName": null,
        "floorNumber": null,
        "houseName": null,
        "totalPrice": null,
        "totalPrice1": null,
        "discountPrice": null,
        "length": null,
        "width": null,
        "propertyRightTime": null
      }, {
        "id": "24rgh46h6_0",
        "houseNo": "701",
        "floorArea": "68.1",
        "unitPrice": 9988.00,
        "totalAmount": 680183.00,
        "houseStatus": "0",
        "showName": "2号楼1单元701",
        "name": "2号楼1单元701",
        "houseType": "1035085325907759106",
        "houseTypeName": "户型Z",
        "unit": "1",
        "floor": 7,
        "projectId": "1035077253957128199",
        "buildingId": "5694569745079460",
        "houseTypeId": null,
        "unint": null,
        "unitStructure": null,
        "typePic": null,
        "typeName": null,
        "floorNumber": null,
        "houseName": null,
        "totalPrice": null,
        "totalPrice1": null,
        "discountPrice": null,
        "length": null,
        "width": null,
        "propertyRightTime": null
      }, {
        "id": "cewcv893ufj24_0",
        "houseNo": "702",
        "floorArea": "68.1",
        "unitPrice": 9988.00,
        "totalAmount": 680183.00,
        "houseStatus": "0",
        "showName": "2号楼1单元702",
        "name": "2号楼1单元702",
        "houseType": "1035085325907759106",
        "houseTypeName": "户型Z",
        "unit": "1",
        "floor": 7,
        "projectId": "1035077253957128199",
        "buildingId": "5694569745079460",
        "houseTypeId": null,
        "unint": null,
        "unitStructure": null,
        "typePic": null,
        "typeName": null,
        "floorNumber": null,
        "houseName": null,
        "totalPrice": null,
        "totalPrice1": null,
        "discountPrice": null,
        "length": null,
        "width": null,
        "propertyRightTime": null
      }, {
        "id": "rv345gt53gt_0",
        "houseNo": "703",
        "floorArea": "68.1",
        "unitPrice": 9988.00,
        "totalAmount": 680183.00,
        "houseStatus": "0",
        "showName": "2号楼1单元703",
        "name": "2号楼1单元703",
        "houseType": "1035085447106367490",
        "houseTypeName": "户型Y",
        "unit": "1",
        "floor": 7,
        "projectId": "1035077253957128199",
        "buildingId": "5694569745079460",
        "houseTypeId": null,
        "unint": null,
        "unitStructure": null,
        "typePic": null,
        "typeName": null,
        "floorNumber": null,
        "houseName": null,
        "totalPrice": null,
        "totalPrice1": null,
        "discountPrice": null,
        "length": null,
        "width": null,
        "propertyRightTime": null
      }, {
        "id": "qecf2r2fr_0",
        "houseNo": "704",
        "floorArea": "68.1",
        "unitPrice": 9988.00,
        "totalAmount": 680183.00,
        "houseStatus": "0",
        "showName": "2号楼1单元704",
        "name": "2号楼1单元704",
        "houseType": "1035085447106367490",
        "houseTypeName": "户型Y",
        "unit": "1",
        "floor": 7,
        "projectId": "1035077253957128199",
        "buildingId": "5694569745079460",
        "houseTypeId": null,
        "unint": null,
        "unitStructure": null,
        "typePic": null,
        "typeName": null,
        "floorNumber": null,
        "houseName": null,
        "totalPrice": null,
        "totalPrice1": null,
        "discountPrice": null,
        "length": null,
        "width": null,
        "propertyRightTime": null
      }, {
        "id": "42rg45hg4y_0",
        "houseNo": "801",
        "floorArea": "68.1",
        "unitPrice": 9988.00,
        "totalAmount": 680183.00,
        "houseStatus": "0",
        "showName": "2号楼1单元801",
        "name": "2号楼1单元801",
        "houseType": "1035085325907759106",
        "houseTypeName": "户型Z",
        "unit": "1",
        "floor": 8,
        "projectId": "1035077253957128199",
        "buildingId": "5694569745079460",
        "houseTypeId": null,
        "unint": null,
        "unitStructure": null,
        "typePic": null,
        "typeName": null,
        "floorNumber": null,
        "houseName": null,
        "totalPrice": null,
        "totalPrice1": null,
        "discountPrice": null,
        "length": null,
        "width": null,
        "propertyRightTime": null
      }, {
        "id": "qef2rft5g6y_0",
        "houseNo": "802",
        "floorArea": "68.1",
        "unitPrice": 9988.00,
        "totalAmount": 680183.00,
        "houseStatus": "0",
        "showName": "2号楼1单元802",
        "name": "2号楼1单元802",
        "houseType": "1035085325907759106",
        "houseTypeName": "户型Z",
        "unit": "1",
        "floor": 8,
        "projectId": "1035077253957128199",
        "buildingId": "5694569745079460",
        "houseTypeId": null,
        "unint": null,
        "unitStructure": null,
        "typePic": null,
        "typeName": null,
        "floorNumber": null,
        "houseName": null,
        "totalPrice": null,
        "totalPrice1": null,
        "discountPrice": null,
        "length": null,
        "width": null,
        "propertyRightTime": null
      }, {
        "id": "q3f24rf_0",
        "houseNo": "803",
        "floorArea": "68.1",
        "unitPrice": 9988.00,
        "totalAmount": 680183.00,
        "houseStatus": "0",
        "showName": "2号楼1单元803",
        "name": "2号楼1单元803",
        "houseType": "1035085447106367490",
        "houseTypeName": "户型Y",
        "unit": "1",
        "floor": 8,
        "projectId": "1035077253957128199",
        "buildingId": "5694569745079460",
        "houseTypeId": null,
        "unint": null,
        "unitStructure": null,
        "typePic": null,
        "typeName": null,
        "floorNumber": null,
        "houseName": null,
        "totalPrice": null,
        "totalPrice1": null,
        "discountPrice": null,
        "length": null,
        "width": null,
        "propertyRightTime": null
      }, {
        "id": "57gt33tgf3gf3_0",
        "houseNo": "804",
        "floorArea": "68.1",
        "unitPrice": 9988.00,
        "totalAmount": 680183.00,
        "houseStatus": "0",
        "showName": "2号楼1单元804",
        "name": "2号楼1单元804",
        "houseType": "1035085447106367490",
        "houseTypeName": "户型Y",
        "unit": "1",
        "floor": 8,
        "projectId": "1035077253957128199",
        "buildingId": "5694569745079460",
        "houseTypeId": null,
        "unint": null,
        "unitStructure": null,
        "typePic": null,
        "typeName": null,
        "floorNumber": null,
        "houseName": null,
        "totalPrice": null,
        "totalPrice1": null,
        "discountPrice": null,
        "length": null,
        "width": null,
        "propertyRightTime": null
      }, {
        "id": "23fr4g3tg_0",
        "houseNo": "901",
        "floorArea": "68.1",
        "unitPrice": 9988.00,
        "totalAmount": 680183.00,
        "houseStatus": "0",
        "showName": "2号楼1单元901",
        "name": "2号楼1单元901",
        "houseType": "1035085325907759106",
        "houseTypeName": "户型Z",
        "unit": "1",
        "floor": 9,
        "projectId": "1035077253957128199",
        "buildingId": "5694569745079460",
        "houseTypeId": null,
        "unint": null,
        "unitStructure": null,
        "typePic": null,
        "typeName": null,
        "floorNumber": null,
        "houseName": null,
        "totalPrice": null,
        "totalPrice1": null,
        "discountPrice": null,
        "length": null,
        "width": null,
        "propertyRightTime": null
      }, {
        "id": "456gt3t5gf3t_0",
        "houseNo": "902",
        "floorArea": "68.1",
        "unitPrice": 9988.00,
        "totalAmount": 680183.00,
        "houseStatus": "0",
        "showName": "2号楼1单元902",
        "name": "2号楼1单元902",
        "houseType": "1035085325907759106",
        "houseTypeName": "户型Z",
        "unit": "1",
        "floor": 9,
        "projectId": "1035077253957128199",
        "buildingId": "5694569745079460",
        "houseTypeId": null,
        "unint": null,
        "unitStructure": null,
        "typePic": null,
        "typeName": null,
        "floorNumber": null,
        "houseName": null,
        "totalPrice": null,
        "totalPrice1": null,
        "discountPrice": null,
        "length": null,
        "width": null,
        "propertyRightTime": null
      }, {
        "id": "rg3tg3t_0",
        "houseNo": "903",
        "floorArea": "68.1",
        "unitPrice": 9988.00,
        "totalAmount": 680183.00,
        "houseStatus": "0",
        "showName": "2号楼1单元903",
        "name": "2号楼1单元903",
        "houseType": "1035085447106367490",
        "houseTypeName": "户型Y",
        "unit": "1",
        "floor": 9,
        "projectId": "1035077253957128199",
        "buildingId": "5694569745079460",
        "houseTypeId": null,
        "unint": null,
        "unitStructure": null,
        "typePic": null,
        "typeName": null,
        "floorNumber": null,
        "houseName": null,
        "totalPrice": null,
        "totalPrice1": null,
        "discountPrice": null,
        "length": null,
        "width": null,
        "propertyRightTime": null
      }, {
        "id": "5u75g4tt3_0",
        "houseNo": "904",
        "floorArea": "68.1",
        "unitPrice": 9988.00,
        "totalAmount": 680183.00,
        "houseStatus": "0",
        "showName": "2号楼1单元904",
        "name": "2号楼1单元904",
        "houseType": "1035085447106367490",
        "houseTypeName": "户型Y",
        "unit": "1",
        "floor": 9,
        "projectId": "1035077253957128199",
        "buildingId": "5694569745079460",
        "houseTypeId": null,
        "unint": null,
        "unitStructure": null,
        "typePic": null,
        "typeName": null,
        "floorNumber": null,
        "houseName": null,
        "totalPrice": null,
        "totalPrice1": null,
        "discountPrice": null,
        "length": null,
        "width": null,
        "propertyRightTime": null
      }]
    }
    res.status(200).json(
      pageData
    )

    
  },
}
