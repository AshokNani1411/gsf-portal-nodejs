const dbConnection = require('../models/db');
const sql = require('mssql');
const moment = require('moment');
const lodash = require('lodash');

exports.getDashboardData = async (req, res, next) => {
  try {
    const quoteCur = await dbConnection.then(pool => pool.request()
      .input('x3user', sql.NVarChar, req.body.x3user)
      .input('site', sql.NVarChar, req.body.site)
      .query(`SELECT count(*) AS quoteCur FROM x3v11gsfdata.GSFUAT.SQUOTE WHERE SALFCY_0 = @site AND BPCORD_0 = @x3user AND DATEDIFF(m, QUODAT_0, GETDATE()) = 0;`));
    const quotePrv = await dbConnection.then(pool => pool.request()
      .input('x3user', sql.NVarChar, req.body.x3user)
      .input('site', sql.NVarChar, req.body.site)
      .query(`SELECT count(*) AS quotePrv FROM x3v11gsfdata.GSFUAT.SQUOTE WHERE SALFCY_0 = @site AND BPCORD_0 = @x3user AND DATEDIFF(m, QUODAT_0, GETDATE()) = 1;`));
    const orderCur = await dbConnection.then(pool => pool.request()
      .input('x3user', sql.NVarChar, req.body.x3user)
      .input('site', sql.NVarChar, req.body.site)
      .query(`select count(*) AS orderCur from x3v11gsfdata.GSFUAT.SORDER WHERE SALFCY_0 = @site AND BPCORD_0 = @x3user AND DATEDIFF(m, ORDDAT_0, GETDATE()) = 0`));
    const orderPrv = await dbConnection.then(pool => pool.request()
      .input('x3user', sql.NVarChar, req.body.x3user)
      .input('site', sql.NVarChar, req.body.site)
      .query(`select count(*) AS orderPrv from x3v11gsfdata.GSFUAT.SORDER WHERE SALFCY_0 = @site AND BPCORD_0 = @x3user AND DATEDIFF(m, ORDDAT_0, GETDATE()) = 1`));
    const salesCur = await dbConnection.then(pool => pool.request()
      .input('x3user', sql.NVarChar, req.body.x3user)
      .input('site', sql.NVarChar, req.body.site)
      .query(`SELECT ISNULL(SUM(AMTNOT_0), 0) AS salesCur FROM x3v11gsfdata.GSFUAT.SINVOICE WHERE FCY_0 = @site AND BPR_0 = @x3user AND DATEDIFF(m, BPRDAT_0, GETDATE()) = 0`));
    const salesPrv = await dbConnection.then(pool => pool.request()
      .input('x3user', sql.NVarChar, req.body.x3user)
      .input('site', sql.NVarChar, req.body.site)
      .query(`SELECT ISNULL(SUM(AMTNOT_0), 0) AS salesPrv FROM x3v11gsfdata.GSFUAT.SINVOICE WHERE FCY_0 = @site AND BPR_0 = @x3user AND DATEDIFF(m, BPRDAT_0, GETDATE()) = 1`));
    const paymentCur = await dbConnection.then(pool => pool.request()
          .input('x3user', sql.NVarChar, req.body.x3user)
          .input('site', sql.NVarChar, req.body.site)
          .query(`SELECT ISNULL(SUM(AMTCUR_0), 0) AS paymentCur FROM x3v11gsfdata.GSFUAT.PAYMENTH WHERE FCY_0 = @site AND BPR_0 = @x3user AND DATEDIFF(m, ACCDAT_0, GETDATE()) = 0`));
    const paymentPrv = await dbConnection.then(pool => pool.request()
          .input('x3user', sql.NVarChar, req.body.x3user)
          .input('site', sql.NVarChar, req.body.site)
          .query(`SELECT ISNULL(SUM(AMTCUR_0), 0) AS paymentPrv FROM x3v11gsfdata.GSFUAT.PAYMENTH WHERE FCY_0 = @site AND BPR_0 = @x3user AND DATEDIFF(m, ACCDAT_0, GETDATE()) = 1`));
    const paymentDue = await dbConnection.then(pool => pool.request()
          .input('x3user', sql.NVarChar, req.body.x3user)
          .input('site', sql.NVarChar, req.body.site)
          .query(`SELECT ISNULL(SUM(AMTATIL_0), 0) AS paymentDue FROM x3v11gsfdata.GSFUAT.SINVOICE A LEFT OUTER JOIN x3v11gsfdata.GSFUAT.GACCDUDATE B ON A.NUM_0 = B.NUM_0  WHERE A.FCY_0 = @site AND A.BPR_0 = @x3user  AND B.FLGCLE_0 = 1`));
    const dlvCur = await dbConnection.then(pool => pool.request()
      .input('x3user', sql.NVarChar, req.body.x3user)
      .input('site', sql.NVarChar, req.body.site)
      .query(`SELECT COUNT(*) AS dlvCur FROM x3v11gsfdata.GSFUAT.SDELIVERY WHERE SALFCY_0 = @site AND BPCORD_0 = @x3user AND DATEDIFF(m, DLVDAT_0, GETDATE()) = 0`));
    const dlvPrv = await dbConnection.then(pool => pool.request()
      .input('x3user', sql.NVarChar, req.body.x3user)
      .input('site', sql.NVarChar, req.body.site)
      .query(`SELECT COUNT(*) AS dlvPrv FROM x3v11gsfdata.GSFUAT.SDELIVERY WHERE SALFCY_0 = @site AND BPCORD_0 = @x3user AND DATEDIFF(m, DLVDAT_0, GETDATE()) = 1`));
    const customerSince = await dbConnection.then(pool => pool.request()
      .input('x3user', sql.NVarChar, req.body.x3user)
      .query(`Select A.BPRNUM_0, A.BPRNAM_0, A.CREDAT_0, A.CREDATTIM_0, A.UPDDAT_0 from x3v11gsfdata.GSFUAT.BPARTNER A Where A.BPRNUM_0 = @x3user`));
    const lastQuote = await dbConnection.then(pool => pool.request()
      .input('x3user', sql.NVarChar, req.body.x3user)
      .query(`Select TOP 1 A.QUODAT_0,A.SQHNUM_0, A.QUOATIL_0, A.CUR_0 From x3v11gsfdata.GSFUAT.SQUOTE A Where A.BPCORD_0 = @x3user ORDER BY A.QUODAT_0 DESC`));
    const lastSalesOrder = await dbConnection.then(pool => pool.request()
      .input('x3user', sql.NVarChar, req.body.x3user)
      .query(`Select TOP 1 A.ORDDAT_0,A.SOHNUM_0, A.ORDATI_0, A.CUR_0 From x3v11gsfdata.GSFUAT.SORDER A Where A.BPCORD_0 = @x3user ORDER BY A.ORDDAT_0 DESC`));
    const lastSalesDelivery = await dbConnection.then(pool => pool.request()
      .input('x3user', sql.NVarChar, req.body.x3user)
      .query(`Select TOP 1 A.DLVDAT_0,A.SDHNUM_0, A.DLVATI_0, A.CUR_0 From x3v11gsfdata.GSFUAT.SDELIVERY A Where A.BPCORD_0 = @x3user ORDER BY A.DLVDAT_0 DESC`));
    const lastSalesInvoice = await dbConnection.then(pool => pool.request()
      .input('x3user', sql.NVarChar, req.body.x3user)
      .query(`Select TOP 1 A.ACCDAT_0,A.NUM_0, A.AMTATI_0, A.CUR_0 From x3v11gsfdata.GSFUAT.SINVOICE A Where A.BPR_0 = @x3user ORDER BY A.ACCDAT_0 DESC`));
    const lastPayment = await dbConnection.then(pool => pool.request()
      .input('x3user', sql.NVarChar, req.body.x3user)
      .query(`Select TOP 1 A.ACCDAT_0,A.NUM_0, A.AMTCUR_0, A.CUR_0 From x3v11gsfdata.GSFUAT.PAYMENTH A Where A.BPR_0 = @x3user ORDER BY A.ACCDAT_0 DESC`));

    const chartOrders = await dbConnection.then(pool => pool.request()
      .input('x3user', sql.NVarChar, req.body.x3user)
      .input('site', sql.NVarChar, req.body.site)
      .query(`SELECT FORMAT(A.ORDDAT_0, '%M-%y') AS MONTH, FLOOR(COUNT(*)) AS ODRCNT,FLOOR(SUM(C.QTY_0)) AS DSPTOTQTY_0, SUM(A.DSPTOTWEI_0) AS DSPTOTWEI_0, SUM(A.DSPTOTVOL_0) AS DSPTOTVOL_0, SUM(B.NETPRIATI_0) AS NETPRIATI_0
      FROM x3v11gsfdata.GSFUAT.SORDER A
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.SORDERP B ON A.SOHNUM_0 = B.SOHNUM_0
       LEFT JOIN x3v11gsfdata.GSFUAT.SORDERQ C ON A.SOHNUM_0 = C.SOHNUM_0
      WHERE A.SALFCY_0 = @site AND A.BPCORD_0 = @x3user AND DATEDIFF(m, A.ORDDAT_0, GETDATE()) < 6
      GROUP BY FORMAT(A.ORDDAT_0, '%M-%y')
      `));
    const months = [];
    for (let i = 5; i > -1; i--) {
      months.push(moment().subtract(i, 'months').format('MM-YYYY'))
    }
    const series = [{
        name: 'Orders (UN)',
        data: []
      },
      {
        name: 'Qty Ordered (UN)',
        data: []
      },
      {
        name: 'Weight (LB)',
        data: []
      },
      {
        name: 'Volume (GAL)',
        data: []
      },
      {
        name: 'Turn Over (USD)',
        data: []
      }
    ];
    months.forEach(m => {
      const data = chartOrders.recordset.find(o => o.MONTH === moment(m, 'MM-YYYY').format('M-YY'))
      series[0].data.push(data && data.ODRCNT ? (data.ODRCNT) + 'UN' : 0)
      series[1].data.push(data && data.DSPTOTQTY_0 ? (data.DSPTOTQTY_0)+ 'UN' : 0)
      series[2].data.push(data && data.DSPTOTWEI_0 ? data.DSPTOTWEI_0 + 'GL' : 0)
      series[3].data.push(data && data.DSPTOTVOL_0 ? data.DSPTOTVOL_0 + 'LB': 0)
      series[4].data.push(data && data.NETPRIATI_0 ? data.NETPRIATI_0 + 'USD': 0)
    });

    const secondChartOrders = await dbConnection.then(pool => pool.request()
      .input('x3user', sql.NVarChar, req.body.x3user)
      .input('site', sql.NVarChar, req.body.site)
      .query(`SELECT FORMAT(A.ORDDAT_0, '%M-%y') AS MONTH, COUNT(*) AS ODRCNT,SUM(A.DSPTOTQTY_0) AS DSPTOTQTY_0, SUM(A.DSPTOTWEI_0) AS DSPTOTWEI_0, SUM(A.DSPTOTVOL_0) AS DSPTOTVOL_0
      FROM x3v11gsfdata.GSFUAT.SORDER A
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.SORDERP B ON A.SOHNUM_0 = B.SOHNUM_0
      WHERE A.SALFCY_0 = @site AND A.BPCORD_0 = @x3user AND DATEDIFF(m, A.ORDDAT_0, GETDATE()) < 6
      GROUP BY FORMAT(A.ORDDAT_0, '%M-%y')
      `));
    const monthsForSecondChart = [];
    for (let i = 0; i <= 6; i++) {
      monthsForSecondChart.push(moment().subtract(i, 'months').format('MM-YYYY'))
    }
    const secondSeries = [{
        name: 'Total Orders (UN)',
        data: []
      },
      {
        name: 'Ordered Quantity (UN)',
        data: []
      },
      {
        name: 'Product Mass (LB)',
        data: []
      },
      {
        name: 'Product Volume (GAL)',
        data: []
      }
    ];
    monthsForSecondChart.forEach(m => {
      const data = secondChartOrders.recordset.find(o => o.MONTH === moment(m, 'MM-YYYY').format('M-YY'))
      secondSeries[0].data.push(data && data.ODRCNT ? data.ODRCNT + ' UN' : 0)
      secondSeries[1].data.push(data && data.DSPTOTQTY_0 ? data.DSPTOTQTY_0 + ' UN' : 0)
      secondSeries[2].data.push(data && data.DSPTOTWEI_0 ? data.DSPTOTWEI_0 + ' GAL' : 0)
      secondSeries[3].data.push(data && data.DSPTOTVOL_0 ? data.DSPTOTVOL_0 + ' LB' : 0)
    });

    const productData = await dbConnection.then(pool => pool.request()
      .input('x3user', sql.NVarChar, req.body.x3user)
      .input('site', sql.NVarChar, req.body.site)
      .query(`SELECT * FROM (SELECT FORMAT(A.ORDDAT_0, '%M-%y') AS MONTH, A.ORDDAT_0, COUNT(*) as ODRCOUNT, B.ITMREF_0, I.ITMDES1_0 AS ITMDES_0, SUM(B.QTY_0) as QTY_0, SUM(B.DLVQTY_0) as DLVQTY_0, SUM(B.INVQTY_0) as INVQTY_0, SUM(B.DSPLINWEI_0) as DSPLINWEI_0, SUM(B.DSPLINVOL_0) as DSPLINVOL_0, A.DSPWEU_0, A.DSPVOU_0, 'UN' AS QTYUN
      FROM x3v11gsfdata.GSFUAT.SORDER A
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.SORDERQ B ON A.SOHNUM_0 = B.SOHNUM_0
      LEFT JOIN x3v11gsfdata.GSFUAT.ITMMASTER I ON I.ITMREF_0 = B.ITMREF_0
      LEFT OUTER JOIN x3v11gsfdata.GSFUAT.SORDERC C ON A.SOHNUM_0 = C.SOHNUM_0
      WHERE A.SALFCY_0 = @site AND A.BPCORD_0 = @x3user AND DATEDIFF(m, A.ORDDAT_0, GETDATE()) < 6
      GROUP BY FORMAT(A.ORDDAT_0, '%M-%y'), A.ORDDAT_0, B.ITMREF_0, I.ITMDES1_0,  A.DSPWEU_0, A.DSPVOU_0) AS d
      ORDER BY d.ORDDAT_0 DESC, d.QTY_0 DESC`));

    const discussions = await dbConnection.then(pool => pool.request()
      .query(`Select TOP 5 ROWID, X10CFORUMID_0, X10CTITLE_0, X10CTITDES_0, X10CCREDAT_0, CREDATTIM_0, UPDDATTIM_0, CREUSR_0
      From x3v11gsfdata.GSFUAT.XX10CPORDISH ORDER BY CREDATTIM_0 DESC`));

    const announcements = await dbConnection.then(pool => pool.request()
      .query(`Select TOP 5 ROWID, X10CSEQ_0, X10CSUBJECT_0, X10CSUBDES_0, X10CCREDAT_0, X10CEXPDAT_0, CREDATTIM_0,CREUSR_0
      From x3v11gsfdata.GSFUAT.XX10CPORANN
      Order By X10CCREDAT_0 DESC`));

    const documents = await dbConnection.then(pool => pool.request()
      .input('x3user', sql.NVarChar, req.body.x3user)
      .query(`Select TOP 5 ROWID, X10CSEQ_0, X10CDOCTYP_0, X10CDOCDES_0, X10CBP_0, X10CGEN_0, X10CDOCID_0, X10CDAT_0, X10CEXPDAT_0, CREUSR_0, CREDATTIM_0 From x3v11gsfdata.GSFUAT.XX10CPORDOC WHERE (X10CALL_0 = 2 OR X10CBP_0 = @x3user)
      Order By X10CDAT_0 DESC`));

    res.json({
      success: true,
      data: {
        quoteCur: quoteCur.recordset[0].quoteCur,
        paymentCur : paymentCur.recordset[0].paymentCur,
        paymentPrv : paymentPrv.recordset[0].paymentPrv,
        paymentDue : paymentDue.recordset[0].paymentDue,
        quotePrv: quotePrv.recordset[0].quotePrv,
        orderCur: orderCur.recordset[0].orderCur,
        orderPrv: orderPrv.recordset[0].orderPrv,
        salesCur: salesCur.recordset[0].salesCur,
        salesPrv: salesPrv.recordset[0].salesPrv,
        customerSince: customerSince.recordset.length > 0 ? customerSince.recordset[0] : {},
        lastQuote: lastQuote.recordset.length > 0 ? lastQuote.recordset[0] : {},
        lastSalesOrder: lastSalesOrder.recordset.length > 0 ? lastSalesOrder.recordset[0] : {},
        lastSalesDelivery: lastSalesDelivery.recordset.length > 0 ? lastSalesDelivery.recordset[0] : {},
        lastSalesInvoice: lastSalesInvoice.recordset.length > 0 ? lastSalesInvoice.recordset[0] : {},
        lastPayment: lastPayment.recordset.length > 0 ? lastPayment.recordset[0] : {},
        dlvCur: dlvCur.recordset[0].dlvCur,
        dlvPrv: dlvPrv.recordset[0].dlvPrv,
        productData: lodash.groupBy(productData.recordset, 'MONTH'),
        chartData: {
          labels: months,
          series
        },
        secondChartData: {
          labels: monthsForSecondChart,
          series: secondSeries
        },
        discussions: discussions.recordset,
        announcements: announcements.recordset,
        documents: documents.recordset
      }
    });
  } catch (error) {
    return next(error);
  }
};

