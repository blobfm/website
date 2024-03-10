export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const hexToUint8Array = (hex: string) => {
    const cleaned = hex.startsWith("0x") ? hex.substring(2) : hex;
    const decoded = cleaned
        .match(/../g)
        ?.flatMap((h: string, i: number) => parseInt(h, 16));

    return Uint8Array.from(decoded ?? []);
};
