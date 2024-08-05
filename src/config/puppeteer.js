const puppeteer = require("puppeteer");
const transporter = require("./nodemailer");

// Creamos función para enviar el PDF a Gmail
async function generatePDF(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: {
      // Definir el tamaño en A4
      width: 1122,
      height: 1587,
      deviceScaleFactor: 1,
      isMobile: false,
      hasTouch: false,
      isLandscape: false,
    },
  });
  console.log("Browser Launched");
  const page = await browser.newPage();
  console.log("New Page opened");

  console.log("Navigating to URL: ", url);
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
  console.log("Page Navigated")

  // await page.emulateMediaType("screen");
  console.log("Emulating screen media type");

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: 0
  });
  console.log("PDF generated");

  /* // Enviar el PDF a Gmail
  const mailOptions = {
    to: "alexistrejoxd1@gmail.com",
    from: "alexistrejoxd@gmail.com",
    subject: "Boleta de venta Electrónica",
    text: "Adjuntamos la boleta de venta electrónica de su compra.",
    attachments: [
      {
        filename: "boleta-venta.pdf",
        content: pdf,
        contentType: "application/pdf"
      }
    ]
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Boleta de venta enviada exitosamente a Gmail.");
  } catch (error) {
    console.log("Error enviando el PDF a Gmail:", error);
  } */

  await browser.close();
  console.log("Browser closed");

  return pdf;
}

module.exports = generatePDF;