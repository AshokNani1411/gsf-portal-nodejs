const dbConnection = require('../models/db');
const sql = require('mssql');
const moment = require('moment');
var crypto = require("crypto");

exports.getAllDropRequests = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('x3user', sql.NVarChar, req.body.x3user)
      .input('site', sql.NVarChar, req.body.site)
      .query("SELECT SALFCY_0, SOHTYP_0, XDROPID_0, BPCORD_0, ORDDAT_0, CUSORDREF_0, STOFCY_0, CUR_0, XSOHFLG_0, XODRNUM_0, XODRFLAG_0, XDROPTYP_0, XTOTAMT_0, XTOTQTY_0, XDLVYNO_0, XADDCOD_0, XBPTNUM_0, XMDL_0 FROM XDROPH WHERE SALFCY_0=@site AND BPCORD_0=@x3user ORDER BY XDROPID_0 DESC"));
    res.json({
      success: true,
      data: result.recordset
    });
  } catch (error) {
    return next(error);
  }
};






exports.createDropRequest = async (req, res, next) => {
  try {
    req.body.site = req.body.site.split("(")[0].trim();
    req.body.customer = req.body.customer.split("(")[0].trim();
    if (req.body.id) {
      const dropReqId = req.body.id;
      const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      const result = await dbConnection.then(pool => pool.request()
        .input('dropReqId', sql.Int, dropReqId)
        .input('date', sql.NVarChar, req.body.date)
        .input('reference', sql.NVarChar, req.body.reference)
        .input('totalAmt', sql.Float, req.body.total_amt)
        .input('totalQty', sql.Float, req.body.total_qty)
        .input('comment', sql.NVarChar, req.body.comment)
        .input('address', sql.NVarChar, req.body.address)
        .input('carrier', sql.NVarChar, req.body.carrier)
        .input('mode', sql.NVarChar, req.body.delivery_mode)
        .input('currentTime', sql.DateTime, currentDate)
        .input('byUser', sql.NVarChar, 'Admin')
        .query("UPDATE XDROPH SET ORDDAT_0 = @date,CUSORDREF_0 = @reference,XTOTAMT_0 = @totalAmt,XTOTQTY_0 = @totalQty,XCOMMENT_0 = @comment, XADDCOD_0 = @address, XBPTNUM_0 = @carrier, XMDL_0 = @mode,UPDDATTIM_0 = @currentTime,UPDUSR_0 = @byUser WHERE XDROPID_0 = @dropReqId"));

      await dbConnection.then(pool => pool.request()
        .input('id', sql.NVarChar, dropReqId)
        .query("DELETE XDROPD WHERE XDROPID_0 = @id;"));

      req.body.products.map(async (product, index) => {
        const products = await dbConnection.then(pool => pool.request()
          .input('dropReqId', sql.Int, dropReqId)
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
          .query(`INSERT INTO XDROPD (XDROPID_0,XLINNO_0,ITMREF_0,ITMDES_0,SAU_0,QTY_0,GROPRI_0,DISCRGVAL1_0,DISCRDVAL2_0,DISCRGVAL3_0,XLINAMT_0,CREDATTIM_0,UPDDATTIM_0,AUUID_0,CREUSR_0,UPDUSR_0) VALUES (@dropReqId, @lineNo, @productCode, @description, @sau, @quantity, @price, 0, 0, 0, @lineAmount, @currentTime, @currentTime, @uuid, @byUser, @byUser)`)
        );
      });
      res.json({
        success: true,
        data: null,
        message: 'Drop request updated successfully.'
      });
    } else {
      const getId = await dbConnection.then(pool => pool.request().query('SELECT MAX(XDROPID_0)+1 as ID From XDROPH'));
      if (getId && getId.recordset[0].ID) {
        const dropReqId = getId.recordset[0].ID;
        const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        const result = await dbConnection.then(pool => pool.request()
          .input('dropReqId', sql.Int, dropReqId)
          .input('site', sql.NVarChar, req.body.site)
          .input('customer', sql.NVarChar, req.body.customer)
          .input('date', sql.NVarChar, req.body.date)
          .input('reference', sql.NVarChar, req.body.reference)
          .input('currency', sql.NVarChar, req.body.currency)
          .input('totalAmt', sql.Float, req.body.total_amt)
          .input('totalQty', sql.Float, req.body.total_qty)
          .input('comment', sql.NVarChar, req.body.comment)
          .input('address', sql.NVarChar, req.body.address)
          .input('carrier', sql.NVarChar, req.body.carrier)
          .input('mode', sql.NVarChar, req.body.delivery_mode)
          .input('currentTime', sql.DateTime, currentDate)
          .input('uuid', sql.Binary, Buffer.from(crypto.randomBytes(8).toString('hex')))
          .input('byUser', sql.NVarChar, 'Admin')
          .query("INSERT INTO XDROPH (SALFCY_0,SOHTYP_0,XDROPID_0,BPCORD_0,ORDDAT_0,CUSORDREF_0,STOFCY_0,CUR_0,XSOHFLG_0,XODRNUM_0,XDLVYNO_0,XATCHLINK_0,XODRFLAG_0,XDROPTYP_0,XTOTAMT_0,XTOTQTY_0,XTRA_0,XCOMMENT_0,CREDATTIM_0,UPDDATTIM_0,AUUID_0,CREUSR_0,UPDUSR_0,XSLOT_0,XADDCOD_0,XBPTNUM_0,XMDL_0) VALUES (@site, 'CDC', @dropReqId, @customer, @date, @reference, @site, @currency, 0, '', '', '', 0, 0, @totalAmt, @totalQty, '', @comment, @currentTime, @currentTime, @uuid, @byUser, @byUser, 0, @address, @carrier, @mode)"));

        req.body.products.map(async (product, index) => {
          const products = await dbConnection.then(pool => pool.request()
            .input('dropReqId', sql.Int, dropReqId)
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
            .query(`INSERT INTO XDROPD (XDROPID_0,XLINNO_0,ITMREF_0,ITMDES_0,SAU_0,QTY_0,GROPRI_0,DISCRGVAL1_0,DISCRDVAL2_0,DISCRGVAL3_0,XLINAMT_0,CREDATTIM_0,UPDDATTIM_0,AUUID_0,CREUSR_0,UPDUSR_0) VALUES (@dropReqId, @lineNo, @productCode, @description, @sau, @quantity, @price, 0, 0, 0, @lineAmount, @currentTime, @currentTime, @uuid, @byUser, @byUser)`)
          );
        });
         //update flag in cart items
         const cartupdation = await dbConnection.then(pool => pool.request()
                   .input('loginuser', sql.NVarChar, req.body.customer)
                   .input('usersite', sql.NVarChar, req.body.site)
                  .query("UPDATE  XCPSOCART  SET XORDEREDFLG = 1  WHERE XLOGINUSER_0 = @loginuser AND XSALFCY_0= @usersite AND XORDEREDFLG = 0"));

        res.json({
          success: true,
          data: null,
          message: 'Drop request created successfully.'
        });
      }
    }
  } catch (error) {
    return next(error);
  }
};

