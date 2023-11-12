export interface STSResponse {
  requestId: string
  credentials: {
    accessKeyId: string
    accessKeySecret: string
    securityToken: string
    expiration: string
  }
  assumedRoleUser: {
    arn: string
    assumedRoleId: string
  }
}
