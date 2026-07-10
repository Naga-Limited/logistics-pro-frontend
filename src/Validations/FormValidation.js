export default function validate(values, isTouched) {
  const errors = {}
  // Parking Yard Gate In
  if (!values.vType && isTouched.vType) {
    errors.vType = 'Required'
  }

  if (!values.vNum && isTouched.vNum) {
    errors.vNum = 'Required'
  } else if (values.vNum) {
  }

  if (!values.dName && isTouched.dName) {
    errors.dName = 'Required'
  }

  if (!values.dNum && isTouched.dNum) {
    errors.dNum = 'Required'
  }

  if (isTouched.vBody && !values.vBody) {
    errors.vBody = 'Required'
  }
  if (isTouched.vCapMts && !values.vCapMts) {
    errors.vCapMts = 'Required'
  }
  if (isTouched.odoKm && !values.odoKm) {
    errors.odoKm = 'Required'
  }

  if (isTouched.pName && !values.pName) {
    errors.pName = 'Required'
  }

  return errors
}



// export default function rules(values) {
//   let errors = {};
//   if (!values.email) {
//     errors.email = 'Email address is required';
//   } else if (!/\S+@\S+\.\S+/.test(values.email)) {
//     errors.email = 'Email address is invalid';
//   }
//   if (!values.password) {
//     errors.password = 'Password is required';
//   } else if (values.password.length < 8) {
//     errors.password = 'Password must be 8 or more characters';
//   }
//   return errors;
// };