exports.getDropRequestDetail = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('dropReqId', sql.NVarChar, req.params.id)
      .query(`SELECT A.SALFCY_0, A.SOHTYP_0, A.XDROPID_0, A.BPCORD_0, A.ORDDAT_0, A.CUSORDREF_0, A.STOFCY_0, A.CUR_0, A.XSOHFLG_0, A.XODRNUM_0, A.XODRFLAG_0, A.XDROPTYP_0, A.XTOTAMT_0, A.XTOTQTY_0, A.XDLVYNO_0, A.XCOMMENT_0, A.XADDCOD_0, A.XBPTNUM_0, A.XMDL_0, B.FCYNAM_0, C.BPRNAM_0
      FROM XDROPH A
      INNER JOIN x3v11gsfdata.GSFUAT.FACILITY B ON A.SALFCY_0 = B.FCY_0
      INNER JOIN x3v11gsfdata.GSFUAT.BPARTNER C ON A.BPCORD_0 = C.BPRNUM_0
      WHERE XDROPID_0=@dropReqId`));
    if (result && result.recordset[0]) {
      products = await dbConnection.then(pool => pool.request()
        .input('dropReqId', sql.NVarChar, req.params.id)
        .query(`SELECT D.ROWID as id, D.ITMREF_0 as product_code,M.TCLCOD_0 as categ,A.TEXTE_0 AS categ_desc, D.ITMDES_0 as description, D.SAU_0 as sau, D.QTY_0 as quantity, D.GROPRI_0 as price, D.XLINAMT_0 as line_amount
                FROM DEMOTMSFR.XDROPD D
                LEFT JOIN DEMOTMSFR.ITMMASTER M ON M.ITMREF_0 = D.ITMREF_0
                LEFT JOIN DEMOTMSFR.ATEXTRA A ON M.TCLCOD_0 = A.IDENT1_0 AND  CODFIC_0 ='ITMCATEG' AND LANGUE_0 = 'ENG' AND ZONE_0 = 'TCLAXX' WHERE XDROPID_0 = @dropReqId`));
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

exports.deleteDropRequest = async (req, res, next) => {
  try {
    await dbConnection.then(pool => pool.request()
      .input('id', sql.NVarChar, req.body.id)
      .query("DELETE XDROPH WHERE XDROPID_0 = @id; DELETE XDROPD WHERE XDROPID_0 = @id;"));
    res.json({
      success: true,
      message: "Drop Request Deleted."
    });
  } catch (error) {
    return next(error);
  }
};

//cart
exports.getAllSOCartRequests = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('x3user', sql.NVarChar, req.body.x3user)
      .input('site', sql.NVarChar, req.body.site)
      .query("SELECT XSALFCY_0, XLOGINUSER_0, ITMREF_0,XPRICE_0, ITMDES_0,QTY_0  FROM XCPSOCART WHERE XSALFCY_0=@site AND XLOGINUSER_0=@x3user AND XORDEREDFLG = 0 "));
    res.json({
      success: true,
      data: result.recordset
    });
  } catch (error) {
    return next(error);
  }
};

