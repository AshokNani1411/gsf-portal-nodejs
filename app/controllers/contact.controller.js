const dbConnection = require('../models/db');
const sql = require('mssql');
const soap = require('soap');
const https = require('https');
const e = require('express');
const moment = require('moment');

const callcontent = `
  <codeLang xsi:type="xsd:string">${process.env.SOAP_LANGUAGE}</codeLang>
  <poolAlias xsi:type="xsd:string">${process.env.SOAP_POOL_ALIAS}</poolAlias>
  <poolId xsi:type="xsd:string">?</poolId>
  <requestConfig xsi:type="xsd:string">?</requestConfig>`;

exports.getAllContacts = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .query(`Select A.BPANUM_0, A.CCNCRM_0, B.CNTFNA_0, B.ROWID, B.CNTLNA_0, A.TEL_0, A.WEB_0, A.MOB_0, C.BPRNAM_0
      From x3v11gsfdata.GSFUAT.CONTACT A  
      INNER JOIN x3v11gsfdata.GSFUAT.CONTACTCRM B ON A.CCNCRM_0 = B.CNTNUM_0
      INNER JOIN x3v11gsfdata.GSFUAT.BPARTNER C ON A.BPANUM_0 = C.BPRNUM_0
      Order By A.ROWID DESC
      `));
    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getContactDetail = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('rowID', Number(req.params.id))
      .input('x3User', req.query.customer)
      .query(`Select A.BPANUM_0, A.CCNCRM_0, B.CNTFNA_0, B.ROWID, B.CNTLNA_0, A.TEL_0, A.WEB_0, A.MOB_0, A.FAX_0, A.CNTFNC_0, B.CNTLAN_0, B.CNTBIR_0 
      From x3v11gsfdata.GSFUAT.CONTACT A 
        INNER JOIN x3v11gsfdata.GSFUAT.CONTACTCRM B ON A.CCNCRM_0 = B.CNTNUM_0
        WHERE A.BPANUM_0 = @x3User AND B.ROWID = @rowID
        Order By A.BPANUM_0
      `));
    res.json({
      success: true,
      data: result.recordset[0],
    });
  } catch (error) {
    return next(error);
  }
};

exports.deleteContact = async (req, res, next) => {
  try {
    await dbConnection.then(pool => pool.request()
      .input('id', sql.NVarChar, req.body.id)
      .query("DELETE CONTACTCRM WHERE ROWID = @id;"));
    res.json({
      success: true,
      message: "Contact Deleted."
    });
  } catch (error) {
    return next(error);
  }
};

exports.createEditContact = async (req, res, next) => {
  try {
    let value = `
      <![CDATA[<PARAM>
      <FLD NAME='I_XBPR'>${req.body.x3user}</FLD>
      <FLD NAME='I_XCNTTTL'>1</FLD>
      <FLD NAME='I_XCCNCRM'>${req.body.concode}</FLD>
      <FLD NAME='I_XCNTLNA'>${req.body.lname}</FLD>
      <FLD NAME='I_XCNTFNA'>${req.body.fname}</FLD>
      <FLD NAME='I_XCNTFNC'>${req.body.designation}</FLD>
      <FLD NAME='I_XCNTSRV'>Developer</FLD>
      <FLD NAME='I_XCNTMSS'>X</FLD>
      <FLD NAME='I_XLAN'>${req.body.language}</FLD>
      <FLD NAME='I_XCNTBIR'>${moment(req.body.dob).format('YYYYMMDD')}</FLD>
      <FLD NAME='I_XCNTCSP'>X</FLD>
      <FLD NAME='I_XCNTADD'></FLD>
      <FLD NAME='I_XCNTWEB'>${req.body.email}</FLD>
      <FLD NAME='I_XCNTTEL'>${req.body.telephone}</FLD>
      <FLD NAME='I_XCNTFAX'>${req.body.fax}</FLD>
      <FLD NAME='I_XCNTMOB'>${req.body.mobile}</FLD>
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
          $value: 'X10CBPCON'
        },
        inputXml: {
          attributes: {
            'xsi:type': "xsd:string"
          },
          $xml: value
        }
      }, (error, resp) => {
        const result = resp?.runReturn?.resultXml?.$value?.RESULT.GRP[1].FLD;
        if(result && result.length > 0) {
          if(result[0].$value == 2) {
            res.json({
              success: true,
              message: result[1].$value
            });
          } else {
            res.json({
              success: false,
              message: result[1].$value
            });
          }
        } else {
          res.json({
            success: false,
            message: "Something went wrong"
          });
        }
      });
    });
  } catch (error) {
    return next(error);
  }
};