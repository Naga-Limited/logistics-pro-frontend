import { CFormLabel, CFormSelect } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import NlmtShedMasterService from 'src/Service/Nlmt/Masters/NlmtShedMasterService'

const NlmtShedListSearchSelect = (
  {
    size,
  id,
  className,
  onChange,
  label,
  noOptionsMessage,
  search_type,
  }
) => {
  const option = [{ value: '', label: 'Select' }]

  const [shed, setShed] = useState([])

  useEffect(() => {
    NlmtShedMasterService.getActiveSheds().then((res) => {
      setShed(res.data.data,'getActiveSheds')
      console.log(res.data.data)
    })
  }, [])

  if (search_type == 'shed_name') {
    shed.map(({ shed_id, shed_name }) => {
      option.push({ value: shed_id, label: shed_name})
    })
  }

  return (
    <>
      <Select
        options={option}
        placeholder={label}
        noOptionsMessage={() => noOptionsMessage}
        size={size}
        className={className}
        onChange={(e) => onChange(e)}
      />
    </>
  )
}


export default NlmtShedListSearchSelect
