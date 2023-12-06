'use strict'
import React from 'react'
import { z } from 'zod'
import { useFormContext } from 'react-hook-form'

import { useForm, required, optional } from './@nais/form'

// TODO: Match type of field to schema !!!!!!! Depends on schema tool

const address = {
  street: required(z.number({ coerce: true }).min(1).max(5)),
  apt: optional(z.string().min(1).max(20))
}

const schema = {
  firstName: required(
    z
      .string({ invalid_type_error: 'Must be string', required_error: 'Required' })
      .min(1, 'Must > 1')
      .max(20, ' Must < 20'),
    {
      weakValidate: v => {
        if (v.length < 5) {
          return 'Must < 5'
        }
      },
      strictValidate: v => {
        if (v.length < 20) {
          return 'Striiiiict'
        }
      },
      transform: v => v.toUpperCase()
    }
  ),
  address: required(address)
}

const App = () => {
  const { Form } = useForm(schema)
  const [show, setShow] = React.useState(false)

  return (
    <div className="App">
      <h1>React App</h1>
      <Form
        style={{ display: 'flex', flexDirection: 'column', gap: '3rem', margin: '3rem' }}
        values={{ firstName: 'John', address: { street: '235', apt: 12 } }}
        onSubmit={(values, errors) => {
          console.log('values', values)
          console.log('errors', errors)
        }}
      >
        <Form.firstName label="First Name" placeholder="Custom Placeholder" />

        <Address Form={Form.address} display={show ? 'block' : 'none'} />

        <button type="submit">Submit</button>
        <button
          type="button"
          onClick={() => {
            setShow(!show)
          }}
        >
          Submit name
        </button>
        <Submit />
      </Form>
    </div>
  )
}

export default App

////////////////////////////////////////////

function Address({ Form, display }) {
  return (
    <div style={{ display }}>
      <Form.street label="Street" />
      <Form.apt label="Apt" />
    </div>
  )
}

function Submit() {
  const formCtx = useFormContext()

  return (
    <div>
      <button type="button" onClick={() => console.log(formCtx)}>
        Submit 2
      </button>
    </div>
  )
}
