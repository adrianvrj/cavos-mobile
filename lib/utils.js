import CryptoJS from "react-native-crypto-js";
import { SECRET_TOKEN } from "./constants";

export function encryptPin(pin) {
    return CryptoJS.AES.encrypt(pin, SECRET_TOKEN).toString();
}

export function decryptPin(encryptedPin) {
    const bytes = CryptoJS.AES.decrypt(encryptedPin, SECRET_TOKEN);
    return bytes.toString(CryptoJS.enc.Utf8);
}

export function decryptSecretWithPin(encryptedSecret, pin) {
    const decrypted = CryptoJS.AES.decrypt(encryptedSecret, pin);
    const hex = decrypted.toString(CryptoJS.enc.Utf8);
    return "0x" + hex;
}
