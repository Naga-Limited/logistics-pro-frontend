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
import FCITripsheetCreationService from 'src/Service/FCIMovement/FCITripsheetCreation/FCITripsheetCreationService'
import FCITripsheetSapService from 'src/Service/SAP/FCITripsheetSapService'

const FCITripsheetEdit = () => {
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
    FCITripsheetCreationService.getTripeInfoById(id).then((res) => {

      let tdata = res.data.data
        console.log(tdata,'getTripeInfoById')
        isTouched.remarks = true 
        setVnumber(tdata.vehicle_no) 
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

     
  }

  const updateTripsheet = (type) => {

    var TsSendData = {}
    var TsSendData_seq = []

    /* Non Editable Fields */
    TsSendData.TRIP_SHEET = currentTripInfo.fci_tripsheet_no
    TsSendData.PO_NO = currentTripInfo.po_no
    TsSendData.SAP_FLAG = type
    TsSendData.PLANT = currentTripInfo.fci_plant_code

    /* Editable Fields */
    TsSendData.VEHICLE_NO = vnumber

    /* ========= Newly Added Fields for E-Way Bill Start ========= */
    TsSendData.PLANT_NAME = currentTripInfo.fci_plant_info.plant_name
    TsSendData.COMPANY_NAME = currentTripInfo.fci_plant_info.company_name
    TsSendData.STREET_NO = currentTripInfo.fci_plant_info.street_no
    TsSendData.STREET_NAME = currentTripInfo.fci_plant_info.street_name
    TsSendData.CITY = currentTripInfo.fci_plant_info.city
    TsSendData.STATE = currentTripInfo.fci_plant_info.state
    TsSendData.POST_CODE = currentTripInfo.fci_plant_info.postal_code
    TsSendData.REGION = currentTripInfo.fci_plant_info.region
    TsSendData.GST_NUMBER = currentTripInfo.fci_plant_info.gst_no
    /* ========= Newly Added Fields for E-Way Bill End ========= */

    TsSendData_seq[0] = TsSendData

    if(user_info.is_admin == 1){
      console.log(currentTripInfo,'currentTripInfo')
      console.log('TRIP_SHEET', currentTripInfo.fci_tripsheet_no)
      console.log('PO_NO', currentTripInfo.po_no)
      console.log('PLANT', currentTripInfo.fci_plant_code)
      console.log('SAP_FLAG', type)
      console.log('VEHICLE_NO', vnumber) 
      console.log(TsSendData_seq,'TsSendData_seq')
    }

    setFetch(false)
    FCITripsheetSapService.UpdateTSInfoToSAP(TsSendData_seq).then((response) => {
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
        FCITripsheetCreationService.updateTripsheet(data).then((res) => {

          console.log(res,'updateTripsheet-response')

          if (res.status == 200) {
            setFetch(true)
            Swal.fire({
              title: 'Tripsheet Details Updated!',
              icon: "success",
              confirmButtonText: "OK",
            }).then(function () {
              navigation('/FCITripsheetEditHome')
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
                            value={currentTripInfo.fci_tripsheet_no}
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
                          <CFormLabel htmlFor="fnr_number">PO Number</CFormLabel>
                          <CFormInput
                            name="fnr_number"
                            size="sm"
                            id="fnr_number"
                            value={currentTripInfo.po_no}
                            readOnly
                          />
                        </CCol>                                                

                        <CCol md={3}>
                          <CFormLabel htmlFor="rake_plant">FCI Plant</CFormLabel>
                          {/* <CFormSelect
                            size="sm"
                            onChange={(e) => {
                              changeBdcTableItem(e, 'Rake_Plant', currentDataId)
                            }}
                            value={currentTripInfo.rake_plant_code}
                          >
                            <option value="">Select...</option>
                            {fciPlantData.map(({ sno, plant_code, plant_name }) => {
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
                            name="fci_plant"
                            size="sm"
                            id="fci_plant"
                            value={`${currentTripInfo.fci_plant_info.plant_name} (${currentTripInfo.fci_plant_code})`}
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

                      </CRow>
                      <CRow className="mt-2">
                        <CCol>
                          <Link to={'/FCITripsheetEditHome'}>
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
        size='lg'
        onClose={() => {
          setRejectConfirm(false)
        }}
      >
        <CModalBody>
          <p className="lead">Are you sure to cancel this Tripsheet - ({currentTripInfo.fci_tripsheet_no}) ?</p>
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

export default FCITripsheetEdit

