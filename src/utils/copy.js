/**
 *深拷贝
 *
 * @export
 * @param {*} o 传入的对象或数组
 * @returns
 */
export function deepCopy(o) {
  if (o instanceof Array) {
    var n = []
    for (var i = 0; i < o.length; ++i) {
      n[i] = deepCopy(o[i])
    }
    return n

  } else if (o instanceof Object) {
    var n = {}
    for (var i in o) {
      n[i] = deepCopy(o[i])
    }
    return n
  } else {
    return o
  }
}

// 获取年份，ex,获取前2个月的年，GetMonth(-2)，也可获取年月日
 export function GetMonth(month) {
   var time = new Date()
   time.setMonth(time.getMonth() + month) //设置month月后的时间
   var y = time.getFullYear()
   var m = time.getMonth() + 1 //获取当前月份
   var d = time.getDate()
  //  return y + "-" + m + '-' + d
   return y
 }

 // 金额3组一个逗号
 export function toThousands(num) {
    var result = '', counter = 0
    num = (num || 0).toString()
    for (var i = num.length - 1; i >= 0; i--) {
        counter++
        result = num.charAt(i) + result
        if (!(counter % 3) && i != 0) {
            result = ',' + result
        }
    }
    return result
}
