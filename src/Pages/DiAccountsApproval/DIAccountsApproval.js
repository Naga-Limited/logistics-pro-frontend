import React, { useState } from 'react'
import {
  CButton,
  CCard, 
  CCol,
  CForm, 
  CFormLabel, 
  CRow, 
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter, 
} from '@coreui/react'
import useForm from 'src/Hooks/useForm'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { Object } from 'core-js'
import { toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import 'react-toastify/dist/ReactToastify.css'
import DieselIntentCreationService from 'src/Service/DieselIntent/DieselIntentCreationService'
import DieselIntentValidation from 'src/Utils/DieselIntent/DieselIntentValidation'
import DieselApprovalOwn from './segments/OwnAndContract/DieselApprovalOwn'
import DieselApprovalHire from './segments/Hire/DieselApprovalHire'
import DieselVendorMasterService from 'src/Service/Master/DieselVendorMasterService'
import DieselIntentPaymentSAP from 'src/Service/SAP/DieselIntentPaymentSAP'
import ReportService from 'src/Service/Report/ReportService'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import JavascriptDateCheckComponent from 'src/components/commoncomponent/JavascriptDateCheckComponent'
import ExpenseIncomePostingDate from '../TripsheetClosure/Calculations/ExpenseIncomePostingDate'
import Swal from 'sweetalert2'
import DieseVendorSelectComponent from 'src/components/commoncomponent/DieselVendorSelectComponent'
import NLFSSAPDieselIndentService from 'src/Service/SAP/NLFSSAPDieselIndentService'

const DIAccountsApproval = () => {
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.NLFSDieselIntentModule.FS_Accounts_Approval

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
    vehicle_id: '',
    vendor_code: '',
    invoice_no: '',
    invoice_copy: '',
    no_of_ltrs: '',
    total_amount: '',
    bunk_reading: '',
    diesel_vendor_sap_invoice_no: '',
    diesel_status: '',
    nlfs_sap_status: '',
    remarks: '',
    diesel_vendor_name: '',
    vendor_hsn: '',
    vendor_tds: '',
    acc_appr_request_remarks: '',
    acc_appr_done_remarks: '',
    acc_appr_request_at: '',
    prev_di_nol: '',
    prev_di_rpl: '',
    prev_di_amount: '',
    acc_appr_request_at: '',
    acc_appr_request_at: '',
  }

  const { id } = useParams()
  const [state, setState] = useState({
    page_loading: false,
  })
  const [singleVehicleInfo, setSingleVehicleInfo] = useState(false)
  const [dirverAssign, setDirverAssign] = useState(true)
  const [fetch, setFetch] = useState(false)
  const [vendorData, setvendorData] = useState({})
  const [validateSubmit, setValidateSubmit] = useState(true)
  const [vendor, setVendor] = useState(false)
  const [acceptBtn, setAcceptBtn] = useState(true)
  const [acceptBtn1, setAcceptBtn1] = useState(true)
  const navigation = useNavigate()
  const vehicleType = {
    OWN: 1,
    CONTRACT: 2,
    HIRE: 3,
  }

  function dateFormat(a) {
    let short_year = a.substring(a.lastIndexOf('-') + 1)
    let month = a.substring(a.indexOf('-') + 1, a.lastIndexOf('-'))
    let day = a.substring(0, a.indexOf('-'))
    let d = a.lastIndexOf('-')
    let year = 20 + short_year
    let new_date = year + '-' + month + '-' + day
    return new_date
  }

  useEffect(() => {
    ReportService.singleDieselDetailsList(id).then((res) => {
      // setFetch(true)
      console.log(res.data.data,'singleDieselDetailsList')
      if (res.status === 200) {
        values.vendor_code = res.data.data != null ? res.data.data.vendor_code : ''
        DieselVendorMasterService.getDieselVendorsByCode(values.vendor_code).then((res) => {
          setFetch(true)
          console.log(res)
          // values.diesel_vendor_name = res.data.data.diesel_vendor_name
          values.diesel_vendor_name=
        res.data.data != null ? res.data.data.diesel_vendor_name : ''
        values.diesel_vendor_id = res.data.data != null ? res.data.data.diesel_vendor_id : ''
        })
        isTouched.vehicle_id = true
        values.tripsheet_id = res.data.data.tripsheet_id
        isTouched.driver_id = true
        isTouched.tripsheet_id = true
        isTouched.vehicle_type_id = true
        values.parking_id = true
        values.parking_id = res.data.data.parking_id
        // values.vendor_code = res.data.data.diesel_intent_info != null ? res.data.data.diesel_intent_info.vendor_code : ''
        // values.tripsheet_id = res.data.data.trip_sheet_info != null ? res.data.data.trip_sheet_info.trip_sheet_no : ''
        values.driver_code =
        res.data.data != null ? res.data.data.driver_code : ''
        values.invoice_no =
        res.data.data != null ? res.data.data.invoice_no : ''
        values.rate_of_ltrs =
        res.data.data != null ? res.data.data.rate_of_ltrs : ''
        values.total_amount =
        res.data.data != null ? res.data.data.total_amount : ''
        values.total_amount1 =
        res.data.data != null ? res.data.data.total_amount : ''
        values.no_of_ltrs =
        res.data.data != null ? res.data.data.no_of_ltrs : ''
        values.no_of_ltrs1 =
        res.data.data != null ? res.data.data.no_of_ltrs : ''
        values.invoice_copy=
        res.data.data != null ? res.data.data.invoice_copy : ''
        values.bunk_reading=
        res.data.data != null ? res.data.data.bunk_reading : ''
        values.diesel_invoice_date=dateFormat(
        res.data.data != null ? res.data.data.diesel_invoice_date : '')
        values.vendor_tds = res.data.data != null ? res.data.data.vendor_tds : ''
        values.vendor_hsn = res.data.data != null ? res.data.data.vendor_hsn : ''
        values.sap_invoice_diesel_posting_date=dateFormat(
        res.data.data != null ? res.data.data.diesel_invoice_sap_posting_date : '')
        values.acc_appr_request_remarks = res.data.data != null ? res.data.data.acc_appr_request_remarks : ''
        values.acc_appr_request_at = res.data.data != null ? res.data.data.acc_appr_request_at : ''
        values.trip_sheet_no=
        res.data.data.parking_info.trip_sheet_info != null ? res.data.data.parking_info.trip_sheet_info.trip_sheet_no : ''
        // values.advance_amount = res.data.data.trip_sheet_info.advance_amount
        // values.advance_payment_diesel=res.data.data.trip_sheet_info.advance_payment_diesel
        values.vehicle_type_id = res.data.data.parking_info !=null ? res.data.data.parking_info.vehicle_type_id.id :''
        values.vehicle_id = res.data.data.vehicle_id
        values.driver_id = res.data.data !=null ? res.data.data.driver_id:''

        let temp = JSON.parse(res.data.data.acc_appr_info)
        console.log(temp,'temp') 
        if(temp[0]){
          values.prev_di_nol = temp[0].nol
          values.prev_di_rpl = temp[0].rpl
          values.prev_di_amount = temp[0].amount
        } else {
          values.prev_di_nol = ''
          values.prev_di_rpl = ''
          values.prev_di_amount = '' 
        }
        values.driveMobile =
          res.data.data.parking_info != null ? res.data.data.parking_info.driver_contact_number : ''
          values.inspection_time =
          res.data.data.parking_info.vehicle_inspection_trip != null ? res.data.data.parking_info.vehicle_inspection_trip.inspection_time_string : ''
        // values.freight_rate_per_tone =
        //   res.data.data.vehicle_Freight_info == undefined
        //     ? '0'
        //     : res.data.data.vehicle_Freight_info.freight_rate_per_ton
        values.nlfs_sap_status = res.data.data !=null ? res.data.data.nlfs_sap_status : ''
        setSingleVehicleInfo(res.data.data)
        console.log(singleVehicleInfo)
        
      }
    })
  }, [])

  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur, isTouched } =
    useForm(login, DieselIntentValidation, formValues)

    function login() {
      // alert('No Errors CallBack Called')
    }

  /* ============= Admin Vendor Change Process ============= */
  
  const [vendorChangeId, setVendorChangeId] = useState('')

  const ColoredLine = ({ color }) => (
    <hr
        style={{
            color: color,
            backgroundColor: color,
            height: 5
        }}
    />
  )

  const AdminVendorChange = (eve) => {
    let selectedValue = eve.target.value
    console.log(selectedValue,'AdminVendorChange-selectedValue')
    setVendorChangeId(selectedValue)
  }

  function DieselVendorChange() {

    if(vendorChangeId == ''){ 
      toast.warning('Vendor Name is required...')
      return false
    } 

    if(values.diesel_vendor_id == vendorChangeId){
      toast.warning('Same Vendor cannot be updated itself...')
      return false
    }
    
    const data = new FormData() 
    data.append('parking_id', values.parking_id)
    data.append('di_id', id) 
    data.append('diesel_vendor_id', values.diesel_vendor_id)
    data.append('change_vendor_id', vendorChangeId)  
    setFetch(false)

    DieselIntentCreationService.adminUpdateDieselVendor(data).then((res) => {
      console.log(res,'adminUpdateDieselVendor-response')
      setFetch(true)
      if (res.status === 200) {
        toast.success(res.data.message)
        navigation('/DiApprovalHome')
      } else if (res.status === 201) {
        toast.warning(res.data.message)
      } else {
        toast.warning('Something went wrong!')
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

    /* ============= Admin Vendor Change Process ============= */

  

  useEffect(() => {
    if (Object.keys(errors).length === 0 && Object.keys(isTouched)) {
      setValidateSubmit(false)
    } else {
      setValidateSubmit(true)
    }

    console.log(singleVehicleInfo)
    console.log(values)
  })
  useEffect(() => {
    if(!errors.diesel_vendor_name && !errors.rate_of_ltrs){
      setAcceptBtn(false);
    } else {
      setAcceptBtn(true);
    }
  }, [errors])

  const [remarks, setRemarks] = useState('')
  const [approvalReject, setApprovalReject] = useState(false)
  const handleChangenew = event => {
    const result = event.target.value.toUpperCase();
    setRemarks(result);
  }

  const DepoTripExpenseApprovalCancel = () => {
    console.log(remarks,'apremarks')
    if (remarks && remarks.trim()) {
      console.log('iop')
      // setApprovalReject(true)
      expenseApproval(2)
    } else {
      setFetch(true)
      Swal.fire({
        title: 'You should give the proper reason for rejection via approval remarks...',
        icon: "warning",
        confirmButtonText: "OK",
      }).then(function () {
      })
      setRemarks('')
      return false
    }
  }

  const expenseApproval = (type) => {
    /* Values Assigning To Save Details into DB Part Start*/

    const formData = new FormData()

    formData.append('acc_appr_status', type == 1 ? 2 : 3)
    formData.append('acc_appr_done_remarks', remarks)
    formData.append('acc_appr_done_by', user_id)
    formData.append('di_id', id)
    formData.append('parking_id', values.parking_id) 
    
    if(type == 2){
      let accounts_approval_info = []
      accounts_approval_info.push({
        nol: singleVehicleInfo.no_of_ltrs,
        rpl: singleVehicleInfo.rate_of_ltrs,
        amount: singleVehicleInfo.total_amount,
      })
      formData.append('acc_appr_info', JSON.stringify(accounts_approval_info))
      formData.append('no_of_ltrs', values.prev_di_nol) 
      formData.append('total_amount', values.prev_di_amount) 
      formData.append('rate_of_ltrs', values.prev_di_rpl) 
    }  

    DieselIntentCreationService.accountsApprovalSumission(formData).then((res) => {
      setFetch(true)
      console.log(res,'accountsApprovalSumission')
      if (res.status == 200) {
        setFetch(true) 
        Swal.fire({
          icon: "success",
          title: type == 1 ? 'DI Accounts Approval Process Approved Successfully..!' : 'DI Accounts Approval Process Rejected Successfully..!',
          confirmButtonText: "OK",
        }).then(function () {
          navigation('/DIAccountsApprovalHome')
        });
      } else if (res.status == 201) {
        Swal.fire({
          title: res.data.message,
          icon: "warning",
          confirmButtonText: "OK",
        }).then(function () {
          window.location.reload(false)
        })
      } else {
        toast.warning('Accounts Approval Submission Cannot be Updated. Kindly contact Admin..!')
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
  
  }

   return (
    <>
      {!fetch && <Loader />}
      {fetch && (
       <>
        {screenAccess ? (
         <>
          <CCard>
            {singleVehicleInfo && (
              <CForm className="container p-3" onSubmit={handleSubmit}>
                {values.vehicle_type_id === vehicleType.OWN ||
                values.vehicle_type_id === vehicleType.CONTRACT ? (
                  <DieselApprovalOwn
                    values={values}
                    errors={errors}
                    handleChange={handleChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    singleVehicleInfo={singleVehicleInfo}
                    isTouched={isTouched}
                    dirverAssign={dirverAssign}
                    setDirverAssign={setDirverAssign}
                    remarks={remarks}
                    handleChangenew={handleChangenew}
                  />
                ) : (
                  <DieselApprovalHire
                    values={values}
                    errors={errors}
                    handleChange={handleChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    singleVehicleInfo={singleVehicleInfo}
                    isTouched={isTouched}
                    remarks={remarks}
                    handleChangenew={handleChangenew}
                  />
                )}

                {/* Admin - Diesel Vendor Change Process */}
                {user_info.is_admin == 1 && 
                  <>
                    <ColoredLine color="red" />
                    <CRow className="mt-md-3">
                      
                      <CCol className="" xs={12} sm={12} md={3}>
                        <CFormLabel htmlFor="diesel_vendor_name">
                          Vendor Name  
                        </CFormLabel>
                        <CFormSelect
                          size="sm"
                          name="dvname" 
                          onChange={(e)=>{AdminVendorChange(e)}}
                          value={vendorChangeId}
                          id="vendor_id" 
                          aria-label="Small select example"
                        >
                          <DieseVendorSelectComponent/>
                        </CFormSelect> 
                      </CCol>
                      {vendorChangeId &&
                        <CCol className="mt-4" xs={12} sm={12} md={3}>
                          <CButton 
                            size="sm" 
                            color="success" 
                            className="text-white" 
                            type="button" 
                            onClick={() => {
                              DieselVendorChange() 
                            }}> 
                              Vendor Change 
                          </CButton> 

                        </CCol>
                      }   
                    </CRow>
                    <ColoredLine color="red" />
                  </>
                }

              <CRow className="mt-md-3">
                <CCol className="" xs={12} sm={12} md={3}>
                  <CButton size="sm" color="primary" className="text-white" type="button">
                    <Link className="text-white" to="/DIAccountsApprovalHome">
                      Previous
                    </Link>
                  </CButton>
                </CCol>
                <CCol
                  className="offset-md-6"
                  xs={12}
                  sm={12}
                  md={3}
                  style={{ display: 'flex', justifyContent: 'end' }}
                > 
                  <CButton
                    size="sm"
                    style={{ background: 'red'}}
                    className="mx-3 text-white"
                    onClick={() => {
                      setFetch(false)
                      DepoTripExpenseApprovalCancel()
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
                      setFetch(false)
                      expenseApproval(1)
                    }}
                    type="submit"
                  >
                    Approve
                  </CButton>
                </CCol>
              </CRow>

              </CForm>
            )}
          </CCard>
           {/* ============== Income Reject Confirm Button Modal Area ================= */}
          <CModal
            visible={approvalReject}
            backdrop="static"
            // scrollable
            onClose={() => {
              setApprovalReject(false)
            }}
          >
            <CModalBody>
              <p className="lead">Are you sure to Reject an DI Accounts Approval Request?</p>
            </CModalBody>
            <CModalFooter>
              <CButton
                className="m-2"
                color="warning"
                onClick={() => {
                  setFetch(false)
                  setApprovalReject(false)
                  expenseApproval(2)
                }}
              >
                Confirm
              </CButton>
              <CButton
                color="secondary"
                onClick={() => {
                  setApprovalReject(false)
                }}
              >
                Cancel
              </CButton>
            </CModalFooter>
          </CModal>
         </>) : (<AccessDeniedComponent />)}
       </>
      )}
    </>
  )
}

export default DIAccountsApproval
