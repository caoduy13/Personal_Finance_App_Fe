import axios from "axios";
import type { AxiosError } from "axios";

export interface ApiFieldError {
  message: string;
  field?: string;
  code?: string;
  status?: number;
}

type ErrorBody = {
  error?: unknown;
  message?: unknown;
  title?: unknown;
  details?: unknown;
};

const CODE_MESSAGES: Record<string, string> = {
  INVALID_LOGIN_CREDENTIALS: "Email hoặc mật khẩu không đúng.",
  TRANSACTION_DATE_IN_FUTURE: "Không thể tạo giao dịch trong tương lai.",
  INVALID_TRANSACTION_AMOUNT: "Số tiền giao dịch phải lớn hơn 0.",
  CATEGORY_NOT_FOUND: "Danh mục không còn khả dụng.",
  JAR_NOT_FOUND: "Hũ không còn khả dụng.",
  FINANCIAL_ACCOUNT_NOT_FOUND: "Tài khoản tài chính không còn khả dụng.",
  GOAL_DUE_DATE_IN_PAST: "Hạn mục tiêu không được ở quá khứ.",
  REMINDER_START_DATE_IN_PAST: "Ngày bắt đầu nhắc lịch không được ở quá khứ.",
};

function stringOrUndefined(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function readDetails(details: unknown) {
  if (!details || typeof details !== "object") return {};
  const raw = details as Record<string, unknown>;
  return {
    field: stringOrUndefined(raw.field ?? raw.Field),
    code: stringOrUndefined(raw.code ?? raw.Code),
  };
}

export function parseApiError(
  error: unknown,
  fallback = "Không thể xử lý yêu cầu lúc này.",
): ApiFieldError {
  if (!axios.isAxiosError(error)) {
    return {
      message: error instanceof Error ? error.message : fallback,
    };
  }

  const ax = error as AxiosError<ErrorBody>;
  const data = ax.response?.data;
  const details = readDetails(data?.details);
  const mapped = details.code ? CODE_MESSAGES[details.code] : undefined;
  const message =
    mapped ??
    stringOrUndefined(data?.error) ??
    stringOrUndefined(data?.message) ??
    stringOrUndefined(data?.title) ??
    fallback;

  return {
    message,
    field: details.field,
    code: details.code,
    status: ax.response?.status,
  };
}

export function toFriendlyError(
  error: unknown,
  fallback = "Không thể xử lý yêu cầu lúc này.",
): Error {
  return new Error(parseApiError(error, fallback).message);
}
