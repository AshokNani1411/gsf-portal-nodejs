const dbConnection = require('../models/db');
const sql = require('mssql');
const moment = require('moment');
var crypto = require("crypto");

exports.getAllAnnouncements = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .query(`Select ROWID, X10CSEQ_0, X10CSUBJECT_0, X10CSUBDES_0, X10CCREDAT_0, X10CEXPDAT_0, CREDATTIM_0,CREUSR_0
      From x3v11gsfdata.GSFUAT.XX10CPORANN
      Order By X10CCREDAT_0 DESC
      `));
    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getAnnouncementDetail = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('rowID', Number(req.params.id))
      .query(`Select ROWID, X10CSEQ_0, X10CSUBJECT_0, X10CSUBDES_0, X10CCREDAT_0, X10CEXPDAT_0, CREUSR_0
        From x3v11gsfdata.GSFUAT.XX10CPORANN
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

exports.deleteAnnouncement = async (req, res, next) => {
  try {
    await dbConnection.then(pool => pool.request()
      .input('id', sql.NVarChar, req.body.id)
      .query("DELETE x3v11gsfdata.GSFUAT.XX10CPORANN WHERE ROWID = @id;"));
    res.json({
      success: true,
      message: "Announcement Deleted."
    });
  } catch (error) {
    return next(error);
  }
};

exports.createEditAnnouncement = async (req, res, next) => {
  try {
    if (req.body.id) {
      const result = await dbConnection.then(pool => pool.request()
        .input('rowID', sql.NVarChar, req.body.id)
        .input('title', sql.NVarChar, req.body.title)
        .input('description', sql.NVarChar, req.body.description)
        .input('updatedat', sql.DateTime, moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))
        .input('validity', sql.DateTime, req.body.validity)
        .input('updatedby', sql.NVarChar, req.body.user)
        .query("UPDATE x3v11gsfdata.GSFUAT.XX10CPORANN SET X10CSUBJECT_0 = @title, X10CSUBDES_0 = @description, X10CEXPDAT_0 = @validity, UPDDATTIM_0 = @updatedat, UPDUSR_0 = @updatedby WHERE ROWID = @rowID;"));
      if (result && result.rowsAffected[0] == 1) {
        res.json({
          success: true,
          message: "Announcement Updated Successfully."
        });
      }
    } else {
      const result = await dbConnection.then(pool => pool.request()
        .input('title', sql.NVarChar, req.body.title)
        .input('description', sql.NVarChar, req.body.description)
        .input('validity', sql.DateTime, req.body.validity)
        .input('createDate', sql.DateTime, moment(new Date()).format('YYYY-MM-DD'))
        .input('createdAt', sql.DateTime, moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))
        .input('uuid', sql.Binary, Buffer.from(crypto.randomBytes(8).toString('hex')))
        .input('createdby', sql.NVarChar, req.body.user)
        .input('seq', sql.NVarChar, moment().unix())
        .query("INSERT INTO x3v11gsfdata.GSFUAT.XX10CPORANN (X10CSEQ_0, X10CSUBJECT_0, X10CSUBDES_0, X10CCREDAT_0, CREDATTIM_0, UPDDATTIM_0, X10CEXPDAT_0, CREUSR_0, UPDUSR_0, AUUID_0) VALUES (@seq, @title, @description, @createDate, @createdAt, @createdAt, @validity, @createdby, @createdby, @uuid)"));
      if (result && result.rowsAffected[0] == 1) {
        res.json({
          success: true,
          message: "Announcement Created Successfully."
        });
      }
    }
  } catch (error) {
    return next(error);
  }
};