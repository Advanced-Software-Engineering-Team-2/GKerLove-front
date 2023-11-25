/* 前端部署脚本 */

import OSS from 'ali-oss'
import glob from 'glob'

const accessKeyID = 'LTAI5tCaBDouQzCpJy26Ga6G'
const accessKeySecret = 'zmWzwu29TGz2Ll7d7bweqUo9V8Jx1L'

const client = new OSS({
  region: 'oss-cn-beijing',
  accessKeyId: accessKeyID,
  accessKeySecret: accessKeySecret,
  bucket: 'gker-love'
})


console.log('删除之前的文件')
const fileList = await client.listV2({ prefix: 'assets' })
const deleteObjs = ['index.html', 'favicon.ico']
fileList.objects.forEach((el) => {
  deleteObjs.push(el.name)
})
if (deleteObjs.length > 0) await client.deleteMulti(deleteObjs)
console.log('删除成功')

console.log('开始上传')
const outputDir = 'dist'
const outputFiles = glob.sync(`${outputDir}/**/*`, { strict: true, nodir: true })
for (const fileFullPath of outputFiles) {
  const filePath = fileFullPath.split(outputDir)[1]
  await client.put(filePath, fileFullPath)
}
console.log('上传成功')

console.log('部署成功')