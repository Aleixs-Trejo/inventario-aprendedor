document.addEventListener("DOMContentLoaded", () => {
  const fechaInicialInput = document.getElementById("fechaInicial");
  const fechaFinalInput = document.getElementById("fechaFinal");
  const filterButton = document.getElementById("filterButton");
  const noBalances = document.querySelector(".balance__empty");

  function initialize() {
  const totalBalance = document.querySelector(".total__balance");
  const gananciasNetas = document.querySelectorAll(".ganancias__netas");
    let total = 0
    if (gananciasNetas.length > 0) {
      gananciasNetas.forEach(ganancia => {
        total += parseFloat(ganancia.textContent)
      })
    }
    const fomattedTotal = total.toFixed(2)
    totalBalance.textContent = fomattedTotal
  }
  initialize();

  filterButton.addEventListener("click", () => {
    const fechaInicial = fechaInicialInput.value;
    const fechaFinal = fechaFinalInput.value;

    // Verificar que ambas fechas esté seleccionadas
    if (!fechaInicial || !fechaFinal) {
      alert("Por favor, selecciona ambas fechas.");
      return
    }

    // Validar que la fecha final sea mayor a la fecha inicial
    const fechaInicialDate = new Date(fechaInicial);
    const fechaFinalDate = new Date(fechaFinal);
    if (fechaFinalDate < fechaInicialDate) {
      alert("La fecha final debe ser mayor a la fecha inicial.");
      return;
    }

    // Obtener los balances en el intervalo de tiempo especificado
    const balances = document.querySelectorAll(".balance__views");
    balances.forEach(balance => {
      const balanceDate = new Date(balance.querySelector(".fecha__balance").textContent);
      if (balanceDate >= fechaInicialDate && balanceDate <= fechaFinalDate) {
        balance.style.display = "block";
      } else {
        balance.style.display = "none";
      }
    });

    // Mostrar mensaje si no hay balances para mostrar
    const visibleBalances = document.querySelectorAll(".balance__views[style='display: block;']");
    if (visibleBalances.length === 0) {
      noBalances.style.display = "block";
    } else {
      noBalances.style.display = "none";
    }
  })
});