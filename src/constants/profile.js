/**
 * Profile page copy and financial account enums (labels in Vietnamese).
 */
import { BUDGET_METHOD_DESC, BUDGET_METHOD_LABEL } from './onboarding'

export const ACCOUNT_TYPE = {
  CASH: 'Cash',
  BANK: 'Bank',
  E_WALLET: 'EWallet',
}

export const CONNECTION_MODE = {
  MANUAL: 'Manual',
  LINKED: 'Linked',
}

export const ACCOUNT_TYPE_ICON = {
  [ACCOUNT_TYPE.CASH]: '💵',
  [ACCOUNT_TYPE.BANK]: '🏦',
  [ACCOUNT_TYPE.E_WALLET]: '📱',
}

export const ACCOUNT_TYPE_OPTIONS = [
  { value: ACCOUNT_TYPE.CASH, label: 'Tiền mặt' },
  { value: ACCOUNT_TYPE.BANK, label: 'Ngân hàng' },
  { value: ACCOUNT_TYPE.E_WALLET, label: 'Ví điện tử' },
]

export const CONNECTION_MODE_OPTIONS = [
  { value: CONNECTION_MODE.MANUAL, label: 'Thủ công' },
  { value: CONNECTION_MODE.LINKED, label: 'Liên kết' },
]

export function getBudgetingMethodLabel(method) {
  if (method == null) return 'Chưa thiết lập'
  return BUDGET_METHOD_LABEL[method] || String(method)
}

export function getBudgetingMethodDescription(method) {
  if (method == null) return 'Hoàn tất phần khởi tạo để xem mô tả phương pháp.'
  return BUDGET_METHOD_DESC[method] || '—'
}

export const PROFILE_UI = {
  pageTitle: 'Hồ sơ & thiết lập',
  personalTitle: 'Thông tin cá nhân',
  methodTitle: 'Phương pháp lập ngân sách',
  accountsTitle: 'Tài khoản tài chính',
  edit: 'Chỉnh sửa',
  save: 'Lưu thay đổi',
  cancel: 'Hủy',
  addAccount: 'Thêm tài khoản',
  changeMethod: 'Thay đổi phương pháp',
  fullName: 'Họ tên',
  email: 'Email',
  phone: 'Điện thoại',
  preferredCurrency: 'Loại tiền ưa thích',
  modalAddAccount: 'Tài khoản mới',
  accountName: 'Tên tài khoản',
  initialBalance: 'Số dư ban đầu (VND)',
  connectionModeLabel: 'Cách theo dõi',
  accountTypeLabel: 'Loại tài khoản',
  balanceLabel: 'Số dư',
}
