// src/constants/gameData.ts
import type { NamakoSpecies, SeedPattern, BaitPattern } from '../types/game';

// ナマコ図鑑のマスターデータ（K個）
export interface DictionaryItem extends NamakoSpecies {}

export const NAMAKO_DICTIONARY: DictionaryItem[] = [
  {
    id: 1,
    name: 'ナマコ',
    flavorText: '普通のナマコ。\n海の掃除屋として活躍している。\n外敵に襲われると体内の臓器を吐き出して囮にする防御行動をとることがある。',
    price: 1,
    image: '/images/namako/namako01.png',
  },
  {
    id: 2,
    name: 'シロナマコ',
    flavorText: '真っ白なナマコ。\nその目は何かをやり遂げた後のように穏やかである。\n燃え尽きたぜ...真っ白なナマコにな...',
    price: 10,
    image: '/images/namako/namako02.png',
  },
  {
    id: 3,
    name: '怒りのナマコ',
    flavorText: '怒りで真っ赤になったナマコ。\n何に対して怒っていたのかは忘れてしまったが、ひっこみがつかなくなっちゃったようだ。',
    price: 50,
    image: '/images/namako/namako03.png',
  },
  {
    id: 4,
    name: 'トゲナマコ',
    flavorText: 'とげとげしい見た目のナマコ。\n見た目と裏腹に、性格はおとなしい。',
    price: 500,
    image: '/images/namako/namako04.png',
  },
  {
    id: 5,
    name: 'ロイコクロリディウム',
    flavorText: '眼球に寄生する寄生虫。目から生えている突起は寄生虫の卵の塊で、不気味に蠕動（ぜんどう）する。\nカタツムリと間違えてナマコに寄生してしまったため、ナマコの目から生えてみた。',
    price: 1000,
    image: '/images/namako/namako05.png',
  },
  {
    id: 6,
    name: '二日酔いナマコ',
    flavorText: '調子に乗って飲みすぎてしまったナマコ。\n内臓を全て吐き出したが、まだ気持ち悪い。\n今日はスポドリを飲んで寝るしかないのだ。',
    price: 1500,
    image: '/images/namako/namako06.png',
  },
  {
    id: 7,
    name: 'はだかのナマコ',
    flavorText: '体表にトゲがなく、つるつるしたナマコ。\n\nなんか...恥ずかしいっすね///。',
    price: 1841,
    image: '/images/namako/namako07.png',
  },
  {
    id: 8,
    name: 'ナマコの集合体',
    flavorText: '複数のナマコが融合したナマコ。\n内部で統率がとれていないため、徐々に崩壊していく運命にある。',
    price: 5000,
    image: '/images/namako/namako08.png',
  },
  {
    id: 9,
    name: 'ウミウシ',
    flavorText: '可愛らしい模様をもつ軟体動物。\nナマコになんとなく似ているが、ナマコは棘皮動物であり別種である。',
    price: 6000,
    image: '/images/namako/namako09.png',
  },
  {
    id: 10,
    name: 'あしナマコ',
    flavorText: '己の限界を突破し、足を生やしたナマコ。\n生やしてみたのはいいものの使い方が分からないので、いつもどおり体をくねくねさせて移動している。',
    price: 7500,
    image: '/images/namako/namako10.png',
  },
  {
    id: 11,
    name: 'ナマコモップ',
    flavorText: '言葉通り海の掃除屋として活躍するナマコ。\nちりとり役を探しているが、なかなか見つからない。',
    price: 8888,
    image: '/images/namako/namako11.png',
  },
  {
    id: 12,
    name: 'ナマコもどき',
    flavorText: 'ナマコみたいな模様の石を担ぐゴカイ。\n周囲からはナマコだと思われているが、もはやゴカイを解く気はない。',
    price: 30000,
    image: '/images/namako/namako12.png',
  },
  {
    id: 13,
    name: 'メタルナマコ',
    flavorText: '金属製のナマコ。\nステンレスを買う金をケチって鉄で作ったため、錆始めている。',
    price: 1,
    image: '/images/namako/namako13.png',
  },
  {
    id: 14,
    name: 'サツマイモ',
    flavorText: 'ホクホクで甘いサツマイモ。\n冬になると食べたくなるニクイやつ。',
    price: 5,
    image: '/images/namako/namako14.png',
  },
  {
    id: 15,
    name: '紙ナマコ',
    flavorText: '最近は電子タバコに立場を奪われつつあるナマコ。\n天敵から逃げるため内臓を吐きだした時に、自分の肺の汚さに驚いたが、いまだに禁煙はできていない。',
    price: 10,
    image: '/images/namako/namako15.png',
  },
  {
    id: 16,
    name: 'イルミナマコティ',
    flavorText: '世界は陰謀と裏切りに満ちている。\nWikipediaを読んで世界の真実に気づいたナマコ。\n大きな眼を持っているが、視野が狭いタイプ。',
    price: 1,
    image: '/images/namako/namako16.png',
  },
  {
    id: 17,
    name: 'さかさまナマコ',
    flavorText: 'コマナるいてっなにまさかさ\nねだりくっそにえまお るいてしろごろご てみをほます につじうゅき',
    price: 5,
    image: '/images/namako/namako17.png',
  },
  {
    id: 18,
    name: 'ナマコバケーション',
    flavorText: 'ハワイでバカンスを楽しむナマコ。\n\n当然パスポートは持っていない。',
    price: 10,
    image: '/images/namako/namako18.png',
  },
    {
    id: 19,
    name: '黄金ナマコ',
    flavorText: '金色に輝くナマコ。\n非常に希少で価値が高い。',
    price: 5,
    image: '/images/namako/namako19.png',
  },
  {
    id: 20,
    name: 'ナマコ（本物）',
    flavorText: '棘皮動物門ナマコ綱に属する海産無脊椎動物。\n世界に約1500種、日本には約200種が生息している。\n食用としても利用される。',
    price: 10,
    image: '/images/namako/namako20.png',
  },
];

// 種苗ボタンの設定（N個）
export const SEED_PATTERNS: SeedPattern[] = [
  { 
    id: 1, 
    name: '無料の種苗', 
    cost: 0, 
    growTime: 10,
    // growTime: 1,
    weights: { 1: 60, 2: 25, 3: 15, 4: 2 } // Ave 270 +
  },
  { 
    id: 2, 
    name: '普通の種苗', 
    cost: 200, 
    growTime: 60,
    // cost: 0, 
    // growTime: 1,
    weights: { 1: 50, 2: 1, 3: 1, 4: 30, 
               5: 20, 6: 10, 7: 5, 8: 5 }  // Ave 7000 +
  },
  { 
    id: 3, 
    name: 'すごい種苗', 
    cost: 1000, 
    growTime: 300,
    // cost: 0, 
    // growTime: 1,
    weights: { 1: 30, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 3, 
      8: 17, 
      9: 25, 10: 15, 11: 10, 12: 2,}
  }
];

// エサボタンの設定（M個）
export const BAIT_PATTERNS: BaitPattern[] = [
  { id: 1, name: 'ワカメ', cost: 90, reductionTime: 7 },
  { id: 2, name: 'プランクトン', cost: 1000, reductionTime: 100 }
];

// 養殖スロットの最大数（仕様書より30匹）
export const MAX_SLOTS = 20;
