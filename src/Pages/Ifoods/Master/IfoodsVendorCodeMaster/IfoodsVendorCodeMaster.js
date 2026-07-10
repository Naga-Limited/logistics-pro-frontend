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
  CButtonGroup,
  CFormCheck,
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
import IfoodsVehicleValidation from 'src/Utils/Ifoods/Vehicle/IfoodsVehicleValidation'

// import VehicleCapacityService from 'src/Service/SmallMaster/Vehicles/VehicleCapacityService'
// import VehicleBodyTypeService from 'src/Service/SmallMaster/Vehicles/VehicleBodyTypeService'
import SearchSelectComponent from 'src/components/commoncomponent/searchSelectComponent'
import IfoodsVendorCodeMasterService from 'src/Service/Ifoods/Master/IfoodsVendorCodeMasterService'
import IfoodsVendorMasterService from 'src/Service/Ifoods/Master/IfoodsVendorMasterService'

const IfoodsVendorCodeMaster = () => {
  const formValues = {
    vendor_id: '',
    vendor_code: '',
    start_date: '',
    end_date: '',
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
  let page_no = LogisticsProScreenNumberConstants.IfoodsModuleScreens.Ifoods_VendorCode_Master

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
  const [submitBtn, setSubmitBtn] = useState(true)
  const [vendor_name, setVendorName] = useState('')
  const [vendorError, setVendorError] = useState(true)
  const [vendorData, setVendorData] = useState([])

  const { values, errors, handleChange, onFocus, handleSubmit, onBlur } = useForm(
    addNewVendorcode,
    IfoodsVehicleValidation,
    formValues
  )

  useEffect(() => {
    //section for getting Vendor Data from database
    IfoodsVendorMasterService.getActiveIfoodsVendors().then((res) => {
      // console.log(res.data.data)
      setVendorData(res.data.data)
    })
  }, [])

  const onChangeFilter = (event) => {
    var selected_value = event.value
    console.log(selected_value, 'selected_value')
    if (selected_value) {
      setVendorName(selected_value)
      setVendorError(false)
    } else {
      setVendorName('')
      setVendorError(true)
    }
  }

  useEffect(() => {
    setFetch(true)

    let vendor_id = !errors.vendor_id && values.vendor_id
    let vendor_code = !errors.vendor_code && values.vendor_code
    let start_date = !errors.start_date && values.start_date
    let end_date = !errors.end_date && values.end_date
    let condition_check = vendor_id && vendor_code && start_date && end_date

    if (condition_check) {
      setSubmitBtn(false)
    } else {
      setSubmitBtn(true)
    }
  }, [values, errors, vendorError])

  function addNewVendorcode() {
    setFetch(false)
    if (!vendor_name || vendor_name === null) {
      setFetch(true)
      toast.warning(' Vendor name is Mandatory ..!')
      return false
    }
    if (!values.vendor_code || values.vendor_code === null) {
      setFetch(true)
      toast.warning(' Vendor code is Mandatory ..!')
      return false
    }
    if (!values.start_date || values.start_date === null) {
      setFetch(true)
      toast.warning(' Valid from date is Mandatory ..!')
      return false
    }
    if (!values.end_date || values.end_date === null) {
      setFetch(true)
      toast.warning(' Valid to date is Mandatory ..!')
      return false
    }
    const formData = new FormData()
    formData.append('vendor_id', vendor_name)
    formData.append('vendor_code', values.vendor_code)
    formData.append('start_date', values.start_date)
    formData.append('end_date', values.end_date)
    formData.append('created_by', user_id)

    IfoodsVendorCodeMasterService.createIfoodsVendorCode(formData).then((res) => {
      if (res.status == 201) {
        setFetch(true)
        toast.success('New Vendor Code Created Successfully!')
        setTimeout(() => {
          navigation('/IfoodsVendorCodeMasterTable')
        }, 1000)
      } else if (res.status === 200) {
        toast.warning('Vendor Code Already Exists')
        navigation('/IfoodsVendorCodeMasterTable')
      }
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
                        <CCol md={3}>
                          <CFormLabel htmlFor="vendor_id">
                            Vendor Name <REQ />{' '}
                            {vendorError && <span className="small text-danger">Required</span>}
                          </CFormLabel>
                          <SearchSelectComponent
                            size="sm"
                            className="mb-2"
                            onChange={(e) => {
                              onChangeFilter(e)
                              {
                                handleChange
                              }
                            }}
                            label="Select Vendor Name"
                            noOptionsMessage="Vendor Not found"
                            search_type="ifoods_Vendors"
                          />
                        </CCol>
                        <CCol md={3}>
                          <CFormLabel htmlFor="vendor_code">
                            New Vendor Code <REQ />{' '}
                            {errors.vendor_code && (
                              <span className="small text-danger">{errors.vendor_code}</span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            name="vendor_code"
                            size="sm"
                            maxLength={6}
                            id="vendor_code"
                            onChange={handleChange}
                            value={values.vendor_code}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            placeholder="Enter New Vendor Code"
                          />
                        </CCol>
                        <CCol md={3}>
                          <CFormLabel htmlFor="start_date">
                            Valid From <REQ />{' '}
                            {errors.start_date && (
                              <span className="small text-danger">{errors.start_date}</span>
                            )}
                          </CFormLabel>
                          <CFormInput
                            size="sm"
                            id="start_date"
                            type="date"
                            onKeyDown={(e) => {
                              e.preventDefault()
                            }}
                            className={`${errors.start_date && 'is-invalid'}`}
                            name="start_date"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleChange}
                            aria-label="Small select example"
                            required
                          />
                        </CCol>
                        <CCol md={3}>
                          <CFormLabel htmlFor="end_date">
                            Valid To <REQ />{' '}
                            {errors.end_date && (
                              <span className="small text-danger">{errors.end_date}</span>
                            )}
                          </CFormLabel>

                          <CFormInput
                            size="sm"
                            id="end_date"
                            type="date"
                            min={'9999-12-31'}
                            max={'9999-12-31'}
                            className={`${errors.end_date && 'is-invalid'}`}
                            name="end_date"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleChange}
                            onKeyDown={(e) => {
                              e.preventDefault()
                            }}
                            aria-label="Small select example"
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
                            onClick={addNewVendorcode}
                          >
                            ADD
                          </CButton>
                          <Link to={'/IfoodsVehicleMasterTable'}>
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

export default IfoodsVendorCodeMaster
