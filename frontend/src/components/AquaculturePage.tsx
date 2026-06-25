// src/components/AquaculturePage.tsx
import React, { useState, useEffect, useCallback, useRef} from 'react';
import { MAX_SLOTS, NAMAKO_DICTIONARY, SEED_PATTERNS, BAIT_PATTERNS } from '../constants/gameData';
import type { NamakoSlot } from '../types/game';

interface AquaculturePageProps {
  username: string;
  onLogout: () => void;
}

// ゲーム内ログ（通知）の型定義
interface GameLog {
  id: number;
  text: string;
  type: 'success' | 'error' | 'info';
}

export const AquaculturePage: React.FC<AquaculturePageProps> = ({ username, onLogout }) => {
  // --- 1. ゲームの状態（State） ---
  const [money, setMoney] = useState<number>(500); 
  const [maxVisibleSlots, setMaxVisibleSlots] = useState<number>(10); 
  const [slots, setSlots] = useState<NamakoSlot[]>(
    Array.from({ length: MAX_SLOTS }, (_, index) => ({
      id: index,
      status: 'BEFORE',
      remainingTime: 0,
      speciesId: null,
    }))
  );
  const [unlockedSpeciesIds, setUnlockedSpeciesIds] = useState<number[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [harvestCounts, setHarvestCounts] = useState<{ [key: number]: number }>({ 1: 0, 2: 0, 3: 0 });

  // ーーー ★ ゲーム風UI用の新しいState ーーー
  const [logs, setLogs] = useState<GameLog[]>([]); // 画面右下のログメッセージ一覧
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, message: '', onConfirm: () => {} });

  const currentSlot = selectedSlotId !== null ? slots[selectedSlotId] : null;
  const slotExtensionCost = maxVisibleSlots * 50;
  const totalHarvestCount = Object.values(harvestCounts).reduce((a, b) => a + b, 0);
  const prevSlotsRef = useRef<NamakoSlot[]>([]);

// --- 2. 独自ログ追加関数（同時発火バグ修正版） ---
const addLog = useCallback((text: string, type: 'success' | 'error' | 'info' = 'info') => {
  // ★ Date.now() だけでなく、ランダムな文字列を混ぜて絶対に重複しないIDにする
  const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  setLogs((prev) => {
    const nextLogs = [...prev, { id: uniqueId as any, text, type }];
    return nextLogs.slice(-7);
  });
  
  // 2秒後に自動で消えるタイマー
  setTimeout(() => {
    setLogs((prev) => prev.filter((log) => (log.id as any) !== uniqueId));
  }, 2000);
}, []);

  useEffect(() => {
  slots.forEach((slot) => {
    const prevSlot = prevSlotsRef.current.find((s) => s.id === slot.id);
    
    // 「前回は養殖中（GROWING）」で「今回は完了（COMPLETED）」に切り替わった瞬間だけを検知
    if (prevSlot && prevSlot.status === 'GROWING' && slot.status === 'COMPLETED' && slot.speciesId !== null) {
      const chosen = NAMAKO_DICTIONARY.find((s) => s.id === slot.speciesId);
      if (chosen) {
        addLog(`🔔 水槽 ${slot.id + 1}番のナマコが「${chosen.name}」に成長しました！`, 'info');
      }
    }
  });
  
  // 現在の状態をリファレンスに保存
  prevSlotsRef.current = slots;
}, [slots, addLog]);

