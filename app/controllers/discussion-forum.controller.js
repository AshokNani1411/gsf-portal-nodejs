const dbConnection = require('../models/db');
const sql = require('mssql');
const moment = require('moment');
var crypto = require("crypto");

exports.getAllDiscussionForums = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .query(`Select ROWID,
              X10CFORUMID_0,
              X10CTITLE_0,
              X10CTITDES_0,
              X10CCREDAT_0,
              CREDATTIM_0,
              ISNULL((select TOP 1 D2.UPDDATTIM_0 from
              DEMOTMSFR.XX10CPORDISD D2
              WHERE D2.X10CFORUMID_0 = H.X10CFORUMID_0
              order by D2.UPDDATTIM_0 DESC ),'')UPDDATTIM_0,
              CREUSR_0,
              ISNULL(stuff((select distinct ',' + cast(D5.X10CSENDID_0 as varchar(10))
               FROM (SELECT  distinct D4.X10CSENDID_0, D4.X10CFORUMID_0 FROM DEMOTMSFR.XX10CPORDISD D4)D5
               WHERE D5.X10CFORUMID_0 = H.X10CFORUMID_0
               FOR XML PATH('')),1,1,''),'') USERSLIST,
              ISNULL((select count(*) AS NOOFUSERS
              from (
              select D1.X10CSENDID_0,COUNT(*) AS REPLIES from
              DEMOTMSFR.XX10CPORDISD D1
              GROUP BY D1.X10CSENDID_0,D1.X10CFORUMID_0
              HAVING D1.X10CFORUMID_0 = H.X10CFORUMID_0)TBL),0)NOOFUSERS,
              ISNULL((select COUNT(*) from
              DEMOTMSFR.XX10CPORDISD D
              GROUP BY X10CFORUMID_0
              HAVING D.X10CFORUMID_0 = H.X10CFORUMID_0),0)NOOFREPLIES
                    From x3v11gsfdata.GSFUAT.XX10CPORDISH H
      Order By H.CREDATTIM_0 DESC`));
    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getDiscussionForumDetail = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('forumId', Number(req.params.id))
      .query(`Select X10CFORUMID_0, X10CTITLE_0, X10CTITDES_0, X10CCREDAT_0, CREDATTIM_0, UPDDATTIM_0, CREUSR_0
        From x3v11gsfdata.GSFUAT.XX10CPORDISH
        WHERE X10CFORUMID_0 = @forumId
      `));
    if (result.recordset.length > 0) {
      const messages = await dbConnection.then(pool => pool.request()
        .input('forumId', Number(req.params.id))
        .query(`Select ROWID, X10CSENDID_0, X10CMSGTXT_0, X10CSENTDATT_0, CREDATTIM_0
            From x3v11gsfdata.GSFUAT.XX10CPORDISD
            WHERE X10CFORUMID_0 = @forumId
            Order By CREDATTIM_0 ASC
          `));
      result.recordset[0].messages = messages.recordset;
      res.json({
        success: true,
        data: result.recordset[0],
      });
    } else {
      res.json({
        success: false,
        message: "Something went wrong."
      });
    }
  } catch (error) {
    return next(error);
  }
};

exports.deleteDiscussionForum = async (req, res, next) => {
  try {
    await dbConnection.then(pool => pool.request()
      .input('id', sql.NVarChar, req.body.id)
      .query("DELETE x3v11gsfdata.GSFUAT.XX10CPORDISH WHERE X10CFORUMID_0 = @id;"));
    res.json({
      success: true,
      message: "Discussion Forum Deleted."
    });
  } catch (error) {
    return next(error);
  }
};

exports.createEditDiscussionForum = async (req, res, next) => {
  try {
    if (req.body.id) {
      const result = await dbConnection.then(pool => pool.request()
        .input('forumId', sql.NVarChar, req.body.id)
        .input('title', sql.NVarChar, req.body.title)
        .input('description', sql.NVarChar, req.body.description)
        .input('updatedat', sql.DateTime, moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))
        .input('updatedby', sql.NVarChar, req.body.user)
        .query("UPDATE x3v11gsfdata.GSFUAT.XX10CPORDISH SET X10CTITLE_0 = @title, X10CTITDES_0 = @description, UPDDATTIM_0 = @updatedat, UPDUSR_0 = @updatedby WHERE X10CFORUMID_0 = @forumId;"));
      if (result && result.rowsAffected[0] == 1) {
        res.json({
          success: true,
          message: "Discussion Forum Updated Successfully."
        });
      }
    } else {
      const result = await dbConnection.then(pool => pool.request()
        .input('forumId', sql.NVarChar, moment().unix())
        .input('x3user', sql.NVarChar, req.body.x3user)
        .input('title', sql.NVarChar, req.body.title)
        .input('description', sql.NVarChar, req.body.description)
        .input('createDate', sql.DateTime, moment(new Date()).format('YYYY-MM-DD'))
        .input('createdAt', sql.DateTime, moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))
        .input('uuid', sql.Binary, Buffer.from(crypto.randomBytes(8).toString('hex')))
        .input('createdby', sql.NVarChar, req.body.user)
        .query("INSERT INTO x3v11gsfdata.GSFUAT.XX10CPORDISH (X10CFORUMID_0, X10CTITLE_0, X10CTITDES_0, X10CCREDAT_0, CREDATTIM_0, UPDDATTIM_0, CREUSR_0, UPDUSR_0, AUUID_0) VALUES (@forumId, @title, @description, @createDate, @createdAt, @createdAt, @createdby, @createdby, @uuid)"));
      if (result && result.rowsAffected[0] == 1) {
        res.json({
          success: true,
          message: "Discussion Forum Created Successfully."
        });
      }
    }
  } catch (error) {
    return next(error);
  }
};

exports.addMessage = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('forumId', req.body.forumId)
      .input('senderId', req.body.senderId)
      .input('message', sql.NVarChar, req.body.message)
      .input('createDate', sql.DateTime, moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))
      .input('createdAt', sql.DateTime, moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))
      .input('uuid', sql.Binary, Buffer.from(crypto.randomBytes(8).toString('hex')))
      .input('seq', sql.NVarChar, moment().unix())
      .query("INSERT INTO x3v11gsfdata.GSFUAT.XX10CPORDISD (X10CFORUMID_0, X10CSEQ_0, X10CSENDID_0, X10CMSGTXT_0, X10CSENTDATT_0, CREDATTIM_0, UPDDATTIM_0, CREUSR_0, UPDUSR_0, AUUID_0) VALUES (@forumId, @seq, @senderId, @message, @createDate, @createdAt, @createdAt, @senderId, @senderId, @uuid)"));
    if (result && result.rowsAffected[0] == 1) {
      res.json({
        success: true,
        message: "Messages Added Successfully."
      });
    }
  } catch (error) {
    return next(error);
  }
};