/* eslint-disable prettier/prettier */
import {
  CButton,
  CCard,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CTabContent,
  CTabPane,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import { React, useEffect, useState } from 'react'
import useForm from 'src/Hooks/useForm.js'
import { Link, useNavigate } from 'react-router-dom'
import Loader from 'src/components/Loader'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import LocationListComponent from 'src/components/commoncomponent/LocationListComponent'
import IfoodsVendorValidation from 'src/Utils/Ifoods/Vendor/IfoodsVendorValidation'
import IfoodsVendorMasterService from 'src/Service/Ifoods/Master/IfoodsVendorMasterService'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import VendorCreationService from 'src/Service/VendorCreation/VendorCreationService'
import VendorAvaiable from './Segments/VendorAvaiable'
import VendorNotAvailable from './Segments/VendorNotAvailable'
import PanDataService from 'src/Service/SAP/PanDataService'
const IfoodsVendorMaster = () => {
  const formValues = {
    panNumber: '',
    vendor_code: '',
    vendor_name: '',
    location_id: '',
    freight_type: '',
    vendor_address: '',
    vendor_contact_no: '',
    gst_tax_type: '',
    tds_tax_type: '',
  }
  const [WITHT, setWITHT] = useState('')
  const [panNumber, setPanNumber] = useState('')
  const [panData, setPanData] = useState({})
  const [readOnly, setReadOnly] = useState(true)
  const [vendor, setVendor] = useState(false) // Vendor Available
  const [write, setWrite] = useState(false)
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
  let page_no = LogisticsProScreenNumberConstants.IfoodsModuleScreens.Ifoods_Vendor_Master

  useEffect(() => {
    if (
      user_info.is_admin == 1 ||
      JavascriptInArrayComponent(page_no, user_info.page_permissions)
    ) {
      console.log('screen-access-allowed')
      setScreenAccess(true)
    } else {
      console.log('screen-access-not-allowed')
      setScreenAccess(false)
    }
  }, [])
  /* ==================== Access Part End ========================*/

  const REQ = () => <span className="text-danger"> * </span>
  const [fetch, setFetch] = useState(false)
  const [tdsTaxData, setTdsTaxData] = useState(false)
  const [submitBtn, setSubmitBtn] = useState(true)
  const [locationError, setLocationError] = useState(true)

  const {
    values,
    errors,
    handleChange,
    handleMultipleChange,
    onFocus,
    handleSubmit,
    enableSubmit,
    onBlur,
  } = useForm(addNewVendor, IfoodsVendorValidation, formValues)
  const [error, setError] = useState({})
  const [errorModal, setErrorModal] = useState(false)
  useEffect(() => {
    setFetch(true)
    
    let location_id = !errors.location_id && values.location_id.length > 0
    let freight_type = !errors.freight_type && values.freight_type.length != 0
    let vendor_address = !errors.vendor_address && values.vendor_address
    let vendor_contact_no = !errors.vendor_contact_no && values.vendor_contact_no
    let vendor_fassai = !errors.vendor_fassai && values.vendor_fassai
    let gprs_tracker = !errors.gprs_tracker && values.gprs_tracker != 0
    let gst_tax_type = !errors.gst_tax_type && values.gst_tax_type && values.gst_tax_type != 0
    let tds_tax_type = !errors.tds_tax_type && values.tds_tax_type && values.tds_tax_type != 0

    let condition_check =
      location_id &&
      freight_type &&
      vendor_address &&
      vendor_contact_no &&
      vendor_fassai &&
      gprs_tracker &&
      gst_tax_type &&
      tds_tax_type

    if (location_id) {
      setLocationError(false)
    } else {
      setLocationError(true)
    }
    console.log(location_id, 'Location')
    console.log(condition_check, 'condition_check')
    if (condition_check) {
      setSubmitBtn(false)
    } else {
      setSubmitBtn(true)
    }
  }, [values, errors])

  useEffect(() => {
    /* section for getting TDS Tax Type Lists from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(3).then((response) => {
      let viewData = response.data.data
      console.log(viewData, 'viewData')
      setTdsTaxData(viewData)
    })
  }, [])

  // GET PAN DETAILS FROM SAP
  const getPanData = (e) => {
    // setFetch(false)
    e.preventDefault()
    // let panDetail =
    console.log(values.panNumber)
    PanDataService.getPanData(values.panNumber).then((res) => {
      setFetch(true)
      console.log(res)
      if (res.status == 200 && res.data != '') {
        setPanData(res.data[0])
        setWITHT(res.data[0].WITHT)
        toast.success('Pan Details Detected!')
        setVendor(true)
      } else {
        toast.warning('No Pan Details Detected! Fill Up The Fields')
        setVendor(false)
      }
    })

    setReadOnly(true)
    setWrite(true)
  }

  function addNewVendor() {
    console.log(panData)
    if (panData.LIFNR) {
      VendorCreationService.getVendorsByPan().then((res) => {
        console.log(panData)
        let tableData = res.data.data
        var vendor_info = []

        const filterData = tableData.filter((data) => data.pan_card_number == panData.J_1IPANNO)
        console.log(filterData)
        let vendor_available = filterData.length == 0 ? false : true
        if (vendor_available) {
          vendor_info.push(filterData[filterData.length - 1])
        }
        const formData = new FormData()
        formData.append(
          'pan_number',
          vendor_available ? vendor_info[0].pan_card_number : panData ? panData.J_1IPANNO : ''
        )
        // formData.append('vendor_name', vendor_info.vendor_name)
        formData.append(
          'vendor_name',
          vendor_available ? vendor_info[0].vendor_name : panData ? panData.NAME1 : ''
        )
        // formData.append('vendor_code', vendor_info.vendor_code)
        formData.append(
          'vendor_code',
          vendor_available ? vendor_info[0].vendor_code : panData ? panData.LIFNR : ''
        )

        formData.append('location_id', values.location_id)
        formData.append('freight_type', values.freight_type)
        formData.append('vendor_address', values.vendor_address)
        formData.append('vendor_contact_no', values.vendor_contact_no)
        formData.append('vendor_fassai', values.vendor_fassai)
        formData.append('gprs_tracker', values.gprs_tracker)
        formData.append('gst_tax_type', values.gst_tax_type)
        formData.append('tds_tax_type', values.tds_tax_type)
        formData.append('created_by', user_id)

        IfoodsVendorMasterService.createIfoodsVendor(formData).then((res) => {
          if (res.status === 201) {
            setFetch(true)
            toast.success('Vendor Created Successfully!')

            setTimeout(() => {
              navigation('/IfoodsVendorMasterTable')
            }, 1000)
          } else if (res.status === 200) {
            toast.warning('Vendor Code Already Exists')
            navigation('/IfoodsVendorMasterTable')
          }
        })
      })
    } else {
      setFetch(false)
      const formData = new FormData()
      formData.append('pan_number', values.panNumber)
      formData.append('vendor_code', values.vendor_code)
      formData.append('vendor_name', values.vendor_name)
      formData.append('location_id', values.location_id)
      formData.append('freight_type', values.freight_type)
      formData.append('vendor_address', values.vendor_address)
      formData.append('vendor_contact_no', values.vendor_contact_no)
      formData.append('vendor_fassai', values.vendor_fassai)
      formData.append('gprs_tracker', values.gprs_tracker)
      formData.append('gst_tax_type', values.gst_tax_type)
      formData.append('tds_tax_type', values.tds_tax_type)
      formData.append('created_by', user_id)

      IfoodsVendorMasterService.createIfoodsVendor(formData)
        .then((res) => {
          if (res.status === 201) {
            setFetch(true)
            toast.success('Vendor Created Successfully!')

            setTimeout(() => {
              navigation('/IfoodsVendorMasterTable')
            }, 1000)
          } else if (res.status === 200) {
            toast.warning('Vendor Code Already Exists')
            navigation('/IfoodsVendorMasterTable')
          }
        })
        .catch((error) => {
          setFetch(true)
          for (let value of formData.values()) {
            console.log(value)
          }
          console.log(error)
          var object = error.response.data.errors
          var output = ''
          for (var property in object) {
            output += '*' + object[property] + '\n'
          }
          setError(output)
          setErrorModal(true)
        })
    }
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
                          <CFormLabel htmlFor="panNumber">
                            PAN Card Number
                            <REQ />{' '}
                            {errors.panNumber && (
                              <span className="small text-danger">{errors.panNumber}</span>
                            )}
                          </CFormLabel>
                          <CInputGroup>
                            <CFormInput
                              size="sm"
                              name="panNumber"
                              id="panNumber"
                              maxLength={10}
                              value={values.panNumber}
                              onFocus={onFocus}
                              onBlur={onBlur}
                              onChange={handleChange}
                            />
                            <CInputGroupText className="p-0">
                              <CButton size="sm" color="success" onClick={(e) => getPanData(e)}>
                                <i className="fa fa-check px-1"></i>
                              </CButton>
                            </CInputGroupText>
                          </CInputGroup>
                        </CCol>
                        {vendor ? (
                          <VendorAvaiable panData={panData} />
                        ) : (
                          <VendorNotAvailable
                            onFocus={onFocus}
                            onBlur={onBlur}
                            handleChange={handleChange}
                            values={values}
                            errors={errors}
                          />
                        )}
                        <CCol md={3}>
                          <CFormLabel htmlFor="vendor_contact_no">Vendor Mobile Number
                          <REQ />{' '}
                            {errors.vendor_contact_no && (
                              <span className="small text-danger">{errors.vendor_contact_no}</span>
                            )}
                          
                          </CFormLabel>
                          <CFormInput
                            name="vendor_contact_no"
                            size="sm"
                            maxLength={10}
                            id="vendor_contact_no"
                            onChange={handleChange}
                            value={values.vendor_contact_no}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            placeholder=""
                          />
                        </CCol>
                      </CRow>
                      <CRow className="mb-md-1">
                      <CCol md={3}>
                          <CFormLabel htmlFor="vendor_address">
                            Vendor Address <REQ />{' '}
                            {errors.vendor_address && (
                              <span className="small text-danger">{errors.vendor_address}</span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            name="vendor_address"
                            size="sm"
                            maxLength={200}
                            id="vendor_address"
                            onChange={handleChange}
                            value={values.vendor_address}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            placeholder=""
                          />
                        </CCol>
                        <CCol md={3}>
                          <CFormLabel htmlFor="freight_type">
                            Freight Type <REQ />{' '}
                            {errors.freightType && (
                              <span className="small text-danger">{errors.freight_type}</span>
                            )}
                          </CFormLabel>
                          <CFormSelect
                            size="sm"
                            name="freight_type"
                            onChange={handleChange}
                            onFocus={onFocus}
                            value={values.freight_type}
                            className={`mb-1 ${errors.freight_type && 'is-invalid'}`}
                            aria-label="Small select example"
                            id="freight_type"
                          >
                            <option value="0">Select ...</option>
                            <option value="1">Budget</option>
                            <option value="2">Actual</option>
                          </CFormSelect>
                        </CCol>
                        <CCol md={3}>
                          <CFormLabel htmlFor="vendor_fassai">FSSAI License
                          <REQ />{' '}
                            {errors.vendor_fassai && (
                              <span className="small text-danger">{errors.vendor_fassai}</span>
                            )}
                          
                          
                          </CFormLabel>
                          <CFormInput
                            name="vendor_fassai"
                            size="sm"
                           // maxLength={10}
                            id="vendor_fassai"
                            onChange={handleChange}
                            value={values.vendor_fassai}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            placeholder="FSSAI License"
                          />
                        </CCol>
                        <CCol md={3}>
                          <CFormLabel htmlFor="gprs_tracker">
                          GPRS Tracker <REQ />{' '}
                            {errors.gprs_tracker && (
                              <span className="small text-danger">{errors.gprs_tracker}</span>
                            )}
                          </CFormLabel>
                          <CFormSelect
                            size="sm"
                            name="gprs_tracker"
                            onChange={handleChange}
                            onFocus={onFocus}
                            value={values.gprs_tracker}
                            className={`mb-1 ${errors.gprs_tracker && 'is-invalid'}`}
                            aria-label="Small select example"
                            id="gprs_tracker"
                          >
                            <option value="0">Select ...</option>
                            <option value="1">Yes</option>
                            <option value="2">No</option>
                          </CFormSelect>
                        </CCol>

                        
                        <CCol md={3}>
                          <CFormLabel htmlFor="gst_tax_type">
                            GST Tax Type <REQ />{' '}
                            {errors.gst_tax_type && (
                              <span className="small text-danger">{errors.gst_tax_type}</span>
                            )}
                          </CFormLabel>
                          <CFormSelect
                            size="sm"
                            name="gst_tax_type"
                            onChange={handleChange}
                            onFocus={onFocus}
                            value={values.gst_tax_type}
                            className={`mb-1 ${errors.gst_tax_type && 'is-invalid'}`}
                            aria-label="Small select example"
                            id="gst_tax_type"
                          >
                            <option value="0">Select...</option>
                            <option value="E0">No Tax</option>
                            <option value="T0">GST ITC Reversal Exp</option>
                            <option value="R5">Input Tax RCM (SGST,CGST @ 2.5% & 2.5%)</option>
                            <option value="F6">Input Tax (SGST,CGST @ 6% & 6%)</option>
                          </CFormSelect>
                        </CCol>
                        <CCol md={3}>
                          <CFormLabel htmlFor="tds_tax_type">
                            TDS Tax Type <REQ />{' '}
                            {errors.tds_tax_type && (
                              <span className="small text-danger">{errors.tds_tax_type}</span>
                            )}
                          </CFormLabel>
                          <CFormSelect
                            size="sm"
                            name="tds_tax_type"
                            onChange={handleChange}
                            onFocus={onFocus}
                            value={values.tds_tax_type}
                            className={`mb-1 ${errors.tds_tax_type && 'is-invalid'}`}
                            aria-label="Small select example"
                            id="tds_tax_type"
                          >
                            <option value="0">Select ...</option>
                            <option value="Empty">No Tax</option>
                            {tdsTaxData &&
                              tdsTaxData.map(({ definition_list_code, definition_list_name }) => {
                                if (definition_list_code) {
                                  return (
                                    <>
                                      <option
                                        key={definition_list_code}
                                        value={definition_list_code}
                                      >
                                        {definition_list_name}
                                      </option>
                                    </>
                                  )
                                }
                              })}
                          </CFormSelect>
                        </CCol>
                        <CCol md={6}>
                          <CFormLabel htmlFor="location_id">
                            Vendor Location <REQ />{' '}
                            {locationError && <span className="small text-danger"></span>}
                          </CFormLabel>
                          <LocationListComponent
                            size="sm"
                            name="location_id"
                            id="location_id"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleMultipleChange}
                            // onChange={handleChange}
                            selectedValue={values.location_id}
                            isMultiple={true}
                            className={`mb-1 ${errors.location_id && 'is-invalid'}`}
                            label="Select Vendor Location"
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
                            // type="submit"
                            disabled={submitBtn}
                            onClick={addNewVendor}
                          >
                            ADD
                          </CButton>
                          <Link to={'/IfoodsVendorMasterTable'}>
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
            </>
          ) : (
            <AccessDeniedComponent />
          )}
        </>
      )}
    </>
  )
}
export default IfoodsVendorMaster
