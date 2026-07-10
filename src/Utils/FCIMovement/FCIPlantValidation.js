export default function FCIPlantValidation(values, isTouched) {

    const errors = {}

    //Plant Name validation rule
    if (isTouched.plant_name && !values.plant_name) {
        errors.plant_name = 'Plant name is required'
    } else if (isTouched.plant_name && !/^[A-Z ]+$/.test(values.plant_name)) {
        errors.plant_name = 'Plant name only have Letters and space'
    }

    //Plant Symbol validation rule
    if (isTouched.plant_symbol && !values.plant_symbol) {
        errors.plant_symbol = 'Plant Symbol is required'
    } else if (isTouched.plant_symbol && values.plant_symbol.length != 3) {
        errors.plant_symbol = 'Plant Symbol length should be 3 digit'
    } else if (isTouched.plant_symbol && !/^[A-Z]+$/.test(values.plant_symbol)) {
        errors.plant_symbol = 'Plant Symbol only have Letters'
    }

    //Company Name validation rule
    if (isTouched.company_name && !values.company_name) {
        errors.company_name = 'Company name is required'
    } else if (isTouched.company_name && !/^[A-Z ]+$/.test(values.company_name)) {
        errors.company_name = 'Company name only have Letters and space'
    }

    //Street Number validation rule
    if (isTouched.street_no && !values.street_no) {
        errors.street_no = 'Street Number is required'
    }  

    //Street Name validation rule
    if (isTouched.street_name && !values.street_name) {
        errors.street_name = 'Street name is required'
    } else if (isTouched.street_name && !/^[A-Z ]+$/.test(values.street_name)) {
        errors.street_name = 'Street name only have Letters and space'
    }

    //City Name validation rule
    if (isTouched.city && !values.city) {
        errors.city = 'City name is required'
    } else if (isTouched.city && !/^[A-Z ]+$/.test(values.city)) {
        errors.city = 'City name only have Letters and space'
    }  

    //State Name validation rule
    if (isTouched.state && !values.state) {
        errors.state = 'State name is required'
    } else if (isTouched.state && !/^[A-Z ]+$/.test(values.state)) {
        errors.state = 'State name only have Letters and space'
    }

    //Postal Code validation rule
    if (isTouched.postal_code && values.postal_code === '') {
        errors.postal_code = 'Required'
    } else if (isTouched.postal_code && !/^[0-9]+$/.test(values.postal_code)) {
        errors.postal_code = 'Only Enter Numeric Values'
    } else if (isTouched.postal_code && values.postal_code.length < 6) {
        errors.postal_code = 'Minimum Length : 6'
    }

    //Region Code validation rule
    if (isTouched.region && values.region === '') {
        errors.region = 'Required'
    } else if (isTouched.region && !/^[0-9]+$/.test(values.region)) {
        errors.region = 'Only Enter Numeric Values'
    } else if (isTouched.region && values.region.length < 2) {
        errors.region = 'Minimum Length : 2'
    }
  
    return errors
}
  
  