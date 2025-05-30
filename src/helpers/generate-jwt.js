import jwt from 'jsonwebtoken';

/**
 * Genera un JWT con UID y rol
 * @param {string} uid - ID del usuario
 * @param {string} role - Rol del usuario (ej: 'admin', 'user')
 * @returns {Promise<string>} Token firmado
 */
export const generarJWT = (uid = '', role = '') => {
  return new Promise((resolve, reject) => {
    const payload = { uid, role };

    jwt.sign(
      payload,
      process.env.SECRETORPRIVATEKEY,
      {
        expiresIn: '1h'
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject('No se pudo generar el token');
        } else {
          resolve(token);
        }
      }
    );
  });
};
