import { CFormLabel, CFormSelect } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import { MultiSelect } from "react-multi-select-component";

const TripPaymentSubmissionComponent = ({
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
  const [paymentTripsheets, setPaymentTripsheets] = useState([])

  useEffect(() => {
    if(search_type == 'payment_submission'){
      let sp_ts_array = []
      console.log(search_data,'search_data-search_data')

      search_data.map((item) => {
        // Use nlmt_trip_in_id as the unique identifier
        const tripId = item.nlmt_trip_in_id
        // Get tripsheet number from nested tripsheet_info
        const tripsheetNo = item.tripsheet_info?.nlmt_tripsheet_no || 'N/A'

        if (sp_ts_array.findIndex(ts => ts.value === tripId) === -1) {
          sp_ts_array.push({
            value: tripId,
            label: tripsheetNo,
          })
        }
      })

      console.log(sp_ts_array,'sp_ts_array-sp_ts_array')
      setPaymentTripsheets(sp_ts_array)
    }
  },[search_data, search_type])

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
        labelledBy={label}
        overrideStrings={{
          selectSomeItems: label || "Select...",
          allItemsAreSelected: "All items are selected",
          selectAll: "Select All",
          search: "Search",
        }}
      />
    </>
  )
}

export default TripPaymentSubmissionComponent
