import vowels from "../data/vowels.json";
import words from "../data/words.json";
import type { VowelItem, PictureAudioItem } from "./types";

function warn(msg: string): void {
  // eslint-disable-next-line no-console
  console.warn(`[validateData] ${msg}`);
}

export function validateData(): void {
  try {
    const v = vowels as VowelItem[];
    v.forEach((item, idx) => {
      if (!item.id || !item.sound || !Array.isArray(item.choices)) {
        warn(`vowels[${idx}] 필드 누락`);
      }
      if (!item.choices.includes(item.sound)) {
        warn(`vowels[${idx}] choices에 sound가 포함되지 않음`);
      }
    });
  } catch (e) {
    warn(`vowels.json 파싱 오류: ${(e as Error).message}`);
  }

  try {
    const w = words as PictureAudioItem[];
    w.forEach((item, idx) => {
      if (!item.id || !item.audioText || !Array.isArray(item.options)) {
        warn(`words[${idx}] 필드 누락`);
      }
      const correctCount = item.options.filter((o) => o.correct).length;
      if (correctCount !== 1) {
        warn(`words[${idx}] 정답 갯수가 1이 아님: ${correctCount}`);
      }
      item.options.forEach((o, oi) => {
        if (!o.img) warn(`words[${idx}].options[${oi}] img 누락`);
      });
    });
  } catch (e) {
    warn(`words.json 파싱 오류: ${(e as Error).message}`);
  }
}


