import React, { useMemo, useCallback } from 'react'
import { useFormContext, useController } from 'react-hook-form'

export function buildField(name, fieldConfig) {
  let fieldMethods = {
    setValue: () => void 0,
    getState: () => void 0
  }

  const Component = ({
    validate,
    label,
    onChange: propsOnChange,
    onBlur: propsOnBlur,
    onInput: propsOnInput,
    ...props
  }) => {
    const form = useFormContext()
    const { field, fieldState } = useController({
      name,
      control: form.control,
      rules: {
        validate: strictValidate
      }
    })

    fieldMethods.setVal = useCallback(
      value => {
        form.setValue(name, value, {
          shouldValidate: true,
          shouldDirty: true
        })
      },
      [form]
    )

    fieldMethods.getState = useCallback(() => {
      return form.getFieldState(name)
    }, [form])

    return useMemo(
      () => (
        <div>
          <span>{label ?? name}: </span>
          {getInput(field.type, {
            ...field,
            onChange,
            onInput,
            onBlur,
            ...props
          })}
          <p style={{ color: fieldState.isDirty ? 'red' : 'orange' }}>{fieldState.error?.message}</p>
          <p>{fieldState.isDirty && 'Dirty'}</p>
          <p>{fieldState.invalid ? 'invalid' : 'valid'}</p>
        </div>
      ),
      [fieldState]
    )

    function defaultValidate(v) {
      return fieldConfig.schema.safeParse(v).error?.issues?.[0]
    }

    function strictValidate(v) {
      const error = fieldConfig.strictValidate?.(v) || defaultValidate(v)?.message
      if (error) {
        return error
      }
    }

    function weakValidate(v) {
      console.log('weak run')
      form.clearErrors(name)

      const error = fieldConfig.weakValidate?.(v) || defaultValidate(v)?.message
      if (error && fieldState.isDirty) {
        form.setError(name, { message: error })
      }
    }

    function onChange(e) {
      field.onChange(e)
      propsOnChange?.(e)
      weakValidate(e.target.value)
    }

    function onBlur(e) {
      field.onBlur(e)
      propsOnBlur?.(e)
    }

    function onInput(e) {
      propsOnInput?.(e)

      if (!fieldConfig?.transform) return

      let start = e.target.selectionStart,
        end = e.target.selectionEnd

      e.target.value = fieldConfig?.transform(e.target.value)

      e.target.setSelectionRange(start, end)
    }
  }

  Component.setValue = v => fieldMethods.setValue(v)
  Component.getState = () => fieldMethods.getState()
  return Component
}

function getInput(type, props) {
  switch (type) {
    case 'text':
      return <input {...props} />
    case 'email':
      return <input {...props} />
    case 'custom':
      return <input style={{ backgroundColor: 'pink' }} {...props} />
    default:
      return <input {...props} />
  }
}
