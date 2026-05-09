import { ROUTES } from "@/shared/constants/routes";

export function getUserPageMeta(pathname: string): { title: string; subtitle: string } {
  if (pathname === ROUTES.DASHBOARD) {
    return {
      title: "Tổng quan tuần",
      subtitle:
        "Xem nhanh giao dịch và dòng tiền trong tuần — tóm tắt giống weekly sum-up.",
    };
  }
  if (pathname === ROUTES.TRANSACTIONS) {
    return {
      title: "Giao dịch",
      subtitle: "Danh sách thu chi gần đây, lọc và quản lý theo từng khoản.",
    };
  }
  if (pathname === ROUTES.TRANSACTIONS_ADD) {
    return {
      title: "Giao dịch mới",
      subtitle: "Thêm khoản thu hoặc chi nhanh.",
    };
  }
  if (pathname === ROUTES.JARS) {
    return {
      title: "Hũ tiền",
      subtitle: "Phân bổ ngân sách theo phương pháp bạn đang dùng.",
    };
  }
  if (pathname === ROUTES.BUDGET) {
    return {
      title: "Ngân sách",
      subtitle: "Hạn mức chi và cảnh báo — theo dõi từng nhóm.",
    };
  }
  if (pathname === ROUTES.GOALS) {
    return {
      title: "Mục tiêu",
      subtitle: "Tiết kiệm có đích đến — laptop, du lịch, khẩn cấp…",
    };
  }
  if (pathname === ROUTES.NOTIFICATIONS) {
    return {
      title: "Thông báo",
      subtitle: "Nhắc hạn mức, mục tiêu và tin hệ thống.",
    };
  }
  if (pathname === ROUTES.PROFILE) {
    return {
      title: "Cài đặt & hồ sơ",
      subtitle: "Thông tin tài khoản và tuỳ chỉnh cơ bản.",
    };
  }
  return {
    title: "FinJar",
    subtitle: "Quản lý tài chính cá nhân.",
  };
}
