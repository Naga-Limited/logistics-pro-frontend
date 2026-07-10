/* eslint-disable prettier/prettier */
import {
  CButton,
  CCard,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTabContent,
  CTabPane,
} from '@coreui/react'
import  React , { useEffect, useState } from 'react'
import useForm from 'src/Hooks/useForm.js'
import { Link, useNavigate } from 'react-router-dom'
import Loader from 'src/components/Loader'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants' 
import LocationApi from 'src/Service/SubMaster/LocationApi'
import DepoRouteMasterService from 'src/Service/Depo/Master/DepoRouteMasterService'
import Webcam from 'react-webcam' 
import DepoCustomerValidation from 'src/Utils/Depo/Customer/DepoCustomerValidation' 
import NLFSVehicleMasterApi from 'src/Service/NLFS/Master/NLFSVehicleMasterApi'
import DropdownListApi from 'src/Service/NLFS/Master/DropdownListApi'
import NLFSDivisionApi from 'src/Service/NLFS/Master/NLFSDivisionApi'
import VendorOutstanding from 'src/Service/SAP/VendorOutstanding'
import NLFSDieselIntentService from 'src/Service/NLFS/Master/NLFSDieselIntentService' 
import Swal from 'sweetalert2'

const OtherDICreation = () => {
  const formValues = {
    vehicle_division: '',
    vehicle_plant: '',
    vehicle_fueltype: '',
    user_name: '',
    contact_no: '',
    di_quantity: '',
    carry_vehicle_no: '',
    remarks: '',
  }

  const webcamRef = React.useRef(null);
  const [fileuploaded, setFileuploaded] = useState(false)
  const [camEnable, setCamEnable] = useState(false)
  const [imgSrc, setImgSrc] = React.useState(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef, setImgSrc]);

  const dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, {type: mime});
  };

  const valueAppendToImage = (image) => {

    let file_name = 'dummy'+getRndInteger(100001,999999)+'.png'
    let file = dataURLtoFile(
      image,
      file_name,
    );

    console.log(file )

    values.customerPhoto = file
  }

  // will hold a reference for our real input file
  let inputFile = '';

  // function to trigger our input file click
  const uploadClick = e => {
    e.preventDefault();
    inputFile.click();
    return false;
  };

  /*================== User Id & Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []
  const navigation = useNavigate()

  console.log(user_info)

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  // console.log(user_locations)
  /*================== User Location Fetch ======================*/

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.DieselIntentModule.Diesel_Intent_Creation_Request

  useEffect(()=>{

    if(user_info.is_admin == 1 || JavascriptInArrayComponent(page_no,user_info.page_permissions)){
      console.log('screen-access-allowed')
      setScreenAccess(true)
    } else{
      console.log('screen-access-not-allowed')
      setScreenAccess(false)
    }

  },[])
  /* ==================== Access Part End ========================*/

  const REQ = () => <span className="text-danger"> * </span>
  const [fetch, setFetch] = useState(false)
  const [locationData, setLocationData] = useState([])
  const [submitBtn, setSubmitBtn] = useState(true)
  const [routeData, setRouteData] = useState([]) 
  const [routeId, setRouteId] = useState('')
  const [depoLocationName, setDepoLocationName] = useState('')

  const [dieselForData, setDieselForData] = useState([])  
  const [dieselForValue, setDieselForValue] = useState('')
  const [sapDieselRate, setSapDieselRate] = useState(0)
  const [otherDivisionVehicleMasterData, setOtherDivisionVehicleMasterData] = useState([])
  const [otherDivisionVehicleValue, setOtherDivisionVehicleValue] = useState('')
  const [divisionData, setDivisionData] = useState([])
  const [plantData, setPlantData] = useState([])
  const [vehicleVarietyData, setVehicleVarietyData] = useState([])
  const [vehicleCapacityData, setVehicleCapacityData] = useState([])
  const [vehicleModelData, setVehicleModelData] = useState([])
  const [vehicleFuelTypeData, setVehicleFuelTypeData] = useState([])
  const [vehicleFuelTankCapacityData, setVehicleFuelTankCapacityData] = useState([])

  const { values, errors, handleChange, onFocus, handleSubmit, onBlur } = useForm(
    addNewCustomer,
    DepoCustomerValidation,
    formValues
  )

  useEffect(() => {
    
    //section for getting Location Data from database
    LocationApi.getLocation().then((res) => {
      setLocationData(res.data.data)
    })

    //section for getting Location Data from database
    NLFSVehicleMasterApi.getActiveNLFSVehicles().then((response) => {
      let viewData = response.data.data
      console.log(viewData,'getActiveNLFSVehicles')
      setOtherDivisionVehicleMasterData(viewData)
    })

    //section for getting Divisions Data from database
    NLFSDivisionApi.getActiveDivisions().then((response) => {
      let viewData = response.data.data
      console.log(viewData,'getActiveDivisions')
      setDivisionData(viewData)
    })

    /* Fetch Plant For data */
    DropdownListApi.visibleDropdownsListByDropdown(5).then((response) => {
      setFetch(true)
      let needed_data = response.data.data
      console.log(needed_data,'getPlantData')
      setPlantData(needed_data)
    })

    /* Fetch Diesel For data */
    DropdownListApi.visibleDropdownsListByDropdown(1).then((response) => {
      setFetch(true)
      let needed_data = response.data.data
      console.log(needed_data,'getDieselForData')
      setDieselForData(needed_data)
    })

    /* Fetch Fuel Type data */
    DropdownListApi.visibleDropdownsListByDropdown(2).then((response) => {
      let needed_data = response.data.data
      console.log(needed_data,'getVehicleFuelTypeData')
      setVehicleFuelTypeData(needed_data)
    })

    /* Fetch Fuel Tank Capacity data */
    DropdownListApi.visibleDropdownsListByDropdown(3).then((response) => {
      let needed_data = response.data.data
      console.log(needed_data,'getVehicleFuelTankCapacityData')
      setVehicleFuelTankCapacityData(needed_data)
    })

    /* Fetch Vehicle Model data */
    DropdownListApi.visibleDropdownsListByDropdown(4).then((response) => {
      let needed_data = response.data.data
      console.log(needed_data,'getVehicleModelData')
      setVehicleModelData(needed_data)
    })

  }, [])

  const getRndInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  }



  useEffect(() => {

    if(values.customerPhoto) {
      setFileuploaded(true)
    } else {
      setFileuploaded(false)
    }

  }, [values.customerPhoto])


  const onChangeFilter = (event) => {
    var selected_value = event.value
    console.log(selected_value, 'selected_value')
    if (selected_value) {
      setDepoLocationName(selected_value)
      values.locationName = selected_value
      errors.locationName = ''
    } else {
      setDepoLocationName('')
      values.locationName = ''
      errors.locationName = 'Required'
    }
  }

  const onChangeDieValFilter = (value,type) => {
    let selected_value = value
    console.log(selected_value,'selected_value')
    if (selected_value) {
      setDieselForValue(selected_value)  
      // if(!(selected_value == '1' || selected_value == '29') ) 
        setOtherDivisionVehicleValue('') 
    } else {
      setDieselForValue('') 
      setOtherDivisionVehicleValue('') 
    }
  }

  const onChangeVehDivFilter = (value) => {
    let selected_value = value
    console.log(selected_value,'selected_value')
    if (selected_value) {
      setOtherDivisionVehicleValue(selected_value)      
    } else { 
      setOtherDivisionVehicleValue('') 
    }
  }

  useEffect(() => {

    

    let lName = !errors.locationName && values.locationName
    let rName = !errors.routeName && values.routeName
    let cName = !errors.customerName && values.customerName
    let cAddress = !errors.customerAddress && values.customerAddress
    let cCode = !errors.customerCode && values.customerCode
    let cNumber = !errors.customerNumber && values.customerNumber


    let condition_check = lName && rName && cName && cAddress && cCode && cNumber

    console.log(condition_check,'condition_check')

    if (condition_check) {
      setSubmitBtn(false)
    } else {
      setSubmitBtn(true)
    }
  }, [values, errors, depoLocationName, routeId])

  useEffect(() => {

    if(depoLocationName) {

      //section to fetch Routes by Depo Location Id
      DepoRouteMasterService.getDepoRoutesByDepoLocationId(depoLocationName).then((res) => {
        console.log(res.data.data,'getDepoRoutesByDepoLocationId')
        setRouteData(res.data.data)
      })

    } else {
      setRouteData([])
    }


  }, [depoLocationName])

  function addNewCustomer() {
    
    if(dieselForValue == ''){
      toast.warning('Diesel For Should be choosed..!')
      return false
    }

    if((dieselForValue == 1 || dieselForValue == 29) && otherDivisionVehicleValue == ''){
      toast.warning('Vehicle Number Should be choosed..!')
      return false
    }

    if(!(dieselForValue == 1 || dieselForValue == 29)){

      if(values.vehicle_division == ''){
        toast.warning('Vehicle Division Should be choosed..!')
        return false
      }

      if(values.vehicle_plant == ''){
        toast.warning('Vehicle Plant Should be choosed..!')
        return false
      }

      if(values.user_name.trimStart() == ''){
        values.user_name = ''
        toast.warning('Vehicle User Name Should be required..!')
        return false
      }

      if(values.contact_no.trimStart() == ''){
        values.contact_no = ''
        toast.warning('Vehicle User Contact Number Should be required..!')
        return false
      }

      if (values.contact_no && !/^[\d]{10}$/.test(values.contact_no)) {
        toast.warning('Vehicle User Contact Number Should have 10 Digit Numeric')
        return false
      }

      if(values.vehicle_fueltype == ''){
        toast.warning('Vehicle Fuel Type Should be choosed..!')
        return false
      }

      if(values.di_quantity.trimStart() == ''){
        values.di_quantity = ''
        toast.warning('Vehicle Diesel Quantity Should be required..!')
        return false
      }

      if (values.di_quantity &&!/^[\d]{1,5}\.[\d]{3}$/.test(values.di_quantity)) {
        toast.warning('Fuel Quantity Allow only Float Format (Ex: 19.900)')
        return false
      }

      if(values.carry_vehicle_no.trimStart() == ''){
        values.carry_vehicle_no = ''
        toast.warning('Carry Vehicle Number Should be required..!')
        return false
      }

    }

    console.log(values,'addNewCustomer-createDepoFreight')
    console.log(otherDivisionVehicleValue,'addNewCustomer-otherDivisionVehicleValue')
    console.log(dieselForValue,'addNewCustomer-dieselForValue')
    
    let curVehArray = currentVehicleMasterData(otherDivisionVehicleValue)
    console.log(curVehArray,'addNewCustomer-curVehArray')
    setFetch(false)
    // return false

    const formData = new FormData()
    formData.append('diesel_to', dieselForValue == '29' ? 4 : dieselForValue)
    formData.append('status', 1)

    if(!(dieselForValue == 1 || dieselForValue == 29)){ 
      formData.append('sap_fuel_rate', sapDieselRate)
      formData.append('fuel_quantity', values.di_quantity)
      formData.append('carry_vehicle', values.carry_vehicle_no)
      formData.append('total_amount', dieselTotalAmountFinder())  
      formData.append('division_id', values.vehicle_division)
      formData.append('plant_id', values.vehicle_plant) 
      formData.append('vehicle_user_number', values.contact_no)
      formData.append('vehicle_user_name', values.user_name)
      formData.append('fuel_type_id', values.vehicle_fueltype)
    } else {
      formData.append('vehicle_id', otherDivisionVehicleValue)
      formData.append('vehicle_no', curVehArray[0].vehicle_no)
      formData.append('division_id', curVehArray[0].division_id)
      formData.append('plant_id', curVehArray[0].plant_id)
      formData.append('vehicle_user_name', curVehArray[0].vehicle_user_name)
      formData.append('vehicle_user_number', curVehArray[0].vehicle_user_info?.mobile_no)
      formData.append('fuel_type_id', curVehArray[0].fuel_type_id)
    }
    
    formData.append('remarks', values.remarks)
    formData.append('created_by', user_id)

    console.log(values,'addNewCustomer-createDepoFreight')
    console.log(dieselForValue,'addNewCustomer-dieselForValue')
    console.log(formData,'addNewCustomer-formData')

    NLFSDieselIntentService.createDiesel(formData).then((res) => {
      console.log(res,'createDiesel')
      let sap_di_no = res.data.data.di_no
      console.log(sap_di_no,'sap_di_no')
      if (res.status == 201) {
        setFetch(true)
        // toast.success('Diesel Indent Created Successfully!')

        Swal.fire({
          title: 'Diesel Indent Created Successfully!',
          icon: "success",
          text:  'Diesel Indent No. : ' + sap_di_no,
          confirmButtonText: "OK",
        }).then(function () {
          window.location.reload(false)
        })

      } else if (res.status == 202) {
        setFetch(true)
        toast.warning('Diesel Indent Already Exists..!')

        setTimeout(() => {
          // window.location.reload(false)
        }, 1000)
      }
    })
  }

  const currentVehicleMasterData = (veh_id) => {
    let veh_array = []
    console.log(veh_id,'otherDivisionVehicleMasterData-veh')
    console.log(otherDivisionVehicleMasterData,'otherDivisionVehicleMasterData')
    veh_array = otherDivisionVehicleMasterData.filter((vl)=>vl.vehicle_id == veh_id)
    console.log(veh_array,'otherDivisionVehicleMasterData-veh_array')
    return veh_array
  }

  const vehicleDivisionFinder = (veh) => {
    console.log(divisionData,'divisionData')
    let vehMaster = veh ? currentVehicleMasterData(veh) : []
    let vehdiv = '-'
    console.log(vehMaster,'vehicleDivisionFinder-vehMaster')
    if(vehMaster.length > 0 && vehMaster[0].vehicle_division_info){
      vehdiv = vehMaster[0].vehicle_division_info.division_name
    }
    return vehdiv
  }

  const divisionCodeFinder = (div) => {
    console.log(divisionData,'divisionData-data')
    let div_code = 0 
    divisionData.map((vv,kk)=>{
      if(vv.division_id == div){
        div_code = vv.add_col_one
      }
    }) 
    console.log(div_code,'divisionData-div_code')
    return div_code
  }

  const vehiclePlantFinder = (veh) => {
    console.log(divisionData,'divisionData')
    let vehMaster = veh ? currentVehicleMasterData(veh) : []
    let vehdiv = '-'
    console.log(vehMaster,'vehicleDivisionFinder-vehMaster')
    if(vehMaster.length > 0 && vehMaster[0].vehicle_plant_info){
      vehdiv = `${vehMaster[0].vehicle_plant_info.dropdown_list_name} (${vehMaster[0].vehicle_plant_info.short_name})`
    }
    return vehdiv
  }

  const vehicleVarietyFinder = (veh) => {
    console.log(vehicleVarietyData,'vehicleVarietyData')
    let vehMaster = veh ? currentVehicleMasterData(veh) : []
    let vehvar = '-'
    console.log(vehMaster,'vehicleVarietyFinder-vehMaster')
    if(vehMaster.length > 0 && vehMaster[0].vehicle_variety_info){
      vehvar = vehMaster[0].vehicle_variety_info.vehicle_variety
    }
    return vehvar
  }

  const vehicleModelFinder = (veh) => {
    console.log(vehicleModelData,'vehicleModelData')
    let vehMaster = veh ? currentVehicleMasterData(veh) : []
    let vehmod = '-'
    console.log(vehMaster,'vehicleModelFinder-vehMaster')
    if(vehMaster.length > 0 && vehMaster[0].vehicle_model_info){
      vehmod = vehMaster[0].vehicle_model_info.dropdown_list_name
    }
    return vehmod
  }

  const vehicleFuelTypeFinder = (veh) => {
    console.log(vehicleFuelTypeData,'vehicleFuelTypeData')
    let vehMaster = veh ? currentVehicleMasterData(veh) : []
    let vehvft = '-'
    console.log(vehMaster,'vehicleModelFinder-vehMaster')
    if(vehMaster.length > 0 && vehMaster[0].vehicle_fuel_info){
      vehvft = vehMaster[0].vehicle_fuel_info.dropdown_list_name
    }
    return vehvft
  }

  const vehicleFuelTankCapacityFinder = (veh) => {
    console.log(vehicleFuelTankCapacityData,'vehicleFuelTankCapacityData')
    let vehMaster = veh ? currentVehicleMasterData(veh) : []
    let vehvftc = '-'
    console.log(vehMaster,'vehicleFuelTankCapacityFinder-vehMaster')
    if(vehMaster.length > 0 && vehMaster[0].vehicle_fuel_tank_capacity_info){
      vehvftc = vehMaster[0].vehicle_fuel_tank_capacity_info.dropdown_list_name
    }
    return vehvftc &&  vehvftc!= '-' ? vehvftc +' Ltr' : '-'
  }

  const vehicleUserFinder = (veh) => { 
    let vehMaster = veh ? currentVehicleMasterData(veh) : []
    let vehuser = '-'
    console.log(vehMaster,'vehicleUserFinder-vehMaster')
    if(vehMaster.length > 0 && vehMaster[0].vehicle_user_name){
      vehuser = vehMaster[0].vehicle_user_name
    }
    
    return vehuser
  }

  useEffect(()=>{

    if(values.vehicle_division && values.vehicle_division != 0)
    {
      console.log(values.vehicle_division,'ifelse-if part')
      let dirate = 0
      console.log(values.vehicle_division,'sapFuelRateFinder-div')
      let divicode = divisionCodeFinder(values.vehicle_division)
      setFetch(false)
      VendorOutstanding.getNLFSDieselRate(divicode).then((res) => {
        // let driver_outstanding_data = res.data[0];
        setFetch(true)
        let op_array = res.data[0]
        dirate = 121
        console.log(op_array,'getNLFSDieselRate');
        if(op_array.STATUS == 1){
          setSapDieselRate(op_array.AMOUNT)
        } else {
          setSapDieselRate(0)
        }
        
        // setHireVendorOutstanding(driver_outstanding_data.L_DMBTR)
      })
      
    } else {
      console.log(values.vehicle_division,'ifelse-else part')
      setSapDieselRate(0)
    }

  },[values.vehicle_division]) 

  const dieselTotalAmountFinder = () => {
    return sapDieselRate * values.di_quantity
    // return 0
  }

  return (
    <>
      {!fetch && <Loader />}

      {fetch && (
        <>
          {screenAccess ? (
            <>
              <CCard>
                <CTabContent>
                  <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={true}>
                    <CForm className="row g-3 m-2 p-1" onSubmit={handleSubmit}>
                      <CRow className="mb-md-1">
                        <CCol md={3}>
                          <CFormLabel htmlFor="locationName">
                            Diesel For <REQ />{' '}
                            {errors.locationName && (
                              <span className="small text-danger">{errors.locationName}</span>
                            )}
                          </CFormLabel>
                          <CFormSelect
                            size="sm"
                            name="routeName"
                            id="routeName"
                            onFocus={onFocus}
                            onChange={(e) => onChangeDieValFilter(e.target.value)}
                            value={dieselForValue}
                            aria-label="Small select example"
                          >
                            <option value="">Select ...</option>

                            {dieselForData.map(({ dropdown_list_id, dropdown_list_name }) => {
                              return (
                                <>
                                  <option key={dropdown_list_id} value={dropdown_list_id}>
                                    {dropdown_list_name}
                                  </option>
                                </>
                              )
                            })}
                          </CFormSelect>

                        </CCol>

                        {(dieselForValue == 1 || dieselForValue == 29) && ( <>

                          <CCol md={3}>
                            <CFormLabel htmlFor="routeName">
                              Vehicle Number <REQ />{' '}
                              {errors.routeName && (
                                <span className="small text-danger">{errors.routeName}</span>
                              )}
                            </CFormLabel>

                            <CFormSelect
                              size="sm"
                              name="routeName"
                              id="routeName"
                              onFocus={onFocus}
                              onChange={(e) => onChangeVehDivFilter(e.target.value)}
                              value={otherDivisionVehicleValue}
                              aria-label="Small select example"
                            >
                              <option value="">Select ...</option>

                              {otherDivisionVehicleMasterData.filter(u => (dieselForValue == 29 ? u.is_car == 1 : u.is_car != 1)).map(({ vehicle_id, vehicle_no }) => {
                                return (
                                  <>   
                                    <option key={vehicle_id} value={vehicle_id}>
                                      {vehicle_no}
                                    </option>                                                                 
                                  </>
                                )
                              })}
                            </CFormSelect>

                          </CCol>

                          <CCol md={3}>
                            <CFormLabel htmlFor="vehicleDivision">
                              Division
                            </CFormLabel>
                            <CFormInput 
                              size="sm"  
                              value={vehicleDivisionFinder(otherDivisionVehicleValue)} 
                              readOnly={true}
                            />
                          </CCol> 

                          <CCol md={3}>
                            <CFormLabel htmlFor="vehiclePlant">
                              Plant
                            </CFormLabel>
                            <CFormInput 
                              size="sm"  
                              value={vehiclePlantFinder(otherDivisionVehicleValue)} 
                              readOnly={true}
                            />
                          </CCol> 

                          <CCol md={3}>
                            <CFormLabel htmlFor="vehicleVariety">
                              Vehicle Variety
                            </CFormLabel>
                            <CFormInput 
                              size="sm"  
                              value={vehicleVarietyFinder(otherDivisionVehicleValue)} 
                              readOnly={true}
                            />
                          </CCol> 

                          <CCol md={3}>
                            <CFormLabel htmlFor="vehicleModel">
                              Vehicle Model
                            </CFormLabel>
                            <CFormInput 
                              size="sm"  
                              value={vehicleModelFinder(otherDivisionVehicleValue)} 
                              readOnly={true}
                            />
                          </CCol> 

                          <CCol md={3}>
                            <CFormLabel htmlFor="vehicleFuelType">
                              Fuel Type
                            </CFormLabel>
                            <CFormInput 
                              size="sm"  
                              value={vehicleFuelTypeFinder(otherDivisionVehicleValue)} 
                              readOnly={true}
                            />
                          </CCol> 

                          <CCol md={3}>
                            <CFormLabel htmlFor="vehicleFuelTankCapacity">
                              Fuel Tank Capacity
                            </CFormLabel>
                            <CFormInput 
                              size="sm"  
                              value={vehicleFuelTankCapacityFinder(otherDivisionVehicleValue)} 
                              readOnly={true}
                            />
                          </CCol> 

                          <CCol md={3}>
                            <CFormLabel htmlFor="vehicleUser">
                              Vehicle User
                            </CFormLabel>
                            <CFormInput 
                              size="sm"  
                              value={vehicleUserFinder(otherDivisionVehicleValue)} 
                              // value={values.vehicle_user_name} 
                              readOnly={true}
                            />
                          </CCol> 
                        </>)}

                        {!(dieselForValue == 1 || dieselForValue == 29) && ( <>
                          <CCol md={3}>
                            <CFormLabel htmlFor="vType">
                              Division<REQ />{' '}
                              {errors.vehicle_division && (
                                <span className="small text-danger">{errors.vehicle_division}</span>
                              )}
                            </CFormLabel>
                            <CFormSelect
                              size="sm"
                              name="vehicle_division"
                              onChange={handleChange}
                              onFocus={onFocus}
                              value={values.vehicle_division}
                              className={`mb-1 ${errors.vehicle_division && 'is-invalid'}`}
                              aria-label="Small select example"
                              id="vType"
                            >
                              <option value="0">Select ...</option>
                              {divisionData.map(({ division_id, division_name, short_name }) => {
                                
                                  return (
                                    <>
                                      <option key={division_id} value={division_id}>
                                        {`${short_name} - ${division_name}`}
                                      </option>
                                    </>
                                  )
                                  
                              })}
                            </CFormSelect>
                          </CCol>

                          <CCol md={3}>
                            <CFormLabel htmlFor="vType">
                              Plant<REQ />{' '}
                              {errors.vehicle_plant && (
                                <span className="small text-danger">{errors.vehicle_plant}</span>
                              )}
                            </CFormLabel>
                            <CFormSelect
                              size="sm"
                              name="vehicle_plant"
                              onChange={handleChange}
                              onFocus={onFocus}
                              value={values.vehicle_plant}
                              className={`mb-1 ${errors.vehicle_plant && 'is-invalid'}`}
                              aria-label="Small select example"
                              id="vType"
                            >
                              <option value="0">Select ...</option>
                              {plantData.map(({ dropdown_list_id, dropdown_list_name, short_name }) => {
                                
                                  return (
                                    <>
                                      <option key={dropdown_list_id} value={dropdown_list_id}>
                                        {`${short_name} - ${dropdown_list_name}`}
                                      </option>
                                    </>
                                  )
                                  
                              })}
                            </CFormSelect>
                          </CCol>

                          <CCol md={3}>
                            <CFormLabel htmlFor="user_name">
                              Receiver Name<REQ />{' '}
                              {errors.user_name && (
                                <span className="small text-danger">{errors.user_name}</span>
                              )}
                            </CFormLabel>
                            <CFormInput
                              name="user_name"
                              size="sm"
                              maxLength={20}
                              id="user_name"
                              onChange={handleChange}
                              value={values.user_name}
                              onFocus={onFocus}
                              onBlur={onBlur}
                              placeholder=""
                            />
                          </CCol>

                          <CCol md={3}>
                            <CFormLabel htmlFor="contact_no">
                              Contact Number<REQ />{' '}
                              {errors.contact_no && (
                                <span className="small text-danger">{errors.contact_no}</span>
                              )}
                            </CFormLabel>
                            <CFormInput
                              name="contact_no"
                              size="sm"
                              maxLength={10}
                              id="contact_no"
                              onChange={handleChange}
                              value={values.contact_no}
                              onFocus={onFocus}
                              onBlur={onBlur}
                              placeholder=""
                            />
                          </CCol>

                          

                          <CCol md={3}>
                            <CFormLabel htmlFor="vGrp">
                              Vehicle Fuel Type<REQ />{' '}
                              {errors.vehicle_fueltype && (
                                <span className="small text-danger">{errors.vehicle_fueltype}</span>
                              )}
                            </CFormLabel>
          
                            <CFormSelect
                              size="sm"
                              name="vehicle_fueltype"
                              onChange={handleChange}
                              onFocus={onFocus}
                              value={values.vehicle_fueltype}
                              className={`mb-1 ${errors.vehicle_fueltype && 'is-invalid'}`}
                              aria-label="Small select example"
                              id="vCap"
                            >
                              <option value="0">Select ...</option>
                              {vehicleFuelTypeData.map(({ dropdown_list_id, dropdown_list_name }) => {
                                return (
                                  <>
                                    <option key={dropdown_list_id} value={dropdown_list_id}>
                                      {dropdown_list_name}
                                    </option>
                                  </>
                                )
                              })}
                            </CFormSelect>
                          </CCol>

                          <CCol md={3}>
                            <CFormLabel htmlFor="di_quantity">
                              Quantity<REQ />{' '}
                              {errors.di_quantity && (
                                <span className="small text-danger">{errors.di_quantity}</span>
                              )}
                            </CFormLabel>
                            <CFormInput
                              name="di_quantity"
                              size="sm"
                              maxLength={20}
                              id="di_quantity"
                              onChange={handleChange}
                              value={values.di_quantity}
                              onFocus={onFocus}
                              onBlur={onBlur}
                              placeholder=""
                            />
                          </CCol>

                          <CCol md={3}>
                            <CFormLabel htmlFor="vehicleDivision">
                              SAP Fuel Rate Per Ltr.
                            </CFormLabel>
                            <CFormInput 
                              size="sm"  
                              // value={sapFuelRateFinder(values.vehicle_division)} 
                              value={sapDieselRate} 
                              readOnly={true}
                            />
                          </CCol> 

                          <CCol md={3}>
                            <CFormLabel htmlFor="vehicleDivision">
                              Total Amount
                            </CFormLabel>
                            <CFormInput 
                              size="sm"  
                              value={dieselTotalAmountFinder()} 
                              readOnly={true}
                            />
                          </CCol>

                          <CCol md={3}>
                            <CFormLabel htmlFor="carry_vehicle_no">
                              Carry Vehicle No.<REQ />{' '}
                              {errors.carry_vehicle_no && (
                                <span className="small text-danger">{errors.carry_vehicle_no}</span>
                              )}
                            </CFormLabel>
                            <CFormInput
                              name="carry_vehicle_no"
                              size="sm"
                              maxLength={20}
                              id="carry_vehicle_no"
                              onChange={handleChange}
                              value={values.carry_vehicle_no}
                              onFocus={onFocus}
                              onBlur={onBlur}
                              placeholder=""
                            />
                          </CCol>
                        </>)}

                        <CCol md={3}>
                          <CFormLabel htmlFor="customerAddress">
                            Remarks 
                          </CFormLabel>
                          <CFormInput
                            name="remarks"
                            size="sm"
                            maxLength={200}
                            id="remarks"
                            onChange={handleChange}
                            value={values.remarks}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            placeholder=""
                          />
                        </CCol>                       

                      </CRow>

                      <CRow className="mt-4">
                        <CCol>
                          <Link to="/DieselIntentHome">
                            <CButton
                              md={9}
                              size="s-lg"
                              color="primary"
                              disabled=""
                              className="text-white"
                              type="submit"
                            >
                              Previous
                            </CButton>
                          </Link>
                        </CCol>
                        <CCol
                          className="pull-right"
                          xs={12}
                          sm={12}
                          md={3}
                          style={{ display: 'flex', justifyContent: 'flex-end' }}
                        >
                          <CButton
                            size="s-lg"
                            color="warning"
                            className="mx-1 px-2 text-white"
                            // disabled={submitBtn}
                            onClick={(e) => {
                              e.preventDefault()
                              addNewCustomer()
                            }}

                          >
                            SUBMIT
                          </CButton>
                          {/* <Link to={'/DieselIntentHome'}>
                            <CButton
                              size="s-lg"
                              color="warning"
                              className="mx-1 px-2 text-white"
                              type="button"
                            >
                              BACK
                            </CButton>
                          </Link> */}
                        </CCol>
                      </CRow>
                    </CForm>
                  </CTabPane>
                </CTabContent>
                {/*Camera Image Copy model*/}
                  <CModal
                    visible={camEnable}
                    backdrop="static"
                    onClose={() => {
                      setCamEnable(false)
                      setImgSrc("")
                    }}
                  >
                    <CModalHeader>
                      <CModalTitle>Customer Photo</CModalTitle>
                    </CModalHeader>
                    <CModalBody>

                      {!imgSrc && (
                        <>
                          <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/png"
                            height={200}
                          />
                          <p className='mt-2'>
                            <CButton
                              size="sm"
                              color="warning"
                              className="mx-1 px-2 text-white"
                              type="button"
                              onClick={() => {
                                capture()
                              }}
                            >
                              Accept
                            </CButton>
                          </p>
                        </>
                      )}
                      {imgSrc && (

                        <>
                          <img height={200}
                            src={imgSrc}
                          />
                          <p className='mt-2'>
                            <CButton
                              size="sm"
                              color="warning"
                              className="mx-1 px-2 text-white"
                              type="button"
                              onClick={() => {
                                setImgSrc("")
                              }}
                            >
                              Delete
                            </CButton>
                          </p>
                        </>
                      )}

                    </CModalBody>
                    <CModalFooter>
                      {imgSrc && (
                        <CButton
                          className="m-2"
                          color="warning"
                          onClick={() => {
                            setCamEnable(false)
                            valueAppendToImage(imgSrc)
                          }}
                        >
                          Confirm
                        </CButton>
                      )}
                      <CButton
                        color="secondary"
                        onClick={() => {
                          setCamEnable(false)
                          setImgSrc("")
                        }}
                      >
                        Cancel
                      </CButton>
                    </CModalFooter>
                  </CModal>
                {/*Camera Image Copy model*/}
              </CCard>              
            </>) : (<AccessDeniedComponent />
          )}
        </>
      )}
    </>
  )
}

export default OtherDICreation
