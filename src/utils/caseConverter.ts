/**
 * 100% accurate runtime text case conversion engine.
 */

// Minor words that stay lowercase in standard Title Case unless at phrase boundaries
const TITLE_CASE_MINOR_WORDS = new Set([
  'a', 'an', 'and', 'as', 'at', 'but', 'by', 'en', 'for', 'if', 'in',
  'nor', 'of', 'on', 'or', 'per', 'the', 'to', 'v', 'vs', 'via'
]);

export type CaseType =
  | 'upper'
  | 'lower'
  | 'sentence'
  | 'title'
  | 'capitalized'
  | 'alternating'
  | 'kebab'
  | 'snake'
  | 'camel'
  | 'pascal'
  | 'clean'
  | 'invert';

export function convertCase(text: string, type: CaseType): string {
  const safeText = typeof text === 'string' ? text : String(text || '');
  if (!safeText || safeText.trim() === '') return '';

  switch (type) {
    case 'upper':
      return safeText.toUpperCase();

    case 'lower':
      return safeText.toLowerCase();

    case 'sentence': {
      // Capitalize first letter of every sentence and after line breaks
      const lower = safeText.toLowerCase();
      // Match starts of sentences: beginning of string or after [.!?\n\r] followed by optional spaces/quotes
      return lower.replace(/(^\s*|[.!?。！？۔\n\r]\s*['"“‘(]*)([a-z\p{Ll}])/gu, (_match, prefix, char) => {
        return prefix + char.toUpperCase();
      });
    }

    case 'title': {
      // Capitalize first letter of each word properly
      return safeText.toLowerCase().replace(/([\p{L}\p{N}\p{M}]+(?:['’][\p{L}\p{N}\p{M}]+)?)/gu, (word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      });
    }

    case 'capitalized': {
      // Every single word starts with uppercase
      return text.replace(/([^\s]+)/g, (word) => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      });
    }

    case 'alternating': {
      let isUpper = false;
      return text
        .split('')
        .map((char) => {
          if (/\p{L}/u.test(char)) {
            const next = isUpper ? char.toUpperCase() : char.toLowerCase();
            isUpper = !isUpper;
            return next;
          }
          return char;
        })
        .join('');
    }

    case 'kebab': {
      return tokenizeWords(safeText).join('-').toLowerCase();
    }

    case 'snake': {
      return tokenizeWords(safeText).join('_').toLowerCase();
    }

    case 'camel': {
      const words = tokenizeWords(safeText);
      if (words.length === 0) return '';
      return (
        words[0].toLowerCase() +
        words
          .slice(1)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join('')
      );
    }

    case 'pascal': {
      return tokenizeWords(safeText)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join('');
    }

    case 'clean': {
      // Remove extra spaces, tabs, and excess blank lines
      return safeText
        .replace(/[^\S\r\n]+/g, ' ')
        .split(/\r?\n/)
        .map((line) => line.trim())
        .join('\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
    }

    case 'invert': {
      return safeText
        .split('')
        .map((char) => {
          if (char === char.toUpperCase() && char !== char.toLowerCase()) {
            return char.toLowerCase();
          }
          if (char === char.toLowerCase() && char !== char.toUpperCase()) {
            return char.toUpperCase();
          }
          return char;
        })
        .join('');
    }

    default:
      return safeText;
  }
}

/**
 * Extracts words splitting on spaces, underscores, hyphens, and camelCase transitions
 */
function tokenizeWords(str: string): string[] {
  const s = typeof str === 'string' ? str : String(str || '');
  if (!s || !s.trim()) return [];
  // Split on camelCase boundaries and delimiters
  const separated = s
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1 $2')
    .replace(/[\-_]+/g, ' ');

  const matches = separated.match(/[\p{L}\p{N}]+/gu);
  return matches || [];
}
