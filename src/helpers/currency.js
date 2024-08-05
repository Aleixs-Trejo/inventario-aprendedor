function formatCurrency(amount) {

  if (isNaN(amount)) {
    return "0.00";
  }

  const formattedAmountDecimal = parseFloat(amount).toFixed(2);

  return formattedAmountDecimal;
}

module.exports = { formatCurrency };