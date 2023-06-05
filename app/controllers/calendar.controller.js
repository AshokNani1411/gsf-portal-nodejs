const dbConnection = require('../models/db');
const sql = require('mssql');

exports.getAll = async (req, res, next) => {
  try {
    const categories = req.body.calendars;
    if (categories && categories.length > 0) {
      let purchaseOrders, salesOrders, deliveries, pickTickets, salesReturns, pickups, purchaseReturns;
      let returnData = [];
      if (categories.includes('Purchase Order')) {
        purchaseOrders = await getPurchaseOrders(req);
        if (purchaseOrders.length > 0) {
          returnData = returnData.concat(purchaseOrders);
        }
      }
      if (categories.includes('Sales Order')) {
        salesOrders = await getSalesOrders(req);
        if (salesOrders.length > 0) {
          returnData = returnData.concat(salesOrders);
        }
      }
      if (categories.includes('Sales Delivery')) {
        deliveries = await getDeliveries(req);
        if (deliveries.length > 0) {
          returnData = returnData.concat(deliveries);
        }
      }
      if (categories.includes('Pick Ticket')) {
        pickTickets = await getPickTickets(req);
        if (pickTickets.length > 0) {
          returnData = returnData.concat(pickTickets);
        }
      }
      if (categories.includes('Sales Return')) {
        salesReturns = await getSalesReturns(req);
        if (salesReturns.length > 0) {
          returnData = returnData.concat(salesReturns);
        }
      }
      if (categories.includes('Pickup')) {
        pickups = await getPickups(req);
        if (pickups.length > 0) {
          returnData = returnData.concat(pickups);
        }
      }
      if (categories.includes('Purchase Return')) {
        purchaseReturns = await getPurchaseReturns(req);
        if (purchaseReturns.length > 0) {
          returnData = returnData.concat(purchaseReturns);
        }
      }
      if (categories.includes('Sales Invoice')) {
        salesInvoice = await getSalesInvoice(req);
        if (salesInvoice.length > 0) {
          returnData = returnData.concat(salesInvoice);
        }
      }
      if (categories.includes('Purchase Invoice')) {
        purchaseInvoice = await getPurchaseInvoice(req);
        if (purchaseInvoice.length > 0) {
          returnData = returnData.concat(purchaseInvoice);
        }
      }
      if (categories.includes('Purchase Receipt')) {
        purchaseReceipt = await getPurchaseReceipt(req);
        if (purchaseReceipt.length > 0) {
          returnData = returnData.concat(purchaseReceipt);
        }
      }
      res.json({
        success: true,
        data: returnData
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

async function getPurchaseOrders(req) {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('site', sql.NVarChar, req.body.site)
      .input('x3user', sql.NVarChar, req.user.sub[0].X3USER_0)
      .query(`SELECT A.XPICKID_0,A.XODRNUM_0,A.XRECPTNO_0,A.POHFCY_0,B.ORDDAT_0,A.BPSNUM_0,C.BPSNAM_0,B.BPTNUM_0,B.MDL_0,B.TOTLINWEU_0,DSPWEU_0, B.TOTLINVOU_0,B.DSPVOU_0,B.BPOADD_0,B.BPOADDLIG_0,B.BPOADDLIG_1,B.BPOADDLIG_2,B.BPOPOSCOD_0,BPOCTY_0,BPOCRY_0,XPICKUPTYP_0,XPOHFLG_0, A.XODRNUM_0 as title,B.ORDDAT_0 as date, 'Purchase Order' as type, D.FCYNAM_0, E.BPTNAM_0, (SELECT TEXTE_0 FROM .ATEXTRA WHERE CODFIC_0='TABMODELIV' AND IDENT1_0= B.MDL_0 AND ZONE_0='DESAXX' AND LANGUE_0='ENG') As MDL_DESC
      FROM x3v11gsfdata.GSFUAT.XPICKUPH A 
      INNER JOIN x3v11gsfdata.GSFUAT.FACILITY D ON A.POHFCY_0 = D.FCY_0
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.PORDER B ON A.XODRNUM_0 = B.POHNUM_0 
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.BPSUPPLIER C ON A.BPSNUM_0 = C.BPSNUM_0 
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.BPCARRIER E ON B.BPTNUM_0 = E.BPTNUM_0
      WHERE A.POHFCY_0 = @site AND A.BPSNUM_0=@x3user`));
    return result.recordset;
  } catch (error) {
    console.log(error);
  }
}

async function getSalesOrders(req) {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('site', sql.NVarChar, req.body.site)
      .input('x3user', sql.NVarChar, req.user.sub[0].X3USER_0)
      .query(`SELECT A.XDROPID_0,A.XODRNUM_0,A.XDLVYNO_0,A.SALFCY_0,B.SHIDAT_0,A.BPCORD_0,C.BPCNAM_0,B.BPTNUM_0,B.MDL_0,B.DSPTOTWEI_0,DSPWEU_0,
      B.DSPTOTVOL_0,B.DSPVOU_0,B.BPAADD_0,B.BPDADDLIG_0,B.BPDADDLIG_1,B.BPDADDLIG_2,B.BPDPOSCOD_0,BPDCTY_0,BPDCRY_0,XDROPTYP_0,
    XSOHFLG_0, A.XODRNUM_0 as title,B.SHIDAT_0 as date, 'Sales Order' as type, D.BPTNAM_0,
    (SELECT TEXTE_0 FROM .ATEXTRA WHERE CODFIC_0='TABMODELIV' AND IDENT1_0= B.MDL_0 AND ZONE_0='DESAXX' AND LANGUE_0='ENG')As MDL_DESC
    FROM x3v11gsfdata.GSFUAT.XDROPH A 
    LEFT OUTER JOIN x3v11gsfdata.GSFUAT.SORDER B ON A.XODRNUM_0 = B.SOHNUM_0 
    LEFT OUTER JOIN x3v11gsfdata.GSFUAT.BPCUSTOMER C ON A.BPCORD_0 = C.BPCNUM_0 
    LEFT OUTER JOIN x3v11gsfdata.GSFUAT.BPCARRIER D ON B.BPTNUM_0 = D.BPTNUM_0
    WHERE A.SALFCY_0= @site AND A.BPCORD_0=@x3user`));
    return result.recordset;
  } catch (error) {
    console.log(error);
  }
}

async function getDeliveries(req) {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('site', sql.NVarChar, req.body.site)
      .input('x3user', sql.NVarChar, req.user.sub[0].X3USER_0)
      .query(`SELECT SALFCY_0,DLVDAT_0,BPCORD_0,BPCNAM_0,SDHNUM_0,MDL_0,A.BPTNUM_0,NETWEI_0,A.WEU_0,VOL_0,A.VOU_0,A.BPAADD_0,A.BPDADDLIG_0,
      A.BPDADDLIG_1,A.BPDPOSCOD_0,A.BPDCTY_0,A.BPDCRY_0,XDLV_STATUS_0, SDHNUM_0 as title,A.DLVDAT_0 as date, 'Sales Delivery' as type, C.BPTNAM_0,
      (SELECT TEXTE_0 FROM .ATEXTRA WHERE CODFIC_0='TABMODELIV' AND IDENT1_0= A.MDL_0 AND ZONE_0='DESAXX' AND LANGUE_0='ENG')As MDL_DESC	   
      FROM x3v11gsfdata.GSFUAT.SDELIVERY A 
    LEFT OUTER JOIN x3v11gsfdata.GSFUAT.BPCUSTOMER B ON A.BPCORD_0 = B.BPCNUM_0 
    LEFT OUTER JOIN x3v11gsfdata.GSFUAT.BPCARRIER C ON A.BPTNUM_0 = C.BPTNUM_0
      WHERE  SALFCY_0= @site AND A.BPCORD_0=@x3user`));
    return result.recordset;
  } catch (error) {
    console.log(error);
  }
}

