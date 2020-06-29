import { getCodes } from "../../../utils/db";

export default async (req, res) => {
  try {
    const { id } = req.query;
    const rows = await getCodes({ id });

    res.statusCode = 200;
    res.json({
      codes: rows,
    });
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.json({ message: "Internal error" });
  }
};
