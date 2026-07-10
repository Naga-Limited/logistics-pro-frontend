import React, { useEffect, useState } from 'react'
import DieselIntentCreationService from 'src/Service/DieselIntent/DieselIntentCreationService' 

const DieseVendorSelectComponent = () => {
  const [allDieselVendorList, setAllDieselVendorList] = useState([])
  
  useEffect(() => {
    //fetch to get Diesel Vendors list form master
    DieselIntentCreationService.getDieselVendor().then((res) => {
      setAllDieselVendorList(res.data.data)
    })
  }, [])

  return (
    <>
      <option  value={''}>Select...</option>
      {allDieselVendorList.map(({ diesel_vendor_id, diesel_vendor_name }) => {
        return (
          <>
            <option key={diesel_vendor_id} value={diesel_vendor_id}>
              {diesel_vendor_name}
            </option>
          </>
        )
      })}
    </>
  )
}

export default DieseVendorSelectComponent
