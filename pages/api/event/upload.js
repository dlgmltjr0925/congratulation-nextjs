import { updateMessage } from "../../../utils/db";

export default async (req, res) => {
  try {
    const { id, to, message, from, backgroundColor } = req.body;

    const result = await updateMessage({
      id,
      to,
      message,
      from,
      backgroundColor,
    });

    res.statusCode = 200;
    res.json({
      data: {
        result,
      },
    });
  } catch (error) {
    console.log(error);
    res.statusCode = 500;
    res.json({ message: "Internal error" });
  }
};
