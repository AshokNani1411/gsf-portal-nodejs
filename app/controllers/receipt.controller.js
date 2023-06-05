const dbConnection = require('../models/db');
const sql = require('mssql');

exports.getAllReceipts = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('x3user', sql.NVarChar, req.body.x3user)
      .input('site', sql.NVarChar, req.body.site)
      .query("SELECT PRHFCY_0, PTHNUM_0, RCPDAT_0, BPSNUM_0, TOTLINQTY_0, TOTGROWEI_0, WEU_0, TOTVOL_0, VOU_0, INVFLG_0, (SELECT count(*) FROM x3v11gsfdata.GSFUAT.XX10CXPODH WHERE XSDHNUM_0 = PTHNUM_0) AS ISPOD, XX10CPTH_0 FROM PRECEIPT WHERE PRHFCY_0 = @site AND BPSNUM_0 = @x3user ORDER BY RCPDAT_0 DESC"));
    if (result && result.recordset.length > 0) {
      for (let index = 0; index < result.recordset.length; index++) {
        const subData = await dbConnection.then(pool => pool.request()
          .input('receiptNo', sql.NVarChar, result.recordset[index].PTHNUM_0)
          .query("SELECT A.PTHNUM_0,A.PTDLIN_0,A.POHNUM_0,A.POPLIN_0,A.ITMREF_0,A.ITMDES_0,A.QTYUOM_0,A.UOM_0,A.QTYWEU_0,A.LINWEU_0,A.QTYVOU_0,A.LINVOU_0,B.XX10CPTH_0 FROM x3v11gsfdata.GSFUAT.PRECEIPTD A LEFT OUTER JOIN x3v11gsfdata.GSFUAT.PRECEIPT B ON A.PTHNUM_0 = B.PTHNUM_0 WHERE A.PTHNUM_0 = @receiptNo")
        );
        result.recordset[index].SORDERQ = subData.recordset;
      }
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

exports.getReceiptDetail = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('id', sql.NVarChar, req.params.id)
      .query(`SELECT A.XSDHNUM_0,A.XDLVDAT_0,A.XBPCORD1_0,A.XBPRNAM1_0,A.XPODREF_0,A.UPDDATTIM_0,A.UPDUSR_0,A.XBPNAME_0,
      A.XBPAADDLIG_0,A.XBPAADDLIG_1,A.XBPAADDLIG_2,A.XBPAADDLIG_3,A.XBPAADDLIG_4, A.XPOSCOD_0,A.XCTY_0,A.XCRY_0,A.XMOB_0,
      A.XWEB_0,A.XGEOX_0,A.XGEOY_0,A.XETAD_0,A.XETAT_0,A.XCNFARRT_0, A.XCNFARRD_0,A.XSTRTUNT_0,A.XSTRUNLD_0,A.XCAPDDD_0,A.XCAPDDT_0,
      A.XENDUNLD_0,A.XENDUNLT_0, A.XCNFDEPD_0, A.XCNFDEPT_0,A.XETDD_0,A.XETDT_0,A.XVEHROU_0,A.XDELSCH_0,A.XVEH_0,A.XUSER_0,A.XBPTNUMSDH_0,
      A.XBPTNAM_0,A.XBPTEMAIL_0,A.XGROWEI_0,A.XNETWEI_0,A.XWEU_0,A.XVOL_0,A.XVOU_0,A.XPACNBR_0,A.XBPTCODE_0, A.XBPTCNT_0,A.XBPAADD_0,A.XPODRDY_0,
      A.XRDYUSR_0,A.XRDYTIM_0,A.XRDYDAT_0,A.CREDATTIM_0, B.BPRNAM_0, C.BPADES_0, B.BPRSHO_0, C.WEB_0, C.MOB_0, D.BPTNAM_0, E.NAME_0, F.DRIVER_0
      FROM x3v11gsfdata.GSFUAT.XX10CXPODH A
      INNER JOIN x3v11gsfdata.GSFUAT.BPARTNER B ON A.XBPCORD1_0 = B.BPRNUM_0
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.BPADDRESS C ON A.XBPCORD1_0 = C.BPANUM_0 AND C.BPATYP_0 = 1
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.BPCARRIER D ON A.XBPTNUMSDH_0 = D.BPTNUM_0
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.XX10CVEHICUL E ON A.XVEH_0 = E.CODEYVE_0
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.XX10CDRIVER F ON A.XUSER_0 = F.DRIVERID_0
      WHERE XSDHNUM_0 = @id`));
    if (result && result.recordset.length > 0) {
      for (let index = 0; index < result.recordset.length; index++) {
        const subData = await dbConnection.then(pool => pool.request()
          .input('deliveryNo', sql.NVarChar, result.recordset[index].XSDHNUM_0)
          .query("SELECT UPDTICK_0, XSDHNUM_0, XPODREF_0, XSDDLIN_0, XITMREF_0, XITMDES_0, XDLVQTY_0, XPODQTY_0, XUNIT_0, XGROWEI_0, XWEU_0, XVOL_0, XVOU_0, XPCK_0, XERR_0, CREDATTIM_0, UPDDATTIM_0, AUUID_0, CREUSR_0, UPDUSR_0, XODLIN_0, ROWID FROM x3v11gsfdata.GSFUAT.XX10CXPODD WHERE XSDHNUM_0=@deliveryNo"));
        result.recordset[index].SORDERQ = subData.recordset;

        const imgData = await dbConnection.then(pool => pool.request()
          .input('deliveryNo', sql.NVarChar, result.recordset[index].XSDHNUM_0)
          .query("SELECT UPDTICK_0, CODBLB_0, IDENT1_0, IDENT2_0, IDENT3_0, NAMBLB_0, TYPBLB_0, CREUSR_0, CREDAT_0, UPDUSR_0, CREDATTIM_0, UPDDATTIM_0, AUUID_0, CNTTYP_0, BLOB_0, ROWID FROM x3v11gsfdata.GSFUAT.ABLOB WHERE (CODBLB_0='RO' OR CODBLB_0='VANSALES') AND IDENT2_0=@deliveryNo ORDER BY CREDAT_0 DESC")
        );
        result.recordset[index].images = imgData.recordset;
      }
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

exports.getReceiptInfo = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('id', sql.NVarChar, req.params.id)
      .query(`SELECT PTHNUM_0, PRHFCY_0, RCPDAT_0, BPSNUM_0, BPONAM_0, CUR_0, FCYNAM_0
      FROM x3v11gsfdata.GSFUAT.PRECEIPT 
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.FACILITY ON PRHFCY_0 = FCY_0 WHERE PTHNUM_0 = @id`));
    if (result && result.recordset.length > 0) {
      for (let index = 0; index < result.recordset.length; index++) {
        const subData = await dbConnection.then(pool => pool.request()
          .input('receiptNo', sql.NVarChar, result.recordset[index].PTHNUM_0)
          .query(`SELECT PTHNUM_0, POHNUM_0, PTDLIN_0, ITMREF_0, ITMDES_0, QTYUOM_0, NETPRI_0, LINATIAMT_0, QTYWEU_0, QTYVOU_0, LINAMT_0 FROM x3v11gsfdata.GSFUAT.PRECEIPTD WHERE PTHNUM_0 = @receiptNo`));
        result.recordset[index].SORDERQ = subData.recordset;
      }
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