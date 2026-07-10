import { CFormLabel, CFormSelect } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import DepartmentApi from 'src/Service/SubMaster/DepartmentApi'

const DepartmentListComponent = () => {
  const [department, setDepartment] = useState([])

  useEffect(() => {
    //fetch to get Department list form master
    DepartmentApi.getDepartment().then((res) => {
      setDepartment(res.data.data)
    })
  }, [])

  return (
    <>
      <option value={''}>Select...</option>
      {department.map(({ id, department, department_status }) => {
        if (department_status === 1) {
          return (
            <>
              <option key={id} value={id}>
                {department}
              </option>
            </>
          )
        }
      })}
    </>
  )
}

export default DepartmentListComponent
