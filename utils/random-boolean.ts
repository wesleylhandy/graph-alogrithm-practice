/**
 * Generates a random boolean value.
 * Skew parameter encourages generation towards true (`0 < skew < 0.25`) or false (`0 > skew < -0.25`).
 * Default `skew` is `0.0`.
 */
export function randomBoolean(skew: number = 0.0): boolean {
    const fractionToSkew = skew < 0 ? Math.max(-0.249, skew) : Math.min(0.249, skew);
    return Boolean(Math.round(Math.random() + fractionToSkew));
}