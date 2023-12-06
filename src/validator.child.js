import { required, optional } from './nais-forms/validator'

export default {
  firstName: required(String(5), {
    transform: transformName,
  }),
  lastName: optional(String(10), {
    transform: transformName,
  }),
  birth: required(Date, {
    strict(v, data) {
      if(!v || Number.isNaN(v.getTime())) {
        return null
      }
      return new Date().getFullYear() - v.getFullYear() >= 18 ? 'Ребенок не должен быть старше 18' : null
    },
  })
}

const rusMap = { 'ы': 'і', 'э': 'є', 'ъ': 'ї' }
const rusLetters = Object.keys(rusMap).join('')

function transformName(v) {
  if(v.length === 0) {
    return null
  }
  // Заменить все русские буквы на украинские
  v = v.replace(new RegExp(`[${rusLetters}]`, 'g'), c => rusMap[c] || c)

  // Заменить все варианты апострофов на украинский апостроф
  v = v.replace(/[\u0027\u0060\u02BC]/g, '\u2019')

  // Преобразовать первый символ в верхний регистр
  v = `${v.charAt(0).toUpperCase()}${v.substring(1)}`

  return v
}