/**
 * Format a number as Vietnamese-style VND (no sub-units; grouping).
 * @param {number} n
 * @param {{ suffix?: string }} [opts]
 * @returns {string}
 */
export function formatVnd(n, opts = {}) {
  const s = typeof opts.suffix === 'string' ? opts.suffix : '₫'
  if (n === null || n === undefined || Number.isNaN(Number(n))) return `0 ${s}`.trim()
  const num = Math.round(Number(n))
  return `${new Intl.NumberFormat('vi-VN').format(num)}${s ? ` ${s}` : ''}`.trim()
}
