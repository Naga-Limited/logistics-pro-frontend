import { React, useState, useEffect } from 'react'
import { CButton, CCard, CContainer, CSpinner, CBadge, CRow, CCol } from '@coreui/react'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import { toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import { GetDateTimeFormat } from 'src/Pages/Depo/CommonMethods/CommonMethods'
import FCIVendorCreationService from 'src/Service/FCIMovement/FCIVendorCreation/FCIVendorCreationService' 
import Swal from 'sweetalert2'
import AuthService from 'src/Service/Auth/AuthService'
import LocalStorageService from 'src/Service/LocalStoage' 

const FCIVendorCreationConfirmationHome = () => {
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
  let page_no = LogisticsProScreenNumberConstants.FCIVCModule.FCI_Vendor_Confirmation

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

    function logout() {
        AuthService.forceLogout(user_id).then((res) => {
            // console.log(res)
            if (res.status == 204) {
                LocalStorageService.clear()
                window.location.reload(false)
            }
        })
    }

  const [rowData, setRowData] = useState([])
  const [fetch, setFetch] = useState(false)
  const [pending, setPending] = useState(true)

  let tableData = []

  function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [day, month, year].join('-');
  }

  const exportToCSV = () => {
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='FCI_vendor_creation_confirmation_screen_'+dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  const getDateTime = (myDateTime, type=0) => {
    let myTime = '-'
    if(type == 1){
      myTime = new Date(myDateTime).toLocaleTimeString('en-US',{ hour: '2-digit', minute: '2-digit' });
    } else if(type == 2){
      myTime = new Date(myDateTime).toLocaleDateString('en-US',{ month: 'short', year: 'numeric' });
    } else {
      myTime = new Date(myDateTime).toLocaleString('en-US');
    }
    
    return myTime
  }

  const loadVendorCreationTable = () => {
    FCIVendorCreationService.getVendorRequestConfirmationTableData().then((res) => {
      setFetch(true)
      tableData = res.data.data 
      let rowDataList = []    
      console.log(tableData,'tableData')
      tableData.map((data, index) => {
      
        rowDataList.push({
          sno: index + 1,
          Vehicle_No: data.vehicle_no ? data.vehicle_no : '-',
          Shed_Name: data.vcr_shed_info?.shed_name,
          Vendor_Name: data.vendor_name,
          Vendor_Pan: data.pan_no,
          Vendor_Mobile: data.vendor_mobile_no, 
          Waiting_at_screen: 'FCI Vendor Creation Request',  
          Vc_User: data.vcr_user_info?.emp_name,          
          Creation_Date: data.created_date,
          Screen_Duration: data.updated_at,
          Overall_Duration: data.created_at,
          Waiting_At: (
            <span className="badge rounded-pill bg-info">
              {"VC Request Approved ✔️"}
            </span>
          ),
          Action: (
            <div className="d-flex justify-content-space-between">
             
                <Link to={`VendorCreationConfirmation/${data.vendor_id}`}>
                <CButton
                    size="sm" 
                    color="secondary"
                    shape="rounded"
                    id={data.vendor_id}
                    className="m-1"
                >
                    {/* Edit */}
                    <i className="fa fa-edit" aria-hidden="true"></i>
                </CButton>
                </Link>
          </div>
          ),
        }) 
      })
      setRowData(rowDataList)
      setPending(false)
    })
    .catch((error) => {
        setFetch(true)
        console.log(error)
        let errorText = error.response.data.message
        console.log(errorText,'errorText')
        let timerInterval;
        if (error.response.status === 401) { 
          Swal.fire({
            title: "Unauthorized Activities Found..",
            html: "App will close in <b></b> milliseconds.",
            icon: "error",
            timer: 3000,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading();
              const timer = Swal.getPopup().querySelector("b");
              timerInterval = setInterval(() => {
                timer.textContent = `${Swal.getTimerLeft()}`;
              }, 100);
            },
            willClose: () => {
              clearInterval(timerInterval);
            }
          }).then((result) => {
            // console.log(result,'result') 
            if (result.dismiss === Swal.DismissReason.timer) { 
              logout()
            }
          });      
        }
    })
  }

  useEffect(() => {
    loadVendorCreationTable()
  }, [])

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Vehicle No',
      selector: (row) => row.Vehicle_No,
      sortable: true,
      center: true,
    },
    // {
    //   name: 'Shed Name',
    //   selector: (row) => row.Shed_Name,
    //   sortable: true,
    //   center: true,
    // },
    {
      name: 'Vendor Name',
      selector: (row) => row.Vendor_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'PAN Number',
      selector: (row) => row.Vendor_Pan,
      sortable: true,
      center: true,
    },
    {
      name: 'Mobile Number',
      selector: (row) => row.Vendor_Mobile,
      sortable: true,
      center: true,
    },
    {
      name: 'Date',
      selector: (row) => row.Creation_Date,
      sortable: true,
      center: true,
    },
    {
      name: 'Status',
      selector: (row) => row.Waiting_At,
      sortable: true,
      center: true,
    },
    {
      name: 'Screen Duration',
      selector: (row) => row.Screen_Duration,
      sortable: true,
      center: true,
    },
    // {
    //   name: ' Overall Duration',
    //   selector: (row) => row.Overall_Duration,
    //   sortable: true,
    //   center: true,
    // },
    {
      name: 'Action',
      selector: (row) => row.Action,
      sortable: true,
      center: true,
    },
  ]

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
       <>
       {screenAccess ? (
        <>
          <CCard className="mt-4">
            <CContainer className="mt-2">
              <CRow>
                <CCol
                  className="offset-md-9"
                  xs={12}
                  sm={12}
                  md={3}
                  style={{ display: 'flex', justifyContent: 'end' }}
                >
                  <CButton
                    size="lg-sm"
                    color="warning"
                    className="mx-3 px-3 text-white"
                    onClick={(e) => {
                      exportToCSV()}
                    }
                  >
                    Export
                  </CButton>
                </CCol>
              </CRow>
              <CustomTable
                columns={columns}
                data={rowData}
                fieldName={'Driver_Name'}
                showSearchFilter={true}
                // pending={pending}
              />
            </CContainer>
          </CCard>
        </>
	     ) : (<AccessDeniedComponent />)}
       </>
      )}
    </>
  )
}

export default FCIVendorCreationConfirmationHome
