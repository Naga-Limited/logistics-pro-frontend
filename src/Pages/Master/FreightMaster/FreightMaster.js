/* eslint-disable prettier/prettier */
import {
  CButton,
  CCard,
  CCol,
  CAlert,
  CContainer,
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
} from '@coreui/react'
import { React, useEffect, useState } from 'react'
import useForm from 'src/Hooks/useForm.js'

import FreightMasterService from 'src/Service/Master/FreightMasterService'
import FrightMasterValidation from '../../../Utils/Master/FrightMasterValidation'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import FreightCustomerListSearchSelect from 'src/components/commoncomponent/FreightCustomerListSearchSelect'
import LocationSearchSelect from 'src/components/commoncomponent/LocationSearchSelect'
import CustomerFreightApi from 'src/Service/SubMaster/CustomerFreightApi'
import LocationApi from 'src/Service/SubMaster/LocationApi'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import { getCurrentDateTime } from 'src/Pages/Depo/CommonMethods/CommonMethods'

const FreightMaster = () => {
  const formValues = {
    institution_customer_id:'',
    location_id: '',
    customer_name: '',
    customer_code: '',
    type:'',
    freight_rate: '',
    location:'',
    freight_status:'',
    start_date: '',
    end_date: '',
  }
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_id = user_info.user_id
 // const { id } = useParams()
  const resetFormValues = () => {
    values.institution_customer_id = ''
    values.location_id = ''
    values.customer_name = ''
    values.customer_code = ''
    values.type = ''
    values.freight_rate = ''
    values.location = ''
    values.start_date = ''
    values.end_date = ''
    values.freight_status = ''
  }

  const resetIsTouched = () => {
    isTouched.institution_customer_id = false
    isTouched.location_id = false
    isTouched.customer_name = false
    isTouched.customer_code = false
    isTouched.type = false
    isTouched.freight_rate = false
    isTouched.location = false
    isTouched.start_date = false
    isTouched.end_date = false
    isTouched.freight_status = false

  }

  const [institution_customer_id, setcustomer] = useState([])
  const [customerSalesType, setCustomerSalesType] = useState([])
  const [location_id, setLocation] = useState([])
  const [editFieldsReadOnly, setEditFieldsReadOnly] = useState(false)
  const [createnewFreight, setCreatenewFreight] = useState(false)
  var today = new Date().toISOString().split('T')[0];
  const minDate = new Date(9999,11,31)
  console.log(minDate)
  const navigation = useNavigate()
  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})
  const [customer_type, setCustomerType] = useState('')

  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur } = useForm(
    addNewFreight,
    FrightMasterValidation,
    formValues
  )
  const onChange = (e) => {
    let institution_customer_id = e.value
    values.institution_customer_id = institution_customer_id
    CustomerFreightApi.getCustomerFreightById(values.institution_customer_id)
      .then((res) => {
        setcustomer(res.data.data.institution_customer_id)
        setCustomerType(res.data.data.customer_type)
      })
      .catch((err) => {
        console.log(err)
        setCustomerType('')
      })
    // console.log(institution_customer_id)
  }
  useEffect(() => {
    if (values.institution_customer_id) {
      CustomerFreightApi.getCustomerFreightById(values.institution_customer_id)
        .then((res) => {
          values.customer_type = res.data.data.customer_type
          setCustomerType(res.data.data.customer_type)
        })
        .catch((err) => {
          console.log(err)
          values.customer_type = ''
          setCustomerType('')
        })
    } else {
      values.customer_type = ''
    }

    DefinitionsListApi.visibleDefinitionsListByDefinition(36).then((response) => {
      let tableData = response.data.data
      const filterData = tableData.filter((data) => data.definition_list_status == 1)
      setCustomerSalesType(filterData)
    })
  }, [values.institution_customer_id])
  //console.log(customer_type)

  const locations = (e) => {
    let loc_id = e.value
    values.location_id = loc_id
    setLocation(loc_id)
    if (loc_id) {
      LocationApi.getLocationById(loc_id)
        .then((res) => {
          // can set specific values if needed
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
  function getCurrentDate(separator = '') {
    let newDate = new Date()
    let date = newDate.getDate()
    let month = newDate.getMonth() + 1
    let year = newDate.getFullYear()

    return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date}`
  }

  function addNewFreight() {
    const formData = new FormData()

    formData.append('institution_customer_id', values.institution_customer_id)
    formData.append('customer_code', values.customer_code)
    formData.append('customer_name', values.customer_name)
    formData.append('customer_type', values.customer_type)
    formData.append('location_id', values.location_id)
    formData.append('type', values.type)
    formData.append('freight_rate', values.freight_rate)
    formData.append('start_date', values.start_date)
    formData.append('end_date', values.end_date)
    formData.append('created_by', user_id)
    formData.append('updated_by', user_id)

    let current_time = getCurrentDateTime()
    let current_info = []
    current_info.push({
      customer_name: values.customer_name,
      customer_code: values.customer_code,
      customer_type: values.customer_type,
      location_name: values.location,
      freight_rate: values.freight_rate,
      type_name: values.type,
      start_date: values.start_date,
      end_date: values.end_date,
      type: 1,
      user: user_info.emp_name || user_id,
      time: current_time,
      remarks: '',
    })
    formData.append('log_info', JSON.stringify(current_info))

    FreightMasterService.createFreight(formData)
      .then((res) => {
        console.log(res)

        if (res.status === 201) {
          toast.success('Freight Rate Created Successfully!')
          navigation('/FreightMasterTable')
        } else if (res.status === 200) {
          toast.warning('Freight Already Exists. Please Check !')
          navigation('/FreightMasterTable')
        } else {
          toast.warning('Spmething went wrong!..')
        }
      })
      .catch((error) => {
        var object = error.res.data.errors
        var output = ''
        for (var property in object) {
          output += '*' + object[property] + '\n'
        }
        resetFormValues()
        setIsTouched({})
        setError(output)
        setErrorModal(true)
      })
    console.log(values)
    if (values.institution_customer_id == '') {
      toast.warning('Customer Required')
      return false
      navigation('/FreightMaster')
    }
    if (values.location_id == '') {
      toast.warning('Plant Required')
      return false
      navigation('/FreightMaster')
    }
    if (values.type == '') {
      toast.warning('Sales Type Required')
      return false
      navigation('/FreightMaster')
    }
  }

  useEffect(() => {
    FreightMasterService.getCustomer().then((res) => {
      //   console.log(res.data.data)
      setCustomerType(res.data.data)
    })

  }, [])

  return (
    <>
      <CCard>
        <CTabContent>
          <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={true}>
            <CForm className="row g-3 m-2 p-1" onSubmit={handleSubmit}>
              <CRow className="mb-md-1">
                <CCol md={5}>
                  <CFormLabel htmlFor="institution_customer_id">
                    Customer Name & Code*{' '}
                    {errors.institution_customer_id && (
                      <span className="small text-danger">{errors.institution_customer_id}</span>
                    )}
                  </CFormLabel>
                  {/* //FreightCustomerListSearchSelect// */}
                  <FreightCustomerListSearchSelect
                    size="sm"
                    id="institution_customer_id"
                    className={`${errors.institution_customer_id && 'is-invalid'}`}
                    name="institution_customer_id"
                    value={values.institution_customer_id}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onChange={(e) => {
                      onChange(e, 'institution_customer_id')
                    }}
                    label="Select Customer "
                    noOptionsMessage="Customer Not found"
                    search_type="institution_customer_id"
                  />
                </CCol>
                <CCol md={3}>
                  <CFormLabel htmlFor="customer_type">
                    Customer Type*{' '}
                    {errors.customer_type && (
                      <span className="small text-danger">{errors.customer_type}</span>
                    )}
                  </CFormLabel>
                  <CFormInput
                    size="sm"
                    id="customer_type"
                    className={`${errors.customer_type && 'is-invalid'}`}
                    name="customer_type"
                    value={values.customer_type}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onChange={customer_type}
                    aria-label="Small select example"
                    readOnly
                    required
                  />
                </CCol>
                <CCol md={4}>
                  <CFormLabel htmlFor="location_id">
                    Supplying Plant *{' '}
                    {errors.location_id && (
                      <span className="small text-danger">{errors.location_id}</span>
                    )}
                  </CFormLabel>
                  {/* LocationSearchSelect */}
                  <LocationSearchSelect
                    size="sm"
                    id="location_id"
                    type="text"
                    //isDisabled={true}
                    //maxLength={125}
                    className={`${errors.location_id && 'is-invalid'}`}
                    name="location_id"
                    value={values.location_id || ''}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onChange={(e) => {
                      locations(e, 'location_id')
                    }}
                    aria-label="Small select example"
                    search_type="location_id"
                    required
                  />
                </CCol>
                <CCol md={3}>
                  <CFormLabel htmlFor="type">
                    Sales Type *{' '}
                    {errors.type && <span className="small text-danger">{errors.type}</span>}
                  </CFormLabel>
                  <CFormSelect
                    size="sm"
                    id="type"
                    className={`${errors.type && 'is-invalid'}`}
                    name="type"
                    //readOnly={editFieldsReadOnly}
                    // value={values.type}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onChange={handleChange}
                    required
                  >
                    <option value="" selected>
                      Select...
                    </option>
                    {customerSalesType.map(({ definition_list_code, definition_list_name }) => {
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
                  <CFormLabel htmlFor="freight_rate">
                    Freight Rate*{' '}
                    {errors.freight_rate && (
                      <span className="small text-danger">{errors.freight_rate}</span>
                    )}
                  </CFormLabel>
                  <CFormInput
                    size="sm"
                    id="freight_rate"
                    type="number"
                    //maxLength={125}
                    className={`${errors.freight_rate && 'is-invalid'}`}
                    name="freight_rate"
                    // value={values.freight_rate || ''}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onChange={handleChange}
                    aria-label="Small select example"
                    required
                  />
                </CCol>
                <CCol md={3}>
                  <CFormLabel htmlFor="start_date">
                    Start Date*{' '}
                    {errors.start_date && (
                      <span className="small text-danger">{errors.start_date}</span>
                    )}
                  </CFormLabel>
                  <CFormInput
                    size="sm"
                    id="start_date"
                    type="date"
                    //maxLength={125}
                    //min={today}
                    onKeyDown={(e) => {
                      e.preventDefault()
                    }}
                    className={`${errors.start_date && 'is-invalid'}`}
                    name="start_date"
                    //value={values.start_date || ''}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onChange={handleChange}
                    aria-label="Small select example"
                    required
                  />
                </CCol>
                <CCol md={3}>
                  <CFormLabel htmlFor="end_date">
                    End Date*{' '}
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
                    //value={'9999-12-31'}
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
                    type="submit"
                   // disabled={enableSubmit}
                  >
                    Submit
                  </CButton>
                  <Link to={'/FreightMasterTable'}>
                    <CButton
                      size="s-lg"
                      color="warning"
                      className="mx-1 px-2 text-white"
                      type="button"
                      onClick={() => {
                        setCurrentFreightInfo(true)
                      }}
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
          <CButton
           //onClick={() => setErrorModal(false)}
           onClick={(e) => {
            setSmallFetch(false)
            checkToSave(e, values.institution_customer_id,values.location_id,values.type)
            // (save ? Create(e) : Update(editId))
          }}
           color="primary">
            Close
          </CButton>
        </CModalFooter>
      </CModal>
      {/* Error Modal Section */}
    </>
  )
}

export default FreightMaster
