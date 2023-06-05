const dbConnection = require('../models/db');
const {
  jwtSecret,
  jwtExpirationInterval
} = require('../config/constants');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const sql = require('mssql');
const lodash = require('lodash');

exports.login = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('id', sql.NVarChar, req.body.id)
      .input('password', sql.NVarChar, req.body.password)
      .query(`SELECT u.X3USER_0, u.XLOGIN_0, u.XNAME_0, u.XMAIL_0, u.XPHONE_0, u.XACT_0, u.X3SITE_0, E.FCYNAM_0, E.LEGCPY_0, u.X3ROLE_0, 
      u.XSOH_0, u.XSDH_0, u.XSIH_0, u.XPOH_0, u.XPTH_0, u.XPIH_0, C.CRN_0, C.EECNUM_0, C.NAF_0, F.BLOB_0,
            Case 
            when u.X3ROLE_0 = 2 THEN 'Customer' 
            when u.X3ROLE_0 = 3 THEN 'Supplier' 
            when u.X3ROLE_0 = 4 THEN 'Admin' 
            Else 'NA' 
            end as XDESC_0, 
            Case when u.X3ROLE_0 = 2 THEN C.CUR_0
            when u.X3ROLE_0 = 3 THEN C.CUR_0
            when u.X3ROLE_0 = 4 THEN 'EUR'
            Else 'EUR' 
            end as CUR_0
            FROM x3v11gsfdata.GSFUAT.XSCUSER AS u 
            LEFT OUTER JOIN x3v11gsfdata.GSFUAT.BPARTNER C ON u.X3USER_0 = C.BPRNUM_0
            LEFT OUTER JOIN x3v11gsfdata.GSFUAT.FACILITY E ON u.X3SITE_0 = E.FCY_0
          LEFT OUTER JOIN x3v11gsfdata.GSFUAT.ABLOB F ON E.LEGCPY_0 = F.IDENT1_0 AND F.CODBLB_0 = 'LOGO'
      WHERE u.XLOGIN_0 = @id AND u.XPSWD_0 = @password`));

    if (result.recordset.length > 0) {
       const userData = lodash.cloneDeep(result.recordset);
      if(userData[0].XACT_0 === 2) {
      delete userData[0].BLOB_0;
      const authToken = this.token(userData);
      const address = await dbConnection.then(pool => pool.request()
        .input('x3user', sql.NVarChar, result.recordset[0].X3USER_0)
        .query(`Select A.BPAADD_0, A.BPADES_0, A.BPAADDLIG_0, A.BPAADDLIG_1, A.BPAADDLIG_2, A.POSCOD_0, A.CTY_0, A.CRY_0, A.CRYNAM_0, A.BPAADDFLG_0,
      A.TEL_0, A.MOB_0, A.WEB_0, A.XX10C_GEOX_0, A.XX10C_GEOY_0
      FROM x3v11gsfdata.GSFUAT.BPADDRESS A
      Where A.BPANUM_0 = @x3user`));
      result.recordset[0].Addresses = address.recordset;
      const contact = await dbConnection.then(pool => pool.request()
        .input('x3user', sql.NVarChar, result.recordset[0].X3USER_0)
        .query(`Select A.BPANUM_0, A.CCNCRM_0, B.CNTFNA_0, B.ROWID, B.CNTLNA_0, A.TEL_0, A.WEB_0, A.MOB_0, B.CNTFAX_0, C.BPSFLG_0, C.BPCFLG_0, C.LAN_0
        From x3v11gsfdata.GSFUAT.CONTACT A 
        INNER JOIN x3v11gsfdata.GSFUAT.CONTACTCRM B ON A.CCNCRM_0 = B.CNTNUM_0
        INNER JOIN x3v11gsfdata.GSFUAT.BPARTNER C ON A.BPANUM_0 = C.BPRNUM_0 
        Where A.BPANUM_0 = @x3user`));
      result.recordset[0].Contacts = contact.recordset;
      res.json({
        success: true,
        data: {
          user: result.recordset[0],
          token: authToken
        }
      });
    }  else {
        res.json({
               success: false,
               message: "User is InActive."
             });
    }
    }
    else {
      res.json({
        success: false,
        message: "Enter valid ID & password."
      });
    }
  } catch (error) {
    return next(error);
  }
};

exports.token = (data) => {
  const payload = {
    exp: moment().add(jwtExpirationInterval, 'minutes').unix(),
    iat: moment().unix(),
    sub: data,
  };
  return jwt.encode(payload, jwtSecret);
};