const dbConnection = require('../models/db');
const sql = require('mssql');

exports.getAllCustomerInvoices = async (req, res, next) => {
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
      WHERE A.FCY_0= @site AND A.BPR_0 = @x3user  AND A.SIVTYP_0 <> 'AVC'
      ORDER BY STRDUDDAT_0 DESC`));
    if (result && result.recordset.length > 0) {
      for (let index = 0; index < result.recordset.length; index++) {
        const subData = await dbConnection.then(pool => pool.request()
          .input('invoiceNo', sql.NVarChar, result.recordset[index].NUM_0)
          .query(`Select A.NUM_0, A.SIDLIN_0, A.SDHNUM_0, A.SDDLIN_0, A.ITMREF_0, A.ITMDES1_0, A.ITMDES_0, A.QTY_0, A.SAU_0, A.GROPRI_0, A.NETPRIATI_0, B.CUR_0, A.AMTATILIN_0
            FROM x3v11gsfdata.GSFUAT.SINVOICED A
            INNER JOIN x3v11gsfdata.GSFUAT.SINVOICE B ON A.NUM_0 = B.NUM_0
            Where A.NUM_0=@invoiceNo ORDER BY SIDLIN_0 DESC`)
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

exports.getCustomerInvoiceDetail = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('invoiceNo', sql.NVarChar, req.params.id)
      .query(`SELECT DISTINCT A.FCY_0, A.SIVTYP_0, A.NUM_0, DES_0, STA_0, A.BPR_0, ACCDAT_0, AMTTAX_0, STRDUDDAT_0, AMTATIL_0, A.CUR_0, A.PTE_0, BPRVCR_0, A.BVRREFNUM_0, INVDAT_0, A.AMTATI_0, INVSTA_0, A.AMTNOT_0, C.TEXTE_0 AS PTRMDES_0, E.TEXTE_0 AS INTRMDES_0, 
      CASE WHEN B.FLGCLE_0 = 1 AND (B.PAYCUR_0 = 0 OR B.TMPCUR_0 = 0) THEN 1
      WHEN B.FLGCLE_0 = 2 THEN 2
      WHEN B.FLGCLE_0 = 1 AND (B.PAYCUR_0 <> 0 OR B.TMPCUR_0 <> 0) THEN 3
      ELSE 0 
      END as Status,D.SIHORINUM_0, D.INVREF_0
      FROM x3v11gsfdata.GSFUAT.SINVOICE A
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.GACCDUDATE B ON A.NUM_0 = B.NUM_0
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.SINVOICEV D ON A.NUM_0 = D.NUM_0
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.ATEXTRA C ON A.PTE_0 = C.IDENT1_0 AND C.CODFIC_0 = 'TABPAYTERM' AND C.ZONE_0 = 'DESAXX' AND C.LANGUE_0 = 'FRA'
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.ATEXTRA E ON A.SIVTYP_0 = E.IDENT1_0 AND E.CODFIC_0 = 'TABSIVTYP' AND E.ZONE_0 = 'DESAXX' AND E.LANGUE_0 = 'ENG'
      WHERE A.NUM_0 = @invoiceNo AND A.SIVTYP_0 <> 'AVC'
      ORDER BY STRDUDDAT_0 DESC`));

    if (result && result.recordset.length > 0) {
      for (let index = 0; index < result.recordset.length; index++) {
        const subData = await dbConnection.then(pool => pool.request()
          .input('invoiceNo', sql.NVarChar, result.recordset[index].NUM_0)
          .query(`Select A.SIDLIN_0, A.NUM_0, A.ITMREF_0, A.ITMDES1_0, A.ITMDES_0, A.QTY_0, A.SAU_0, A.GROPRI_0, A.DISCRGVAL1_0, A.NETPRI_0, A.AMTNOTLIN_0 From DEMOTMSFR.SINVOICED A Where A.NUM_0 = @invoiceNo`)
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

exports.getAllSupplierInvoices = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('x3user', sql.NVarChar, req.body.x3user)
      .input('site', sql.NVarChar, req.body.site)
      .query(`SELECT A.FCY_0, A.PIVTYP_0, A.NUM_0, INVREF_0, STA_0, A.BPR_0, ACCDAT_0, STRDUDDAT_0, AMTATIL_0, AMTTAX_0, A.CUR_0, BPRVCR_0, 
      PTE_0,A.BASTAX_0+A.AMTTAX_0 as AMTWITHTAX, C.TEXTE_0,
      (SELECT TEXTE_0 FROM .ATEXTRA WHERE CODFIC_0='TABPIVTYP' AND IDENT1_0= A.PIVTYP_0 AND ZONE_0='DESAXX' AND LANGUE_0='ENG') As INV_TYP,
      CASE WHEN B.FLGCLE_0 = 1 AND (B.PAYCUR_0 = 0 OR B.TMPCUR_0 = 0) THEN 1
      WHEN B.FLGCLE_0 = 2 THEN 2
      WHEN B.FLGCLE_0 = 1 AND (B.PAYCUR_0 <> 0 OR B.TMPCUR_0 <> 0) THEN 3
      else 0
      END as Status
      FROM x3v11gsfdata.GSFUAT.PINVOICE A
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.GACCDUDATE B ON A.NUM_0 = B.NUM_0
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.ATEXTRA C ON A.PTE_0 = C.IDENT1_0 AND C.CODFIC_0 = 'TABPAYTERM' AND C.ZONE_0 = 'DESAXX' AND C.LANGUE_0 = 'ENG'
      WHERE A.FCY_0= @site AND A.BPR_0 = @x3user
      ORDER BY ACCDAT_0 DESC`));
    if (result && result.recordset.length > 0) {
      for (let index = 0; index < result.recordset.length; index++) {
        const subData = await dbConnection.then(pool => pool.request()
          .input('invoiceNo', sql.NVarChar, result.recordset[index].NUM_0)
          .query(`Select A.NUM_0, A.PIDLIN_0, A.PTHNUM_0, A.PTDLIN_0, A.ITMREF_0, A.ITMDES1_0, A.ITMDES_0, A.QTYUOM_0, A.UOM_0, A.GROPRI_0, A.NETCUR_0, A.AMTNOTLIN_0, A.AMTATILIN_0
          FROM x3v11gsfdata.GSFUAT.PINVOICED A
          Where A.NUM_0=@invoiceNo ORDER BY PIDLIN_0 DESC`)
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

exports.getSupplierInvoiceDetail = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('invoiceNo', sql.NVarChar, req.params.id)
      .query(`SELECT A.FCY_0, PIVTYP_0, A.NUM_0, INVREF_0, STA_0, A.BPR_0, ACCDAT_0, STRDUDDAT_0, AMTATIL_0, A.CUR_0, A.PAZ_0, A.BPRVCR_0, 
        A.AMTNOT_0, A.AMTTAX_0, A.AMTATI_0, PTE_0, A.BASTAX_0 + A.AMTTAX_0 as AMTWITHTAX, C.TEXTE_0 AS PTRMDES_0, D.TEXTE_0 INTRMDES_0,
        CASE WHEN B.FLGCLE_0 = 1 AND (B.PAYCUR_0 = 0 OR B.TMPCUR_0 = 0) THEN 1
        WHEN B.FLGCLE_0 = 2 THEN 2
        WHEN B.FLGCLE_0 = 1 AND (B.PAYCUR_0 <> 0 OR B.TMPCUR_0 <> 0) THEN 3
        Else 0
        END as Status
        FROM x3v11gsfdata.GSFUAT.PINVOICE A
        LEFT OUTER JOIN x3v11gsfdata.GSFUAT.GACCDUDATE B ON A.NUM_0 = B.NUM_0
        LEFT OUTER JOIN x3v11gsfdata.GSFUAT.ATEXTRA C ON A.PTE_0 = C.IDENT1_0 AND C.CODFIC_0 = 'TABPAYTERM' AND C.ZONE_0 = 'DESAXX' AND C.LANGUE_0 = 'ENG'
        LEFT OUTER JOIN x3v11gsfdata.GSFUAT.ATEXTRA D ON A.PIVTYP_0 = D.IDENT1_0 AND D.CODFIC_0 = 'TABPIVTYP' AND D.ZONE_0 = 'DESAXX' AND D.LANGUE_0 = 'ENG'
        WHERE A.NUM_0 = @invoiceNo
        ORDER BY ACCDAT_0 DESC`));

    if (result && result.recordset.length > 0) {
      for (let index = 0; index < result.recordset.length; index++) {
        const subData = await dbConnection.then(pool => pool.request()
          .input('invoiceNo', sql.NVarChar, result.recordset[index].NUM_0)
          .query(`Select A.TYPORI_0, A.NUMORI_0, A.NUM_0, A.PIDLIN_0, A.ITMREF_0, A.ITMDES1_0, A.ITMDES_0, A.STU_0, A.QTYUOM_0, A.NETPRI_0, A.AMTNOTLIN_0, A.NETCUR_0, A.DISCRGVAL1_0 From DEMOTMSFR.PINVOICED A Where A.NUM_0 = @invoiceNo`)
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

exports.getAllCustomerCreditNote = async (req, res, next) => {
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
      WHERE A.FCY_0= @site AND A.BPR_0 = @x3user  AND A.SIVTYP_0 = 'AVC'
      ORDER BY STRDUDDAT_0 DESC`));
    if (result && result.recordset.length > 0) {
      for (let index = 0; index < result.recordset.length; index++) {
        const subData = await dbConnection.then(pool => pool.request()
          .input('invoiceNo', sql.NVarChar, result.recordset[index].NUM_0)
          .query(`Select A.NUM_0, A.SIDLIN_0, A.SDHNUM_0, A.SDDLIN_0, A.ITMREF_0, A.ITMDES1_0, A.ITMDES_0, A.QTY_0, A.SAU_0, A.GROPRI_0, A.NETPRIATI_0, B.CUR_0, A.AMTATILIN_0
            FROM x3v11gsfdata.GSFUAT.SINVOICED A
            INNER JOIN x3v11gsfdata.GSFUAT.SINVOICE B ON A.NUM_0 = B.NUM_0
            Where A.NUM_0=@invoiceNo ORDER BY SIDLIN_0 DESC`)
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

exports.getCustomerCreditNoteDetail = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('invoiceNo', sql.NVarChar, req.params.id)
      .query(`SELECT DISTINCT A.FCY_0, A.SIVTYP_0, A.NUM_0, DES_0, STA_0, A.BPR_0, ACCDAT_0, AMTTAX_0, STRDUDDAT_0, AMTATIL_0, A.CUR_0, A.PTE_0, BPRVCR_0, A.BVRREFNUM_0, INVDAT_0, A.AMTATI_0, INVSTA_0, A.AMTNOT_0, C.TEXTE_0 AS PTRMDES_0, E.TEXTE_0 AS INTRMDES_0,
      CASE WHEN B.FLGCLE_0 = 1 AND (B.PAYCUR_0 = 0 OR B.TMPCUR_0 = 0) THEN 1
      WHEN B.FLGCLE_0 = 2 THEN 2
      WHEN B.FLGCLE_0 = 1 AND (B.PAYCUR_0 <> 0 OR B.TMPCUR_0 <> 0) THEN 3
      ELSE 0
      END as Status,D.SIHORINUM_0, D.INVREF_0
      FROM x3v11gsfdata.GSFUAT.SINVOICE A
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.GACCDUDATE B ON A.NUM_0 = B.NUM_0
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.SINVOICEV D ON A.NUM_0 = D.NUM_0
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.ATEXTRA C ON A.PTE_0 = C.IDENT1_0 AND C.CODFIC_0 = 'TABPAYTERM' AND C.ZONE_0 = 'DESAXX' AND C.LANGUE_0 = 'FRA'
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.ATEXTRA E ON A.SIVTYP_0 = E.IDENT1_0 AND E.CODFIC_0 = 'TABSIVTYP' AND E.ZONE_0 = 'DESAXX' AND E.LANGUE_0 = 'ENG'
      WHERE A.NUM_0 = @invoiceNo AND A.SIVTYP_0 = 'AVC'
      ORDER BY STRDUDDAT_0 DESC`));

    if (result && result.recordset.length > 0) {
      for (let index = 0; index < result.recordset.length; index++) {
        const subData = await dbConnection.then(pool => pool.request()
          .input('invoiceNo', sql.NVarChar, result.recordset[index].NUM_0)
          .query(`Select A.SIDLIN_0, A.NUM_0, A.ITMREF_0, A.ITMDES1_0, A.ITMDES_0, A.QTY_0, A.SAU_0, A.GROPRI_0, A.DISCRGVAL1_0, A.NETPRI_0, A.AMTNOTLIN_0 From DEMOTMSFR.SINVOICED A Where A.NUM_0 = @invoiceNo`)
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
