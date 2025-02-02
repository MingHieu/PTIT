export const normalizeText = (str) => {
  return str.normalize('NFD').replace(/\p{Diacritic}/gu, '');
};

export const currencyFormatter = new Intl.NumberFormat('vi', {
  style: 'currency',
  currency: 'VND',
});
