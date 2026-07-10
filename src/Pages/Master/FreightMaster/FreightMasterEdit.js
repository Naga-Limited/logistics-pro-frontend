/*Created by maria vanaraj*/
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
  CFormTextarea,
  CAlert,
  CCardImage,
} from '@coreui/react'
import { React, useEffect, useState } from 'react'
import useForm from 'src/Hooks/useForm.js'
import validate from 'src/Utils/Validation'
import ShedTypeService from 'src/Service/SmallMaster/Shed/ShedService'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import ShedMasterValidation from 'src/Utils/Master/ShedMasterValidation'
import ShedMasterService from 'src/Service/Master/ShedMasterService'
import FreightMasterService from 'src/Service/Master/FreightMasterService'
import FrightMasterValidation from 'src/Utils/Master/FrightMasterValidation'
import LocationApi from 'src/Service/SubMaster/LocationApi'
import FreightCustomerListSearchSelect from 'src/components/commoncomponent/FreightCustomerListSearchSelect'
import LocationSearchSelect from 'src/components/commoncomponent/LocationSearchSelect'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import { getCurrentDateTime } from 'src/Pages/Depo/CommonMethods/CommonMethods'
import CustomerFreightApi from 'src/Service/SubMaster/CustomerFreightApi'

const FreightMasterEdit = () => {
  const { id } = useParams()
  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})
  const [ShedOwnerPhoto, setShedOwnerPhoto] = useState(false)
  const [ShedOwnerPhotoDel, setShedOwnerPhotoDel] = useState(true)
  const [singleFreight, setsingleFreight] = useState('')
  var endDate = new Date().toISOString().split('T')[0]

  const formValues = {
    // ShedType: '',
    institution_customer_id: '',
    location_id: '',
    customer_name: '',
    customer_code: '',
    customer_type: '',
    type: '',
    freight_rate: '',
    location_name: '',
    location_code: '',
    freight_status: '',
    start_date: '',
    end_date: '',
    updated_by: '',
  }
  const [customerType, setCustomerType] = useState([])
  const [locationType, setlocationType] = useState([])
  const [customerSalesType, setCustomerSalesType] = useState([])

  const navigation = useNavigate()
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_id = user_info.user_id
  const {
    values,
    errors,
    handleChange,
    onFocus,
    handleSubmit,
    enableSubmit,
    onBlur,
    setValues,
    setIsTouched,
  } = useForm(addNewFreight, FrightMasterValidation, formValues)

  const getOldLogInfo = (data) => {
    try {
      let data_new = []
      let temp = data ? JSON.parse(data) : []
      let temp1 = data && temp && temp.length > 0 ? temp : []
      temp1.map((vk, kk) => {
        data_new[kk] = vk
      })
      return data_new
    } catch (error) {
      return []
    }
  }
  function addNewFreight() {
    const formData = new FormData()
    // formData.append('_method', 'PUT')
    //formData.append('id', values.id)
    // formData.append('customer_code', values.customer_code)
    // formData.append('customer_name', values.customer_name)
    // formData.append('location_id', values.location_name)
    // formData.append('type', values.type)
    // formData.append('freight_rate', values.freight_rate)
    // formData.append('start_date', values.start_date)
    formData.append('institution_customer_id', values.institution_customer_id)
    formData.append('customer_code', values.customer_code)
    formData.append('customer_name', values.customer_name)
    formData.append('customer_type', values.customer_type)
    formData.append('location_id', values.location_id)
    formData.append('type', values.type)
    formData.append('freight_rate', values.freight_rate)
    formData.append('start_date', values.start_date)
    formData.append('end_date', values.end_date)
    formData.append('updated_by', user_id)

    let current_time = getCurrentDateTime()
    let current_info = getOldLogInfo(singleFreight.log_info)
    current_info.push({
      customer_name: values.customer_name,
      customer_code: values.customer_code,
      customer_type: values.customer_type,
      location_name: values.location_name,
      location_code: values.location_code,
      freight_rate: values.freight_rate,
      type_name: values.type,
      start_date: values.start_date,
      end_date: values.end_date,
      type: 2,
      user: user_info.emp_name || user_id,
      time: current_time,
      remarks: '',
    })
    formData.append('log_info', JSON.stringify(current_info))

    FreightMasterService.updateFreight(id, formData)
      .then((res) => {
        if (res.status === 200) {
          toast.success('Freight Rate Updated Successfully!')
          setTimeout(() => {
            navigation('/FreightMasterTable')
          }, 1000)
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
  function dateFormat(a) {
    let short_year = a.substring(a.lastIndexOf('-') + 1)
    let month = a.substring(a.indexOf('-') + 1, a.lastIndexOf('-'))
    let day = a.substring(0, a.indexOf('-'))
    let d = a.lastIndexOf('-')
    let year = 20 + short_year
    let new_date = day + '-' + month + '-' + year
    return new_date
  }

  useEffect(() => {
    //section for getting vehicle type from database
    FreightMasterService.getFreightById(id).then((res) => {
      console.log(res.data)

      setValues((prev) => ({
        ...prev,
        institution_customer_id: res.data.data.institution_customer_id,
        customer_name: res.data.data.customer_info.customer_name,
        customer_code: res.data.data.customer_info.customer_code,
        customer_type: res.data.data.customer_info.customer_type,
        location_id: res.data.data.location_info?.id,
        location_name: res.data.data.location_info?.location,
        location_code: res.data.data.location_info?.location_code,
        type: res.data.data.type,
        freight_rate: res.data.data.freight_rate,
        start_date: res.data.data.start_date,
        end_date: res.data.data.end_date,
        updated_by: res.data.data.updated_by || '',
      }))
      setsingleFreight(res.data.data)
      //console.log(values.location_id)
      //console.log(location_name)
    })

    DefinitionsListApi.visibleDefinitionsListByDefinition(36).then((response) => {
      let tableData = response.data.data
      const filterData = tableData.filter((data) => data.definition_list_status == 1)
      setCustomerSalesType(filterData)
    })
  }, [id])

  const selectedCustomerOption = values.institution_customer_id
    ? {
        value: values.institution_customer_id,
        label: `${values.customer_name} - ${values.customer_code}`,
      }
    : null

  const selectedLocationOption = values.location_id
    ? {
        value: values.location_id,
        label: `${values.location_name || ''} - ${values.location_code || ''}`.trim(),
      }
    : null

  const handleCustomerChange = (option) => {
    if (!option || !option.value) {
      setValues((prev) => ({
        ...prev,
        institution_customer_id: '',
        customer_name: '',
        customer_code: '',
        customer_type: '',
      }))
      return
    }

    setIsTouched((prev) => ({
      ...prev,
      institution_customer_id: true,
      customer_name: true,
      customer_code: true,
      customer_type: true,
    }))

    const [customerName, customerCode] = option.label.split(' - ')

    setValues((prev) => ({
      ...prev,
      institution_customer_id: option.value,
      customer_name: customerName || prev.customer_name,
      customer_code: customerCode || prev.customer_code,
    }))

    CustomerFreightApi.getCustomerFreightById(option.value).then((res) => {
      setValues((prev) => ({
        ...prev,
        customer_name: res.data.data.customer_name,
        customer_code: res.data.data.customer_code,
        customer_type: res.data.data.customer_type,
      }))
    })
  }

  const handleLocationChange = (option) => {
    if (!option || !option.value) {
      setValues((prev) => ({
        ...prev,
        location_id: '',
        location_name: '',
        location_code: '',
      }))
      return
    }

    setIsTouched((prev) => ({
      ...prev,
      location_id: true,
      location_name: true,
      location_code: true,
    }))

    const [locationName, locationCode] = option.label.split(' - ')

    setValues((prev) => ({
      ...prev,
      location_id: option.value,
      location_name: locationName || prev.location_name,
      location_code: locationCode || prev.location_code,
    }))

    LocationApi.getLocationById(option.value).then((res) => {
      setValues((prev) => ({
        ...prev,
        location_name: res.data.data.location,
        location_code: res.data.data.location_code,
      }))
    })
  }

  return (
    <>
      <CCard>
        <CTabContent>
          <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={true}>
            <CForm className="row g-0 m-2 p-1" onSubmit={handleSubmit}>
              <CRow className="">
                <CCol md={3}>
                  <CFormLabel htmlFor="customer_name">
                    Customer Name*{' '}
                    {errors.customer_name && (
                      <span className="small text-danger">{errors.customer_name}</span>
                    )}
                  </CFormLabel>
                  <CFormInput
                    size="sm"
                    id="customer_name"
                    type="text"
                    readOnly
                    className={`${errors.customer_name && 'is-invalid'}`}
                    name="customer_name"
                    value={values.customer_name || ''}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onChange={handleChange}
                  />
                </CCol>
                <CCol md={3}>
                  <CFormLabel htmlFor="customer_code">
                    Customer Code*{' '}
                    {errors.customer_code && (
                      <span className="small text-danger">{errors.customer_code}</span>
                    )}
                  </CFormLabel>
                  <CFormInput
                    size="sm"
                    id="customer_code"
                    type="number"
                    readOnly
                    className={`${errors.customer_code && 'is-invalid'}`}
                    name="customer_code"
                    value={values.customer_code || ''}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onChange={handleChange}
                    aria-label="Small select example"
                    search_type="customer_code"
                  />
                </CCol>
                <CCol md={3}>
                  <CFormLabel htmlFor="location_id">
                    Supplying Plant *{' '}
                    {errors.location_id && (
                      <span className="small text-danger">{errors.location_id}</span>
                    )}
                  </CFormLabel>
                  <CFormInput
                    size="sm"
                    id="location_id"
                    type="text"
                    readOnly
                    className={`${errors.location_id && 'is-invalid'}`}
                    name="location_id"
                    value={values.location_name || ''}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onChange={handleChange}
                  />
                </CCol>
                <CCol md={3}>
                  <CFormLabel htmlFor="type">
                    Sales Type *{' '}
                    {errors.type && <span className="small text-danger">{errors.type}</span>}
                  </CFormLabel>
                  <CFormInput
                    size="sm"
                    id="type"
                    type="text"
                    readOnly
                    className={`${errors.type && 'is-invalid'}`}
                    name="type"
                    value={values.type || ''}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onChange={handleChange}
                  />
                </CCol>
                <CCol md={3}>
                  <CFormLabel htmlFor="freight_rate">
                    Updated Freight Rate*{' '}
                    {errors.freight_rate && (
                      <span className="small text-danger">{errors.freight_rate}</span>
                    )}
                  </CFormLabel>
                  <CFormInput
                    size="sm"
                    id="freight_rate"
                    type="number"
                    readOnly
                    //maxLength={125}
                    className={`${errors.freight_rate && 'is-invalid'}`}
                    name="freight_rate"
                    value={values.freight_rate || ''}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onChange={handleChange}
                    aria-label="Small select example"
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
                    readOnly
                    type="date"
                    //maxLength={125}
                    // min={today}
                    className={`${errors.start_date && 'is-invalid'}`}
                    name="start_date"
                    value={values.start_date}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onChange={handleChange}
                    aria-label="Small select example"
                    placeholder="date"
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
                    max={endDate}
                    className={`${errors.end_date && 'is-invalid'}`}
                    name="end_date"
                    value={values.end_date}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onChange={handleChange}
                    aria-label="Small select example"
                    placeholder="date"
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
                  >
                    Update
                  </CButton>
                  <Link to={'/FreightMasterTable'}>
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
  )
}

export default FreightMasterEdit
