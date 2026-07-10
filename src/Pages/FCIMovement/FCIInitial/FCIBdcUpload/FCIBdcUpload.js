import { CAlert, CButton, CCard, CCol, CContainer, CFormInput, CFormLabel, CFormSelect, CInputGroup, CInputGroupText, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow } from "@coreui/react";
import React, { useEffect, useState } from "react";
import { GetDateTimeFormat } from "src/Pages/Depo/CommonMethods/CommonMethods";
import DefinitionsListApi from "src/Service/Definitions/DefinitionsListApi";
import LocalStorageService from 'src/Service/LocalStoage' 
import JavascriptInArrayComponent from "src/components/commoncomponent/JavascriptInArrayComponent";
import Loader from 'src/components/Loader'
import CustomTable from "src/components/customComponent/CustomTable";
import Swal from "sweetalert2";
import { read, utils, writeFile } from 'xlsx';
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import AccessDeniedComponent from "src/components/commoncomponent/AccessDeniedComponent";
import useFormBdcUpload from "src/Hooks/useFormBdcUpload"; 
import FCIBdcUploadValidation from "src/Utils/FCIMovement/FCIBdcUploadValidation"; 
import FCITripsheetCreationService from "src/Service/FCIMovement/FCITripsheetCreation/FCITripsheetCreationService";
import FCITripsheetSapService from "src/Service/SAP/FCITripsheetSapService";
import AuthService from "src/Service/Auth/AuthService";
import FCIPlantMasterService from "src/Service/FCIMovement/FCIPlantMaster/FCIPlantMasterService";

