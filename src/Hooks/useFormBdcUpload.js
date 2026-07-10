import { useState, useEffect } from 'react'

const useFormBdcUpload = (callback, validate, formValues, rakeEvehiclesData) => {
  const [values, setValues] = useState(formValues)
  const [eVehicles, setEVehicles] = useState(rakeEvehiclesData)
  const [errors, setErrors] = useState({})
  const [isTouched, setIsTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [enableSubmit, setEnableSubmit] = useState(true)

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      callback()
    }
    setEVehicles(rakeEvehiclesData)
  }, [errors])

  useEffect(() => {
    if (Object.keys(isTouched).length > 0) {
      setErrors(validate(values, isTouched,eVehicles))
    }
  }, [values])

  const chechFormFieldMatchs = () => {

    // Drop Down Fields
    let rakePlant = values.rake_plant1 != ''
    let vendorCode = values.vendor_code1 != ''

    // Input Fields
    let driverName = values.driver_name1 != ''
    let driverNumber = values.driver_number1 != ''
    let fnrNo = values.fnr_no1 != ''
    let vehicleNo = values.vehicle_no1 != ''

    // Error Check
    let no_error = Object.keys(errors).length === 0

     /* ================conditions for Form Submit========================== */

     if (
      rakePlant &&
      vendorCode &&
      driverName &&
      driverNumber &&
      fnrNo &&
      vehicleNo &&
      no_error
    ) {
      setEnableSubmit(false)
    } else {
      setEnableSubmit(true)
    }

  }

  const handleSubmit1 = (event) => {
    if (event) event.preventDefault()
    setIsSubmitting(true)
    setErrors(validate(values, isTouched,eVehicles,isSubmitting))
  }

  const handleChange = (event) => {
    event.persist()
    setEnableSubmit(true)
    setIsSubmitting(false)

    let pname = event.target.name
    let getData = ''

    if(pname == 'fnr_no1' || pname == 'driver_number1'){
      getData = event.target.value.replace(/\D/g, '')
    } else if (pname == 'driver_name1') {
      getData =  event.target.value.replace(/[^a-zA-Z0 ]/gi, '')
      getData = getData.trimStart()
    } else if (pname == 'vehicle_no1') {
      getData = event.target.value.replace(/[^a-zA-Z0-9]/gi, '')
    }else {
      getData = event.target.value
    }

    let value = getData
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
    setErrors(validate(values, isTouched, eVehicles))
    chechFormFieldMatchs()
  }
  return {
    handleChange,
    handleMultipleChange,
    handleSubmit1,
    onload,
    onFocus,
    isTouched,
    values,
    eVehicles,
    errors,
    enableSubmit,
    onBlur,
    setIsTouched,
    setErrors,
    setValues,
    setEVehicles,
  }
}

export default useFormBdcUpload
