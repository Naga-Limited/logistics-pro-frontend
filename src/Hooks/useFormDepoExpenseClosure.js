import { useState, useEffect } from 'react'

const useFormDepoExpenseClosure = (callback, formValues) => {
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

  const chechFormFieldMatchs = () => {
    // console.log(Object.keys(formValues).length + '-ask-' + Object.keys(isTouched).length)

    /* ================conditions for Form Submit========================== */

    let unloading_charges = values.unloading_charges != '' ? true : false

    /* ================conditions for Form Submit========================== */
    console.log(errors, 'errors-object')

    if (Object.keys(errors).length === 0) {
      setEnableSubmit(false)
    } else {
      setEnableSubmit(true)
    }

    // if (values.loading_charges && Object.keys(errors).length === 0) {
    //   setEnableSubmit(false)
    //   // console.log('submit_yes')
    // } else {
    //   setEnableSubmit(true)
    //   // console.log('submit_no')
    // }

    // console.log(values)
    // console.log(topay)
  }

  const handleSubmit = (event) => {
    if (event) event.preventDefault()
    setIsSubmitting(true)
    // setErrors(validate(values, isTouched, isSubmitting))
  }

  const handleChange = (event) => {
    event.persist()
    setEnableSubmit(true)
    setIsSubmitting(false)
    let value = event.target.value
    setIsTouched((isTouched) => ({ ...isTouched, [event.target.name]: true }))

    if (event.target.type === 'file') {
      setValues((values) => ({
        ...values,
        [event.target.name]: event.target.files[0],
      }))
    } else if (event.target.type === 'checkbox') {
      setValues((values) => ({
        ...values,
        [event.target.name]: event.target.checked,
      }))
    } else {
      // console.log(event.target.name + ':\t' + value)
      setValues((values) => ({
        ...values,
        [event.target.name]: value,
      }))

      if(event.target.name == 'settlement_remarks' || event.target.name == 'remarks' || event.target.name == 'sap_text' || event.target.name == 'income_remarks') {
        setValues((values) => ({
          ...values,
          [event.target.name]: event.target.value.toUpperCase()
        }))
      }

    }
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

    chechFormFieldMatchs()
  }
  return {
    handleChange,
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
  }
}

export default useFormDepoExpenseClosure
