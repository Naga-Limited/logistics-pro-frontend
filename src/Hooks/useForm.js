import { useState, useEffect } from 'react'

const useForm = (callback, validate, formValues) => {
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
    console.log('hjk1')
    console.log(formValues)
    console.log('hjk2')
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

  /* For Other Tripsheet Creation Process */
  const handleChangeOTS = (event) => {
    event.persist()
    setEnableSubmit(true)
    setIsSubmitting(false)
    let value = event.target.value.toUpperCase()
    setIsTouched((isTouched) => ({ ...isTouched, [event.target.name]: true }))
    setValues((values) => ({
      ...values,
      [event.target.name]: value,
    }))
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
    }
    // if(event.target.type==='checkbox')
    // {
    //   console.log( event.target.value);
    //   setValues((values) => ({
    //     ...values,
    //     [event.target.name]: value==='on'?true:false,
    //   }))
    // }
    else {
      setValues((values) => ({
        ...values,
        [event.target.name]: value,
      }))
    }
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
    handleChangeOTS,
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

export default useForm
