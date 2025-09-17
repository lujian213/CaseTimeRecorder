// 计算两个时间戳之间的小时差
export const calculateHours = (startTime, endTime) => {
  const diffMs = endTime - startTime;
  const hours = diffMs / (1000 * 60 * 60);
  return hours.toFixed(1);
};

// 格式化时间戳为本地日期时间字符串
export const formatDateTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleString();
};
