import { CFormLabel, CFormSelect } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import { MultiSelect } from 'react-multi-select-component'
import IfoodsOutletMasterService from 'src/Service/Ifoods/Master/IfoodsOutletMasterService'

const OutletListComponent = ({
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
}) => {
  const [outlet, setOutlet] = useState([])

  // useEffect(() => {
  //   IfoodsOutletMasterService.getIfoodsOutlets().then((res) => {
  //     let outletList = res.data.data,
  //       formattedOutletList = []
  //       const outletCodeArray = [];
  //     if (outletList.length > 0) {
  //       //let filteredData = outletList.filter((outlet) => outlet.outlet_status === 1)
  //       filteredData.map((outlet) =>
  //         formattedOutletList.push({
  //           value: outlet.id,
  //           label: `${outlet.outlet_name} - ${outlet.outlet_code}`,
  //         })
        
  //       )
  //     }
  //     outletCodeArray.push(outlet.outlet_code)
  //     setOutlet(formattedOutletList)
  //     console.log(outletList)
  //     console.log(outletCodeArray)
  //   })
  // }, [])
  useEffect(() => {
    IfoodsOutletMasterService.getIfoodsOutlets().then((res) => {
      const outletList = res.data.data;
      const formattedOutletList = [];
      const outletCodeArray = [];
  
      if (outletList.length > 0) {
        const filteredData = outletList.filter((outlet) => outlet.outlet_status === 1);

        filteredData.forEach((outlet) => {
          formattedOutletList.push({
            value: outlet.id,
            label: `${outlet.outlet_name} - ${outlet.outlet_code}`,
          });
  
          outletCodeArray.push(outlet.outlet_code);
        });
      }
  
      setOutlet(formattedOutletList);
      console.log(outletList);
      console.log(outletCodeArray); 
    });
  }, []);

  return (
    <>
      <MultiSelect
        id={id}
        size={size}
        options={outlet}
        value={outlet.filter((curroutlet) => selectedValue.includes(curroutlet.value))}
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

export default OutletListComponent
