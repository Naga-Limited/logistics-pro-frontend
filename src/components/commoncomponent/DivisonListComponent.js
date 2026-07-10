import { CFormLabel, CFormSelect } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import DivisionApi from 'src/Service/SubMaster/DivisionApi'

const DivisonListComponent = () => {
  const [divison, setDivison] = useState([])

  useEffect(() => {
    //fetch to get Divison list form master
    DivisionApi.getDivision().then((res) => {
      setDivison(res.data.data)
    })
  }, [])

  return (
    <>
        <option value={''}>Select...</option>
        {divison.map(({ id,division ,division_status}) => {

          if(division_status===1)
          {
            return (
              <>
                <option key={id} value={id}>
                  {division}
                </option>
              </>
            )
          }

        })}

    </>
  )
}

export default DivisonListComponent
