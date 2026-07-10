import { CFormSelect } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import PerviousLoadDetailsService from 'src/Service/PerviousLoadDetails/PerviousLoadDetailsService'

const PerviousLoadDetailComponent = () => {

  const [loadDetails, setLoadDetails] = useState([])

  useEffect(() => {
    //fetch to get Drivers list form master
    PerviousLoadDetailsService.getPerviousLoadDetails().then((res) => {
      console.log(res.data)
      setLoadDetails(res.data.data)
    })
  }, [])

  return (
    <>

        <option value={''}>Select...</option>
        {loadDetails.map(({ id, previous_load_details }) => {
          return (
            <>
              <option key={id} value={id}>
                {previous_load_details}
              </option>
            </>
          )
        })}

    </>
  )
}

export default PerviousLoadDetailComponent
