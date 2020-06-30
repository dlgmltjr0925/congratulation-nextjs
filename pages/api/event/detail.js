import { getEvent, getMessage } from '../../../utils/db';

export default async (req, res) => {
  try {
    console.log('/api/event/detail');
    const { targetName, code } = req.query;

    const data = {};

    data.event = await getEvent({ targetName });

    if (typeof data.event !== 'string') {
      const { id: eventId } = data.event;
      data.message = await getMessage({ eventId, code });
    }

    res.statusCode = 200;
    res.json({
      data,
    });
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.json({ message: 'Internal error' });
  }
};
