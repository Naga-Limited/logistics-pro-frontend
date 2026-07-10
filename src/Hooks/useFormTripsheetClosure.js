import { useState, useEffect } from 'react'

const useFormTripsheetClosure = (callback, validate, formValues) => {
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
    // console.log(Object.keys(formValues).length + '-ask-' + Object.keys(isTouched).length)

    /* ================conditions for Form Submit========================== */

    // Drop Down Fields
    let vehicle_number = values.vehicleNumber != '0' && values.vehicleNumber != ''
    let payment_term = values.PaymentTerm != '0' && values.PaymentTerm != ''
    let shed_name = values.shed_name != '0' && values.shed_name != ''
    let materialType = values.materialType != '0' && values.materialType != ''
    let uomType = values.uomType != '0' && values.uomType != ''

    // Error Check
    let no_error = Object.keys(errors).length === 0

    // Input Fields
    let deliveryTime = values.deliveryTime != ''
    let returnTime = values.returnTime != ''
    let materialDescription = values.materialDescription != ''
    let hsnCode = values.hsnCode != ''
    let orderQuantity = values.orderQuantity != ''
    let freight_income = values.freight_income != ''
    let advance_amount = values.advance_amount != ''
    let emptyLoad = values.emptyLoad != ''
    let emptyUnload = values.emptyUnload != ''
    let lastDeliveryPoint = values.lastDeliveryPoint != ''
    let loadPoint = values.loadPoint != ''
    let unloadPoint = values.unloadPoint != ''

    //Topay Condition
    let topay =
      values.PaymentTerm == '2'
        ? values.customerName != '0' && values.customerName != ''
          ? true
          : false
        : values.PaymentTerm == '1'
        ? true
        : false

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

export default useFormTripsheetClosure
