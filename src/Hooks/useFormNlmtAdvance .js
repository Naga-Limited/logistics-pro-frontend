import { useState, useEffect } from 'react'

const useFormNlmtAdvance  = (callback, validate, formValues) => {
  const [values, setValues] = useState(formValues)
  const [errors, setErrors] = useState({})
  const [isTouched, setIsTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [enableSubmit, setEnableSubmit] = useState(true)

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      callback()
    }
  }, [errors])

  useEffect(() => {
    if (Object.keys(isTouched).length > 0) {
      setErrors(validate(values, isTouched))
    }
  }, [values])

  const chechFormFieldMatchs = () => {
    console.log(Object.keys(isTouched).length)
    console.log(formValues)
    console.log(isTouched)
    console.log(Object.keys(formValues).length)
    if (Object.keys(formValues).length === Object.keys(isTouched).length) {
      setEnableSubmit(false)
    } else {
      setEnableSubmit(true)
    }
  }

  const handleSubmit = (event) => {
    if (event) event.preventDefault()
    setIsSubmitting(true)
    setErrors(validate(values, isTouched, isSubmitting))
  }

const handleChange = (event) => {
  // ✅ SAFETY CHECK (important)
  if (event && typeof event.persist === 'function') {
    event.persist()
  }

  const { name, value } = event.target

  setValues((prev) => ({
    ...prev,
    [name]: value,
  }))
}



  const handleMultipleChange = (data, name) => {
    setIsTouched((isTouched) => ({ ...isTouched, [name]: true }))
    setValues((values) => ({
      ...values,
      [name]: data.filter((data) => data.value).map((data) => data.value),
    }))
  }

  const onFocus = (event) => {
    event.persist()
    setIsTouched((isTouched) => ({ ...isTouched, [event.target.name]: true }))
    chechFormFieldMatchs()
  }

  const onBlur = (event) => {
    event.persist()
    setIsSubmitting(false)
    setIsTouched((isTouched) => ({ ...isTouched, [event.target.name]: true }))
    setErrors(validate(values, isTouched))
    chechFormFieldMatchs()
  }
  return {
    handleChange,
    handleMultipleChange,
    handleSubmit,
    onload,
    onFocus,
    isTouched,
    values,
    errors,
    enableSubmit,
    onBlur,
    setIsTouched,
    setErrors,
    setValues,
  }
}

export default useFormNlmtAdvance
