const dbConnection = require('../models/db');

exports.getAllSites = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.query("SELECT FCY_0, FCYNAM_0 FROM x3v11gsfdata.GSFUAT.FACILITY"));
    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getSiteById = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('id', req.params.id)
      .query(`SELECT FCY_0, FCYNAM_0 FROM x3v11gsfdata.GSFUAT.FACILITY F LEFT OUTER JOIN XSCUSER U ON F.FCY_0 = U.X3SITE_0 Where XLOGIN_0 = @id`));
    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    return next(error);
  }
};