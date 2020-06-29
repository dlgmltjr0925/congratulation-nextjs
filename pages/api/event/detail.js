import { getEvent } from "../../../utils/db";

export default async (req, res) => {
  try {
    console.log("/api/event/detail");
    const { targetName, code } = req.query;

    const event = await getEvent({ targetName });

    res.statusCode = 200;
    res.json({
      data: { event },
    });
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.json({ message: "Internal error" });
  }
};
