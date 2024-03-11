export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const hexToUint8Array = (hex: string) => {
    const cleaned = hex.startsWith("0x") ? hex.substring(2) : hex;
    const decoded = cleaned.match(/../g)?.flatMap((h: string) => parseInt(h, 16));
    return Uint8Array.from(decoded ?? []);
};

export const randomBetween = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export const formatAddress = (address: string, characters = 6) => {
    return address.substring(0, characters + 2) + '..' + address.substring(address.length - characters, address.length);
}
