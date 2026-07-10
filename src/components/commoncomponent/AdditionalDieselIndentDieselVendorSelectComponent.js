import React, { useEffect, useState } from 'react'
import DieselIntentCreationService from 'src/Service/DieselIntent/DieselIntentCreationService' 

const AdditionalDieselIndentDieselVendorSelectComponent = () => {
  const [activeDieselVendorList, setActiveDieselVendorList] = useState([])

  useEffect(() => {
    //fetch to get Diesel Vendors list form master
    DieselIntentCreationService.getActiveDieselVendors().then((res) => {
      console.log(res.data.data,'AdditionalDieselIndentDieselVendorSelectComponent')
      setActiveDieselVendorList(res.data.data)
    })
  }, [])

  return (
    <>
      <option  value={''}>Select...</option>
      {activeDieselVendorList.filter(dv=>dv.diesel_vendor_id !== 3).map(({ diesel_vendor_id, diesel_vendor_name }) => {
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

export default AdditionalDieselIndentDieselVendorSelectComponent

