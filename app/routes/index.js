const express = require('express');
const router = express.Router();
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '.' + '/uploads');
  },
  filename: (req, file, cb) => {
    const extension = file.originalname.substring((file.originalname.lastIndexOf('.') + 1), file.originalname.length);
    const updatedFileName = file.fieldname + '-' + new Date().getTime() + '.' + extension;
    cb(null, updatedFileName);
  }
});
const upload = multer({
  storage
});
const authController = require('../controllers/auth.controller');
const commonController = require('../controllers/common.controller');
const announcementController = require('../controllers/announcement.controller');
const discussionForumController = require('../controllers/discussion-forum.controller');
const documentController = require('../controllers/document.controller');
const userController = require('../controllers/user.controller');
const contactController = require('../controllers/contact.controller');
const dashboardController = require('../controllers/dashboard.controller');
const siteController = require('../controllers/site.controller');
const roleController = require('../controllers/role.controller');
const customerController = require('../controllers/customer.controller');
const supplierController = require('../controllers/supplier.controller');
const serviceRequestController = require('../controllers/service-request.controller');
const dropRequestController = require('../controllers/drop-request.controller');
const pickupRequestController = require('../controllers/pickup-request.controller');
const orderController = require('../controllers/order.controller');
const returnController = require('../controllers/return.controller');
const paymentController = require('../controllers/payment.controller')
const quoteController = require('../controllers/quote.controller');
const deliveryController = require('../controllers/delivery.controller');
const invoiceController = require('../controllers/invoice.controller');
const purchaseOrderController = require('../controllers/purchase-order.controller');

const receiptController = require('../controllers/receipt.controller');
const calendarController = require('../controllers/calendar.controller');
const productController = require('../controllers/product.controller');
const mapController = require('../controllers/map.controller');
const {
  loginRequest
} = require('../utils/validations/auth.validation');
const {
  authorize
} = require('../middleware/auth');
const {
  validate
} = require("express-validation");

// Auth
router.post("/login", validate(loginRequest), authController.login);

// Common
router.get("/addresses", authorize(), commonController.getAllAddresses);
router.get("/carriers", authorize(), commonController.getAllCarrier);
router.get("/deliverymodes", authorize(), commonController.getAllDeliveryModes);
router.get("/languages", authorize(), commonController.getAllLanguages);
router.get("/designations", authorize(), commonController.getAllDesignations);

// Sites
router.get("/sites", authorize(), siteController.getAllSites);
router.get("/sites/:id", authorize(), siteController.getSiteById);

// Roles
router.get("/roles", authorize(), roleController.getAllRoles);

// Dashboard
router.post("/getdashboarddata", dashboardController.getDashboardData);
router.post("/getsupplierdashboarddata", dashboardController.getSupplierDashboardData);

// Business Partners
router.get("/business-partners", authorize(), customerController.getAllBusinessPartners);

// Customers
router.get("/customer/:code", customerController.getCustomerNameByCode);
router.get("/customers", authorize(), customerController.getAllCustomers);
router.get("/customer-concode", authorize(), customerController.getCustomerConCode);

// Suppliers
router.get("/suppliers", authorize(), supplierController.getAllSuppliers);
router.get("/supplier-concode", authorize(), supplierController.getSupplierConCode);

// Contact
router.get("/contacts", authorize(), contactController.getAllContacts);
router.get("/contact/:id", authorize(), contactController.getContactDetail);
router.post("/createeditcontact", authorize(), contactController.createEditContact);
router.post("/contact/delete", authorize(), contactController.deleteContact);

// Announcement
router.get("/announcements", authorize(), announcementController.getAllAnnouncements);
router.get("/announcements/:id", authorize(), announcementController.getAnnouncementDetail);
router.post("/announcements/create", authorize(), announcementController.createEditAnnouncement);
router.post("/announcements/delete", authorize(), announcementController.deleteAnnouncement);

// Discussion Forums
router.get("/discussionforums", authorize(), discussionForumController.getAllDiscussionForums);
router.get("/discussionforums/:id", authorize(), discussionForumController.getDiscussionForumDetail);
router.post("/discussionforums/create", authorize(), discussionForumController.createEditDiscussionForum);
router.post("/discussionforums/delete", authorize(), discussionForumController.deleteDiscussionForum);
router.post("/discussionforums/add-message", authorize(), discussionForumController.addMessage);

