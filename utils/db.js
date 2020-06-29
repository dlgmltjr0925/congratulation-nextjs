import { createToken, setSession } from './sessions';

import sqlite3 from 'sqlite3';

const db = new sqlite3.Database(
  './assets/databases/congratutations.db',
  (err) => {
    if (err) console.log('connect fail', err);
  }
);

export const getUserInfo = async ({ id, password }) => {
  return new Promise((resolve, reject) => {
    try {
      const sql = `SELECT * FROM user WHERE user_id='${id}' AND password='${password}'`;

      db.all(sql, (err, rows) => {
        if (err) reject(err);
        if (rows && rows[0]) {
          const token = createToken();
          setSession(token, {
            ...rows[0],
          });
          resolve(token);
        } else {
          resolve(null);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};
