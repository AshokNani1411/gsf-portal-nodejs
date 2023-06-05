const dbConnection = require('../models/db');
const sql = require('mssql');

exports.getAllPayments = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('x3user', sql.NVarChar, req.body.x3user)
      .input('site', sql.NVarChar, req.body.site)
      .query(`Select  A.NUM_0, A.STA_0, A.FCY_0, A.BPR_0, A.BPRSAC_0, A.ACC_0, A.BPAINV_0,
              A.ACCDAT_0, A.BAN_0, A.CUR_0, A.AMTCUR_0, A.DUDDAT_0 FROM
              x3v11gsfdata.GSFUAT.PAYMENTH A
      WHERE A.FCY_0 =@site AND A.BPR_0=@x3user ORDER BY A.ACCDAT_0 DESC`));
    if (result && result.recordset.length > 0) {
      for (let index = 0; index < result.recordset.length; index++) {
        const subData = await dbConnection.then(pool => pool.request()
          .input('site', sql.NVarChar, req.body.site)
          .input('paymentno', sql.NVarChar, result.recordset[index].NUM_0)
          .query(`Select  A. NUM_0, A. DENCOD_0, A.VCRTYP_0, A.VCRNUM_0, A.CURLIN_0, A.AMTLIN_0, B.CUR_0
                  From x3v11gsfdata.GSFUAT.PAYMENTD A
                  LEFT JOIN x3v11gsfdata.GSFUAT.PAYMENTH B ON A.NUM_0 = B.NUM_0
              WHERE B.FCY_0=@site AND A.NUM_0=@paymentno ORDER BY LIN_0 `)
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

exports.getPaymentDetail = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('orderNo', sql.NVarChar, req.params.id)
      .query(`Select  A.NUM_0, A.STA_0, A.FCY_0, A.BPR_0, A.BPRSAC_0, A.ACC_0, A.BPAINV_0,
              A.ACCDAT_0, A.BAN_0, A.CUR_0, A.AMTCUR_0, A.DUDDAT_0 FROM
              x3v11gsfdata.GSFUAT.PAYMENTH A
       WHERE A.NUM_0 = @orderNo ORDER BY A.ACCDAT_0 DESC`));
    if (result && result.recordset.length > 0) {
      for (let index = 0; index < result.recordset.length; index++) {
        const subData = await dbConnection.then(pool => pool.request()
          .input('site', sql.NVarChar, result.recordset[index].FCY_0)
          .input('orderNo', sql.NVarChar, result.recordset[index].NUM_0)
          .query(`Select  A. NUM_0, A. DENCOD_0, A.VCRTYP_0, A.VCRNUM_0, A.CURLIN_0, A.AMTLIN_0, B.CUR_0
                  From x3v11gsfdata.GSFUAT.PAYMENTD A
                  LEFT JOIN x3v11gsfdata.GSFUAT.PAYMENTH B ON A.NUM_0 = B.NUM_0
                   WHERE B.FCY_0=@site AND A.NUM_0=@orderNo ORDER BY LIN_0 ASC`));
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


exports.getPaymentPendingInvoices = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('x3user', sql.NVarChar, req.body.x3user)
      .input('site', sql.NVarChar, req.body.site)
      .query(`SELECT DISTINCT A.FCY_0, A.SIVTYP_0,D.SALFCY_0, A.NUM_0, DES_0, STA_0, A.BPR_0, ACCDAT_0, AMTTAX_0, STRDUDDAT_0, AMTATIL_0, A.CUR_0, A.PTE_0, BPRVCR_0, A.BVRREFNUM_0, INVDAT_0, A.AMTATI_0, INVSTA_0, A.AMTNOT_0, C.TEXTE_0 AS PTRMDES_0, E.TEXTE_0 AS INTRMDES_0,
      CASE WHEN B.FLGCLE_0 = 1 AND (B.PAYCUR_0 = 0 OR B.TMPCUR_0 = 0) THEN 1
      WHEN B.FLGCLE_0 = 2 THEN 2
      WHEN B.FLGCLE_0 = 1 AND (B.PAYCUR_0 <> 0 OR B.TMPCUR_0 <> 0) THEN 3
      ELSE 0
      END as Status,D.SIHORINUM_0
      FROM x3v11gsfdata.GSFUAT.SINVOICE A
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.GACCDUDATE B ON A.NUM_0 = B.NUM_0
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.SINVOICEV D ON A.NUM_0 = D.NUM_0
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.ATEXTRA C ON A.PTE_0 = C.IDENT1_0 AND C.CODFIC_0 = 'TABPAYTERM' AND C.ZONE_0 = 'DESAXX' AND C.LANGUE_0 = 'FRA'
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.ATEXTRA E ON A.SIVTYP_0 = E.IDENT1_0 AND E.CODFIC_0 = 'TABSIVTYP' AND E.ZONE_0 = 'DESAXX' AND E.LANGUE_0 = 'ENG'
      WHERE A.FCY_0= @site AND A.BPR_0 = @x3user AND B.FLGCLE_0 = 1
      ORDER BY STRDUDDAT_0 DESC`));
      res.json({
        success: true,
        data: result.recordset
      });
  } catch (error) {
    return next(error);
  }
};
