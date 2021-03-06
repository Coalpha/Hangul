import { transform_U } from './transform';

export default (isFn => (datum) => {
  const res = transform_U(datum);
  // it's okay that we don't check if data is
  // a Character since transformEveryCharacter does.
  return Array.isArray(res) ? res.every(isFn) : isFn(res);
});
