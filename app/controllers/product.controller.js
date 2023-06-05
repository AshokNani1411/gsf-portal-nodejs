const dbConnection = require('../models/db');
const sql = require('mssql');

exports.getAll = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('site', sql.NVarChar, req.query.site)
      .query(`SELECT A.ITMREF_0,B.ITMDES1_0,SAU_0,B.TCLCOD_0,
              RTRIM(LTRIM(CONCAT(B.PCU_0+' ',B.PCU_1+' ',B.PCU_2+' ',B.PCU_3+' ',B.PCU_4+' ',B.PCU_5+' ')))  AS OTHERUNITS,
              B.PCUSTUCOE_0, B.PCUSTUCOE_1, B.PCUSTUCOE_2, B.PCUSTUCOE_3, B.PCUSTUCOE_4, B.PCUSTUCOE_5,
               ISNULL((Select TEXTE_0 From [DEMOTMSFR].[ATEXTRA] Where CODFIC_0 = 'TABUNIT' AND ZONE_0 = 'DES' AND LANGUE_0 = 'ENG' AND IDENT1_0 = B.PCU_0),'') As Units_Desc0,
                          ISNULL((Select TEXTE_0 From [DEMOTMSFR].[ATEXTRA] Where CODFIC_0 = 'TABUNIT' AND ZONE_0 = 'DES' AND LANGUE_0 = 'ENG' AND IDENT1_0 = B.PCU_1),'') As Units_Desc1,
                          ISNULL((Select TEXTE_0 From [DEMOTMSFR].[ATEXTRA] Where CODFIC_0 = 'TABUNIT' AND ZONE_0 = 'DES' AND LANGUE_0 = 'ENG' AND IDENT1_0 = B.PCU_2),'') As Units_Desc2,
                          ISNULL((Select TEXTE_0 From [DEMOTMSFR].[ATEXTRA] Where CODFIC_0 = 'TABUNIT' AND ZONE_0 = 'DES' AND LANGUE_0 = 'ENG' AND IDENT1_0 = B.PCU_3),'') As Units_Desc3,
                          ISNULL((Select TEXTE_0 From [DEMOTMSFR].[ATEXTRA] Where CODFIC_0 = 'TABUNIT' AND ZONE_0 = 'DES' AND LANGUE_0 = 'ENG' AND IDENT1_0 = B.PCU_4),'') As Units_Desc4,
                          ISNULL((Select TEXTE_0 From [DEMOTMSFR].[ATEXTRA] Where CODFIC_0 = 'TABUNIT' AND ZONE_0 = 'DES' AND LANGUE_0 = 'ENG' AND IDENT1_0 = B.PCU_5),'') As Units_Desc5,
                         C.BLOB_0, cast((S.BASPRI_0) as decimal(16,2)) as BASPRI_0
              FROM x3v11gsfdata.GSFUAT.ITMFACILIT A
              left outer join x3v11gsfdata.GSFUAT.ITMMASTER B ON A.ITMREF_0 = B.ITMREF_0
              LEFT JOIN x3v11gsfdata.GSFUAT.CBLOB C ON C.IDENT1_0 = A.ITMREF_0 AND CODBLB_0 = 'ITM'
              LEFT JOIN x3v11gsfdata.GSFUAT.ITMSALES S ON S.ITMREF_0 = A.ITMREF_0 WHERE B.SALFLG_0 = 2 AND A.STOFCY_0 = @site`));
    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getAllProductCategories = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
       .input('site', sql.NVarChar, req.query.site)
      .query(`select DISTINCT B.TCLCOD_0, D.TEXTE_0
              from DEMOTMSFR.ITMFACILIT A
              LEFT JOIN DEMOTMSFR.ITMMASTER B ON A.ITMREF_0 = B.ITMREF_0
              LEFT JOIN DEMOTMSFR.ITMCATEG C ON C.TCLCOD_0 = B.TCLCOD_0
              LEFT JOIN DEMOTMSFR.ATEXTRA D ON C.TCLCOD_0 = D.IDENT1_0 AND  CODFIC_0 ='ITMCATEG' AND LANGUE_0 = 'ENG' AND ZONE_0 = 'TCLAXX'
              WHERE A.STOFCY_0 = @site`));
    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getAllInstalledBase = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('site', sql.NVarChar, req.query.site)
      .query(`SELECT MACNUM_0 , SALFCY_0, MACDES_0, MACPDTCOD_0, CUR_0, MACSALPRI_0, MACBPCPRI_0, MACBPCCUR_0 FROM DEMOTMSFR.MACHINES WHERE SALFCY_0 = @site`));
    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getAllConsumptions = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .query("SELECT HDKITMTYP_0, A.ITMREF_0, A.ITMDES1_0  FROM DEMOTMSFR.ITMMASTER A WHERE HDKITMTYP_0 IN (2,3,4)"));
    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    return next(error);
  }
};

