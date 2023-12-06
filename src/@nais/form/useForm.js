import { useMemo } from 'react'

import FormProvider from './FormProvider'
import { buildField } from './Field'

export const useForm = (schema, { values } = {}) => {
  const Form = ({ values: vFromProps, ...props }) =>
    useMemo(() => <FormProvider {...props} values={vFromProps ?? values} schema={schema} />, [schema, values])

  return {
    Form: Object.assign(Form, buildForm(schema))
  }
}

function buildForm(schema, prefix = '') {
  const fields = {}

  for (const [name, field] of Object.entries(schema)) {
    if (field.children) {
      fields[name] = buildForm(field.children, `${prefix}${name}.`)
      continue
    }

    fields[name] = buildField(`${prefix}${name}`, field)
  }

  return fields
}
