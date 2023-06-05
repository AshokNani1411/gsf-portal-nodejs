const dbConnection = require('../models/db');
const sql = require('mssql');

exports.getAllQuotes = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('x3user', sql.NVarChar, req.body.x3user)
      .input('site', sql.NVarChar, req.body.site)
      .query(`Select A.SQHNUM_0, A.SQHTYP_0,A.QUOINVATI_0, D.TEXTE_0, A.QUODAT_0, A.CUSQUOREF_0, A.QUOSTA_0, A.FFWNUM_0, B.BPTNAM_0, A.VLYDAT_0, A.SOHNUM_0, A.ORDDAT_0, A.CUR_0
      From x3v11gsfdata.GSFUAT.SQUOTE A
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.BPCARRIER B ON A.FFWNUM_0 = B.BPTNUM_0
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.ATEXTRA D ON A.SQHTYP_0 = D.IDENT1_0 AND D.CODFIC_0 = 'TABSQHTYP' AND D.ZONE_0 = 'DESAXX'  AND D.LANGUE_0 = 'ENG' WHERE A.SALFCY_0=@site AND A.BPCORD_0=@x3user ORDER BY A.QUODAT_0 DESC`));
    if (result && result.recordset.length > 0) {
      for (let index = 0; index < result.recordset.length; index++) {
        const subData = await dbConnection.then(pool => pool.request()
          .input('site', sql.NVarChar, req.body.site)
          .input('quoteNo', sql.NVarChar, result.recordset[index].SQHNUM_0)
          .query(`Select A.SQHNUM_0, A.SOHNUM_0, A.ITMREF_0, A.ITMDES1_0, A.ITMDES_0, A.QTY_0, A.SAU_0, A.ORDQTY_0, A.GROPRI_0, A.NETPRINOT_0, A.NETPRIATI_0 From x3v11gsfdata.GSFUAT.SQUOTED A WHERE A.SALFCY_0=@site AND A.SQHNUM_0=@quoteNo ORDER BY SOPLIN_0 DESC`)
        );
        result.recordset[index].SORDERQ = subData.recordset;
      }
      res.json({
        success: true,
        data: result.recordset
      });
    } else {
      res.json({
        success: true,
        data: []
      });
    }
  } catch (error) {
    return next(error);
  }
};

exports.getQuoteDetail = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('orderNo', sql.NVarChar, req.params.id)
      .query(`Select A.SQHNUM_0, A.SQHTYP_0,A.QUOINVATI_0, D.TEXTE_0,A.SALFCY_0,C.FCYNAM_0, A.QUODAT_0, A.CUSQUOREF_0, A.QUOSTA_0, A.FFWNUM_0, B.BPTNAM_0, A.VLYDAT_0, A.SOHNUM_0, A.ORDDAT_0, A.CUR_0
      From x3v11gsfdata.GSFUAT.SQUOTE A
       LEFT JOIN x3v11gsfdata.GSFUAT.FACILITY C ON C.FCY_0 =  A.SALFCY_0
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.BPCARRIER B ON A.FFWNUM_0 = B.BPTNUM_0
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.ATEXTRA D ON A.SQHTYP_0 = D.IDENT1_0 AND D.CODFIC_0 = 'TABSQHTYP' AND D.ZONE_0 = 'DESAXX' and LANGUE_0 = 'ENG'
      WHERE A.SQHNUM_0=@orderNo`));
    if (result && result.recordset.length > 0) {
      for (let index = 0; index < result.recordset.length; index++) {
        const subData = await dbConnection.then(pool => pool.request()
          .input('quoteNo', sql.NVarChar, result.recordset[index].SQHNUM_0)
          .query(`Select A.SQHNUM_0, A.SOHNUM_0, A.ITMREF_0, A.ITMDES1_0, A.ITMDES_0, A.QTY_0, A.SAU_0, A.ORDQTY_0, A.GROPRI_0, A.NETPRINOT_0, A.NETPRIATI_0 From x3v11gsfdata.GSFUAT.SQUOTED A WHERE  A.SQHNUM_0=@quoteNo ORDER BY SOPLIN_0 DESC`)
        );
        result.recordset[index].SORDERQ = subData.recordset;
      }
      res.json({
        success: true,
        data: result.recordset
      });
    } else {
      res.json({
        success: true,
        data: []
      });
    }
  } catch (error) {
    return next(error);
  }
};