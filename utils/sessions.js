const sessions = {};

export const createToken = (user) => {
  let token = Math.random().toString(36).substr(2, 11);
  while (sessions[token]) {
    token = Math.random().toString(36).substr(2, 11);
  }
  setSession(token, user);
  return token;
};

export const setSession = (token, options) => {
  sessions[token] = {
    ...options,
    expirate: new Date().valueOf() + 36000000,
  };
};

export const checkValidToken = (authorization = "") => {
  const token = authorization.replace("bearer ", "");
  console.log(sessions);
  const session = sessions[token];
  if (!session || session.expirate < new Date().valueOf()) return false;
  return true;
};

// setInterval(() => {
//   const now = new Date().valueOf();
//   for (const token in sessions) {
//     if (sessions[token].expirate < now) {
//       console.log(`token[${token}] is expired`);
//       delete sessions[token];
//     }
//   }
// }, 1000);
