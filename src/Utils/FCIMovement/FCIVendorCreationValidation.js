export default function FCIVendorCreationValidation(values, isTouched) {

    const errors = {}
  
    //Vendor Name Validation Rule
    if (isTouched.vendorName && !values.vendorName) {
        errors.vendorName = 'Required'
    } else if (isTouched.vendorName && !/^[a-zA-Z ]+$/.test(values.vendorName)) {
        errors.vendorName = 'Only have Letters and Space'
    } 

    //Bank Acc. Holder Name Validation Rule
    if (isTouched.bankAccHolderName && !values.bankAccHolderName) {
        errors.bankAccHolderName = 'Required'
    } else if (isTouched.bankAccHolderName && !/^[a-zA-Z ]+$/.test(values.bankAccHolderName)) {
        errors.bankAccHolderName = 'Only have Letters and Space'
    }

    //Vendor Mobile Number Validation Rule
    if (isTouched.vendorMobile && !values.vendorMobile) {
        errors.vendorMobile = 'Required'
    } else if (isTouched.vendorMobile && !/^[\d]{10}$/.test(values.vendorMobile)) {
        errors.vendorMobile = 'Only have 10 Digit Numeric'
    }

    //vehicle Number validation rule
    if (isTouched.vehicleNumber && !values.vehicleNumber) {
        errors.vehicleNumber = 'Required'
    } else if (isTouched.vehicleNumber && !/^[a-zA-Z0-9]{7,10}$/.test(values.vehicleNumber)) {
        errors.vehicleNumber = 'Must Have Alpha Numeric (7-10 digits) ..'
    }

    if (isTouched.panCardNumber && !values.panCardNumber) {
        errors.panCardNumber = 'Required'
    } else if (isTouched.panCardNumber && !/^[A-Z]{5}[\d]{4}[A-Z]{1}$/.test(values.panCardNumber)) {
        errors.panCardNumber = 'Must Like "ABCDE1234F"'
    }

    if (isTouched.aadhar && !values.aadhar) {
        errors.aadhar = 'Required'
    } else if (isTouched.aadhar && !/^[\d]{12}$/.test(values.aadhar)) {
        errors.aadhar = 'Must Have 12 Digit Numeric'
    }
    
    if (!/^[\d]{2}[A-Z]{5}[\d]{4}[A-Z]{1}[\d]{1}[A-Z]{1}[A-Z\d]{1}$/.test(values.GSTNumber)) {
        errors.GSTNumber = 'Must Like "07AAGFF2194N1Z1"'
    }

    if (isTouched.bankAccount && !values.bankAccount) {
        errors.bankAccount = 'Required' 
    } else if (isTouched.bankAccount && !/^\d{9,18}$/.test(values.bankAccount)) {
        errors.bankAccount = 'Must Have Numeric (9-18 digits) ..'
    }

    if (isTouched.ifscCode && !values.ifscCode) {
        errors.ifscCode = 'Required'
    } else if (isTouched.ifscCode && !/^[A-Z0-9]{11}$/.test(values.ifscCode)) {
        errors.ifscCode = 'Must Like "BKID0008267"'
    }

    //Bank Name Validation Rule
    if (isTouched.bankName && values.bankName == '0') {
        errors.bankName = 'Required'
    } else if (isTouched.bankName && !values.bankName) {
        errors.bankName = 'Required'
    }

    if (isTouched.bankBranch && !values.bankBranch) {
        errors.bankBranch = 'Required'
    } else if (isTouched.bankBranch && !/^[a-zA-Z]+(\s[a-zA-Z]+)?$/.test(values.bankBranch)) {
        errors.bankBranch = 'Invalid Name'
    }

    //Tax Type Validation Rule
    if (isTouched.TDStax && values.TDStax == '0') {
        errors.TDStax = 'Required'
    } else if (isTouched.TDStax && !values.TDStax) {
        errors.TDStax = 'Required'
    }

    //Payment Type Validation Rule
    if (isTouched.payment && values.payment == '0') {
        errors.payment = 'Required'
    } else if (isTouched.payment && !values.payment) {
        errors.payment = 'Required'
    }

    //Street Validation Rule
    if (isTouched.street && !values.street) {
        errors.street = 'Required'
    } 

    //Area Validation Rule
    if (isTouched.area && !values.area) {
        errors.area = 'Required'
    } else if (isTouched.area && !/^[a-zA-Z ]+$/.test(values.area)) {
        errors.area = 'Only have Letters and space'
    }

    //City Validation Rule
    if (isTouched.city && !values.city) {
        errors.city = 'Required'
    } else if (isTouched.city && !/^[a-zA-Z ]+$/.test(values.city)) {
        errors.city = 'Only have Letters and space'
    }

    //State Validation Rule
    if (isTouched.state && !values.state) {
        errors.state = 'Required'
    }

    //District Validation Rule
    if (isTouched.district && !values.district) {
        errors.district = 'Required'
    } else if (isTouched.district && !/^[a-zA-Z ]+$/.test(values.district)) {
        errors.district = 'Only have Letters and space'
    }

    if (isTouched.postalCode && !values.postalCode) {
        errors.postalCode = 'Required'
    } else if (isTouched.postalCode && !/^[\d]{6}$/.test(values.postalCode)) {
        errors.postalCode = '6 Numbers Only'
    }
  
    return errors
}
  
  