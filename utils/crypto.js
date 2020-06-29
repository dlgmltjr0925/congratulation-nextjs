import Base64 from 'crypto-js/enc-base64';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import sha256 from 'crypto-js/sha256';

const nonce = 'congratulations';
const privateKey = 'congraturation-private-key';

export const getHashedPassword = (password) => {
  const hashDigest = sha256(nonce + password);
  const hmacDigest = Base64.stringify(hmacSHA512(hashDigest, privateKey));
  return hmacDigest;
};
