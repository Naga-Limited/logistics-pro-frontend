import { CAlert, CButton, CCard, CCol, CContainer, CFormInput, CFormLabel, CFormSelect, CInputGroup, CInputGroupText, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow } from "@coreui/react";
import React, { useEffect, useState } from "react";
import { GetDateTimeFormat } from "src/Pages/Depo/CommonMethods/CommonMethods";
import DefinitionsListApi from "src/Service/Definitions/DefinitionsListApi";
import RakeVendorMasterService from "src/Service/RakeMovement/RakeMaster/RakeVendorMasterService";
import RakeTripsheetCreationService from "src/Service/RakeMovement/RakeTripsheetCreation/RakeTripsheetCreationService";
import RakeTripsheetSapService from "src/Service/SAP/RakeTripsheetSapService";
import JavascriptInArrayComponent from "src/components/commoncomponent/JavascriptInArrayComponent";
import Loader from 'src/components/Loader'
import CustomTable from "src/components/customComponent/CustomTable";
import Swal from "sweetalert2";
import { read, utils, writeFile } from 'xlsx';
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import AccessDeniedComponent from "src/components/commoncomponent/AccessDeniedComponent";
import useFormBdcUpload from "src/Hooks/useFormBdcUpload";
import RJSaleOrderCreationValidation from "src/Utils/RJSaleOrderCreation/RJSaleOrderCreationValidation";
import BdcUploadValidation from "src/Utils/RakeMovement/BdcUploadValidation";

