import {
  CButton,
  CCard,
  CCol,
  CContainer,
  CCardImage,
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
  CFormTextarea,
  CButtonGroup,
  CAlert,
} from '@coreui/react'
import { React, useEffect, useState } from 'react'
import useForm from 'src/Hooks/useForm.js'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Loader from 'src/components/Loader'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import VehicleInspectionValidation from 'src/Utils/TransactionPages/VehicleInspection/VehicleInspectionValidation'
import DepoTSCreationService from 'src/Service/Depo/TSCreation/DepoTSCreationService'
import RakeTripsheetCreationService from 'src/Service/RakeMovement/RakeTripsheetCreation/RakeTripsheetCreationService'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import RakeVendorMasterService from 'src/Service/RakeMovement/RakeMaster/RakeVendorMasterService'
import RakeTripsheetSapService from 'src/Service/SAP/RakeTripsheetSapService'
import Swal from 'sweetalert2'

const TripsheetEdit = () => {
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.RakeModule.Rake_Tripsheet_Edit

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

  const formValues = {
   //
  }

  const [vname,setVname] = useState('')
  const [dname,setDname] = useState('')
  const [dmnumber,setDmnumber] = useState('')
  const [vnumber,setVnumber] = useState('')

  const [vnameError,setVnameError] = useState('')
  const [dnameError,setDnameError] = useState('')
  const [dmnumberError,setDmnumberError] = useState('')
  const [vnumberError,setVnumberError] = useState('')

  const [updateEnable,setUpdteEnable] = useState(false)

  const [rakeVendorsData, setRakeVendorsData] = useState([])

  const [rakePlantData, setRakePlantData] = useState([])

  useEffect(() => {

    if(vnameError||dnameError||dmnumberError||vnumberError){
      setUpdteEnable(true)
    } else {
      setUpdteEnable(false)
    }

  },[vnameError,dnameError,dmnumberError,vnumberError])

  useEffect(() => {

    /* section for getting Rake Vendors from database */
    RakeVendorMasterService.getActiveRakeVendors().then((response) => {
      let viewData = response.data.data
      console.log(viewData,'Rake Vendor Data')
      setRakeVendorsData(viewData)
    })

  }, [])

  const [rakeEvehiclesData, setRakeEvehiclesData] = useState([])

  const vnameFinder = (vcode) => {
    let vname = '--'
    rakeVendorsData.map((datann1, indexnn1) => {
      if(datann1.v_code == vcode){
        vname = datann1.v_name
      }
    })
    return vname
  }

  const vIDFinder = (vcode) => {
    let vID = '--'
    rakeVendorsData.map((datann1, indexnn1) => {
      if(datann1.v_code == vcode){
        vID = datann1.v_id
      }
    })
    return vID
  }

  const locationFinder = (plant) => {
    let n_loc = '--'
    rakePlantData.map((datann, indexnn) => {
      if(datann.plant_code == plant){
        n_loc = datann.plant_name
      }
    })
    return n_loc
  }

  useEffect(() => {

      /* section for getting Rake Plant Lists from database */
      DefinitionsListApi.visibleDefinitionsListByDefinition(21).then((response) => {
      setFetch(true)
      let viewData = response.data.data
      console.log(viewData,'Rake Plant Data')
      let rowDataList_location = []
      viewData.map((data, index) => {
        rowDataList_location.push({
          sno: index + 1,
          plant_name: data.definition_list_name,
          plant_code: data.definition_list_code,
        })
      })

      setRakePlantData(rowDataList_location)
    })

    /* section for getting Rake Exception Vehicles from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(22).then((response) => {

      let viewData = response.data.data
      console.log(viewData,'Rake Exception Vehicles Data')
      let rowDataList_vehicles = []
      viewData.map((data, index) => {
        rowDataList_vehicles.push(data.definition_list_name)
      })
      console.log(rowDataList_vehicles,'rowDataList_vehicles')
      setRakeEvehiclesData(rowDataList_vehicles)
    })

  }, [])

  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur, isTouched } =
    useForm(inspectVehicle, VehicleInspectionValidation, formValues)

  const navigation = useNavigate()
  const REQ = () => <span className="text-danger"> * </span>

  const TripsheetCreationCancel = () => {
    console.log(remarks)
    if (remarks && remarks.trim()) {
      setRejectConfirm(true)
    } else {
      toast.warning('You should give the proper reason for cancel via remarks... ')
      values.remarks = ''
      setRemarks('')
      return false
    }
  }

  function inspectVehicle() {}

  const [rejectConfirm, setRejectConfirm] = useState(false)
  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})
  const [currentVehicleInfo, setCurrentVehicleInfo] = useState({})
  const [currentTripInfo, setCurrentTripInfo] = useState({})
  const [fitForLoad, setFitForLoad] = useState('')
  const [fetch, setFetch] = useState(false)

  const { id } = useParams()

  useEffect(() => {
    RakeTripsheetCreationService.getTripeInfoById(id).then((res) => {

      let tdata = res.data.data
        console.log(tdata,'getTripeInfoById')
        isTouched.remarks = true
        setVname(tdata.vendor_code)
        setVnumber(tdata.vehicle_no)
        setDmnumber(tdata.driver_phone_number)
        setDname(tdata.driver_name)
        setCurrentTripInfo(tdata)
        setFetch(true)
    })
  }, [id])

  useEffect(() => {
    var touchLength = Object.keys(isTouched).length

    if (touchLength == Object.keys(formValues).length) {
      if (Object.keys(errors).length == 0) {
        setFitForLoad('YES')
      } else {
        setFitForLoad('NO')
      }
    }
  }, [values, errors])

  const [remarks, setRemarks] = useState('');
    const handleChangenew = event => {
    const result = event.target.value.toUpperCase();

    setRemarks(result);

  };

  const checkRakeVehicle = (v_no) => {
    let v_no_valid = 0
    rakeEvehiclesData.map((datan, indexn)=>{
      if(datan == v_no){
        v_no_valid = 1
      }
    })

    if(v_no_valid == 1){
      return true
    } else {
      return false
    }
  }

  const changeTripData = (event, child_property_name) => {

    let getData2 = event.target.value

    /* Vehicle Number Validation */
    if(child_property_name == 'vehicle_number'){
      if(getData2.trim() == ''){
        setVnumberError('Required')
        setVnumber('')
      } else {
        if (!/^[a-zA-Z0-9]{1,10}$/.test(getData2)) {
          setVnumberError('Alpha-Numeric only allowed')
        } else if(getData2.length < 7){
          setVnumberError('Min.Length : 7')
        } else if(!checkRakeVehicle(getData2) && !(getData2.match(/^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/))){
          setVnumberError('Invalid Vehicle Format')
        } else{
          setVnumberError('')
        }
        setVnumber(getData2)
      }
    }

    /* Driver Name Validation */
    if(child_property_name == 'driver_name'){
      if(getData2.trimStart() == ''){
        setDnameError('Required')
        setDname('')
      } else {
        if (!/^[a-zA-Z ]{2,30}$/.test(getData2)) {
          setDnameError('Alphabets only allowed')
        } else {
          setDnameError('')
        }
        setDname(getData2)
      }
    }

    /* Driver Number Validation */
    if(child_property_name == 'driver_number'){
      if(getData2.trim() == ''){
        setDmnumberError('Required')
        setDmnumber('')
      } else {
        if (!/^[\d]{10}$/.test(getData2)) {
          setDmnumberError('Only have 10 Digit Numeric')
        } else {
          setDmnumberError('')
        }
        setDmnumber(getData2)
      }
    }

    /* Vendor Name Validation */
    if(child_property_name == 'vendor_code'){
      if(getData2 == ''){
        setVnameError('Required')
      } else {
        setVnameError('')
      }
      setVname(getData2)
    }

  }

  const updateTripsheet = (type) => {

    var TsSendData = {}
    var TsSendData_seq = []

    /* Non Editable Fields */
    TsSendData.TRIP_SHEET = currentTripInfo.rake_tripsheet_no
    TsSendData.FNR_NO = currentTripInfo.fnr_no
    TsSendData.SAP_FLAG = type
    TsSendData.RAKE_PLANT = currentTripInfo.rake_plant_code

    /* Editable Fields */
    TsSendData.VENDOR_NAME = vnameFinder(vname)
    TsSendData.DRIVER_NAME = dname
    TsSendData.DRIVER_PH_NO = dmnumber
    TsSendData.VEHICLE_NO = vnumber
    TsSendData.VENDOR_CODE = vname

    TsSendData_seq[0] = TsSendData

    if(user_info.is_admin == 1){
      console.log(currentTripInfo,'currentTripInfo')
      console.log('TRIP_SHEET', currentTripInfo.rake_tripsheet_no)
      console.log('FNR_NO', currentTripInfo.fnr_no)
      console.log('RAKE_PLANT', currentTripInfo.rake_plant_code)
      console.log('SAP_FLAG', type)
      console.log('VEHICLE_NO', vnumber)
      console.log('VENDOR_NAME', vnameFinder(vname))
      console.log('VENDOR_CODE', vname)
      console.log('DRIVER_NAME', dname)
      console.log('DRIVER_PH_NO', dmnumber)
      console.log(TsSendData_seq,'TsSendData_seq')
    }

    setFetch(false)
    RakeTripsheetSapService.UpdateTSInfoToSAP(TsSendData_seq).then((response) => {

      console.log(response,'UpdateTSInfoToSAP-response')

      let sap_resp_message = response.data[0].MESSAGE
      let sap_resp_tripsheet = response.data[0].TRIP_SHEET
      if (response.data[0].STATUS == '1') {

        let data = new FormData()
        data.append('sap_flag', type)
        data.append('trip_id', currentTripInfo.tripsheet_id)
        data.append('sap_tripsheet', sap_resp_tripsheet)
        data.append('sap_message', sap_resp_message)
        data.append('updated_by', user_id)
        data.append('vehicle_no', vnumber)
        data.append('vendor_id', vIDFinder(vname))
        data.append('vendor_code', vname)
        data.append('driver_name', dname)
        data.append('driver_mobile_no', dmnumber)
        RakeTripsheetCreationService.updateTripsheet(data).then((res) => {

          console.log(res,'updateTripsheet-response')

          if (res.status == 200) {
            setFetch(true)
            Swal.fire({
              title: 'Tripsheet Details Updated!',
              icon: "success",
              confirmButtonText: "OK",
            }).then(function () {
              navigation('/RakeTripsheetEditHome')
            })

          } else if(res.status == 201) {
            setFetch(true)
            Swal.fire({
              title: res.message,
              icon: "warning",
              confirmButtonText: "OK",
            }).then(function () {
              // window.location.reload(false)
            })

          }
        })
        .catch((errortemp) => {
          console.log(errortemp)
          setFetch(true)
          var object = errortemp.response.data.errors
          var output = ''
          for (var property in object) {
            output += '*' + object[property] + '\n'
          }
          setError(output)
          setErrorModal(true)
        })
      } else {
        setFetch(true)
        toast.warning('There is a Problem to update Tripsheet details in SAP. Kindly Contact Admin..!')
        return false
      }
    })
    .catch((error) => {
      setFetch(true)
      toast.warning(error)
    })

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
                    <CForm className="container p-3" onSubmit={handleSubmit}>
                      <CRow className="">
                        <CCol md={3}>
                          <CFormLabel htmlFor="tsno">Tripsheet No</CFormLabel>
                          <CFormInput
                            name="tsno"
                            size="sm"
                            id="tsno"
                            value={currentTripInfo.rake_tripsheet_no}
                            readOnly
                          />
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="tsdt">Tripsheet Creation Date & Time</CFormLabel>
                          <CFormInput
                            name="tsdt"
                            size="sm"
                            id="tsdt"
                            value={currentTripInfo.created_at_format}
                            readOnly
                          />
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="fnr_number">FNR Number</CFormLabel>
                          <CFormInput
                            name="fnr_number"
                            size="sm"
                            id="fnr_number"
                            value={currentTripInfo.fnr_no}
                            readOnly
                          />
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="vehice_number">Vehicle Number <REQ />{' '}</CFormLabel>
                          {vnumberError && (
                            <span className="small text-danger">{vnumberError}</span>
                          )}
                          <CFormInput
                            name="vehice_number"
                            size="sm"
                            id="vehice_number"
                            value={vnumber}
                            onChange={(e) => {
                              changeTripData(e, 'vehicle_number')
                            }}
                            maxLength={10}
                          />
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="driver_name">Driver Name <REQ />{' '}</CFormLabel>
                          {dnameError && (
                            <span className="small text-danger">{dnameError}</span>
                          )}

                          <CFormInput
                            name="driver_name"
                            size="sm"
                            id="driver_name"
                            value={dname}
                            maxLength={30}
                            onChange={(e) => {
                              changeTripData(e, 'driver_name')
                            }}
                          />
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="driver_number">Driver Mobile Number <REQ />{' '}</CFormLabel>
                          {dmnumberError && (
                            <span className="small text-danger">{dmnumberError}</span>
                          )}
                          <CFormInput
                            name="driver_number"
                            size="sm"
                            id="driver_number"
                            maxLength={10}
                            value={dmnumber}
                            onChange={(e) => {
                              changeTripData(e, 'driver_number')
                            }}
                          />
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="vendor_name">Vendor Name <REQ />{' '}</CFormLabel>
                          {vnameError && (
                            <span className="small text-danger">{vnameError}</span>
                          )}
                          <CFormSelect
                            size="sm"
                            name="vendor_code"
                            id="vendor_code"
                            onChange={(e) => {
                              changeTripData(e, 'vendor_code')
                            }}
                            value={vname}
                          >
                            <option value="">Select...</option>
                            {rakeVendorsData.map(({v_id, v_code, v_name }) => {
                              return (
                                <>
                                  <option key={v_id} value={v_code}>
                                    {v_name}
                                  </option>
                                </>
                              )
                            })}
                          </CFormSelect>
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="vendor_code">Vendor Code</CFormLabel>
                          <CFormInput
                            name="vendor_code"
                            size="sm"
                            id="vendor_code"
                            value={vname}
                            readOnly
                          />
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="rake_plant">Rake Plant</CFormLabel>
                          {/* <CFormSelect
                            size="sm"
                            onChange={(e) => {
                              changeBdcTableItem(e, 'Rake_Plant', currentDataId)
                            }}
                            value={currentTripInfo.rake_plant_code}
                          >
                            <option value="">Select...</option>
                            {rakePlantData.map(({ sno, plant_code, plant_name }) => {
                              return (
                                <>
                                  <option key={sno} value={plant_code}>
                                    {plant_name}
                                  </option>
                                </>
                              )
                            })}
                          </CFormSelect> */}
                          <CFormInput
                            name="rake_plant"
                            size="sm"
                            id="rake_plant"
                            value={locationFinder(currentTripInfo.rake_plant_code)}
                            readOnly
                          />
                        </CCol>

                      </CRow>
                      <CRow className="mt-2">
                        <CCol>
                          <Link to={'/RakeTripsheetEditHome'}>
                            <CButton
                              md={9}
                              size="sm"
                              color="primary"
                              disabled=""
                              className="text-white"
                              type="button"
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
                            size="sm"
                            color="warning"
                            className="mx-1 px-2 text-white"
                            type="button"
                            disabled={updateEnable}
                            onClick={() => {
                              setFetch(false)
                              updateTripsheet(2)
                            }}
                          >
                            Update
                          </CButton>

                          <CButton
                            size="sm"
                            color="warning"
                            className="mx-1 px-2 text-white"
                            type="button"
                            disabled={updateEnable}
                            onClick={() => {
                              setRejectConfirm(true)
                            }}
                          >
                            Cancel
                          </CButton>
                        </CCol>

                      </CRow>
                    </CForm>
                  </CTabPane>
                </CTabContent>
              </CCard>
            </>) : (<AccessDeniedComponent />
          )}
        </>
      )}
      {/* Error Modal Section */}
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
      {/* Error Modal Section */}
      {/* ======================= Confirm Button Modal Area ========================== */}
      <CModal
        visible={rejectConfirm}
        backdrop="static"
        onClose={() => {
          setRejectConfirm(false)
        }}
      >
        <CModalBody>
          <p className="lead">Are you sure to cancel this Tripsheet - ({currentTripInfo.rake_tripsheet_no}) ?</p>
        </CModalBody>
        <CModalFooter>
          <CButton
            className="m-2"
            color="warning"
            onClick={() => {
              setRejectConfirm(false)
              setFetch(false)
              updateTripsheet(3)
            }}
          >
            Yes
          </CButton>
          <CButton
            color="secondary"
            onClick={() => {
              setRejectConfirm(false)
            }}
          >
            No
          </CButton>
        </CModalFooter>
      </CModal>
      {/* *********************************************************** */}
    </>
  )
}

export default TripsheetEdit

