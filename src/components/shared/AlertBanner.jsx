// Banner that warns when a jar reaches 80%+ utilization.
function AlertBanner({ jarName, percent }) {
  return (
    <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-700">
      Cảnh báo: Hũ {jarName} đã dùng {percent}% ngân sách.
    </div>
  )
}

export default AlertBanner
