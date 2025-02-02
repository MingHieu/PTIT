import dayjs from 'dayjs'

export function formatDate(inputDate) {
  return dayjs(inputDate).format('DD/MM/YYYY')
}

const MAP = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

export function encode(id) {
  let digits = []
  while (id > 0) {
    digits.push(id % 62)
    id = Math.floor(id / 62)
  }
  for (let i = digits.length; i < 6; ++i) {
    digits.push(0)
  }
  let s = ''
  for (let x of digits) {
    s += MAP.charAt(x)
  }
  return s.split('').reverse().join('')
}

export function decode(url) {
  let s = url.split('').reverse().join('')
  while (s.charAt(0) == '0') {
    s = s.substring(1)
  }
  let digits = []
  for (let x of s) {
    digits.push(MAP.indexOf(x))
  }
  let id = 0
  for (let i = 0; i < digits.length; i++) {
    id += digits[i] * Math.pow(62, i)
  }
  return id
}
