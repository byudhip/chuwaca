export default function handleError(fn) {
  return function (...params) {
    return fn(...params).catch(function (err) {
      console.error('Error!', err);
    });
  };
}
