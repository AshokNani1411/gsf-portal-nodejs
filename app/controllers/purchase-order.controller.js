const dbConnection = require('../models/db');
const sql = require('mssql');

exports.getAllPurchaseOrders = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('x3user', sql.NVarChar, req.body.x3user)
      .input('site', sql.NVarChar, req.body.site)
      .query(`SELECT A.POHFCY_0, A.POHNUM_0, A.XPOHTYP_0, A.ORDDAT_0, A.ORDREF_0, A.RCPFLG_0, A.INVFLG_0, A.BPSNUM_0, A.CTY_0, A.BPTNUM_0, A.EXTRCPDAT1_0, A.MDL_0,A.XDROPREF_0 ,A.X1CPTHNUM_0,A.X1CPTHDAT_0, B.BPTNAM_0, (SELECT TEXTE_0 FROM .ATEXTRA WHERE CODFIC_0='TABMODELIV' AND IDENT1_0= A.MDL_0 AND ZONE_0='DESAXX' AND LANGUE_0='ENG') As MDL_DESC
      FROM x3v11gsfdata.GSFUAT.PORDER A
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.BPCARRIER B ON A.BPTNUM_0 = B.BPTNUM_0 
      WHERE A.POHFCY_0=@site AND A.BPSNUM_0=@x3user 
      ORDER BY ORDDAT_0 DESC`));
    if (result && result.recordset.length > 0) {
      for (let index = 0; index < result.recordset.length; index++) {
        const subData = await dbConnection.then(pool => pool.request()
          .input('site', sql.NVarChar, req.body.site)
          .input('orderNo', sql.NVarChar, result.recordset[index].POHNUM_0)
          .query(`SELECT A.POHNUM_0,A.POPLIN_0,A.POQSEQ_0,A.ITMREF_0,B.ITMDES_0,A.QTYSTU_0,A.STU_0,A.QTYWEU_0,A.LINWEU_0,A.QTYVOU_0,A.LINVOU_0,
          A.PTHNUM_0,A.PTDLIN_0,C.X1CPTHNUM_0,C.X1CPTHDAT_0, C.CUR_0, B.GROPRI_0, A.LINAMT_0, A.LINATIAMT_0
          FROM x3v11gsfdata.GSFUAT.PORDERQ A 
          LEFT OUTER JOIN x3v11gsfdata.GSFUAT.PORDERP B ON A.POHNUM_0 = B.POHNUM_0 AND A.POPLIN_0 = B.POPLIN_0  AND A.POQSEQ_0 = B.POPSEQ_0 
          LEFT OUTER JOIN x3v11gsfdata.GSFUAT.PORDER  C ON A.POHNUM_0 = C.POHNUM_0 
          WHERE A.POHFCY_0=@site AND A.POHNUM_0=@orderNo ORDER BY SOPLIN_0 DESC`)
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

exports.getPurchaseOrderDetail = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('orderNo', sql.NVarChar, req.params.id)
      .query(`SELECT A.POHFCY_0, A.POHNUM_0, A.XPOHTYP_0, A.ORDDAT_0, A.ORDREF_0, A.RCPFLG_0, A.INVFLG_0, A.BPSNUM_0, A.CTY_0, A.BPTNUM_0, A.EXTRCPDAT1_0, A.MDL_0,A.XDROPREF_0, A.X1CPTHNUM_0,A.X1CPTHDAT_0, B.FCYNAM_0, C.BPTNAM_0, (SELECT TEXTE_0 FROM .ATEXTRA WHERE CODFIC_0='TABMODELIV' AND IDENT1_0= A.MDL_0 AND ZONE_0='DESAXX' AND LANGUE_0='ENG') As MDL_DESC
      FROM x3v11gsfdata.GSFUAT.PORDER A
      INNER JOIN x3v11gsfdata.GSFUAT.FACILITY B ON A.POHFCY_0 = B.FCY_0
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.BPCARRIER C ON A.BPTNUM_0 = C.BPTNUM_0 
      WHERE POHNUM_0 = @orderNo ORDER BY A.ORDDAT_0 DESC`));
    if (result && result.recordset.length > 0) {
      for (let index = 0; index < result.recordset.length; index++) {
        const subData = await dbConnection.then(pool => pool.request()
          .input('orderNo', sql.NVarChar, result.recordset[index].POHNUM_0)
          .query(`SELECT A.POHNUM_0,A.POPLIN_0,A.POQSEQ_0,A.ITMREF_0,B.ITMDES_0,A.QTYSTU_0,A.STU_0,A.QTYWEU_0,A.LINWEU_0,A.QTYVOU_0,A.LINVOU_0,
          A.PTHNUM_0,A.PTDLIN_0,C.X1CPTHNUM_0,C.X1CPTHDAT_0, B.NETPRI_0, A.EXTRCPDAT_0, A.LINAMT_0, B.GROPRI_0
          FROM x3v11gsfdata.GSFUAT.PORDERQ A 
          LEFT OUTER JOIN x3v11gsfdata.GSFUAT.PORDERP B ON A.POHNUM_0 = B.POHNUM_0 AND A.POPLIN_0 = B.POPLIN_0  AND A.POQSEQ_0 = B.POPSEQ_0 
          LEFT OUTER JOIN x3v11gsfdata.GSFUAT.PORDER  C ON A.POHNUM_0 = C.POHNUM_0 
          WHERE A.POHNUM_0 = @orderNo`)
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