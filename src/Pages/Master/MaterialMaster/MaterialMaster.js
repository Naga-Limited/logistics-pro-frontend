/* eslint-disable prettier/prettier */
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
  CAlert,
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
} from '@coreui/react'
import { React, useEffect, useState } from 'react'
import useForm from 'src/Hooks/useForm.js'
import DieselVendorMasterValidation from '../../../Utils/Master/DieselVendorMasterValidation'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Loader from 'src/components/Loader'
import MaterialMasterService from 'src/Service/Master/MaterialMasterService'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'

const MaterialMaster = () => {

  /*================== User Id & Location Fetch ======================*/
    const user_info_json = localStorage.getItem('user_info')
    const user_info = JSON.parse(user_info_json)
    const user_locations = []
    // const navigation = useNavigate()
  
    console.log(user_info)
  
    /* Get User Locations From Local Storage */
    user_info.location_info.map((data, index) => {
      user_locations.push(data.id)
    })
  
    /* Get User Id From Local Storage */
    const user_id = user_info.user_id

  const formValues = {
    productName: '',
    materialCode: '',
    uom: '',
    materialLength: '',
    materialWidth: '',
    materialHeight: '',
    remarks: '',
    materialDivision: '',
    materialPlant: '',
  }

  const materialAlreadyExistInMaterialMaster = (data) => {
    let condition = 0
    materialMasterData.map((vb,lb)=>{
      if(vb.material_code == data.materialCode && vb.add_col_one == data.materialDivision && vb.add_col_two == data.materialPlant){
        condition = 1
      }
    })

    return condition
  }

  const navigation = useNavigate()
  const [errorModal, setErrorModal] = useState(false)
  const [materialMasterData, setMaterialMasterData] = useState([])
  const [error, setError] = useState({})
  const [fetch, setFetch] = useState(false)

  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur } = useForm(
    addNewMaterial,
    DieselVendorMasterValidation,
    formValues
  )

  const totalVolumeFinder = () => {
    let vol = 0
    if(values.materialLength && values.materialWidth && values.materialHeight)
    {
      vol = values.materialLength*values.materialWidth*values.materialHeight
    }
    return parseFloat(vol).toFixed(2)
  }

  const uomNameFinder = (code) => {
    let uom = ''

    materialUomData.map((vv,kk)=>{
      if(vv.definition_list_id == code){
        uom = vv.definition_list_code
      }
    })
    console.log(uom,'uomNameFinder')
    return uom
  }

  const REQ = () => <span className="text-danger"> * </span>
  const [materialUomData, setMaterialUomData] = useState([])

  useEffect(() => {      
    //section for getting Material Master from database
    MaterialMasterService.getMaterialInfo().then((res) => {
      setFetch(true)
      console.log(res.data.data,'getMaterials')
      setMaterialMasterData(res.data.data)
    })

    /* section for getting Material Uom Master from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(38).then((response) => {
      console.log(response.data.data,'setMaterialUomData')
      setMaterialUomData(response.data.data)
    })

  }, [])

  function addNewMaterial() {
    const formData = new FormData()

    console.log(values,'addNewMaterial-values')

    if(materialAlreadyExistInMaterialMaster(values) === 1){
      toast.warning('Entered Material Code & Division & Plant combination was already exists in Material Master..!')
      return false
    }

    console.log('uom-code', uomNameFinder(values.uom))

    if(values.productName == ''){
      toast.warning('Product Name Required..!')
      return false
    }

    if(values.materialCode == ''){
      toast.warning('Material Code Required..!')
      return false
    }

    if(values.uom == '' || values.uom == 0){
      toast.warning('Material Uom Type Required..!')
      return false
    }

    if(values.materialLength == '' || values.materialLength == 0){
      toast.warning('Material Length Required..!')
      return false
    }

    if(values.materialWidth == '' || values.materialWidth == 0){
      toast.warning('Material Width Required..!')
      return false
    }

    if(values.materialHeight == '' || values.materialHeight == 0){
      toast.warning('Material Height Required..!')
      return false
    }

    if(values.materialDivision == ''){
      toast.warning('Material Division Required..!')
      return false
    }

    if(values.materialPlant == ''){
      toast.warning('Material Plant Required..!')
      return false
    }

    formData.append('product_name', values.productName)
    formData.append('material_code', values.materialCode)
    formData.append('length', values.materialLength)
    formData.append('uom_id', values.uom)
    formData.append('uom', uomNameFinder(values.uom))
    formData.append('width', values.materialWidth)
    formData.append('height', values.materialHeight)
    formData.append('volume', totalVolumeFinder())
    formData.append('status', 1)
    formData.append('created_by', user_id)
    formData.append('add_col_one', values.materialDivision)
    formData.append('add_col_two', values.materialPlant)
    formData.append('add_col_three', values.remarks)

    // return false
    setFetch(false)
    MaterialMasterService.createMaterialInfo(formData).then((res) => {
      setFetch(true)
      if (res.status === 201) {
        toast.success('Material Created Successfully!')

        setTimeout(() => {
          navigation('/MaterialMasterTable')
        }, 1000)
      }
    })
    .catch((error) => {
      setFetch(true)
      var object = error.response.data.errors
      var output = ''
      for (var property in object) {
        output += '*' + object[property] + '\n'
      }
      setError(output)
      setErrorModal(true)
    })
  }

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>
          <CCard>
            <CTabContent>
              <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={true}>
                <CForm className="row g-3 m-2 p-1" onSubmit={handleSubmit}>
                  <CRow className="mb-md-1">
                    <CCol md={3}>
                      <CFormLabel htmlFor="dvName">
                        Product Name <REQ />                     
                      </CFormLabel>
                      <CFormInput
                        name="productName"
                        size="sm"
                        maxLength={60}
                        id="dvName" 
                        onChange={(e) => {                      
                          // e.target.value = e.target.value.replace(/[a-z]/g, '');
                          handleChange(e);
                        }}   
                        value={values.productName}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        placeholder=""
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="materialCode">
                        Material Code <REQ />
                      </CFormLabel>
                      <CFormInput
                        name="materialCode"
                        size="sm"
                        maxLength={15}
                        id="materialCode" 
                        onChange={(e) => {                      
                          e.target.value = e.target.value.replace(/[^A-Z0-9]/g, '');
                          handleChange(e);
                        }}                    
                        value={values.materialCode}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        placeholder=""
                      />
                    </CCol>
                    <CCol md={2}>
                      <CFormLabel htmlFor="uom">
                        UOM Type<REQ />{' '} 
                      </CFormLabel>
                      <CFormSelect
                        size="sm"
                        name="uom"
                        onChange={(e) => { 
                          handleChange(e)
                        }}
                        value={values.uom}                       
                        aria-label="Small select example"
                        placeholder="Select UOM Type"
                        id="uom"
                      >
                        <option value="0">Select ...</option>
                        {materialUomData.map(({ definition_list_name, definition_list_code, definition_list_id }) => {
                       
                            return (
                              <>
                                <option key={definition_list_id} value={definition_list_id}>
                                  {`${definition_list_name} - (${definition_list_code})`}
                                </option>
                              </>
                            )
                           
                        })}
                      </CFormSelect>
                    </CCol>
                    <CCol md={2}>
                      <CFormLabel htmlFor="materialLength">
                        Length (inch) <REQ />
                      </CFormLabel>
                      <CFormInput 
                        step="0.01"
                        maxLength={6}
                        name="materialLength"
                        size="sm"
                        id="materialLength"
                        onChange={(e) => {
                          e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                          handleChange(e);
                        }}
                        value={values.materialLength}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        placeholder="e.g. 20.5"
                      />
                    </CCol>
                    <CCol md={2}>
                      <CFormLabel htmlFor="materialWidth">
                        Width (inch) <REQ />
                      </CFormLabel>
                      <CFormInput 
                        maxLength={6}
                        step="0.01"
                        name="materialWidth"
                        size="sm"
                        id="materialWidth"
                        onChange={(e) => {
                          e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                          handleChange(e);
                        }}
                        value={values.materialWidth}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        placeholder="e.g. 8.5"
                      />
                    </CCol>
                    <CCol md={2}>
                      <CFormLabel htmlFor="materialHeight">
                        Height (inch) <REQ />
                      </CFormLabel>
                      <CFormInput
                        step="0.01"
                        maxLength={6}
                        name="materialHeight"
                        size="sm"
                        id="materialHeight"
                        onChange={(e) => {
                          e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                          handleChange(e);
                        }}
                        value={values.materialHeight}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        placeholder="e.g. 10.2"
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="totvolume">
                        Total Volume (inch)
                      </CFormLabel>
                      <CFormInput
                        name="totvolume"
                        size="sm"
                        maxLength={10}
                        id="totvolume"                     
                        value={totalVolumeFinder()}
                      readOnly
                      />
                    </CCol>               
                  
                    <CCol md={3}>
                      <CFormLabel htmlFor="dvMail">
                        Remarks                    
                      </CFormLabel>
                      <CFormInput
                        name="remarks"
                        size="sm"
                        maxLength={60}
                        id="remarks"
                        onChange={handleChange}
                        value={values.remarks}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        placeholder=""
                      />
                    </CCol>
                    <CCol md={2}>
                      <CFormLabel htmlFor="materialDivision">
                        Division <REQ />
                      </CFormLabel>
                      <CFormInput 
                        maxLength={4}
                        step="0.01"
                        name="materialDivision"
                        size="sm"
                        id="materialDivision"
                        onChange={(e) => {
                          e.target.value = e.target.value.replace(/[^A-Z]/g, '');
                          handleChange(e);
                        }}
                        value={values.materialDivision}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        placeholder="e.g. NLFD"
                      />
                    </CCol>
                    <CCol md={2}>
                      <CFormLabel htmlFor="materialPlant">
                        Plant <REQ />
                      </CFormLabel>
                      <CFormInput 
                        maxLength={4}
                        step="0.01"
                        name="materialPlant"
                        size="sm"
                        id="materialPlant"
                        onChange={(e) => {
                          e.target.value = e.target.value.replace(/[^A-Z0-9]/g, '');
                          handleChange(e);
                        }}
                        value={values.materialPlant}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        placeholder="e.g. FM01"
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
                        // disabled={enableSubmit}
                      >
                        Submit
                      </CButton>
                      <Link to={'/MaterialMasterTable'}>
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
        </>
      )}
    </>
  )
}

export default MaterialMaster
