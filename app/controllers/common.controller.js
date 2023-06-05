const dbConnection = require('../models/db');
const sql = require('mssql');

exports.getAllAddresses = async (req, res, next) => {
  try {
    if (req.query.type === 'customer') {
      const result = await dbConnection.then(pool => pool.request()
        .input('x3user', sql.NVarChar, req.query.id)
        .query(`SELECT A.BPANUM_0, A.BPAADD_0, A.BPADES_0 , A.BPAADDFLG_0,A.BPAADDLIG_0,A.BPAADDLIG_1, A.POSCOD_0, A.CTY_0, A.SAT_0, A.CRYNAM_0, A.TEL_0, B.BPTNUM_0, B.MDL_0
        FROM x3v11gsfdata.GSFUAT.BPADDRESS A 
        LEFT JOIN BPDLVCUST B ON A.BPANUM_0 = B.BPCNUM_0 AND A.BPAADD_0 = B.BPAADD_0
        WHERE A.BPANUM_0 = @x3user AND A.BPATYP_0 = 1`));
      res.json({
        success: true,
        data: result.recordset
      });
    } else {
      const result = await dbConnection.then(pool => pool.request()
        .input('x3user', sql.NVarChar, req.query.id)
        .query(`SELECT A.BPANUM_0, A.BPAADD_0, A.BPADES_0 FROM x3v11gsfdata.GSFUAT.BPADDRESS A WHERE A.BPANUM_0 = @x3user AND A.BPATYP_0 = 1`));
      res.json({
        success: true,
        data: result.recordset
      });
    }
  } catch (error) {
    return next(error);
  }
};

exports.getAllCarrier = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .query(`SELECT BPTNUM_0, BPTNAM_0, BPTSHO_0 FROM DEMOTMSFR.BPCARRIER A`));
    res.json({
      success: true,
      data: result.recordset
    });
  } catch (error) {
    return next(error);
  }
};

exports.getAllDeliveryModes = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .query(`SELECT A.MDL_0, TEXTE_0 FROM DEMOTMSFR.TABMODELIV A LEFT OUTER JOIN DEMOTMSFR.ATEXTRA B ON A.MDL_0 = B.IDENT1_0 AND CODFIC_0='TABMODELIV' AND ZONE_0='DESAXX' AND LANGUE_0='ENG'`));
    res.json({
      success: true,
      data: result.recordset
    });
  } catch (error) {
    return next(error);
  }
};

exports.getAllLanguages = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .query(`Select DISTINCT A.LAN_0, B.TEXTE_0
      FROM x3v11gsfdata.GSFUAT.TABLAN A 
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.ATEXTRA B ON  A.LAN_0 = B.IDENT1_0
      Where B.CODFIC_0 = 'TABLAN' AND B.ZONE_0 = 'INTDES' AND B.LANGUE_0 = 'ENG' AND B.IDENT2_0 = ''
      Order By A.LAN_0`));
    res.json({
      success: true,
      data: result.recordset
    });
  } catch (error) {
    return next(error);
  }
};

exports.getAllDesignations = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .query(`Select LANNUM_0, LANMES_0
      FROM x3v11gsfdata.GSFUAT.APLSTD A 
      Where LANCHP_0 = 233 AND LAN_0 = 'ENG' AND LANNUM_0 > 0
      Order By LANNUM_0`));
    res.json({
      success: true,
      data: result.recordset
    });
  } catch (error) {
    return next(error);
  }
};

