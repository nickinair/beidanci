// Phonetics service - fetches US IPA from free dictionary API with in-memory cache

const cache = new Map<string, string>();

export async function getPhonetic(word: string): Promise<string> {
    const key = word.toLowerCase();
    if (cache.has(key)) return cache.get(key)!;

    try {
        const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${key}`);
        if (!res.ok) { cache.set(key, ''); return ''; }

        const data = await res.json();
        // Prefer US phonetic, fall back to general phonetic
        let phonetic = '';
        if (Array.isArray(data) && data[0]) {
            // Look for US phonetics first
            const phonetics = data[0].phonetics || [];
            const usEntry = phonetics.find((p: any) => p.audio?.includes('-us') && p.text);
            if (usEntry) {
                phonetic = usEntry.text;
            } else {
                // Fall back to first available phonetic text
                phonetic = data[0].phonetic || phonetics.find((p: any) => p.text)?.text || '';
            }
        }

        cache.set(key, phonetic);
        return phonetic;
    } catch {
        cache.set(key, '');
        return '';
    }
}

// Pre-fetch phonetics for a batch of words (fire and forget)
export function prefetchPhonetics(words: string[]): void {
    words.forEach(w => getPhonetic(w));
}
