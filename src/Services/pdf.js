import fs from"fs";
import PDFDocument from "pdfkit";

function createInvoice(invoice, path) {
  let doc = new PDFDocument({ size: "A4", margin: 50 });

  generateHeader(doc);
  generateCustomerInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);
  generateFooter(doc);

  doc.end();
  doc.pipe(fs.createWriteStream(path));
}

function generateHeader(doc) {
  doc
    .image("logo.jpg", 260, 30, { width: 100 })
    .fillColor("#444444")
    .fontSize(20)
    .font("Helvetica-Bold")
    .text("Invoice", 270, 120)
    .fontSize(10)
    .text("Resturant", 30, 50, { align: "left" })
    .text("123 Main Street", 30, 65, { align: "left" })
    .text("Palestine, Ramallah, 10025", 30, 80, { align: "left" })
    .moveDown();
}

function generateCustomerInformation(doc, invoice) {
   generateHr(doc, 185);

  const customerInformationTop = 200;

  doc
    .fontSize(10)
    .text("Invoice Number:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(invoice.invoice_nr, 150, customerInformationTop)
    .font("Helvetica")
    .text("Invoice Date:", 50, customerInformationTop + 15)
    .text(formatDate(new Date()), 150, customerInformationTop + 15)
    .text("Invoice from: ", 50, customerInformationTop + 30)
    .font("Helvetica-Bold")
    .text(invoice.shipping.name, 300, customerInformationTop)
    .font("Helvetica")
    .text(invoice.shipping.address, 300, customerInformationTop + 30)
    .text(
      invoice.shipping.city,
      150,
      customerInformationTop + 30
    )
    .moveDown();

  generateHr(doc, 252);
}

function generateInvoiceTable(doc, invoice) {
  let i;
  const invoiceTableTop = 330;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Item",
    "Quantity",
    "Line Total"
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.name,
      item.qty,
      formatCurrency(item.price * 100),
    );

    generateHr(doc, position + 20);
  }

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
  generateTableRow(
    doc,
   400,
    "Subtotal",
    formatCurrency((item.price *item.qty)*100),
  );
  }
}

function generateFooter(doc) {
  doc
    .fontSize(10)
    .text(
      "Your dining experience is our greatest pleasure. We look forward to serving you again soon!",
      50,
      780,
      { align: "center", width: 500 },
    );
}

function generateTableRow(
  doc,
  y,
  item,
  description,
  unitCost,
  quantity,
  lineTotal
) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 150, y)
    .text(unitCost, 280, y, { width: 90, align: "right" })
    .text(quantity, 370, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

function formatCurrency(cents) {
  return "$" + (cents / 100).toFixed(2);
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + "/" + month + "/" + day;
}

export default createInvoice;