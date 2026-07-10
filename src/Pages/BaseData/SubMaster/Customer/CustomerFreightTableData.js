import {
  CButton,
  CCard,
  CContainer,
  CCol,
  CRow,
  CModal,
  CFormInput,
  CFormLabel,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CCardImage,
  CModalFooter,
  CAlert,
  CFormSelect,
} from '@coreui/react'
import React, { useState, useEffect } from 'react'
import useForm from 'src/Hooks/useForm'
import CustomTable from 'src/components/customComponent/CustomTable'
// import CustomerFreightApi from '../../../Service/SubMaster/CustomerFreightApi'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import FreightSubmasterValidation from 'src/Utils/SubMaster/FreightSubmasterValidation'
import CustomerFreightApi from 'src/Service/SubMaster/CustomerFreightApi'
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver'
import { GetDateTimeFormat } from 'src/Pages/Depo/CommonMethods/CommonMethods'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import Loader from 'src/components/Loader'

const CustomerFreightTableData = () => {
  const [modal, setModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [rowData, setRowData] = useState([])
  const [save, setSave] = useState(true)
  const [success, setSuccess] = useState('')
  const [editId, setEditId] = useState('')
  const [deleteId, setDeleteId] = useState('')
  const [update, setUpdate] = useState('')
  const [deleted, setDeleted] = useState('')
  const [error, setError] = useState('')
  const [mount, setMount] = useState(1)
  const [pending, setPending] = useState(true)
  const formValues = {
    customerfreight:'',
    customer_name: '',
    customer_code: '',
    customer_type: '',
  }
  // =================== Validation ===============
  const {
    values,
    errors,
    handleChange,
    onFocus,
    handleSubmit,
    enableSubmit,
    onBlur,
    onClick,
    onKeyUp,
  } = useForm(login, FreightSubmasterValidation, formValues)

  function login() {
    // alert('No Errors CallBack Called')
  }
  // =================== Validation ===============

  /*                    */

  // =================== CRUD =====================
  const Create = (e) => {
    e.preventDefault()
    let createValues = {
      customer_name: values.customer_name,
      customer_code: values.customer_code,
      customer_type: values.customer_type,
    }
    console.log(createValues)
    CustomerFreightApi.createCustomerFreight(createValues)
      .then((response) => {
        console.log(response)
        if (response.status === 201) {
          setSuccess('New Customer Added Successfully')
          values.customer_name = ''
          values.customer_code = ''
          values.customer_type = ''
          navigation('/CustomerFreightTable')
        }
        else if(response.status === 200){
          setError('Customer Already Exists. Please Check')

        }
      })
      .catch((error) => {
        showError(error)
      })
  }

  /*================== User Location Fetch ======================*/
      const user_info_json = localStorage.getItem('user_info')
      const user_info = JSON.parse(user_info_json)
      const user_locations = []
    
      /* Get User Locations From Local Storage */
      user_info.location_info.map((data, index) => {
        user_locations.push(data.id)
      })
    
      // console.log(user_locations)
      /*================== User Location Fetch ======================*/
    
      /* ==================== Access Part Start ========================*/
        const [screenAccess, setScreenAccess] = useState(false)
        let page_no_for_view_access = LogisticsProScreenNumberConstants.MasterAccessModule.Customer_Master_View
        let page_no_for_edit_access = LogisticsProScreenNumberConstants.MasterAccessModule.Customer_Master_Edit
    
        const edit_access = JavascriptInArrayComponent(page_no_for_edit_access,user_info.page_permissions)
      
        useEffect(()=>{
      
          if(user_info.is_admin == 1 || JavascriptInArrayComponent(page_no_for_view_access,user_info.page_permissions)){
            console.log('screen-access-allowed')
            setScreenAccess(true)
          } else{
            console.log('screen-access-not-allowed')
            setScreenAccess(false)
          }
      
        },[])
      /* ==================== Access Part End ========================*/

  const exportToCSV = () => {
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='Customer_Master_Report_'+dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  const Edit = (id) => {
    setSave(false)
    setEditId('')
    CustomerFreightApi.getCustomerFreightById(id).then((response) => {
      let editData = response.data.data
      setModal(true)
      values.customer_name = editData.customer_name
      values.customer_code = editData.customer_code
      values.customer_type = editData.customer_type
      setEditId(id)
    })
  }

  const Update = (id) => {
    let updateValues = { customer_name: values.customer_name, customer_code: values.customer_code,customer_type: values.customer_type }
    console.log(updateValues, id)
    CustomerFreightApi.updateCustomerFreight(updateValues, id)
      .then((response) => {
        setSuccess('Customer Updated Successfully')
        navigation('/CustomerFreightTable')
      })
      .catch((error) => {
        showError(error)
      })
  }

  const Delete = (id) => {
    CustomerFreightApi.deleteCustomerFreight(id).then((res) => {
      if (res.status == 204) {
        setModal(false)
        toast.success('Customer Status Updated Successfully!')
        navigation('/CustomerFreightTable')
        setMount((prevState) => (prevState = prevState + 1))
      }
    })
  }

  const showError = (error) => {
    let errors = error.response.data.errors
    setError(
      Object.keys(errors)
        .map((key, index) => errors[key][0])
        .join(' <br/> ')
    )
    setTimeout(() => {
      setError('')
    }, 1000)
  }

  useEffect(() => {
   // console.log('222221')
    CustomerFreightApi.getCustomerFreight().then((response) => {
     // console.log('1111111')
      console.log(response.data.data)
      let viewData = response.data.data
      let rowDataList = []
      viewData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          customer_name: data.customer_name,
          customer_code: data.customer_code,
          customer_type: data.customer_type,
          Created_at: data.created_at,
          Status: data.customer_status === 1 ? '✔️' : '❌',
          Action: (
            (user_info && user_info.is_admin == 1) || edit_access ? (
              <div className="d-flex justify-content-space-between">
                <CButton
                  size="sm"
                  color="danger"
                  shape="rounded"
                  id={data.id}
                  onClick={() => Delete(data.id)}
                  className="m-1"
                >
                  {/* Delete */}
                  <i className="fa fa-trash" aria-hidden="true"></i>
                </CButton>
                <CButton
                  disabled={data.customer_status === 1 ? false : true}
                  size="sm"
                  color="secondary"
                  shape="rounded"
                  id={data.id}
                  onClick={() => Edit(data.id)}
                  className="m-1"
                >
                  {/* Edit */}
                  <i className="fa fa-edit" aria-hidden="true"></i>
                </CButton>
              </div>
            ) : '-'
          ),
        })
      })
      setRowData(rowDataList)
      setPending(false)

      setTimeout(() => {
        setSuccess('')
        setUpdate('')
        setError('')
        setDeleted('')
      }, 1500)
    })
  }, [mount, modal, save, success, update, deleted])
  // ============ CRUD =====================
  /*                    */
  // ============ Column Header Data =======
  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Creation date',
      selector: (row) => row.Created_at,
      left: true,
      sortable: true,
    },
    {
      name: 'Customer Name',
      selector: (row) => row.customer_name,
      left: true,
      sortable: true,
    },
    {
      name: 'Customer Code',
      selector: (row) => row.customer_code,
      left: true,
      sortable: true,
    },
    {
      name: 'Customer Type',
      selector: (row) => row.customer_type,
      left: true,
      sortable: true,
    },
    // {
    //   name: 'Supplying Plant',
    //   selector: (row) => row.supply_plant,
    //   left: true,
    //   sortable: true,
    // },

    {
      name: 'Status',
      selector: (row) => row.Status,
      left: true,
      sortable: true,
    },
    {
      name: 'Action',
      selector: (row) => row.Action,
      center: true,
    },
  ]
  // =================== Column Header Data =======

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>
          {screenAccess ? (
            <>
              <CContainer className="mt-2">
                <CRow className="mt-3">
                  <CCol
                    className="offset-md-6"
                    xs={15}
                    sm={15}
                    md={6}
                    style={{ display: 'flex', justifyContent: 'end' }}
                  >
                    {/* <CButton
                      size="md"
                      color="warning"
                      className="px-3 text-white"
                      onClick={() => {
                        values.customer_name = ''
                        values.customer_code = ''
                        values.customer_type = ''
                        setSuccess('')
                        setUpdate('')
                        setError('')
                        setDeleted('')
                        setModal(!modal)
                        setSave(true)
                      }}
                    >
                      <span className="float-start">
                        <i className="" aria-hidden="true"></i> &nbsp;New
                      </span>
                    </CButton> */}
                    <CButton
                      size="sm"
                      color="warning"
                      className="px-5 text-white" 
                      onClick={(e) => {
                        exportToCSV()
                      }
                        }>
                      Export
                    </CButton>
                  </CCol>
                </CRow>
                <CCard className="mt-1">
                  <CustomTable
                    columns={columns}
                    data={rowData || ''}
                    fieldName={'customer_name'}
                    showSearchFilter={true}
                    pending={pending}
                  />
                </CCard>
              </CContainer>

              {/* View & Edit Modal Section */}
              <CModal visible={modal} onClose={() => setModal(false)}>
                <CModalHeader>
                  <CModalTitle>Create New Customer  </CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <CRow>
                    <CCol>
                      {update && (
                        <CAlert color="primary" data-aos="fade-down" dismissible>
                          {update}
                        </CAlert>
                      )}
                      {success && (
                        <CAlert color="success" data-aos="fade-down" dismissible>
                          {success}
                        </CAlert>
                      )}
                      {error && (
                        <CAlert color="danger" data-aos="fade-down" dismissible>
                          <div dangerouslySetInnerHTML={{ __html: error }} />
                        </CAlert>
                      )}

                      <CFormLabel htmlFor="customer">
                      Customer Name*{' '}
                        {errors.customerfreight && <span className="small text-danger">{errors.customer_name}</span>}
                      </CFormLabel>
                      <CFormInput
                        size="sm"
                        id="customer_name"
                        //maxLength={125}
                        className={`${errors.customer_name && 'is-invalid'}`}
                        name="customer_name"
                        value={values.customer_name || ''}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChange={handleChange}
                        aria-label="Small select example"
                      />
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
                        //maxLength={4}
                        className={`${errors.customer_code && 'is-invalid'}`}
                        name="customer_code"
                        value={values.customer_code || ''}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChange={handleChange}
                        aria-label="Small select example"
                      />
                      <CFormLabel htmlFor="customer_type">
                      Customer Type *{' '}
                        {errors.customer_type && (
                          <span className="small text-danger">{errors.customer_type}</span>
                        )}
                      </CFormLabel>
                      <CFormSelect
                        size="sm"
                        id="customer_type"

                        className={`${errors.customer_type && 'is-invalid'}`}
                        name="customer_type"
                        //readOnly={editFieldsReadOnly}
                        value={values.customer_type}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChange={handleChange}
                      >

                        <option value="" selected>
                          Select...
                        </option>
                        <option value="Foods-Institution">Foods-Institution</option>
                        <option value="Foods-Interdivision">Foods-Interdivision</option>
                        <option value="Consumer-Interdivision">Consumer-Interdivision</option>
                        <option value="Consumer-Regular">Consumer-Regular</option>
                      </CFormSelect>
                    </CCol>
                  </CRow>
                </CModalBody>
                <CModalFooter>
                  <CButton onClick={(e) => (save ? Create(e) : Update(editId))} color="primary">
                    {save ? 'Save' : 'Update'}
                  </CButton>
                </CModalFooter>
              </CModal>
              {/* View & Edit Modal Section */}

              {/* Delete Modal Section */}
              <CModal visible={deleteModal} onClose={() => setDeleteModal(false)}>
                <CModalHeader>
                  <CModalTitle className="h4">Confirm To Delete</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <CRow>
                    <CCol>
                      <CFormLabel className="h6" htmlFor="division">
                        Are you sure want to Delete{' '}
                      </CFormLabel>
                    </CCol>
                  </CRow>
                  {deleted && (
                    <CAlert color="danger" dismissible>
                      {deleted}
                    </CAlert>
                  )}
                </CModalBody>
                <CModalFooter>
                  <CButton className="mx-2" onClick={() => Delete(deleteId)} color="danger">
                    YES
                  </CButton>
                  <CButton onClick={() => setDeleteModal(false)} color="primary">
                    NO
                  </CButton>
                </CModalFooter>
              </CModal>
              {/* Delete Modal Section */}
            </>) : (<AccessDeniedComponent />
          )}
        </>
      )}
    </>
  )
}

export default CustomerFreightTableData


