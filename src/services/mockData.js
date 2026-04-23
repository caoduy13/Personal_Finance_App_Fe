// Realistic mock dataset for FinJar demo mode.
export const mockUser = {
  id: 'u1',
  name: 'Nguyen Minh Anh',
  email: 'anh@finjar.app',
  role: 'ADMIN',
}

export const mockJars = [
  { id: 'j1', name: 'Ăn uống', spent: 2450000, limit: 3000000 },
  { id: 'j2', name: 'Sinh hoạt', spent: 4100000, limit: 5000000 },
  { id: 'j3', name: 'Tiết kiệm', spent: 3800000, limit: 6000000 },
  { id: 'j4', name: 'Giải trí', spent: 1350000, limit: 2000000 },
  { id: 'j5', name: 'Giáo dục', spent: 900000, limit: 1500000 },
  { id: 'j6', name: 'Từ thiện', spent: 550000, limit: 1000000 },
]

export const mockTransactions = [
  { id: 't1', title: 'Bữa tối gia đình', category: 'Ăn uống', amount: 220000, type: 'expense', date: '2026-04-20' },
  { id: 't2', title: 'Lương tháng 4', category: 'Thu nhập', amount: 18000000, type: 'income', date: '2026-04-18' },
  { id: 't3', title: 'Tiền điện nước', category: 'Sinh hoạt', amount: 850000, type: 'expense', date: '2026-04-17' },
  { id: 't4', title: 'Mua khóa học React', category: 'Giáo dục', amount: 499000, type: 'expense', date: '2026-04-15' },
  { id: 't5', title: 'Vé xem phim', category: 'Giải trí', amount: 180000, type: 'expense', date: '2026-04-14' },
  { id: 't6', title: 'Chuyển tiết kiệm', category: 'Tiết kiệm', amount: 2500000, type: 'expense', date: '2026-04-12' },
  { id: 't7', title: 'Cafe với bạn', category: 'Ăn uống', amount: 90000, type: 'expense', date: '2026-04-11' },
  { id: 't8', title: 'Ủng hộ quỹ từ thiện', category: 'Từ thiện', amount: 300000, type: 'expense', date: '2026-04-10' },
  { id: 't9', title: 'Freelance UI task', category: 'Thu nhập', amount: 2400000, type: 'income', date: '2026-04-08' },
  { id: 't10', title: 'Mua sách tài chính', category: 'Giáo dục', amount: 280000, type: 'expense', date: '2026-04-07' },
]

export const mockDashboard = {
  totalBalance: 46250000,
  income: 20400000,
  expense: 9979000,
  savings: 10421000,
}

export const mockGoals = [
  { id: 'g1', name: 'Dự phòng 6 tháng', current: 22000000, target: 45000000 },
  { id: 'g2', name: 'Quỹ du lịch Nhật Bản', current: 12500000, target: 30000000 },
]
