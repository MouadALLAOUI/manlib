const numberRound = (number) => {
  try {
    const numericVal = parseInt(Number(number), 10);
    if (isNaN(numericVal)) {
      return 0;
    }

    return numericVal;
  } catch (err) {
    console.log(err)
    return 0
  }
}

const currencyFormat = (money, currency = 'DH') => {
  if (money === null || money === undefined) return `0.00 ${currency}`;
  const formattedMoney = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(money);
  return `${formattedMoney} ${currency}`;
};

const dateFormat = (dateInput) => {
  if (!dateInput) return "";

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "Date invalide";

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

export {
  numberRound,
  currencyFormat,
  dateFormat
}