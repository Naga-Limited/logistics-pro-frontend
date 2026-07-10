import { useState, useEffect } from 'react'

const useFormRMSTOHire = (pan_data, validate, formValues) => {
  const [values, setValues] = useState(formValues)
  const [errors, setErrors] = useState({})
  const [isTouched, setIsTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [enableSubmit, setEnableSubmit] = useState(true)

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      // callback()
    }
  }, [errors])

  useEffect(() => {
    if (Object.keys(isTouched).length > 0) {
      setErrors(validate(values, isTouched))
    }
  }, [values])

  const chechFormFieldMatchs = () => {
    console.log(Object.keys(formValues).length + '-ask-' + Object.keys(isTouched).length)
    console.log(pan_data)

    /* ================conditions for Form Submit========================== */

    // Drop Down Fields
    let shedName = values.shedName != '0' && values.shedName != ''

    // Error Check
    let no_error = Object.keys(errors).length === 0

    // let ownerData = pan_data.LIFNR ? true : values.ownerName != '' && values.ownerMob != ''
    let ownerData = false

    // Input Fields
    let panNumber = values.panNumber != ''

    if (pan_data.LIFNR) {
      ownerData = true
      if (errors.ownerName || errors.ownerMob) {
        no_error = true
      }
    } else {
      if (values.ownerName != '' && values.ownerMob != '') {
        ownerData = true
      } else {
        ownerData = false
      }
    }

    console.log('ownerData : ' + ownerData)
    console.log('shedName : ' + shedName)
    console.log('panNumber : ' + panNumber)
    console.log('no_error : ' + no_error)
    console.log(errors)

    /* ================conditions for Form Submit========================== */

    if (shedName && ownerData && panNumber && no_error) {
      setEnableSubmit(false)
      // console.log('submit_yes')
    } else {
      setEnableSubmit(true)
      // console.log('submit_no')
    }

    // console.log(values)
    // console.log(topay)
  }

  const handleSubmit = (event) => {
    if (event) event.preventDefault()
    setIsSubmitting(true)
    setErrors(validate(values, isTouched, isSubmitting))
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
    setErrors(validate(values, isTouched))
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

export default useFormRMSTOHire
