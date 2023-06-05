const dbConnection = require('../models/db');
const sql = require('mssql');

exports.getAllSuppliers = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.query("SELECT BPSNUM_0, BPSNAM_0 FROM x3v11gsfdata.GSFUAT.BPSUPPLIER WHERE XTMSPRTLFLG_0 = 2"));
    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getSupplierConCode = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('userId', sql.NVarChar, req.query.id)
      .query("SELECT A.BPRNUM_0,A.BPRNAM_0,B.CCNCRM_0,C.CNTFNA_0,C.CNTLNA_0, (SELECT MAX(X3CONTSEQ_0)+1 FROM x3v11gsfdata.GSFUAT.XSCUSER where X3USER_0 = A.BPRNUM_0 AND XCONCODE_0 = B.CCNCRM_0 AND X3ROLE_0 = 3) AS SEQ, B.WEB_0, B.MOB_0, B.TEL_0 FROM x3v11gsfdata.GSFUAT.BPARTNER A LEFT OUTER JOIN x3v11gsfdata.GSFUAT.CONTACT B ON A.BPRNUM_0 = B.BPANUM_0 LEFT OUTER JOIN x3v11gsfdata.GSFUAT.CONTACTCRM C ON B.CCNCRM_0 = C.CNTNUM_0 WHERE A.BPSFLG_0 = 2 AND A.BPRNUM_0=@userId"));
    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    return next(error);
  }
};