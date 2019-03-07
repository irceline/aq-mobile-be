export function createCacheKey(
    url: string,
    params: any,
    timestamp?: string | Date
) {
    let timestring = '';
    if (timestamp) { timestring = timestamp instanceof Date ? timestamp.toISOString() : timestamp; }
    return `${url}_${JSON.stringify(params)}${timestring}`;
}
