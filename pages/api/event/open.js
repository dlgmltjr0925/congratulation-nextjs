import { getMessageOpenedAt } from "../../../utils/db";

export default async (req, res) => {
  try {
    const { id } = req.query;

    const openedAt = await getMessageOpenedAt({ id });

    res.statusCode = 200;
    res.json({
      data: {
        openedAt,
      },
    });
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.json({ message: "Internal error" });
  }
};
