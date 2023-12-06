'use strict'
import React, { useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'

function Form({ children, onSubmit, values, schema, ...props }) {
  const methods = useForm({
    values,
    mode: 'onBlur',
    reValidateMode: 'onBlur'
  })

  useEffect(() => {
    validateInitialValues(schema, values)
  }, [values])

  function handleSubmit(e) {
    e.preventDefault()
    const errors = methods.formState.errors

    const shouldIgnoreErrors = !hasDirtyErrors(errors)
    const values = shouldIgnoreErrors ? methods.getValues() : null

    onSubmit(values, errors)
  }

  function hasDirtyErrors(errors, prefix = '') {
    let hasDirtyError = false

    for (let [k, v] of Object.entries(errors)) {
      let isDirty = false

      if (!v.message) {
        isDirty = hasDirtyErrors(v, prefix + k + '.')
      } else {
        isDirty = methods.getFieldState(prefix + k).isDirty
      }

      if (isDirty) {
        hasDirtyError = true
        break
      }
    }
    return hasDirtyError
  }

  return (
    <FormProvider {...methods}>
      <form {...props} onSubmit={handleSubmit}>
        {children}
      </form>
    </FormProvider>
  )

  function validateInitialValues(schema, values, prefix = '') {
    for (let [k, v] of Object.entries(values)) {
      const fieldConfig = schema[k]

      if (!fieldConfig) continue

      if (fieldConfig.children) {
        validateInitialValues(fieldConfig.children, v, `${prefix}${k}.`)
        continue
      }

      const error = fieldConfig.strictValidate?.(v) || fieldConfig.schema.safeParse(v).error?.issues?.[0]?.message

      if (error) {
        methods.setError(prefix + k, { message: error })
      }
    }
  }
}

export default Form
