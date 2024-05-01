const CryptoJS = require("crypto-js");
const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex");

function encrypt(plaintext, key) {
  const ciphertext = CryptoJS.TripleDES.encrypt(plaintext, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return ciphertext.toString();
}

// Decryption function for 3DES algorithm
function decrypt(ciphertext, key) {
  const decrypted = CryptoJS.TripleDES.decrypt(ciphertext, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  }).toString(CryptoJS.enc.Utf8);
  return decrypted;
}

module.exports = {
  encrypt,
  decrypt,
};
