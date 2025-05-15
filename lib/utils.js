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

export function encryptSecretWithPin(pin, secretHex) {
    const cleanHex = secretHex.startsWith("0x") ? secretHex.slice(2) : secretHex;
    const encrypted = CryptoJS.AES.encrypt(cleanHex, pin).toString();
    return encrypted;
}

export function decryptSecretWithPin(encryptedSecret, pin) {
    const decrypted = CryptoJS.AES.decrypt(encryptedSecret, pin);
    const hex = decrypted.toString(CryptoJS.enc.Utf8);
    return "0x" + hex;
}

export const getWalletBalance = async (address) => {
    try {
        const response = await axios.post(
            wallet_provider_api + "wallet/balance",
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

export const getUsdcPrice = async () => {
    try {
        const url = `https://api.dev.pragma.build/node/v1/data/usdc/usd`;
        const response = await axios.get(url, {
            headers: {
                'x-api-key': process.env.EXPO_PUBLIC_PRAGMA_API_KEY,
                Accept: 'application/json',
            },
        });
        return (
            {
                data:
                    Number(BigInt(response.data.price)) /
                    10 ** response.data.decimals,
            }
        );
    } catch (error) {
        console.error('Error in pragma API:', error.message);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export const getBTCPrice = async () => {
    try {
        const url = `https://api.dev.pragma.build/node/v1/data/wbtc/usd`;
        const response = await axios.get(url, {
            headers: {
                'x-api-key': process.env.EXPO_PUBLIC_PRAGMA_API_KEY,
                Accept: 'application/json',
            },
        });
        return (
            {
                data:
                    Number(BigInt(response.data.price)) /
                    10 ** response.data.decimals,
            }
        );
    } catch (error) {
        console.error('Error in pragma API:', error.message);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}