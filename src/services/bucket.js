import request from 'utils/request';
import url from 'utils/ipAdmin'

export function bucket (data) {
  return request({
    url: `/baseCommon/getPostSignature`,
    data: data,
    method: 'POST',
  }, 'pic')
}
