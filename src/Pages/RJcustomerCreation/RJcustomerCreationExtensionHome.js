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
  CModalFooter, 
  CFormTextarea,
} from '@coreui/react'
import React, { useState, useEffect } from 'react'
import useForm from 'src/Hooks/useForm' 
import CustomTable from 'src/components/customComponent/CustomTable'  
import 'react-toastify/dist/ReactToastify.css'
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver'
import { GetDateTimeFormat } from 'src/Pages/Depo/CommonMethods/CommonMethods'
import { toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import DepartmentSubMasterValidation from 'src/Utils/SubMaster/DepartmentSubMasterValidation'   
import Swal from 'sweetalert2'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import CustomerCreationService from 'src/Service/CustomerCreation/CustomerCreationService'
import CustomerToSAP from 'src/Service/SAP/CustomerToSAP'
  
const RJcustomerCreationExtensionHome = () => {

  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.RJCustomerModule.Customer_Creation_Confirmation

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

  const exportToCSV = () => {

    let dateTimeString = GetDateTimeFormat(1)
    let fileName='Customer_Extension_Report_'+dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  const [modal, setModal] = useState(false) 
  const [rowData, setRowData] = useState([])
  const [pending, setPending] = useState(true)

  
  const [vendorCode, setVendorCode] = useState('')
  const [requestBy, setRequestBy] = useState('')
  const [vendorRemarks, setVendorRemarks] = useState('')
  const [vcError, setVcError] = useState(true)
  const [vcErrorMessage, setVcErrorMessage] = useState('Only have 4 - 6 Digit Numeric')
  const [vrbError, setVrbError] = useState(true)
  const [vrbErrorMessage, setVrbErrorMessage] = useState('Only have Letters, . and Space')
  const REQ = () => <span className="text-danger"> * </span>
  const [fetch, setFetch] = useState(false)

  const emptyValues = () => {
      setVendorCode('')
      setRequestBy('')
      setVendorRemarks('')
      setVcError(true)
      setVrbError(true)
      setVcErrorMessage('Only have 4 - 6 Digit Numeric')
      setVrbErrorMessage('Only have Letters, . and Space')
  }

  const formValues = {
    department: '',
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
  } = useForm(login, DepartmentSubMasterValidation, formValues)

  function login() {
    // alert('No Errors CallBack Called')
  }
  // =================== Validation ===============

  const extendInfo = () => {
    console.log(vendorCode,'vendorCode')
    console.log(requestBy,'requestBy')
    console.log(vendorRemarks,'vendorRemarks')

    let sap_data = new FormData()
    sap_data.append('CUSTOMER', vendorCode) 
    setFetch(false)
    CustomerToSAP.customerExtension(vendorCode).then((res) => {
      
      // console.log(res,'vendorExtension')
      let response_data = res.data[0]
      console.log(response_data,'response_data')

      if(response_data && (response_data.STATUS == '1' || response_data.STATUS == '3')){

        let sap_response_vc_code = response_data.CUSTOMER_NO	
        let sap_response_status = response_data.STATUS		
        let sap_response_message = response_data.MESSAGE	

        // setModal(false) 
        
        const formDataUpdate = new FormData()
        formDataUpdate.append('vc_code', vendorCode)
        formDataUpdate.append('sap_message', sap_response_message)
        formDataUpdate.append('sap_status', sap_response_status)
        formDataUpdate.append('sap_vc_code', sap_response_vc_code)
        formDataUpdate.append('request_by', requestBy)
        formDataUpdate.append('created_by', user_id) 
        formDataUpdate.append('remarks', vendorRemarks)

        CustomerCreationService.extendCustomerInfo(formDataUpdate).then((resp) => {
          console.log(resp)
          if (resp.status == 200) {

            setFetch(true)
            Swal.fire({
              title: "Extended!",
              text: "Customer Details has been Extended.",
              icon: "success"
            }).then(function () {
              setModal(false) 
              emptyValues()
              window.location.reload(false)
            })
          } else if (resp.status == 201) { 

            setFetch(true)
            Swal.fire({  
              title: `${resp.data.message}`,
              icon: "warning", 
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",             
              confirmButtonText: "Close",
              cancelButtonText: "Try Again",
            }).then((result)=> {
                    
              if (result.isConfirmed) {
                setModal(false) 
                emptyValues()
              }  
            }); 
          } else {
            // Swal.fire({
            //   title: "Failed!",
            //   text: "Vendor Extension Failed. Kindly Contact Admin..",
            //   icon: "warning"
            // }).then(function () {
            //   //
            // })

            setFetch(true)
            Swal.fire({  
              title: "Failed!",
              text: "Customer Extension Failed. Kindly Contact Admin..",
              icon: "warning", 
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",             
              confirmButtonText: "Close",
              cancelButtonText: "Try Again",
            }).then((result)=> {
                    
              if (result.isConfirmed) {
                setModal(false) 
                emptyValues()
              }  
            }); 
          }

        })

      } else if(response_data && (response_data.STATUS == '2' || response_data.STATUS == '4')){
        setFetch(true)
        Swal.fire({  
          title: `${response_data.MESSAGE}`,
          icon: "warning", 
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",             
          confirmButtonText: "Close",
          cancelButtonText: "Try Again",
        }).then((result)=> {
                
          if (result.isConfirmed) {
            setModal(false) 
            emptyValues()
          }  
        }); 
      } else {
        setFetch(true)
        Swal.fire({  
          title: "Failed!",
          text: "Customer Extension Failed. Kindly Contact Admin..",
          icon: "warning", 
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",             
          confirmButtonText: "Close",
          cancelButtonText: "Try Again",
        }).then((result)=> {
                
          if (result.isConfirmed) {
            setModal(false) 
            emptyValues()
          }  
        }); 

      }

    })
    .catch((error) => {
      setFetch(true)
      Swal.fire({
        title: 'SAP Server Connection Failed. Kindly contact Admin.!',
        // text:  error.response.data.message,
        text:  error.message,
        icon: "warning",
        confirmButtonText: "OK",
      }).then(function () { 
      })    
    })

    return false 
  }

  useEffect(() => { 
    CustomerCreationService.getCustomerExtensionTableData().then((response) => {
      setFetch(true)
      let viewData = response.data.data
      console.log(viewData,'getCustomerExtensionTableData')
      let rowDataList = []
      viewData.map((data, index) => {
        rowDataList.push({
          sno: index + 1, 
          Customer_Code: data.vc_code,
          Request_By: data.request_by,
          Remarks: data.remarks,
          Extend_By: data.extension_user_info ? data.extension_user_info.emp_name	: '-',
          Created_at: data.created_date, 
          Extension_Date_Time: data.created_date_time, 
        })
      })
      setRowData(rowDataList)
      setPending(false)

      setTimeout(() => {
      }, 1500)
    })
  }, [])
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
      name: 'Extension date',
      selector: (row) => row.Created_at,
      center: true,
      sortable: true,
    },
    {
      name: 'Customer Code',
      selector: (row) => row.Customer_Code,
      center: true,
      sortable: true,
    }, 
    {
      name: 'Request By',
      selector: (row) => row.Request_By,
      center: true,
      sortable: true,
    }, 
    {
      name: 'Remarks',
      selector: (row) => row.Remarks,
      center: true,
      sortable: true,
    }, 
    {
      name: 'Extend By',
      selector: (row) => row.Extend_By,
      center: true,
      sortable: true,
    },
  ]
  // =================== Column Header Data =======

  const changeBdcTableItem = (event, child_property_name) => {
      let getData2 = event.target.value

      if(child_property_name == 'vendor_code'){
          getData2 = event.target.value.replace(/\D/g, '')
          if(getData2.length < 4){
              setVcError(true)
              setVcErrorMessage('Only have 4 - 6 Digit Numeric')
          } else {
              setVcError(false)
              setVcErrorMessage('')
          }            
          setVendorCode(getData2)
      } else if(child_property_name == 'request_by'){
          let val = event.target.value
          let val2 = val.trimStart()
          getData2 = val2.replace(/[^a-zA-Z. ]/gi, '')
          if(!/^[a-zA-Z. ]+$/.test(getData2)){
              setVrbError(true)
              setVrbErrorMessage('Only have Letters, . and Space')
          } else {
              setVrbError(false)
              setVrbErrorMessage('')
          }            
          setRequestBy(getData2)
      } else if(child_property_name == 'remarks'){
          setVendorRemarks(getData2)
      }

  }

  const conditionCheck = () => {
    if(vcError === false && vrbError === false){
        return false
    }
    return true
  }

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
                  <CButton
                    size="md"
                    color="warning"
                    className="px-3 text-white"
                    onClick={() => {
                      values.department = ''                       
                      setModal(!modal)
                    }}
                  >
                    <span className="float-start">
                      <i className="" aria-hidden="true"></i> &nbsp;New
                    </span>
                  </CButton>
                  <CButton
                    size="sm"
                    color="secondary"
                    className="px-3 text-white"
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
                  data={rowData}
                  fieldName={'Department'}
                  showSearchFilter={true}
                  pending={pending}
                />
              </CCard>
            </CContainer>

            {/* View & Edit Modal Section */}
            <CModal
                size="xl" 
                backdrop="static"
                scrollable
                visible={modal}
                onClose={() => {
                    setModal(false) 
                    emptyValues()
                }}
            >  
              <CModalHeader>
                <CModalTitle>Customer Extension</CModalTitle>
              </CModalHeader>
              <CModalBody>
              
                <CRow className="mt-1">
                  <CCol xs={12} md={4}> 
                      <CFormLabel htmlFor="vc">
                        Customer Code <REQ />{' '}
                          {vcError && (
                            <span className="small text-danger">{vcErrorMessage}</span>
                          )}
                      </CFormLabel>
                      <CFormInput
                          size="sm"
                          className="mb-2"
                          id="vc"
                          onChange={(e) => {
                              changeBdcTableItem(e,'vendor_code')
                          }}
                          maxLength={8}
                          value={vendorCode}
                      />
                  </CCol>
                  <CCol xs={12} md={4}> 
                      <CFormLabel htmlFor="vrb">
                          Request By <REQ />{' '}
                          {vrbError && (
                            <span className="small text-danger">{vrbErrorMessage}</span>
                          )}
                      </CFormLabel>
                      <CFormInput
                          size="sm"
                          className="mb-2"
                          id="vrb"
                          onChange={(e) => {
                              changeBdcTableItem(e,'request_by')
                          }}
                          maxLength={20}
                          value={requestBy} 
                      />
                  </CCol>
                  <CCol xs={12} md={4}>
                      <CFormLabel htmlFor="expremarks">Remarks</CFormLabel>
                      <CFormTextarea
                          name="expremarks"
                          id="expremarks"
                          rows="1" 
                          onChange={(e) => {
                              changeBdcTableItem(e,'remarks')
                          }}
                          value={vendorRemarks} 
                      ></CFormTextarea>
                  </CCol> 
                </CRow>                                        
                
              </CModalBody>
              <CModalFooter>
                <CButton 
                  className='m-2' 
                  disabled={conditionCheck()}  
                  onClick={() => {
                    extendInfo()
                  }} 
                  color="success"
                >
                  {'Extend'}
                </CButton>
                <CButton 
                  className='m-2' 
                  onClick={() => {
                      setModal(false) 
                      emptyValues()
                  }} 
                  color="primary"
                >
                  Cancel
                </CButton>
              </CModalFooter>
            </CModal>
            {/* View & Edit Modal Section */}  
          </>
	      ) : (<AccessDeniedComponent />)} 
      </>
    )}
    </>
  )
}
  
  export default RJcustomerCreationExtensionHome
  