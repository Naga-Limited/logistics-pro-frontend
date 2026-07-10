import React, { useEffect, useState } from 'react'
import Select from 'react-select'   
const AdminInvoiceReversalShipmentSerachSelectComponent = ({
    size,
    id,
    className,
    onChange,
    label,
    noOptionsMessage,
    search_type,
    search_data = [],
    date_needed = {},
    division_type = '',
    isMultiple
}) => {
  const option = [{ value: '', label: 'Select' }]
  console.log(search_data,'DTSearchSelectComponent-search_data')
  console.log(search_type,'DTSearchSelectComponent-search_type')
  console.log(date_needed,'DTSearchSelectComponent-date_needed')
  

//   const [fciVendorsData, setFciVendorsData] = useState([]); 

  // useEffect(() => {
    
  //   if(search_data && search_data.length > 0){
  //     setShipmentData(search_data)
  //   } else {
  //     setShipmentData([])
  //   }
     
  // }, [search_data])
  
  useEffect(() => {

    // if (search_type == 'vendor_master') {
    //     /* section for getting Rake Vendors from database */
    //     FCIVendorCreationService.getAllSapVendorsFromLP().then((response) => {
    //         let viewData = response.data      
    //         console.log(viewData,'FCI Vendor Data') 
    //         setFciVendorsData(viewData)
    //     })
    // }  

  }, [])

  if (search_type == 'shipment_master') {
    search_data.map(({ shipment_id, shipment_no }) => {
        option.push({ value: shipment_id, label: shipment_no })
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
        isMulti={isMultiple}
      />
    </>
  )
}

export default AdminInvoiceReversalShipmentSerachSelectComponent
