const dbConnection = require('../models/db');

exports.getAll = async (req, res, next) => {
  try {
    let query = '';
    if (req.body.site) {
      switch (req.body.doc_type) {
        case 'DELIVERY':
          query = `SELECT SALFCY_0,BPCORD_0,BPCNAM_0,SDHNUM_0,DLVDAT_0,XX10C_GEOX_0,XX10C_GEOY_0,'DELIVERY' AS DOCTYP FROM x3v11gsfdata.GSFUAT.SDELIVERY A LEFT OUTER JOIN x3v11gsfdata.GSFUAT.BPCUSTOMER B ON A.BPCORD_0 = B.BPCNUM_0 WHERE CFMFLG_0 = 1 AND A.BPCORD_0='${req.user.sub[0].X3USER_0}'`;
          if (req.body.site) {
            query += ` AND SALFCY_0 = '${req.body.site}'`;
          }
          if (req.body.from_date && req.body.to_date) {
            query += ` AND DLVDAT_0 BETWEEN '${req.body.from_date}' AND '${req.body.to_date}'`;
          }
          break;
        case 'SALES ORDER':
          query = `SELECT SALFCY_0,BPCORD_0,B.BPCNAM_0,SOHNUM_0,ORDDAT_0,XX10C_GEOX_0,XX10C_GEOY_0,'SALES ORDER' AS DOCTYP 
          FROM x3v11gsfdata.GSFUAT.SORDER A LEFT OUTER JOIN x3v11gsfdata.GSFUAT.BPCUSTOMER B ON A.BPCORD_0 = B.BPCNUM_0 WHERE A.BPCORD_0='${req.user.sub[0].X3USER_0}'`;
          if (req.body.site) {
            query += ` AND SALFCY_0 = '${req.body.site}'`;
          }
          if (req.body.from_date && req.body.to_date) {
            query += ` AND ORDDAT_0 BETWEEN '${req.body.from_date}' AND '${req.body.to_date}'`;
          }
          break;
        case 'PURCHASE ORDER':
          query = `SELECT POHFCY_0,B.BPSNUM_0,BPRNAM_0,POHNUM_0,ORDDAT_0,XX10C_GEOX_0,XX10C_GEOY_0,'PURCHASE ORDER' AS DOCTYP FROM x3v11gsfdata.GSFUAT.PORDER A LEFT OUTER JOIN x3v11gsfdata.GSFUAT.BPSUPPLIER B ON A.BPSNUM_0 = B.BPSNUM_0 WHERE A.BPSNUM_0='${req.user.sub[0].X3USER_0}'`;
          if (req.body.site) {
            query += ` AND POHFCY_0 = '${req.body.site}'`;
          }
          if (req.body.from_date && req.body.to_date) {
            query += ` AND ORDDAT_0 BETWEEN '${req.body.from_date}' AND '${req.body.to_date}'`;
          }
          break;
        case 'PICK TICKET':
          query = `SELECT STOFCY_0,BPCORD_0,BPCNAM_0,PRHNUM_0,DLVDAT_0,XX10C_GEOX_0,XX10C_GEOY_0,'PICK TICKET' AS DOCTYP FROM x3v11gsfdata.GSFUAT.STOPREH A LEFT OUTER JOIN x3v11gsfdata.GSFUAT.BPCUSTOMER B ON A.BPCORD_0 = B.BPCNUM_0 WHERE DLVFLG_0 < 3 AND A.BPCORD_0='${req.user.sub[0].X3USER_0}'`;
          if (req.body.site) {
            query += ` AND STOFCY_0 = '${req.body.site}'`;
          }
          if (req.body.from_date && req.body.to_date) {
            query += ` AND DLVDAT_0 BETWEEN '${req.body.from_date}' AND '${req.body.to_date}'`;
          }
          break;
        case 'SALES RETURN':
          query = `SELECT A.STOFCY_0,BPCORD_0,BPCNAM_0,A.SRHNUM_0,A.RTNDAT_0,XX10C_GEOX_0,XX10C_GEOY_0,'SALES RETURN' AS DOCTYP  FROM x3v11gsfdata.GSFUAT.SRETURN A LEFT OUTER JOIN x3v11gsfdata.GSFUAT.BPCUSTOMER B ON A.BPCORD_0 = B.BPCNUM_0 LEFT OUTER JOIN  x3v11gsfdata.GSFUAT.SRETURND C ON A.SRHNUM_0 = C.SRHNUM_0 AND SRDLIN_0 = 1000 WHERE RTNSTOUPD_0 < 2 AND A.BPCORD_0='${req.user.sub[0].X3USER_0}'`;
          if (req.body.site) {
            query += ` AND A.STOFCY_0 = '${req.body.site}'`;
          }
          if (req.body.from_date && req.body.to_date) {
            query += ` AND A.RTNDAT_0 BETWEEN '${req.body.from_date}' AND '${req.body.to_date}'`;
          }
          break;
        case 'PURCHASE RETURN':
          query = `SELECT PNHFCY_0,A.BPSNUM_0,BPSNAM_0,A.PNHNUM_0,A.RTNDAT_0,XX10C_GEOX_0,XX10C_GEOY_0,'PURCHASE RETURN' AS DOCTYP FROM x3v11gsfdata.GSFUAT.PRETURN A LEFT OUTER JOIN x3v11gsfdata.GSFUAT.BPSUPPLIER B ON A.BPSNUM_0 = B.BPSNUM_0 WHERE CFMFLG_0 = 1 AND A.BPSNUM_0='${req.user.sub[0].X3USER_0}'`;
          if (req.body.site) {
            query += ` AND PNHFCY_0 = '${req.body.site}'`;
          }
          if (req.body.from_date && req.body.to_date) {
            query += ` AND A.RTNDAT_0 BETWEEN '${req.body.from_date}' AND '${req.body.to_date}'`;
          }
          break;
        case 'PURCHASE PICKUP':
          query = `SELECT XPRHFCY_0,A.XBPSNUM_0,BPSNAM_0,A.XPTHNUM_0,XRCPDAT_0,XX10C_GEOX_0,XX10C_GEOY_0,'PURCHASE PICKUP' AS DOCTYP FROM x3v11gsfdata.GSFUAT.XX10CREC A LEFT OUTER JOIN x3v11gsfdata.GSFUAT.BPSUPPLIER B ON A.XBPSNUM_0 = B.BPSNUM_0 WHERE A.XBPSNUM_0='${req.user.sub[0].X3USER_0}'`;
          if (req.body.site) {
            query += ` AND XPRHFCY_0 = '${req.body.site}'`;
          }
          if (req.body.from_date && req.body.to_date) {
            query += ` AND XRCPDAT_0 BETWEEN '${req.body.from_date}' AND '${req.body.to_date}'`;
          }
          break;
        case 'PICKUP REQUEST':
          query = `SELECT A.XPICKID_0,A.XODRNUM_0,A.XRECPTNO_0,A.POHFCY_0,B.ORDDAT_0,A.BPSNUM_0,C.BPSNAM_0,B.BPTNUM_0,B.MDL_0,B.TOTLINWEU_0,DSPWEU_0, B.TOTLINVOU_0,B.DSPVOU_0,B.BPOADD_0,B.BPOADDLIG_0,B.BPOADDLIG_1,B.BPOADDLIG_2,B.BPOPOSCOD_0,BPOCTY_0,BPOCRY_0,XPICKUPTYP_0,XPOHFLG_0, D.XX10C_GEOX_0,D.XX10C_GEOY_0, 'PICKUP REQUEST' AS DOCTYP from x3v11gsfdata.GSFUAT.XPICKUPH A
        LEFT OUTER JOIN x3v11gsfdata.GSFUAT.PORDER B ON A.XODRNUM_0 = B.POHNUM_0
        LEFT OUTER JOIN x3v11gsfdata.GSFUAT.BPSUPPLIER C ON A.BPSNUM_0 = C.BPSNUM_0
        LEFT OUTER JOIN x3v11gsfdata.GSFUAT.BPADDRESS D ON D.BPATYP_0 = 1 AND A.BPSNUM_0 = D.BPANUM_0 AND B.BPAADD_0 = D.BPAADD_0 WHERE 1=1 AND A.BPSNUM_0='${req.user.sub[0].X3USER_0}'`;
          if (req.body.site) {
            query += ` AND A.POHFCY_0 = '${req.body.site}'`;
          }
          if (req.body.from_date && req.body.to_date) {
            query += ` AND B.ORDDAT_0 BETWEEN '${req.body.from_date}' AND '${req.body.to_date}'`;
          }
          break;
        case 'DROP REQUEST':
          query = `SELECT XPRHFCY_0,A.XBPSNUM_0,BPSNAM_0,A.XPTHNUM_0,XRCPDAT_0,XX10C_GEOX_0,XX10C_GEOY_0,'PURCHASE PICKUP' AS DOCTYP FROM x3v11gsfdata.GSFUAT.XX10CREC A LEFT OUTER JOIN x3v11gsfdata.GSFUAT.BPSUPPLIER B ON A.XBPSNUM_0 = B.BPSNUM_0 WHERE A.XBPSNUM_0='${req.user.sub[0].X3USER_0}'`;
          if (req.body.site) {
            query += ` AND XPRHFCY_0 = '${req.body.site}'`;
          }
          if (req.body.from_date && req.body.to_date) {
            query += ` AND XRCPDAT_0 BETWEEN '${req.body.from_date}' AND '${req.body.to_date}'`;
          }
          break;
        case 'SALES INVOICE':
          query = `Select A.FCY_0, A.BPR_0, A.BPRNAM_0, A.NUM_0, A.ACCDAT_0, B.XX10C_GEOX_0, B.XX10C_GEOY_0, 'SALES INVOICE' AS DOCTYP 
          FROM x3v11gsfdata.GSFUAT.SINVOICE A 
          INNER JOIN x3v11gsfdata.GSFUAT.BPADDRESS B ON A.BPR_0 = B.BPANUM_0 AND B.BPATYP_0 = 1 AND A.BPAINV_0 = B.BPAADD_0
          WHERE A.BPR_0='${req.user.sub[0].X3USER_0}'`;
          if (req.body.site) {
            query += ` AND A.FCY_0 = '${req.body.site}'`;
          }
          if (req.body.from_date && req.body.to_date) {
            query += ` AND A.ACCDAT_0 BETWEEN '${req.body.from_date}' AND '${req.body.to_date}'`;
          }
          break;
        case 'PURCHASE RECEIPT':
          query = `Select PRHFCY_0, BPSNUM_0, BPONAM_0, PTHNUM_0, RCPDAT_0, XX10C_GEOX_0, XX10C_GEOY_0, 'PURCHASE RECEIPT' AS DOCTYP FROM x3v11gsfdata.GSFUAT.PRECEIPT WHERE BPSNUM_0='${req.user.sub[0].X3USER_0}'`;
          if (req.body.site) {
            query += ` AND PRHFCY_0 = '${req.body.site}'`;
          }
          if (req.body.from_date && req.body.to_date) {
            query += ` AND RCPDAT_0 BETWEEN '${req.body.from_date}' AND '${req.body.to_date}'`;
          }
          break;
        case 'PURCHASE INVOICE':
          query = `Select A.FCY_0, A.BPR_0, A.BPRNAM_0, A.NUM_0, A.ACCDAT_0, B.XX10C_GEOX_0, B.XX10C_GEOY_0, 'PURCHASE INVOICE' AS DOCTYP FROM x3v11gsfdata.GSFUAT.PINVOICE A 
          INNER JOIN x3v11gsfdata.GSFUAT.BPADDRESS B ON A.BPR_0 = B.BPANUM_0 AND B.BPATYP_0 = 1 AND A.BPAINV_0 = B.BPAADD_0 
          WHERE A.BPR_0='${req.user.sub[0].X3USER_0}'`;
          if (req.body.site) {
            query += ` AND A.FCY_0 = '${req.body.site}'`;
          }
          if (req.body.from_date && req.body.to_date) {
            query += ` AND A.ACCDAT_0 BETWEEN '${req.body.from_date}' AND '${req.body.to_date}'`;
          }
          break;
        default:
          query = `SELECT * FROM (
          SELECT SALFCY_0,BPCORD_0,BPCNAM_0,SDHNUM_0,DLVDAT_0,XX10C_GEOX_0,XX10C_GEOY_0,'DELIVERY' AS DOCTYP FROM x3v11gsfdata.GSFUAT.SDELIVERY A LEFT OUTER JOIN x3v11gsfdata.GSFUAT.BPCUSTOMER B ON A.BPCORD_0 = B.BPCNUM_0 WHERE CFMFLG_0 = 1
          UNION ALL
          SELECT STOFCY_0,BPCORD_0,BPCNAM_0,PRHNUM_0,DLVDAT_0,XX10C_GEOX_0,XX10C_GEOY_0,'PICK TICKET' AS DOCTYP FROM x3v11gsfdata.GSFUAT.STOPREH A LEFT OUTER JOIN x3v11gsfdata.GSFUAT.BPCUSTOMER B ON A.BPCORD_0 = B.BPCNUM_0 WHERE DLVFLG_0 < 3
          UNION ALL
          SELECT A.STOFCY_0,BPCORD_0,BPCNAM_0,A.SRHNUM_0,A.RTNDAT_0,XX10C_GEOX_0,XX10C_GEOY_0,'SALES RETURN' AS DOCTYP  FROM x3v11gsfdata.GSFUAT.SRETURN A LEFT OUTER JOIN x3v11gsfdata.GSFUAT.BPCUSTOMER B ON A.BPCORD_0 = B.BPCNUM_0 LEFT OUTER JOIN  x3v11gsfdata.GSFUAT.SRETURND C ON A.SRHNUM_0 = C.SRHNUM_0 AND SRDLIN_0 = 1000 WHERE RTNSTOUPD_0 < 2
          UNION ALL
          SELECT PNHFCY_0,A.BPSNUM_0,BPSNAM_0,A.PNHNUM_0,A.RTNDAT_0,XX10C_GEOX_0,XX10C_GEOY_0,'PURCHASE RETURN' AS DOCTYP FROM x3v11gsfdata.GSFUAT.PRETURN A LEFT OUTER JOIN x3v11gsfdata.GSFUAT.BPSUPPLIER B ON A.BPSNUM_0 = B.BPSNUM_0 WHERE CFMFLG_0 = 1
          UNION ALL
          SELECT XPRHFCY_0,A.XBPSNUM_0,BPSNAM_0,A.XPTHNUM_0,XRCPDAT_0,XX10C_GEOX_0,XX10C_GEOY_0,'PURCHASE PICKUP' AS DOCTYP FROM x3v11gsfdata.GSFUAT.XX10CREC A LEFT OUTER JOIN x3v11gsfdata.GSFUAT.BPSUPPLIER B ON A.XBPSNUM_0 = B.BPSNUM_0
        )Z WHERE 1 = 1`;
          break;
      }
      const result = await dbConnection.then(pool => pool.request()
        .query(query));
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