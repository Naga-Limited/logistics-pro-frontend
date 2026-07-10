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
  CInputGroup,
  CInputGroupText,
  CFormSelect,
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
import BankMasterService from 'src/Service/SubMaster/BankMasterService'

// VALIDATIONS FILE
import useForm from 'src/Hooks/useForm.js'
import VendorRequestValidation from 'src/Utils/TransactionPages/VendorCreation/VendorRequestValidation'

import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import PanDataService from 'src/Service/SAP/PanDataService' 
import TripSheetCreationService from 'src/Service/TripSheetCreation/TripSheetCreationService'

const tsvchreqChild = () => {
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  // let page_no = LogisticsProScreenNumberConstants.VendorCreationModule.Vendor_Creation_Request
  let page_no = LogisticsProScreenNumberConstants.TSVendorChangeModule.TSVCH_Request

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
  const [rmsto, setRmsto] = useState(false)
  const [currentInfo, setCurrentInfo] = useState({})
  const [shedData, setShedData] = useState({})
  const [bankData, setBankData] = useState([])
  const [TaxType, setTaxType] = useState([]) 
  const [panGroupData, setPanGroupData] = useState([])
  const [vendorCode, setVendorCode] = useState('0')
  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})

  const [acceptBtn, setAcceptBtn] = useState(true) 

  const X = () => <span className="text-danger"> * </span>

  // SET FORM VALUES
  const formValues = {
    panNumber: '',
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


  //WEB CAM Coding end

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

  // GET BANK DETAILS
  const GetBankData = () => {
    BankMasterService.getAllBank().then((resp) => {
      setBankData(resp.data.data)
    })
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

  // GET SINGLE VEHICLE DATA
  useEffect(() => { 
    
    TripSheetCreationService.getTripsheetInfoById(decoded_id).then((res) => {
      const resData = res.data.data
      console.log('resData',resData) 
      
      values.panNumber = '' 

      ShedDataFinder(resData.vendor_info.shed_id)
      GetBankData()
      setCurrentInfo(resData)
      setFetch(true)
    })
  }, [id])

  // ERROR VALIDATIONS
  useEffect(() => { 

    // For Vendor PAN Details 
    let panVal = !errors.panNumber && values.panNumber 

    if (panVal) {
      setAcceptBtn(false) 
    } else {
      setAcceptBtn(true) 
    } 
    
  }, [values, errors])

  // ADD VENDOR REQUEST DETAILS
  const addVendorRequest = (status) => {

    if(panData.LIFNR == currentInfo.vendor_info.vendor_code){ 
      toast.warning(`Existing Vendor (${currentInfo.vendor_info.vendor_code}) Information cannot be updated. Kindly check the vendor details.`)
      return false
    }

    if(panGroupData.length > 0 && Object.keys(panData).length === 0){ 
      setFetch(true)
      toast.warning('Pan Data Required')
      return false
    } 

    if(panData.J_1IPANNO != values.panNumber){
      toast.warning('PAN Number data mismatched. Kindly check now.')
      return false
    }

    toast.success('Vendor Change Request Validated..!')
    // setFetch(true)
    // return false

    const formData = new FormData() 

    formData.append('parking_id', currentInfo.parking_yard_gate_id)
    formData.append('tripsheet_id', currentInfo.tripsheet_sheet_id)

    /* Existing (Old) Vendor Info */
    let existing_vendor_object = {}
    existing_vendor_object.vendor_name1 = currentInfo.vendor_info.owner_name ? currentInfo.vendor_info.owner_name : '-'
    existing_vendor_object.vendor_name2 = currentInfo.vendor_info.owner_name2 ? currentInfo.vendor_info.owner_name2 : '-'
    existing_vendor_object.vendor_code = currentInfo.vendor_info.vendor_code ? currentInfo.vendor_info.vendor_code : '-'
    existing_vendor_object.mobile_number = currentInfo.vendor_info.owner_number ? currentInfo.vendor_info.owner_number : '-'
    existing_vendor_object.tax_type = currentInfo.vendor_info.gst_tax_code ? currentInfo.vendor_info.gst_tax_code : '-'
    existing_vendor_object.bank_account_number = currentInfo.vendor_info.bank_acc_number ? currentInfo.vendor_info.bank_acc_number : '-'
    existing_vendor_object.pan_card_number = currentInfo.vendor_info.pan_card_number ? currentInfo.vendor_info.pan_card_number : '-'
    existing_vendor_object.status = currentInfo.vendor_info.sap_status ? currentInfo.vendor_info.sap_status : '-'
    existing_vendor_object.city = currentInfo.vendor_info.city ? currentInfo.vendor_info.city : '-'
    existing_vendor_object.aadhar_card_number = currentInfo.vendor_info.aadhar_card_number ? currentInfo.vendor_info.aadhar_card_number : '-'

    let old_vendor = JSON.stringify(existing_vendor_object)

    /* New Vendor Info */
    let new_vendor_object = {}
    new_vendor_object.vendor_name1 = panData.NAME1 ? panData.NAME1 : '-'
    new_vendor_object.vendor_name2 = panData.NAME2 ? panData.NAME2 : '-'
    new_vendor_object.vendor_code = panData.LIFNR ? panData.LIFNR : '-'
    new_vendor_object.mobile_number = panData.TELF1 ? panData.TELF1 : '-'
    new_vendor_object.tax_type = panData.WITHT ? panData.WITHT : '-'
    new_vendor_object.bank_account_number = panData.BANKN ? panData.BANKN : '-'
    new_vendor_object.pan_card_number = panData.J_1IPANNO ? panData.J_1IPANNO : '-'
    new_vendor_object.status = panData.STATUS	 ? panData.STATUS	 : '-'
    new_vendor_object.city = panData.CITY ? panData.CITY : '-'
    new_vendor_object.aadhar_card_number = panData.IDNUMBER	 ? panData.IDNUMBER	 : '-'

    let new_vendor = JSON.stringify(new_vendor_object)

    formData.append('old_vendor_info', old_vendor)
    formData.append('new_vendor_info', new_vendor) 

    formData.append('vch_request_remarks', values.remarks || '')
    formData.append('vch_requested_by', user_id)
    formData.append('vch_status', 2) /* 2 - Request Given */

  
    console.log(formData)
    console.log(values)
    setFetch(false)
    VendorCreationService.updateVendorChangeRequestData(formData)
      .then((res) => {
        setFetch(true)
        console.log(res)
        if (res.status == 200) {
            Swal.fire({
                title: "Created!",
                text: "Vendor Change Request has been Created.",
                icon: "success"
            }).then(function () {
                navigation('/tsvchreq')
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
                text: "Vendor Change Request Creation Failed.",
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

  const [vendor, setVendor] = useState(false) // Vendor Available
  const [panData, setPanData] = useState({}) 

  const getPanData = (e) => {
    e.preventDefault()
    console.log(values.panNumber,'panNumbernew')
    
    if (!values.panNumber || values.panNumber == '') {
      setFetch(true)
      toast.warning('Pan Number Required')
      return false
    }

    if (!/^[A-Z]{5}[\d]{4}[A-Z]{1}$/.test(values.panNumber)) {
      setFetch(true)
      toast.warning('PAN NUMBER Must Like "CRCPK0712L"')
      return false
    }

    // PanDataService.getPanData(values.panNumber).then((res) => {
    PanDataService.getMultiVendorInfoByPan(values.panNumber).then((res) => {
        console.log(res,'getPanData')
        // let sap_response = res.data[0]
        setFetch(true) 
        if (res.status == 200 && res.data != '') {
            setVendor(true)
            setPanGroupData(res.data)
            // setPanData(sap_response) 
            toast.success('Pan Details Detected!')
        } else {
            toast.warning('No Pan Details Detected..')
            setPanGroupData([])
            // setPanData({}) 
            setVendor(false)
        }        
    })
    .catch((error) => {
        setFetch(true) 
        Swal.fire({
          title: 'Server Connection Failed. Kindly contact Server Admin.!', 
          text:  error.message,
          icon: "warning",
          confirmButtonText: "OK",
        }).then(function () {
          // window.location.reload(false)
        })  
    })  
  }

  const vendorClear = () => {
    // setpanNumber('')
    setPanGroupData([])
    setPanData({})
    // setTDS('0')
    // setErrorsTdsType('')
    setVendorCode('0')
    setVendor(false)
  }

  const REQ = () => <span className="text-danger"> * </span>

  const getPanChildData = (e) => {
    e.preventDefault()
    let res = e.target.value
    setVendorCode(res)

    console.log(res,'getPanChildData-res')

    panGroupData.map((vv,kk)=>{
      if(vv.LIFNR == res){
        console.log(vv,'getPanChildData')
        setPanData(vv)
        // setTDS(vv.WITHT)
        // setErrorsTdsType('')
      }
    })
    if(res == 0){
      // setErrorsTdsType('Required')
      // setTDS('0')
      setPanData({})
    }
  }

  const tdsSetValue = (vall) => {
    console.log(vall,'tdsSetValue')
    if(vall == 'P' || vall == 'H'){
      return 'T7'
    } else{
      return 'T2'
    }
  }

  const [tdsChangePAN,setTdsChangePAN] = useState(false)
  const [tdsChangePANValue,setTdsChangePANValue] = useState('')

  useEffect(()=>{
    console.log('111111EST')
    if(tdsChangePAN){
      console.log('222222EST')
      console.log(errors,'errorsEST')
      if(errors.panNumber){
        values.GSTtax = ''
        console.log('333333EST')
      } else {
        console.log('444444EST')
        values.GSTtax = tdsChangePANValue
      }

      console.log(values.GSTtax,'666666EST')
    }
  },[tdsChangePAN,values.GSTtax,errors.panNumber])

  const tdsChangeByPAN = (ev,type) => {
    if(type == 1){
      let val = ev.target.value
      // isTouched.GSTtax = true
      console.log(val,'tdsChangeByPAN1')
      let pan_4th_digit = val.substr(3,1)
      console.log(pan_4th_digit,'pan_4th_digit1')
      let tds_val = tdsSetValue(pan_4th_digit)
      console.log(tds_val,'tds_val1')
      values.GSTtax = tds_val
      setTdsChangePANValue(tds_val)
      setTdsChangePAN(true)      
    } else {
      console.log(ev,'tdsChangeByPAN2')
      let pan_4th_digit = ev.substr(3,1)
      console.log(pan_4th_digit,'pan_4th_digit2')
      let tds_val = tdsSetValue(pan_4th_digit)
      console.log(tds_val,'tds_val2')
      return tds_val
    }
    
  }

  useEffect(() => {
    DefinitionsListApi.visibleDefinitionsListByDefinition(3).then((response) => {
      let tableData = response.data.data
      const filterData = tableData.filter((data) => (data.definition_list_status == 1))
      setTaxType(filterData)
    })
    }, [])

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
                </CRow>
                  <ColoredLine color="red" />
                  <CRow hidden>
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

                   {currentInfo.vendor_info && (
                    <CRow>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="Vnum">Vendor Code</CFormLabel>
                        <CFormInput
                          size="sm"
                          id="Vnum"
                          value={currentInfo.vendor_info.vendor_code}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="Vnum">Vendor Name</CFormLabel>
                        <CFormInput
                          size="sm"
                          id="Vnum"
                          value={currentInfo.vendor_info.owner_name}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="Vnum">Vendor Name 2</CFormLabel>
                        <CFormInput
                          size="sm"
                          id="Vnum"
                          value={currentInfo.vendor_info.owner_name2 || '-'}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="Vnum">Vendor Mobile No.</CFormLabel>
                        <CFormInput
                          size="sm"
                          id="Vnum"
                          value={currentInfo.vendor_info.owner_number ? currentInfo.vendor_info.owner_number : '-'}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="Vnum">Vendor Aadhar No.</CFormLabel>
                        <CFormInput
                          size="sm"
                          id="Vnum"
                          value={currentInfo.vendor_info.aadhar_card_number ? currentInfo.vendor_info.aadhar_card_number : '-'}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="Vnum">TDS Tax Type</CFormLabel>
                        <CFormInput
                          size="sm"
                          id="Vnum"
                          value={`${tdsTaxCodeName(currentInfo.vendor_info.gst_tax_code)}`}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="Vnum">Vendor Bank Account No.</CFormLabel>
                        <CFormInput
                          size="sm"
                          id="Vnum"
                          value={currentInfo.vendor_info.bank_acc_number ? currentInfo.vendor_info.bank_acc_number : '-'}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="Vnum">City</CFormLabel>
                        <CFormInput
                          size="sm"
                          id="Vnum"
                          value={currentInfo.vendor_info.city || '-'}
                          readOnly
                        />
                      </CCol>
                    </CRow>
                  )} 
                  <ColoredLine color="red" />
                <CRow hidden>
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
                </CRow>
              <CRow>                   
                
                <CCol xs={12} md={3}>
                  <CFormLabel htmlFor="panNumber">
                    PAN Card Number
                    <X />{' '}
                    {errors.panNumber && (
                        <span className="small text-danger">{errors.panNumber}</span>
                    )}
                  </CFormLabel>
                  <CInputGroup>
                    <CFormInput
                      size="sm"
                      id="panNumber"
                      className={`${errors.panNumber && 'is-invalid'}`}
                      name="panNumber"
                      maxLength={10}
                      value={values.panNumber}
                      readOnly = {panGroupData.length > 0 ? true : false}
                      onFocus={onFocus}
                      onBlur={onBlur} 
                      onChange={(e) => {
                        handleChange(e)                      
                        tdsChangeByPAN(e,1)
                      }}
                    />
                    <CInputGroupText className="p-0">
                      {panGroupData.length == 0 ? (
                        <CButton 
                          size="sm" 
                          color="success" 
                          onClick={(e) => {
                            setFetch(false) 
                            getPanData(e)}
                          }
                        >
                          <i className="fa fa-check px-1"></i>
                        </CButton>
                        ) : (
                          <CButton 
                            size="sm" 
                            color="danger" 
                            onClick={(e) => vendorClear()}
                          >
                            <i className="fa fa-refresh px-1"></i>
                          </CButton>
                        )
                      }
                    </CInputGroupText>
                  </CInputGroup>
                </CCol>
                {/* <CCol xs={12} md={3} className='mt-4'>
                    <CButton
                        size="sm"
                        color="success"
                        className="mx-1 px-2 text-white"
                        onClick={(e) => {
                            setFetch(false) 
                            getPanData(e)
                        }}
                        disabled={errors.panNumber || values.panNumber == ''}
                    >
                        SAP Vendor Check
                    </CButton>
                </CCol> */}

                {panGroupData.length > 0 && (
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="pan_data">
                      PAN Data <REQ />{' '} 
                    </CFormLabel>
                    <CFormSelect
                      size="sm"
                      name="pan_data" 
                      value={vendorCode} 
                      onChange={(e) => getPanChildData(e)}
                      aria-label="Small select example"
                      id="gstType"
                    >
                      <option value="0">Select...</option>
                      {panGroupData.map(({ LIFNR, NAME1 }) => {
                        return (
                          <>
                            <option key={LIFNR} value={LIFNR}>
                              {`${LIFNR} - ${NAME1}`}
                            </option>
                          </>
                        )
                      })}
                    </CFormSelect>
                  </CCol>
                )}

                {vendor && (
                    <CRow>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="Vnum">Vendor Code</CFormLabel>
                        <CFormInput
                          size="sm"
                          id="Vnum"
                          value={panData.LIFNR ? panData.LIFNR : '-'}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="Vnum">Vendor Name</CFormLabel>
                        <CFormInput
                          size="sm"
                          id="Vnum"
                          value={panData.NAME1 ? panData.NAME1 : '-'}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="Vnum">Vendor Name 2</CFormLabel>
                        <CFormInput
                          size="sm"
                          id="Vnum"
                          value={panData.NAME2 ? panData.NAME2 : '-'}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="Vnum">Vendor Mobile No.</CFormLabel>
                        <CFormInput
                          size="sm"
                          id="Vnum"
                          value={panData.TELF1 ? panData.TELF1 : '-'}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="Vnum">Vendor Aadhar No.</CFormLabel>
                        <CFormInput
                          size="sm"
                          id="Vnum"
                          value={panData.IDNUMBER ? panData.IDNUMBER : '-'}
                          readOnly
                        />
                      </CCol>
                      
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="Vnum">TDS Tax Type</CFormLabel>
                        <CFormInput
                          size="sm"
                          id="Vnum"
                          value={`${tdsTaxCodeName(panData.WITHT)}`}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="Vnum">Vendor Bank Account No.</CFormLabel>
                        <CFormInput
                          size="sm"
                          id="Vnum"
                          value={panData.BANKN ? panData.BANKN : '-'}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="Vnum">City</CFormLabel>
                        <CFormInput
                          size="sm"
                          id="Vnum"
                          value={panData.CITY ? panData.CITY : '-'}
                          readOnly
                        />
                      </CCol>
                       
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="remarks">
                            VCH Request Remarks
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
                  <Link to="/tsvchreq">
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
                  {vendor && (
                    <CCol
                        className=""
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
                        disabled={acceptBtn}
                        // onClick={() => addVendorRequest(2)}
                        onClick={() => {
                            addVendorRequest(2)
                            // setFetch(false)
                            // addVendorConfirmation(4)
                        }}
                        >
                        Submit
                        </CButton>
                        
                    </CCol>
                  )}
                </CRow>
                {/* Row Eight------------------------- */}
              </CForm>
               
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

export default tsvchreqChild

