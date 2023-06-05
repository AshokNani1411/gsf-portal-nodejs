const dbConnection = require('../models/db');
const sql = require('mssql');
const moment = require('moment');
var crypto = require("crypto");

exports.getAllPickupRequests = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('x3user', sql.NVarChar, req.body.x3user)
      .input('site', sql.NVarChar, req.body.site)
      .query(`SELECT A.POHFCY_0, A.XPICKID_0, A.ORDDAT_0, A.BPSNUM_0, A.ORDREF_0, A.CUR_0, A.XPOHFLG_0, A.XODRNUM_0, A.XPICKUPTYP_0, A.XRECPTNO_0, A.XADDCOD_0, 
      A.XBPTNUM_0, A.XMDL_0, 
      (Select PTHNUM_0 From x3v11gsfdata.GSFUAT.PRECEIPTD Where POHNUM_0 = A.XODRNUM_0 AND POHNUM_0 != '' AND PTDLIN_0 = 1000) AS PTHNUM_0
      FROM x3v11gsfdata.GSFUAT.XPICKUPH A
      WHERE A.POHFCY_0=@site AND A.BPSNUM_0=@x3user
      ORDER BY XPICKID_0 DESC`));
      // .query("SELECT POHFCY_0, XPICKID_0, ORDDAT_0, BPSNUM_0, ORDREF_0, CUR_0, XPOHFLG_0, XODRNUM_0, XPICKUPTYP_0, XRECPTNO_0, XADDCOD_0, XBPTNUM_0, XMDL_0 FROM XPICKUPH WHERE POHFCY_0=@site AND BPSNUM_0=@x3user ORDER BY XPICKID_0 DESC"));
    res.json({
      success: true,
      data: result.recordset
    });
  } catch (error) {
    return next(error);
  }
};

exports.createPickupRequest = async (req, res, next) => {
  try {
    req.body.site = req.body.site.split("(")[0].trim();
    req.body.customer = req.body.customer.split("(")[0].trim();
    if (req.body.id) {
      const pickupReqId = req.body.id;
      const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      const result = await dbConnection.then(pool => pool.request()
        .input('pickupReqId', sql.Int, pickupReqId)
        .input('date', sql.NVarChar, req.body.date)
        .input('reference', sql.NVarChar, req.body.reference)
        .input('comment', sql.NVarChar, req.body.comment)
        .input('address', sql.NVarChar, req.body.address)
        .input('carrier', sql.NVarChar, req.body.carrier)
        .input('mode', sql.NVarChar, req.body.delivery_mode)
        .input('exchange', sql.NVarChar, req.body.exchange)
        .input('currentTime', sql.DateTime, currentDate)
        .input('byUser', sql.NVarChar, 'Admin')
        .query("UPDATE XPICKUPH SET ORDDAT_0 = @date,ORDREF_0 = @reference,XCOMMENT_0 = @comment, XADDCOD_0 = @address, XBPTNUM_0 = @carrier, XMDL_0 = @mode, XEXCHNG_0 = @exchange, UPDDATTIM_0 = @currentTime,UPDUSR_0 = @byUser WHERE XPICKID_0 = @pickupReqId"));

      await dbConnection.then(pool => pool.request()
        .input('id', sql.NVarChar, pickupReqId)
        .query("DELETE XPICKUPD WHERE XPICKID_0 = @id;"));

      req.body.products.map(async (product, index) => {
        const products = await dbConnection.then(pool => pool.request()
          .input('pickupReqId', sql.Int, pickupReqId)
          .input('site', sql.NVarChar, req.body.site)
          .input('date', sql.NVarChar, req.body.date)
          .input('lineNo', sql.Int, 1000 * (index + 1))
          .input('productCode', sql.NVarChar, product.product_code)
          .input('description', sql.NVarChar, product.description)
          .input('sau', sql.NVarChar, product.sau)
          .input('quantity', sql.Float, product.quantity)
          .input('price', sql.Float, product.price)
          .input('lineAmount', sql.Float, product.line_amount)
          .input('currentTime', sql.DateTime, currentDate)
          .input('uuid', sql.Binary, Buffer.from(crypto.randomBytes(8).toString('hex')))
          .input('byUser', sql.NVarChar, 'Admin')
          .query(`INSERT INTO XPICKUPD (XPICKID_0,XLINNO_0,ITMREF_0,ITMDES_0,PRHFCY_0,UOM_0,QTYUOM_0,EXTRCPDAT_0,GROPRI_0,DISCRGVAL1_0,DISCRGVAL2_0,DISCRGVAL3_0, XLINAMT_0,CREDATTIM_0,UPDDATTIM_0,AUUID_0,CREUSR_0,UPDUSR_0) VALUES (@pickupReqId, @lineNo, @productCode, @description, @site, @sau, @quantity, @date, @price, 0, 0, 0, @lineAmount, @currentTime, @currentTime, @uuid, @byUser, @byUser)`)
        );
      });
      res.json({
        success: true,
        data: null,
        message: 'Pickup request updated successfully.'
      });
    } else {
      const getId = await dbConnection.then(pool => pool.request().query('SELECT MAX(XPICKID_0)+1 as ID From XPICKUPH'));
      if (getId && getId.recordset[0].ID) {
        const pickupReqId = getId.recordset[0].ID;
        const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        const result = await dbConnection.then(pool => pool.request()
          .input('pickupReqId', sql.Int, pickupReqId)
          .input('site', sql.NVarChar, req.body.site)
          .input('customer', sql.NVarChar, req.body.customer)
          .input('date', sql.NVarChar, req.body.date)
          .input('reference', sql.NVarChar, req.body.reference)
          .input('currency', sql.NVarChar, req.body.currency)
          .input('comment', sql.NVarChar, req.body.comment)
          .input('exchange', sql.NVarChar, req.body.exchange)
          .input('address', sql.NVarChar, req.body.address)
          .input('carrier', sql.NVarChar, req.body.carrier)
          .input('mode', sql.NVarChar, req.body.delivery_mode)
          .input('currentTime', sql.DateTime, currentDate)
          .input('uuid', sql.Binary, Buffer.from(crypto.randomBytes(8).toString('hex')))
          .input('byUser', sql.NVarChar, 'Admin')
          .query("INSERT INTO XPICKUPH (POHFCY_0,XPICKID_0,ORDDAT_0,BPSNUM_0,ORDREF_0,CUR_0,XPOHFLG_0,XODRNUM_0,XRECPTNO_0,XINVNO_0,XODRFLAG_0,XPICKUPTYP_0,XTRA_0,CREDATTIM_0,UPDDATTIM_0,AUUID_0,CREUSR_0,UPDUSR_0,XEXCHNG_0,XCOMMENT_0,XSLOT_0,XADDCOD_0,XBPTNUM_0,XMDL_0) VALUES (@site, @pickupReqId, @date, @customer, @reference, @currency, 0, '', '', '', 0, 0, '', @currentTime, @currentTime, @uuid, @byUser, @byUser, @exchange, @comment, 0, @address, @carrier, @mode)"));

        req.body.products.map(async (product, index) => {
          const products = await dbConnection.then(pool => pool.request()
            .input('pickupReqId', sql.Int, pickupReqId)
            .input('site', sql.NVarChar, req.body.site)
            .input('date', sql.NVarChar, req.body.date)
            .input('lineNo', sql.Int, 1000 * (index + 1))
            .input('productCode', sql.NVarChar, product.product_code)
            .input('description', sql.NVarChar, product.description)
            .input('sau', sql.NVarChar, product.sau)
            .input('quantity', sql.Float, product.quantity)
            .input('price', sql.Float, product.price)
            .input('lineAmount', sql.Float, product.line_amount)
            .input('currentTime', sql.DateTime, currentDate)
            .input('uuid', sql.Binary, Buffer.from(crypto.randomBytes(8).toString('hex')))
            .input('byUser', sql.NVarChar, 'Admin')
            .query(`INSERT INTO XPICKUPD (XPICKID_0,XLINNO_0,ITMREF_0,ITMDES_0,PRHFCY_0,UOM_0,QTYUOM_0,EXTRCPDAT_0,GROPRI_0,DISCRGVAL1_0,DISCRGVAL2_0,DISCRGVAL3_0, XLINAMT_0,CREDATTIM_0,UPDDATTIM_0,AUUID_0,CREUSR_0,UPDUSR_0) VALUES (@pickupReqId, @lineNo, @productCode, @description, @site, @sau, @quantity, @date, @price, 0, 0, 0, @lineAmount, @currentTime, @currentTime, @uuid, @byUser, @byUser)`)
          );
        });

        res.json({
          success: true,
          data: null,
          message: 'Pickup request created successfully.'
        });
      }
    }
  } catch (error) {
    return next(error);
  }
};

