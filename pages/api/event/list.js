import { getEvents } from "../../../utils/db";

export default async (req, res) => {
  try {
    const { offset, limit } = req.query;

    const events = await getEvents({ offset, limit });

    console.log(events);

    res.statusCode = 200;
    res.json({
      data: {
        list: events.map(({ id, target_name, content }) => {
          return {
            id,
            targetName: target_name,
            content,
          };
        }),
      },
    });
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.json({ message: "Internal error" });
  }
};
