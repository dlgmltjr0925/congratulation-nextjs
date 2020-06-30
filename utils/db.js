import { createToken, setSession } from "./sessions";

import sqlite3 from "sqlite3";

const db = new sqlite3.Database(
  "./assets/databases/congratutations.db",
  (err) => {
    if (err) console.log("connect fail", err);
  }
);

export const getUserInfo = async ({ id, password }) => {
  return new Promise((resolve, reject) => {
    try {
      const sql = `SELECT * FROM user WHERE user_id='${id}' AND password='${password}'`;

      db.all(sql, (err, rows) => {
        if (err) reject(err);
        if (rows && rows[0]) {
          const token = createToken(rows[0]);
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

export const insertEvent = async ({ targetName, content }) => {
  return new Promise((resolve, reject) => {
    try {
      const now = new Date().valueOf();
      // const sql = `INSERT INTO event(target_name, content, created_at, updated_at) VALUES ('${targetName}', '${content}', ${now}, ${now})`;
      const insertSQL = `INSERT INTO event(target_name, content, created_at, updated_at) VALUES (?, ?, ?, ?)`;
      const selectSQL = `SELECT * FROM event WHERE target_name=? AND content=? ORDER BY id DESC LIMIT 1;`;

      db.serialize(() => {
        db.run(insertSQL, [targetName, content, now, now], (err, rows) => {
          if (err) reject(err);
        });
        db.all(selectSQL, [targetName, content], (err, rows) => {
          if (err) reject(err);
          resolve(rows[0]);
        });
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const insertMessageCode = async ({ event }) => {
  return new Promise((resolve, reject) => {
    try {
      const { id } = event;
      const now = new Date().valueOf();
      const insertSQL = `INSERT INTO message(event_id, code, created_at, updated_at) VALUES (?, ?, ?, ?)`;
      const codes = [...new Array(50)].map(() =>
        Math.random().toString(36).substr(2, 11)
      );
      console.log(codes);
      db.serialize(() => {
        for (const code of codes) {
          db.run(insertSQL, [id, code, now, now]);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const getEvents = async ({ offset, limit = 10 }) => {
  return new Promise((resolve, reject) => {
    try {
      const selectSQL = `SELECT * FROM event ORDER BY id DESC LIMIT ?, ?`;
      db.serialize(() => {
        db.all(selectSQL, [offset, limit], (err, rows) => {
          if (err) reject(err);
          resolve(rows);
        });
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const getEvent = async ({ targetName = "" }) => {
  return new Promise((resolve, reject) => {
    try {
      const selectSQL = `SELECT * FROM event WHERE target_name=? ORDER BY id DESC LIMIT 1`;
      db.serialize(() => {
        db.all(selectSQL, [targetName], (err, rows) => {
          if (err) reject(err);
          if (rows.length === 0) reject("Not registered event");
          else resolve(rows[0]);
        });
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteEvent = async ({ id }) => {
  return new Promise((resolve, reject) => {
    try {
      const deleteSQL = `DELETE FROM event WHERE id=?`;
      db.serialize(() => {
        db.all(deleteSQL, [id], (err, rows) => {
          if (err) reject(err);
          resolve(id);
        });
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const getCodes = async ({ id }) => {
  return new Promise((resolve, reject) => {
    try {
      const selectSQL = `SELECT * FROM message WHERE event_id=?`;
      db.all(selectSQL, [id], (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const getMessage = async ({ eventId, code }) => {
  return new Promise((resolve, reject) => {
    try {
      const selectSQL = `SELECT * FROM message WHERE event_id=? AND code=?`;
      db.all(selectSQL, [eventId, code], (err, rows) => {
        if (err) resolve(null);
        resolve(rows[0]);
      });
    } catch (error) {
      resolve(null);
    }
  });
};

export const updateMessage = async ({
  id,
  to,
  message,
  from,
  backgroundColor,
}) => {
  return new Promise((resolve, reject) => {
    const now = new Date().valueOf();
    try {
      const updateSQL = `UPDATE message SET 'to'=?, message=?, 'from'=?, background_color=?, updated_at=? WHERE id=?`;
      console.log(updateSQL);
      db.serialize(() => {
        db.run(
          updateSQL,
          [to, message, from, backgroundColor, now, id],
          (err, rows) => {
            if (err) resolve(null);
            resolve(true);
          }
        );
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

export const getMessages = async ({ targetName }) => {
  return new Promise((resolve, reject) => {
    try {
      const selectSQL = `SELECT * FROM message WHERE event_id = (SELECT id FROM event WHERE target_name = ? ORDER BY id DESC LIMIT 1);`;
      db.all(selectSQL, [targetName], (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    } catch (error) {
      console.log(error);
    }
  });
};

export const getMessageOpenedAt = async ({ id }) => {
  return new Promise((resolve, reject) => {
    try {
      const selectSQL = `SELECT opened_at FROM message WHERE id=?`;
      const updateSQL = `UPDATE message SET 'opened_at'=?, 'updated_at'=? WHERE id=?`;

      db.serialize(() => {
        db.all(selectSQL, [id], (err, rows) => {
          if (err) reject(err);
          if (rows[0].opened_at) resolve(rows[0].opened_at);
          else {
            const now = new Date().valueOf();
            db.all(updateSQL, [now, now, id], (err, rows) => {
              if (err) reject(err);
              resolve(now);
            });
          }
        });
      });
    } catch (error) {
      reject(error);
    }
  });
};
