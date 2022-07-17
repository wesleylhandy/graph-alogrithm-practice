export function isNumber(value?: number | null): value is number {
    return typeof value === 'number';
}