// --- 3. 時間経過（タイマーロジック） ---
useEffect(() => {
  const timer = setInterval(() => {
    setSlots((prevSlots) =>
      prevSlots.map((slot) => {
        if (slot.status !== 'GROWING' || slot.remainingTime <= 0) return slot;

        const nextTime = slot.remainingTime - 1;
        if (nextTime <= 0) {
          const randomIndex = Math.floor(Math.random() * NAMAKO_DICTIONARY.length);
          const chosen = NAMAKO_DICTIONARY[randomIndex];
          // ★ ここでは addLog を呼ばず、ステート変化だけを起こす
          return {
            ...slot,
            status: 'COMPLETED',
            remainingTime: 0,
            speciesId: chosen.id,
          };
        }
        return { ...slot, remainingTime: nextTime };
      })
    );
  }, 1000);

  return () => clearInterval(timer);
}, []);

  // --- 4. 拡張アクション ---
  const handleExtendSlot = () => {
    if (maxVisibleSlots >= MAX_SLOTS) return;
    if (money < slotExtensionCost) {
      addLog('❌ マニーが足りません！', 'error');
      return;
    }
    setMoney((prev) => prev - slotExtensionCost);
    setMaxVisibleSlots((prev) => Math.min(MAX_SLOTS, prev + 1));
    addLog('🛠️ 水槽を1マス拡張しました！', 'success');
  };

  // --- 5. 個別操作アクション ---
  const handlePlantSeedIndividual = (cost: number, growTime: number) => {
    if (selectedSlotId === null || !currentSlot || currentSlot.status !== 'BEFORE') return;
    if (money < cost) {
      addLog('❌ マニーが足りません！', 'error');
      return;
    }

    setMoney((prev) => prev - cost);
    setSlots((prevSlots) =>
      prevSlots.map((slot) =>
        slot.id === selectedSlotId ? { ...slot, status: 'GROWING' as const, remainingTime: growTime, speciesId: null } : slot
      )
    );
    addLog(`🌱 ${selectedSlotId + 1}番水槽に種苗を植えました。`, 'success');
  };

  const handleGiveBaitIndividual = (cost: number, reductionTime: number) => {
    if (selectedSlotId === null || !currentSlot || currentSlot.status !== 'GROWING') return;
    if (money < cost) {
      addLog('❌ マニーが足りません！', 'error');
      return;
    }

    setMoney((prev) => prev - cost);
    setSlots((prevSlots) =>
      prevSlots.map((slot) => {
        if (slot.id === selectedSlotId) {
          const nextTime = Math.max(0, slot.remainingTime - reductionTime);
          if (nextTime === 0) {
            const randomIndex = Math.floor(Math.random() * NAMAKO_DICTIONARY.length);
            return { ...slot, status: 'COMPLETED' as const, remainingTime: 0, speciesId: NAMAKO_DICTIONARY[randomIndex].id };
          }
          return { ...slot, remainingTime: nextTime };
        }
        return slot;
      })
    );
    addLog(`🍖 ${selectedSlotId + 1}番水槽にエサをあげました（-${reductionTime}秒）`, 'success');
  };

  const handleHarvestIndividual = () => {
    if (selectedSlotId === null || !currentSlot || currentSlot.status !== 'COMPLETED' || currentSlot.speciesId === null) return;

    const species = NAMAKO_DICTIONARY.find((s) => s.id === currentSlot.speciesId);
    if (!species) return;

    setMoney((prev) => prev + species.price);
    setHarvestCounts((prev) => ({ ...prev, [species.id]: (prev[species.id] || 0) + 1 }));

    if (!unlockedSpeciesIds.includes(species.id)) {
      setUnlockedSpeciesIds((prev) => [...prev, species.id]);
      addLog(`🎉 新種発見！「${species.name}」を図鑑に登録しました！`, 'success');
    } else {
      addLog(`🧺「${species.name}」を収穫して ${species.price}M 獲得！`, 'success');
    }

    setSlots((prevSlots) =>
      prevSlots.map((slot) =>
        slot.id === selectedSlotId ? { ...slot, status: 'BEFORE' as const, remainingTime: 0, speciesId: null } : slot
      )
    );
  };

  // 個別放流（カスタムconfirmダイアログを使用）
  const handleReleaseIndividual = () => {
    if (selectedSlotId === null || !currentSlot || currentSlot.status !== 'GROWING') return;

    setConfirmDialog({
      isOpen: true,
      message: `⚠️ ${selectedSlotId + 1}番水槽のナマコを本当に放流しますか？（成長中の個体は消滅し、マニーは戻りません）`,
      onConfirm: () => {
        setSlots((prevSlots) =>
          prevSlots.map((slot) =>
            slot.id === selectedSlotId ? { ...slot, status: 'BEFORE' as const, remainingTime: 0, speciesId: null } : slot
          )
        );
        addLog(`🌊 ${selectedSlotId + 1}番水槽のナマコを放流しました。`, 'info');
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  // --- 6. 全体一括操作アクション ---
  const handlePlantSeedAll = (cost: number, growTime: number) => {
    let currentMoney = money;
    let plantedCount = 0;

    const nextSlots = slots.map((slot) => {
      if (slot.id >= maxVisibleSlots) return slot;
      if (slot.status === 'BEFORE' && currentMoney >= cost) {
        currentMoney -= cost;
        plantedCount++;
        return { ...slot, status: 'GROWING' as const, remainingTime: growTime, speciesId: null };
      }
      return slot;
    });

    if (plantedCount === 0) {
      addLog('❌ 空き水槽がないか、マニーが足りません！', 'error');
      return;
    }
    setMoney(currentMoney);
    setSlots(nextSlots);
    addLog(`🌱 空き水槽 ${plantedCount} 箇所に一斉種苗しました！`, 'success');
  };

  const handleGiveBaitAll = (cost: number, reductionTime: number) => {
    const growingSlotsCount = slots.slice(0, maxVisibleSlots).filter((s) => s.status === 'GROWING').length;
    if (growingSlotsCount === 0) {
      addLog('❌ 現在、養殖中のナマコがいません！', 'error');
      return;
    }

    const totalCost = cost * growingSlotsCount;
    if (money < totalCost) {
      addLog(`❌ マニーが足りません！全員分に必要: ${totalCost}M`, 'error');
      return;
    }

    setMoney((prev) => prev - totalCost);
    setSlots((prevSlots) =>
      prevSlots.map((slot) => {
        if (slot.id >= maxVisibleSlots || slot.status !== 'GROWING') return slot;
        const nextTime = Math.max(0, slot.remainingTime - reductionTime);
        if (nextTime === 0) {
          const randomIndex = Math.floor(Math.random() * NAMAKO_DICTIONARY.length);
          return { ...slot, status: 'COMPLETED' as const, remainingTime: 0, speciesId: NAMAKO_DICTIONARY[randomIndex].id };
        }
        return { ...slot, remainingTime: nextTime };
      })
    );
    addLog(`🍖 養殖中のナマコ ${growingSlotsCount} 匹に一斉エサやりしました！`, 'success');
  };

  const handleHarvestAll = () => {
    let earnedMoney = 0;
    const newUnlockedIds: number[] = [];
    const localHarvestIncrements: { [key: number]: number } = {};

    const nextSlots = slots.map((slot) => {
      if (slot.id >= maxVisibleSlots) return slot;
      if (slot.status === 'COMPLETED' && slot.speciesId !== null) {
        const species = NAMAKO_DICTIONARY.find((s) => s.id === slot.speciesId);
        if (species) {
          earnedMoney += species.price;
          localHarvestIncrements[species.id] = (localHarvestIncrements[species.id] || 0) + 1;
          if (!unlockedSpeciesIds.includes(species.id) && !newUnlockedIds.includes(species.id)) {
            newUnlockedIds.push(species.id);
          }
        }
        return { ...slot, status: 'BEFORE' as const, remainingTime: 0, speciesId: null };
      }
      return slot;
    });

    if (earnedMoney === 0) {
      addLog('❌ 収穫できるナマコがいません！', 'error');
      return;
    }

    setHarvestCounts((prev) => {
      const nextCounts = { ...prev };
      Object.keys(localHarvestIncrements).forEach((idStr) => {
        const id = Number(idStr);
        nextCounts[id] = (nextCounts[id] || 0) + localHarvestIncrements[id];
      });
      return nextCounts;
    });

    if (newUnlockedIds.length > 0) {
      addLog(`🎉 一括収穫！新種を ${newUnlockedIds.length} 種発見！計 ${earnedMoney}M 獲得！`, 'success');
      setUnlockedSpeciesIds((prev) => [...prev, ...newUnlockedIds]);
    } else {
      addLog(`🧺 ナマコを一括収穫し、 ${earnedMoney}M 獲得しました！`, 'success');
    }

    setMoney((prev) => prev + earnedMoney);
    setSlots(nextSlots);
  };

  // 全体一括放流（カスタムconfirmダイアログを使用）
  const handleReleaseAll = () => {
    const hasGrowing = slots.slice(0, maxVisibleSlots).some((s) => s.status === 'GROWING');
    if (!hasGrowing) {
      addLog('❌ 放流できるナマコがいません。', 'error');
      return;
    }

    setConfirmDialog({
      isOpen: true,
      message: '⚠️ 【警告】現在養殖中のナマコを【すべて】放流しますか？（完了した個体は残りますが、育成中のものは全消滅します）',
      onConfirm: () => {
        setSlots((prevSlots) =>
          prevSlots.map((slot) => {
            if (slot.id >= maxVisibleSlots) return slot;
            return slot.status === 'GROWING' ? { ...slot, status: 'BEFORE' as const, remainingTime: 0, speciesId: null } : slot;
          })
        );
        addLog('🌊 全水槽の育成中ナマコを一斉放流しました。', 'info');
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  return (
    <div style={styles.pageContainer}>
      {/* --- ヘッダー欄 --- */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.headerItem}>👤 ユーザー: <strong>{username}</strong></span>
          <span style={styles.headerItem}>💰 資金: <strong>{money}</strong> マニー</span>
          <span style={styles.headerItem}>🐙 水槽規模: <strong>{maxVisibleSlots}</strong> / 30</span>
          <span style={{ ...styles.headerItem, backgroundColor: '#E8F5E9', color: '#2E7D32', fontWeight: 'bold' }}>
            🧺 総収穫数: {totalHarvestCount} 匹
          </span>
        </div>
        <button onClick={onLogout} style={styles.logoutButton}>保存してログアウト</button>
      </header>

      <div style={styles.mainLayout}>
        {/* 左側：ナマコ表示欄 */}
        <div style={styles.leftColumn}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0 }}>現在の養殖水槽（{maxVisibleSlots}マス）</h3>
            {maxVisibleSlots < MAX_SLOTS ? (
              <button onClick={handleExtendSlot} style={styles.extendButton}>
                🛠️ 水槽拡張（必要: {slotExtensionCost}M）
              </button>
            ) : (
              <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>🎉 水槽最大規模！</span>
            )}
          </div>
          
          <div style={styles.gridContainer}>
            {slots.map((slot) => {
              const isLocked = slot.id >= maxVisibleSlots;
              const isSelected = slot.id === selectedSlotId;
              const species = slot.speciesId ? NAMAKO_DICTIONARY.find(s => s.id === slot.speciesId) : null;

              if (isLocked) {
                return (
                  <div key={slot.id} style={{ ...styles.slotCard, ...styles.lockedSlot }}>
                    <div style={styles.slotId}>{slot.id + 1}</div>
                    <div style={styles.slotImage}>🔒</div>
                    <div style={{ ...styles.slotStatusLabel, color: '#aaa' }}>未解放</div>
                  </div>
                );
              }

              return (
                <div 
                  key={slot.id} 
                  onClick={() => setSelectedSlotId(slot.id)}
                  style={{
                    ...styles.slotCard,
                    ...(isSelected ? styles.selectedSlot : {}),
                    cursor: 'pointer'
                  }}
                >
                  <div style={styles.slotId}>{slot.id + 1}</div>
                  <div style={styles.slotImage}>
                    {slot.status === 'BEFORE' && '🫙'}
                    {slot.status === 'GROWING' && '🐛'}
                    {slot.status === 'COMPLETED' && species && (
                      <img 
                        src={species.image} 
                        alt={species.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                      />
                    )}
                  </div>
                  <div style={styles.slotTimer}>
                    {slot.status === 'GROWING' ? `${slot.remainingTime}秒` : '--:--'}
                  </div>
                  <div style={styles.slotStatusLabel}>
                    {slot.status === 'BEFORE' && '空き'}
                    {slot.status === 'GROWING' && '養殖中'}
                    {slot.status === 'COMPLETED' && species ? species.name : ''}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 右側：操作パネル */}
        <div style={styles.rightColumn}>
          {/* 個別操作 */}
          <div style={{ ...styles.controlPanel, marginBottom: '20px' }}>
            <h3 style={{ color: '#2196F3', marginTop: 0 }}>🎯 個別操作パネル</h3>
            {currentSlot ? (
              <div>
                <h4 style={{ margin: '5px 0 15px 0' }}>【{selectedSlotId! + 1}番水槽】を選択中</h4>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={handleHarvestIndividual} disabled={currentSlot.status !== 'COMPLETED'} style={{ ...styles.actionButton, backgroundColor: currentSlot.status === 'COMPLETED' ? '#4CAF50' : '#ccc' }}>収穫</button>
                  <button onClick={handleReleaseIndividual} disabled={currentSlot.status !== 'GROWING'} style={{ ...styles.actionButton, backgroundColor: currentSlot.status === 'GROWING' ? '#ff9800' : '#ccc' }}>放流</button>
                </div>
                <h5 style={{ margin: '10px 0 5px 0' }}>🌱 種苗する</h5>
                {SEED_PATTERNS.map((seed) => {
                  const canPlant = currentSlot.status === 'BEFORE' && money >= seed.cost;
                  return <button key={seed.id} onClick={() => handlePlantSeedIndividual(seed.cost, seed.growTime)} disabled={!canPlant} style={{ ...styles.subButton, backgroundColor: canPlant ? '#fff' : '#eaeaea', color: canPlant ? '#333' : '#888' }}>{seed.name} ({seed.cost}M)</button>;
                })}
                <h5 style={{ margin: '10px 0 5px 0' }}>🍖 エサをやる</h5>
                {BAIT_PATTERNS.map((bait) => {
                  const canFeed = currentSlot.status === 'GROWING' && money >= bait.cost;
                  return <button key={bait.id} onClick={() => handleGiveBaitIndividual(bait.cost, bait.reductionTime)} disabled={!canFeed} style={{ ...styles.subButton, backgroundColor: canFeed ? '#fff' : '#eaeaea', color: canFeed ? '#333' : '#888' }}>{bait.name} ({bait.cost}M)</button>;
                })}
              </div>
            ) : (
              <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>水槽マスをタップすると、個別コマンドが表示されます。</p>
            )}
          </div>

          {/* 全体操作 */}
          <div style={styles.controlPanel}>
            <h3 style={{ color: '#4CAF50', marginTop: 0 }}>📢 全体一括コマンド</h3>
            <button onClick={handleHarvestAll} style={{ ...styles.actionButton, backgroundColor: '#4CAF50' }}>🧺 まとめて収穫する</button>
            <button onClick={handleReleaseAll} style={{ ...styles.actionButton, backgroundColor: '#ff9800' }}>🌊 まとめて放流する</button>
            <h5 style={{ margin: '15px 0 5px 0' }}>🌱 全一斉種苗</h5>
            {SEED_PATTERNS.map((seed) => <button key={seed.id} onClick={() => handlePlantSeedAll(seed.cost, seed.growTime)} style={styles.subButton}>全員に「{seed.name}」({seed.cost}M)</button>)}
            <h5 style={{ margin: '15px 0 5px 0' }}>🍖 全一斉エサやり</h5>
            {BAIT_PATTERNS.map((bait) => <button key={bait.id} onClick={() => handleGiveBaitAll(bait.cost, bait.reductionTime)} style={styles.subButton}>全員に「{bait.name}」({bait.cost}M/匹)</button>)}
          </div>
        </div>
      </div>

      {/* 図鑑欄 */}
      <section style={styles.dictionarySection}>
        <h3>ナマコ図鑑 (解放済み: {unlockedSpeciesIds.length} / {NAMAKO_DICTIONARY.length})</h3>
        <div style={styles.dictionaryGrid}>
          {NAMAKO_DICTIONARY.map((item) => {
            const isUnlocked = unlockedSpeciesIds.includes(item.id);
            const count = harvestCounts[item.id] || 0;
            return (
              <div key={item.id} style={styles.dictCard}>
                {/* 上側：横幅いっぱいの画像エリア */}
                <div style={styles.dictImage}>
                  {isUnlocked ? (
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                    />
                  ) : (
                    <span style={{ fontSize: '40px' }}>❓</span>
                  )}
                </div>
                
                {/* 下側：情報エリア */}
                <div style={styles.dictInfo}>
                  {/* 名前と収穫数を縦、またはすっきりした配置に */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                    <h4 style={{ margin: 0, fontSize: '16px' }}>{isUnlocked ? item.name : '？？？？'}</h4>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>収穫: {isUnlocked ? `${count} 匹` : '0 匹'}</span>
                  </div>
                  <p style={styles.dictFlavor}>{isUnlocked ? item.flavorText : 'まだ収穫したことがないナマコです。'}</p>
                  <p style={styles.dictPrice}>価値: {isUnlocked ? `${item.price} マニー` : '??? マニー'}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ーーー ★ ゲーム風 カスタムUIコンポーネントのレンダリング ーーー */}

      {/* 1. 画面右下のリアルタイムログ */}
      <div style={styles.logContainer}>
        {logs.map((log) => (
          <div
            key={log.id}
            style={{
              ...styles.logToast,
              backgroundColor: log.type === 'success' ? '#4CAF50' : log.type === 'error' ? '#F44336' : '#2196F3',
            }}
          >
            {log.text}
          </div>
        ))}
      </div>

      {/* 2. 画面中央のゲーム風確認ダイアログ */}
      {confirmDialog.isOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h3 style={{ marginTop: 0, color: '#ff9800' }}>確認ウィンドウ</h3>
            <p style={{ fontSize: '15px', color: '#333', lineHeight: '1.5' }}>{confirmDialog.message}</p>
            <div style={styles.modalActions}>
              <button onClick={confirmDialog.onConfirm} style={{ ...styles.modalButton, backgroundColor: '#e53935' }}>はい</button>
              <button onClick={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))} style={{ ...styles.modalButton, backgroundColor: '#777' }}>いいえ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// スタイリングの追加・調整
const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: { padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#f5f7fb', minHeight: '100vh', position: 'relative' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '20px' },
  headerLeft: { display: 'flex', gap: '15px', fontSize: '16px', alignItems: 'center', flexWrap: 'wrap' },
  headerItem: { backgroundColor: '#eee', padding: '5px 15px', borderRadius: '20px' },
  logoutButton: { padding: '8px 16px', backgroundColor: '#e53935', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  mainLayout: { display: 'flex', gap: '20px', marginBottom: '30px' },
  leftColumn: { flex: 3, backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  rightColumn: { flex: 1, minWidth: '320px' },
  extendButton: { padding: '6px 12px', backgroundColor: '#2196F3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' },
  gridContainer: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' },
  slotCard: { border: '2px solid #e0e0e0', borderRadius: '6px', padding: '10px', textAlign: 'center', backgroundColor: '#fafafa', position: 'relative', userSelect: 'none', transition: 'all 0.15s' },
  selectedSlot: { borderColor: '#2196F3', backgroundColor: '#E3F2FD', transform: 'scale(1.02)', boxShadow: '0 2px 8px rgba(33,150,243,0.2)' },
  lockedSlot: { backgroundColor: '#eaeaea', borderStyle: 'dashed', borderColor: '#ccc' },
  slotId: { fontSize: '12px', color: '#999', position: 'absolute', top: '4px', left: '6px' },
  slotImage: { 
    width: '100px',       // 幅を固定
    height: '100px',      // 高さを固定
    margin: '10px auto', // 中央寄せ
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  slotTimer: { fontSize: '13px', fontWeight: 'bold', color: '#555' },
  slotStatusLabel: { fontSize: '11px', marginTop: '4px', color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  controlPanel: { backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  actionButton: { flex: 1, padding: '10px', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', marginBottom: '10px', cursor: 'pointer' },
  subButton: { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '6px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' },
  divider: { margin: '15px 0', border: 'none', borderTop: '1px solid #eee' },
  dictionarySection: { backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  dictionaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginTop: '15px' },
  
  // ★ 縦長カードに変更
  dictCard: { 
    display: 'flex', 
    flexDirection: 'column', // 子要素を縦に並べる
    border: '1px solid #e0e0e0', 
    borderRadius: '8px', 
    backgroundColor: '#fdfdfd',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
  },
  
  // ★ 上部を横幅いっぱいの画像エリアにする
  dictImage: { 
    width: '100%', 
    height: '160px', // ここで画像の表示高さを調整（お好みで変更してください）
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#f0f0f0', 
    borderBottom: '1px solid #e0e0e0'
  },
  
  // ★ 下部のテキストエリアの余白を調整
  dictInfo: { 
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1
  },
  dictFlavor: { fontSize: '12px', color: '#666', margin: '0 0 10px 0', lineHeight: '1.4', whiteSpace: 'pre-wrap' },
  dictPrice: { fontSize: '13px', fontWeight: 'bold', color: '#2e7d32', margin: 'auto 0 0 0' }, // 一番下に固定

  // ★ ゲーム風通知ログ用スタイル
  logContainer: { position: 'fixed', bottom: '20px', right: '20px', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 1000, pointerEvents: 'none' },
  logToast: { color: '#fff', padding: '12px 20px', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', maxWidth: '350px', animation: 'fadeInUp 0.3s ease' },

  // ★ ゲーム風確認ダイアログ用スタイル
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 },
  modalBox: { backgroundColor: '#fff', padding: '25px', borderRadius: '8px', width: '400px', maxWidth: '90%', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', border: '3px solid #ff9800', textAlign: 'center' },
  modalActions: { display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '20px' },
  modalButton: { padding: '10px 20px', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }
};
