import { deleteEvent } from "../../../utils/db";

export default async (req, res) => {
  try {
    const { id } = req.body;

    const deletedId = await deleteEvent({ id });

    res.statusCode = 200;
    res.json({
      data: deletedId,
    });
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.json({ message: "Internal error" });
  }
};
