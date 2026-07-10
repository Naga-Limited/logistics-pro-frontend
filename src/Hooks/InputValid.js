export const InputValid = (e) => {
  // const [errors, setErrors] = useState({})
  const { name, value } = e.target
  let val = ''
  switch (name) {
    // Parking Yard Gate In
    case 'vNum': //vehicle Number
      break
    case 'dName': //Driver Name
      val = value.charAt(0).toUpperCase() + value.slice(1)
      break
    case 'dNum' && 'odoKm': //Driver Contact Number & Odometer Km
      val = value.test(/[^\d]/g, '')
      break
    case 'pName': //Party Name
      // val = !/[^a-zA-Z]/.test(string) ? string.charAt(0).toUpperCase() + string.slice(1) : string
      break
    case 'vBody': //Party Name
      // val = !/[^a-zA-Z]/.test(string) ? string.charAt(0).toUpperCase() + string.slice(1) : string
      break

    // Vehicle Inspection
    case 'prevLoad': //Previous Load Details
      // val = !/[^a-zA-Z]/.test(string) ? string.charAt(0).toUpperCase() + string.slice(1) : string
      break
    case 'vFitLoad': //Vehicle Fit For Loading
      // val = !/[^a-zA-Z]/.test(string) ? string.charAt(0).toUpperCase() + string.slice(1) : string
      break

    default:
      val = value
  }
  return val
}
