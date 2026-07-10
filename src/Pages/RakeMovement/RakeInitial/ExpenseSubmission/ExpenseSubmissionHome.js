
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
import RakeTripsheetCreationService from 'src/Service/RakeMovement/RakeTripsheetCreation/RakeTripsheetCreationService'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'

const ExpenseSubmissionHome = () => {
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
  let page_no = LogisticsProScreenNumberConstants.RakeModule.Rake_Expense_Submission

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
  let closureData = []
  const [rakePlantData, setRakePlantData] = useState([])

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
    //  getClosureVehiclesData()
   })
  }, [])

  const locationFinder = (plant) => {
    let n_loc = '--'
    console.log(rakePlantData,'rakePlantData')
    rakePlantData.map((datann, indexnn) => {
      if(datann.plant_code == plant){
        n_loc = datann.plant_name
      }
    })
    return n_loc
  }

  const exportToCSV = () => {

    let dateTimeString = GetDateTimeFormat(1)
    let fileName='RakeExpenseSubmission_'+dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  const getClosureVehiclesData = () => {

    RakeTripsheetCreationService.getTripsheetDatabyFNRGrouping().then((res) => {
      closureData = res.data
      console.log(closureData,'getTripsheetDatabyFNRGrouping')
      setFetch(true)

      var updated_closure_data = Object.keys(closureData).map((val) => (closureData[val]));

      console.log(updated_closure_data,'result-data')

      let rowDataList = []
      const filterData = updated_closure_data.filter((data) => data.tripsheet_count != 0)

      filterData.map((data, index) => {
        console.log(data,'data-data')
        rowDataList.push({
          S_No: index + 1,
          FNR_NO: data.fnr_no,
          RAKE_Location: locationFinder(data.location),
          VENDOR_NAME: data.vendor_name,
          VENDOR_CODE: data.vendor_code,
          TRIPSHEET_COUNT: data.tripsheet_count,
          TRUCK_COUNT: data.tripsheet_count,
          Action: (
            <CButton className="badge" color="warning">
              <Link className="text-white" to={`/ExpenseSubmission/${data.fnr_no}||${data.vendor_code}`}>
                Expense Submission
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
  }, [rakePlantData])

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.S_No,
      sortable: true,
      center: true,
    },
    {
      name: 'FNR No',
      selector: (row) => row.FNR_NO,
      sortable: true,
      center: true,
    },
    {
      name: 'Location',
      selector: (row) => row.RAKE_Location,
      sortable: true,
      center: true,
    },
    {
      name: 'Vendor Name',
      selector: (row) => row.VENDOR_NAME,
      sortable: true,
      center: true,
    },
    {
      name: 'Vendor Code',
      selector: (row) => row.VENDOR_CODE,
      sortable: true,
      center: true,
    },
    // {
    //   name: 'Truck Count',
    //   selector: (row) => row.TRUCK_COUNT,
    //   sortable: true,
    //   center: true,
    // },
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

export default ExpenseSubmissionHome


