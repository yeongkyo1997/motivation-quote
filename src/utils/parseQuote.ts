export interface ParsedQuote {
  text: string;
  author: string | null;
}

export function parseQuote(quote: string): ParsedQuote {
  const trimmedQuote = quote.trim();
  
  const dashMatch = trimmedQuote.match(/^"?(.+?)"?\s*[-–—]\s*(.+)$/);
  if (dashMatch) {
    return {
      text: dashMatch[1].replace(/^[""]|[""]$/g, '').trim(),
      author: dashMatch[2].trim()
    };
  }
  
  const byMatch = trimmedQuote.match(/^"?(.+?)"?\s+by\s+(.+)$/i);
  if (byMatch) {
    return {
      text: byMatch[1].replace(/^[""]|[""]$/g, '').trim(),
      author: byMatch[2].trim()
    };
  }
  
  return {
    text: trimmedQuote.replace(/^[""]|[""]$/g, '').trim(),
    author: null
  };
}