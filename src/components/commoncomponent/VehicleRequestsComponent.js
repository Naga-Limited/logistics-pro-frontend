import React, { useEffect, useState } from 'react'
import { MultiSelect } from "react-multi-select-component";
import VehicleRequestMasterService from 'src/Service/VehicleRequest/VehicleRequestMasterService';
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi';
import DivisionApi from 'src/Service/SubMaster/DivisionApi';

const VehicleRequestsComponent = ({
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
  sendDataToParent
}) => {
  const [vrs, setVrs] = useState([])
  const [divisionData, setDivisionData] = useState([])
  const [purposeData, setPurposeData] = useState([])

  const inArray =(needle, haystack) => {
    // console.log(needle,'needle')
    // console.log(haystack,'haystack')
    if(haystack){
      var length = haystack.length
      for (var i = 0; i < length; i++) {
        if (haystack[i] == needle) return true
      }
    }
    return false
  }

  const div_finder = (division) => {
    let div = ''
    if(divisionData.length > 0){
      divisionData.map((vv,kk)=>{
        if(division == vv.id){
          div = vv.division
        }
      })
    }
    return div
  }

  const purp_finder = (purpose) => {
    let purp = ''
    if(purposeData.length > 0){
      purposeData.map((vv1,kk1)=>{
        if(purpose == vv1.definition_list_code){
          purp = vv1.definition_list_name
        }
      })
    }
    return purp
  }

  useEffect(()=>{
    if(divisionData.length > 0 && purposeData.length > 0){
      VehicleRequestMasterService.getVehicleRequests().then((res)=>{

        let vrList = res.data.data
        console.log(vrList,'getVehicleRequests')
        let formattedVrList = []
        if (vrList.length > 0) {
          let filteredData = vrList.filter((vr) => vr.vr_status === 1)
          filteredData.map((vrs) =>
          formattedVrList.push({
              value: vrs.vr_id,
              label: `${vrs.vr_no} (${div_finder(vrs.vr_division)} - ${purp_finder(vrs.vr_purpose)} : By ${vrs.request_by})`,
              // label: `${vrs.vr_no}`,
            })
          )
          sendDataToParent(filteredData)
        }
        
        setVrs(formattedVrList)
      })
    }

  },[purposeData,divisionData])

  useEffect(()=>{

    /* section for getting Division Data from database */
    DivisionApi.getDivision().then((rest) => {

      let tableData = rest.data.data
      console.log(tableData)
      setDivisionData(tableData)
    })

    /* section for getting VR Purpose Lists from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(29).then((response) => {

      let viewData = response.data.data
      console.log(viewData,'VR Purpose Lists')
      setPurposeData(viewData)
    })

  }, [])

  return (
    <>
      <MultiSelect
        id={id}
        size={size}
        options={vrs}
        value={vrs.filter((cusrrVrs) => inArray(cusrrVrs.value,selectedValue))}
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

export default VehicleRequestsComponent
