import { React, useState, useEffect } from 'react'
import { CButton, CCard, CCol, CContainer, CRow } from '@coreui/react'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import Loader from 'src/components/Loader'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver'
import { GetDateTimeFormat } from 'src/Pages/Depo/CommonMethods/CommonMethods' 
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import FCIClosureSubmissionService from 'src/Service/FCIMovement/FCIClosureSubmission/FCIClosureSubmissionService'
import Swal from "sweetalert2";
import AuthService from 'src/Service/Auth/AuthService'
import LocalStorageService from 'src/Service/LocalStoage'
import FCIPlantMasterService from 'src/Service/FCIMovement/FCIPlantMaster/FCIPlantMasterService'

const FreightExpenseSubmissionApprovalHome = () => {
  /*================== User Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []
  const user_vehicle_types = []

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  /* Get User Vehicle Types From Local Storage */
  user_info.vehicle_type_info.map((data, index) => {
    user_vehicle_types.push(data.id)
  })

  // console.log(user_locations)
  /*================== User Location Fetch ======================*/

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.FCIModule.FCI_FP_Vendor_Assignment_APPROVAL

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

  const [rowData, setRowData] = useState([])
  const [pending, setPending] = useState(true)
  const [fetch, setFetch] = useState(false)
  let tableData = []
  let closureApprovalData = []

  const exportToCSV = () => {

    let dateTimeString = GetDateTimeFormat(1)
    let fileName='FCIFreightPaymentVendorAssignmentApproval_'+dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }


  const [fciPlantData, setFciPlantData] = useState([])
  const [rakeClosureApprovaldata, setRakeClosureApprovaldata] = useState([])

  const locationFinder = (plant) => {
    let n_loc = '--'
    fciPlantData.map((datann, indexnn) => {
      if(datann.plant_symbol == plant){
        n_loc = datann.plant_name
      }
    })
    return n_loc
  }

  function logout() {
    AuthService.forceLogout(user_id).then((res) => {
      // console.log(res)
      if (res.status == 204) {
        LocalStorageService.clear()
        window.location.reload(false)
      }
    })
  }

  const getClosureVehiclesData = () => {

    FCIClosureSubmissionService.getFreightExpenseApprovalData().then((res) => {
      closureApprovalData = res.data.data
      console.log(closureApprovalData[0],'getFreightExpenseApprovalData')

      // console.log(uniqueChars,'uniqueChars')
      setRakeClosureApprovaldata(closureApprovalData[0])
      setFetch(true)
      let rowDataList = []

      closureApprovalData.map((data, index) => {

        /* Get Tripsheets Count */
        let chars = data.tripsheet_info

        let uniqueChars = chars.filter((c, index) => {
            return chars.indexOf(c) === index
        })

        console.log(uniqueChars,'uniqueChars')

        rowDataList.push({
          sno: index + 1,
          date: data.created_at_date,
          Unique_No: data.expense_sequence_no,
          Vendor_Name: data.expense_vendor_name,
          Vendor_Code: data.expense_vendor_code,
          Request_By: data.fci_user_info.emp_name,
          Trip_Count: data.trip_migo_count,
          TripSheet_Count: data.tripsheet_count,
          Rake_Plant: locationFinder(data.fci_plant_code),
          // Waiting_At: (
          //   <span className="badge rounded-pill bg-info">
          //     {data.status == '1'
          //       ? 'Waiting For Approval'
          //       : 'Gate Out'}
          //   </span>
          // ),
          Screen_Duration: data.created_at_time,
          Action: (
            <CButton className="badge" color="warning">
              <Link className="text-white" to={`/FreightExpenseSubmissionApproval/${data.closure_id}`}>
                Expense Approval
                {/* Income Closure */}
              </Link>
            </CButton>
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
    getClosureVehiclesData()
  },[fciPlantData])

  useEffect(() => {

    /* section for getting FCI Plant Lists from database */
    // DefinitionsListApi.visibleDefinitionsListByDefinition(34).then((response) => {
    FCIPlantMasterService.getActiveFCIPlantRequestTableData().then((response) => {
      setFetch(true)
      let viewData = response.data.data
      console.log(viewData,'FCI Plant Data')
      setFciPlantData(viewData)
    })

  }, [])

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Payment Seq.',
      selector: (row) => row.Unique_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Date',
      selector: (row) => row.date,
      sortable: true,
      center: true,
    },
    {
      name: 'Vendor Name',
      selector: (row) => row.Vendor_Name,
      sortable: true,
      center: true,
    },
    // {
    //   name: 'Vendor Code',
    //   selector: (row) => row.Vendor_Code,
    //   sortable: true,
    //   center: true,
    // },
    {
      name: 'Trip Sheet Count',
      selector: (row) => row.TripSheet_Count,
      sortable: true,
      center: true,
    },
    {
      name: 'Trip Count',
      selector: (row) => row.Trip_Count,
      sortable: true,
      center: true,
    },
    {
      name: 'Location',
      selector: (row) => row.Rake_Plant,
      sortable: true,
      center: true,
    },
    // {
    //   name: 'Current Status',
    //   selector: (row) => row.Waiting_At,
    //   sortable: true,
    //   center: true,
    // },
    {
      name: 'Screen Duration',
      selector: (row) => row.Screen_Duration,
      sortable: true,
      center: true,
    },
    {
      name: 'Action',
      selector: (row) => row.Action,
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
                          }>
                        Export
                        </CButton>
                    </CCol>
                  </CRow>
                  <CustomTable
                    columns={columns}
                    data={rowData}
                    fieldName={'Driver_Name'}
                    showSearchFilter={true}
                  />
                </CContainer>
              </CCard>
            </> ) : (<AccessDeniedComponent />
          )}
   	    </>
      )}
    </>
  )
}

export default FreightExpenseSubmissionApprovalHome



