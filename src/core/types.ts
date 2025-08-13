// 타입 정의: 학습 데이터 스키마

export type VowelItem = {
  id: string;
  sound: "ㅏ" | "ㅓ" | "ㅗ" | "ㅜ" | "ㅡ" | "ㅣ";
  choices: string[];
  hintImage?: string;
};

export type PictureAudioItem = {
  id: string;
  audioText: string;
  options: { img: string; correct: boolean }[];
};

export type LetterRevealItem = {
  id: string;
  sound: string;
  svg?: string;
};

export type MergeBlocksItem = {
  id: string;
  onset: string;
  nucleus: string;
};


