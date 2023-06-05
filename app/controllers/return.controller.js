const dbConnection = require('../models/db');
const sql = require('mssql');

exports.getAllReturns = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('x3user', sql.NVarChar, req.body.x3user)
      .input('site', sql.NVarChar, req.body.site)
      .query(`select A.STOFCY_0, A.SRHNUM_0, A.EXYDAT_0, A.EXTRTNDAT_0,
              A.RTNDAT_0, A.BPCORD_0, A.BPAADD_0, A.BPDNAM_0, A.DLVDAT_0,A.XDLV_STATUS_0,A.XREASON_0,
              A.BPCINV_0,A.SDHNUM_0,A.SRHTYP_0
              FROM DEMOTMSFR.SRETURN A
              WHERE A.STOFCY_0 = @site AND A.BPCORD_0 =@x3user ORDER BY A.RTNDAT_0 DESC`));
    if (result && result.recordset.length > 0) {
      for (let index = 0; index < result.recordset.length; index++) {
        const subData = await dbConnection.then(pool => pool.request()
          .input('site', sql.NVarChar, req.body.site)
          .input('orderNo', sql.NVarChar, result.recordset[index].SRHNUM_0)
          .query(`SELECT B.SRHNUM_0, B.ITMREF_0, B.ITMDES1_0, B.ITMDES_0,
                  B.SDHNUM_0, B.SDDLIN_0, B. DLVQTY_0, B.EXTQTY_0, B.QTY_0, B.QTYSTU_0, B.SAU_0,
                  B.STU_0, B.NETPRI_0, B.NETPRINOT_0, B.NETPRIATI_0,B.CUR_0,
                  B.RTNREN_0, B.RTNSTOUPD_0,
                  B.QTY_0 * B.NETPRI_0 As ToTal_Amount,
                  B.SIHNUM_0, B.SIDLIN_0
                  FROM DEMOTMSFR.SRETURND B
                  LEFT JOIN DEMOTMSFR.SRETURN A ON A.SRHNUM_0 = B.SRHNUM_0
              WHERE A.SALFCY_0=@site AND B.SRHNUM_0=@orderNo ORDER BY B.SDDLIN_0 `)
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

exports.getReturnDetail = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('orderNo', sql.NVarChar, req.params.id)
      .query(`select A.STOFCY_0, A.SRHNUM_0, A.EXYDAT_0, A.EXTRTNDAT_0,
                            A.RTNDAT_0, A.BPCORD_0, A.BPAADD_0, A.BPDNAM_0, A.DLVDAT_0,A.XDLV_STATUS_0,A.XREASON_0,
                            A.BPCINV_0,A.SDHNUM_0,A.SRHTYP_0,B.FCYNAM_0, A.MDL_0,
                             (SELECT TEXTE_0 FROM .ATEXTRA WHERE CODFIC_0='TABMODELIV' AND IDENT1_0= A.MDL_0 AND ZONE_0='DESAXX' AND LANGUE_0='ENG')As MDL_DESC
                            FROM DEMOTMSFR.SRETURN A
                            INNER JOIN x3v11gsfdata.GSFUAT.FACILITY B ON A.STOFCY_0 = B.FCY_0
                           WHERE A.SRHNUM_0 = @orderNo ORDER BY RTNDAT_0 DESC`));
    if (result && result.recordset.length > 0) {
      for (let index = 0; index < result.recordset.length; index++) {
        const subData = await dbConnection.then(pool => pool.request()
          .input('site', sql.NVarChar, result.recordset[index].STOFCY_0)
          .input('orderNo', sql.NVarChar, result.recordset[index].SRHNUM_0)
          .query(`SELECT B.SRHNUM_0, B.ITMREF_0, B.ITMDES1_0, B.ITMDES_0,
                                    B.SDHNUM_0, B.SDDLIN_0, B. DLVQTY_0, B.EXTQTY_0, B.QTY_0, B.QTYSTU_0, B.SAU_0,
                                    B.STU_0, B.NETPRI_0, B.NETPRINOT_0, B.NETPRIATI_0,B.CUR_0,
                                    B.RTNREN_0, B.RTNSTOUPD_0,
                                     B.QTY_0 * B.NETPRI_0 As ToTal_Amount,
                                    B.SIHNUM_0, B.SIDLIN_0
                                    FROM DEMOTMSFR.SRETURND B
                                    LEFT JOIN DEMOTMSFR.SRETURN A ON A.SRHNUM_0 = B.SRHNUM_0
                                    WHERE A.STOFCY_0=@site AND B.SRHNUM_0=@orderNo ORDER BY SDDLIN_0 ASC`));
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