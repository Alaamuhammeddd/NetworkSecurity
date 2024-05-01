import CryptoJS from "crypto-js";

const key = CryptoJS.enc.Hex.parse(
  "2425345aef1e328f430274826ad110b37c721ac348320f2f"
);

export function encrypt(data, key) {
  try {
    const ciphertext = CryptoJS.TripleDES.encrypt(data, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return ciphertext.toString();
  } catch (error) {
    console.error(error);
  }
}

export function decrypt(encryptedData, key) {
  try {
    const decrypted = CryptoJS.TripleDES.decrypt(encryptedData, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }).toString(CryptoJS.enc.Utf8);
    return decrypted;
  } catch (error) {
    console.error(error);
  }
}
