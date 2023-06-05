const dbConnection = require('../models/db');
const sql = require('mssql');

exports.getAllOrders = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('x3user', sql.NVarChar, req.body.x3user)
      .input('site', sql.NVarChar, req.body.site)
      .query(`SELECT A.SALFCY_0,A.ORDINVATI_0,A.CUR_0, A.CUSORDREF_0,  A.BPCORD_0, A.BPCNAM_0, A.BPCCTY_0, A.SOHNUM_0, A.SOHTYP_0, A.ORDDAT_0,  A.SHIDAT_0, A.LASDLVNUM_0, A.ALLSTA_0,
      A.BPTNUM_0, A.DEMDLVDAT_0, A.DEMDLVHOU_0, A.DLVLINNBR_0, A.DLVSTA_0, A.DSPTOTQTY_0, A.DSPTOTVOL_0, A.DSPVOU_0, A.DSPTOTWEI_0, A.DSPWEU_0, A.MDL_0, 
      A.INVSTA_0, C.BPTNAM_0,
      (SELECT TEXTE_0 FROM .ATEXTRA WHERE CODFIC_0='TABSOHTYP' AND IDENT1_0= A.SOHTYP_0 AND ZONE_0='DESAXX' AND LANGUE_0='ENG')As ORD_TYP,
      (SELECT TEXTE_0 FROM .ATEXTRA WHERE CODFIC_0='TABMODELIV' AND IDENT1_0= A.MDL_0 AND ZONE_0='DESAXX' AND LANGUE_0='ENG')As MDL_DESC
      FROM x3v11gsfdata.GSFUAT.SORDER A
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.BPCARRIER C ON A.BPTNUM_0 = C.BPTNUM_0
      WHERE SALFCY_0=@site AND BPCORD_0=@x3user ORDER BY ORDDAT_0 DESC`));
    if (result && result.recordset.length > 0) {
      for (let index = 0; index < result.recordset.length; index++) {
        const subData = await dbConnection.then(pool => pool.request()
          .input('site', sql.NVarChar, req.body.site)
          .input('orderNo', sql.NVarChar, result.recordset[index].SOHNUM_0)
          .query(`SELECT A.SOHNUM_0, A.SOPLIN_0, A.SOQSEQ_0, A.ITMREF_0, A.SALFCY_0, A.QTY_0, A.DLVQTY_0,A.ODLQTY_0, A.INVQTY_0, A.SDHNUM_0, A.SDDLIN_0, 
          A.DSPLINWEI_0, A.DSPLINVOL_0, A.DSPWEU_0, A.DSPVOU_0,C.ITMDES_0,C.STU_0,C.GROPRI_0, C.NETPRIATI_0, B.CUR_0,
              CASE WHEN A.DLVQTY_0 = 0 THEN A.ODLQTY_0
              WHEN A.DLVQTY_0 > 0 THEN A.DLVQTY_0
              END as DELIVERYQTY, A.QTY_0 * C.GROPRI_0 As ToTal_Amount
              FROM x3v11gsfdata.GSFUAT.SORDERQ A LEFT OUTER JOIN x3v11gsfdata.GSFUAT.SORDERP C ON A.SOHNUM_0 = C.SOHNUM_0 AND A.SOPLIN_0 = C.SOPLIN_0 AND A.SOQSEQ_0 = C.SOPSEQ_0
          INNER JOIN x3v11gsfdata.GSFUAT.SORDER B ON A.SOHNUM_0 = B.SOHNUM_0
              WHERE A.SALFCY_0=@site AND A.SOHNUM_0=@orderNo ORDER BY SOPLIN_0 DESC`)
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

exports.getOrderDetail = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('orderNo', sql.NVarChar, req.params.id)
      .query(`SELECT A.SOHNUM_0, A.SALFCY_0,A.ORDINVATI_0, A.CUSORDREF_0,A.BPAADD_0,A.BPDNAM_0,A.PTE_0,Z.TEXTE_0,A.BPCORD_0, A.BPCNAM_0, A.BPCCTY_0, A.SOHTYP_0, A.ORDDAT_0,  A.SHIDAT_0, A.LASDLVNUM_0, A.ALLSTA_0, A.BPTNUM_0,
      A.DEMDLVDAT_0, A.DEMDLVHOU_0, A.DLVLINNBR_0, A.DLVSTA_0, A.DSPTOTQTY_0, A.DSPTOTVOL_0, A.DSPVOU_0, A.DSPTOTWEI_0, A.DSPWEU_0, A.MDL_0, A.INVSTA_0, A.CUR_0, 
      A.DAYLTI_0 , B.FCYNAM_0, C.BPTNAM_0,
      (SELECT TEXTE_0 FROM .ATEXTRA WHERE CODFIC_0='TABMODELIV' AND IDENT1_0= A.MDL_0 AND ZONE_0='DESAXX' AND LANGUE_0='ENG')As MDL_DESC
      FROM x3v11gsfdata.GSFUAT.SORDER A
      INNER JOIN x3v11gsfdata.GSFUAT.FACILITY B ON A.SALFCY_0 = B.FCY_0
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.BPCARRIER C ON A.BPTNUM_0 = C.BPTNUM_0
       LEFT OUTER JOIN x3v11gsfdata.GSFUAT.ATEXTRA Z ON A.PTE_0 = Z.IDENT1_0 AND Z.CODFIC_0 = 'TABPAYTERM' AND Z.ZONE_0 = 'DESAXX' AND Z.LANGUE_0 = 'FRA'
      WHERE SOHNUM_0 = @orderNo ORDER BY ORDDAT_0 DESC`));
    if (result && result.recordset.length > 0) {
      for (let index = 0; index < result.recordset.length; index++) {
        const subData = await dbConnection.then(pool => pool.request()
          .input('site', sql.NVarChar, result.recordset[index].SALFCY_0)
          .input('orderNo', sql.NVarChar, result.recordset[index].SOHNUM_0)
          .query(`SELECT A.SOHNUM_0, A.SOPLIN_0, A.SOQSEQ_0, A.ITMREF_0, A.SALFCY_0, A.QTY_0, A.DLVQTY_0,A.ODLQTY_0, A.INVQTY_0, A.SDHNUM_0, A.SDDLIN_0, A.DSPLINWEI_0, DSPLINVOL_0, DSPWEU_0, DSPVOU_0,C.ITMDES_0,C.STU_0,C.SAU_0, C.NETPRI_0, C.NETPRIATI_0,
          CASE WHEN A.DLVQTY_0 = 0 THEN A.ODLQTY_0
          WHEN A.DLVQTY_0 > 0 THEN A.DLVQTY_0
          END as DELIVERYQTY, A.QTY_0 * C.GROPRI_0 As ToTal_Amount
          FROM x3v11gsfdata.GSFUAT.SORDERQ A 
          LEFT OUTER JOIN x3v11gsfdata.GSFUAT.SORDERP C ON A.SOHNUM_0 = C.SOHNUM_0 AND A.SOPLIN_0 = C.SOPLIN_0 AND A.SOQSEQ_0 = C.SOPSEQ_0
          WHERE A.SALFCY_0=@site AND A.SOHNUM_0=@orderNo ORDER BY SOPLIN_0 ASC`));
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