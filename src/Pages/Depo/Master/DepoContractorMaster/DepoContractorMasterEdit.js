/* eslint-disable prettier/prettier */
import {
  CButton,
  CCard,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CTabContent,
  CTabPane,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CCardImage,
  CAlert,
  CFormSelect,
} from '@coreui/react'
import { React, useEffect, useState } from 'react'
import useForm from 'src/Hooks/useForm.js'
import Loader from 'src/components/Loader'
import { useParams } from 'react-router-dom'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import LocationListComponent from 'src/components/commoncomponent/LocationListComponent'
import DepoContractorMasterService from 'src/Service/Depo/Master/DepoContractorMasterService'
import DepoContractorValidation from 'src/Utils/Depo/Contractor/DepoContractorValidation'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'

const DepoContractorMasterEdit = () => {
  const { id } = useParams()
  const REQ = () => <span className="text-danger"> * </span>

  const formValues = {
    contractorNumber: '',
    contractorCode: '',
    contractorOwnerName: '',
    contractorName: '',
    contractorAddress: '',
    contractorLocation: '',
    contractorPhoto: '',
    freightType: '',
    getType: '',
    tdsType: ''
  }

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
  let page_no = LogisticsProScreenNumberConstants.DepoModuleScreens.Depo_Contractor_Master

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

  const [locationError, setLocationError] = useState(true)
  const [submitBtn, setSubmitBtn] = useState(true)
  const [fetch, setFetch] = useState(false)
  const [tdsTaxData, setTdsTaxData] = useState(false)
  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})
  const [contractorCopy, setContractorCopy] = useState(true)
  const [contractorCopyDel, setContractorCopyDel] = useState(false)
  const [gstTaxTermsData, setGstTaxTermsData] = useState([])

  const [singleContractorInfo, setSingleContractorInfo] = useState([])

  const { values, errors, handleChange, handleMultipleChange, onFocus, handleSubmit, onBlur } = useForm(
    addNewContractor,
    DepoContractorValidation,
    formValues
  )

  useEffect(() => {

    if(singleContractorInfo) {
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

      if (condition_check) {
        setSubmitBtn(false)
      } else {
        setSubmitBtn(true)
      }
    }
  }, [values, errors, singleContractorInfo])

  const [contractorMasterData, setContractorMasterData] = useState([])

  const contractorAlreadyExistInContractorMaster = (code) => {
    let condition = 0
    contractorMasterData.map((vb,lb)=>{
      if(vb.contractor_code == code){
        condition = 1
      }
    })

    return condition
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

   //section for getting Depo Contractor Master from database
   DepoContractorMasterService.getDepoContractors().then((res) => {
    setFetch(true)
    console.log(res.data.data,'getDepoContractors')
    setContractorMasterData(res.data.data)
  })

 }, [])

  function addNewContractor() {

    if(singleContractorInfo.contractor_code != values.contractorCode && contractorAlreadyExistInContractorMaster(values.contractorCode) === 1){
      toast.warning('Updated Contractor Code was already exists in Contractor Master..!')
      return false
    } 

    setFetch(false)
    const formData = new FormData()

    formData.append('_method', 'PUT')

    formData.append('contractor_number', values.contractorNumber)
    formData.append('contractor_owner_name', values.contractorOwnerName)
    formData.append('contractor_name', values.contractorName)
    formData.append('contractor_code', values.contractorCode)
    formData.append('contractor_location', values.contractorLocation)
    formData.append('contractor_address', values.contractorAddress)
    formData.append('contractor_owner_photo', values.contractorPhoto)
    formData.append('freight_type', values.freightType)
    formData.append('tds_tax_type', values.tdsType)
    formData.append('gst_tax_type', values.gstType)
    formData.append('updated_by', user_id)

    DepoContractorMasterService.updateContractors(id, formData)
    .then((res) => {
      setFetch(true)
      if (res.status === 200) {
        toast.success('Contractor Updated Successfully!')

        setTimeout(() => {
          navigation('/DepoContractorMasterTable')
        }, 1000)
      }
    })
    .catch((error) => {
      setFetch(true)
      for (let value of formData.values()) {
      }
      var object = error.response.data.errors
      var output = ''
      for (var property in object) {
        output += '*' + object[property] + '\n'
      }
      setError(output)
      setErrorModal(true)
    })

  }

  useEffect(() => {

    //section to fetch single Contractor info
    DepoContractorMasterService.getContractorsById(id).then((res) => {
      setFetch(true)
      let contractor_data = res.data.data
      console.log(res.data.data,'Contractor info')
      values.contractorNumber = contractor_data.contractor_number
      values.contractorOwnerName = contractor_data.contractor_owner_name
      values.contractorName = contractor_data.contractor_name
      values.contractorCode = contractor_data.contractor_code
      values.contractorAddress = contractor_data.contractor_address
      values.contractorLocation = contractor_data.contractor_location
      values.contractorPhoto = contractor_data.contractor_owner_photo
      values.freightType = contractor_data.freight_type
      values.gstType = contractor_data.gst_tax_type
      values.tdsType = contractor_data.tds_tax_type
      setSingleContractorInfo(contractor_data)
    })

  }, [id])

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
                          <CFormLabel htmlFor="contractorName">
                            Contractor Name <REQ />{' '}
                            {errors.contractorName && (
                              <span className="small text-danger">{errors.contractorName}</span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            name="contractorName"
                            size="sm"
                            maxLength={30}
                            id="contractorName"
                            onChange={handleChange}
                            value={values.contractorName}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            placeholder=""
                          />
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="contractorCode">
                            Contractor Code <REQ />{' '}
                            {errors.contractorCode && (
                              <span className="small text-danger">{errors.contractorCode}</span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            name="contractorCode"
                            size="sm"
                            maxLength={8}
                            id="contractorCode"
                            onChange={handleChange}
                            value={values.contractorCode}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            placeholder=""
                          />
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="contractorOwnerName">
                            Contractor Owner Name <REQ />{' '}
                            {errors.contractorOwnerName && (
                              <span className="small text-danger">{errors.contractorOwnerName}</span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            name="contractorOwnerName"
                            size="sm"
                            maxLength={30}
                            id="contractorOwnerName"
                            onChange={handleChange}
                            value={values.contractorOwnerName}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            placeholder=""
                          />
                        </CCol>

                        <CCol md={3}>
                          <CFormLabel htmlFor="contractorNumber">
                          Contractor Mobile Number <REQ />{' '}
                            {errors.contractorNumber && (
                              <span className="small text-danger">{errors.contractorNumber}</span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            name="contractorNumber"
                            size="sm"
                            maxLength={10}
                            id="contractorNumber"
                            onChange={handleChange}
                            value={values.contractorNumber}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            placeholder=""
                          />
                        </CCol>
                      </CRow>

                      <CRow className="mb-md-1">
                        <CCol md={3}>
                          <CFormLabel htmlFor="contractorAddress">
                            Contractor Address <REQ />{' '}
                            {errors.contractorAddress && (
                              <span className="small text-danger">{errors.contractorAddress}</span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            name="contractorAddress"
                            size="sm"
                            maxLength={200}
                            id="contractorAddress"
                            onChange={handleChange}
                            value={values.contractorAddress}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            placeholder=""
                          />
                        </CCol>
                        <CCol md={3}>
                          <CFormLabel htmlFor="freightType">
                            Freight Type <REQ />{' '}
                            {errors.freightType && (
                              <span className="small text-danger">{errors.freightType}</span>
                            )}
                          </CFormLabel>
                          <CFormSelect
                            size="sm"
                            name="freightType"
                            onChange={handleChange}
                            onFocus={onFocus}
                            value={values.freightType}
                            className={`mb-1 ${errors.freightType && 'is-invalid'}`}
                            aria-label="Small select example"
                            id="freightType"
                          >
                            <option value="0">Select ...</option>
                            <option value="1">Budget</option>
                            <option value="2">Actual</option>
                          </CFormSelect>
                        </CCol>
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
                            {errors.tdsType && (
                              <span className="small text-danger">{errors.tdsType}</span>
                            )}
                          </CFormLabel>
                          <CFormSelect
                            size="sm"
                            name="tdsType"
                            onChange={handleChange}
                            onFocus={onFocus}
                            value={values.tdsType}
                            className={`mb-1 ${errors.tdsType && 'is-invalid'}`}
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
                        <CCol md={3}>
                          <CFormLabel htmlFor="contractorPhoto">
                            Contractor Photo
                            {errors.contractorPhoto && (
                              <span className="small text-danger">{errors.contractorPhoto}</span>
                            )}
                          </CFormLabel>
                          {contractorCopy ? (
                            <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                              <span className="float-start">
                                <i
                                  className="fa fa-eye"
                                  onClick={() => setContractorCopyDel(true)}
                                  aria-hidden="true"
                                ></i>{' '}
                                &nbsp;View
                              </span>
                              <span className="float-end">
                                <i
                                  className="fa fa-trash"
                                  aria-hidden="true"
                                  onClick={() => setContractorCopy(false)}
                                ></i>
                              </span>
                            </CButton>
                          ) : (
                            <CFormInput
                              onBlur={onBlur}
                              onChange={handleChange}
                              type="file"
                              accept=".jpg,.jpeg,.png,.pdf"
                              name="contractorPhoto"
                              size="sm"
                              id="contractorPhoto"
                            />
                          )}
                        </CCol>
                        <CCol md={6}>
                          <CFormLabel htmlFor="contractorLocation">
                            Contractor Location <REQ />{' '}
                            {locationError && (
                              <span className="small text-danger">Minimum One Location Required</span>
                            )}
                          </CFormLabel>
                          <LocationListComponent
                            size="sm"
                            name="contractorLocation"
                            id="contractorLocation"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleMultipleChange}
                            selectedValue={values.contractorLocation}
                            isMultiple={true}
                            className={`mb-1 ${errors.contractorLocation && 'is-invalid'}`}
                            label="Select Contractor Location"
                            noOptionsMessage="No Location found"
                          />
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
                            disabled={submitBtn}
                            onClick={addNewContractor}
                          >
                            UPDATE
                          </CButton>
                          <Link to={'/DepoContractorMasterTable'}>
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
              </CCard>
              {/*Contractor Copy model*/}
              <CModal visible={contractorCopyDel} backdrop="static" onClose={() => setContractorCopyDel(false)}>
                <CModalHeader>
                  <CModalTitle>Contractor Copy</CModalTitle>
                </CModalHeader>
                <CModalBody>
                {singleContractorInfo.contractor_owner_photo && !singleContractorInfo.contractor_owner_photo.includes('.pdf') ? (
                        <CCardImage orientation="top" src={singleContractorInfo.contractor_owner_photo} />
                      ) : (
                        <iframe
                          orientation="top"
                          height={500}
                          width={475}
                          src={singleContractorInfo.contractor_owner_photo}
                        ></iframe>
                      )}
                </CModalBody>
                <CModalFooter>
                  <CButton color="secondary" onClick={() => setContractorCopyDel(false)}>
                    Close
                  </CButton>
                </CModalFooter>
              </CModal>
              {/*Contractor Copy model*/}
              {/* Error Modal Section */}
              <CModal visible={errorModal} backdrop="static" onClose={() => setErrorModal(false)}>
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
            </>) : (<AccessDeniedComponent />
          )}
        </>
      )}
    </>
  )
}

export default DepoContractorMasterEdit
