// localStorage 래퍼: 네임스페이스 "hf/"

const NAMESPACE = "hf/" as const;

function toKey(key: string): string {
  return `${NAMESPACE}${key}`;
}

export function getItem<T>(key: string, fallback?: T): T | null {
  try {
    const raw = localStorage.getItem(toKey(key));
    if (raw == null) return fallback ?? null;
    return JSON.parse(raw) as T;
  } catch {
    return fallback ?? null;
  }
}

export function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(toKey(key), JSON.stringify(value));
  } catch {
    // 저장 실패는 조용히 무시
  }
}

export function removeItem(key: string): void {
  try {
    localStorage.removeItem(toKey(key));
  } catch {
    // 제거 실패는 조용히 무시
  }
}

export function mergeItem<T extends Record<string, unknown>>(key: string, partial: Partial<T>): T {
  const current = (getItem<T>(key) ?? ({} as T));
  const merged = { ...(current as object), ...(partial as object) } as T;
  setItem<T>(key, merged);
  return merged;
}


