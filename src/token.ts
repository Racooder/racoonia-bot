import { customAlphabet } from "nanoid";

const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
export const generateToken = customAlphabet(alphabet, 7); // 16 chars = ~83 bits entropy
