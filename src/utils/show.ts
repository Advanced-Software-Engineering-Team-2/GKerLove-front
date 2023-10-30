import { showNotify } from 'vant'

export function showError(message: string) {
  showNotify({ message: message || '错误' })
}

export function showSuccess(message: string) {
  showNotify({ message: message || '错误', type: 'success' })
}

export function showWarning(message: string) {
  showNotify({ message: message || '错误', type: 'warning' })
}

export function showInfo(message: string) {
  showNotify({ message: message || '错误', type: 'primary' })
}
