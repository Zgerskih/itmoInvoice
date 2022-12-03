function isStringNotNumberAndNotEmpty(value) {
  const isValueString = typeof value === 'string';
  const isValueNotNumber = isNaN(parseInt(value));

  const result = isValueString && isValueNotNumber && value.length > 0;

  console.log('> isStringNotNumberAndNotEmpty -> result', {
    result,
    isInputValueString: isValueString,
    isInputValeNotNumber: isValueNotNumber,
  });
  return result;
}
export {
  isStringNotNumberAndNotEmpty
}