document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  const aside = document.querySelector(".aside");
  const main = document.querySelector(".main");
  const mainContent = document.querySelector(".main__content");
  const subTotal = document.querySelector(".sub__total");
  const igvVenta = document.querySelector(".igv");
  const totalVenta = document.querySelector(".total__venta");

  function styleBill(){
    console.log("mainContent: ", mainContent);
    header.remove();
    aside.remove();
    main.style.minHeight = "100dvh";
    main.style.margin = "0";
    main.style.height = "max-content";
    mainContent.style.height = "100%";
    main.style.backgroundColor = "transparent";
    mainContent.style.backgroundColor = "transparent";
  };

  /*
  Ecuaciones para sacar IGV = {
    - totalVenta * 9/50 = igv
    - totalVenta * 0.82 = subTotal
  */

  function calculateIGV() {
    const totalVentaValue = Math.round(parseFloat(totalVenta.textContent).toFixed(2));
    totalVenta.textContent = `S/ ${totalVentaValue.toFixed(2)}`;
    const subTotalValue = (totalVentaValue * 0.82).toFixed(2);
    subTotal.textContent = `S/ ${subTotalValue}`;
    const igvValue = (totalVentaValue * igvVenta.dataset.igv / 100).toFixed(2);
    igvVenta.textContent = `S/ ${igvValue}`;
  }

  styleBill();
  calculateIGV();
})