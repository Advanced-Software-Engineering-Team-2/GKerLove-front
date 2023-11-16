import OSS from 'ali-oss'
import STSApi from '@/api/STS'

export async function createOSSUtil() {
  const res = await STSApi.getSTSResponse()
  const OSSUtil = new OSS({
    region: 'oss-cn-beijing',
    accessKeyId: res.data.data.stsResponse.credentials.accessKeyId,
    accessKeySecret: res.data.data.stsResponse.credentials.accessKeySecret,
    stsToken: res.data.data.stsResponse.credentials.securityToken,
    bucket: 'gker-love',
    refreshSTSToken: async () => {
      const stsResponse = await STSApi.getSTSResponse()
      return {
        accessKeyId: stsResponse.data.data.stsResponse.credentials.accessKeyId,
        accessKeySecret: stsResponse.data.data.stsResponse.credentials.accessKeySecret,
        stsToken: stsResponse.data.data.stsResponse.credentials.securityToken
      }
    },
    refreshSTSTokenInterval: 3000 * 1000
  })
  return OSSUtil
}
