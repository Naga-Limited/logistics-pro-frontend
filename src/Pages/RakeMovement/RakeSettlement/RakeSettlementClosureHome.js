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
import RakeClosureSubmissionService from 'src/Service/RakeMovement/RakeClosureSubmission/RakeClosureSubmissionService'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'

const RakeSettlementClosureHome = () => {
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
  let page_no = LogisticsProScreenNumberConstants.RakeClosureModule.Rake_Settlement_Closure

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
  let expenseClosureData = []

  const exportToCSV = () => {

    let dateTimeString = GetDateTimeFormat(1)
    let fileName='RakeIncomeClosure_'+dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }


  const [rakePlantData, setRakePlantData] = useState([])
  const [rakeClosureApprovaldata, setRakeClosureApprovaldata] = useState([])

  const locationFinder = (plant) => {
    let n_loc = '--'
    rakePlantData.map((datann, indexnn) => {
      if(datann.plant_code == plant){
        n_loc = datann.plant_name
      }
    })
    console.log(n_loc,'n_loc')
    return n_loc
  }

  const getClosureVehiclesData = () => {

    // RakeClosureSubmissionService.getExpenseApprovalData().then((res) => {
    RakeClosureSubmissionService.getSettlementClosureData().then((res) => {
      expenseClosureData = res.data.data
      console.log(expenseClosureData,'getSettlementClosureData')

      setRakeClosureApprovaldata(expenseClosureData)
      setFetch(true)
      let rowDataList = []

      expenseClosureData.map((data, index) => {

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
          Vendor_Name: data.vendor_info.v_name,
          Vendor_Code: data.vendor_info.v_code,
          Request_By: data.rake_user_info.emp_name,
          Trip_Count: data.trip_migo_count,
          TripSheet_Count: data.tripsheet_count,
          Rake_Plant: locationFinder(data.rake_plant_code),
          // Waiting_At: (
          //   <span className="badge rounded-pill bg-info">
          //     {data.status == '1'
          //       ? 'Waiting For Approval'
          //       : 'Gate Out'}
          //   </span>
          // ),
          Screen_Duration: data.expense_closure_at_time,
          Action: (
            <CButton className="badge" color="warning">
              <Link className="text-white" to={`/RakeSettlementClosure/${data.closure_id}`}>
                {/* Expense Approval  */}
                Expense Posting
              </Link>
            </CButton>
          ),
        })
      })
      setRowData(rowDataList)
      setPending(false)
    })
  }

  useEffect(() => {
    getClosureVehiclesData()
  },[rakePlantData])

  useEffect(() => {

    /* section for getting Rake Plant Lists from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(21).then((response) => {
      setFetch(true)
      let viewData = response.data.data
      console.log(viewData,'Rake Plant Data')
      let rowDataList_location = []
      viewData.map((data, index) => {
        rowDataList_location.push({
          sno: index + 1,
          plant_name: data.definition_list_name,
          plant_code: data.definition_list_code,
        })
      })

      setRakePlantData(rowDataList_location)
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

export default RakeSettlementClosureHome



