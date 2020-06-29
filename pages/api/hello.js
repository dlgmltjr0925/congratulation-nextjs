// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default (req, res) => {
  console.log(req.query);
  res.statusCode = 200;
  res.json({ ...req.query, name: 'John Doe' });
};
