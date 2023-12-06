import spouseValidator from './validator.spouse'
import childValidator from './validator.child'
import { required, optional } from './nais-forms/validator'

export default {
  status: required(String),
  firstName: required(String(5), {
    week: (v, data) => String(v).toLowerCase().startsWith('я') ? `Имя не может начинаться с 'я'` : null,
    strict: (v, data) => String(v).toLowerCase().startsWith('я') ? `Имя не может начинаться с 'я'` : null,
    transform: (v, data) => transformName(v),
  }),
  lastName: optional(String(10), {
    transform: transformName,
  }),
  spouse: optional(spouseValidator),
  children: optional([childValidator], {
    strict: v => v.length > 2 ? 'Слишком много детей' : null
  }),
}


const replaceMap = { 'ы': 'і', 'э': 'є', 'ъ': 'ї', '1': 'I', '2': 'II', '3': 'III', '4': 'IV', '5': 'V' }
const replaceLetters = Object.keys(replaceMap).join('')

function transformName(v) {
  if(v.length === 0) {
    return null
  }
  // Заменить символы
  v = v.replace(new RegExp(`[${replaceLetters}]`, 'g'), c => replaceMap[c] || c)

  // Заменить все варианты апострофов на украинский апостроф
  v = v.replace(/[\u0027\u0060\u02BC]/g, '\u2019')

  // Преобразовать первый символ в верхний регистр
  v = `${v.charAt(0).toUpperCase()}${v.substring(1)}`

  return v
}
