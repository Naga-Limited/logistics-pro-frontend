import { CFormLabel, CFormSelect } from '@coreui/react'
import React, { useEffect, useState } from 'react'
//  import Select from 'react-select'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import { MultiSelect } from "react-multi-select-component";

const TripPaymentSubmissionComponent= ({
  size,
  name,
  id,
  onFocus,
  onBlur,
  onChange,
  selectedValue,
  isMultiple,
  className,
  label,
  noOptionsMessage,
  search_type,
  search_data = []
}) => {
  // const [incotermtype, setIncotermTypes] = useState([])
  const [paymentTripsheets, setPaymentTripsheets] = useState([])

  useEffect(() => {
    if(search_type == 'payment_submission'){
      let sp_ts_array = []
      console.log(search_data,'search_data-search_data')
      search_data.map(({ tripsheet_sheet_id, vehicle_tripsheet_info }) => {
        if (sp_ts_array.indexOf(tripsheet_sheet_id) === -1) {
          // sp_ts_array.push(tripsheet_id)
          sp_ts_array.push({
            value: tripsheet_sheet_id,
            label: vehicle_tripsheet_info.depo_tripsheet_no,
          })
          console.log(sp_ts_array,'sp_ts_array-sp_ts_array')
          // setPaymentTripsheets(sp_ts_array)
          // option.push({ value: tripsheet_id, label: trip_sheet_info.trip_sheet_no })
        }
      })
      setPaymentTripsheets(sp_ts_array)
    }
  },[])

  return (
    <>
      <MultiSelect
        id={id}
        size={size}
        options={paymentTripsheets}
        value={paymentTripsheets.filter((currincoterm) => selectedValue.includes(currincoterm.value))}
        name={name}
        className={className}
        isMulti={isMultiple}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={(e) => onChange(e, name)}
        placeholder={label}
        noOptionsMessage={() => noOptionsMessage}
      />
    </>
  )
}

export default TripPaymentSubmissionComponent
