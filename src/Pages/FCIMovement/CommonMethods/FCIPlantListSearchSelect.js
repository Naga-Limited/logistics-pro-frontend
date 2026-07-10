import React, { useEffect, useState } from 'react' 
import Select from 'react-select' 
import FCIPlantMasterService from 'src/Service/FCIMovement/FCIPlantMaster/FCIPlantMasterService'

const FCIPlantListSearchSelect = (
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

  const [fciPlantData, setFciPlantData] = useState([])

  useEffect(() => {
    //fetch to get FCI Plant list form master 
    FCIPlantMasterService.getActiveFCIPlantRequestTableData().then((res) => {
      setFciPlantData(res.data.data)
      console.log(res.data.data,'getActiveSheds')
    })
  }, [])
  
  if (search_type == 'plant_name') {
    fciPlantData.map(({plant_id, plant_name }) => {
      option.push({ value: plant_id, label: plant_name})
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


export default FCIPlantListSearchSelect