async function getPickTickets(req) {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('site', sql.NVarChar, req.body.site)
      .input('x3user', sql.NVarChar, req.user.sub[0].X3USER_0)
      .query(`SELECT STOFCY_0,DLVDAT_0,BPCORD_0,BPCNAM_0,PRHNUM_0,MDL_0,A.BPTNUM_0,NETWEI_0,A.WEU_0,VOL_0,A.VOU_0,A.BPAADD_0,A.BPDADDLIG_0,
      A.BPDADDLIG_1,A.BPDPOSCOD_0,A.BPDCTY_0,A.BPDCRY_0,XDLV_STATUS_0,PRHNUM_0 as title,A.DLVDAT_0 as date, 'Pick Ticket' as type, C.BPTNAM_0,
    (SELECT TEXTE_0 FROM .ATEXTRA WHERE CODFIC_0='TABMODELIV' AND IDENT1_0= A.MDL_0 AND ZONE_0='DESAXX' AND LANGUE_0='ENG')As MDL_DESC
    FROM x3v11gsfdata.GSFUAT.STOPREH A 
    LEFT OUTER JOIN x3v11gsfdata.GSFUAT.BPCUSTOMER B ON A.BPCORD_0 = B.BPCNUM_0 
    LEFT OUTER JOIN x3v11gsfdata.GSFUAT.BPCARRIER C ON A.BPTNUM_0 = C.BPTNUM_0
    WHERE DLVFLG_0 < 3 AND STOFCY_0= @site AND A.BPCORD_0=@x3user`));
    return result.recordset;
  } catch (error) {
    console.log(error);
  }
};

