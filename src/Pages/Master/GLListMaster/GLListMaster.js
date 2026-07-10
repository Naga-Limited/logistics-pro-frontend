/* eslint-disable prettier/prettier */
import {
  CButton,
  CCard,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CNav,
  CNavItem,
  CNavLink,
  CAlert,
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
} from '@coreui/react'
import React,{useState,useEffect } from 'react'
import useForm from 'src/Hooks/useForm.js'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import GLListMasterService from 'src/Service/Master/GLListMasterService'
import GLListValidation from 'src/Utils/Master/GLListValidation'
import Loader from 'src/components/Loader'
import VendorCustomerTypeComponent from './VendorCustomerTypeComponent'
import { getCurrentDateTime } from 'src/Pages/Depo/CommonMethods/CommonMethods'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'

const GLListMaster = () => {
  const formValues = {
    gl_description: '',
    gl_code: '',
    cost_center: '',
    profit_center: '',
    amount_type: '',
    gltype:'',
 }
 const user_info_json = localStorage.getItem('user_info')
 const user_info = JSON.parse(user_info_json)

 /* Get User Id From Local Storage */
 const user_id = user_info.user_id


  const [fetch, setFetch] = useState(false)
  const navigation = useNavigate()
  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})
  const [vendorCustomerTypes, setVendorCustomerTypes] = useState([])
  const REQ = () => <span className="text-danger"> * </span>
  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur,isTouched,handleMultipleChange } = useForm(
    addNewGLList,
    GLListValidation,
    formValues
  )

  function addNewGLList() {
    const formData = new FormData()

    formData.append('gl_description', values.gl_description)
    formData.append('gl_code', values.gl_code)
    formData.append('cost_center', values.cost_center)
    formData.append('profit_center', '92004000')
    formData.append('amount_type', values.amount_type)
    formData.append('plant', '9200')
    formData.append('created_by', user_id)
    formData.append('gltype', values.gltype)

    let current_time = getCurrentDateTime()
    let current_info = [{
      gl_description: values.gl_description,
      gl_code: values.gl_code,
      amount_type: values.amount_type,
      cost_center: values.cost_center,
      profit_center: '92004000',
      plant_code: '9200',
      vendor_customer_type: (() => {
        const codes = String(values.gltype).split(',')
        const names = codes.map(code => {
          const found = vendorCustomerTypes.find(vct => String(vct.definition_list_code) === String(code.trim()))
          return found ? found.definition_list_name : code
        })
        return names.join(', ')
      })(),
      type: 1,
      user: user_info.emp_name || user_id,
      time: current_time,
      remarks: '',
    }]

    formData.append('log_info', JSON.stringify(current_info))

    if(values.amount_type == '2' && values.cost_center == ''){
      setFetch(true)
      toast.warning('Please Add Cost Center..')
      return false
    }else if(values.gltype == ''){
      toast.warning('Please Select Vendor/Customer Type..')
      setFetch(true)
      return false
    }


    GLListMasterService.createGLlist(formData)
      .then((res) => {
        if (res.status === 201) {
          setFetch(true)
          toast.success('G/L Created Successfully!')
          setAcceptBtn(true)
          navigation('/GLListMasterTable')
        } else {
          setFetch(true)
          toast.error('G/L Already Maintained!')
        }
      })
      .catch((error) => {
        var object = error.response.data.errors
        var output = ''
        for (var property in object) {
          output += '*' + object[property] + '\n'
        }
        setError(output)
        setErrorModal(true)
      })
  }
  const [acceptBtn, setAcceptBtn] = useState(true)
  useEffect(() => {
    setFetch(true)
    DefinitionsListApi.visibleDefinitionsListByDefinition(18).then((res) => {
      setVendorCustomerTypes(res.data.data)
    })
  }, [])

  useEffect(() => {
    if (isTouched.gl_description && !errors.gl_description && isTouched.gl_code && !errors.gl_code && isTouched.amount_type && !error.amount_type) {
      setAcceptBtn(false)
    } else {
      setAcceptBtn(true)
    }
  }, [errors])


  return (
    <>
    {!fetch && <Loader />}
    {fetch && (
      <>

        <CCard>
          <CTabContent>
            <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={true}>
              <CForm className="row g-3 m-2 p-1">
                <CRow className="mb-md-1">
                  <CCol md={3}>
                    <CFormLabel htmlFor="gl_description">
                      G/L Description <REQ />{' '}
                      {errors.gl_description && (
                        <span className="small text-danger">{errors.gl_description}</span>
                      )}
                    </CFormLabel>
                    <CFormInput
                      name="gl_description"
                      size="sm"
                      maxLength={40}
                      id="gl_description"
                      onChange={handleChange}
                      value={values.gl_description}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      placeholder=""
                    />
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel htmlFor="gl_code">
                      G/L Number <REQ />{' '}
                      {errors.gl_code && (
                        <span className="small text-danger">{errors.gl_code}</span>
                      )}
                    </CFormLabel>
                    <CFormInput
                      name="gl_code"
                      size="sm"
                      maxLength={6}
                      id="gl_code"
                      onChange={handleChange}
                      value={values.gl_code}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      placeholder=""
                    />
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel htmlFor="amount_type">
                      G/L Amount Type <REQ />{' '}
                      {errors.amount_type && (
                        <span className="small text-danger">{errors.amount_type}</span>
                      )}
                    </CFormLabel>
                    <CFormSelect
                          size="sm"
                          id="amount_type"
                          className={`${errors.amount_type && 'is-invalid'}`}
                          name="amount_type"
                          value={values.amount_type}
                          onFocus={onFocus}
                          onBlur={onBlur}
                          onChange={handleChange}
                        >
                          <option value="" hidden>
                            Select...
                          </option>
                          <option value="1">Income</option>
                          <option value="2">Expense</option>
                        </CFormSelect>
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel htmlFor="cost_center">
                    Cost Center
                      {errors.gl_code && (
                        <span className="small text-danger">{errors.cost_center}</span>
                      )}
                    </CFormLabel>
                    <CFormInput
                      name="cost_center"
                      size="sm"
                      maxLength={20}
                      id="cost_center"
                      onChange={handleChange}
                      value={values.cost_center}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      placeholder=""
                    />
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel htmlFor="profit_center">
                    Profit Center
                      {/* {errors.profit_center && (
                        <span className="small text-danger">{errors.profit_center}</span>
                      )} */}
                    </CFormLabel>
                    <CFormInput
                      name="profit_center"
                      size="sm"
                      maxLength={8}
                      id="profit_center"
                      // onChange={handleChange}
                      value={'92004000'}
                      readOnly
                      onFocus={onFocus}
                      onBlur={onBlur}
                      placeholder=""
                    />
                  </CCol>

                  <CCol md={3}>
                    <CFormLabel htmlFor="plant">
                      Plant Code
                      {/* {errors.plant && (
                        <span className="small text-danger">{errors.plant}</span>
                      )} */}
                    </CFormLabel>
                    <CFormInput
                      name="plant"
                      size="sm"
                      maxLength={4}
                      id="plant"
                      // onChange={handleChange}
                      value={'9200'}
                      onFocus={onFocus}
                      readOnly
                      onBlur={onBlur}
                      placeholder=""
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="gltype">
                    Vendor/Customer Type<REQ />{' '}
                      {errors.gltype && (
                        <span className="small text-danger">{errors.gltype}</span>
                      )}
                    </CFormLabel>
                    <VendorCustomerTypeComponent
                      size="sm"
                      name="gltype"
                      id="gltype"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleMultipleChange}
                      selectedValue={values.gltype}
                      isMultiple={true}
                      className={`mb-1 ${errors.gltype && 'is-invalid'}`}
                      label="Select Incoterm Type"
                      noOptionsMessage="Incoterm Type not found"

                    />
                    {/* </CFormSelect> */}
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
                      type="submit"
                      disabled={acceptBtn}
                      onClick={() => {
                        setFetch(false)
                        addNewGLList()
                      }}
                >
                      Submit
                    </CButton>
                    <Link to={'/GLListMasterTable'}>
                      <CButton
                        size="s-lg"
                        color="warning"
                        className="mx-1 px-2 text-white"
                        type="button"
                      >
                        Cancel
                      </CButton>
                    </Link>
                  </CCol>
                </CRow>
              </CForm>
            </CTabPane>
          </CTabContent>
        </CCard>

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
    )}
    </>
  )
}

export default GLListMaster
