export interface R<T> {
  code: 'SUCCESS' | 'ERROR' | 'UNAUTHORIZED' | 'UNAUTHENTICATED'
  message: string
  data: T
}
