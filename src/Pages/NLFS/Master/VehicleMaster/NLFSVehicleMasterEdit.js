/* eslint-disable prettier/prettier */
import {
  CButton,
  CCard,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CNav,
  CNavItem,
  CNavLink,
  CRow,
  CTabContent,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTabPane,
  CFormFloating,
  CFormCheck,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CAlert,
  CFormTextarea,
} from '@coreui/react'
import { React, useEffect, useState } from 'react'
import useForm from 'src/Hooks/useForm.js'  
import VehicleCapacityService from 'src/Service/SmallMaster/Vehicles/VehicleCapacityService' 
import VehicleMasterService from 'src/Service/Master/VehicleMasterService'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import 'react-toastify/dist/ReactToastify.css'
import VehicleVarietyService from 'src/Service/SmallMaster/Vehicles/VehicleVarietyService' 
import NLFSVehicleMasterValidation from 'src/Utils/Master/NLFSVehicleMasterValidation'
import NLFSDivisionApi from 'src/Service/NLFS/Master/NLFSDivisionApi'
import DropdownListApi from 'src/Service/NLFS/Master/DropdownListApi'
import NLFSVehicleMasterApi from 'src/Service/NLFS/Master/NLFSVehicleMasterApi'
import { getCurrentDateTime } from 'src/Pages/Depo/CommonMethods/CommonMethods'

