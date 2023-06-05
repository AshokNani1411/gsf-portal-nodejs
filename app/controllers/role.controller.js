const dbConnection = require('../models/db');

exports.getAllRoles = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.query("SELECT XSROLID_0, XDESC_0 FROM XSCACROL"));
    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    return next(error);
  }
};