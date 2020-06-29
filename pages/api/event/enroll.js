import { checkValidToken } from "../../../utils/sessions";
import { insertEvent, insertMessageCode } from "../../../utils/db";

export default async (req, res) => {
  try {
    const { authorization } = req.headers;

    if (!checkValidToken(authorization)) {
      res.statusCode = 401;
      res.json({
        message: "No permission",
      });
    } else {
      const { targetName, content } = req.body;

      const event = await insertEvent({ targetName, content });

      if (event) {
        insertMessageCode({ event });
      }

      res.statusCode = 200;
      res.json({
        data: {
          id: event.id,
          targetName: event.target_name,
          content: event.content,
        },
      });
    }
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.json({ message: "Internal error" });
  }
};

// const { id, password } = req.query;
// if (!id || !password) {
//   res.statusCode = 400;
//   return res.json({ message: "Invalid parameters" });
// }
// const hashedPassword = getHashedPassword(password);

// try {
//   const token = await getUserInfo({ id, password: hashedPassword });
//   if (token) {
//     res.statusCode = 200;
//     res.json({ accessToken: token });
//   } else {
//     res.statusCode = 401;
//     res.json({ message: "No user" });
//   }
// } catch (error) {
//   console.error(error);
//   res.statusCode = 500;
//   res.json({ message: "Internal error" });
// }
