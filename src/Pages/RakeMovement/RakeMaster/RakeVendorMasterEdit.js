
/* eslint-disable prettier/prettier */
import {
  CAlert,
  CButton,
  CCard,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTabContent,
  CTabPane,
} from '@coreui/react'
import { React, useEffect, useState } from 'react'
import useForm from 'src/Hooks/useForm.js'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Loader from 'src/components/Loader'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import LocationListComponent from 'src/components/commoncomponent/LocationListComponent'
import DepoContractorValidation from 'src/Utils/Depo/Contractor/DepoContractorValidation'
import DepoContractorMasterService from 'src/Service/Depo/Master/DepoContractorMasterService'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import PanDataService from 'src/Service/SAP/PanDataService'
import RakeVendorValidation from 'src/Utils/RakeMovement/RakeVendorValidation'
import RakeVendorMasterService from 'src/Service/RakeMovement/RakeMaster/RakeVendorMasterService'
const RakeVendorMasterEdit = () => {
  const formValues = {
    contractorNumber: '',
    contractorCode: '',
    contractorOwnerName: '',
    contractorName: '',
    contractorAddress: '',
    contractorLocation: '',
    contractorPhoto: '',
    freightType: '',
    gstType: '',
    tdsType: '',
  }

  const { id } = useParams()

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
  let page_no = LogisticsProScreenNumberConstants.RakeModule.Rake_Vendor_Master

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
  const [tdsTaxData, setTdsTaxData] = useState(false)
  const [gstTaxTermsData, setGstTaxTermsData] = useState([])
  const [submitBtn, setSubmitBtn] = useState(true)
  const [locationError, setLocationError] = useState(true)
  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})

  const { values, errors, handleChange, onFocus, handleSubmit, onBlur } = useForm(
    updateOldVendor,
    RakeVendorValidation,
    formValues
  )

  const [vendor, setVendor] = useState(false) // Vendor Available

  const [panData, setPanData] = useState({})
  const [tDS, setTDS] = useState('0')
  const [errorsTdsType, setErrorsTdsType] = useState('')
  const [panNumbernew, setpanNumber] = useState('')
  const [vendorAddress, setVendorAddress] = useState('')
  const [vendorRemarks, setVendorRemarks] = useState('')
  const [vendorName2, setVendorName2] = useState('')
  const handleChangenewpan = event => {
    let panResult = event.target.value.toUpperCase()
    setpanNumber(panResult)
    setPanData({})
  };

  const remarksHandleChange = (event,type) => {

    let result = event.target.value.toUpperCase()
    if(type == 1){
      setVendorAddress(result.trimStart())
    } if(type == 2){
      setVendorRemarks(result.trimStart())
    } else {
      setVendorName2(result.trimStart())
    }

  }

  useEffect(() => {
    //section to fetch single Vendor info
    RakeVendorMasterService.getRakeVendorsById(id).then((res) => {

      let v_info = res.data.data
      console.log(v_info,'getRakeVendorsById')

      let v_pan_info = {}
      v_pan_info.LIFNR = v_info.v_code ? v_info.v_code : ""
      v_pan_info.NAME1 = v_info.v_name ? v_info.v_name : ""
      v_pan_info.NAME2 = v_info.v_name2 ? v_info.v_name2 : ""
      v_pan_info.J_1IPANNO = v_info.v_pan_no ? v_info.v_pan_no : ""
      v_pan_info.TELF1 = v_info.v_mobile_no ? v_info.v_mobile_no : ""
      v_pan_info.IDNUMBER = v_info.v_aadhar_no ? v_info.v_aadhar_no : ""
      v_pan_info.BANKN = v_info.v_bank_ac_no ? v_info.v_bank_ac_no : ""
      v_pan_info.WITHT = v_info.v_tds_tax_type ? v_info.v_tds_tax_type : ""
      setPanData(v_pan_info)
      let v_rem = v_info.v_remarks ? v_info.v_remarks : ""
      let v_name= v_info.v_name2 ? v_info.v_name2 : ""
      let v_addr = v_info.v_address ? v_info.v_address : ""
      let v_pan = v_info.v_pan_no ? v_info.v_pan_no : ""
      let v_tds = v_info.v_tds_tax_type ? v_info.v_tds_tax_type : "0"
      let v_gst = v_info.v_gst_tax_type ? v_info.v_gst_tax_type : "0"
      setVendorRemarks(v_rem)
      setVendorName2(v_name)
      setVendorAddress(v_addr)
      setpanNumber(v_pan)
      setTDS(v_tds)
      values.gstType = v_gst
      setVendor(true)
      setFetch(true)
    })

  }, [id])

  useEffect(() => {
    // setFetch(true)
    let cName = !errors.contractorName && values.contractorName
    let cOwnerName = !errors.contractorOwnerName && values.contractorOwnerName
    let cNumber = !errors.contractorNumber && values.contractorNumber
    let cLocation = !errors.contractorLocation && values.contractorLocation.length > 0
    let cAddress = !errors.contractorAddress && values.contractorAddress
    let cFreight = !errors.freightType && values.freightType &&  values.freightType != 0
    let cTDS = !errors.tdsType && values.tdsType &&  values.tdsType != 0
    let cGST = !errors.gstType && values.gstType &&  values.gstType != 0
    let cCode = !errors.contractorCode && values.contractorCode
    let condition_check = cName && cOwnerName && cNumber && cLocation && cAddress && cFreight && cTDS && cGST && cCode

    if(cLocation){
      setLocationError(false)
    } else {
      setLocationError(true)
    }
    console.log(cLocation,'cLocation')
    console.log(condition_check,'condition_check')
    if (condition_check) {
      setSubmitBtn(false)
    } else {
      setSubmitBtn(true)
    }
  }, [values, errors])

  const handleChangeTds = (e) => {
    let val = e.target.value
    console.log(val,'handleChangeTds')
    if(val == 0){
      setErrorsTdsType('Required')
    } else {
      setErrorsTdsType('')
    }

    setTDS(val)
  }

  useEffect(() => {

    /* section for getting TDS Tax Type Lists from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(3).then((response) => {

     let viewData = response.data.data
      console.log(viewData,'viewData')
     setTdsTaxData(viewData)
   })

    /* section for getting GST Tax Type Lists from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(20).then((response) => {

      let viewData = response.data.data
      console.log(viewData,'setGstTaxTermsData')
      setGstTaxTermsData(viewData)
    })

 }, [])

  function updateOldVendor() {

    if(user_info.is_admin == 1){
      console.log(panData,'panData')
      console.log(panNumbernew,'panNumbernew')
      console.log('v_code', panData.LIFNR)
      console.log('v_name', panData.NAME1)
      console.log('v_name2', vendorName2)
      console.log('v_pan_no', panData.J_1IPANNO)
      console.log('v_mobile_no', panData.TELF1)
      console.log('v_aadhar_no', panData.IDNUMBER)
      console.log('v_bank_ac_no', panData.BANKN)
      console.log('v_address', vendorAddress)
      console.log('v_gst_tax_type', values.gstType)
      console.log('v_tds_tax_type', tDS)
      console.log('v_remarks', vendorRemarks)
      console.log('updated_by', user_id)
    }

    if(!(panData && panData.J_1IPANNO)){
      toast.warning('Pan Number Required')
      return false
    }

    if(panData.J_1IPANNO != panNumbernew){
      toast.warning('Invalid Pan Number')
      return false
    }

    if(values.gstType == 0){
      toast.warning('GST Tax Type Required')
      return false
    }

    if(tDS == 0){
      toast.warning('TDS Tax Type Required')
      return false
    }

    setFetch(false)

    const formData = new FormData()
    formData.append('_method', 'PUT')
    formData.append('v_code', panData.LIFNR)
    formData.append('v_name', panData.NAME1)
    formData.append('v_name2', vendorName2)
    formData.append('v_pan_no', panData.J_1IPANNO)
    formData.append('v_mobile_no', panData.TELF1)
    formData.append('v_aadhar_no', panData.IDNUMBER)
    formData.append('v_bank_ac_no', panData.BANKN)
    formData.append('v_address', vendorAddress)
    formData.append('v_gst_tax_type', values.gstType)
    formData.append('v_tds_tax_type', tDS)
    formData.append('v_remarks', vendorRemarks)
    formData.append('updated_by', user_id)

    RakeVendorMasterService.updateRakeVendors(id, formData).then((res) => {

      if (res.status === 200) {
        setFetch(true)
        toast.success('Vendor Updated Successfully!')

        setTimeout(() => {
          navigation('/RakeVendorMasterTable')
        }, 1000)
      } else if(res.status === 204){
        setFetch(true)
        toast.warning('Vendor Updation Failed!')
      }
    })
    .catch((error) => {
      console.log(error,'error')
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
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="panNumbernew">
                            PAN Card Number
                            <REQ />{' '}
                          </CFormLabel>
                          <CInputGroup>
                            <CFormInput
                              size="sm"
                              name="panNumbernew"
                              id="panNumbernew"
                              maxLength={10}
                              value={panNumbernew}
                              onFocus={onFocus}
                              onBlur={onBlur}
                              onChange={handleChangenewpan}
                              readOnly
                            />
                            {/* <CInputGroupText className="p-0">
                              <CButton size="sm" color="success" onClick={(e) => getPanData(e)}>
                                <i className="fa fa-check px-1"></i>
                              </CButton>
                            </CInputGroupText> */}
                          </CInputGroup>
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="VendorCode">Vendor Code</CFormLabel>
                          <CFormInput name="VendorCode" size="sm" id="VendorCode" value={vendor ? (panData.LIFNR ? panData.LIFNR : '--') : '--'} readOnly />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="ownerName">Vendor Name</CFormLabel>
                          <CFormInput name="ownerName" size="sm" id="ownerName" value={vendor ? (panData.NAME1 ? panData.NAME1 : '--') : '--'} readOnly />
                        </CCol>

                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="ownerMob">Vendor Mobile Number</CFormLabel>
                          <CFormInput name="ownerMob" size="sm" id="ownerMob" value={vendor ? (panData.TELF1 ? panData.TELF1 : '--') : '--'} readOnly />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="aadhar">Aadhar Number</CFormLabel>
                          <CFormInput
                            name="aadhar"
                            size="sm"
                            id="aadhar"
                            maxLength={12}
                            value={vendor ? (panData.IDNUMBER ? panData.IDNUMBER : '--') : '--'}
                            readOnly
                          />
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="bankAcc">Bank Account Number</CFormLabel>
                          <CFormInput
                            name="bankAcc"
                            size="sm"
                            id="bankAcc"
                            maxLength={20}
                            value={vendor ? (panData.BANKN ? panData.BANKN : '--') : '--'}
                            readOnly
                          />
                        </CCol>
                        <CCol md={3}>
                          <CFormLabel htmlFor="vendor_name2">
                            Vendor Name 2
                          </CFormLabel>
                          <CFormTextarea
                            name="vendor_name2"
                            id="vendor_name2"
                            rows="1"
                            onChange={(e) => {remarksHandleChange(e,'3')}}
                            value={vendorName2}
                          ></CFormTextarea> 
                        </CCol>
                        <CCol md={3}>
                          <CFormLabel htmlFor="vendor_address">
                            Vendor Address
                          </CFormLabel>
                          <CFormTextarea
                            name="vendor_address"
                            id="vendor_address"
                            rows="1"
                            onChange={(e) => {remarksHandleChange(e,'1')}}
                            value={vendorAddress}
                          ></CFormTextarea>
                        </CCol>
                        <CCol md={3}>
                          <CFormLabel htmlFor="vendor_remarks">
                            Remarks
                          </CFormLabel>
                          <CFormTextarea
                            name="vendor_remarks"
                            id="vendor_remarks"
                            rows="1"
                            onChange={(e) => {remarksHandleChange(e,'2')}}
                            value={vendorRemarks}
                          ></CFormTextarea>
                          {/* <CFormInput
                            name="contractorAddress"
                            size="sm"
                            maxLength={200}
                            id="contractorAddress"
                            onChange={handleChange}
                            value={values.contractorAddress}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            placeholder=""
                          /> */}
                        </CCol>
                      {/* </CRow>
                      <CRow className="mb-md-1"> */}


                        <CCol md={3}>
                          <CFormLabel htmlFor="gstType">
                            GST Tax Type <REQ />{' '}
                            {errors.gstType && (
                              <span className="small text-danger">{errors.gstType}</span>
                            )}
                          </CFormLabel>
                          <CFormSelect
                            size="sm"
                            name="gstType"
                            onChange={handleChange}
                            onFocus={onFocus}
                            value={values.gstType}
                            className={`mb-1 ${errors.gstType && 'is-invalid'}`}
                            aria-label="Small select example"
                            id="gstType"
                          >
                            <option value="0">Select...</option>
                            {/* <option value="E0">No Tax</option>
                            <option value="T0">GST ITC Reversal Exp</option>
                            <option value="R5">Input Tax RCM (SGST,CGST @ 2.5% & 2.5%)</option>
                            <option value="F6">Input Tax (SGST,CGST @ 6% & 6%)</option> */}
                            {gstTaxTermsData.map(({ definition_list_code, definition_list_name }) => {
                              return (
                                <>
                                  <option key={definition_list_code} value={definition_list_code}>
                                    {definition_list_name}
                                  </option>
                                </>
                              )
                            })}
                          </CFormSelect>
                        </CCol>
                        <CCol md={3}>
                          <CFormLabel htmlFor="tdsType">
                            TDS Tax Type <REQ />{' '}
                            {errorsTdsType && (
                              <span className="small text-danger">{errorsTdsType}</span>
                            )}
                          </CFormLabel>
                          <CFormSelect
                            size="sm"
                            name="tdsType"
                            onChange={(e)=>{
                              handleChangeTds(e)
                            }}
                            value={tDS}
                            aria-label="Small select example"
                            id="tdsType"
                          >
                            <option value="0">Select ...</option>
                            <option value="Empty">No Tax</option>
                            {tdsTaxData && tdsTaxData.map(({ definition_list_code, definition_list_name }) => {
                              if (definition_list_code) {
                                return (
                                  <>
                                    <option key={definition_list_code} value={definition_list_code}>
                                      {definition_list_name}
                                    </option>
                                  </>
                                )
                              }
                            })}
                          </CFormSelect>
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
                            onClick={updateOldVendor}
                          >
                            Update
                          </CButton>
                          <Link to={'/RakeVendorMasterTable'}>
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
              </CCard>
            </>) : (<AccessDeniedComponent />
          )}
        </>
      )}
    </>
  )
}
export default RakeVendorMasterEdit

