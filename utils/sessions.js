const sessions = {};

export const createToken = (user) => {
  let token = Math.random().toString(36).substr(2, 11);
  while (sessions[token]) {
    token = Math.random().toString(36).substr(2, 11);
  }
  return token;
};

export const setSession = (token, options) => {
  sessions[token] = {
    ...options,
    expirate: new Date().valueOf() + 3600000,
  };
};

setInterval(() => {
  const now = new Date().valueOf();
  for (const token in sessions) {
    if (sessions[token].expirate < now) {
      console.log(`token[${token}] is expired`);
      delete sessions[token];
    }
  }
}, 1000);
