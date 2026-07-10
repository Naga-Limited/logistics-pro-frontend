import React, { useEffect, useState, useMemo } from 'react'
import Select from 'react-select'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import NlmtDefinitionsListApi from 'src/Service/Nlmt/Masters/NlmtDefinitionsListApi'

const NlmtSearchSelectComponent = ({
  size,
  id,
  className,
  onChange,
  label,
  noOptionsMessage = 'No data found',
  search_type,
  search_data = [],
  division_type = '',
  isMultiple = false,
}) => {
  const [srVehicle, setSRVehicle] = useState([])
  const [srcVehicle, setSRCVehicle] = useState([])

  /* ================== SHIPMENT ROUTES ================== */
  useEffect(() => {
    NlmtDefinitionsListApi.visibleNlmtDefinitionsListByDefinition(5).then((response) => {
      setSRVehicle(response.data?.data || [])
    })
  }, [])

  /* ================== OPTIONS BUILDER ================== */
  const options = useMemo(() => {
    const option = [{ value: '', label: 'Select' }]

    /* -------- VEHICLE NUMBER SEARCH -------- */
    if (search_type === 'nlmt_shipment_vehicle_number') {

      let sp_array = []
      search_data.map(({ vehicle_info, tripsheet_info }) => {
        if (sp_array.indexOf(tripsheet_info.nlmt_tripsheet_id) === -1) {
          sp_array.push(tripsheet_info.nlmt_tripsheet_id)
          option.push({ value: tripsheet_info.nlmt_tripsheet_id, label: vehicle_info.vehicle_number })
        }
      })

    } else if (search_type === 'nlmt_va_vehicle_number') {
      const uniqueVehicles = new Set()

      search_data.forEach((item) => {
        const vehicleNo = item?.vehicle_info?.vehicle_number
        const tripSheetNo = item?.tripsheet_info?.nlmt_tripsheet_id

        const parkingStatus = Number(item?.parking_status)
        const currentPosition = Number(item?.vehicle_current_position)

        if (
          [18, 16].includes(currentPosition) &&
          parkingStatus === 1 &&
          vehicleNo &&
          !uniqueVehicles.has(vehicleNo)
        ) {
          uniqueVehicles.add(vehicleNo)
          option.push({
            value: tripSheetNo,
            label: vehicleNo,
          })
        }
      })
    } else if (search_type === 'shipment_routes') {

    /* -------- SHIPMENT ROUTES -------- */
      const source = division_type == 2 ? srcVehicle : srVehicle

      source.forEach(({ definition_list_code, definition_list_name }) => {
        option.push({
          value: definition_list_code,
          label: `${definition_list_name} - ${definition_list_code}`,
        })
      })
    } else if (search_type === 'work_order') {
    /* -------- WORK ORDER -------- */
      let sp_work_order_array = []

      ;(search_data || []).forEach(({ EBELN }) => {
        if (EBELN && !sp_work_order_array.includes(EBELN)) {
          sp_work_order_array.push(EBELN)
          option.push({ value: EBELN, label: EBELN })
        }
      })
    }

    return option
  }, [search_type, search_data, srVehicle, srcVehicle, division_type])

  /* ================== RENDER ================== */
  return (
    <Select
      id={id}
      options={options}
      placeholder={label}
      noOptionsMessage={() => noOptionsMessage}
      size={size}
      className={className}
      onChange={onChange}
      isMulti={isMultiple}
      isClearable
    />
  )
}

export default NlmtSearchSelectComponent
