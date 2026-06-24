// src/types/game.ts

// 1. ナマコの状態を定義する型
export type NamakoStatus = 'BEFORE' | 'GROWING' | 'COMPLETED';
// BEFORE: 養殖前（空水槽）
// GROWING: 養殖中（幼体）
// COMPLETED: 養殖完了（成体）

// 2. ナマコの種類（図鑑マスターデータ用）の型
export interface NamakoSpecies {
  id: number;           // 品種ID (1: 普通のナマコ, 2: 高級ナマコ など)
  name: string;         // 名前
  flavorText: string;   // フレーバーテキスト
  price: number;        // 収穫時の獲得マニー
  image: string;        // 成体時の画像URL（ひとまずダミー文字列でOK）
}

// 3. 30個並ぶ「養殖スロット」1つ1つのデータを表す型
export interface NamakoSlot {
  id: number;               // スロットのインデックス (0 ~ 29)
  status: NamakoStatus;    // 現在の状態
  remainingTime: number;    // 養殖完了までの残り時間（秒）
  speciesId: number | null; // 完了時にどのナマコになったか（養殖前・中は null）
}

// 4. 種苗ボタン（N個）の性能を定義する型
export interface SeedPattern {
  id: number;       // 種苗の等級ID
  name: string;     // 「並の種苗」「高級な種苗」などの名前
  cost: number;     // 消費マニー
  growTime: number; // 完了までにかかる時間（秒）
}

// 5. エサボタン（M個）の性能を定義する型
export interface BaitPattern {
  id: number;
  name: string;
  cost: number;
  reductionTime: number; // 短縮できる時間（秒）
}
