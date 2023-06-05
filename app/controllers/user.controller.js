const dbConnection = require('../models/db');
const sql = require('mssql');
const moment = require('moment');
var crypto = require("crypto");
const soap = require('soap');
const https = require('https');

const callcontent = `
  <codeLang xsi:type="xsd:string">${process.env.SOAP_LANGUAGE}</codeLang>
  <poolAlias xsi:type="xsd:string">${process.env.SOAP_POOL_ALIAS}</poolAlias>
  <poolId xsi:type="xsd:string">?</poolId>
  <requestConfig xsi:type="xsd:string">?</requestConfig>`;

exports.getAllUsers = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.query("SELECT X3USER_0, XUSRCODE_0, XCONCODE_0, XLOGIN_0, XNAME_0, XMAIL_0, XPSWD_0, XPHONE_0, XACT_0, X3SITE_0, X3CONTSEQ_0, X3ROLE_0, Case when X3ROLE_0 = 2 THEN 'Customer' when X3ROLE_0 = 3 THEN 'Supplier' when X3ROLE_0 = 4 THEN 'Admin' Else 'NA' end as XDESC_0 FROM x3v11gsfdata.GSFUAT.XSCUSER WHERE X3ROLE_0 > 0 AND XLOGIN_0 <> '' ORDER BY ROWID desc"));
    res.json({
      success: true,
      data: {
        users: result.recordset,
      }
    });
  } catch (error) {
    return next(error);
  }
};

exports.getAdminSeq = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.query("SELECT MAX(X3CONTSEQ_0) + 1 as SEQ FROM x3v11gsfdata.GSFUAT.XSCUSER where XUSRCODE_0 = 'ADMIN' AND X3ROLE_0 = 4"));
    res.json({
      success: true,
      data: result.recordset[0]
    });
  } catch (error) {
    return next(error);
  }
};

