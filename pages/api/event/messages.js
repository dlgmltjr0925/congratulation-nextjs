import { getMessages } from "../../../utils/db";

export default async (req, res) => {
  try {
    const { targetName } = req.query;

    const messages = await getMessages({ targetName });

    res.statusCode = 200;
    res.json({
      data: messages,
    });
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.json({ message: "Internal error" });
  }
};
