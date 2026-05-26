/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnchorProfile } from './types';

export const INITIAL_ANCHORS_DATA: AnchorProfile[] = [
  {
    id: 'bunny',
    name: 'Bunny (邦尼)',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    channels: [
      {
        id: 'bunny-ch-1',
        title: '🧸 儿童节梦想狂欢派对官频直播 🎈',
        scheduledTime: '2026-06-01 19:30:00',
        confirmed: true,
        pptStatus: 'pending',
        pptDeadline: '2026-05-29 19:30:00',
        uploads: []
      },
      {
        id: 'bunny-ch-2',
        title: '🔥 年中盛典红人面对面超级直播间 🚀',
        scheduledTime: '2026-06-18 20:00:00',
        confirmed: false,
        pptStatus: 'pending',
        pptDeadline: '2026-06-15 20:00:00',
        uploads: []
      },
      {
        id: 'bunny-ch-3',
        title: '🍃 端午安康佳节民俗诗友会专场 🎋',
        scheduledTime: '2026-05-29 18:00:00',
        confirmed: true,
        pptStatus: 'uploaded',
        pptDeadline: '2026-05-26 18:00:00',
        uploads: [
          {
            fileName: '端午民俗诗友会演示PPT_v1.pptx',
            uploadTime: '2026-05-25 15:40:22',
            status: 'confirmed'
          }
        ]
      },
      {
        id: 'bunny-ch-4',
        title: '🎤 2026夏日歌王争霸赛海选首日秀 🌟',
        scheduledTime: '2026-05-25 12:00:00',
        confirmed: true,
        pptStatus: 'overdue',
        pptDeadline: '2026-05-22 12:00:00',
        uploads: []
      },
      {
        id: 'bunny-ch-5',
        title: '📱 智能黑科技数码潮玩新品试播测评 ⚙️',
        scheduledTime: '2026-06-25 14:00:00',
        confirmed: false,
        pptStatus: 'pending',
        pptDeadline: '2026-06-22 14:00:00',
        uploads: []
      }
    ],
    scripts: [
      {
        id: 'bunny-sc-1',
        version: 'v2',
        fileName: '儿童节狂欢脚本_final.pptx',
        uploadTime: '2026-05-25 18:30:15',
        status: 'confirmed'
      },
      {
        id: 'bunny-sc-2',
        version: 'v1',
        fileName: '儿童节狂欢脚本_draft.pptx',
        uploadTime: '2026-05-24 12:00:44',
        status: 'pending'
      },
      {
        id: 'bunny-sc-3',
        version: 'v1.4',
        fileName: '歌王海选主持词大纲_revised.docx',
        uploadTime: '2026-05-21 14:22:10',
        status: 'confirmed'
      }
    ],
    activities: [
      {
        id: 'bunny-act-1',
        date: '2026/05/01',
        topic: '🛠️ 五一劳动节致敬行当故事会直播',
        anchorName: 'Bunny',
        htidJid: 'HT9102-J82',
        metrics: {
          duration: 223,
          viewers: 777,
          validViewers: 465,
          conversionRate: 60,
          validDuration: 5.67,
          maxOnline: 302,
          commentsCount: 77,
          commentRate: 16.56,
          giftingUsers: 4,
          coins: 89,
          cny: 9.08,
          fansGained: 89
        }
      },
      {
        id: 'bunny-act-2',
        date: '2026/05/10',
        topic: '🌹 母亲节暖心连线：听听妈妈那辈的歌',
        anchorName: 'Bunny',
        htidJid: 'HT9102-J83',
        metrics: {
          duration: 180,
          viewers: 1250,
          validViewers: 820,
          conversionRate: 65.6,
          validDuration: 8.24,
          maxOnline: 512,
          commentsCount: 142,
          commentRate: 17.3,
          giftingUsers: 18,
          coins: 450,
          cny: 45.9,
          fansGained: 215
        }
      },
      {
        id: 'bunny-act-3',
        date: '2026/05/20',
        topic: '💗 520心动无限大：寻找最默契心音',
        anchorName: 'Bunny',
        htidJid: 'HT9102-J84',
        metrics: {
          duration: 240,
          viewers: 2100,
          validViewers: 1390,
          conversionRate: 66.2,
          validDuration: 9.87,
          maxOnline: 820,
          commentsCount: 380,
          commentRate: 27.34,
          giftingUsers: 45,
          coins: 1250,
          cny: 127.5,
          fansGained: 412
        }
      },
      {
        id: 'bunny-act-4',
        date: '2026/05/24',
        topic: '🎤 梦幻之声：春季新声主持与演唱沙龙',
        anchorName: 'Bunny',
        htidJid: 'HT9102-J85',
        metrics: {
          duration: 150,
          viewers: 680,
          validViewers: 410,
          conversionRate: 60.29,
          validDuration: 4.12,
          maxOnline: 215,
          commentsCount: 52,
          commentRate: 12.68,
          giftingUsers: 9,
          coins: 180,
          cny: 18.36,
          fansGained: 65
        }
      }
    ],
    rewards: [
      {
        id: 'bunny-rw-1',
        icon: '👑',
        name: 'VIP会员 - 7天',
        value: '7 天体验时长',
        status: 'pending',
        type: 'vip'
      },
      {
        id: 'bunny-rw-2',
        icon: '🪙',
        name: 'HT币 - 500币',
        value: '500 官频币',
        status: 'claimed',
        type: 'coin'
      },
      {
        id: 'bunny-rw-3',
        icon: '🎖️',
        name: '专属精美徽章',
        value: '「闪耀之星」限定头像装饰 (1个)',
        status: 'pending',
        type: 'badge'
      },
      {
        id: 'bunny-rw-4',
        icon: '💎',
        name: '现金等值钻石奖励',
        value: '100 钻石积分积分券',
        status: 'claimed',
        type: 'cash'
      }
    ]
  },
  {
    id: 'sunny',
    name: 'Sunny (小太阳)',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    channels: [
      {
        id: 'sunny-ch-1',
        title: '🛶 龙舟竞渡擂鼓助威：全频道端午大联欢 🚣',
        scheduledTime: '2026-05-29 14:00:00',
        confirmed: true,
        pptStatus: 'pending',
        pptDeadline: '2026-05-26 14:00:00',
        uploads: []
      },
      {
        id: 'sunny-ch-2',
        title: '🍦 大话夏日吃冰清凉解暑奇幻之夜 🍧',
        scheduledTime: '2026-06-05 21:00:00',
        confirmed: false,
        pptStatus: 'pending',
        pptDeadline: '2026-06-02 21:00:00',
        uploads: []
      },
      {
        id: 'sunny-ch-3',
        title: '🎓 金榜题名梦想破浪：高考温馨打气台 📝',
        scheduledTime: '2026-06-07 19:00:00',
        confirmed: true,
        pptStatus: 'uploaded',
        pptDeadline: '2026-06-04 19:00:00',
        uploads: [
          {
            fileName: '高考温馨祝福加油PPT_v1.pptx',
            uploadTime: '2026-06-03 09:12:00',
            status: 'confirmed'
          }
        ]
      },
      {
        id: 'sunny-ch-4',
        title: '🎸 毕业季：致那年我们盛开的青春歌友会 🎓',
        scheduledTime: '2026-06-12 20:00:00',
        confirmed: false,
        pptStatus: 'pending',
        pptDeadline: '2026-06-09 20:00:00',
        uploads: []
      },
      {
        id: 'sunny-ch-5',
        title: '🛡️ 五五开黑战队荣耀顶峰竞技大复盘 🎮',
        scheduledTime: '2026-05-05 15:00:00',
        confirmed: true,
        pptStatus: 'overdue',
        pptDeadline: '2026-05-02 15:00:00',
        uploads: []
      }
    ],
    scripts: [
      {
        id: 'sunny-sc-1',
        version: 'v3',
        fileName: '暑期大作战方案_final_v3.pptx',
        uploadTime: '2026-05-26 09:12:00',
        status: 'pending'
      },
      {
        id: 'sunny-sc-2',
        version: 'v2',
        fileName: '高考祈福打气主持稿_v2.pptx',
        uploadTime: '2026-05-22 17:30:15',
        status: 'confirmed'
      },
      {
        id: 'sunny-sc-3',
        version: 'v1',
        fileName: '五五开黑复盘流程初版.docx',
        uploadTime: '2026-05-01 11:20:00',
        status: 'confirmed'
      }
    ],
    activities: [
      {
        id: 'sunny-act-1',
        date: '2026/05/05',
        topic: '⚔️ 荣耀巅峰：五五黑队竞技狂欢派对',
        anchorName: 'Sunny',
        htidJid: 'HT8291-J11',
        metrics: {
          duration: 190,
          viewers: 950,
          validViewers: 580,
          conversionRate: 61,
          validDuration: 6.2,
          maxOnline: 410,
          commentsCount: 92,
          commentRate: 15.86,
          giftingUsers: 14,
          coins: 388,
          cny: 39.5,
          fansGained: 120
        }
      },
      {
        id: 'sunny-act-2',
        date: '2026/05/15',
        topic: '🎸 暮春暖风：民谣弹唱树洞陪伴电台',
        anchorName: 'Sunny',
        htidJid: 'HT8291-J12',
        metrics: {
          duration: 120,
          viewers: 630,
          validViewers: 390,
          conversionRate: 61.9,
          validDuration: 4.8,
          maxOnline: 180,
          commentsCount: 45,
          commentRate: 11.53,
          giftingUsers: 6,
          coins: 120,
          cny: 12.24,
          fansGained: 45
        }
      },
      {
        id: 'sunny-act-3',
        date: '2026/05/21',
        topic: '🌙 深夜解忧：你诉说，我倾听树洞专场',
        anchorName: 'Sunny',
        htidJid: 'HT8291-J13',
        metrics: {
          duration: 150,
          viewers: 1100,
          validViewers: 720,
          conversionRate: 65.4,
          validDuration: 7.15,
          maxOnline: 350,
          commentsCount: 168,
          commentRate: 23.33,
          giftingUsers: 22,
          coins: 640,
          cny: 65.28,
          fansGained: 180
        }
      }
    ],
    rewards: [
      {
        id: 'sunny-rw-1',
        icon: '👑',
        name: 'VIP会员 - 14天',
        value: '14 天VIP体验资格',
        status: 'pending',
        type: 'vip'
      },
      {
        id: 'sunny-rw-2',
        icon: '🪙',
        name: 'HT币 - 1000币',
        value: '1000 官频专属代币',
        status: 'pending',
        type: 'coin'
      },
      {
        id: 'sunny-rw-3',
        icon: '🛸',
        name: '尊贵拉风座驾：烈焰跑车',
        value: '跑车入场特效（3天体验期）',
        status: 'claimed',
        type: 'badge'
      },
      {
        id: 'sunny-rw-4',
        icon: '💎',
        name: '现金奖励 - 兑换钻石',
        value: '500 钻石大礼包积分卡',
        status: 'pending',
        type: 'cash'
      }
    ]
  }
];