async function getSalesReturns(req) {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('site', sql.NVarChar, req.body.site)
      .input('x3user', sql.NVarChar, req.user.sub[0].X3USER_0)
      .query(`SELECT A.STOFCY_0,A.RTNDAT_0,BPCORD_0,BPCNAM_0,A.SRHNUM_0,MDL_0,XX10C_BPTNUM_0,XX10C_NETWEI_0,XX10C_WEU_0,XX10C_VOL_0,XX10C_VOU_0,
      A.BPAADD_0,A.BPDADDLIG_0,A.BPDADDLIG_1,A.BPDPOSCOD_0,A.BPDCTY_0,A.BPDCRY_0,XDLV_STATUS_0,A.SRHNUM_0 as title, A.RTNDAT_0 as date, D.BPTNAM_0,
    (SELECT TEXTE_0 FROM .ATEXTRA WHERE CODFIC_0='TABMODELIV' AND IDENT1_0= A.MDL_0 AND ZONE_0='DESAXX' AND LANGUE_0='ENG')As MDL_DESC, 'Sales Return' as type 
    FROM x3v11gsfdata.GSFUAT.SRETURN A
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.BPCUSTOMER B ON A.BPCORD_0 = B.BPCNUM_0
      LEFT OUTER JOIN  x3v11gsfdata.GSFUAT.SRETURND C ON A.SRHNUM_0 = C.SRHNUM_0 AND SRDLIN_0 = 1000
    LEFT OUTER JOIN x3v11gsfdata.GSFUAT.BPCARRIER D ON A.XX10C_BPTNUM_0 = D.BPTNUM_0
      WHERE RTNSTOUPD_0 < 2 AND A.STOFCY_0= @site AND A.BPCORD_0=@x3user`));
    return result.recordset;
  } catch (error) {
    console.log(error);
  }
};

async function getPurchaseReturns(req) {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('site', sql.NVarChar, req.body.site)
      .input('x3user', sql.NVarChar, req.user.sub[0].X3USER_0)
      .query(`SELECT A.PNHFCY_0,RTNDAT_0,A.BPSNUM_0,BPSNAM_0,PNHNUM_0,A.MDL_0,A.BPTNUM_0,A.TOTNETWEI_0,A.WEU_0,A.TOTVOL_0,A.VOU_0,
      A.BPAADD_0,A.BPAADDLIG_0,A.BPAADDLIG_1,A.POSCOD_0,A.CTY_0,A.CRY_0,XDLV_STATUS_0,A.PNHNUM_0 as title, 
    A.RTNDAT_0 as date, 'Purchase Return' as type, C.FCYNAM_0, D.BPTNAM_0,
    (SELECT TEXTE_0 FROM .ATEXTRA WHERE CODFIC_0='TABMODELIV' AND IDENT1_0= A.MDL_0 AND ZONE_0='DESAXX' AND LANGUE_0='ENG')As MDL_DESC
    FROM x3v11gsfdata.GSFUAT.PRETURN A
    INNER JOIN x3v11gsfdata.GSFUAT.FACILITY C ON A.PNHFCY_0 = C.FCY_0
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.BPSUPPLIER B ON A.BPSNUM_0 = B.BPSNUM_0
    LEFT OUTER JOIN x3v11gsfdata.GSFUAT.BPCARRIER D ON A.BPTNUM_0 = D.BPTNUM_0
      WHERE CFMFLG_0 = 1 AND PNHFCY_0= @site AND A.BPSNUM_0=@x3user`));
    return result.recordset;
  } catch (error) {
    console.log(error);
  }
};

async function getPickups(req) {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('site', sql.NVarChar, req.body.site)
      .input('x3user', sql.NVarChar, req.user.sub[0].X3USER_0)
      .query(`SELECT XPRHFCY_0,XRCPDAT_0,A.XBPSNUM_0,BPSNAM_0,XPTHNUM_0,A.MDL_0,A.XBPTNUM_0,A.XTOTNETWEI_0,A.XWEU_0,A.XTOTVOL_0,XVOU_0,A.XBPOADD_0, A.XBPOADDLIG_0,A.XBPOADDLIG_1,A.XBPOPOSCOD_0,A.XBPOCTY_0,A.XBPOCRY_0,XDLV_STATUS_0,A.XPTHNUM_0 as title, A.XRCPDAT_0 as date, 'Pickup' as type, C.FCYNAM_0, D.BPTNAM_0, (SELECT TEXTE_0 FROM .ATEXTRA WHERE CODFIC_0='TABMODELIV' AND IDENT1_0= A.MDL_0 AND ZONE_0='DESAXX' AND LANGUE_0='ENG')As MDL_DESC	   
      FROM x3v11gsfdata.GSFUAT.XX10CREC A
      INNER JOIN x3v11gsfdata.GSFUAT.FACILITY C ON A.XPRHFCY_0 = C.FCY_0
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.BPSUPPLIER B ON A.XBPSNUM_0 = B.BPSNUM_0
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.BPCARRIER D ON A.XBPTNUM_0 = D.BPTNUM_0
      WHERE AND XPRHFCY_0= @site AND A.XBPSNUM_0 = @x3user`));
    return result.recordset;
  } catch (error) {
    console.log(error);
  }
};

