/**
 * High-accuracy multi-lingual text analytics engine.
 * Supports Latin, Cyrillic, CJK (Chinese, Japanese, Korean),
 * Arabic, Urdu, Hindi (Devanagari), and other international scripts.
 */

export interface TextMetrics {
  charactersWithSpaces: number;
  charactersWithoutSpaces: number;
  words: number;
  sentences: number;
  lines: number;
  paragraphs: number;
  readingTimeSeconds: number;
  speakingTimeSeconds: number;
  readingGradeLevel: string;
  topKeywords: { word: string; count: number; percentage: number }[];
}

export function analyzeText(text: string): TextMetrics {
  const safeText = typeof text === 'string' ? text : String(text || '');
  const charactersWithSpaces = safeText.length;
  // Characters without any whitespace
  const charactersWithoutSpaces = safeText.replace(/\s+/g, '').length;

  // Lines
  const lines = safeText === '' ? 0 : safeText.split(/\r\n|\r|\n/).length;

  // Paragraphs (blocks separated by blank lines)
  const rawParagraphs = safeText.split(/\n\s*\n/).filter((p) => typeof p === 'string' && p.trim().length > 0);
  const paragraphs = safeText.trim() === '' ? 0 : Math.max(1, rawParagraphs.length);

  // Accurate Word Count supporting Multi-byte & Non-Latin scripts
  let words = 0;
  const wordTokens: string[] = [];

  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    try {
      const segmenter = new (Intl as unknown as { Segmenter: new (locales?: string, options?: { granularity: string }) => { segment: (text: string) => Iterable<{ segment: string; isWordLike: boolean }> } }).Segmenter(undefined, { granularity: 'word' });
      const segments = segmenter.segment(safeText);
      for (const segment of segments) {
        if (segment.isWordLike) {
          words++;
          const cleanWord = segment.segment.trim().toLowerCase();
          if (cleanWord.length > 1) {
            wordTokens.push(cleanWord);
          }
        }
      }
    } catch {
      words = fallbackWordCount(safeText, wordTokens);
    }
  } else {
    words = fallbackWordCount(safeText, wordTokens);
  }

  // Sentences count
  // Accounts for Western (. ! ?), CJK (。 ！ ？), Arabic (۔), and line endings
  let sentences = 0;
  if (safeText.trim() !== '') {
    const sentenceMatches = safeText.match(/[^.!?。！？۔\n\r]+[.!?。！？۔]+|[^.!?。！？۔\n\r]+$/g);
    if (sentenceMatches) {
      sentences = sentenceMatches.filter((s) => typeof s === 'string' && s.trim().length > 0).length;
    } else {
      sentences = 1;
    }
  }

  // Reading & Speaking times
  // Standard reading rate: ~225 words per minute (3.75 words/sec)
  // Standard speaking rate: ~130 words per minute (2.17 words/sec)
  const readingTimeSeconds = words > 0 ? Math.ceil((words / 225) * 60) : 0;
  const speakingTimeSeconds = words > 0 ? Math.ceil((words / 130) * 60) : 0;

  // Readability estimate (Automated Readability Index approximation)
  let readingGradeLevel = 'Elementary';
  if (words > 5 && sentences > 0) {
    const letters = charactersWithoutSpaces;
    const ari = 4.71 * (letters / words) + 0.5 * (words / sentences) - 21.43;
    if (ari <= 6) {
      readingGradeLevel = 'Elementary (5th Grade)';
    } else if (ari <= 8) {
      readingGradeLevel = 'Middle School (7th–8th Grade)';
    } else if (ari <= 12) {
      readingGradeLevel = 'High School (9th–12th Grade)';
    } else if (ari <= 16) {
      readingGradeLevel = 'College Level';
    } else {
      readingGradeLevel = 'Graduate / Professional';
    }
  } else if (words === 0) {
    readingGradeLevel = '–';
  }

  // Keyword Density (Top 5 words)
  const frequencyMap = new Map<string, number>();
  const commonStopwords = new Set([
    'the', 'and', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'is', 'it', 'this',
    'that', 'as', 'are', 'was', 'be', 'or', 'by', 'from', 'we', 'you', 'i', 'our', 'my', 'your',
    'so', 'if', 'not', 'but', 'all', 'can', 'has', 'have', 'had', 'do', 'does', 'did'
  ]);

  for (const token of wordTokens) {
    if (!commonStopwords.has(token) && token.length > 2) {
      frequencyMap.set(token, (frequencyMap.get(token) || 0) + 1);
    }
  }

  const sortedKeywords = Array.from(frequencyMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word, count]) => ({
      word,
      count,
      percentage: words > 0 ? Math.round((count / words) * 100) : 0
    }));

  return {
    charactersWithSpaces,
    charactersWithoutSpaces,
    words,
    sentences,
    lines,
    paragraphs,
    readingTimeSeconds,
    speakingTimeSeconds,
    readingGradeLevel,
    topKeywords: sortedKeywords
  };
}

function fallbackWordCount(text: string, tokenSink: string[]): number {
  if (!text || text.trim() === '') return 0;
  // Unicode-aware word regex matching any script (Latin, Greek, Cyrillic, Han, Hiragana, Arabic, Devanagari)
  const matches = text.match(/[\p{L}\p{N}\p{M}]+/gu);
  if (!matches) return 0;
  for (const match of matches) {
    if (match.length > 1) {
      tokenSink.push(match.toLowerCase());
    }
  }
  return matches.length;
}

