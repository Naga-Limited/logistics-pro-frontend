import { CFormLabel, CFormSelect } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import DesignationApi from 'src/Service/SubMaster/DesignationApi'

const DesignationListComponent = () => {
  const [designation, setDesignation] = useState([])

  useEffect(() => {
    //fetch to get Designation list form master
    DesignationApi.getDesignation().then((res) => {
      setDesignation(res.data.data)
    })
  }, [])

  return (
    <>
      <option value={''}>Select...</option>
      {designation.map(({ id, designation, designation_status }) => {
        if (designation_status === 1) {
          return (
            <>
              <option key={id} value={id}>
                {designation}
              </option>
            </>
          )
        }
      })}
    </>
  )
}

export default DesignationListComponent
