const dbConnection = require('../models/db');
const sql = require('mssql');

exports.getAllDeliveries = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('x3user', sql.NVarChar, req.body.x3user)
      .input('site', sql.NVarChar, req.body.site)
      .query(`SELECT SALFCY_0,A.DLVINVATI_0,A.CUR_0, SDHNUM_0,DLVDAT_0,BPCORD_0,XDLV_STATUS_0, BPDCRY_0,BPDCTY_0,PACNBR_0,NETWEI_0, WEU_0,A.VOL_0,A.VOU_0,DRN_0,XX10C_NUMPC_0,A.DRIVERID_0,A.CODEYVE_0,CNDNAM_0,SOHNUM_0, MDL_0, XPODUSER_0,A.LICPLATE_0, B.CNTFNA_0, B.CNTLNA_0, C.DRIVER_0, D.NAME_0, (SELECT count(*)
      FROM x3v11gsfdata.GSFUAT.XX10CXPODH WHERE XSDHNUM_0 = A.SDHNUM_0) AS ISPOD, (SELECT TEXTE_0 FROM x3v11gsfdata.GSFUAT.ATEXTRA WHERE CODFIC_0='TABMODELIV' AND IDENT1_0= A.MDL_0 AND ZONE_0='DESAXX' AND LANGUE_0='ENG') As MDL_DESC,
      CASE WHEN ARVDAT_0 < '01/01/1900' THEN A.UPDDAT_0 ELSE ARVDAT_0 END AS ARVDAT_0,
      CASE WHEN XARVTIME_0 = '' THEN CONVERT(VARCHAR(8),A.UPDDATTIM_0,108) ELSE XARVTIME_0 END AS XARVTIME_0,
      CASE WHEN DPEDAT_0 < '01/01/1900' THEN A.UPDDAT_0 ELSE DPEDAT_0 END AS DPEDAT_0,
      CASE WHEN XDEPTIME_0 = '' THEN CONVERT(VARCHAR(8),A.UPDDATTIM_0,108) ELSE XDEPTIME_0 END AS XDEPTIME_0
      FROM x3v11gsfdata.GSFUAT.SDELIVERY A 
      INNER JOIN x3v11gsfdata.GSFUAT.CONTACTCRM  B ON A.CNDNAM_0 = B.CNTNUM_0
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.XX10CDRIVER C ON A.XPODUSER_0 = C.DRIVERID_0
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.XX10CVEHICUL D ON A.LICPLATE_0 = D.CODEYVE_0
      WHERE SALFCY_0 = @site AND BPCORD_0 = @x3user ORDER BY A.DLVDAT_0 DESC`));
    if (result && result.recordset.length > 0) {
      for (let index = 0; index < result.recordset.length; index++) {
        const subData = await dbConnection.then(pool => pool.request()
          .input('orderNo', sql.NVarChar, result.recordset[index].SOHNUM_0)
          .input('deliveryNo', sql.NVarChar, result.recordset[index].SDHNUM_0)
          .query(`SELECT A.SDHNUM_0, B.SDDLIN_0, B.SOHNUM_0, B.SOPLIN_0, B.ITMREF_0, B.ITMDES_0, B.QTYSTU_0, B.STU_0, B.DSPLINWEI_0, B.DSPWEU_0, B.DSPLINVOL_0, B.DSPVOU_0
          FROM x3v11gsfdata.GSFUAT.SDELIVERY A
          LEFT OUTER JOIN x3v11gsfdata.GSFUAT.SDELIVERYD B ON A.SDHNUM_0 = B.SDHNUM_0
          WHERE A.SDHNUM_0 = @deliveryNo AND B.SOHNUM_0 = @orderNo`)
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

exports.getDeliveryDetail = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('id', sql.NVarChar, req.params.id)
      .query(`SELECT A.XSDHNUM_0,A.XDLVDAT_0,A.XBPCORD1_0,A.XBPRNAM1_0,A.XPODREF_0,A.UPDDATTIM_0,A.UPDUSR_0,A.XBPNAME_0,A.XBPAADDLIG_0,
      A.XBPAADDLIG_1,A.XBPAADDLIG_2,A.XBPAADDLIG_3,A.XBPAADDLIG_4,A.XPOSCOD_0,XCTY_0,A.XCRY_0,XMOB_0,A.XWEB_0,
      S.XX10C_GEOX_0,S.XX10C_GEOY_0,A.XETAD_0,A.XETAT_0,A.XCNFARRT_0,A.XCNFARRD_0,A.XSTRTUNT_0,A.XSTRUNLD_0,A.XCAPDDD_0,A.XCAPDDT_0,
      A.XENDUNLD_0,A.XENDUNLT_0,A.XCNFDEPD_0,A.XCNFDEPT_0,A.XETDD_0,A.XETDT_0,A.XVEHROU_0,A.XDELSCH_0,A.XVEH_0,A.XUSER_0,
      A.XBPTNUMSDH_0,A.XBPTNAM_0,A.XBPTEMAIL_0,A.XGROWEI_0,A.XNETWEI_0,A.XWEU_0,A.XVOL_0,A.XVOU_0,A.XPACNBR_0,A.XBPTCODE_0,
      A.XBPTCNT_0,A.XBPAADD_0,A.XPODRDY_0,A.XRDYUSR_0,A.XRDYTIM_0,A.XRDYDAT_0,A.CREDATTIM_0,C.BPCNAM_0,S.BPTNUM_0, D.WEB_0, D.MOB_0, E.NAME_0, F.DRIVER_0, G.BPTNAM_0
      FROM x3v11gsfdata.GSFUAT.XX10CXPODH A 
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.BPCUSTOMER C ON A.XBPCORD1_0 = C.BPCNUM_0  
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.SDELIVERY S ON A.XSDHNUM_0 =S.SDHNUM_0  
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.BPADDRESS D ON A.XBPCORD1_0 = D.BPANUM_0 AND D.BPATYP_0 = 1 AND S.BPAADD_0 = D.BPAADD_0
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.XX10CVEHICUL E ON A.XVEH_0 = E.CODEYVE_0
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.XX10CDRIVER F ON A.XUSER_0 = F.DRIVERID_0
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.BPCARRIER G ON A.XBPTNUMSDH_0 = G.BPTNUM_0
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

exports.getDeliveryInfo = async (req, res, next) => {
  try {
    const result = await dbConnection.then(pool => pool.request()
      .input('id', sql.NVarChar, req.params.id)
      .query(`SELECT SDHNUM_0, SALFCY_0, SHIDAT_0, DLVDAT_0, DAYLTI_0, XDLV_STATUS_0,
         (SELECT TEXTE_0 FROM .ATEXTRA WHERE CODFIC_0='TABMODELIV' AND IDENT1_0= A.MDL_0 AND ZONE_0='DESAXX' AND LANGUE_0='ENG')As MDL_DESC,
          B.FCYNAM_0 ,A.BPAADD_0, A.BPDNAM_0, A.CUR_0,A.PTE_0 ,A.MDL_0 , A.BPTNUM_0,Z.TEXTE_0,C.BPTNAM_0, A.DLVINVATI_0
      FROM x3v11gsfdata.GSFUAT.SDELIVERY A
      INNER JOIN x3v11gsfdata.GSFUAT.FACILITY B ON A.SALFCY_0 = B.FCY_0
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.BPCARRIER C ON A.BPTNUM_0 = C.BPTNUM_0
         LEFT OUTER JOIN x3v11gsfdata.GSFUAT.ATEXTRA Z ON A.PTE_0 = Z.IDENT1_0 AND Z.CODFIC_0 = 'TABPAYTERM' AND Z.ZONE_0 = 'DESAXX' AND Z.LANGUE_0 = 'FRA'

      WHERE SDHNUM_0 = @id`));
    if (result && result.recordset.length > 0) {
      for (let index = 0; index < result.recordset.length; index++) {
        const subData = await dbConnection.then(pool => pool.request()
          .input('deliveryNo', sql.NVarChar, result.recordset[index].SDHNUM_0)
          .query(`SELECT A.SDHNUM_0, A.SDDLIN_0,A.SAU_0, A.ITMREF_0, A.ITMDES_0, A.QTY_0, A.NETPRI_0, A.LOC_0, A.DSPLINWEI_0, A.WEU_0, A.DSPLINVOL_0, A.DSPVOU_0, A.SOHNUM_0, A.XORGNLQTY_0, B.LICPLATE_0
          FROM x3v11gsfdata.GSFUAT.SDELIVERYD A
          INNER JOIN x3v11gsfdata.GSFUAT.SDELIVERY B ON A.SDHNUM_0 = B.SDHNUM_0
          WHERE A.SDHNUM_0=@deliveryNo`));
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