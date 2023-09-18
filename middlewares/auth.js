var jwt = require(`jsonwebtoken`);
var { promisify } = require(`util`);

async function auth(req, res, next) {
  var { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: "you must have avalid token" });
  }
  try {
    var decoded = await promisify(jwt.verify)(
      authorization,
      process.env.SECRET
    );
    req.id = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
}

module.exports = auth;