exports.getPickupRequestDetail = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('pickupReqId', sql.NVarChar, req.params.id)
      .query(`SELECT A.POHFCY_0, A.XPICKID_0, A.ORDDAT_0, A.BPSNUM_0, A.ORDREF_0, A.CUR_0, A.XPOHFLG_0, A.XODRNUM_0, A.XPICKUPTYP_0, A.XRECPTNO_0, A.XEXCHNG_0, A.XCOMMENT_0, A.XADDCOD_0, A.XBPTNUM_0, A.XMDL_0, B.FCYNAM_0, C.BPRNAM_0
      FROM x3v11gsfdata.GSFUAT.XPICKUPH A
      INNER JOIN x3v11gsfdata.GSFUAT.FACILITY B ON A.POHFCY_0 = B.FCY_0
      INNER JOIN x3v11gsfdata.GSFUAT.BPARTNER C ON A.BPSNUM_0 = C.BPRNUM_0
      WHERE XPICKID_0=@pickupReqId`));
    if (result && result.recordset[0]) {
      products = await dbConnection.then(pool => pool.request()
        .input('pickupReqId', sql.NVarChar, req.params.id)
        .query('SELECT ROWID as id, ITMREF_0 as product_code, ITMDES_0 as description, UOM_0 as sau, QTYUOM_0 as quantity, GROPRI_0 as price, XLINAMT_0 as line_amount FROM XPICKUPD WHERE XPICKID_0 = @pickupReqId')
      );
      result.recordset[0].products = products.recordset
      res.json({
        success: true,
        data: result.recordset[0]
      });
    }
  } catch (error) {
    return next(error);
  }
};

exports.deletePickupRequest = async (req, res, next) => {
  try {
    await dbConnection.then(pool => pool.request()
      .input('id', sql.NVarChar, req.body.id)
      .query("DELETE XPICKUPH WHERE XPICKID_0 = @id; DELETE XPICKUPD WHERE XPICKID_0 = @id;"));
    res.json({
      success: true,
      message: "Pickup Request Deleted."
    });
  } catch (error) {
    return next(error);
  }
};