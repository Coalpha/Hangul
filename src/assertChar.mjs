export default ((char) => {
  if (typeof char !== 'string') {
    throw new TypeError('char must be a string!');
  } if (char.length - 1) {
    throw new Error(`"${char}" is not a character!`);
  }
});