// Document
router.post("/documents", authorize(), documentController.getAllDocuments);
router.get("/documents/:id", authorize(), documentController.getDocumentDetail);
router.post("/documents/create", authorize(), upload.single("file"), documentController.createEditDocument);
router.post("/documents/delete", authorize(), documentController.deleteDocument);

// Users
router.get("/users", authorize(), userController.getAllUsers);
router.get("/getAdminSeq", authorize(), userController.getAdminSeq);
router.post("/createedituser", authorize(), userController.createEditUser);
router.post("/users/delete", authorize(), userController.deleteUser);
router.get("/users/:id", authorize(), userController.getUserDetail);

// Drop Request
router.post("/drop-requests", authorize(), dropRequestController.getAllDropRequests);
router.post("/create-drop-request", authorize(), dropRequestController.createDropRequest);
router.get("/drop-requests/:id", authorize(), dropRequestController.getDropRequestDetail);
router.post("/drop-requests/delete", authorize(), dropRequestController.deleteDropRequest);


//Service request

router.post("/service-requests", authorize(), serviceRequestController.getAllServiceRequests);
router.get("/service-requests/:id", authorize(), serviceRequestController.getServiceRequestDetail);


//payment

router.post("/payments", authorize(), paymentController.getAllPayments);
router.get("/payment/:id", authorize(), paymentController.getPaymentDetail);
router.post("/payment/invoices", authorize(), paymentController.getPaymentPendingInvoices);

//cart Request
router.post("/socart-requests", authorize(), dropRequestController.getAllSOCartRequests);
router.post("/create-socart-request", authorize(), dropRequestController.createSOCartRequest);
router.post("/socart-requests/delete", authorize(), dropRequestController.deleteSOCartRequest);

// Pickup Request
router.post("/pickup-requests", authorize(), pickupRequestController.getAllPickupRequests);
router.post("/create-pickup-request", authorize(), pickupRequestController.createPickupRequest);
router.get("/pickup-requests/:id", authorize(), pickupRequestController.getPickupRequestDetail);
router.post("/pickup-requests/delete", authorize(), pickupRequestController.deletePickupRequest);

// Orders
router.post("/orders", authorize(), orderController.getAllOrders);
router.get("/order/:id", authorize(), orderController.getOrderDetail);

// Returns
router.post("/returns", authorize(), returnController.getAllReturns);
router.get("/return/:id", authorize(), returnController.getReturnDetail);


// Quotes
router.post("/quotes", authorize(), quoteController.getAllQuotes);
router.get("/quote/:id", authorize(), quoteController.getQuoteDetail);

// Products
router.get("/products", authorize(), productController.getAll);
router.get("/productcateg", authorize(), productController.getAllProductCategories);
router.get("/installbase", authorize(), productController.getAllInstalledBase);
router.get("/consumption", authorize(), productController.getAllConsumptions);

// Purchase Orders
router.post("/purchase-orders", authorize(), purchaseOrderController.getAllPurchaseOrders);
router.get("/purchase-order/:id", authorize(), purchaseOrderController.getPurchaseOrderDetail);

// Deliveries
router.post("/deliveries", authorize(), deliveryController.getAllDeliveries);
router.get("/deliveries/:id", authorize(), deliveryController.getDeliveryDetail);
router.get("/delivery/:id", authorize(), deliveryController.getDeliveryInfo);

// Invoices
router.post("/customer-invoices", authorize(), invoiceController.getAllCustomerInvoices);
router.get("/customer-invoice/:id", authorize(), invoiceController.getCustomerInvoiceDetail);
router.post("/supplier-invoices", authorize(), invoiceController.getAllSupplierInvoices);
router.get("/supplier-invoice/:id", authorize(), invoiceController.getSupplierInvoiceDetail);
router.post("/customer-creditnote", authorize(), invoiceController.getAllCustomerCreditNote);
router.get("/customer-creditnote/:id", authorize(), invoiceController.getCustomerCreditNoteDetail);

// Receipts
router.post("/receipts", authorize(), receiptController.getAllReceipts);
router.get("/receipts/:id", authorize(), receiptController.getReceiptDetail);
router.get("/receipt/:id", authorize(), receiptController.getReceiptInfo);

// Calendar APIS
router.post("/calendar/getall", authorize(), calendarController.getAll);

// MAP APIS
router.post("/map/getall", authorize(), mapController.getAll);

module.exports = router;