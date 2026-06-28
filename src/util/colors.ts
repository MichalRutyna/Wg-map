export function lighten(color: number, factor = 0.3) {
    const r = ((color >> 16) & 0xff);
    const g = ((color >> 8) & 0xff);
    const b = (color & 0xff);

    const nr = Math.min(255, r + 255 * factor);
    const ng = Math.min(255, g + 255 * factor);
    const nb = Math.min(255, b + 255 * factor);

    return (nr << 16) | (ng << 8) | nb;
}