import { useState } from 'react';

export default function useOption(initialValues) {
  const [values, setValues] = useState(initialValues);

  return [
    values,
    (e) => setValues({
      ...values,
      [e.target.name]: Number(e.target.value)
    })
  ]
}