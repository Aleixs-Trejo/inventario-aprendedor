const puppeteer = require("puppeteer");

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

  // Header personalizado
  await page.setExtraHTTPHeaders({
    "X-Puppeteer-Request": "true"
  });

  console.log("Navigating to URL: ", url);
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
  console.log("Page Navigated")

  // await page.emulateMediaType("screen");
  console.log("Emulating screen media type");

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: 0,
    pageRanges: "", // Incluye todas las páginas
    scale: 1
  });
  console.log("PDF generated: ", pdf);

  await browser.close();
  console.log("Browser closed");

  return pdf;
}

module.exports = generatePDF;