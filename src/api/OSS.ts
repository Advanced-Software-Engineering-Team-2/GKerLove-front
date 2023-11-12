import request from '@/utils/request'

import type { R } from '@/types/R'
import type { STSResponse } from '@/types/STSResponse'

function getSTSResponse() {
  return request.get<R<{ stsResponse: STSResponse }>>('/OSS/token')
}

export default {
  getSTSResponse
}