const FCIBdcUpload = () => {

  /*================== User Location Fetch Start ======================*/

  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []

  // console.log(user_info)

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  /*================== User Location Fetch End ======================*/

  /* ==================== Access Part Start ========================*/

  const [screenAccess, setScreenAccess] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.FCIModule.FCI_BDC_Upload

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

    const [movies, setMovies] = useState([])
    const [validDataLength, setValidDataLength] = useState(0)
    const [invalidDataLength, setInvalidDataLength] = useState(0)
    const [totalData, setTotaldata] = useState([])
    const [editModalEnable, setEditModalEnable] = useState(false)
    const [deleteModalEnable, setDeleteModalEnable] = useState(false)
    const [currentDataId, setCurrentDataId] = useState('')
    const [fetch, setFetch] = useState(false)
    const [errorModal, setErrorModal] = useState(false)
    const [bdcSubmit, setBdcSubmit] = useState(false) /* Bulk Upload Modal */
    const [bdcSubmit1, setBdcSubmit1] = useState(false) /* Single Upload Modal */
    const [error, setError] = useState({})

    const [uploadStatus,setUploadStatus] = useState(false)

    const fnr_vehicleNo_duplicate_having = (data,po_no,truck_no,index) => {

      let condition = 0
      console.log(data,'fnr_vehicleNo_duplicate_having-data')
      data.map((vv,ii)=>{
        if(vv.PO_No == po_no && vv.Truck_No == truck_no){
          condition = 1
        }
      })

      if(condition == 1){
        return true
      } else {
        return false
      }

    }

    const ColoredLine = ({ color }) => (
      <hr
        style={{
          color: color,
          backgroundColor: color,
          height: 5
        }}
      />
    )

    const [rakeEvehiclesData, setRakeEvehiclesData] = useState([])

    const formValues = {
      po_no1:'',
      vehicle_no1:'',
      fci_plant1:'',
    }

    const singleFormValuesClearance = () => {
      values.po_no1 = ''
      values.vehicle_no1 = ''
      values.fci_plant1 = ''
    }

    const {
      values,
      eVehicles,
      errors,
      handleChange,
      isTouched,
      setIsTouched,
      setErrors,
      onFocus,
      handleSubmit1,
      enableSubmit,
      onBlur,
    } = useFormBdcUpload(login, FCIBdcUploadValidation, formValues, rakeEvehiclesData)

    function login() {
      // alert('No Errors CallBack Called')
    }

    const [fciPlantData, setFciPlantData] = useState([])

    useEffect(()=>{
      if(fciPlantData.length != 0){  
        console.log('yes2')
        getBdcUploadData()
      }
    },[movies.length != 0,fciPlantData.length != 0]) 

    const validation = (data) => {
      console.log(data,'validation-validation')
      let valid_data = []

      data.map((val,ind)=>{
        console.log(val,'val-validation') 
        if(!val.PO_No || val.PO_No == '' || val.PO_No == undefined || val.PO_No.toString().length < 10 || val.PO_No.length > 11 || !(Number.isInteger(val.PO_No))  ){
            val.upload_status = '0'
            val.upload_remarks = 'Invalid PO No'
        } else if(!checkRakeVehicle(val.Truck_No) && (!val.Truck_No || val.Truck_No == '' || val.Truck_No == undefined || val.Truck_No.toString().length < 9 || val.Truck_No.toString().length > 10 || !(val.Truck_No.match(/^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/)))){
          val.upload_status = '0'
          val.upload_remarks = 'Invalid Vehicle No'
        } else if(fnr_vehicleNo_duplicate_having(valid_data,val.PO_No,val.Truck_No,ind)){
          val.upload_status = '0'
          val.upload_remarks = 'Duplicate Data'
        } else if(!val.FCI_Plant || val.FCI_Plant == '' || val.FCI_Plant == undefined || locationFinder(val.FCI_Plant) == '--'){
          console.log(val.FCI_Plant,'val.FCI_Plant err')
          console.log(fciPlantData,'val.FCI_Plant err12')
          console.log(locationFinder(val.FCI_Plant),'val.FCI_Plant err13') 
          val.upload_status = '0'
          val.upload_remarks = 'Invalid Rake Plant'
        } else {
          val.upload_status = '1'
          val.upload_remarks = '--'
        }

        valid_data.push(val)

      })

      let invalidLength = 0
      let validLength = 0

      data.map((val,ind)=>{
        // console.log(val,'vvvvv')
        if(val.upload_status == '0'){
          setUploadStatus(true)
          invalidLength += 1
        } else {
          validLength += 1
        }

      })

      if(invalidLength == 0){
        setUploadStatus(false)
      }

      setInvalidDataLength(invalidLength)
      setValidDataLength(validLength)

      setTotaldata(data)

      return valid_data
    }

    const hd1 = {
      backgroundColor: 'skyblue',
      color: 'Black',
      fontWeight: 'bolder',
      width: '80%',
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

    useEffect(() => {

       /* section for getting FCI Plant Lists from database */
      //  DefinitionsListApi.visibleDefinitionsListByDefinition(34).then((response) => {
      FCIPlantMasterService.getActiveFCIPlantRequestTableData().then((response) => {
        setFetch(true) 
        let viewData = response.data.data
        console.log(viewData,'FCI Plant Data')
        setFciPlantData(viewData)
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

      /* section for getting Rake Exception Vehicles from database */
      DefinitionsListApi.visibleDefinitionsListByDefinition(22).then((response) => {

        let viewData = response.data.data
        console.log(viewData,'Rake Exception Vehicles Data')
        let rowDataList_vehicles = []
        viewData.map((data, index) => {
          rowDataList_vehicles.push(data.definition_list_name)
        })
        console.log(rowDataList_vehicles,'rowDataList_vehicles')
        setRakeEvehiclesData(rowDataList_vehicles)
      })

    }, [])

    const locationFinder = (plant) => {
      let n_loc = '--'
      fciPlantData.map((datann, indexnn) => {
        if(datann.plant_symbol == plant){
          n_loc = datann.plant_name
        }
      })
      return n_loc
    }

    const locationIDFinder = (plant) => {
      let n_loc = '--'
      fciPlantData.map((datann, indexnn) => {
        if(datann.plant_code == plant){
          n_loc = datann.plant_id
        }
      })
      return n_loc
    }

    const plantDuplicateCheckInvalid = (dat) => {
      let plantArray = []
      console.log(dat,'plantDuplicateCheckInvalid')
      dat.map((va,ke)=>{
        // console.log(va,'dat'+ke)
        if(ke == 0){
          plantArray.push(va.FCI_Plant)
        } else {
          plantArray.map((vv,kk)=>{
            if(vv !== va.FCI_Plant){
              plantArray.push(va.FCI_Plant)
            }
          })
        }
      })

      if(plantArray.length == 1){
        return false
      } else{ // Multiple Plants Having
        return true
      }

    }

    const checkRakeVehicle = (v_no) => {
      let v_no_valid = 0
      rakeEvehiclesData.map((datan, indexn)=>{
        if(datan == v_no){
          v_no_valid = 1
        }
      })

      if(v_no_valid == 1){
        return true
      } else {
        return false
      }
    }

    const clickme = (vbn) => {
      console.log(vbn,'clickme-val')
      console.log(movies,'clickme-val movies')
    }

    const handleImport = (event) => {
      console.log(event,'---')
      const files = event.target.files;
      console.log(files,'files')
      var allowedFiles = [".xls", ".xlsx", ".csv"];
      var file_prev_name = files[0].name
      var regex = new RegExp("([a-zA-Z0-9\s_\\.\-:])+(" + allowedFiles.join('|') + ")$");
      if (!regex.test(file_prev_name.toLowerCase())) {
        let error_text = "Please upload files having extensions: <b>" + allowedFiles.join(', ') + "</b> only.";
        Swal.fire({
          title: error_text,
          icon: "warning",
          confirmButtonText: "OK",
        }).then(function () {
          window.location.reload(false)
        });
        return false
      }
      // return false
      if (files.length) {
          const file = files[0];
          const reader = new FileReader();
          reader.onload = (event) => {
              const wb = read(event.target.result);
              const sheets = wb.SheetNames;

              if (sheets.length) {
                const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
                console.log(rows,'rows-rows')
                let validated_rows = validation(rows)
                console.log(validated_rows,'validated_rows')
                if(validated_rows.length == 0){
                  Swal.fire({
                    title: 'Uploaded data was invalid..',
                    icon: "warning",
                    confirmButtonText: "OK",
                  }).then(function () {
                    window.location.reload(false)
                  });
                }
                setMovies(validated_rows)
              }
          }
          reader.readAsArrayBuffer(file);

      } else {
        Swal.fire({
          title: 'Invalid File..',
          icon: "warning",
          confirmButtonText: "OK",
        }).then(function () {
          window.location.reload(false)
        });
      }
    }

    const handleExport = () => {
        const headings = [[
            'PO_No',
            'Truck_No',             
            'FCI_Plant',
            'Upload_Status',
            'Upload_Remarks',
        ]];
        const wb = utils.book_new();
        const ws = utils.json_to_sheet([]);
        utils.sheet_add_aoa(ws, headings);
        let dateTimeString = GetDateTimeFormat(1)
        utils.sheet_add_json(ws, movies, { origin: 'A2', skipHeader: true });
        utils.book_append_sheet(wb, ws, 'Report');
        writeFile(wb, 'BDC_Data_'+dateTimeString+'.xlsx');
    }

    const setTripsheetNo = (tsNo,rNo) => {

      let fp = tsNo.substring(0,11);
      var pad = "000"
      var ans = pad.substring(0, (pad.length - String(rNo).length))
      let needed_tripsheet = `${fp}${ans}${rNo}`
      console.log(needed_tripsheet,'needed_tripsheet')
      return needed_tripsheet
    }

    const fciPlantIdFinder = (value,type) => {
      let fciData_plantId = ''
      let fcidata = []
      fciPlantData.map((vh,kh)=>{
        if(vh.plant_symbol == value){
          fciData_plantId = vh.plant_id
          fcidata.push(vh)
        }
      })
      if(type == 1){
        return fciData_plantId
      } else {
        return fcidata
      }
    }

    const fciPlantInfoFinder = (value,type) => {
      let fciData = {}
      fciPlantData.map((vh,kh)=>{
        if(vh.plant_id == value){
          fciData = vh
        }
      })
      console.log(fciData,'fciData')

      let neededValueArray = ['',fciData['plant_name'],fciData['plant_symbol'],fciData['company_name'],fciData['street_no'],fciData['street_name'],fciData['city'],fciData['state'],fciData['region'],fciData['postal_code'],fciData['gst_no'],fciData['remarks']]
      console.log(neededValueArray,'neededValueArray')

      return neededValueArray[type]

    }

    const handleSubmit = (type) => {
      if(type == 1){ /* Bulk Upload */
        if(movies.length == 0){
          Swal.fire({
              title: 'Please Attach the upload.',
              icon: "warning",
              confirmButtonText: "OK",
            }).then(function () {
              // window.location.reload(false)
            })
        } else if(plantDuplicateCheckInvalid(movies)) {
          Swal.fire({
            title: 'Multiple Plants Cannot be allowed to upload',
            icon: "warning",
            confirmButtonText: "OK",
          }).then(function () {
            // window.location.reload(false)
          })
        }else {
          setFetch(false)

          /* ===================== Submition Part Start ===================== */

          // RakeTripsheetCreationService.getRakeTripSheetNo(movies[0].Rake_Plant).then((res) => {
          FCITripsheetCreationService.getFCITripSheetNoForBulkUpload(movies[0].FCI_Plant).then((res) => {
            let tripsheet_no = res.data.ts_no
            console.log(tripsheet_no,'tripsheet_no')
            const running_no = Number(tripsheet_no.substring(11))

            console.log(running_no,'running_no')
            console.log(movies,'tripsheet_no-movies')

            var BDCSendData = {}
            var BDCSendData_seq = []
            var BDCSendData_seq1 = []

            /* Set BDC Data via Uploaded Data by Loop */
            for (var i = 0; i < movies.length; i++) {
              BDCSendData.TRIP_SHEET = setTripsheetNo(tripsheet_no,running_no+i)
              BDCSendData.PO_NO = movies[i].PO_No
              BDCSendData.VEHICLE_NO = movies[i].Truck_No               
              BDCSendData.SAP_FLAG = 1
              BDCSendData.PLANT = movies[i].FCI_Plant

              let fci_plant_id = fciPlantIdFinder(movies[i].FCI_Plant,1)
              // let fci_plant_data = fciPlantIdFinder(movies[i].FCI_Plant,2)

              /* ========= Newly Added Fields for E-Way Bill Start ========= */
              BDCSendData.PLANT_NAME = fciPlantInfoFinder(fci_plant_id,1)
              BDCSendData.COMPANY_NAME = fciPlantInfoFinder(fci_plant_id,3)
              BDCSendData.STREET_NO = fciPlantInfoFinder(fci_plant_id,4)
              BDCSendData.STREET_NAME = fciPlantInfoFinder(fci_plant_id,5)
              BDCSendData.CITY = fciPlantInfoFinder(fci_plant_id,6)
              BDCSendData.STATE = fciPlantInfoFinder(fci_plant_id,7)
              BDCSendData.POST_CODE = fciPlantInfoFinder(fci_plant_id,9)
              BDCSendData.REGION = fciPlantInfoFinder(fci_plant_id,8)
              BDCSendData.GST_NUMBER = fciPlantInfoFinder(fci_plant_id,10) 
              /* ========= Newly Added Fields for E-Way Bill End ========= */

              BDCSendData_seq[i] = BDCSendData

              let be_data = JSON.parse(JSON.stringify(BDCSendData)) 
              // be_data.PLANT_ID = setPlantId(be_data[i].Vendor_Code)
              BDCSendData_seq1[i] = be_data
              be_data = {}

              BDCSendData = {}
            }

            console.log(BDCSendData_seq,'BDCSendData_seq')
            console.log(BDCSendData_seq1,'BDCSendData_seq1')

            FCITripsheetSapService.createTripsheet(BDCSendData_seq).then((res) => {
              console.log(res,'createTripsheet-response')
              let sap_tsc_res = JSON.stringify(res.data)

              if(sap_tsc_res && sap_tsc_res.length > 0){

                const formData = new FormData()
                formData.append('lp_data', JSON.stringify(BDCSendData_seq1))
                formData.append('sap_res', sap_tsc_res)
                formData.append('created_by', user_id)

                
                FCITripsheetCreationService.createTripsheet(formData).then((res) => {
                  setFetch(true)

                  console.log(res,'createTripsheet')
                  if(res.status == 200){
                    Swal.fire({
                      // title: movies.length+' Tripsheets Inserted Successfully!',
                      title: 'Tripsheets Inserted Successfully!',
                      icon: "success",
                      confirmButtonText: "OK",
                    }).then(function () {
                        window.location.reload(false)
                    });
                  } else {
                    Swal.fire({
                      title: 'Tripsheet Creation Failed in LP. Kindly contact admin..!',
                      icon: "warning",
                      confirmButtonText: "OK",
                    }).then(function () {
                      // window.location.reload(false)
                    })
                  }

                })
                .catch((error) => {
                  console.log(error,'error')
                  setFetch(true)
                  var object = error.response.data.errors
                  var output = ''
                  for (var property in object) {
                    output += '*' + object[property] + '\n'
                  }
                  setError(output)
                  setErrorModal(true)
                })

              } else {

                setFetch(true)
                Swal.fire({
                  title: 'Tripsheet Creation Failed in SAP. Kindly contact admin..!',
                  icon: "warning",
                  confirmButtonText: "OK",
                }).then(function () {
                  // window.location.reload(false)
                })

              }

            })
            .catch((error) => {
              console.log(error,'error')
              setFetch(true)
              var object = error.response.data.errors
              var output = ''
              for (var property in object) {
                output += '*' + object[property] + '\n'
              }
              setError(output)
              setErrorModal(true)
            })

          })
          .catch((error) => {
            console.log(error,'error')
            setFetch(true)
            var object = error.response.data.errors
            var output = ''
            for (var property in object) {
              output += '*' + object[property] + '\n'
            }
            setError(output)
            setErrorModal(true)
          })

          /* ===================== Submition Part End ===================== */

        }
      } else if(type == 3) { /* Single Upload */

        setFetch(false)

        // RakeTripsheetCreationService.checkDuplicateDataForFnrVehNo(values.fnr_no1,values.vehicle_no1).then((res) => {
        FCITripsheetCreationService.checkDuplicateDataForPoNoVehNo(values.po_no1,values.vehicle_no1).then((res) => {
          console.log(res,'res')
          if(res.status == 201 && (res.data.status == 2 || res.data.status == 3)){

            /* ===================== Submition Part Start ===================== */

            // RakeTripsheetCreationService.getRakeTripSheetNo(values.rake_plant1).then((res) => {
            FCITripsheetCreationService.getFCITripSheetNo(values.fci_plant1).then((res) => {

              if(res.status == 201 && res.data.status == 2){
                setFetch(true)
                Swal.fire({
                  title: 'PO and Vehicle No already exists..!',
                  text: 'Original Tripsheet : '+res.data.TS_NO,
                  icon: "warning",
                  confirmButtonText: "OK",
                }).then(function () {
                  // window.location.reload(false)
                })
              } else if (res.status == 200 && res.data.status == 1){
                let tripsheet_no = res.data.ts_no

                console.log(tripsheet_no,'tripsheet_no')

                var BDCSendData = {}
                var BDCSendData_seq = []
                var BDCSendData_seq1 = []

                /* Set BDC Data via Uploaded Data by Loop */
                for (var i = 0; i < 1; i++) {
                  BDCSendData.TRIP_SHEET = tripsheet_no
                  BDCSendData.PO_NO = values.po_no1
                  BDCSendData.VEHICLE_NO = values.vehicle_no1                   
                  BDCSendData.SAP_FLAG = 1
                  BDCSendData.PLANT = fciPlantInfoFinder(values.fci_plant1,2)

                  /* ========= Newly Added Fields for E-Way Bill Start ========= */
                  BDCSendData.PLANT_NAME = fciPlantInfoFinder(values.fci_plant1,1)
                  BDCSendData.COMPANY_NAME = fciPlantInfoFinder(values.fci_plant1,3)
                  BDCSendData.STREET_NO = fciPlantInfoFinder(values.fci_plant1,4)
                  BDCSendData.STREET_NAME = fciPlantInfoFinder(values.fci_plant1,5)
                  BDCSendData.CITY = fciPlantInfoFinder(values.fci_plant1,6)
                  BDCSendData.STATE = fciPlantInfoFinder(values.fci_plant1,7)
                  BDCSendData.POST_CODE = fciPlantInfoFinder(values.fci_plant1,9)
                  BDCSendData.REGION = fciPlantInfoFinder(values.fci_plant1,8)
                  BDCSendData.GST_NUMBER = fciPlantInfoFinder(values.fci_plant1,10) == 'null' ? '' : fciPlantInfoFinder(values.fci_plant1,10)
                  /* ========= Newly Added Fields for E-Way Bill End ========= */

                  BDCSendData_seq[i] = BDCSendData
                  let be_data = JSON.parse(JSON.stringify(BDCSendData)) 
                  BDCSendData_seq1[i] = be_data
                  be_data = {}

                  BDCSendData = {}
                }

                console.log(BDCSendData_seq,'BDCSendData_seq')
                console.log(BDCSendData_seq1,'BDCSendData_seq1')
      
                FCITripsheetSapService.createTripsheet(BDCSendData_seq).then((res) => {
                  console.log(res,'createTripsheet-response')
                  let sap_tsc_res = JSON.stringify(res.data)

                  if(sap_tsc_res && sap_tsc_res.length > 0){

                    const formData = new FormData()
                    formData.append('lp_data', JSON.stringify(BDCSendData_seq1))
                    formData.append('sap_res', sap_tsc_res)
                    formData.append('created_by', user_id)

                    FCITripsheetCreationService.createTripsheet(formData).then((res) => {
                      setFetch(true)

                      console.log(res,'createTripsheet')
                      if(res.status == 200){
                        Swal.fire({
                          title: 'Tripsheet Inserted Successfully!',
                          icon: "success",
                          text:  'Tripsheet No. : ' + tripsheet_no,
                          confirmButtonText: "OK",
                        }).then(function () {
                            window.location.reload(false)
                        });
                      } else {
                        Swal.fire({
                          title: 'Tripsheet Creation Failed in LP. Kindly contact admin..!',
                          icon: "warning",
                          confirmButtonText: "OK",
                        }).then(function () {
                          // window.location.reload(false)
                        })
                      }

                    })
                    .catch((error) => {
                      console.log(error,'error')
                      setFetch(true)
                      var object = error.response.data.errors
                      var output = ''
                      for (var property in object) {
                        output += '*' + object[property] + '\n'
                      }
                      setError(output)
                      setErrorModal(true)
                    })

                  } else {

                    setFetch(true)
                    Swal.fire({
                      title: 'Tripsheet Creation Failed in SAP. Kindly contact admin..!',
                      icon: "warning",
                      confirmButtonText: "OK",
                    }).then(function () {
                      // window.location.reload(false)
                    })

                  }

                })
                .catch((error) => {
                  console.log(error,'error')
                  setFetch(true)
                  var object = error.response.data.errors
                  var output = ''
                  for (var property in object) {
                    output += '*' + object[property] + '\n'
                  }
                  setError(output)
                  setErrorModal(true)
                })
              } else {
                setFetch(true)
                Swal.fire({
                  title: 'Tripsheet Creation Failed in SAP. Kindly contact admin..!',
                  icon: "warning",
                  confirmButtonText: "OK",
                }).then(function () {
                  // window.location.reload(false)
                })
              }

            })
            .catch((error) => {
              console.log(error,'error')
              setFetch(true)
              var object = error.response.data.errors
              var output = ''
              for (var property in object) {
                output += '*' + object[property] + '\n'
              }
              setError(output)
              setErrorModal(true)
            })

            /* ===================== Submition Part End ===================== */
          } else {
            setFetch(true)
            Swal.fire({
              title: 'PO and Vehicle No already exists..!',
              text: 'Original Tripsheet : '+res.data.TS_NO,
              icon: "warning",
              confirmButtonText: "OK",
            }).then(function () {
              // window.location.reload(false)
            })
          }
        })
        .catch((error) => {
          console.log(error,'error')
          setFetch(true)
          var object = error.response.data.errors
          var output = ''
          for (var property in object) {
            output += '*' + object[property] + '\n'
          }
          setError(output)
          setErrorModal(true)
        })

      } else {
        Swal.fire({
            title: 'BDC Upload Rejected',
            icon: "warning",
            confirmButtonText: "OK",
        }).then(function () {
            window.location.reload(false)
        });
      }
    }
    const REQ = () => <span className="text-danger"> * </span>
    const [rowData, setRowData] = useState([])

    const getBdcUploadData = (editId = '', type = '', dataVal = []) => {

      console.log(movies,'getBdcUploadData')
      console.log(editId,'getBdcUploadData-editId')
      console.log(type,'getBdcUploadData-type')
      console.log(dataVal,'getBdcUploadData-dataVal')
      let rowDataList = []
      let updateData = []

      if(movies.length != 0 && fciPlantData.length != 0){

        if((editId || editId == 0) && type){

          if(type == '2'){
            let todoCopy = JSON.parse(JSON.stringify(movies))
            todoCopy.splice(editId, 1);
            updateData = validation(todoCopy)
            console.log(updateData,'getBdcUploadData-todoCopy1')
            setMovies(updateData)
          } else if(type == '3') {
            updateData = validation(dataVal)
            console.log(updateData,'getBdcUploadData-todoCopy2')
            setMovies(updateData)
          }

          updateData.map((data, index) => {
            rowDataList.push({
              S_NO: index + 1,
              PO_No: data.PO_No,
              Vehicle_No: data.Truck_No.toUpperCase(), 
              FCI_Plant: data.FCI_Plant,
              Upload_Status: data.upload_status == 1 ? '✔️' : '❌', 
              Remarks: data.upload_remarks,
              Action: (
                // <CButton className="badge" color="warning">
                //   <i className="fa fa-pencil" aria-hidden="true"></i>
                //   <i className="fa fa-trash" aria-hidden="true"></i>
                // </CButton>
                  <span className="float-start" color="danger">
                    <CButton
                      className="btn btn-secondary btn-sm me-md-1"
                      onClick={() => {
                        clickme(index)
                        setCurrentDataId(index)
                        setEditModalEnable(true)
                      }}
                    >
                      <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                    </CButton>

                    <CButton
                      className="btn btn-danger btn-sm me-md-1"
                      onClick={() => {
                        setCurrentDataId(index)
                        setDeleteModalEnable(true)
                      }}
                    >
                      <i className="fa fa-trash" aria-hidden="true"></i>
                    </CButton>
                  </span>
              ),
            })
          })


        } else {
          let todoCopy1 = JSON.parse(JSON.stringify(movies))
          console.log(todoCopy1,'todoCopy1')
          // todoCopy1.splice(editId, 1)
          updateData = validation(todoCopy1)
          console.log(todoCopy1,'todoCopy1')
          updateData.map((data, index) => {
            rowDataList.push({
              S_NO: index + 1,
              PO_No: data.PO_No,
              Vehicle_No: data.Truck_No.toUpperCase(), 
              FCI_Plant: data.FCI_Plant,
              Upload_Status: data.upload_status == 1 ? '✔️' : '❌', 
              Remarks: data.upload_remarks,
              Action: (
                // <CButton className="badge" color="warning">
                //   <i className="fa fa-pencil" aria-hidden="true"></i>
                //   <i className="fa fa-trash" aria-hidden="true"></i>
                // </CButton>
                  <span className="float-start" color="danger">
                    <CButton
                      className="btn btn-secondary btn-sm me-md-1"
                      onClick={() => {
                        clickme(index)
                        setCurrentDataId(index)
                        setEditModalEnable(true)
                      }}
                    >
                      <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                    </CButton>

                    <CButton
                      className="btn btn-danger btn-sm me-md-1"
                      onClick={() => {
                        setCurrentDataId(index)
                        setDeleteModalEnable(true)
                      }}
                    >
                      <i className="fa fa-trash" aria-hidden="true"></i>
                    </CButton>
                  </span>
              ),
            })
          })
        }
      }

      setRowData(rowDataList)
    }

    const columns = [
      {
        name: 'S.No',
        selector: (row) => row.S_NO,
        sortable: true,
        center: true,
      },
      {
        name: 'PO No',
        selector: (row) => row.PO_No,
        sortable: true,
        center: true,
      },
      {
        name: 'Vehicle No',
        selector: (row) => row.Vehicle_No,
        sortable: true,
        center: true,
      },       
      {
        name: 'FCI Plant',
        selector: (row) => locationFinder(row.FCI_Plant),
        sortable: true,
        center: true,
      },
      {
        name: 'Status',
        selector: (row) => row.Upload_Status,
        sortable: true,
        center: true,
      }, 
      {
        name: 'Remarks',
        selector: (row) => row.Remarks,
        sortable: true,
        center: true,
      },
      {
        name: 'Action',
        selector: (row) => row.Action,
        center: true,
      },
    ]

    const removeBDCData = () => {
      getBdcUploadData(currentDataId,2)
    }

    const changeBdcTableItem = (event, child_property_name, parent_index) => {
      let getData2 = event.target.value

      if (child_property_name == 'PO_No') {
        getData2 = event.target.value.replace(/\D/g, '')
      } else if (child_property_name == 'Truck_No') {
        getData2 = event.target.value.replace(/[^a-zA-Z0-9]/gi, '')
      }

      const bdc_parent_info = JSON.parse(JSON.stringify(movies))

      console.log(bdc_parent_info[parent_index],'bdc_parent_info')
      console.log(parent_index,'bdc_parent_info-parent_index')

      if (child_property_name == 'PO_No') {
        bdc_parent_info[parent_index][`${child_property_name}`] = Number(getData2)
      } else if (child_property_name == 'Truck_No') {
        bdc_parent_info[parent_index][`${child_property_name}`] = getData2
      } else if (child_property_name == 'FCI_Plant') {
        bdc_parent_info[parent_index][`${child_property_name}`] = getData2
      }

      getBdcUploadData(parent_index,3,bdc_parent_info)

      // let updated_data = validation(bdc_parent_info)
      // setMovies(updated_data)

    }

    const [singleFormEnable,setSingleFormEnable] = useState(false)

    return (
        <>
          {!fetch && <Loader />}{' '}
          {fetch && (

            <>
              {screenAccess ? (
                  <CCard className="mt-4">
                    <CContainer className="mt-2">
                      {movies.length == 0 && !singleFormEnable ? (
                        <CRow className="m-2">
                          <CCol xs={12} md={4}>
                            <div className="w-100 p-3">
                              <CFormLabel htmlFor="bdcCopy">
                                Choose file <REQ /> (BDC Bulk Upload)
                              </CFormLabel>
                              <CInputGroup>
                                <CFormInput
                                  onChange={handleImport}
                                  type="file"
                                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                  name="bdcCopy"
                                  size="sm"
                                  id="bdcCopy"
                                />
                                <CInputGroupText className="p-0">
                                  <CButton
                                    size="sm"
                                    style={{ marginLeft:"1px" }}
                                    color="primary"
                                    onClick={() => {
                                      window.location.reload(false)
                                    }}
                                  >
                                    <i className="fa fa-refresh px-1"></i>
                                  </CButton>
                                </CInputGroupText>
                              </CInputGroup>
                            </div>
                          </CCol>
                          <CCol xs={12} md={4}>
                            <div className="w-100 p-3">
                              <CFormLabel htmlFor="bdcCopy">

                              </CFormLabel>
                              <CInputGroup>
                                <CInputGroupText className="p-0">
                                <CButton
                                  size="sm"
                                  style={{ marginLeft:"1px" }}
                                  color="primary"
                                  onClick={() => {
                                    setSingleFormEnable(true)
                                  }}
                                >
                                  Single Upload
                                </CButton>
                                </CInputGroupText>
                              </CInputGroup>

                            </div>
                          </CCol>
                        </CRow>
                      ) : (
                        <>
                        {!singleFormEnable &&(
                          <>
                            <CRow className="m-3">
                              <CCol xs>
                                <CInputGroup>
                                  <CInputGroupText style={hd1}>
                                    Total Data Uploaded
                                  </CInputGroupText>
                                  <CFormInput readOnly value={totalData.length} />
                                </CInputGroup>
                              </CCol>
                              <CCol xs>
                                <CInputGroup>
                                  <CInputGroupText style={hd1}>
                                    Count of Valid Data
                                  </CInputGroupText>
                                  <CFormInput readOnly value={validDataLength} />
                                </CInputGroup>
                              </CCol>
                              <CCol xs>
                                <CInputGroup>
                                  <CInputGroupText style={hd1}>
                                    Count of Invalid Data
                                  </CInputGroupText>
                                  <CFormInput readOnly value={invalidDataLength} />
                                </CInputGroup>
                              </CCol>
                            </CRow>
                            <CustomTable
                              columns={columns}
                              pagination={false}
                              data={rowData}
                              fieldName={'Driver_Name'}
                              showSearchFilter={true}
                            />

                          <CRow className="m-3">

                            <CCol
                              className="offset-md-6"
                              xs={12}
                              sm={12}
                              md={6}
                              style={{ display: 'flex', justifyContent: 'flex-end' }}
                            >

                              {uploadStatus && (<span className="mr-5 text-danger float-right">* Please check Upload status </span>)}

                                <CButton
                                  size="sm"
                                  style={{ background: 'red'}}
                                  className="mx-3 text-white"
                                  onClick={(e)=>{
                                    handleSubmit(2)
                                  }}
                                >
                                  Reject
                                </CButton>
                                <CButton
                                  size="sm"
                                  style={{ background: 'green'}}
                                  className="mx-3 text-white"
                                  disabled={uploadStatus}
                                  onClick={(e)=>{
                                    setBdcSubmit(true)
                                  }}
                                >
                                  Submit
                                </CButton>
                                <button onClick={handleExport} className="btn btn-primary float-right">
                                    Export <i className="fa fa-download"></i>
                                </button>
                              </CCol>
                            </CRow>
                          </>
                        )}
                        </>
                      )}
                      {singleFormEnable && (
                        <>
                          <CRow className="mt-3">

                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="vehicle_no1">Vehicle Number <REQ/>
                              {errors.vehicle_no1 && (
                                <span className="small text-danger">{errors.vehicle_no1}</span>
                              )}
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                className="mb-2"
                                id="vehicle_no1"
                                name="vehicle_no1"
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                                maxLength={10}
                                value={values.vehicle_no1}
                              />
                            </CCol>                              

                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="Rake_Plant">FCI Plant Location<REQ/>
                              {errors.fci_plant1 && (
                                <span className="small text-danger">{errors.fci_plant1}</span>
                              )}
                              </CFormLabel>

                              <CFormSelect
                                size="sm"
                                name="fci_plant1"
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                                value={values.fci_plant1}
                              >
                                <option value="">Select...</option>
                                {fciPlantData.map((vv,kk) => {
                                  return (
                                    <>
                                      <option key={kk} value={vv.plant_id}>
                                        {vv.plant_name}
                                      </option>
                                    </>
                                  )
                                })}
                              </CFormSelect>
                            </CCol>

                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="po_no1">PO Number <REQ/>
                              {errors.po_no1 && (
                                <span className="small text-danger">{errors.po_no1}</span>
                              )}
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                className="mb-2"
                                id="po_no1"
                                name="po_no1"
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                                maxLength={11}
                                value={values.po_no1}
                              />
                            </CCol>
                          </CRow>
                          <CRow className="m-3">
                            <CCol
                              className="offset-md-6"
                              xs={12}
                              sm={12}
                              md={6}
                              style={{ display: 'flex', justifyContent: 'flex-end' }}
                            >

                              {uploadStatus && (<span className="mr-5 text-danger float-right">* Please check Upload status </span>)}


                              <CButton
                                size="sm"
                                style={{ background: 'green'}}
                                className="mx-3 text-white"
                                disabled={enableSubmit}
                                onClick={(e)=>{
                                  setBdcSubmit1(true)
                                }}
                              >
                                Submit
                              </CButton>
                              <CButton
                                size="sm"
                                style={{ background: 'red'}}
                                className="mx-3 text-white"
                                onClick={(e)=>{
                                  // handleSubmit(2)
                                  setSingleFormEnable(false)
                                  singleFormValuesClearance()
                                }}
                              >
                                Cancel
                              </CButton>

                            </CCol>
                          </CRow>
                          {values.fci_plant1 != "" && (
                            <>
                              <ColoredLine color="red" />
                              <CRow className="mt-2 mb-2" hidden>
                              <CCol xs={12} md={6}>
                                <CFormLabel
                                  htmlFor="inputAddress"
                                  style={{
                                    backgroundColor: '#4d3227',
                                    color: 'white',
                                  }}
                                >
                                  {`FCI Plant Information : `}
                                </CFormLabel>
                              </CCol>
                              </CRow>
                              <CRow>
                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="vNum">Plant Name & Code</CFormLabel>
                                  <CFormInput size="sm" id="vNum" value={`${fciPlantInfoFinder(values.fci_plant1,1)} (${fciPlantInfoFinder(values.fci_plant1,2)})`} readOnly />
                                </CCol>

                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="vNum">Company Name</CFormLabel>
                                  <CFormInput size="sm" id="vNum" value={`${fciPlantInfoFinder(values.fci_plant1,3)}`} readOnly />
                                </CCol>

                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="vNum">Street No. & Name</CFormLabel>
                                  <CFormInput size="sm" id="vNum" value={`${fciPlantInfoFinder(values.fci_plant1,4)}, ${fciPlantInfoFinder(values.fci_plant1,5)}`} readOnly />
                                </CCol>

                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="vNum">City & Pincode</CFormLabel>
                                  <CFormInput size="sm" id="vNum" value={`${fciPlantInfoFinder(values.fci_plant1,6)} - ${fciPlantInfoFinder(values.fci_plant1,9)}`} readOnly />
                                </CCol>

                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="vNum">State & Region</CFormLabel>
                                  <CFormInput size="sm" id="vNum" value={`${fciPlantInfoFinder(values.fci_plant1,7)} - ${fciPlantInfoFinder(values.fci_plant1,8)}`} readOnly />
                                </CCol>

                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="vNum">GST Number</CFormLabel>
                                  <CFormInput size="sm" id="vNum" value={`${fciPlantInfoFinder(values.fci_plant1,10)}`} readOnly />
                                </CCol>
                              </CRow>
                              <ColoredLine color="red" />
                            </>
                          )}                        
                        </>
                      )}
                    </CContainer>
                    {/* ============== Edit Confirm Button Modal Area Start ================= */}
                      <CModal
                        visible={editModalEnable}
                        size="lg"
                        backdrop="static"
                        // scrollable
                        onClose={() => {
                          setEditModalEnable(false)
                          setCurrentDataId('')
                        }}
                      >
                        {/* <CModalHeader>
                          <CModalTitle>Are you sure to Update the data ?</CModalTitle>
                        </CModalHeader> */}
                        <CModalBody>

                          <CRow className="mt-3">
                            
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="Truck_No">Vehicle Number</CFormLabel>
                              <CFormInput
                                size="sm"
                                className="mb-2"
                                id="Truck_No"
                                onChange={(e) => {
                                  changeBdcTableItem(e,'Truck_No',currentDataId)
                                }}
                                maxLength={10}
                                value={totalData[currentDataId] ? totalData[currentDataId].Truck_No : ''}
                              />
                            </CCol>                             

                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="FCI_Plant">FCI Plant</CFormLabel>

                              <CFormSelect
                                size="sm"
                                onChange={(e) => {
                                  changeBdcTableItem(e, 'FCI_Plant', currentDataId)
                                }}
                                value={totalData[currentDataId] ? totalData[currentDataId].FCI_Plant : ''}
                              >
                                <option value="">Select...</option>
                                {fciPlantData.map(({ sno, plant_symbol, plant_name }) => {
                                  return (
                                    <>
                                      <option key={sno} value={plant_symbol}>
                                        {plant_name}
                                      </option>
                                    </>
                                  )
                                })}
                              </CFormSelect>
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="PO_No">PO Number</CFormLabel>
                              <CFormInput
                                size="sm"
                                className="mb-2"
                                id="PO_No"
                                onChange={(e) => {
                                  changeBdcTableItem(e,'PO_No',currentDataId)
                                }}
                                maxLength={12}
                                value={totalData[currentDataId] ? totalData[currentDataId].PO_No : ''}
                              />
                            </CCol>
                          </CRow>
                        </CModalBody>
                        <CModalFooter>
                          {/* <CButton
                            className="m-2"
                            color="warning"
                            onClick={() => {
                              setEditModalEnable(false)
                              setCurrentDataId('')
                              // TripsheetPaymentSubmit()
                            }}
                          >
                            Yes
                          </CButton> */}
                          <CButton
                            color="secondary"
                            onClick={() => {
                              setEditModalEnable(false)
                              setCurrentDataId('')
                            }}
                          >
                            Close
                          </CButton>
                        </CModalFooter>
                      </CModal>
                    {/* ============== Edit Confirm Button Modal Area End ================= */}
                    {/* ============== Delete Confirm Button Modal Area Start ================= */}
                      <CModal
                        visible={deleteModalEnable}
                        backdrop="static"
                        size="lg"
                        // scrollable
                        onClose={() => {
                          setDeleteModalEnable(false)
                          setCurrentDataId('')
                        }}
                      >
                        <CModalHeader>
                          <CModalTitle>Are you sure to remove the data ?</CModalTitle>
                        </CModalHeader>
                        <CModalBody>

                          <CRow className="mt-3">

                          <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="fnr_no">PO Number</CFormLabel>
                              <CFormInput
                                size="sm"
                                className="mb-2"
                                id="fnr_no"
                                value={totalData[currentDataId] ? totalData[currentDataId].PO_No : ''}
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="veh_no">Vehicle Number</CFormLabel>
                              <CFormInput
                                size="sm"
                                className="mb-2"
                                id="veh_no"
                                value={totalData[currentDataId] ? totalData[currentDataId].Truck_No : ''}
                                readOnly
                              />
                            </CCol>
                             
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="r_plant">FCI Plant</CFormLabel>
                              <CFormInput
                                size="sm"
                                className="mb-2"
                                id="r_plant"
                                value={totalData[currentDataId] ? locationFinder(totalData[currentDataId].FCI_Plant) : ''}
                                readOnly
                              />
                            </CCol>
                          </CRow>
                        </CModalBody>
                        <CModalFooter>
                          <CButton
                            className="m-2"
                            color="warning"
                            onClick={() => {
                              setDeleteModalEnable(false)
                              setCurrentDataId('')
                              removeBDCData()
                            }}
                          >
                            Yes
                          </CButton>
                          <CButton
                            color="secondary"
                            onClick={() => {
                              setDeleteModalEnable(false)
                              setCurrentDataId('')
                            }}
                          >
                            No
                          </CButton>
                        </CModalFooter>
                      </CModal>
                    {/* ============== Delete Confirm Button Modal Area End ================= */}
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
                    {/* ============== Bulk BDC Submit Confirm Button Modal Area ================= */}
                    <CModal
                      visible={bdcSubmit}
                      backdrop="static"
                      // scrollable
                      onClose={() => {
                        setBdcSubmit(false)
                      }}
                    >
                      <CModalBody>
                        <p className="lead">Are you sure to Submit the FCI Details to SAP ?</p>
                      </CModalBody>
                      <CModalFooter>
                        <CButton
                          className="m-2"
                          color="warning"
                          onClick={() => {
                            setBdcSubmit(false)
                            handleSubmit(1)
                          }}
                        >
                          Confirm
                        </CButton>
                        <CButton
                          color="secondary"
                          onClick={() => {
                            setBdcSubmit(false)
                          }}
                        >
                          Cancel
                        </CButton>
                      </CModalFooter>
                    </CModal>
                    {/* ============== Bulk BDC Submit Confirm Button Modal Area ================= */}
                    {/* ============== Single BDC Submit Confirm Button Modal Area ================= */}
                    <CModal
                      visible={bdcSubmit1}
                      backdrop="static"
                      // scrollable
                      onClose={() => {
                        setBdcSubmit1(false)
                      }}
                    >
                      <CModalBody>
                        <p className="lead">Are you sure to Submit the FCI Details to SAP ?</p>
                      </CModalBody>
                      <CModalFooter>
                        <CButton
                          className="m-2"
                          color="warning"
                          onClick={() => {
                            setBdcSubmit1(false)
                            handleSubmit(3)
                          }}
                        >
                          Confirm
                        </CButton>
                        <CButton
                          color="secondary"
                          onClick={() => {
                            setBdcSubmit1(false)
                          }}
                        >
                          Cancel
                        </CButton>
                      </CModalFooter>
                    </CModal>
                    {/* ============== Single BDC Submit Confirm Button Modal Area ================= */}
                  </CCard>
                ) : (<AccessDeniedComponent />
              )}
            </>
          )}
        </>

    );
};

export default FCIBdcUpload;