exports.getSupplierDashboardData = async (req, res, next) => {
  try {
    const quoteCur = await dbConnection.then(pool => pool.request()
      .input('x3user', sql.NVarChar, req.body.x3user)
      .input('site', sql.NVarChar, req.body.site)
      .query(`SELECT count(*) AS quoteCur FROM x3v11gsfdata.GSFUAT.PREQUISD WHERE PSHFCY_0 = @site AND BPSNUM_0 = @x3user AND DATEDIFF(m, EXTRCPDAT_0, GETDATE()) = 0;`));
    const quotePrv = await dbConnection.then(pool => pool.request()
      .input('x3user', sql.NVarChar, req.body.x3user)
      .input('site', sql.NVarChar, req.body.site)
      .query(`SELECT count(*) AS quotePrv FROM x3v11gsfdata.GSFUAT.PREQUISD WHERE PSHFCY_0 = @site AND BPSNUM_0 = @x3user AND DATEDIFF(m, EXTRCPDAT_0, GETDATE()) = 1;`));
    const orderCur = await dbConnection.then(pool => pool.request()
      .input('x3user', sql.NVarChar, req.body.x3user)
      .input('site', sql.NVarChar, req.body.site)
      .query(`select count(*) AS orderCur from x3v11gsfdata.GSFUAT.PORDER WHERE POHFCY_0 = @site AND BPSNUM_0 = @x3user AND DATEDIFF(m, ORDDAT_0, GETDATE()) = 0;`));
    const orderPrv = await dbConnection.then(pool => pool.request()
      .input('x3user', sql.NVarChar, req.body.x3user)
      .input('site', sql.NVarChar, req.body.site)
      .query(`select count(*) AS orderPrv from x3v11gsfdata.GSFUAT.PORDER WHERE POHFCY_0 = @site AND BPSNUM_0 = @x3user AND DATEDIFF(m, ORDDAT_0, GETDATE()) = 1;`));
    const dlvCur = await dbConnection.then(pool => pool.request()
      .input('x3user', sql.NVarChar, req.body.x3user)
      .input('site', sql.NVarChar, req.body.site)
      .query(`SELECT COUNT(*) AS dlvCur FROM x3v11gsfdata.GSFUAT.PRECEIPT WHERE PRHFCY_0 = @site AND BPSNUM_0 = @x3user AND DATEDIFF(m, RCPDAT_0, GETDATE()) = 0`));
    const dlvPrv = await dbConnection.then(pool => pool.request()
      .input('x3user', sql.NVarChar, req.body.x3user)
      .input('site', sql.NVarChar, req.body.site)
      .query(`SELECT COUNT(*) AS dlvPrv FROM x3v11gsfdata.GSFUAT.PRECEIPT WHERE PRHFCY_0 = @site AND BPSNUM_0 = @x3user AND DATEDIFF(m, RCPDAT_0, GETDATE()) = 1`));
    const salesCur = await dbConnection.then(pool => pool.request()
      .input('x3user', sql.NVarChar, req.body.x3user)
      .input('site', sql.NVarChar, req.body.site)
      .query(`SELECT ISNULL(SUM(AMTNOT_0), 0) AS salesCur FROM x3v11gsfdata.GSFUAT.PINVOICE WHERE FCY_0 = @site AND BPR_0 = @x3user AND DATEDIFF(m, BPRDAT_0, GETDATE()) = 0`));
    const salesPrv = await dbConnection.then(pool => pool.request()
      .input('x3user', sql.NVarChar, req.body.x3user)
      .input('site', sql.NVarChar, req.body.site)
      .query(`SELECT ISNULL(SUM(AMTNOT_0), 0) AS salesPrv FROM x3v11gsfdata.GSFUAT.PINVOICE WHERE FCY_0 = @site AND BPR_0 = @x3user AND DATEDIFF(m, BPRDAT_0, GETDATE()) = 1`));
    const supplierSince = await dbConnection.then(pool => pool.request()
      .input('x3user', sql.NVarChar, req.body.x3user)
      .query(`Select A.BPRNUM_0, A.BPRNAM_0, A.CREDAT_0, A.CREDATTIM_0, A.UPDDAT_0 from x3v11gsfdata.GSFUAT.BPARTNER A Where A.BPRNUM_0 = @x3user`));
    const lastPurchaseRequeat = await dbConnection.then(pool => pool.request()
      .input('x3user', sql.NVarChar, req.body.x3user)
      .query(`Select TOP 1 B.PRQDAT_0,B.PSHNUM_0, A.LINAMT_0 From x3v11gsfdata.GSFUAT.PREQUISD A INNER JOIN PREQUIS B ON A.PSHNUM_0 = B.PSHNUM_0 Where A.BPSNUM_0 = @x3user ORDER BY B.PRQDAT_0 DESC`));
    const lastPurchaseOrder = await dbConnection.then(pool => pool.request()
      .input('x3user', sql.NVarChar, req.body.x3user)
      .query(`Select TOP 1 A.ORDDAT_0,A.POHNUM_0, A.TOTLINATI_0 From x3v11gsfdata.GSFUAT.PORDER A Where A.BPSNUM_0 = @x3user ORDER BY A.ORDDAT_0 DESC`));
    const lastPurchaseReceipt = await dbConnection.then(pool => pool.request()
      .input('x3user', sql.NVarChar, req.body.x3user)
      .query(`Select TOP 1 A.RCPDAT_0,A.PTHNUM_0, A.TOTAMTATI_0 From x3v11gsfdata.GSFUAT.PRECEIPT A Where A.BPSNUM_0 = @x3user ORDER BY A.RCPDAT_0 DESC`));
    const lastPurchaseInvoice = await dbConnection.then(pool => pool.request()
      .input('x3user', sql.NVarChar, req.body.x3user)
      .query(`Select TOP 1 A.ACCDAT_0,A.NUM_0, A.AMTATI_0 From x3v11gsfdata.GSFUAT.PINVOICE A Where A.BPR_0 = @x3user ORDER BY A.ACCDAT_0 DESC`));
    const lastPayment = await dbConnection.then(pool => pool.request()
      .input('x3user', sql.NVarChar, req.body.x3user)
      .query(`Select TOP 1 A.ACCDAT_0,A.NUM_0, A.AMTCUR_0 From x3v11gsfdata.GSFUAT.PAYMENTH A Where A.BPR_0 = @x3user ORDER BY A.ACCDAT_0 DESC`));

    const chartOrders = await dbConnection.then(pool => pool.request()
      .input('x3user', sql.NVarChar, req.body.x3user)
      .input('site', sql.NVarChar, req.body.site)
      .query(`SELECT FORMAT(A.ORDDAT_0, '%M-%y') AS MONTH, COUNT(*) AS ODRCNT,SUM(A.TOTLINQTY_0) AS TOTLINQTY_0, SUM(A.TOTLINWEU_0) AS TOTLINWEU_0, SUM(A.TOTLINVOU_0) AS TOTLINVOU_0, SUM(A.TTVORD_0) AS TTVORD_0
      FROM x3v11gsfdata.GSFUAT.PORDER A
      WHERE A.POHFCY_0 = @site AND A.BPSNUM_0 = @x3user AND DATEDIFF(m, A.ORDDAT_0, GETDATE()) < 6
      GROUP BY FORMAT(A.ORDDAT_0, '%M-%y')
      `));
    const months = [];
    for (let i = 5; i > -1; i--) {
      months.push(moment().subtract(i, 'months').format('MM-YYYY'))
    }
    const series = [{
        name: 'Orders',
        data: []
      },
      {
        name: 'Qty Ordered',
        data: []
      },
      {
        name: 'Weight',
        data: []
      },
      {
        name: 'Volume',
        data: []
      },
      {
        name: 'Turn Over',
        data: []
      }
    ];
    months.forEach(m => {
      const data = chartOrders.recordset.find(o => o.MONTH === moment(m, 'MM-YYYY').format('M-YY'))
      series[0].data.push(data && data.ODRCNT ? data.ODRCNT : 0)
      series[1].data.push(data && data.TOTLINQTY_0 ? data.TOTLINQTY_0 : 0)
      series[2].data.push(data && data.TOTLINWEU_0 ? data.TOTLINWEU_0 : 0)
      series[3].data.push(data && data.TOTLINVOU_0 ? data.TOTLINVOU_0 : 0)
      series[4].data.push(data && data.TTVORD_0 ? data.TTVORD_0 : 0)
    });

    const secondChartOrders = await dbConnection.then(pool => pool.request()
      .input('x3user', sql.NVarChar, req.body.x3user)
      .input('site', sql.NVarChar, req.body.site)
      .query(`SELECT FORMAT(A.ORDDAT_0, '%M-%y') AS MONTH, COUNT(*) AS ODRCNT,SUM(A.TOTLINQTY_0) AS TOTLINQTY_0, SUM(A.TOTLINWEU_0) AS TOTLINWEU_0, SUM(A.TOTLINVOU_0) AS TOTLINVOU_0
      FROM x3v11gsfdata.GSFUAT.PORDER A
      WHERE A.POHFCY_0 = @site AND A.BPSNUM_0 = @x3user AND DATEDIFF(m, A.ORDDAT_0, GETDATE()) < 6
      GROUP BY FORMAT(A.ORDDAT_0, '%M-%y')
      `));
    const monthsForSecondChart = [];
    for (let i = 0; i < 6; i++) {
      monthsForSecondChart.push(moment().subtract(i, 'months').format('MM-YYYY'))
    }
    const secondSeries = [{
        name: 'Total Orders',
        data: []
      },
      {
        name: 'Ordered Quantity',
        data: []
      },
      {
        name: 'Product Mass',
        data: []
      },
      {
        name: 'Product Volume',
        data: []
      }
    ];
    monthsForSecondChart.forEach(m => {
      const data = secondChartOrders.recordset.find(o => o.MONTH === moment(m, 'MM-YYYY').format('M-YY'))
      secondSeries[0].data.push(data && data.ODRCNT ? data.ODRCNT : 0)
      secondSeries[1].data.push(data && data.TOTLINQTY_0 ? data.TOTLINQTY_0 : 0)
      secondSeries[2].data.push(data && data.TOTLINWEU_0 ? data.TOTLINWEU_0 : 0)
      secondSeries[3].data.push(data && data.TOTLINVOU_0 ? data.TOTLINVOU_0 : 0)
    });

    const discussions = await dbConnection.then(pool => pool.request()
      .query(`Select TOP 5 ROWID, X10CFORUMID_0, X10CTITLE_0, X10CTITDES_0, X10CCREDAT_0, CREDATTIM_0, UPDDATTIM_0, CREUSR_0
      From x3v11gsfdata.GSFUAT.XX10CPORDISH ORDER BY CREDATTIM_0 DESC`));

    const announcements = await dbConnection.then(pool => pool.request()
      .query(`Select TOP 5 ROWID, X10CSEQ_0, X10CSUBJECT_0, X10CSUBDES_0, X10CCREDAT_0, X10CEXPDAT_0, CREDATTIM_0,CREUSR_0
      From x3v11gsfdata.GSFUAT.XX10CPORANN
      Order By X10CCREDAT_0 DESC`));

    const documents = await dbConnection.then(pool => pool.request()
      .input('x3user', sql.NVarChar, req.body.x3user)
      .query(`Select TOP 5 ROWID, X10CSEQ_0, X10CDOCTYP_0, X10CDOCDES_0, X10CBP_0, X10CGEN_0, X10CDOCID_0, X10CDAT_0, X10CEXPDAT_0, CREUSR_0, CREDATTIM_0 From x3v11gsfdata.GSFUAT.XX10CPORDOC WHERE (X10CALL_0 = 2 OR X10CBP_0 = @x3user)
      Order By X10CDAT_0 DESC`));

    res.json({
      success: true,
      data: {
        quoteCur: quoteCur.recordset[0].quoteCur,
        quotePrv: quotePrv.recordset[0].quotePrv,
        orderCur: orderCur.recordset[0].orderCur,
        orderPrv: orderPrv.recordset[0].orderPrv,
        salesCur: salesCur.recordset[0].salesCur,
        salesPrv: salesPrv.recordset[0].salesPrv,
        supplierSince: supplierSince.recordset.length > 0 ? supplierSince.recordset[0] : {},
        lastPurchaseRequeat: lastPurchaseRequeat.recordset.length > 0 ? lastPurchaseRequeat.recordset[0] : {},
        lastPurchaseOrder: lastPurchaseOrder.recordset.length > 0 ? lastPurchaseOrder.recordset[0] : {},
        lastPurchaseReceipt: lastPurchaseReceipt.recordset.length > 0 ? lastPurchaseReceipt.recordset[0] : {},
        lastPurchaseInvoice: lastPurchaseInvoice.recordset.length > 0 ? lastPurchaseInvoice.recordset[0] : {},
        lastPayment: lastPayment.recordset.length > 0 ? lastPayment.recordset[0] : {},
        dlvCur: dlvCur.recordset[0].dlvCur,
        dlvPrv: dlvPrv.recordset[0].dlvPrv,
        chartData: {
          labels: months,
          series
        },
        secondChartData: {
          labels: monthsForSecondChart,
          series: secondSeries
        },
        discussions: discussions.recordset,
        announcements: announcements.recordset,
        documents: documents.recordset
      }
    });
  } catch (error) {
    return next(error);
  }
};