const NLFSVehicleMaster = () => {
  const { id } = useParams()
  /*================== User Id & Location Fetch ======================*/
    const user_info_json = localStorage.getItem('user_info')
    const user_info = JSON.parse(user_info_json)
    const user_locations = []
    // const navigation = useNavigate()
  
    console.log(user_info)
  
    /* Get User Locations From Local Storage */
    user_info.location_info.map((data, index) => {
      user_locations.push(data.id)
    })
  
    /* Get User Id From Local Storage */
    const user_id = user_info.user_id
    const user_emp_id = user_info.empid

  const formValues = { 
    vehicle_division: '',
    vehicle_plant: '',
    vechile_number: '',
    user_name: '',
    user_empcode: '', 
    vehicle_capacity: '', 
    vehicle_variety: '',
    vehicle_model: '',
    vehicle_fueltype: '',
    vehicle_fueltankcapacity: ''
  }

  const [vehicleDivision, setVehicleDivision] = useState([])
  const [vehiclePlant, setVehiclePlant] = useState([])
  const [vehicleMasterData, setVehicleMasterData] = useState([])
  const [vehicleCapacity, setVehicleCapacity] = useState([])
  const [vehicleVariety, setVehicleVariety] = useState([]) 
  const [vehicleRemarks, setVehicleRemarks] = useState([])
  const [vehicleModel, setVehicleModel] = useState([])
  const [vehicleFuelType, setVehicleFuelType] = useState([])
  const [vehicleFuelTankCapacity, setVehicleFuelTankCapacity] = useState([]) 
  const REQ = () => <span className="text-danger"> * </span>
  const [fetch, setFetch] = useState(false)
  const navigation = useNavigate()

  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur } = useForm(
    addNewVehicle,
    NLFSVehicleMasterValidation,
    formValues
  )

  const remarksHandleChange = (event) => {

    let result = event.target.value.toUpperCase()
    setVehicleRemarks(result.trimStart())

  }

  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})

  const vehicleAlreadyExistInVehicleMaster = (vno) => {
    let condition = 0
    console.log(vehicleMasterData,'vehicleMasterData')
    console.log(vno,'vehicleMasterData-vno')
    vehicleMasterData.map((vb,lb)=>{
      if(vb.vehicle_number == vno){
        condition = 1
      }
    })

    return condition
  }

  const is_car_check = (code) => {
    let temp = 0
    let vehicle_variety_data = {}
    vehicleVariety.map((kk,vv)=>{
      if(kk.id == code){
        vehicle_variety_data = kk
      }
    })
    console.log(vehicle_variety_data,'vehicle_variety_data')
    if(vehicle_variety_data.vehicle_variety == 'CAR'){
      temp = 1
    }
    return temp
  }

  function addNewVehicle() {
    const formData = new FormData()
     
    if(values.vehicle_number != singleVehicle.vehicle_no &&  vehicleAlreadyExistInVehicleMaster(values.vehicle_number) == 1){
      toast.warning('Updated Vehicle Number was already exists in Vehicle Master..!')
      return false
    } 

    console.log(values,'valuess')
    // return false
    formData.append('_method', 'PUT')
    formData.append('division_id', values.vehicle_division)
    formData.append('plant_id', values.vehicle_plant)
    formData.append('vehicle_no', values.vechile_number)
    formData.append('vehicle_user_name', values.user_name)
    formData.append('vehicle_user_emp_code', values.user_empcode)
    formData.append('vehicle_capacity_id', values.vehicle_capacity)
    formData.append('vehicle_variety_id', values.vehicle_variety)
    formData.append('is_car', is_car_check(values.vehicle_variety))
    formData.append('vehicle_model_type_id', values.vehicle_model)
    formData.append('fuel_type_id', values.vehicle_fueltype) 
    formData.append('tank_capacity_type_id', values.vehicle_fueltankcapacity)
    formData.append('remarks', vehicleRemarks) 
    formData.append('updated_by', user_id)

    let current_time = getCurrentDateTime()

    let old_info = []
    try {
      old_info = singleVehicle.log_info ? JSON.parse(singleVehicle.log_info) : []
    } catch (error) {
      old_info = []
    }

    let division_name = vehicleDivision.find(d => d.division_id == values.vehicle_division)?.short_name || ''
    let plant_name = vehiclePlant.find(p => p.dropdown_list_id == values.vehicle_plant)?.dropdown_list_name || ''
    let capacity_obj = vehicleCapacity.find(c => c.id == values.vehicle_capacity)
    let capacity_name = capacity_obj ? capacity_obj.capacity + '-TON' : ''
    let variety_name = vehicleVariety.find(v => v.id == values.vehicle_variety)?.vehicle_variety || ''
    let model_name = vehicleModel.find(m => m.dropdown_list_id == values.vehicle_model)?.dropdown_list_name || ''
    let fuel_type_name = vehicleFuelType.find(f => f.dropdown_list_id == values.vehicle_fueltype)?.dropdown_list_name || ''
    let fuel_tank_capacity_name = vehicleFuelTankCapacity.find(t => t.dropdown_list_id == values.vehicle_fueltankcapacity)?.dropdown_list_name || ''

    let current_info = [{
      division_id: values.vehicle_division,
      division_name: division_name,
      plant_id: values.vehicle_plant,
      plant_name: plant_name,
      vehicle_no: values.vechile_number,
      vehicle_user_name: values.user_name,
      vehicle_user_emp_code: values.user_empcode,
      vehicle_capacity_id: values.vehicle_capacity,
      vehicle_capacity_name: capacity_name,
      vehicle_variety_id: values.vehicle_variety,
      vehicle_variety_name: variety_name,
      vehicle_model_type_id: values.vehicle_model,
      vehicle_model_name: model_name,
      fuel_type_id: values.vehicle_fueltype,
      fuel_type_name: fuel_type_name,
      tank_capacity_type_id: values.vehicle_fueltankcapacity,
      vehicle_fuel_tank_capacity_name: fuel_tank_capacity_name,
      remarks: vehicleRemarks,
      type: 2,
      user: user_info.emp_name || user_id,
      time: current_time,
    }]

    let complete_info = [...old_info, ...current_info]

    formData.append('log_info', JSON.stringify(complete_info))

    setFetch(false)
    NLFSVehicleMasterApi.updateNLFSVehicles(id, formData).then((res) => { 
      setFetch(true)
      if (res.status == 200) {
        toast.success('Vehicle Updated Successfully!')
        
        setTimeout(() => {
          navigation('/NLFSVehicleMasterTable')
        }, 1000)
      }
    })
    .catch((error) => {  
      setFetch(true)    
      var object = error.response.data.errors 
      var output = ''
      for (var property in object) {
        output += '*' + object[property] + '\n'
      } 
      setError(output)
      setErrorModal(true)
    })
  }

  const [singleVehicle, setSingleVehicle] = useState('')

  useEffect(() => {

    //section to fetch single vehicle info
    NLFSVehicleMasterApi.getNLFSVehiclesById(id).then((res) => {
      setFetch(true)  
      let viewdata = res.data.data
      console.log(viewdata,'getNLFSVehiclesById') 
      values.vechile_number = res.data.data.vehicle_no
      values.vehicle_division = res.data.data.division_id
      values.vehicle_plant = res.data.data.plant_id
      values.user_name = res.data.data.vehicle_user_name
      values.user_empcode = res.data.data.vehicle_user_emp_code
      values.vehicle_capacity = res.data.data.vehicle_capacity_id
      values.vehicle_variety = res.data.data.vehicle_variety_id
      values.vehicle_model = res.data.data.vehicle_model_type_id
      values.vehicle_fueltype = res.data.data.fuel_type_id
      values.vehicle_fueltankcapacity = res.data.data.tank_capacity_type_id
      setVehicleRemarks(res.data.data.remarks)
      setSingleVehicle(res.data.data)
    })
    
    //section for getting vehicle division from database 
      NLFSDivisionApi.getActiveDivisions().then((res) => {
      // setFetch(true)
      setVehicleDivision(res.data.data)
    })

    //section for getting vehicle Master from database
    VehicleMasterService.getVehicles().then((res) => { 
      // setFetch(true)
      setVehicleMasterData(res.data.data)
    })

    //section for getting vehicle capacity from database
    VehicleCapacityService.getVehicleCapacity().then((res) => {
      setVehicleCapacity(res.data.data)
    })

    //section for getting vehicle variety from database
    VehicleVarietyService.getVehicleVariety().then((res) => {
      setVehicleVariety(res.data.data)
    })

    /* section for getting vehicle Model from database */
    DropdownListApi.visibleDropdownsListByDropdown(4).then((response) => {
      console.log(response.data.data,'setVehicleModel')
      setVehicleModel(response.data.data)
    })

    /* section for getting vehicle Fuel Type from database */
    DropdownListApi.visibleDropdownsListByDropdown(2).then((response) => {
      console.log(response.data.data,'setVehicleFuelType')
      setVehicleFuelType(response.data.data)
    })

    /* section for getting vehicle Fuel Tank Capacity from database */
    DropdownListApi.visibleDropdownsListByDropdown(3).then((response) => {
      console.log(response.data.data,'setVehicleFuelTankCapacity')
      setVehicleFuelTankCapacity(response.data.data)
    })

    /* section for getting vehicle Plant from database */
    DropdownListApi.visibleDropdownsListByDropdown(5).then((response) => {
      console.log(response.data.data,'setVehiclePlants')
      setVehiclePlant(response.data.data)
    })

  }, [id])

  // console.log(values);

  return (
    <>
    {!fetch && <Loader />}
    {fetch && (
      <CCard>
        <CTabContent>
          <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={true}>
            <CForm className="row g-3 m-2 p-1" onSubmit={handleSubmit}>
              <CRow className="mb-md-1">                

                <CCol md={3}>
                  <CFormLabel htmlFor="vNum">
                    Vehicle Number<REQ />{' '}
                    {errors.vechile_number && (
                      <span className="small text-danger">{errors.vechile_number}</span>
                    )}
                  </CFormLabel>
                  <CFormInput
                    name="vechile_number"
                    size="sm"
                    maxLength={10}
                    id="vNum"
                    onChange={handleChange}
                    value={values.vechile_number}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    placeholder=""
                  />
                </CCol>                

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
                    {vehicleDivision.map(({ division_id, division_name, division_code }) => {
                      
                        return (
                          <>
                            <option key={division_id} value={division_id}>
                              {`${division_name} - (${division_code})`}
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
                    {vehiclePlant.map(({ dropdown_list_id, dropdown_list_name, short_name }) => {
                      
                        return (
                          <>
                            <option key={dropdown_list_id} value={dropdown_list_id}>
                              {`${dropdown_list_name} - (${short_name})`}
                            </option>
                          </>
                        )
                        
                    })}
                  </CFormSelect>
                </CCol>

                <CCol md={3}>
                  <CFormLabel htmlFor="vCap">
                    Vehicle Capacity (TON)<REQ />{' '}
                    {errors.vehicle_capacity && (
                      <span className="small text-danger">{errors.vehicle_capacity}</span>
                    )}
                  </CFormLabel>

                  <CFormSelect
                    size="sm"
                    name="vehicle_capacity"
                    onChange={handleChange}
                    onFocus={onFocus}
                    value={values.vehicle_capacity}
                    className={`mb-1 ${errors.vehicle_capacity && 'is-invalid'}`}
                    aria-label="Small select example"
                    id="vCap"
                  >
                    <option value="0">Select ...</option>
                    {vehicleCapacity.map(({ id, capacity }) => {
                      return (
                        <>
                          <option key={id} value={id}>
                            {capacity}
                          </option>
                        </>
                      )
                    })}
                  </CFormSelect>
                </CCol>

                <CCol md={3}>
                  <CFormLabel htmlFor="vVty">
                    Vehicle Variety<REQ />{' '}
                    {errors.vehicle_variety && (
                      <span className="small text-danger">{errors.vehicle_variety}</span>
                    )}
                  </CFormLabel>

                  <CFormSelect
                    size="sm"
                    name="vehicle_variety"
                    onChange={handleChange}
                    onFocus={onFocus}
                    value={values.vehicle_variety}
                    className={`mb-1 ${errors.vehicle_variety && 'is-invalid'}`}
                    aria-label="Small select example"
                    id="vCap"
                  >
                    <option value="0">Select ...</option>
                    {vehicleVariety.map(({ id, vehicle_variety }) => {
                      return (
                        <>
                          <option key={id} value={id}>
                            {vehicle_variety}
                          </option>
                        </>
                      )
                    })}
                  </CFormSelect>
                </CCol>

                <CCol md={3}>
                  <CFormLabel htmlFor="vGrp">
                    Vehicle Model<REQ />{' '}
                    {errors.vehicle_model && (
                      <span className="small text-danger">{errors.vehicle_model}</span>
                    )}
                  </CFormLabel>

                  <CFormSelect
                    size="sm"
                    name="vehicle_model"
                    onChange={handleChange}
                    onFocus={onFocus}
                    value={values.vehicle_model}
                    className={`mb-1 ${errors.vehicle_model && 'is-invalid'}`}
                    aria-label="Small select example"
                    id="vCap"
                  >
                    <option value="0">Select ...</option>
                    {vehicleModel.map(({ dropdown_list_id, dropdown_list_name }) => {
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
                    {vehicleFuelType.map(({ dropdown_list_id, dropdown_list_name }) => {
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
                  <CFormLabel htmlFor="vGrp">
                    Vehicle Fuel Tank Capacity<REQ />{' '}
                    {errors.vehicle_fueltankcapacity && (
                      <span className="small text-danger">{errors.vehicle_fueltankcapacity}</span>
                    )}
                  </CFormLabel>

                  <CFormSelect
                    size="sm"
                    name="vehicle_fueltankcapacity"
                    onChange={handleChange}
                    onFocus={onFocus}
                    value={values.vehicle_fueltankcapacity}
                    className={`mb-1 ${errors.vehicle_fueltankcapacity && 'is-invalid'}`}
                    aria-label="Small select example"
                    id="vCap"
                  >
                    <option value="0">Select ...</option>
                    {vehicleFuelTankCapacity.map(({ dropdown_list_id, dropdown_list_name }) => {
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
                  <CFormLabel htmlFor="user_name">
                    User Name<REQ />{' '}
                    {errors.user_name && (
                      <span className="small text-danger">{errors.user_name}</span>
                    )}
                  </CFormLabel>
                  <CFormInput
                    name="user_name"
                    size="sm"
                    maxLength={10}
                    id="user_name"
                    onChange={handleChange}
                    value={values.user_name}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    placeholder=""
                  />
                </CCol>

                <CCol md={3}>
                  <CFormLabel htmlFor="user_empcode">
                    User Employee Code 
                  </CFormLabel>
                  <CFormInput
                    name="user_empcode"
                    size="sm"
                    maxLength={30}
                    id="user_empcode"
                    onChange={handleChange}
                    value={values.user_empcode}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    placeholder=""
                  />
                </CCol>
                
                <CCol md={3}>
                  <CFormLabel htmlFor="vehicle_remarks">
                    Remarks
                  </CFormLabel>
                  <CFormTextarea
                    name="vehicle_remarks"
                    id="vehicle_remarks"
                    rows="1"
                    onChange={(e) => {remarksHandleChange(e)}}
                    value={vehicleRemarks}
                  ></CFormTextarea> 
                </CCol>
                
              </CRow>
              <CRow className="mb-md-1">
                <CCol
                  className="pull-right"
                  xs={12}
                  sm={12}
                  md={12}
                  style={{ display: 'flex', justifyContent: 'flex-end' }}
                >
                  <CButton
                    size="s-lg"
                    color="warning"
                    className="mx-1 px-2 text-white"
                    type="submit"
                    // disabled={enableSubmit}
                  >
                    UPDATE
                  </CButton>
                  <Link to={'/NLFSVehicleMasterTable'}>
                    <CButton
                      size="s-lg"
                      color="warning"
                      className="mx-1 px-2 text-white"
                      type="button"
                    >
                      BACK
                    </CButton>
                  </Link>
                </CCol>
              </CRow>
            </CForm>
          </CTabPane>
        </CTabContent>
        {/* Error Modal Section Start */}
          <CModal visible={errorModal} onClose={() => setErrorModal(false)}>
            <CModalHeader>
              <CModalTitle className="h4">Error</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CRow>
                <CCol>
                  {error && (
                    <CAlert color="danger" data-aos="fade-down">
                      {error}
                    </CAlert>
                  )}
                </CCol>
              </CRow>
            </CModalBody>
            <CModalFooter>
              <CButton onClick={() => setErrorModal(false)} color="primary">
                Close
              </CButton>
            </CModalFooter>
          </CModal>
        {/* Error Modal Section End */}
      </CCard>
    )}
    </>
  )
}

export default NLFSVehicleMaster
