/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Clean up date strings and format them in Beijing (CST) and Local user timezone.
 */
export function formatTimeZones(scheduledTimeStr: string): { beijingTime: string; localTime: string; userTimeZone: string } {
  // Assume scheduledTimeStr is in CST (Beijing Time, UTC+8)
  // Let's parse it manually to handle cross-browser consistency
  // Format: "YYYY-MM-DD HH:mm:ss"
  const regex = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;
  const match = scheduledTimeStr.match(regex);
  
  if (!match) {
    return {
      beijingTime: scheduledTimeStr,
      localTime: scheduledTimeStr,
      userTimeZone: 'Local Time'
    };
  }

  const [, year, month, day, hour, minute, second] = match.map(Number);
  
  // Beijing is UTC+8. To construct the date object, we treat it as UTC+8
  // e.g. "2026-06-01T19:30:00+08:00"
  const dateStrISO = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}+08:00`;
  const dateObj = new Date(dateStrISO);

  // For Beijing representation, we simply print scheduledTimeStr with timezone indicator
  const beijingTime = `${scheduledTimeStr} (CST)`;

  // For Local User representation
  const formatterOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };

  let localTime = dateObj.toLocaleString(undefined, formatterOptions);
  let userTimeZone = '';
  
  try {
    userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch (e) {
    userTimeZone = 'Local';
  }

  return {
    beijingTime,
    localTime,
    userTimeZone
  };
}

/**
 * Calculate countdown string relative to a target time.
 * @param deadlineStr Target deadline string e.g. "2026-05-29 19:30:00"
 * @param currentTimeStr Current comparison time e.g. "2026-05-26 09:49:13"
 */
export function calculateCountdown(deadlineStr: string, currentTimeStrStr: string): { status: 'pending' | 'overdue' | 'urgent'; text: string; secondsLeft: number } {
  const regex = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;
  
  const parseToCST = (timeStr: string) => {
    const match = timeStr.match(regex);
    if (!match) return new Date();
    const [, y, m, d, h, min, s] = match.map(Number);
    // In China Standard Time (UTC+8)
    const iso = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}T${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}:${String(s).padStart(2, '0')}+08:00`;
    return new Date(iso);
  };

  const deadlineDate = parseToCST(deadlineStr);
  const currentDate = parseToCST(currentTimeStrStr);

  const diffMs = deadlineDate.getTime() - currentDate.getTime();
  
  if (diffMs <= 0) {
    return {
      status: 'overdue',
      text: '已逾期未提交',
      secondsLeft: 0
    };
  }

  const totalSecs = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSecs / (3600 * 24));
  const hours = Math.floor((totalSecs % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSecs % 3600) / 60);

  let countdownText = '';
  if (days > 0) {
    countdownText += `${days}天 `;
  }
  countdownText += `${hours}小时 ${minutes}分钟`;

  const isUrgent = totalSecs < 3600 * 24; // Less than 1 day

  return {
    status: isUrgent ? 'urgent' : 'pending',
    text: `剩余 ${countdownText}`,
    secondsLeft: totalSecs
  };
}
