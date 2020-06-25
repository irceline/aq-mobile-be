export function createCacheKey(
    url: string,
    params: string,
    timestamp?: string | Date
) {
    let timestring = '';
    if (timestamp) { timestring = timestamp instanceof Date ? timestamp.toISOString() : timestamp; }
    return `${url}_${params}${timestring}`;
}