export function formatDuration(seconds: number): string {
  if (seconds < 1) return '< 1 sec';
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (secs === 0) return `${mins}m`;
  return `${mins}m ${secs}s`;
}

export interface WordLengthItem {
  name: string;
  letters: number;
  count: number;
  percentage: number;
}

export function computeWordLengthDistribution(text: string): {
  data: WordLengthItem[];
  averageLength: number;
  totalWords: number;
  mostCommonLength: string;
} {
  const safeText = typeof text === 'string' ? text : String(text || '');
  if (!safeText || safeText.trim() === '') {
    return { data: [], averageLength: 0, totalWords: 0, mostCommonLength: '–' };
  }

  const wordsList: string[] = [];
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    try {
      const segmenter = new (Intl as unknown as { Segmenter: new (locales?: string, options?: { granularity: string }) => { segment: (t: string) => Iterable<{ segment: string; isWordLike: boolean }> } }).Segmenter(undefined, { granularity: 'word' });
      for (const seg of segmenter.segment(safeText)) {
        if (seg.isWordLike) {
          wordsList.push(seg.segment);
        }
      }
    } catch {
      const matches = safeText.match(/[\p{L}\p{N}\p{M}]+/gu) || [];
      wordsList.push(...matches);
    }
  } else {
    const matches = safeText.match(/[\p{L}\p{N}\p{M}]+/gu) || [];
    wordsList.push(...matches);
  }

  if (wordsList.length === 0) {
    return { data: [], averageLength: 0, totalWords: 0, mostCommonLength: '–' };
  }

  const lengthCounts = new Map<number, number>();
  let totalLetters = 0;

  for (const word of wordsList) {
    const len = [...word].length;
    totalLetters += len;
    lengthCounts.set(len, (lengthCounts.get(len) || 0) + 1);
  }

  const maxLenFound = Math.min(12, Math.max(...Array.from(lengthCounts.keys())));
  const maxDisplayLen = Math.max(8, maxLenFound);

  const data: WordLengthItem[] = [];
  let maxCount = 0;
  let modeName = '';

  for (let i = 1; i <= maxDisplayLen; i++) {
    const count = lengthCounts.get(i) || 0;
    const pct = Math.round((count / wordsList.length) * 100);
    const label = i === 1 ? '1 char' : `${i} chars`;
    data.push({
      name: label,
      letters: i,
      count,
      percentage: pct
    });

    if (count > maxCount) {
      maxCount = count;
      modeName = label;
    }
  }

  // Also check 13+ or overflow if exists
  let overflowCount = 0;
  for (const [len, count] of lengthCounts.entries()) {
    if (len > maxDisplayLen) {
      overflowCount += count;
    }
  }
  if (overflowCount > 0) {
    const pct = Math.round((overflowCount / wordsList.length) * 100);
    const label = `${maxDisplayLen + 1}+ chars`;
    data.push({
      name: label,
      letters: maxDisplayLen + 1,
      count: overflowCount,
      percentage: pct
    });
    if (overflowCount > maxCount) {
      modeName = label;
    }
  }

  const avg = Number((totalLetters / wordsList.length).toFixed(1));

  return {
    data,
    averageLength: avg,
    totalWords: wordsList.length,
    mostCommonLength: modeName || '–'
  };
}

export interface CharFrequencyItem {
  char: string;
  display: string;
  count: number;
  percentage: number;
}

export function computeCharacterFrequency(text: string): {
  topCharacters: CharFrequencyItem[];
  totalChars: number;
  vowelsCount: number;
  consonantsCount: number;
  digitsCount: number;
} {
  const safeText = typeof text === 'string' ? text : String(text || '');
  if (!safeText || safeText.trim() === '') {
    return { topCharacters: [], totalChars: 0, vowelsCount: 0, consonantsCount: 0, digitsCount: 0 };
  }

  const map = new Map<string, number>();
  let totalAnalyzed = 0;
  let vowels = 0;
  let consonants = 0;
  let digits = 0;

  const vowelsSet = new Set(['a', 'e', 'i', 'o', 'u', 'y']);

  // Extract characters (letters, digits, accented characters)
  for (const rawChar of safeText) {
    if (/\s/u.test(rawChar)) continue;
    const lower = rawChar.toLowerCase();

    if (/\p{L}/u.test(lower)) {
      totalAnalyzed++;
      map.set(lower, (map.get(lower) || 0) + 1);
      if (vowelsSet.has(lower)) {
        vowels++;
      } else {
        consonants++;
      }
    } else if (/\p{N}/u.test(lower)) {
      totalAnalyzed++;
      digits++;
      map.set(lower, (map.get(lower) || 0) + 1);
    }
  }

  if (totalAnalyzed === 0) {
    return { topCharacters: [], totalChars: 0, vowelsCount: 0, consonantsCount: 0, digitsCount: 0 };
  }

  const sorted = Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 16)
    .map(([char, count]) => ({
      char,
      display: char.toUpperCase(),
      count,
      percentage: Math.round((count / totalAnalyzed) * 100)
    }));

  return {
    topCharacters: sorted,
    totalChars: totalAnalyzed,
    vowelsCount: vowels,
    consonantsCount: consonants,
    digitsCount: digits
  };
}