const BdcUpload = () => {

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
  let page_no = LogisticsProScreenNumberConstants.RakeModule.Rake_BDC_Upload

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

    const fnr_vehicleNo_duplicate_having = (data,fnr_no,truck_no,index) => {

      let condition = 0
      data.map((vv,ii)=>{
        if(vv.FNR_No == fnr_no && vv.Truck_No == truck_no){
          condition = 1
        }
      })

      if(condition == 1){
        return true
      } else {
        return false
      }

    }

    const [rakeEvehiclesData, setRakeEvehiclesData] = useState([])

    const formValues = {
      fnr_no1:'',
      vehicle_no1:'',
      driver_name1:'',
      driver_number1:'',
      vendor_code1:'',
      vendor_name1:'',
      rake_plant1:'',
    }

    const singleFormValuesClearance = () => {
      values.fnr_no1 = ''
      values.vehicle_no1 = ''
      values.driver_name1 = ''
      values.driver_number1 = ''
      values.vendor_code1 = ''
      values.vendor_name1 = ''
      values.rake_plant1 = ''
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
    } = useFormBdcUpload(login, BdcUploadValidation, formValues, rakeEvehiclesData)

    function login() {
      // alert('No Errors CallBack Called')
    }

    const [rakeVendorsData, setRakeVendorsData] = useState([])

    const [rakePlantData, setRakePlantData] = useState([])

    useEffect(()=>{
      if(rakeVendorsData.length != 0){
        // && movies.length != 0 && rakePlantData.length != 0){
        console.log('yes2')
        getBdcUploadData()
      }
    },[rakeVendorsData.length != 0,movies.length != 0,rakePlantData.length != 0])
      //  movies.length != 0,rakePlantData.length != 0])

    useEffect(() => {

      /* section for getting Rake Vendors from database */
      RakeVendorMasterService.getActiveRakeVendors().then((response) => {
        // setFetch(true)
        let viewData = response.data.data
        console.log(viewData,'Rake Vendor Data')
        setRakeVendorsData(viewData)
        // getBdcUploadData()
      })

    }, [])

    const inArrayHaving = (value) => {
      let exists = false
      console.log(rakeVendorsData,'rakeVendorsData------')
      rakeVendorsData.map((val,ind)=>{
        console.log(val,'valll')
        if(val.v_code == value){
          exists = true
        }
      })
      console.log(exists,'exists-exists')
      return exists
    }

    const validation = (data) => {
      console.log(data,'validation-validation')
      let valid_data = []

      data.map((val,ind)=>{
        console.log(val,'val-validation')
        // val.Vendor_Name1 = vnameFinder(val.Vendor_Code)

        if(!val.FNR_No || val.FNR_No == '' || val.FNR_No == undefined || val.FNR_No.toString().length < 11 || val.FNR_No.length > 12 || !(Number.isInteger(val.FNR_No))  ){
            val.upload_status = '0'
            val.upload_remarks = 'Invalid FNR No'
        } else if(!checkRakeVehicle(val.Truck_No) && (!val.Truck_No || val.Truck_No == '' || val.Truck_No == undefined || val.Truck_No.toString().length < 9 || val.Truck_No.toString().length > 10 || !(val.Truck_No.match(/^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/)))){
          val.upload_status = '0'
          val.upload_remarks = 'Invalid Vehicle No'
        } else if(fnr_vehicleNo_duplicate_having(valid_data,val.FNR_No,val.Truck_No,ind)){
          val.upload_status = '0'
          val.upload_remarks = 'Duplicate Data'
        }
        // else if(!val.Vendor_Name || val.Vendor_Name == '' || val.Vendor_Name == undefined || val.Vendor_Name.toString().length < 2 || (/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(val.Vendor_Name))  ){
        //   val.upload_status = '0'
        //   val.upload_remarks = 'Invalid Vendor Name'
        // }
        else if(!val.Vendor_Code || val.Vendor_Code == '' || val.Vendor_Code == undefined || val.Vendor_Code.toString().length < 5 || val.Vendor_Code.toString().length > 7 || !(Number.isInteger(val.Vendor_Code)) ||  !inArrayHaving(val.Vendor_Code)) {
          console.log(val.Vendor_Code,'val.Vendor_Code err')
          console.log(rakeVendorsData,'val.Vendor_Code err12')
          console.log(inArrayHaving(val.Vendor_Code),'val.Vendor_Code err-inArrayHaving(val.Vendor_Code)')
          val.upload_status = '0'
          val.upload_remarks = 'Invalid Vendor Code'
        } else if(!val.Driver_Name || val.Driver_Name == '' || val.Driver_Name == undefined || val.Driver_Name.toString().length < 2 || (/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(val.Driver_Name))  ){
          val.upload_status = '0'
          val.upload_remarks = 'Invalid Driver Name'
        } else if(!val.Driver_Phone_No || val.Driver_Phone_No == '' || val.Driver_Phone_No == undefined || val.Driver_Phone_No.toString().length != 10 || !(Number.isInteger(val.Driver_Phone_No)) ){
          val.upload_status = '0'
          val.upload_remarks = 'Invalid Mobile No.'
        } else if(!val.Rake_Plant || val.Rake_Plant == '' || val.Rake_Plant == undefined || locationFinder(val.Rake_Plant) == '--'){
          console.log(val.Rake_Plant,'val.Rake_Plant err')
          console.log(rakePlantData,'val.Rake_Plant err12')
          console.log(locationFinder(val.Rake_Plant),'val.Rake_Plant err13')
          // console.log(inArrayHaving(val.Vendor_Code),'val.Vendor_Code err-inArrayHaving(val.Vendor_Code)')
          val.upload_status = '0'
          val.upload_remarks = 'Invalid Rake Plant'
        } else {
          val.upload_status = '1'
          val.upload_remarks = '--'
        }

        // val.Vendor_Name = val.Vendor_Name.toUpperCase()
        val.Driver_Name = val.Driver_Name.toUpperCase()
        val.Truck_No = val.Truck_No.toUpperCase()

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
      rakePlantData.map((datann, indexnn) => {
        if(datann.plant_code == plant){
          n_loc = datann.plant_name
        }
      })
      return n_loc
    }

    const vnameFinder = (vcode) => {
      let vname = '--'
      rakeVendorsData.map((datann1, indexnn1) => {
        if(datann1.v_code == vcode){
          vname = datann1.v_name
        }
      })
      return vname
    }

    const plantDuplicateCheckInvalid = (dat) => {
      let plantArray = []
      console.log(dat,'plantDuplicateCheckInvalid')
      dat.map((va,ke)=>{
        // console.log(va,'dat'+ke)
        if(ke == 0){
          plantArray.push(va.Rake_Plant)
        } else {
          plantArray.map((vv,kk)=>{
            if(vv !== va.Rake_Plant){
              plantArray.push(va.Rake_Plant)
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
            'FNR_No',
            'Truck_No',
            'Vendor_Code',
            'Driver_Name',
            'Driver_Phone_No',
            'Rake_Plant',
            // 'Vendor_Name',
            'Upload_Status',
            'Remarks'
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

      let fp = tsNo.substring(0,9);
      var pad = "000"
      var ans = pad.substring(0, (pad.length - String(rNo).length))
      let needed_tripsheet = `${fp}${ans}${rNo}`
      console.log(needed_tripsheet,'needed_tripsheet')
      return needed_tripsheet
    }

    const setVendorName = (vCode) => {

      let vName = 'ABCDE'
      rakeVendorsData.map((vm,km)=>{
        if(vm.v_code == vCode){
          vName = vm.v_name
        }
      })

      return vName
    }

    const setVendorId = (vCode) => {

      let vId = 'ABCDE'
      rakeVendorsData.map((vm,km)=>{
        if(vm.v_code == vCode){
          vId = vm.v_id
        }
      })

      return vId
    }

    const vendorNameFinder = (vCode) => {

      let vName = '--'
      rakeVendorsData.map((vm,km)=>{
        if(vm.v_code == vCode){
          vName = vm.v_name
        }
      })

      return vName
    }

    const handleSubmit = (type) => {
      if(type == 1){
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

          RakeTripsheetCreationService.getRakeTripSheetNo(movies[0].Rake_Plant).then((res) => {
            let tripsheet_no = res.data.ts_no

            const running_no = Number(tripsheet_no.substring(9))

            console.log(tripsheet_no,'tripsheet_no')
            console.log(movies,'tripsheet_no-movies')

            var BDCSendData = {}
            var BDCSendData_seq = []
            var BDCSendData_seq1 = []

            /* Set BDC Data via Uploaded Data by Loop */
            for (var i = 0; i < movies.length; i++) {
              BDCSendData.TRIP_SHEET = setTripsheetNo(tripsheet_no,running_no+i)
              BDCSendData.FNR_NO = movies[i].FNR_No
              BDCSendData.VEHICLE_NO = movies[i].Truck_No
              BDCSendData.VENDOR_CODE = movies[i].Vendor_Code
              BDCSendData.VENDOR_NAME = setVendorName(movies[i].Vendor_Code)
              BDCSendData.DRIVER_NAME = movies[i].Driver_Name
              BDCSendData.DRIVER_PH_NO = movies[i].Driver_Phone_No
              BDCSendData.SAP_FLAG = 1
              BDCSendData.RAKE_PLANT = movies[i].Rake_Plant

              BDCSendData_seq[i] = BDCSendData

              let be_data = JSON.parse(JSON.stringify(BDCSendData))
              be_data.VENDOR_ID = setVendorId(movies[i].Vendor_Code)
              // be_data.PLANT_ID = setPlantId(be_data[i].Vendor_Code)
              BDCSendData_seq1[i] = be_data
              be_data = {}

              BDCSendData = {}
            }

            console.log(BDCSendData_seq,'BDCSendData_seq')
            console.log(BDCSendData_seq1,'BDCSendData_seq1')

            RakeTripsheetSapService.createTripsheet(BDCSendData_seq).then((res) => {
              console.log(res,'createTripsheet-response')
              let sap_tsc_res = JSON.stringify(res.data)

              if(sap_tsc_res && sap_tsc_res.length > 0){

                const formData = new FormData()
                formData.append('lp_data', JSON.stringify(BDCSendData_seq1))
                formData.append('sap_res', sap_tsc_res)
                formData.append('created_by', user_id)

                RakeTripsheetCreationService.createTripsheet(formData).then((res) => {
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
      } else if(type == 3) {

        setFetch(false)

        RakeTripsheetCreationService.checkDuplicateDataForFnrVehNo(values.fnr_no1,values.vehicle_no1).then((res) => {
          console.log(res,'res')
          if(res.status == 201 && (res.data.status == 2 || res.data.status == 3)){

            /* ===================== Submition Part Start ===================== */

            RakeTripsheetCreationService.getRakeTripSheetNo(values.rake_plant1).then((res) => {
              let tripsheet_no = res.data.ts_no

              console.log(tripsheet_no,'tripsheet_no')

              var BDCSendData = {}
              var BDCSendData_seq = []
              var BDCSendData_seq1 = []

              /* Set BDC Data via Uploaded Data by Loop */
              for (var i = 0; i < 1; i++) {
                BDCSendData.TRIP_SHEET = tripsheet_no
                BDCSendData.FNR_NO = values.fnr_no1
                BDCSendData.VEHICLE_NO = values.vehicle_no1
                BDCSendData.VENDOR_CODE = values.vendor_code1
                BDCSendData.VENDOR_NAME = setVendorName(values.vendor_code1)
                BDCSendData.DRIVER_NAME = values.driver_name1
                BDCSendData.DRIVER_PH_NO = values.driver_number1
                BDCSendData.SAP_FLAG = 1
                BDCSendData.RAKE_PLANT = values.rake_plant1

                BDCSendData_seq[i] = BDCSendData

                let be_data = JSON.parse(JSON.stringify(BDCSendData))
                be_data.VENDOR_ID = setVendorId(values.vendor_code1)
                // be_data.PLANT_ID = setPlantId(be_data[i].Vendor_Code)
                BDCSendData_seq1[i] = be_data
                be_data = {}

                BDCSendData = {}
              }

              console.log(BDCSendData_seq,'BDCSendData_seq')
              console.log(BDCSendData_seq1,'BDCSendData_seq1')

              RakeTripsheetSapService.createTripsheet(BDCSendData_seq).then((res) => {
                console.log(res,'createTripsheet-response')
                let sap_tsc_res = JSON.stringify(res.data)

                if(sap_tsc_res && sap_tsc_res.length > 0){

                  const formData = new FormData()
                  formData.append('lp_data', JSON.stringify(BDCSendData_seq1))
                  formData.append('sap_res', sap_tsc_res)
                  formData.append('created_by', user_id)

                  RakeTripsheetCreationService.createTripsheet(formData).then((res) => {
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
              title: 'FNR and Vehicle No already exists..!',
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

      if(movies.length != 0 && rakeVendorsData.length != 0 && rakePlantData.length != 0){

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
              FNR_No: data.FNR_No,
              Vehicle_No: data.Truck_No.toUpperCase(),
              Vendor_Name: vnameFinder(data.Vendor_Code),
              Vendor_Code: data.Vendor_Code,
              Driver_Name: data.Driver_Name.toUpperCase(),
              Driver_Number: data.Driver_Phone_No,
              Rake_Plant: data.Rake_Plant,
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
              FNR_No: data.FNR_No,
              Vehicle_No: data.Truck_No.toUpperCase(),
              Vendor_Name: vnameFinder(data.Vendor_Code),
              Vendor_Code: data.Vendor_Code,
              Driver_Name: data.Driver_Name.toUpperCase(),
              Driver_Number: data.Driver_Phone_No,
              Rake_Plant: data.Rake_Plant,
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
        name: 'FNR No',
        selector: (row) => row.FNR_No,
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
        name: 'Vendor Name',
        selector: (row) => row.Vendor_Name,
        sortable: true,
        center: true,
      },
      {
        name: 'Vendor Code',
        selector: (row) => row.Vendor_Code,
        sortable: true,
        center: true,
      },
      {
        name: 'Driver Name',
        selector: (row) => row.Driver_Name,
        sortable: true,
        center: true,
      },
      {
        name: 'Driver Mobile No',
        selector: (row) => row.Driver_Number,
        sortable: true,
        center: true,
      },
      {
        name: 'Rake Plant',
        selector: (row) => locationFinder(row.Rake_Plant),
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

      if (child_property_name == 'FNR_No' || child_property_name == 'Driver_Phone_No' || child_property_name == 'Vendor_Code') {
        getData2 = event.target.value.replace(/\D/g, '')
      }
      // else if (child_property_name == 'Vendor_Name') {
      //   getData2 = event.target.value.replace(/[^a-zA-Z0-9 ]/gi, '')
      // }
      else if (child_property_name == 'Driver_Name') {
        getData2 = event.target.value.replace(/[^a-zA-Z0 ]/gi, '')
      } else if (child_property_name == 'Truck_No') {
        getData2 = event.target.value.replace(/[^a-zA-Z0-9]/gi, '')
      }

      const bdc_parent_info = JSON.parse(JSON.stringify(movies))

      console.log(bdc_parent_info[parent_index],'bdc_parent_info')
      console.log(parent_index,'bdc_parent_info-parent_index')

      if (child_property_name == 'FNR_No') {
        bdc_parent_info[parent_index][`${child_property_name}`] = Number(getData2)
      } else if (child_property_name == 'Truck_No') {
        bdc_parent_info[parent_index][`${child_property_name}`] = getData2
      }
      // else if (child_property_name == 'Vendor_Name') {
      //   bdc_parent_info[parent_index][`${child_property_name}`] = getData2
      // }
      else if (child_property_name == 'Vendor_Code') {
        bdc_parent_info[parent_index][`${child_property_name}`] = Number(getData2)
      } else if (child_property_name == 'Driver_Name') {
        bdc_parent_info[parent_index][`${child_property_name}`] = getData2
      } else if (child_property_name == 'Driver_Phone_No') {
        bdc_parent_info[parent_index][`${child_property_name}`] = Number(getData2)
      } else if (child_property_name == 'Rake_Plant') {
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
                                Choose file <REQ />
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
                              <CFormLabel htmlFor="fnr_no1">FNR Number <REQ/>
                              {errors.fnr_no1 && (
                                <span className="small text-danger">{errors.fnr_no1}</span>
                              )}
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                className="mb-2"
                                id="fnr_no1"
                                name="fnr_no1"
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                                maxLength={12}
                                value={values.fnr_no1}
                              />
                            </CCol>
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
                              <CFormLabel htmlFor="driver_name1">Driver Name <REQ/>
                              {errors.driver_name1 && (
                                <span className="small text-danger">{errors.driver_name1}</span>
                              )}
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                className="mb-2"
                                id="driver_name1"
                                name="driver_name1"
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                                maxLength={30}
                                value={values.driver_name1}
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="driver_number1">Driver Number <REQ/>
                              {errors.driver_number1 && (
                                <span className="small text-danger">{errors.driver_number1}</span>
                              )}
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                className="mb-2"
                                id="driver_number1"
                                name="driver_number1"
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                                maxLength={10}
                                value={values.driver_number1}
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="vendor_code1">Vendor Code <REQ/>
                              {errors.vendor_code1 && (
                                <span className="small text-danger">{errors.vendor_code1}</span>
                              )}
                              </CFormLabel>

                              <CFormSelect
                                size="sm"
                                name="vendor_code1"
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                                value={values.vendor_code1}
                              >
                                <option value="">Select...</option>
                                {rakeVendorsData.map(({v_id, v_code, v_name }) => {
                                  return (
                                    <>
                                      <option key={v_id} value={v_code}>
                                        {v_code}
                                      </option>
                                    </>
                                  )
                                })}
                              </CFormSelect>
                            </CCol>
                            <CCol xs={12} md={4}>
                              <CFormLabel htmlFor="v_name">Vendor Name</CFormLabel>
                              <CFormInput
                                size="sm"
                                className="mb-2"
                                id="v_name"
                                value={vendorNameFinder(values.vendor_code1)}
                                readOnly
                              />
                            </CCol>

                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="Rake_Plant">Rake Plant <REQ/>
                              {errors.rake_plant1 && (
                                <span className="small text-danger">{errors.rake_plant1}</span>
                              )}
                              </CFormLabel>

                              <CFormSelect
                                size="sm"
                                name="rake_plant1"
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                                value={values.rake_plant1}
                              >
                                <option value="">Select...</option>
                                {rakePlantData.map(({ sno, plant_code, plant_name }) => {
                                  return (
                                    <>
                                      <option key={sno} value={plant_code}>
                                        {plant_name}
                                      </option>
                                    </>
                                  )
                                })}
                              </CFormSelect>
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
                              <CFormLabel htmlFor="FNR_No">FNR Number</CFormLabel>
                              <CFormInput
                                size="sm"
                                className="mb-2"
                                id="FNR_No"
                                onChange={(e) => {
                                  changeBdcTableItem(e,'FNR_No',currentDataId)
                                }}
                                maxLength={12}
                                value={totalData[currentDataId] ? totalData[currentDataId].FNR_No : ''}
                              />
                            </CCol>
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
                              <CFormLabel htmlFor="d_name">Driver Name</CFormLabel>
                              <CFormInput
                                size="sm"
                                className="mb-2"
                                id="Driver_Name"
                                onChange={(e) => {
                                  changeBdcTableItem(e,'Driver_Name',currentDataId)
                                }}
                                maxLength={30}
                                value={totalData[currentDataId] ? totalData[currentDataId].Driver_Name : ''}
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="d_no">Driver Number</CFormLabel>
                              <CFormInput
                                size="sm"
                                className="mb-2"
                                id="Driver_Phone_No"
                                onChange={(e) => {
                                  changeBdcTableItem(e,'Driver_Phone_No',currentDataId)
                                }}
                                maxLength={10}
                                value={totalData[currentDataId] ? totalData[currentDataId].Driver_Phone_No : ''}
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="Vendor_Code">Vendor Code</CFormLabel>

                              <CFormSelect
                                size="sm"
                                onChange={(e) => {
                                  changeBdcTableItem(e, 'Vendor_Code', currentDataId)
                                }}
                                value={totalData[currentDataId] ? totalData[currentDataId].Vendor_Code : ''}
                              >
                                <option value="">Select...</option>
                                {rakeVendorsData.map(({v_id, v_code, v_name }) => {
                                  return (
                                    <>
                                      <option key={v_id} value={v_code}>
                                        {v_name}
                                      </option>
                                    </>
                                  )
                                })}
                              </CFormSelect>
                            </CCol>
                            <CCol xs={12} md={4}>
                              <CFormLabel htmlFor="v_name">Vendor Name</CFormLabel>
                              <CFormInput
                                size="sm"
                                className="mb-2"
                                id="v_name"
                                value={totalData[currentDataId] ? (totalData[currentDataId].Vendor_Code ? vnameFinder(totalData[currentDataId].Vendor_Code) : ''):''}
                                readOnly
                              />
                            </CCol>

                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="Rake_Plant">Rake Plant</CFormLabel>

                              <CFormSelect
                                size="sm"
                                onChange={(e) => {
                                  changeBdcTableItem(e, 'Rake_Plant', currentDataId)
                                }}
                                value={totalData[currentDataId] ? totalData[currentDataId].Rake_Plant : ''}
                              >
                                <option value="">Select...</option>
                                {rakePlantData.map(({ sno, plant_code, plant_name }) => {
                                  return (
                                    <>
                                      <option key={sno} value={plant_code}>
                                        {plant_name}
                                      </option>
                                    </>
                                  )
                                })}
                              </CFormSelect>
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
                              <CFormLabel htmlFor="fnr_no">FNR Number</CFormLabel>
                              <CFormInput
                                size="sm"
                                className="mb-2"
                                id="fnr_no"
                                value={totalData[currentDataId] ? totalData[currentDataId].FNR_No : ''}
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
                              <CFormLabel htmlFor="v_code">Vendor Code</CFormLabel>
                              <CFormInput
                                size="sm"
                                className="mb-2"
                                id="v_code"
                                value={totalData[currentDataId] ? totalData[currentDataId].Vendor_Code : ''}
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="v_name">Vendor Name</CFormLabel>
                              <CFormInput
                                size="sm"
                                className="mb-2"
                                id="v_name"
                                value={totalData[currentDataId] ? (totalData[currentDataId].Vendor_Code ? vnameFinder(totalData[currentDataId].Vendor_Code) : ''):''}
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="d_name">Driver Name</CFormLabel>
                              <CFormInput
                                size="sm"
                                className="mb-2"
                                id="d_name"
                                value={totalData[currentDataId] ? totalData[currentDataId].Driver_Name : ''}
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="d_no">Driver Number</CFormLabel>
                              <CFormInput
                                size="sm"
                                className="mb-2"
                                id="d_no"
                                value={totalData[currentDataId] ? totalData[currentDataId].Driver_Phone_No : ''}
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="r_plant">Rake Plant</CFormLabel>
                              <CFormInput
                                size="sm"
                                className="mb-2"
                                id="r_plant"
                                value={totalData[currentDataId] ? locationFinder(totalData[currentDataId].Rake_Plant) : ''}
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
                        <p className="lead">Are you sure to Submit the Rake Details to SAP ?</p>
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
                        <p className="lead">Are you sure to Submit the Rake Details to SAP ?</p>
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

export default BdcUpload;