async function getSalesInvoice(req) {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('site', sql.NVarChar, req.body.site)
      .input('x3user', sql.NVarChar, req.user.sub[0].X3USER_0)
      .query(`Select A.FCY_0, A.ACCDAT_0, A.BPR_0, A.BPRNAM_0, A.NUM_0, B.FFWNUM_0, B.EECTRN_0, B.DSPTOTWEI_0, B.DSPWEU_0, B.DSPTOTVOL_0, B.DSPVOU_0, B.BPAADD_0, B.BPDADDLIG_0, B.BPDADDLIG_1, B.BPDADDLIG_2, B.BPDPOSCOD_0, B.BPDCTY_0, B.BPDCRYNAM_0, A.NUM_0 as title, A.ACCDAT_0 as date, 'Sales Invoice' as type
      FROM x3v11gsfdata.GSFUAT.SINVOICE A 
      INNER JOIN x3v11gsfdata.GSFUAT.SINVOICEV B ON A.NUM_0 = B.NUM_0 
      WHERE A.FCY_0 = @site AND A.BPR_0 = @x3user`));
    return result.recordset;
  } catch (error) {
    console.log(error);
  }
};

async function getPurchaseInvoice(req) {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('site', sql.NVarChar, req.body.site)
      .input('x3user', sql.NVarChar, req.user.sub[0].X3USER_0)
      .query(`Select A.NUM_0, A.FCY_0, A.ACCDAT_0, A.BPR_0, A.BPRNAM_0, A.FFWNUM_0, A.EECTRN_0, B.TOTLINWEU_0, B.DSPWEU_0, B.TOTLINVOU_0, 
      B.DSPVOU_0, A.BPAINV_0, A.BPAADDLIG_0, A.BPAADDLIG_1, A.BPAADDLIG_2, A.POSCOD_0, A.CTY_0, A.CRYNAM_0, 
    A.NUM_0 as title, A.ACCDAT_0 as date, 'Purchase Invoice' as type, C.FCYNAM_0
     From x3v11gsfdata.GSFUAT.PINVOICE A 
     INNER JOIN x3v11gsfdata.GSFUAT.PINVOICEV B ON A.NUM_0 = B.NUM_0 
   INNER JOIN x3v11gsfdata.GSFUAT.FACILITY C ON A.FCY_0 = C.FCY_0
     WHERE A.FCY_0 = @site AND A.BPR_0 = @x3user`));
    return result.recordset;
  } catch (error) {
    console.log(error);
  }
};

async function getPurchaseReceipt(req) {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('site', sql.NVarChar, req.body.site)
      .input('x3user', sql.NVarChar, req.user.sub[0].X3USER_0)
      .query(`SELECT A.PTHNUM_0, A.PRHFCY_0, A.RCPDAT_0, A.BPSNUM_0, A.BPONAM_0, A.BPTNUM_0, A.MDL_0, A.TOTGROWEI_0, A.WEU_0, A.TOTVOL_0, A.VOU_0, A.BPAADD_0, 
      A.BPOADDLIG_0, A.BPOADDLIG_1, A.BPOADDLIG_2, A.BPOPOSCOD_0, A.BPOCTY_0, A.BPOCRYNAM_0, A.PTHNUM_0 as title, A.RCPDAT_0 as date, 
      'Purchase Receipt' as type, B.FCYNAM_0, C.BPTNAM_0,
      (SELECT TEXTE_0 FROM .ATEXTRA WHERE CODFIC_0='TABMODELIV' AND IDENT1_0= A.MDL_0 AND ZONE_0='DESAXX' AND LANGUE_0='ENG')As MDL_DESC
      FROM x3v11gsfdata.GSFUAT.PRECEIPT A
      INNER JOIN x3v11gsfdata.GSFUAT.FACILITY B ON A.PRHFCY_0 = B.FCY_0
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.BPCARRIER C ON A.BPTNUM_0 = C.BPTNUM_0
      WHERE PRHFCY_0 = @site AND BPSNUM_0 = @x3user`));
    return result.recordset;
  } catch (error) {
    console.log(error);
  }
};