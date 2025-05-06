const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const authMiddleware = require('../middleware/auth.middleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Invoice CRUD routes
router.get('/', invoiceController.getAllInvoices);
router.get('/:id', invoiceController.getInvoiceById);
router.post('/', invoiceController.createInvoice);
router.put('/:id', invoiceController.updateInvoice);
router.delete('/:id', invoiceController.deleteInvoice);

// PDF generation route - support both GET and POST for direct downloads
router.get('/:id/pdf', invoiceController.generatePDF);
router.post('/:id/pdf', invoiceController.generatePDF);

module.exports = router; 