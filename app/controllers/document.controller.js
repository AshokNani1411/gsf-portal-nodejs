const dbConnection = require('../models/db');
const sql = require('mssql');
const moment = require('moment');
var crypto = require("crypto");

exports.getAllDocuments = async (req, res, next) => {
  try {
    if (req.body.role === 4) {
      const result = await dbConnection.then(pool => pool.request()
        .query(`Select ROWID, X10CSEQ_0, X10CDOCTYP_0, X10CDOCDES_0, X10CBP_0, X10CGEN_0, X10CDOCID_0, X10CDAT_0, X10CEXPDAT_0, CREUSR_0,
        substring(X10CDOCID_0,len(X10CDOCID_0)-charindex('.',reverse(X10CDOCID_0))+2,99) as ACTTYP
        From x3v11gsfdata.GSFUAT.XX10CPORDOC
        Order By X10CDAT_0 DESC
        `));
      res.json({
        success: true,
        data: result.recordset,
      });
    } else {
      const result = await dbConnection.then(pool => pool.request()
        .input('x3user', sql.NVarChar, req.body.user)
        .query(`Select ROWID, X10CSEQ_0, X10CDOCTYP_0, X10CDOCDES_0, X10CBP_0, X10CGEN_0, X10CDOCID_0, X10CDAT_0, X10CEXPDAT_0, CREUSR_0,
        substring(X10CDOCID_0,len(X10CDOCID_0)-charindex('.',reverse(X10CDOCID_0))+2,99) as ACTTYP
        From x3v11gsfdata.GSFUAT.XX10CPORDOC
        WHERE (X10CALL_0 = 2 OR X10CBP_0 = @x3user)
        Order By X10CDAT_0 DESC
        `));
      res.json({
        success: true,
        data: result.recordset,
      });
    }
  } catch (error) {
    return next(error);
  }
};

exports.getDocumentDetail = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('rowID', Number(req.params.id))
      .query(`Select ROWID, X10CSEQ_0, X10CDOCTYP_0, X10CDOCDES_0, X10CBP_0, X10CGEN_0, X10CDOCID_0, X10CDAT_0, X10CEXPDAT_0
        From x3v11gsfdata.GSFUAT.XX10CPORDOC
        WHERE ROWID = @rowID
      `));
    res.json({
      success: true,
      data: result.recordset[0],
    });
  } catch (error) {
    return next(error);
  }
};

exports.deleteDocument = async (req, res, next) => {
  try {
    await dbConnection.then(pool => pool.request()
      .input('id', sql.NVarChar, req.body.id)
      .query("DELETE x3v11gsfdata.GSFUAT.XX10CPORDOC WHERE ROWID = @id;"));
    res.json({
      success: true,
      message: "Document Deleted."
    });
  } catch (error) {
    return next(error);
  }
};

exports.createEditDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      res.json({
        success: false,
        message: "Please select file",
      });
    } else {
      let file = req.file;
      if (req.body.id) {
        const result = await dbConnection.then(pool => pool.request()
          .input('rowID', sql.NVarChar, req.body.id)
          .input('title', sql.NVarChar, req.body.title)
          .input('description', sql.NVarChar, req.body.description)
          .input('updatedat', sql.DateTime, moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))
          .input('updatedby', sql.NVarChar, req.body.user)
          .query("UPDATE x3v11gsfdata.GSFUAT.XX10CPORDOC SET X10CSUBJECT_0 = @title, X10CSUBDES_0 = @description, UPDDATTIM_0 = @updatedat, UPDUSR_0 = @updatedby WHERE ROWID = @rowID;"));
        if (result && result.rowsAffected[0] == 1) {
          res.json({
            success: true,
            message: "Document Updated Successfully."
          });
        }
      } else {
        const result = await dbConnection.then(pool => pool.request()
          .input('x3user', sql.NVarChar, req.body.x3user !== 'All' ? req.body.x3user : '')
          .input('isAll', sql.NVarChar, req.body.x3user === 'All' ? 2 : 1)
          .input('file', sql.NVarChar, file.filename)
          .input('type', sql.NVarChar, req.body.type)
          .input('description', sql.NVarChar, req.body.description)
          .input('createDate', sql.DateTime, moment(new Date()).format('YYYY-MM-DD'))
          .input('createdAt', sql.DateTime, moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))
          .input('uuid', sql.Binary, Buffer.from(crypto.randomBytes(8).toString('hex')))
          .input('createdby', sql.NVarChar, req.body.user)
          .input('seq', sql.NVarChar, moment().unix())
          .query("INSERT INTO x3v11gsfdata.GSFUAT.XX10CPORDOC (X10CSEQ_0, X10CDOCTYP_0, X10CDOCDES_0, X10CALL_0, X10CBP_0, X10CGEN_0, X10CDOCID_0, X10CDAT_0, X10CEXPDAT_0, CREDATTIM_0, UPDDATTIM_0, AUUID_0, CREUSR_0, UPDUSR_0) VALUES (@seq, @type, @description, @isAll, @x3user, 0, @file, @createDate, @createdAt, @createdAt, @createdAt, @uuid, @createdby, @createdby)"));
        if (result && result.rowsAffected[0] == 1) {
          res.json({
            success: true,
            message: "Document Created Successfully."
          });
        }
      }
    }
  } catch (error) {
    return next(error);
  }
};