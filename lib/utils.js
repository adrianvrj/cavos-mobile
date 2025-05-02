import CryptoJS from "react-native-crypto-js";
import { SECRET_TOKEN, wallet_provider_api, WALLET_PROVIDER_TOKEN } from "./constants";
import axios from 'axios';

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

export const getWalletBalance = async (address) => {
    try {
        const response = await axios.post(
            wallet_provider_api + "/balance",
            { address: address },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${WALLET_PROVIDER_TOKEN}`,
                },
            }
        );
        return response.data;
    } catch (err) {
        return -1;
    }
}