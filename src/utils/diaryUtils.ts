/**
 * 일기 관련 유틸리티 함수
 */

// 감정 인덱스(0-4)를 EmotionType enum으로 변환
export const emotionIndexToEnum = (index: number): string => {
  const mapping: Record<number, string> = {
    0: 'VERYHAPPY',  // 매우 좋음
    1: 'HAPPY',      // 좋음
    2: 'NEUTRAL',    // 보통
    3: 'SAD',        // 나쁨
    4: 'ANGRY',      // 매우 나쁨
  };
  return mapping[index] || 'NEUTRAL';
};

// EmotionType enum을 감정 인덱스(0-4)로 변환
export const emotionEnumToIndex = (emotion: string): number => {
  const mapping: Record<string, number> = {
    'VERYHAPPY': 0,
    'HAPPY': 1,
    'NEUTRAL': 2,
    'SAD': 3,
    'ANGRY': 4,
  };
  return mapping[emotion] ?? 2; // 기본값: 보통
};

