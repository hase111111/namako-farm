// src/types/game.ts

export type NamakoStatus = 'BEFORE' | 'GROWING' | 'COMPLETED';

export interface NamakoSpecies {
  id: number;
  name: string;
  flavorText: string;
  price: number;
  image: string;
}

export interface NamakoSlot {
  id: number;
  status: NamakoStatus;
  remainingTime: number;
  speciesId: number | null;
  seedId: number | null; // ★ 追加：どの種苗を植えたかを記録
}

export interface SeedPattern {
  id: number;
  name: string;
  cost: number;
  growTime: number;
  // ★ 追加：出現するナマコの「品種ID」と「重み(int)」のペア
  // 例: { 1: 70, 2: 25, 3: 5 } -> ID1が70%, ID2が25%, ID3が5%の割合
  weights: { [speciesId: number]: number }; 
}

export interface BaitPattern {
  id: number;
  name: string;
  cost: number;
  reductionTime: number;
}
