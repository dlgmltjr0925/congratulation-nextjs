// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getHashedPassword } from '../../utils/crypto';
import { getUserInfo } from '../../utils/db';

export default async (req, res) => {
  const { id, password } = req.query;
  if (!id || !password) {
    res.statusCode = 400;
    return res.json({ message: 'Invalid parameters' });
  }
  const hashedPassword = getHashedPassword(password);

  try {
    const token = await getUserInfo({ id, password: hashedPassword });
    if (token) {
      res.statusCode = 200;
      res.json({ accessToken: token });
    } else {
      res.statusCode = 401;
      res.json({ message: 'No user' });
    }
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.json({ message: 'Internal error' });
  }
};
