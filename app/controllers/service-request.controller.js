const dbConnection = require('../models/db');
const sql = require('mssql');
const moment = require('moment');
var crypto = require("crypto");

exports.getAllServiceRequests = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('x3user', sql.NVarChar, req.body.x3user)
      .input('site', sql.NVarChar, req.body.site)
      .query(`Select SRENUM_0,SALFCY_0,SRENUMBPC_0,P.BPRNAM_0,XPKUSR_0,ISNULL(B.NOMUSR_0,'') AS TECH,SRERESDAT_0,XBPAADD_0,XCTY_0,XPOSCOD_0,XCRY_0,XTYP_0,D.TEXTE_0,XSTATUS_0,XX10A_GEOX_0,XX10A_GEOY_0
              from x3v11gsfdata.GSFUAT.SERREQUEST S left join x3v11gsfdata.GSFUAT.BPARTNER P on P.BPRNUM_0 = SRENUMBPC_0
              LEFT JOIN x3v11gsfdata.GSFUAT.ATEXTRA D ON  IDENT2_0 = S.XTYP_0  AND IDENT1_0 = '407' and LANGUE_0 = 'ENG' AND CODFIC_0 = 'ATABDIV' and ZONE_0 = 'LNGDES'
              left join x3v11gsfdata.GSFUAT.AUTILIS B ON B.USR_0 = XPKUSR_0 WHERE SALFCY_0=@site AND SRENUMBPC_0=@x3user ORDER BY SRENUM_0 DESC`));
    res.json({
      success: true,
      data: result.recordset
    });
  } catch (error) {
    return next(error);
  }
};



exports.getServiceRequestDetail = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('serReqId', sql.NVarChar, req.params.id)
      .query(`Select SRENUM_0,SALFCY_0,SRENUMBPC_0,P.BPAADD_0,P.BPRNAM_0,XPKUSR_0,ISNULL(B.NOMUSR_0,'') AS TECH,SRERESDAT_0,XBPAADD_0,XCTY_0,XPOSCOD_0,XCRY_0,XTYP_0,D.TEXTE_0,XSTATUS_0,XX10A_GEOX_0,XX10A_GEOY_0
                            from x3v11gsfdata.GSFUAT.SERREQUEST S left join x3v11gsfdata.GSFUAT.BPARTNER P on P.BPRNUM_0 = SRENUMBPC_0
                            LEFT JOIN x3v11gsfdata.GSFUAT.ATEXTRA D ON  IDENT2_0 = S.XTYP_0  AND IDENT1_0 = '407' and LANGUE_0 = 'ENG' AND CODFIC_0 = 'ATABDIV' and ZONE_0 = 'LNGDES'
                            left join x3v11gsfdata.GSFUAT.AUTILIS B ON B.USR_0 = XPKUSR_0
      WHERE SRENUM_0=@serReqId`));
      if (result && result.recordset[0]) {
            products = await dbConnection.then(pool => pool.request()
              .input('dropReqId', sql.NVarChar, req.params.id)
              .query(`Select A.SRENUM_0,A.HDTMACSRE_0 as InstallBase,A.HDTTYP_0 as consumptionType,ISNULL(L.LANMES_0,'') as ConsumptionTypeDesc,A.HDTITM_0 as Consumption,I.ITMDES1_0 as Consumptiondescription,
                      A.HDTQTY_0 as Quanitity,A.HDTUOM_0 as Unit,A.HDTAUS_0 as Provider,U.NOMUSR_0 as ProviderName,A.HDTDONDAT_0 As DateExecuted,A.HDTAMT_0 as AmountConsumption,
                      A.HDTCUR_0 as Currency,A.HDTNUM_0 AS ConusmptionNumber From x3v11gsfdata.GSFUAT.HDKTASK A
                      LEFT JOIN x3v11gsfdata.GSFUAT.ITMMASTER I on A.HDTITM_0 = I.ITMREF_0
                      LEFT JOIN x3v11gsfdata.GSFUAT.APLSTD L on L.LANNUM_0 = A.HDTTYP_0 and L.LANCHP_0 = 2987 and L.LAN_0 = 'ENG'
                      LEFT JOIN x3v11gsfdata.GSFUAT.AUTILIS U on U.USR_0 = A.HDTAUS_0 Where A.SRENUM_0 = @dropReqId`));
      result.recordset[0].products = products.recordset
      res.json({
        success: true,
        data: result.recordset[0]
      });
      }
    }
   catch (error) {
    return next(error);
  }
};




exports.createServiceRequest = async (req, res, next) => {
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
        message: 'Service request updated successfully.'
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
          message: 'Service request created successfully.'
        });
      }
    }
  } catch (error) {
    return next(error);
  }
};


