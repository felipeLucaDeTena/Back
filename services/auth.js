import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

/**
 * @description Función que devuelve un JWS Token
 * @param {string} user
 * @returns {string} token
 * @author Alejandro Cerezo Lasne
 */
export function createToken(user) {
  const tokenPayload = {
    name: user.name,
    id: user.id,
  };
  const secret = secret;
  return jwt.sign(tokenPayload, secret);
}

/**
 *
 * @param {string} token
 * @returns
 */
export function verifyToken(token) {
  const secret = secret;
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return error.message;
  }
}
