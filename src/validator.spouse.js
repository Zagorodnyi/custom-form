import { z } from 'zod'


export default {
  firstName: {
    schema: z.string().min(1).max(5),
    weakValidate: (v) => { console.log('weakValidate', v)},
    strictValidate: (v) => { console.log('strictValidate', v)},
    transform: transformName,
  },
  lastName: {
    weakValidate: () => {},
    strictValidate: () => {},
    transform: transformName,
  },
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