exports.createSOCartRequest = async (req, res, next) => {
  try {

        const checkresult = await dbConnection.then(pool => pool.request()
          .input('prodcid', sql.NVarChar, req.body.ITMREF_0)
          .input('usercsite', sql.NVarChar, req.body.usersite)
          .input('logincuser', sql.NVarChar, req.body.loginuser)
           .query("SELECT ITMREF_0 FROM XCPSOCART WHERE XLOGINUSER_0 = @logincuser AND XSALFCY_0= @usercsite AND ITMREF_0 = @prodcid AND XORDEREDFLG = 0"));
         if (checkresult.recordset.length > 0) {
          const result = await dbConnection.then(pool => pool.request()
            .input('prodid', sql.NVarChar, req.body.ITMREF_0)
            .input('usersite', sql.NVarChar, req.body.usersite)
            .input('loginuser', sql.NVarChar, req.body.loginuser)
            .input('totalQty', sql.Float, req.body.qty)
               .query("UPDATE  XCPSOCART  SET QTY_0 = @totalQty  WHERE XLOGINUSER_0 = @loginuser AND XSALFCY_0= @usersite AND ITMREF_0 = @prodid AND XORDEREDFLG = 0"));
                    res.json({
                      success: true,
                      data: null,
                      message: 'Quantity Updated successfully.'
                    });
         } else {

    req.body.usersite = req.body.usersite.split("(")[0].trim();
    req.body.loginuser = req.body.loginuser.split("(")[0].trim();
    const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const result = await dbConnection.then(pool => pool.request()
             .input('date', sql.NVarChar, req.body.date)
             .input('prodid', sql.NVarChar, req.body.ITMREF_0)
             .input('price', sql.NVarChar, req.body.BASPRI_0)
             .input('usersite', sql.NVarChar, req.body.usersite)
             .input('loginuser', sql.NVarChar, req.body.loginuser)
             .input('totalQty', sql.Float, req.body.qty)
             .input('proddesc', sql.NVarChar, req.body.ITMDES_0)
              .input('uuid', sql.Binary, Buffer.from(crypto.randomBytes(8).toString('hex')))
              .input('currentTime', sql.DateTime, currentDate)
             .input('byUser', sql.NVarChar, 'Admin')
               .query("INSERT INTO XCPSOCART (UPDTICK_0,XSALFCY_0,XLOGINUSER_0,ITMREF_0,ITMDES_0,QTY_0,CREDATTIM_0,UPDDATTIM_0,AUUID_0,CREUSR_0,UPDUSR_0, XORDEREDFLG, XPRICE_0) VALUES (0,@usersite, @loginuser, @prodid, @proddesc,@totalQty,  @currentTime, @currentTime, @uuid, @byUser, @byUser, 0, @price)"));

        res.json({
          success: true,
          data: null,
          message: 'Product Added to Cart successfully.'
        });
        }
      }
  catch (error) {
    return next(error);
  }
};

exports.deleteSOCartRequest = async (req, res, next) => {
  try {
    await dbConnection.then(pool => pool.request()
      .input('id', sql.NVarChar, req.body.ITMREF_0)
       .input('user', sql.NVarChar, req.body.loginuser)
        .input('site', sql.NVarChar, req.body.usersite)
      .query("DELETE XCPSOCART WHERE ITMREF_0 = @id AND XLOGINUSER_0 = @user AND XSALFCY_0 = @site AND  XORDEREDFLG = 0"));
    res.json({
      success: true,
      message: "Removed Product from Cart."
    });
  } catch (error) {
    return next(error);
  }
};
