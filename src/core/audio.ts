// Web Speech API 기반 speak 유틸 (ko 우선)

let audioUnlocked = false;

export function unlockAudio(): void {
  audioUnlocked = true;
}

export async function speak(text: string): Promise<void> {
  if (!audioUnlocked) {
    return; // iOS 등 첫 제스처 전에는 무음
  }
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  const synth = window.speechSynthesis;

  // 보이스 로드 대기 (브라우저별 지연 대응)
  const ensureVoices = (): Promise<SpeechSynthesisVoice[]> => {
    const existing = synth.getVoices();
    if (existing && existing.length > 0) return Promise.resolve(existing);
    return new Promise((resolve) => {
      const handler = () => {
        resolve(synth.getVoices());
        synth.removeEventListener("voiceschanged", handler as any);
      };
      synth.addEventListener("voiceschanged", handler as any);
    });
  };

  const voices = await ensureVoices();
  const ko = voices.find((v) => v.lang?.toLowerCase().startsWith("ko"));

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = ko?.lang ?? "ko-KR";
  utter.voice = ko ?? null;
  utter.rate = 0.9;
  utter.pitch = 1.0;

  return new Promise((resolve) => {
    utter.onend = () => resolve();
    synth.cancel();
    synth.speak(utter);
  });
}


