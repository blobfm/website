import { hexToUint8Array } from "./utils";

export const toVersionedHash = async (commitment: string) => {
    // Hex to buffer
    const buffer = hexToUint8Array(commitment);

    // Hash
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);

    // Buffer to hex
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
        .map((bytes) => bytes.toString(16).padStart(2, "0"))
        .join("");

    // Return KZG version + hash without first byte
    return "0x01" + hashHex.substring(2);
};