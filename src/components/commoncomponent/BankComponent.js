import { CFormSelect } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import BankService from 'src/Service/Bank/BankService'

const BankComponent = () => {

  const [loadDetails, setLoadDetails] = useState([])

  useEffect(() => {
    //fetch to get bank list form master
    BankService.getBankDetails().then((res) => {
      console.log(res.data.data)
      setLoadDetails(res.data.data)
    })
  }, [])

  return (
    <>

        <option value={''}>Select...</option>
        {loadDetails.map(({ bank_id, bank_name }) => {
          return (
            <>
              <option key={bank_id} value={bank_id}>
                {bank_name}
              </option>
            </>
          )
        })}

    </>
  )
}

export default BankComponent
