export function clamp(value: number, min: number, max: number): number {
    if (max < min) throw new Error("'max' must be greater or equal to 'min'");
    return Math.min(Math.max(value, min), max);
}

export function wrap(value: number, min: number, max: number): number {
    const range = max - min;
    if (range <= 0) throw new Error("'max' must be greater than 'min'");

    const normalized = ((value - min) % range + range) % range;
    return normalized + min;
}

export function approximateEqual(a: number, b: number, epsilon: number): boolean {
    return Math.abs(a - b) < epsilon;
}