exports.createEditUser = async (req, res, next) => {
  try {
    if (req.body.id) {
      const result = await dbConnection.then(pool => pool.request()
        .input('xlogin', sql.NVarChar, req.body.xlogin)
        .input('password', sql.NVarChar, req.body.password)
        .input('name', sql.NVarChar, req.body.name)
        .input('email', sql.NVarChar, req.body.email)
        .input('xact', sql.TinyInt, req.body.status)
        .input('phone', sql.NVarChar, req.body.phone)
        .input('salesOrder', sql.NVarChar, req.body.salesOrder)
        .input('serviceRequest', sql.NVarChar, req.body.serviceRequest)
        .input('salesDelivery', sql.NVarChar, req.body.salesDelivery)
        .input('salesInvoice', sql.NVarChar, req.body.salesInvoice)
        .input('purchaseOrder', sql.NVarChar, req.body.purchaseOrder)
        .input('purchaseReceipt', sql.NVarChar, req.body.purchaseReceipt)
        .input('purchaseInvoice', sql.NVarChar, req.body.purchaseInvoice)
        .input('updatedat', sql.DateTime, moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))
        .input('updatedby', sql.NVarChar, 'Admin')
        .query("UPDATE XSCUSER SET XPSWD_0 = @password, XNAME_0 = @name, XMAIL_0 = @email, XACT_0 = @xact, XPHONE_0 = @phone, XSOH_0 = @salesOrder,XSERVREQ_0 = @serviceRequest,XSDH_0 = @salesDelivery, XSIH_0 = @salesInvoice, XPOH_0 = @purchaseOrder, XPTH_0 = @purchaseReceipt, XPIH_0 = @purchaseInvoice, UPDDATTIM_0 = @updatedat, UPDUSR_0 = @updatedby WHERE XLOGIN_0 = @xlogin;"));
      if (result && result.rowsAffected[0] == 1) {
        res.json({
          success: true,
          message: "User Updated Successfully."
        });
      }
    } else {
      const code = req.body.role == 4 ? req.body.xlogin : req.body.x3user;
      const result = await dbConnection.then(pool => pool.request()
        .input('usercode', sql.NVarChar, code)
        .input('concode', sql.NVarChar, req.body.concode)
        .input('seq', sql.NVarChar, req.body.seq)
        .input('xlogin', sql.NVarChar, req.body.xlogin)
        .input('password', sql.NVarChar, req.body.password)
        .input('name', sql.NVarChar, req.body.name)
        .input('email', sql.NVarChar, req.body.email)
        .input('xact', sql.TinyInt, 2)
        .input('phone', sql.NVarChar, req.body.phone)
        .input('x3user', sql.NVarChar, code)
        .input('site', sql.NVarChar, req.body.site)
        .input('wrkflag', sql.TinyInt, 0)
        .input('role', sql.SmallInt, req.body.role)
        .input('salesOrder', sql.NVarChar, req.body.salesOrder)
         .input('serviceRequest', sql.NVarChar, req.body.serviceRequest)
        .input('salesDelivery', sql.NVarChar, req.body.salesDelivery)
        .input('salesInvoice', sql.NVarChar, req.body.salesInvoice)
        .input('purchaseOrder', sql.NVarChar, req.body.purchaseOrder)
        .input('purchaseReceipt', sql.NVarChar, req.body.purchaseReceipt)
        .input('purchaseInvoice', sql.NVarChar, req.body.purchaseInvoice)
        .input('createdat', sql.DateTime, moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))
        .input('updatedat', sql.DateTime, moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))
        .input('uuid', sql.Binary, Buffer.from(crypto.randomBytes(8).toString('hex')))
        .input('createdby', sql.NVarChar, 'Admin')
        .input('updatedby', sql.NVarChar, 'Admin')
        .input('xdate', sql.Date, moment(new Date()).format('YYYY-MM-DD'))
        .input('xtime', sql.Time, moment(new Date()).format('YYYY-MM-DD'))
        .input('xuser', sql.NVarChar, '')
        .query("INSERT INTO x3v11gsfdata.GSFUAT.XSCUSER (XUSRCODE_0, XCONCODE_0, X3CONTSEQ_0, X3ROLE_0, XLOGIN_0, XPSWD_0, XNAME_0, XMAIL_0, XACT_0, XPHONE_0, X3USER_0, X3SITE_0, XWRKFLG_0, CREDATTIM_0, UPDDATTIM_0, AUUID_0, CREUSR_0, UPDUSR_0, XDATE_0, XTIME_0, XUSER_0, XSOH_0, XSDH_0, XSIH_0, XPOH_0, XPTH_0, XPIH_0, XSERVREQ_0) VALUES (@usercode, @concode, @seq, @role, @xlogin, @password, @name, @email, @xact, @phone, @x3user, @site, @wrkflag, @createdat, @updatedat, @uuid, @createdby, @updatedby, @xdate, @xtime, @xuser, @salesOrder, @salesDelivery, @salesInvoice, @purchaseOrder, @purchaseReceipt, @purchaseInvoice, @serviceRequest);"));

      if (result && result.rowsAffected[0] == 1) {
        let value = `
          <![CDATA[<PARAM>
          <FLD NAME='I_XUSRCOD'>${req.body.code}</FLD>
          <FLD NAME='I_XCONCOD'>${req.body.concode}</FLD>
          <FLD NAME='I_X3ROLE'>${req.body.role}</FLD>
          <FLD NAME='I_X3CONTSEQ'>${req.body.seq}</FLD>
          </PARAM>]]>`;

        soap.createClientAsync(process.env.SOAP_HOST + '/soap-wsdl/syracuse/collaboration/syracuse/CAdxWebServiceXmlCC?wsdl', {
          attributesKey: 'attributes',
          valueKey: '$value',
          xmlKey: '$xml',
          wsdl_options: {
            httpsAgent: new https.Agent({
              rejectUnauthorized: false,
            })
          }
        }).then(client => {
          client.setSecurity(new soap.BasicAuthSecurity(process.env.SOAP_USERNAME, process.env.SOAP_PASSWORD, ''));
          process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
          client.run({
            callContext: {
              $xml: callcontent,
              attributes: {
                'xsi:type': "wss:CAdxCallContext"
              },
            },
            publicName: {
              attributes: {
                'xsi:type': "xsd:string"
              },
              $value: 'X10CPORCRE'
            },
            inputXml: {
              attributes: {
                'xsi:type': "xsd:string"
              },
              $xml: value
            }
          }, (error, resp) => {
            res.json({
              success: true,
              message: "User Created Successfully."
            });
            // const result = resp?.runReturn?.resultXml?.$value?.RESULT.GRP[1].FLD;
            // if (result && result.length > 0) {
            //   if (result[0].$value == 2) {
            //     res.json({
            //       success: true,
            //       message: result[1].$value
            //     });
            //   } else {
            //     res.json({
            //       success: false,
            //       message: result[1].$value
            //     });
            //   }
            // } else {
            //   res.json({
            //     success: false,
            //     message: "Something went wrong"
            //   });
            // }
          });
        });
      }
    }
  } catch (error) {
    return next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await dbConnection.then(pool => pool.request()
      .input('id', sql.NVarChar, req.body.id)
      .query("DELETE XSCUSER WHERE XLOGIN_0 = @id;"));
    res.json({
      success: true,
      message: "User Deleted."
    });
  } catch (error) {
    return next(error);
  }
};

exports.getUserDetail = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('userId', sql.NVarChar, req.params.id)
      .query("SELECT X3USER_0, XUSRCODE_0, X3CONTSEQ_0, XCONCODE_0, XLOGIN_0, XNAME_0, XMAIL_0, XPSWD_0, XPHONE_0, XACT_0, X3SITE_0, X3ROLE_0, XSOH_0, XSDH_0,XSERVREQ_0, XSIH_0, XPOH_0, XPTH_0, XPIH_0, Case when X3ROLE_0 = 2 THEN 'Customer' when X3ROLE_0 = 3 THEN 'Supplier' when X3ROLE_0 = 4 THEN 'Admin' Else 'NA' end as XDESC_0 FROM x3v11gsfdata.GSFUAT.XSCUSER AS u WHERE XLOGIN_0 = @userId"));
    res.json({
      success: true,
      data: result.recordset[0]
    });
  } catch (error) {
    return next(error);
  }
};

async function getUniqueConCode(x3user, role) {
  try {
    const concode = '' + (role == 4 ? 'ADMIN' : x3user) + Math.floor(1000 + Math.random() * 9000);
    const result = await dbConnection.then(pool => pool.request()
      .input('concode', sql.NVarChar, concode)
      .query("SELECT X3USER_0 FROM XSCUSER WHERE XCONCODE_0 = @concode"));
    if (result.recordset.length > 0) {
      getUniqueConCode(x3user, role);
    } else {
      return concode;
    }
  } catch (error) {
    return next(error);
  }
}