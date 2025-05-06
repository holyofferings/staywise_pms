const Invoice = require('../models/Invoice');
const Hotel = require('../models/Hotel');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Get all invoices
exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 });
    
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get invoice by ID
exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create invoice
exports.createInvoice = async (req, res) => {
  try {
    const newInvoice = new Invoice({
      ...req.body,
      createdBy: req.user.id
    });
    
    await newInvoice.save();
    res.status(201).json(newInvoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update invoice
exports.updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete invoice
exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    res.status(200).json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Generate PDF for invoice
exports.generatePDF = async (req, res) => {
  try {
    // Check for token in query params or request body
    if ((req.query && req.query.token && !req.headers.authorization) || 
        (req.body && req.body.token && !req.headers.authorization)) {
      const token = req.query.token || req.body.token;
      req.headers.authorization = `Bearer ${token}`;
    }
    
    const invoice = await Invoice.findById(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    // Create PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50
    });

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.number}.pdf`);

    // Pipe the PDF to the response
    doc.pipe(res);

    // Add hotel logo if available
    if (invoice.hotel.logoUrl) {
      doc.image(invoice.hotel.logoUrl, 50, 45, { width: 100 });
    }

    // Add invoice header
    doc.fontSize(20).text('INVOICE', { align: 'center' });
    doc.moveDown();

    // Add hotel details
    doc.fontSize(12).text(invoice.hotel.name, { align: 'left' });
    doc.fontSize(10).text(invoice.hotel.address, { align: 'left' });
    doc.fontSize(10).text(`GSTIN: ${invoice.hotel.gstin}`, { align: 'left' });
    doc.moveDown();

    // Add invoice details
    doc.fontSize(10)
      .text(`Invoice Number: ${invoice.number}`, { align: 'left' })
      .text(`Date: ${new Date(invoice.date).toLocaleDateString('en-IN')}`, { align: 'left' })
      .text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString('en-IN')}`, { align: 'left' });
    doc.moveDown();

    // Add customer details
    doc.fontSize(12).text('Customer Details', { align: 'left' });
    doc.fontSize(10)
      .text(`Name: ${invoice.customer.name}`, { align: 'left' })
      .text(`Address: ${invoice.customer.address || 'N/A'}`, { align: 'left' });
    
    if (invoice.customer.gstin) {
      doc.text(`GSTIN: ${invoice.customer.gstin}`, { align: 'left' });
    }
    
    doc.moveDown();

    // Add supply details
    doc.fontSize(10)
      .text(`State of Supply: ${invoice.stateOfSupply}`, { align: 'left' })
      .text(`Place of Supply: ${invoice.placeOfSupply}`, { align: 'left' });
    doc.moveDown();

    // Add items table
    doc.fontSize(12).text('Items', { align: 'left' });

    // Table headers
    const tableTop = doc.y + 10;
    const itemX = 50;
    const hsnSacX = 200;
    const amountX = 300;
    const taxRateX = 400;
    const totalX = 500;

    doc.fontSize(10)
      .text('Description', itemX, tableTop)
      .text('HSN/SAC', hsnSacX, tableTop)
      .text('Amount', amountX, tableTop)
      .text('Tax Rate', taxRateX, tableTop)
      .text('Total', totalX, tableTop);

    doc.moveTo(50, tableTop + 15)
      .lineTo(550, tableTop + 15)
      .stroke();

    let tableY = tableTop + 30;

    // Add item rows
    invoice.items.forEach(item => {
      doc.fontSize(10)
        .text(item.name, itemX, tableY)
        .text(item.hsnSac || 'N/A', hsnSacX, tableY)
        .text(`₹${item.amount.toFixed(2)}`, amountX, tableY)
        .text(`${item.taxRate}%`, taxRateX, tableY)
        .text(`₹${(item.amount * (1 + item.taxRate / 100)).toFixed(2)}`, totalX, tableY);

      tableY += 20;
    });

    doc.moveTo(50, tableY)
      .lineTo(550, tableY)
      .stroke();

    tableY += 20;

    // Add tax summary
    doc.fontSize(12).text('Tax Summary', 50, tableY);
    tableY += 20;

    const isInterstate = invoice.stateOfSupply !== invoice.placeOfSupply;

    if (isInterstate) {
      doc.fontSize(10)
        .text('IGST (18%)', itemX, tableY)
        .text(`₹${invoice.totalTax.toFixed(2)}`, totalX, tableY);
    } else {
      doc.fontSize(10)
        .text('CGST (9%)', itemX, tableY)
        .text(`₹${(invoice.totalTax / 2).toFixed(2)}`, totalX, tableY);
      
      tableY += 20;
      
      doc.fontSize(10)
        .text('SGST (9%)', itemX, tableY)
        .text(`₹${(invoice.totalTax / 2).toFixed(2)}`, totalX, tableY);
    }

    tableY += 40;

    // Add totals
    doc.fontSize(10)
      .text('Subtotal:', 350, tableY)
      .text(`₹${invoice.subtotal.toFixed(2)}`, totalX, tableY);
    
    tableY += 20;
    
    doc.fontSize(10)
      .text('Tax:', 350, tableY)
      .text(`₹${invoice.totalTax.toFixed(2)}`, totalX, tableY);
    
    tableY += 20;
    
    if (invoice.roundOff) {
      doc.fontSize(10)
        .text('Round Off:', 350, tableY)
        .text(`₹${invoice.roundOff.toFixed(2)}`, totalX, tableY);
      
      tableY += 20;
    }
    
    doc.fontSize(12).font('Helvetica-Bold')
      .text('Total:', 350, tableY)
      .text(`₹${invoice.totalAmount.toFixed(2)}`, totalX, tableY);

    // Add terms and conditions
    if (invoice.terms) {
      doc.moveDown(2);
      doc.fontSize(12).font('Helvetica-Bold').text('Terms and Conditions', { align: 'left' });
      doc.fontSize(10).font('Helvetica').text(invoice.terms, { align: 'left' });
    }

    // Add signature
    if (invoice.signatureUrl) {
      doc.moveDown();
      doc.image(invoice.signatureUrl, 450, doc.y, { width: 100 });
      doc.moveDown();
      doc.fontSize(10).text('Authorized Signature', 450, doc.y);
    }

    // Finalize the PDF
    doc.end();

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: error.message });
  }
}; 