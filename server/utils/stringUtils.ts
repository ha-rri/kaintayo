/**
 * Creates a Regex string that matches text regardless of accents/diacritics.
 * Example: "cafe" -> "[cç][aàáâãäå]f[eéèêë]"
 *
 * @param text The search string to normalize
 * @returns A regex string with character classes for accents
 */
export const createAccentRegex = (text: string): string => {
  return text
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // Escape regex special chars
    .replace(/[aàáâãäå]/gi, "[aàáâãäå]")
    .replace(/[eéèêë]/gi, "[eéèêë]")
    .replace(/[iíìîï]/gi, "[iíìîï]")
    .replace(/[oòóôõö]/gi, "[oòóôõö]")
    .replace(/[uùúûü]/gi, "[uùúûü]")
    .replace(/[cç]/gi, "[cç]")
    .replace(/[nñ]/gi, "[nñ]");
};
