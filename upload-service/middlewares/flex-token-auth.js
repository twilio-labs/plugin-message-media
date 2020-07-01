const tokenValidator = require('twilio-flex-token-validator').validator;

module.exports.flexAuth = async (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(403).json({ msg: 'Missing authentication' });
  }

  try {
    await tokenValidator(token, process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid credentials' });
  }
};
