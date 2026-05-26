/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PPTUploadRecord {
  fileName: string;
  uploadTime: string;
  status: 'confirmed' | 'pending';
}

export interface OfficialChannelItem {
  id: string;
  title: string;
  scheduledTime: string; // "2026-05-29 20:00:00"
  confirmed: boolean;
  pptStatus: 'uploaded' | 'pending' | 'overdue';
  pptDeadline: string; // PPT upload deadline (e.g. 3 days before scheduledTime)
  uploads: PPTUploadRecord[];
}

export interface ScriptReportItem {
  id: string;
  version: string;
  fileName: string;
  uploadTime: string;
  status: 'confirmed' | 'pending';
}

export interface ActivityMetric {
  duration: number; // 开播时长 (min)
  viewers: number; // 访问人数
  validViewers: number; // 有效观看人数
  conversionRate: number; // 进房转化率 (e.g. 60)
  validDuration: number; // 有效观看时长 (min)
  maxOnline: number; // 最高在线人数
  commentsCount: number; // 评论人数
  commentRate: number; // 评论率 (e.g. 16.56)
  giftingUsers: number; // 送礼人数
  coins: number; // 房间流水 (金币)
  cny: number; // 房间流水 (CNY)
  fansGained: number; // 转粉数
}

export interface ChannelActivityData {
  id: string;
  date: string; // 2026/05/01
  topic: string; // 活动话题
  anchorName: string;
  htidJid: string; // HTID/JID
  metrics: ActivityMetric;
}

export interface RewardItem {
  id: string;
  icon: string; // emoji or icon name
  name: string;
  value: string;
  status: 'pending' | 'claimed'; // 待领取(紫色) / 已领取(绿色)
  type: 'vip' | 'coin' | 'badge' | 'cash';
}

export interface AnchorProfile {
  id: string;
  name: string;
  avatarUrl: string;
  channels: OfficialChannelItem[];
  scripts: ScriptReportItem[];
  activities: ChannelActivityData[];
  rewards: RewardItem[];
}
