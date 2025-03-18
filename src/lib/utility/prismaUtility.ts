export function parsePrismaJson<T>(json: string | T | null | undefined): T | null {
    if (!json) return null;
    return typeof json === 'string' ? JSON.parse(json) : json;
}