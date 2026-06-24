// src/constants/gameData.ts
import type { NamakoSpecies, SeedPattern, BaitPattern } from '../types/game';

// ナマコ図鑑のマスターデータ（K個）
export interface DictionaryItem extends NamakoSpecies {}

export const NAMAKO_DICTIONARY: DictionaryItem[] = [
  {
    id: 1,
    name: 'マナマコ（青）',
    flavorText: '一般的なナマコ。磯でよく見かける。コリコリしておいしい。',
    price: 100,
    image: '🟢' // ひとまず画像代わりに絵文字を使用
  },
  {
    id: 2,
    name: 'アカナマコ',
    flavorText: '少し高級なナマコ。深場に生息しており、青ナマコより柔らかい。',
    price: 300,
    image: '🔴'
  },
  {
    id: 3,
    name: 'キンコ（ゴールデン）',
    flavorText: '滅多に収穫できない黄金のナマコ。見つけると幸運が訪れるという。',
    price: 1500,
    image: '👑'
  }
];

// 種苗ボタンの設定（N個）
export const SEED_PATTERNS: SeedPattern[] = [
  { id: 1, name: '普通の種苗', cost: 20, growTime: 10 },    // テスト用に10秒
  { id: 2, name: '高級な種苗', cost: 100, growTime: 30 },   // テスト用に30秒
  { id: 3, name: '幻の種苗', cost: 500, growTime: 60 }      // テスト用に60秒
];

// エサボタンの設定（M個）
export const BAIT_PATTERNS: BaitPattern[] = [
  { id: 1, name: '普通のハコエサ', cost: 10, reductionTime: 3 }, // 3秒短縮
  { id: 2, name: '高級プランクトン', cost: 50, reductionTime: 10 } // 10秒短縮
];

// 養殖スロットの最大数（仕様書より30匹）
export const MAX_SLOTS = 30;
