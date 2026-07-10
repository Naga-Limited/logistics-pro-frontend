export default function UserMasterValidation(values, isTouched) {
  const errors = {}

  //Empolyee Code validation rule
  if (isTouched.empid && values.empid === '') {
    errors.empid = 'Required'
  } else if (isTouched.empid && !/^[0-9]+$/.test(values.empid)) {
    errors.empid = 'Only Enter Numeric Values'
  } else if (isTouched.empid && values.empid.length < 4) {
    errors.empid = 'Minimum Length : 4'
  }

  //Empolyee Name validation rule
  if (isTouched.emp_name && values.emp_name === '') {
    errors.emp_name = 'Required'
  } else if (isTouched.emp_name && !/^[a-zA-Z ]+$/.test(values.emp_name)) {
    errors.emp_name = 'Only have Letters and Space'
  } else if (isTouched.emp_name && values.emp_name.length < 4) {
    errors.emp_name = 'Minimum Length : 4'
  }


  //username validation rule
  if (isTouched.username && values.username === '') {
    errors.username = 'Required'
  } else if (isTouched.username && !/^[a-zA-Z ]+$/.test(values.username)) {
    errors.username = 'Only have Letters and Space'
  } else if (isTouched.username && values.username.length < 5) {
    errors.username = 'Minimum Length : 5'
  }

  //password validation rule
  if (isTouched.password && values.password === '') {
    errors.password = 'Required'
  } else if (isTouched.password && values.password.length < 5) {
    errors.password = 'Minimum Length : 5'
  }

  //Divison validation rule
  if (isTouched.Divison && values.Divison === '') {
    errors.Divison = 'Required'
  }

  //Department validation rule
  if (isTouched.Department && values.Department === '') {
    errors.Department = 'Required'
  }

  //Designation validation rule
  if (isTouched.Designation && values.Designation === '') {
    errors.Designation = 'Required'
  }

  //Designation validation rule
  if (isTouched.Designation && values.Designation === '') {
    errors.Designation = 'Required'
  }

  //Assign Vehicletype validation rule

  if (isTouched.vehicletypes && values.vehicletypes.length == 0) {
    errors.vehicletypes = 'Required'
  }

  //Incoterm Type validation rule

  if (isTouched.incotermtype && values.incotermtype.length == 0) {
    errors.incotermtype = 'Required'
  }

  //usermobile validation rule
  if (isTouched.usermobile && values.usermobile === '') {
    errors.usermobile = 'Required'
  } else if (isTouched.usermobile && !/^[\d]{10}$/.test(values.usermobile)) {
    errors.usermobile = '10-digits only'
  }

  //email validation rule
  if (isTouched.email && values.email === '') {
    errors.email = 'Required'
  } else if (isTouched.email && !/[a-z0-9]+@nagamills.com/.test(values.email)) {
    // } else if (isTouched.email && !/[a-zA-Z0-9]+@nagamills.com/.test(values.email)) {
    errors.email = 'not valid email ( Ex: abcd@nagamills.com )'
  }

  //UserPhoto validation rule
  if (isTouched.UserPhoto && values.UserPhoto === '') {
    errors.UserPhoto = 'Required'
  }

  //location validation rule
  if (isTouched.location && values.location.length === 0) {
    errors.location = 'Required'
  }

  return errors
}
