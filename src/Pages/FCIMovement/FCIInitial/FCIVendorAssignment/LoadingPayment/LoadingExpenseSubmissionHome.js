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
import FCITripsheetCreationService from 'src/Service/FCIMovement/FCITripsheetCreation/FCITripsheetCreationService'
import Swal from 'sweetalert2';
import AuthService from 'src/Service/Auth/AuthService'
import LocalStorageService from 'src/Service/LocalStoage' 
import FCIPlantMasterService from 'src/Service/FCIMovement/FCIPlantMaster/FCIPlantMasterService'

const LoadingExpenseSubmissionHome = () => {
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

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  // console.log(user_locations)
  /*================== User Location Fetch ======================*/

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.FCIModule.FCI_LP_Vendor_Assignment

  useEffect(()=>{

    if(user_info.is_admin == 1 || JavascriptInArrayComponent(page_no,user_info.page_permissions)){
      console.log('screen-access-allowed')
      setScreenAccess(true)
    } else{
      console.log('screen-access-not-allowed')
      setScreenAccess(false)
    }

  },[])

  function logout() {
    AuthService.forceLogout(user_id).then((res) => {
      // console.log(res)
      if (res.status == 204) {
        LocalStorageService.clear()
        window.location.reload(false)
      }
    })
  }
  /* ==================== Access Part End ========================*/

  const [rowData, setRowData] = useState([])
  const [pending, setPending] = useState(true)
  const [fetch, setFetch] = useState(false)
  let tableData = []
  let closureData = []
  const [fciPlantData, setFciPlantData] = useState([])

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

  const locationFinder = (plant) => {
    let n_loc = '--'
    console.log(fciPlantData,'fciPlantData')
    fciPlantData.map((datann, indexnn) => {
      if(datann.plant_symbol == plant){
        n_loc = datann.plant_name
      }
    })
    return n_loc
  }

  const exportToCSV = () => {

    let dateTimeString = GetDateTimeFormat(1)
    let fileName='FCI_Freight_Expense_Submission_'+dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  const getClosureVehiclesData = () => {

    FCITripsheetCreationService.getTripsheetDatabyPOPGrouping().then((res) => {
      closureData = res.data
      console.log(closureData,'getTripsheetDatabyPOPGrouping')
      setFetch(true)

      var updated_closure_data = Object.keys(closureData).map((val) => (closureData[val]));

      console.log(updated_closure_data,'result-data')

      let rowDataList = []
      const filterData = updated_closure_data.filter((data) => data.tripsheet_count != 0)

      filterData.map((data, index) => {
        console.log(data,'data-data')
        rowDataList.push({
          S_No: index + 1,
          PO_NO: data.po_no,
          FCI_Plant_Location: locationFinder(data.fci_plant_code),
          TRIPSHEET_COUNT: data.tripsheet_count, 
          Action: (
            <CButton className="badge" color="warning">
              <Link className="text-white" to={`/LoadingExpenseSubmission/${data.po_no}||${data.fci_plant_code}`}> 
                Expense Submission
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
  }, [fciPlantData])

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.S_No,
      sortable: true,
      center: true,
    },
    {
      name: 'PO No',
      selector: (row) => row.PO_NO,
      sortable: true,
      center: true,
    },
    {
      name: 'PLANT',
      selector: (row) => row.FCI_Plant_Location,
      sortable: true,
      center: true,
    },
    {
      name: 'Tripsheet Count',
      selector: (row) => row.TRIPSHEET_COUNT,
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

export default LoadingExpenseSubmissionHome





