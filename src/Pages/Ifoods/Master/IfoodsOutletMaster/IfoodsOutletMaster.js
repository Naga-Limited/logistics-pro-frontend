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

import IfoodsOutletMasterService from 'src/Service/Ifoods/Master/IfoodsOutletMasterService'
const IfoodsOutletMaster = () => {
  const formValues = {
  
    outlet_code: '',
    outlet_name: '',
    outlet_contact_no: '',
    outlet_mail_id: '',
    
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
  let page_no = LogisticsProScreenNumberConstants.IfoodsModuleScreens.Ifoods_Outlet_Master

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
  } = useForm(addNewOutlet, IfoodsVendorValidation, formValues)
  const [error, setError] = useState({})
  const [errorModal, setErrorModal] = useState(false)
  useEffect(() => {
    setFetch(true)
    let outlet_code = !errors.outlet_code && values.outlet_code
    let outlet_name = !errors.outlet_name && values.outlet_name
    let outlet_contact_no = !errors.outlet_contact_no && values.outlet_contact_no
    let outlet_mail_id = !errors.outlet_mail_id && values.outlet_mail_id
   

    let condition_check =
   
      outlet_code &&
      outlet_name &&
      outlet_contact_no &&
      outlet_mail_id    

    
    if (condition_check) {
      setSubmitBtn(false)
    } else {
      setSubmitBtn(true)
    }
  }, [values, errors])

 

  function addNewOutlet() {
    setFetch(false)
    const formData = new FormData()
    formData.append('outlet_code', values.outlet_code)
    formData.append('outlet_name', values.outlet_name)
    formData.append('outlet_contact_no', values.outlet_contact_no)
    formData.append('outlet_mail_id', values.outlet_mail_id)
     formData.append('created_by', user_id)
  
     IfoodsOutletMasterService.createIfoodsOutlet(formData).then((res) => {
      if (res.status == 201) {
        setFetch(true)
        toast.success('Outlet Created Successfully!')

        setTimeout(() => {
          navigation('/IfoodsOutletMasterTable')
        }, 1000)
      }
      else if (res.status === 200) {
        toast.warning('Outlet Code Already Exists')
        navigation('/IfoodsOutletMasterTable')
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
                          <CFormLabel htmlFor="outlet_code">
                            Outlet Code <REQ />{' '}
                            
                          </CFormLabel>
                          <CFormInput
                            name="outlet_code"
                            size="sm"
                            maxLength={10}
                            id="outlet_code"
                            onChange={handleChange}
                            value={values.outlet_code}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            placeholder="Outlet Code"
                          />
                        </CCol>
                        <CCol md={3}>
                          <CFormLabel htmlFor="outlet_name">
                          Outlet Name <REQ />{' '}
                            
                          </CFormLabel>
                          <CFormInput
                            name="outlet_name"
                            size="sm"
                            maxLength={10}
                            id="outlet_name"
                            onChange={handleChange}
                            value={values.outlet_name}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            placeholder="Outlet Name"
                          />
                        </CCol>
                        <CCol md={3}>
                          <CFormLabel htmlFor="outlet_contact_no">
                          Outlet CUG Number <REQ />{' '}
                            
                          </CFormLabel>
                          <CFormInput
                            name="outlet_contact_no"
                            size="sm"
                            maxLength={10}
                            id="outlet_contact_no"
                            onChange={handleChange}
                            max={10}
                            value={values.outlet_contact_no}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            placeholder="CUG Number"
                          />
                        </CCol>
                        <CCol md={3}>
                          <CFormLabel htmlFor="outlet_mail_id">
                          Outlet Mail ID <REQ />{' '}
                            
                          </CFormLabel>
                          <CFormInput
                            name="outlet_mail_id"
                            size="sm"
                            
                            id="outlet_mail_id"
                            onChange={handleChange}
                            max={10}
                            value={values.outlet_mail_id}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            placeholder="Mail ID"
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
                            onClick={addNewOutlet}
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
export default IfoodsOutletMaster
