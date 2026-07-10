
import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import FIEntryService from 'src/Service/FIEntry/FIEntryService'

const TripSheetSearchComponent = ({
  size,
  id,
  className,
  onChange,
  label,
  noOptionsMessage,
  search_type,
  search_data = [],
}) => {
  const option = [{ value: '', label: 'Select' }]

  const [TripsheetNo, setTripsheetNo] = useState([])
  const [CurrentTSNO, setCurrentTSNO] = useState([])

  useEffect(() => {

/* section for getting Tripsheet no Data from database For FI Entry */
    FIEntryService.getFIEntryVehiclesList().then((rest) => {
      console.log(rest.data)
      let tableData = rest.data
      setTripsheetNo(tableData)
    })
  }, [])

  useEffect(() => {

    /* section for getting Tripsheet no Data from database For Vehicle Current Position */
        FIEntryService.getFIEntryVehicles().then((rest) => {
          console.log(rest.data)
          let tableData = rest.data
          const filterData = tableData.filter((data) => data.vehicle_current_position != '28')
          setCurrentTSNO(filterData)
        })
      }, [])

    if (search_type == 'tripsheetNumber') {
        let sp_vehicle_array = []
        search_data.map(({ tripsheet_sheet_id, trip_sheet_no }) => {
          if (sp_vehicle_array.indexOf(trip_sheet_no) === -1) {
            sp_vehicle_array.push(trip_sheet_no)
            option.push({ value: trip_sheet_no, label: trip_sheet_no })
          }
        })
      }

  if (search_type == 'tripsheetNumbers') {
    TripsheetNo.map(({ tripsheet_sheet_id, trip_sheet_no }) => {
      option.push({ value: trip_sheet_no, label: trip_sheet_no })
    })
  }
  else if (search_type == 'tripsheet_Number') {
    CurrentTSNO.map(({ tripsheet_sheet_id, trip_sheet_no }) => {
      option.push({ value: trip_sheet_no, label: trip_sheet_no })
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

export default TripSheetSearchComponent
