import {
  CButton,
  CCard, 
  CCol,
  CAlert,
  CForm,
  CFormInput,
  CFormLabel, 
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import React, { useState, useEffect } from 'react' 
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Loader from 'src/components/Loader'
import Swal from 'sweetalert2'
// SERVICES FILE
import VendorCreationService from 'src/Service/VendorCreation/VendorCreationService'
import ShedService from 'src/Service/SmallMaster/Shed/ShedService'
import UserLoginMasterService from 'src/Service/Master/UserLoginMasterService'

// VALIDATIONS FILE
import useForm from 'src/Hooks/useForm.js'
import VendorRequestValidation from 'src/Utils/TransactionPages/VendorCreation/VendorRequestValidation'

import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi' 
import TripSheetCreationService from 'src/Service/TripSheetCreation/TripSheetCreationService'

const tsvchohappChild = () => {
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.TSVendorChangeModule.TSVCH_OH_Approval

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

  const { id } = useParams()
  const decoded_id = atob(id.toString())
   console.log(decoded_id,'decoded_id')
  const navigation = useNavigate()

  const [fetch, setFetch] = useState(false) 
  const [currentInfo, setCurrentInfo] = useState({})
  const [shedData, setShedData] = useState({}) 
  const [userData, setUserData] = useState({})  
  const [userData1, setUserData1] = useState({})  

  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})

  const [vCRAHADelete, setVCRAHADelete] = useState(false)
  const [vCRAHAConfirm, setVCRAHAConfirm] = useState(false)

  const X = () => <span className="text-danger"> * </span>

  // SET FORM VALUES
  const formValues = {
    remarks: '',
  }

  // VALIDATIONS
  function callBack() {}
  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur, isTouched } =
    useForm(callBack, VendorRequestValidation, formValues)

  const getRndInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min
  }

  const [tdsTaxTermsData, setTdsTaxTermsData] = useState([])

  useEffect(() => {
    DefinitionsListApi.visibleDefinitionsListByDefinition(3).then((response) => {
        console.log(response.data.data,'setTdsTaxTermsData')
        setTdsTaxTermsData(response.data.data)
    })
  }, [decoded_id])

  const tdsTaxCodeName = (code) => {
    let tds_tax_code_name = '-'

    tdsTaxTermsData.map((val, key) => {
        if (val.definition_list_code == code) {
        tds_tax_code_name = val.definition_list_name
        }
    })

    console.log(tds_tax_code_name,'tds_tax_code_name')

    return tds_tax_code_name
  } 

  // GET SINGLE SHED DETAILS
  const ShedDataFinder = (shed_id) => {
    if(shed_id){
      ShedService.SingleShedData(shed_id).then((resp) => {
        setShedData(resp.data.data)
      })
    } else {
      setShedData([])
    }
  }

  const ColoredLine = ({ color }) => (
    <hr
        style={{
            color: color,
            backgroundColor: color,
            height: 5
        }}
    />
  )

  // GET SINGLE User DETAILS
  const UserdDataFinder = (user_id) => {
    if(user_id){
      UserLoginMasterService.getUser().then((res) => {
        let user_data = res.data.data
        console.log(user_data,'user_data - vv')
        user_data.map((vv,kk)=>{
          if(vv.user_id == user_id){
            console.log(vv,'user_data - vv')
            setUserData(vv)
          }
        }) 
        
      })
    } else {
      setUserData([])
    }
  }

  // GET SINGLE User DETAILS
  const UserdDataFinder1 = (user_id) => {
    if(user_id){
      UserLoginMasterService.getUser().then((res) => {
        let user_data = res.data.data
        console.log(user_data,'user_data - vv')
        user_data.map((vv,kk)=>{
          if(vv.user_id == user_id){
            console.log(vv,'user_data - vv')
            setUserData1(vv)
          }
        }) 
        
      })
    } else {
      setUserData1([])
    }
  }

  // GET SINGLE VEHICLE DATA
  useEffect(() => {
    // TripSheetCreationService.getSingleVehicleInfoOnGate(decoded_id).then((res) => {
    TripSheetCreationService.getTripsheetInfoById(decoded_id).then((res) => {
      const resData = res.data.data
      console.log(resData, 'resData') 
      
      values.panNumber = '' 

      ShedDataFinder(resData.vendor_info ? resData.vendor_info.shed_id : '') 
      UserdDataFinder(resData.trip_sheet_info && resData.trip_sheet_info.vch_user_info ? resData.trip_sheet_info.vch_user_info.vch_requested_by : '') 
      UserdDataFinder1(resData.trip_sheet_info && resData.trip_sheet_info.vch_user_info ? resData.trip_sheet_info.vch_user_info.vch_ah_approved_by : '') 
      setCurrentInfo(resData)
      setFetch(true)
    })
  }, [id])

  const vendorChangeRequestRejectionValidation = () => {
     if(values.remarks == ''){
        toast.warning('Remarks should be needed for Rejection..!')
      return false
    } else {
      setVCRAHADelete(true)
    }
  }

  // ADD VENDOR REQUEST DETAILS
  const VCROHApproval = (status) => {

    toast.success(`Vendor Change Request - OH Approval ${status == 1 ? 'Confirmation': 'Rejection'} Process Validated..!`)
    // setFetch(true)
    // return false

    const formData = new FormData() 

    formData.append('parking_id', currentInfo.parking_yard_gate_id)
    formData.append('tripsheet_id', currentInfo.tripsheet_sheet_id)
    formData.append('vendor_id', currentInfo.vendor_info.vendor_id)
    formData.append('vehicle_id', currentInfo.vehicle_id)

    formData.append('vch_oh_approval_remarks', values.remarks || '')
    formData.append('vch_oh_approved_by', user_id)
    formData.append('vch_status', status == 1 ? 4 : 1) /* 1 - Request Rejected , 4 - OH Approved */
    
    if(status == 2){
      formData.append('rejection_type', 2) /* OH Rejection */
    }

    VendorCreationService.updateVendorChangeRequestAOHData(formData)
      .then((res) => {
        setFetch(true)
        console.log(res)
        if (res.status == 200) {
            Swal.fire({
                title: status == 1 ? "Updated!" : "Rejected!",
                text: `Vendor Change Request has been ${status == 1 ? "Updated Successfully." : "Rejected."}.`,
                icon: "success"
            }).then(function () {
                navigation('/tsvchohapp')
            })
        } else if (res.status == 201) {
            Swal.fire({
                title: res.data.message,
                icon: "warning",
                confirmButtonText: "OK",
            }).then(function () {
                // window.location.reload(false)
            })
        } else {
            Swal.fire({
                title: "Failed!",
                text: "Vendor Change Request Process Failed.",
                icon: "warning"
            }).then(function () {
            //
            })
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

  function formatTimestamp(input) {
    const date = new Date(input);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12
    const formattedHours = String(hours).padStart(2, '0');

    return `${day}/${month}/${year} ${formattedHours}:${minutes} ${ampm}`;
  }

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
       <>
        {screenAccess ? (
          <>
            <CCard>
              <CForm className="container p-3" onSubmit={handleSubmit}>
                
                <CRow className="">
                  {currentInfo.trip_sheet_info &&(
                    <>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="Vnum">Vehicle No. / Tripsheet No.</CFormLabel>
                        <CFormInput
                          size="sm"
                          id="Vnum"
                          value={`${currentInfo.vehicle_number} / ${currentInfo.trip_sheet_info.trip_sheet_no}`}
                          readOnly
                        />
                      </CCol>
                    </>
                  )} 
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="shedName">Shed Name</CFormLabel>
                    <CFormInput
                      size="sm"
                      id="shedName"
                      value={fetch ? shedData.shed_name : ''}
                      readOnly
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="ownerName">Shed Owner Name</CFormLabel>
                    <CFormInput
                      size="sm"
                      id="ownerName"
                      value={fetch ? shedData.shed_owner_name : ''}
                      readOnly
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="shedownerMob">Shed Mobile Number </CFormLabel>
                    <CFormInput
                      size="sm"
                      id="shedownerMob"
                      className={`${errors.shedownerMob && 'is-invalid'}`}
                      name="shedownerMob"
                      value={fetch ? shedData.shed_owner_phone_1 : ''}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      readOnly
                    />
                  </CCol>

                  <CRow className="mt-2" hidden>
                    <ColoredLine color="red" />
                    <CCol xs={12} md={3}>
                      <CFormLabel
                          htmlFor="inputAddress"
                          style={{
                          backgroundColor: '#4d3227',
                          margin: '5px 0',
                          color: 'white',
                          }}
                      >
                          Existing Vendor Information
                      </CFormLabel>
                    </CCol>
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="Vnum">Vendor PAN No.</CFormLabel>
                      <CFormInput
                        size="sm"
                        id="Vnum"
                        value={currentInfo.vendor_info.pan_card_number}
                        readOnly
                      />
                    </CCol>
                  </CRow>

                  {currentInfo.trip_sheet_info && currentInfo.trip_sheet_info.old_vendor_info && (
                    <CRow>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="Vnum">Vendor Code</CFormLabel>
                        <CFormInput
                          size="sm"
                          id="Vnum"
                          value={currentInfo.trip_sheet_info.old_vendor_info.vendor_code}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="Vnum">Vendor Name 1</CFormLabel>
                        <CFormInput
                          size="sm"
                          id="Vnum"
                          value={currentInfo.trip_sheet_info.old_vendor_info.vendor_name1}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="Vnum">Vendor Name 2</CFormLabel>
                        <CFormInput
                          size="sm"
                          id="Vnum"
                          value={currentInfo.trip_sheet_info.old_vendor_info.vendor_name2}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="Vnum">Vendor Mobile No.</CFormLabel>
                        <CFormInput
                          size="sm"
                          id="Vnum"
                          value={currentInfo.trip_sheet_info.old_vendor_info.mobile_number}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="Vnum">Vendor Aadhar No.</CFormLabel>
                        <CFormInput
                          size="sm"
                          id="Vnum"
                          value={currentInfo.trip_sheet_info.old_vendor_info.aadhar_card_number}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="Vnum">TDS Tax Type</CFormLabel>
                        <CFormInput
                          size="sm"
                          id="Vnum"
                          value={`${tdsTaxCodeName(currentInfo.trip_sheet_info.old_vendor_info.tax_type)}`} 
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="Vnum">Vendor Bank Account No.</CFormLabel>
                        <CFormInput
                          size="sm"
                          id="Vnum" 
                          value={currentInfo.trip_sheet_info.old_vendor_info.bank_account_number}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="Vnum">City</CFormLabel>
                        <CFormInput
                          size="sm"
                          id="Vnum"
                          value={currentInfo.trip_sheet_info.old_vendor_info.city} 
                          readOnly
                        />
                      </CCol>
                    </CRow>
                  )} 

                <CRow className="mt-2" hidden>
                  <ColoredLine color="red" />
                  <CCol xs={12} md={3}>
                    <CFormLabel
                      htmlFor="inputAddress"
                      style={{
                      backgroundColor: '#4d3227',
                      margin: '5px 0',
                      color: 'white',
                      }}
                    >
                      Vendor Change Request Information
                    </CFormLabel>
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="Vnum">Vendor PAN No.</CFormLabel>
                    <CFormInput
                      size="sm"
                      id="Vnum"
                      value={currentInfo.trip_sheet_info.new_vendor_info.pan_card_number} 
                      readOnly
                    />
                  </CCol>
                </CRow> 

                {currentInfo.trip_sheet_info && currentInfo.trip_sheet_info.old_vendor_info && (
                    <CRow>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="Vnum">Vendor Code</CFormLabel>
                        <CFormInput
                          size="sm"
                          id="Vnum"
                          value={currentInfo.trip_sheet_info.new_vendor_info.vendor_code}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="Vnum">Vendor Name 1</CFormLabel>
                        <CFormInput
                          size="sm"
                          id="Vnum"
                          value={currentInfo.trip_sheet_info.new_vendor_info.vendor_name1}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="Vnum">Vendor Name 2</CFormLabel>
                        <CFormInput
                          size="sm"
                          id="Vnum"
                          value={currentInfo.trip_sheet_info.new_vendor_info.vendor_name2}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="Vnum">Vendor Mobile No.</CFormLabel>
                        <CFormInput
                          size="sm"
                          id="Vnum"
                          value={currentInfo.trip_sheet_info.new_vendor_info.mobile_number}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="Vnum">Vendor Aadhar No.</CFormLabel>
                        <CFormInput
                          size="sm"
                          id="Vnum"
                          value={currentInfo.trip_sheet_info.new_vendor_info.aadhar_card_number}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="Vnum">TDS Tax Type</CFormLabel>
                        <CFormInput
                          size="sm"
                          id="Vnum"
                          value={`${tdsTaxCodeName(currentInfo.trip_sheet_info.new_vendor_info.tax_type)}`} 
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="Vnum">Vendor Bank Account No.</CFormLabel>
                        <CFormInput
                          size="sm"
                          id="Vnum" 
                          value={currentInfo.trip_sheet_info.new_vendor_info.bank_account_number}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="Vnum">City</CFormLabel>
                        <CFormInput
                          size="sm"
                          id="Vnum"
                          value={currentInfo.trip_sheet_info.new_vendor_info.city} 
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="Vnum">VCR Given User</CFormLabel>
                        <CFormInput
                          size="sm"
                          id="Vnum"
                          value={currentInfo.trip_sheet_info.vch_user_info.vch_requested_by == 1 ? 'Admin' : userData.emp_name} 
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="Vnum">VCR Given Time</CFormLabel>
                        <CFormInput
                          size="sm"
                          id="Vnum"
                          value={formatTimestamp(currentInfo.trip_sheet_info.vch_time_info.vch_requested_at)} 
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="Vnum">VCR Remarks</CFormLabel>
                        <CFormInput
                          size="sm"
                          id="Vnum"
                          value={currentInfo.trip_sheet_info.vch_remarks_info.vch_request_remarks} 
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="Vnum">VCR AH Approval User</CFormLabel>
                        <CFormInput
                          size="sm"
                          id="Vnum"
                          value={currentInfo.trip_sheet_info.vch_user_info.vch_ah_approved_by == 1 ? 'Admin' : userData1.emp_name} 
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="Vnum">VCR AH Approval Time</CFormLabel>
                        <CFormInput
                          size="sm"
                          id="Vnum"
                          value={formatTimestamp(currentInfo.trip_sheet_info.vch_time_info.vch_ah_approved_at)} 
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="Vnum">VCR AH Approval Remarks</CFormLabel>
                        <CFormInput
                          size="sm"
                          id="Vnum"
                          value={currentInfo.trip_sheet_info.vch_remarks_info.vch_ah_approval_remarks} 
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="remarks">
                            VCR OH Approval Remarks
                            {errors.remarks && <span className="small text-danger">{errors.remarks}</span>}
                        </CFormLabel>
                        <CFormInput
                            size="sm"
                            id="remarks"
                            name="remarks"
                            value={values.remarks ? values.remarks : ''}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleChange}
                        />
                      </CCol>
                    </CRow>
                  )}   
                
              </CRow>
              {/* Row Nine------------------------- */}
              <CRow className='mt-2'>
                <CCol>
                  <Link to="/tsvchohapp">
                    <CButton
                      md={9}
                      size="sm"
                      color="primary"
                      disabled=""
                      className="text-white"
                      type="submit"
                    >
                      Previous
                    </CButton>
                  </Link>
                   
                </CCol>
                <CCol xs={12} md={3}>
                   
                </CCol>
                 
                <CCol
                    className=""
                    xs={12}
                    sm={12}
                    md={3}
                    style={{ display: 'flex', justifyContent: 'flex-end' }}
                >
                     
                  <CButton
                    size="sm"
                    style={{ background: 'red'}}
                    className="mx-3 text-white"
                    onClick={() => {
                      vendorChangeRequestRejectionValidation()
                    }}
                    type="submit"
                  >
                    Reject
                  </CButton>
                  <CButton
                    size="sm"
                    style={{ background: 'green'}}
                    className="mx-3 text-white"
                    onClick={() => {
                      setVCRAHAConfirm(true)
                    }}
                    type="submit"
                  >
                    Approve
                  </CButton>                    
                </CCol>
                  
                </CRow>
                {/* Row Eight------------------------- */}
              </CForm>

              {/* ======================= Confirm Button Modal Area ========================== */}
              
                <CModal
                  size="md"
                  backdrop="static"
                  visible={vCRAHADelete}
                  onClose={() => {
                    setVCRAHADelete(false)
                  }}
                >
                  <CModalHeader
                    style={{
                      backgroundColor: '#ebc999',
                    }}
                  >
                    <CModalTitle>Confirmation To Reject</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <p className="lead">Are you sure to reject this Vendor Change Request ?</p>
                    </CModalBody>
                  <CModalFooter>
                    <CButton
                      className="m-2"
                      color="warning"
                      onClick={() => {
                        setVCRAHADelete(false)
                        setFetch(false)
                        VCROHApproval(2)
                      }}
                    >
                      Yes
                    </CButton>
                    <CButton
                      color="secondary"
                      onClick={() => {
                        setVCRAHADelete(false)
                      }}
                    >
                      No
                    </CButton>
                  </CModalFooter>
                </CModal>
                <CModal
                  size="md"
                  visible={vCRAHAConfirm}
                  onClose={() => {
                    setVCRAHAConfirm(false)
                  }}
                >
                  <CModalHeader
                    style={{
                      backgroundColor: '#ebc999',
                    }}
                  >
                    <CModalTitle>Confirmation To Approval</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <p className="lead">Are you sure to Approve this Vendor Change Request ?</p>


                  </CModalBody>
                  <CModalFooter>
                    <CButton
                      className="m-2"
                      color="warning"
                      onClick={() => {
                        setVCRAHAConfirm(false)
                        setFetch(false)
                        VCROHApproval(1)
                      }}
                    >
                      Yes
                    </CButton>
                    <CButton
                      color="secondary"
                      onClick={() => {
                        setVCRAHAConfirm(false)
                      }}
                    >
                      No
                    </CButton>
                  </CModalFooter>
                </CModal>

              {/* *********************************************************** */}
               
            </CCard>
            {/* ============================================================= */}

          {/* ======================= Modal Area ========================== */}

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
           </>
            ) : (<AccessDeniedComponent />)}
        </>
      )}
    </>
  )
}

export default tsvchohappChild

