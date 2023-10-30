import moment from 'moment/moment'

export function formatDateString(dateString: string) {
  return moment(dateString).format('MM月DD日 HH:mm')
}

export function formatDate(date: Date) {
  return moment(date).format('MM月DD日 HH:mm')
}

export function transformMinutes(x: number) {
  const hours = Math.floor(x / 60)
  const minutes = x - hours * 60
  return hours + '小时' + minutes + '分钟'
}
