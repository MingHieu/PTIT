Number.prototype.formatFloat = function (decimalPlaces = 1) {
  return this % 1 === 0 ? this.toFixed(0) : this.toFixed(decimalPlaces);
};
