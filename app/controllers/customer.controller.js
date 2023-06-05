const dbConnection = require('../models/db');
const sql = require('mssql');

exports.getCustomerNameByCode = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
    .input('code', sql.NVarChar, req.params.code)
    .query(`Select XUSRCODE_0,XNAME_0,
        Case 
          When X3ROLE_0 = 1 THEN 'None'
          When X3ROLE_0 = 2 THEN 'Customer'
          When X3ROLE_0 = 3 THEN 'Supplier'
          When X3ROLE_0 = 4 THEN 'Admin'
        End AS ROLE
        From XSCUSER Where X3USER_0 = @code`));
    res.json({
      success: true,
      data: result.recordset[0],
    });
  } catch (error) {
    return next(error);
  }
};

exports.getAllCustomers = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.query("SELECT BPCNUM_0, BPCNAM_0 FROM BPCUSTOMER WHERE XTMSPRTLFLG_0 = 2"));
    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getAllBusinessPartners = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => 
      pool.query(`Select distinct A.BPRNUM_0, A.BPRNAM_0 From x3v11gsfdata.GSFUAT.BPARTNER A
        LEFT OUTER JOIN x3v11gsfdata.GSFUAT.BPCUSTOMER B ON A.BPRNUM_0 = B.BPCNUM_0 
        LEFT OUTER JOIN x3v11gsfdata.GSFUAT.BPSUPPLIER C ON A.BPRNUM_0 = C.BPSNUM_0 
        Where B.XTMSPRTLFLG_0 = 2 OR C.XTMSPRTLFLG_0 = 2
        Order By BPRNUM_0
      `));
    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getCustomerConCode = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('userId', sql.NVarChar, req.query.id)
      .query("SELECT A.BPRNUM_0,A.BPRNAM_0,B.CCNCRM_0,C.CNTFNA_0,C.CNTLNA_0, (SELECT MAX(X3CONTSEQ_0)+1 FROM x3v11gsfdata.GSFUAT.XSCUSER where X3USER_0 = A.BPRNUM_0 AND XCONCODE_0 = B.CCNCRM_0 AND X3ROLE_0 = 2) as SEQ, B.WEB_0, B.MOB_0, B.TEL_0 FROM x3v11gsfdata.GSFUAT.BPARTNER A LEFT OUTER JOIN x3v11gsfdata.GSFUAT.CONTACT B ON A.BPRNUM_0 = B.BPANUM_0 LEFT OUTER JOIN x3v11gsfdata.GSFUAT.CONTACTCRM C ON B.CCNCRM_0 = C.CNTNUM_0 WHERE A.BPCFLG_0 = 2 AND A.BPRNUM_0 = @userId"));
    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    return next(error);
  }
};