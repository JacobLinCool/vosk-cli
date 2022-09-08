export function semantic_size(size: number, fixed = 1): string {
    const prefix = ["B", "K", "M", "G"];

    let idx = 0;
    while (size >= 1024 && idx < prefix.length) {
        idx++;
        size /= 1024;
    }

    return `${size.toFixed(fixed)}${prefix[idx]}`;
}
