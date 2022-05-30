
export const setItem = function (key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}
export const getItem = function (key) {

  let value = window.localStorage.getItem(key)
  if (value) {
    return JSON.parse(value);
  }
}
