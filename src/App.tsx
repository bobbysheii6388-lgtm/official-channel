/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Clock, 
  UploadCloud, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Award, 
  HelpCircle, 
  Layers, 
  ChevronRight, 
  Link as LinkIcon, 
  Timer, 
  FileCheck, 
  Database,
  RefreshCw,
  Eye,
  Gift,
  Share2
} from 'lucide-react';
import { INITIAL_ANCHORS_DATA } from './mockData';
import { AnchorProfile, OfficialChannelItem, ScriptReportItem, RewardItem, PPTUploadRecord, ChannelActivityData } from './types';
import { formatTimeZones, calculateCountdown } from './utils';

export default function App() {
  // Persistence state
  const [anchors, setAnchors] = useState<AnchorProfile[]>(() => {
    const cached = localStorage.getItem('anchor_portal_data_v2');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (err) {
        return INITIAL_ANCHORS_DATA;
      }
    }
    return INITIAL_ANCHORS_DATA;
  });

  // Keep track of current system local clock
  const [currentTime, setCurrentTime] = useState('2026-05-26 10:30:00');
  
  // Realtime clock toggler
  const [isLiveClock, setIsLiveClock] = useState(true);

  // Current selected anchor
  const [selectedAnchorId, setSelectedAnchorId] = useState<'bunny' | 'sunny'>('bunny');
  
  // Select active matching channel in Module 1 for detailing PPT upload
  const [selectedChannelId, setSelectedChannelId] = useState<string>('');

  // Selected Activity ID in Module 3 (官频数据)
  const [selectedActivityId, setSelectedActivityId] = useState<string>('');

  // Form Inputs for Module 1 PPT Upload
  const [pptFileType, setPptFileType] = useState<'file' | 'link'>('file');
  const [pptFileNameInput, setPptFileNameInput] = useState('');
  const [pptFileLinkInput, setPptFileLinkInput] = useState('');
  
  // Form Inputs for Module 2 Script Submission
  const [scriptFileType, setScriptFileType] = useState<'upload' | 'simulate'>('upload');
  const [scriptVersion, setScriptVersion] = useState('v2');
  const [scriptFileName, setScriptFileName] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [scriptUploadSuccessBanner, setScriptUploadSuccessBanner] = useState<string | null>(null);

  // Toast stack
  interface Toast {
    id: string;
    text: string;
    type: 'success' | 'warning' | 'info';
  }
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Find the selected Anchor data
  const currentAnchor = anchors.find(a => a.id === selectedAnchorId) || anchors[0];

  // Sync internal selections when anchor switches
  useEffect(() => {
    if (currentAnchor) {
      // Default to first channel
      if (currentAnchor.channels.length > 0) {
        setSelectedChannelId(currentAnchor.channels[0].id);
      } else {
        setSelectedChannelId('');
      }
      
      // Default to first activity
      if (currentAnchor.activities.length > 0) {
        setSelectedActivityId(currentAnchor.activities[0].id);
      } else {
        setSelectedActivityId('');
      }
    }
  }, [selectedAnchorId]);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('anchor_portal_data_v2', JSON.stringify(anchors));
  }, [anchors]);

  // Handle a continuous ticking simulation initialized at user timezone or fixed datetime
  useEffect(() => {
    // Current date format YYYY-MM-DD HH:mm:ss
    const baseDate = new Date('2026-05-26T09:49:13Z');
    let elapsedMs = 0;

    const timer = setInterval(() => {
      if (isLiveClock) {
        elapsedMs += 1000;
        const newTime = new Date(baseDate.getTime() + elapsedMs);
        
        // Format to YYYY-MM-DD HH:mm:ss in China Time or simple UTC
        // Let's show as CST timezone (UTC+8) of Beijing
        // 2026-05-26 09:49:13 UTC -> 2026-05-26 17:49:13 CST
        const cstOffsetMs = 8 * 60 * 60 * 1000;
        const cstTime = new Date(baseDate.getTime() + elapsedMs + cstOffsetMs);
        
        const y = cstTime.getUTCFullYear();
        const m = String(cstTime.getUTCMonth() + 1).padStart(2, '0');
        const d = String(cstTime.getUTCDate()).padStart(2, '0');
        const h = String(cstTime.getUTCHours()).padStart(2, '0');
        const min = String(cstTime.getUTCMinutes()).padStart(2, '0');
        const s = String(cstTime.getUTCSeconds()).padStart(2, '0');

        setCurrentTime(`${y}-${m}-${d} ${h}:${min}:${s}`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isLiveClock]);

  // Add toast function
  const addToast = (text: string, type: 'success' | 'warning' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  // Reset local storage function
  const resetToFactory = () => {
    localStorage.removeItem('anchor_portal_data_v2');
    setAnchors(INITIAL_ANCHORS_DATA);
    addToast('已重置所有 Mock 数据至默认状态！', 'info');
  };

  // PPT Upload Action
  const handlePptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChannelId) {
      addToast('请先选择一个官频场次！', 'warning');
      return;
    }

    let fileName = '';
    if (pptFileType === 'file') {
      if (!pptFileNameInput.trim()) {
        addToast('请输入本地PPT模拟文件名！', 'warning');
        return;
      }
      fileName = pptFileNameInput.trim().endsWith('.pptx') ? pptFileNameInput.trim() : `${pptFileNameInput.trim()}.pptx`;
    } else {
      if (!pptFileLinkInput.trim()) {
        addToast('请粘贴演示文件链接地址！', 'warning');
        return;
      }
      fileName = `🔗 演示链接: ${pptFileLinkInput.trim().substring(0, 35)}...`;
    }

    const timestampStr = currentTime; // Current simulated CST time
    const newRecord: PPTUploadRecord = {
      fileName: fileName,
      uploadTime: timestampStr,
      status: 'pending' // 待审核
    };

    // Update state
    setAnchors(prev => prev.map(anchor => {
      if (anchor.id === selectedAnchorId) {
        return {
          ...anchor,
          channels: anchor.channels.map(ch => {
            if (ch.id === selectedChannelId) {
              return {
                ...ch,
                pptStatus: 'uploaded', // status tag becomes uploaded / 已提交
                uploads: [newRecord, ...ch.uploads]
              };
            }
            return ch;
          })
        };
      }
      return anchor;
    }));

    addToast('✅ PPT上报提交成功，等待运营进一步审核！', 'success');
    setPptFileNameInput('');
    setPptFileLinkInput('');
  };

  // Script Submission Drag Drop and Submit Action (Module 2)
  const handleScriptSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalName = scriptFileName.trim();
    if (!finalName) {
      addToast('请先确定要上传的文件名称！', 'warning');
      return;
    }

    // Verify format .pptx, .pdf, .doc, .docx
    const lower = finalName.toLowerCase();
    if (!lower.endsWith('.pptx') && !lower.endsWith('.pdf') && !lower.endsWith('.doc') && !lower.endsWith('.docx')) {
      addToast('不支持该文件格式！请提交 .pptx / .pdf / .doc / .docx 文件', 'warning');
      return;
    }

    const timestampStr = currentTime;
    const newScriptItem: ScriptReportItem = {
      id: `script-${Date.now()}`,
      version: scriptVersion || 'v1',
      fileName: finalName,
      uploadTime: timestampStr,
      status: 'pending' // operator pending approval
    };

    setAnchors(prev => prev.map(anchor => {
      if (anchor.id === selectedAnchorId) {
        return {
          ...anchor,
          scripts: [newScriptItem, ...anchor.scripts]
        };
      }
      return anchor;
    }));

    setScriptUploadSuccessBanner(`✅ 上传成功 | 校验通过时间: ${timestampStr}`);
    addToast('✅ 脚本上报成功！已追加至下方历史记录。', 'success');
    setScriptFileName('');
    setScriptVersion(prev => {
      // Auto-increment version string for sweet UI experience
      const match = prev.match(/v(\d+)/);
      if (match) {
        const nextNum = parseInt(match[1]) + 1;
        return `v${nextNum}`;
      }
      return 'v3';
    });
  };

  // Drag and Drop simulation
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setScriptFileName(file.name);
      addToast(`已选择拖拽文件：${file.name}`, 'info');
    }
  };

  const triggerFileSelect = () => {
    // Generate a beautiful mock filename based on current selected channel title
    const activeCh = currentAnchor.channels.find(c => c.id === selectedChannelId) || currentAnchor.channels[0];
    const cleanChTitle = activeCh 
      ? activeCh.title.replace(/[\uD83C-\uDBFF\uDC00-\uDFFF\s]+/g, '').substring(0, 10) 
      : '官频直播';
    
    const mockFiles = [
      `${cleanChTitle}_互动脚本_${scriptVersion}.pptx`,
      `${cleanChTitle}_流程脚本_${scriptVersion}.pdf`,
      `${cleanChTitle}_备忘主持词_${scriptVersion}.docx`,
    ];
    const randomIndex = Math.floor(Math.random() * mockFiles.length);
    setScriptFileName(mockFiles[randomIndex]);
    addToast(`已模拟检索本地文件: "${mockFiles[randomIndex]}"`, 'success');
  };

  // Toggle state of claimed reward (Module 4)
  const claimReward = (rewardId: string) => {
    setAnchors(prev => prev.map(anchor => {
      if (anchor.id === selectedAnchorId) {
        return {
          ...anchor,
          rewards: anchor.rewards.map(rw => {
            if (rw.id === rewardId) {
              return { ...rw, status: 'claimed' };
            }
            return rw;
          })
        };
      }
      return anchor;
    }));
    addToast('✅ 领取成功！奖励已实时分发至您的主播钱包。', 'success');
  };

  // Simulate Operator Approval of PPT upload or Script report
  const approvePPTUpload = (channelId: string, index: number) => {
    setAnchors(prev => prev.map(anchor => {
      if (anchor.id === selectedAnchorId) {
        return {
          ...anchor,
          channels: anchor.channels.map(ch => {
            if (ch.id === channelId) {
              const updatedUploads = [...ch.uploads];
              if (updatedUploads[index]) {
                updatedUploads[index] = { ...updatedUploads[index], status: 'confirmed' };
              }
              return {
                ...ch,
                uploads: updatedUploads
              };
            }
            return ch;
          })
        };
      }
      return anchor;
    }));
    addToast('✅ (模拟平台审核) PPT已被审核确认为【已确认】状态！', 'success');
  };

  const approveScriptReport = (scriptId: string) => {
    setAnchors(prev => prev.map(anchor => {
      if (anchor.id === selectedAnchorId) {
        return {
          ...anchor,
          scripts: anchor.scripts.map(sc => {
            if (sc.id === scriptId) {
              return { ...sc, status: 'confirmed' };
            }
            return sc;
          })
        };
      }
      return anchor;
    }));
    addToast('✅ (模拟平台审核) 脚本已被审核确认为【已确认】状态！', 'success');
  };

  // Helper variables to compute statistics
  const currentChannelForPPT = currentAnchor.channels.find(ch => ch.id === selectedChannelId) || currentAnchor.channels[0];
  const selectedActivityData = currentAnchor.activities.find(act => act.id === selectedActivityId) || currentAnchor.activities[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Toast Notification Container */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
        {toasts.map(t => (
          <div 
            key={t.id} 
            className={`p-4 rounded-xl shadow-lg border flex items-start gap-3 backdrop-blur-md pointer-events-auto transition-all transform animate-bounce-short ${
              t.type === 'success' 
                ? 'bg-emerald-50/95 border-emerald-200 text-emerald-900' 
                : t.type === 'warning' 
                ? 'bg-amber-50/95 border-amber-200 text-amber-900' 
                : 'bg-indigo-50/95 border-indigo-200 text-indigo-900'
            }`}
          >
            {t.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />}
            {t.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />}
            {t.type === 'info' && <Layers className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />}
            <div className="flex-1 text-sm font-medium">{t.text}</div>
            <button 
              onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
              className="text-slate-400 hover:text-slate-600 font-bold text-xs"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Header Info Panel */}
      <header className="bg-white border-b border-slate-100 shadow-xs sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Headline */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">官频主播运营与协同平台</h1>
              <p className="text-xs text-slate-500 font-mono">Host Channel Operation & Incentive Management Network</p>
            </div>
          </div>

          {/* Clock Info & Global Controls */}
          <div className="flex flex-wrap items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 font-mono">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span className="font-semibold text-slate-700">北京时间 (UTC+8):</span>
              <span className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded font-bold">
                {currentTime}
              </span>
            </div>
            <div className="hidden lg:flex items-center gap-1">
              <span className="text-slate-400">|</span>
              <span className="text-slate-500 ml-1">本地时区:</span>
              <span className="font-semibold">{Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Shanghai'}</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsLiveClock(!isLiveClock)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  isLiveClock ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                }`}
                title="暂停/开启模拟时间流逝"
              >
                {isLiveClock ? '⏰ CST时钟运行中' : '⏸️ 时钟已暂停'}
              </button>
              <button 
                onClick={resetToFactory} 
                className="hover:bg-slate-200 p-1 rounded text-red-600 transition-colors" 
                title="清空缓存，重置数据"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Anchor Switcher (Mock Login) */}
          <div className="flex items-center gap-2 bg-indigo-50/50 p-1.5 rounded-xl border border-indigo-100">
            <div className="text-xs font-semibold text-indigo-900 px-2 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span>当前登录主播:</span>
            </div>
            <div className="flex gap-1">
              {anchors.map(anchor => {
                const isSelected = anchor.id === selectedAnchorId;
                return (
                  <button
                    key={anchor.id}
                    onClick={() => {
                      setSelectedAnchorId(anchor.id as 'bunny' | 'sunny');
                      addToast(`已成功切换为主播: ${anchor.name}`, 'info');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isSelected 
                        ? 'bg-indigo-600 text-white shadow-sm' 
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                    }`}
                  >
                    <img 
                      src={anchor.avatarUrl} 
                      alt={anchor.name} 
                      referrerPolicy="no-referrer"
                      className="w-4 h-4 rounded-full object-cover border border-white/40" 
                    />
                    <span>{anchor.name.split(' ')[0]}</span>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </header>

      {/* Main Content Areas Layout - Single page 4 sequential modules  */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Profile Card Summary Banner */}
        <div className="bg-linear-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border border-slate-800">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img 
                src={currentAnchor.avatarUrl} 
                alt={currentAnchor.name} 
                referrerPolicy="no-referrer"
                className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-4 border-indigo-500/30"
              />
              <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900"></span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl md:text-2xl font-bold">{currentAnchor.name}</h2>
                <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30 font-medium">
                  官方认证频道主播
                </span>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-medium">
                  空闲就播
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-lg">
                欢迎回到主播协同控制台！开播前请务必确认官频场次状态，并在直播开播 3 天前提交最新 PPT 演示。
              </p>
              <div className="flex gap-4 mt-3 text-xs font-mono text-slate-400">
                <div>待办场次: <span className="text-white font-bold">{currentAnchor.channels.filter(c=>c.pptStatus==='pending').length}场</span></div>
                <div>挂账奖励: <span className="text-indigo-300 font-bold">{currentAnchor.rewards.filter(r=>r.status==='pending').length}份待领</span></div>
              </div>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center min-w-[200px] shrink-0 self-stretch md:self-center flex flex-col justify-center">
            <div className="text-xs text-slate-400 font-semibold mb-0.5 font-mono">平台数据同步状态</div>
            <div className="text-lg font-bold text-emerald-400">● 实时交互联通</div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">CWD Node Container Active</div>
          </div>
        </div>


        {/* ======================= MODULE 1: 我的官频列表 ======================= */}
        <section id="module-channels-list" className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden transition-all duration-300 hover:shadow-md">
          
          {/* Header */}
          <div className="bg-slate-50 border-b border-slate-200/70 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">我的官频列表</h3>
                <p className="text-xs text-slate-500">查看排班场次、确认状态，并于开播 3 天前完成配套 PPT 精准提报</p>
              </div>
            </div>
            {/* Quick reminder legend */}
            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> 待审核/待上传
              </span>
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> 已提交/已完成
              </span>
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> 逾期未完成
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Channels List */}
              <div className="lg:col-span-7 space-y-3">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 font-mono">场次排班选择 ({currentAnchor.channels.length})</div>
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {currentAnchor.channels.map((channel) => {
                    const isSelected = selectedChannelId === channel.id;
                    const { beijingTime, localTime, userTimeZone } = formatTimeZones(channel.scheduledTime);
                    
                    // Countdown relative to 3 days before live:
                    // scheduledTime - 3 days
                    const schedDate = new Date(channel.scheduledTime.replace(' ', 'T') + '+08:00');
                    const deadlineDate = new Date(schedDate.getTime() - 3 * 24 * 3600 * 1000);
                    const deadlineStr = `${deadlineDate.getFullYear()}-${String(deadlineDate.getMonth()+1).padStart(2, '0')}-${String(deadlineDate.getDate()).padStart(2, '0')} ${String(deadlineDate.getHours()).padStart(2, '0')}:${String(deadlineDate.getMinutes()).padStart(2, '0')}:${String(deadlineDate.getSeconds()).padStart(2, '0')}`;
                    
                    const countdown = calculateCountdown(deadlineStr, currentTime);

                    // Override PPT status based on countdown if not uploaded
                    let effectivePptStatus = channel.pptStatus;
                    if (channel.pptStatus !== 'uploaded') {
                      effectivePptStatus = countdown.status === 'overdue' ? 'overdue' : 'pending';
                    }

                    return (
                      <div
                        key={channel.id}
                        onClick={() => setSelectedChannelId(channel.id)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-slate-50 border-indigo-600 shadow-xs' 
                            : 'bg-white border-slate-200/70 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3 flex-wrap sm:flex-nowrap">
                          <div className="space-y-1.5">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                              {channel.title}
                            </h4>
                            
                            {/* Times display for CST and Local Time */}
                            <div className="text-xs space-y-1 text-slate-500 pt-1 font-mono">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span>北京时间:</span>
                                <span className="text-slate-800 font-medium">{beijingTime}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="w-3"></span>
                                <span>您本地时区 ({userTimeZone.substring(userTimeZone.lastIndexOf('/') + 1)}):</span>
                                <span className="text-indigo-600 font-medium">{localTime}</span>
                              </div>
                            </div>
                          </div>

                          {/* Action badges */}
                          <div className="flex flex-row sm:flex-col items-end gap-2 shrink-0">
                            {/* Confirmed status Badge */}
                            {channel.confirmed ? (
                              <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
                                🔔 场次已发布
                              </span>
                            ) : (
                              <span className="text-[10px] bg-yellow-50 text-yellow-800 border border-yellow-200 px-2.5 py-0.5 rounded-full font-bold">
                                ⏳ 场次待最终确认
                              </span>
                            )}

                            {/* PPT status Badge with color rule */}
                            {effectivePptStatus === 'uploaded' ? (
                              <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-300/60 px-2.5 py-0.5 rounded-md font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                已提交 (已上传)
                              </span>
                            ) : effectivePptStatus === 'overdue' ? (
                              <span className="text-xs bg-rose-50 text-rose-700 border border-rose-300/60 px-2.5 py-0.5 rounded-md font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                逾期未提交
                              </span>
                            ) : (
                              <span className="text-xs bg-purple-50 text-purple-700 border border-purple-300/60 px-2.5 py-0.5 rounded-md font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                                待上传 PPT
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Slide open indicator */}
                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="text-slate-400 font-semibold font-mono">
                            截止时限: {countdown.status === 'overdue' ? (
                              <span className="text-rose-500 font-bold">已超限 (须尽快补交)</span>
                            ) : (
                              <span className="text-indigo-600 font-bold">{countdown.text}</span>
                            )}
                          </span>
                          <span className="text-indigo-600 font-bold hover:underline flex items-center gap-0.5">
                            管理/提交PPT <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Interactive Upload Panel for Chosen Channel */}
              <div className="lg:col-span-5 bg-slate-50 border border-slate-200/50 rounded-2xl p-5 space-y-5">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                  <UploadCloud className="w-5 h-5 text-indigo-600" />
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">PPT 协同填报中心</h4>
                    <p className="text-[11px] text-slate-400">针对选中的场次上传演示 PPT 或在线共享链接</p>
                  </div>
                </div>

                {currentChannelForPPT ? (
                  <div className="space-y-4">
                    <div className="bg-white border border-indigo-100 p-3 rounded-lg text-xs space-y-1">
                      <div className="font-bold text-indigo-900 text-xs">当前作用场次:</div>
                      <div className="text-slate-700 font-medium">{currentChannelForPPT.title}</div>
                      <div className="text-slate-400 mt-1 font-mono">开播时间: {currentChannelForPPT.scheduledTime}</div>
                    </div>

                    {/* Deadline Countdown Area */}
                    {(() => {
                      const schedDate = new Date(currentChannelForPPT.scheduledTime.replace(' ', 'T') + '+08:00');
                      const deadlineDate = new Date(schedDate.getTime() - 3 * 24 * 3600 * 1000);
                      const deadlineStr = `${deadlineDate.getFullYear()}-${String(deadlineDate.getMonth()+1).padStart(2, '0')}-${String(deadlineDate.getDate()).padStart(2, '0')} ${String(deadlineDate.getHours()).padStart(2, '0')}:${String(deadlineDate.getMinutes()).padStart(2, '0')}:${String(deadlineDate.getSeconds()).padStart(2, '0')}`;
                      const countdown = calculateCountdown(deadlineStr, currentTime);

                      return (
                        <div className={`p-3 rounded-xl border flex items-center gap-3 ${
                          countdown.status === 'overdue' 
                            ? 'bg-rose-50 border-rose-100 text-rose-800' 
                            : countdown.status === 'urgent'
                            ? 'bg-amber-50 border-amber-100 text-amber-800 font-bold'
                            : 'bg-indigo-50 border-indigo-100 text-indigo-900'
                        }`}>
                          <Timer className={`w-5 h-5 ${countdown.status === 'overdue' ? 'text-rose-600 animate-pulse' : 'text-indigo-600'}`} />
                          <div className="text-xs">
                            <div className="font-semibold text-[11px] text-slate-500 uppercase tracking-wider">
                              开播前 3 天截止上传倒计时
                            </div>
                            <div className="font-bold text-xs mt-0.5 font-mono">
                              {countdown.status === 'overdue' ? (
                                <span className="text-rose-600">已截止！目前属于 逾期补报 阶段 ⏰</span>
                              ) : (
                                <span className="text-indigo-700">{countdown.text}</span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                              截止时间点: {deadlineStr}
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Form Choice */}
                    <form onSubmit={handlePptSubmit} className="space-y-4">
                      <div>
                        <span className="block text-xs font-bold text-slate-500 mb-1.5 uppercase font-mono">提报载体形式</span>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setPptFileType('file')}
                            className={`py-1.5 px-3 rounded-lg text-xs font-bold border transition-all ${
                              pptFileType === 'file'
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            💻 本地 PPT 文件
                          </button>
                          <button
                            type="button"
                            onClick={() => setPptFileType('link')}
                            className={`py-1.5 px-3 rounded-lg text-xs font-bold border transition-all ${
                              pptFileType === 'link'
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            🔗 共享网盘/在线链接
                          </button>
                        </div>
                      </div>

                      {pptFileType === 'file' ? (
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1 font-mono">模拟本地文件名选择</label>
                          <div className="relative">
                            <input
                              type="text"
                              required
                              value={pptFileNameInput}
                              onChange={(e) => setPptFileNameInput(e.target.value)}
                              placeholder="例如：Bunny直播备用演示.pptx"
                              className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2.5 pr-10 focus:outline-hidden focus:border-indigo-600"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const cleanChTitle = currentChannelForPPT.title.replace(/[\uD83C-\uDBFF\uDC00-\uDFFF\s]+/g, '').substring(0, 10);
                                setPptFileNameInput(`官频_${cleanChTitle}_PPT_校订版.pptx`);
                                addToast('自动附带匹配的主题文件名！', 'info');
                              }}
                              className="absolute right-2 top-2.5 text-[10px] text-indigo-600 hover:underline font-bold"
                            >
                              智能推荐
                            </button>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1">系统将模拟生成一个 PPT 离线数据包并加密上传</p>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1 font-mono">粘贴共享网盘或腾讯文档链接</label>
                          <div className="relative">
                            <input
                              type="url"
                              required
                              value={pptFileLinkInput}
                              onChange={(e) => setPptFileLinkInput(e.target.value)}
                              placeholder="https://docs.qq.com/doc/p/..."
                              className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2.5 pr-10 focus:outline-hidden focus:border-indigo-600 font-mono"
                            />
                            <LinkIcon className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1">支持腾讯文档、飞书云文档及百度网盘分享提取码</p>
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white font-bold text-xs py-2.5 rounded-lg transition-all hover:bg-indigo-700 shadow-sm shadow-indigo-100 flex items-center justify-center gap-1.5"
                      >
                        <FileCheck className="w-4 h-4" />
                        提交并同步至运营端
                      </button>
                    </form>

                    {/* Historical documents lists uploaded */}
                    <div className="space-y-2 pt-3 border-t border-slate-200/80">
                      <span className="block text-xs font-bold text-slate-500 font-mono">本场次 PPT 历史提交及审核情况</span>
                      
                      {currentChannelForPPT.uploads.length === 0 ? (
                        <div className="text-center py-4 bg-white/50 rounded-lg border border-slate-100">
                          <p className="text-xs text-slate-400 italic">暂无本场次的专门提交记录，请尽快前往上方上传。</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {currentChannelForPPT.uploads.map((rec, idx) => (
                            <div key={idx} className="bg-white p-3 rounded-lg border border-slate-100 flex items-start justify-between gap-2">
                              <div className="space-y-0.5">
                                <div className="text-xs font-semibold text-slate-800 break-all">{rec.fileName}</div>
                                <div className="text-[10px] text-slate-400 font-mono">时间: {rec.uploadTime}</div>
                              </div>
                              <div className="text-right shrink-0">
                                {rec.status === 'confirmed' ? (
                                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold whitespace-nowrap">
                                    ✅ 运营已确认
                                  </span>
                                ) : (
                                  <div className="space-y-1">
                                    <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold block text-center whitespace-nowrap">
                                      ⏳ 待审核
                                    </span>
                                    {/* Simulated Approval Action */}
                                    <button
                                      onClick={() => approvePPTUpload(currentChannelForPPT.id, idx)}
                                      className="text-[9px] text-indigo-600 hover:underline block text-right font-bold w-full"
                                    >
                                      [模拟平台审核]
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-xs text-slate-400">请在左侧点击场次以查看并管理上传 PPT 流程。</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>


        {/* ======================= MODULE 2: 官频脚本上报 ======================= */}
        <section id="module-script-upload" className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden transition-all duration-300 hover:shadow-md">
          
          {/* Header */}
          <div className="bg-slate-50 border-b border-slate-200/70 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">官频脚本上报</h3>
                <p className="text-xs text-slate-500">
                  支持主播在直播前进行官频运行脚本 (.pptx / .pdf / .doc / .docx) 的上报确认
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            
            {/* Success alert banner */}
            {scriptUploadSuccessBanner && (
              <div className="bg-emerald-550 bg-emerald-50 text-emerald-900 border border-emerald-200 p-4 rounded-xl flex items-center justify-between gap-3 animate-fade-in">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span>{scriptUploadSuccessBanner}</span>
                </div>
                <button 
                  onClick={() => setScriptUploadSuccessBanner(null)}
                  className="text-emerald-500 hover:text-emerald-900 text-xs font-bold"
                >
                  我知道了 ×
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Left Form (Drag & Drop or Click Area + Inputs) */}
              <div className="md:col-span-5 space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">脚本上传通道</h4>
                
                {/* Form inputs */}
                <form onSubmit={handleScriptSubmit} className="space-y-4">
                  {/* Select corresponding Active Topic for the script to bind */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 font-mono">对应活动主题/场次关联</label>
                    <select className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:border-indigo-600 font-medium">
                      {currentAnchor.channels.map(ch => (
                        <option key={ch.id} value={ch.id}>
                          {ch.title.substring(0, 30)}...
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Version */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 font-mono">上报脚本版本</label>
                    <input 
                      type="text" 
                      required
                      value={scriptVersion} 
                      onChange={(e) => setScriptVersion(e.target.value)}
                      placeholder="例如 v3"
                      className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:border-indigo-600 font-mono font-bold"
                    />
                  </div>

                  {/* Upload Drop Zone */}
                  <div className="space-y-1">
                    <span className="block text-xs font-bold text-slate-500 font-mono">文件载入区域</span>
                    <div
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      onClick={triggerFileSelect}
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                        dragActive 
                          ? 'border-indigo-500 bg-indigo-50/55' 
                          : scriptFileName 
                          ? 'border-emerald-300 bg-emerald-50/20 hover:border-emerald-400' 
                          : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50'
                      }`}
                    >
                      <UploadCloud className={`w-8 h-8 mx-auto mb-2 ${scriptFileName ? 'text-emerald-500' : 'text-slate-400'}`} />
                      
                      {scriptFileName ? (
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-800 break-all">{scriptFileName}</p>
                          <p className="text-[10px] text-emerald-600">已就绪，再次点击或拖拽可更换文件</p>
                        </div>
                      ) : (
                        <div className="space-y-1 text-slate-500">
                          <p className="text-xs font-semibold">拖拽您的脚本文件到这里，或 <span className="text-indigo-600 underline">点击模拟选择</span></p>
                          <p className="text-[10px] text-slate-400">允许文件格式：.pptx / .pdf / .doc / .docx</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={triggerFileSelect}
                      className="flex-1 bg-slate-100 text-slate-700 font-bold text-xs py-2.5 rounded-lg hover:bg-slate-200 transition-all font-mono"
                    >
                      [选择仿本地文件]
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-indigo-600 text-white font-bold text-xs py-2.5 rounded-lg hover:bg-indigo-700 transition-all shadow-xs"
                    >
                      🚀 确认提交上报
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Table (Historical Records) */}
              <div className="md:col-span-7 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">脚本提报历史记录</h4>
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded font-mono">
                    共 {currentAnchor.scripts.length} 条已保存记录
                  </span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200/80">
                  <table className="min-w-full divide-y divide-slate-200 text-xs">
                    <thead className="bg-slate-50 font-bold text-slate-600 uppercase font-mono">
                      <tr>
                        <th className="px-4 py-3 text-left">版本</th>
                        <th className="px-4 py-3 text-left">文件名</th>
                        <th className="px-4 py-3 text-left">上传时间</th>
                        <th className="px-4 py-3 text-left">运营确认状态</th>
                        <th className="px-4 py-3 text-center">操作</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100 text-slate-700">
                      {currentAnchor.scripts.map((script) => (
                        <tr key={script.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-4 py-3 whitespace-nowrap font-mono font-extrabold text-indigo-700">
                            {script.version}
                          </td>
                          <td className="px-4 py-3 font-medium">
                            <div className="flex items-center gap-1.5 max-w-[200px] truncate" title={script.fileName}>
                              <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{script.fileName}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-slate-500 font-mono">
                            {script.uploadTime}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {script.status === 'confirmed' ? (
                              <span className="inline-flex items-center gap-0.5 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                                ✅ 已确认
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-0.5 text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-bold">
                                ⏳ 待审核
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center">
                            {script.status === 'confirmed' ? (
                              <span className="text-slate-400 italic text-[10px]">无须处理</span>
                            ) : (
                              <button
                                onClick={() => approveScriptReport(script.id)}
                                className="text-[10px] text-white bg-indigo-600 hover:bg-indigo-700 py-1 px-2 rounded-md font-bold transition-all shadow-xs"
                              >
                                模拟过审
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* ======================= MODULE 3: 官频数据 ======================= */}
        <section id="module-channel-analytics" className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden transition-all duration-300 hover:shadow-md">
          
          {/* Header */}
          <div className="bg-slate-50 border-b border-slate-200/70 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">官频数据细颗粒度指标</h3>
                <p className="text-xs text-slate-500">
                  选择并调阅历史活动的具体开播流水、互动人数与转化率明细指标卡片
                </p>
              </div>
            </div>
            {/* Quick overview of selected item */}
            <div className="bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-lg text-xs font-bold text-indigo-900 font-mono">
              活动编号: {selectedActivityData?.htidJid || 'N/A'}
            </div>
          </div>

          <div className="p-6 space-y-6">
            
            {/* Top Area: Selected Activity Overview Details */}
            {selectedActivityData ? (
              <div className="bg-slate-50/50 rounded-xl p-5 border border-slate-100">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">当前选中的活动概要信息 / Basic Information</div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white p-3 rounded-lg border border-slate-200/60 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0">📆</div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-mono">开播日期</div>
                      <div className="text-sm font-extrabold text-slate-800">{selectedActivityData.date}</div>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200/60 flex items-center gap-3 md:col-span-2">
                    <div className="h-9 w-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-sm shrink-0">🏷️</div>
                    <div className="overflow-hidden">
                      <div className="text-[10px] text-slate-400 uppercase font-mono">活动话题 / Title</div>
                      <div className="text-sm font-extrabold text-slate-800 truncate" title={selectedActivityData.topic}>
                        {selectedActivityData.topic}
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200/60 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 font-bold text-sm shrink-0">👑</div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-mono">直播主播</div>
                      <div className="text-sm font-extrabold text-slate-800">{selectedActivityData.anchorName}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 bg-slate-50 rounded-xl text-slate-400 italic text-xs">
                暂无相关活动，请在下方选择尝试。
              </div>
            )}

            {/* Middle Area: Metrics Grid 3x4 / Bento Grid containing 12 Indicators */}
            {selectedActivityData ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                
                {/* 1. 开播时长 */}
                <div className="bg-white hover:bg-slate-50/50 p-4 rounded-xl border border-slate-200/75 transition-all flex flex-col justify-between h-28 hover:shadow-xs group">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-semibold text-slate-500">开播时长</span>
                    <span className="text-lg">⏱️</span>
                  </div>
                  <div>
                    <div className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors font-mono">
                      {selectedActivityData.metrics.duration} <span className="text-xs font-bold text-slate-400">分钟</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">当日在线有效直播总时长</p>
                  </div>
                </div>

                {/* 2. 访问人数 */}
                <div className="bg-white hover:bg-slate-50/50 p-4 rounded-xl border border-slate-200/75 transition-all flex flex-col justify-between h-28 hover:shadow-xs group">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-semibold text-slate-500">访问人数</span>
                    <span className="text-lg">👥</span>
                  </div>
                  <div>
                    <div className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors font-mono">
                      {selectedActivityData.metrics.viewers.toLocaleString()} <span className="text-xs font-bold text-slate-400">UV</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">进入过直播房间的独立访客</p>
                  </div>
                </div>

                {/* 3. 有效观看人数 */}
                <div className="bg-white hover:bg-slate-50/50 p-4 rounded-xl border border-slate-200/75 transition-all flex flex-col justify-between h-28 hover:shadow-xs group">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-semibold text-slate-500">有效观看人数</span>
                    <span className="text-lg">👨‍👩‍👧‍👦</span>
                  </div>
                  <div>
                    <div className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors font-mono">
                      {selectedActivityData.metrics.validViewers.toLocaleString()} <span className="text-xs font-bold text-slate-400">人</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">观看时长超标的合格听众</p>
                  </div>
                </div>

                {/* 4. 进房转化率 */}
                <div className="bg-white hover:bg-slate-50/50 p-4 rounded-xl border border-slate-200/75 transition-all flex flex-col justify-between h-28 hover:shadow-xs group">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-semibold text-slate-500">进房转化率</span>
                    <span className="text-lg">📈</span>
                  </div>
                  <div>
                    <div className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors font-mono">
                      {selectedActivityData.metrics.conversionRate}%
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">流经用户成功留存进房比例</p>
                  </div>
                </div>

                {/* 5. 有效观看时长 */}
                <div className="bg-white hover:bg-slate-50/50 p-4 rounded-xl border border-slate-200/75 transition-all flex flex-col justify-between h-28 hover:shadow-xs group">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-semibold text-slate-500">有效观看时长</span>
                    <span className="text-lg">⏳</span>
                  </div>
                  <div>
                    <div className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors font-mono">
                      {selectedActivityData.metrics.validDuration} <span className="text-xs font-bold text-slate-400">分钟</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">人均观看留存的质量时间</p>
                  </div>
                </div>

                {/* 6. 最高在线人数 */}
                <div className="bg-white hover:bg-slate-50/50 p-4 rounded-xl border border-slate-200/75 transition-all flex flex-col justify-between h-28 hover:shadow-xs group">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-semibold text-slate-500">最高在线人数</span>
                    <span className="text-lg">📊</span>
                  </div>
                  <div>
                    <div className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors font-mono">
                      {selectedActivityData.metrics.maxOnline.toLocaleString()} <span className="text-xs font-bold text-slate-400">PCU</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">直播峰值瞬时同屏在线人数</p>
                  </div>
                </div>

                {/* 7. 评论人数 */}
                <div className="bg-white hover:bg-slate-50/50 p-4 rounded-xl border border-slate-200/75 transition-all flex flex-col justify-between h-28 hover:shadow-xs group">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-semibold text-slate-500">评论人数</span>
                    <span className="text-lg">💬</span>
                  </div>
                  <div>
                    <div className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors font-mono">
                      {selectedActivityData.metrics.commentsCount} <span className="text-xs font-bold text-slate-400">人</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">发送公屏发言及弹幕的访客</p>
                  </div>
                </div>

                {/* 8. 评论率 */}
                <div className="bg-white hover:bg-slate-50/50 p-4 rounded-xl border border-slate-200/75 transition-all flex flex-col justify-between h-28 hover:shadow-xs group">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-semibold text-slate-500">评论率</span>
                    <span className="text-lg">💟</span>
                  </div>
                  <div>
                    <div className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors font-mono">
                      {selectedActivityData.metrics.commentRate}%
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">发言人数总占访客总数比</p>
                  </div>
                </div>

                {/* 9. 送礼人数 */}
                <div className="bg-white hover:bg-slate-50/50 p-4 rounded-xl border border-slate-200/75 transition-all flex flex-col justify-between h-28 hover:shadow-xs group">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-semibold text-slate-500">送礼人数</span>
                    <span className="text-lg">🎁</span>
                  </div>
                  <div>
                    <div className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors font-mono">
                      {selectedActivityData.metrics.giftingUsers} <span className="text-xs font-bold text-slate-400">人</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">付费或赠送平台道具的土豪数</p>
                  </div>
                </div>

                {/* 10. 房间流水(金币) */}
                <div className="bg-white hover:bg-slate-50/50 p-4 rounded-xl border border-slate-200/75 transition-all flex flex-col justify-between h-28 hover:shadow-xs group">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-semibold text-slate-500">房间流水(金币)</span>
                    <span className="text-lg font-bold text-amber-500">🪙</span>
                  </div>
                  <div>
                    <div className="text-xl font-black text-amber-600 transition-colors font-mono">
                      {selectedActivityData.metrics.coins} <span className="text-xs font-extrabold text-amber-700">Coins</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">打赏等折合算虚拟代币总和</p>
                  </div>
                </div>

                {/* 11. 房间流水(CNY) */}
                <div className="bg-white hover:bg-slate-50/50 p-4 rounded-xl border border-slate-200/75 transition-all flex flex-col justify-between h-28 hover:shadow-xs group">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-semibold text-slate-500">房间流水(CNY)</span>
                    <span className="text-lg">💴</span>
                  </div>
                  <div>
                    <div className="text-xl font-black text-emerald-600 transition-colors font-mono">
                      ¥{selectedActivityData.metrics.cny.toFixed(2)}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">最终清算返现的人民币等额</p>
                  </div>
                </div>

                {/* 12. 转粉数 */}
                <div className="bg-white hover:bg-slate-50/50 p-4 rounded-xl border border-slate-200/75 transition-all flex flex-col justify-between h-28 hover:shadow-xs group">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-semibold text-slate-500">转粉数</span>
                    <span className="text-lg">🚀</span>
                  </div>
                  <div>
                    <div className="text-xl font-black text-indigo-950 group-hover:text-indigo-600 transition-colors font-mono">
                      +{selectedActivityData.metrics.fansGained} <span className="text-xs font-bold text-slate-400">FANS</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">该场次直播净新订阅的主播爱慕粉</p>
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center py-20 text-slate-400 italic">
                暂未选择任何活动，请选用下方下拉框加载。
              </div>
            )}

            {/* Bottom Area: Dropdown Selector to switch Activities */}
            <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Database className="w-4 h-4 text-indigo-600" />
                <span>下方下拉框聚合了当前主播的 <b>3-5</b> 场活动明细。点击即可动态驱动上方精细卡片。</span>
              </div>
              
              <div className="w-full sm:w-auto flex items-center gap-2">
                <label className="text-xs font-bold text-slate-700 shrink-0 font-mono">选择指定活动场次指标:</label>
                <select
                  value={selectedActivityId}
                  onChange={(e) => {
                    setSelectedActivityId(e.target.value);
                    addToast('官频核心业务指标已切换！已加载最新留存及流水。', 'success');
                  }}
                  className="w-full sm:w-[320px] text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-lg p-2.5 focus:outline-hidden focus:border-indigo-600"
                >
                  {currentAnchor.activities.map((act) => (
                    <option key={act.id} value={act.id}>
                      [{act.date}] - {act.topic.substring(0, 20)}... ({act.htidJid})
                    </option>
                  ))}
                </select>
              </div>
            </div>

          </div>
        </section>


        {/* ======================= MODULE 4: 奖励下发 ======================= */}
        <section id="module-incentive-rewards" className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden transition-all duration-300 hover:shadow-md">
          
          {/* Header */}
          <div className="bg-slate-50 border-b border-slate-200/70 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">4</div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">奖励下发与提现</h3>
                <p className="text-xs text-slate-500">
                  尊享官方运营下发的VIP体验卡、官频代币、荣誉头像框勋章及兑现钻石包，直接领取实时结算
                </p>
              </div>
            </div>
            {/* Legend indicators */}
            <div className="flex items-center gap-2 text-xs font-medium">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-bold whitespace-nowrap">
                ● 待领取：紫色Badge
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold whitespace-nowrap">
                ● 已领取：绿色Badge
              </span>
            </div>
          </div>

          <div className="p-6">
            
            {/* 2x2 Reward Cards Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentAnchor.rewards.map((reward) => {
                const isPending = reward.status === 'pending';
                
                return (
                  <div 
                    key={reward.id}
                    className={`p-5 rounded-2xl border transition-all duration-300 flex items-start gap-4 ${
                      isPending 
                        ? 'bg-purple-50/20 border-purple-200/60 hover:shadow-xs hover:border-purple-300' 
                        : 'bg-slate-50/50 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {/* Emoji Reward Icon Box */}
                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-sm ${
                      isPending 
                        ? 'bg-purple-100/70 border border-purple-200 text-purple-900 animate-pulse' 
                        : 'bg-slate-100 border border-slate-200'
                    }`}>
                      {reward.icon}
                    </div>

                    {/* Content Detail */}
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-extrabold text-slate-900 text-sm">{reward.name}</h4>
                        
                        {/* Status Badge */}
                        {isPending ? (
                          <span className="text-[10px] bg-purple-100 text-purple-800 border border-purple-300 px-2.5 py-0.5 rounded-full font-bold">
                            待领取
                          </span>
                        ) : (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full font-bold">
                            已领取
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 font-medium">价值及数量: {reward.value}</p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        流水清算类型: {reward.type.toUpperCase()} | 证书编码: REW-{reward.id.substring(reward.id.length-4)}
                      </p>

                      {/* Action Button */}
                      <div className="pt-2">
                        {isPending ? (
                          <button
                            onClick={() => claimReward(reward.id)}
                            className="bg-indigo-600 text-white hover:bg-indigo-700 font-bold text-xs py-1.5 px-4 rounded-lg transition-all shadow-xs flex items-center gap-1"
                          >
                            <Gift className="w-3.5 h-3.5" />
                            立即领取
                          </button>
                        ) : (
                          <button
                            disabled
                            className="bg-slate-200 text-slate-500 font-bold text-xs py-1.5 px-4 rounded-lg cursor-not-allowed flex items-center gap-1"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            已妥善分发
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Extra reward policy notes for professionalism */}
            <div className="mt-8 bg-slate-50 border border-slate-200/50 rounded-xl p-4 flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1 text-slate-600">
                <span className="font-bold text-slate-800 block">奖励领取及结算说明:</span>
                <p>1. VIP体验和官频代币属于平台瞬时下发资产，领用后 <b>10分钟内</b> 注入关联主播账号并直接发送短信/站内信通告。</p>
                <p>2. 专属徽章、烈焰跑车入场座驾属于装扮库道具，主播可以在【我的装扮】栏目进行一键激活和切换。</p>
                <p>3. 钻石及现金奖励由签约公会协助完成纳税申报，预计 <b>3 个工作日</b> 划拨至预留银行通道。</p>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* Footer System Credits */}
      <footer className="bg-white border-t border-slate-100 py-8 mt-12 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-1">
          <p className="font-medium">主播官频协同控制系统 © 2026. All Rights Reserved.</p>
          <p className="font-mono text-[10px]">Version 2.4.0 (State Saved to LocalStorage) | Designed for Host-Ops Synchronization</p>
        </div>
      </footer>

    </div>
  );
}
