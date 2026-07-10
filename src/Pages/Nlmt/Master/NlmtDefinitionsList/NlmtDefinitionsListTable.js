import {
  CForm,
  CButton,
  CCard,
  CContainer,
  CCol,
  CRow,
  CModal,
  CFormInput,
  CFormLabel,
  CModalHeader,
  CFormSelect,
  CInputGroupText,
  CInputGroup,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CAlert,
  CTooltip,
} from '@coreui/react'
import React, { useState, useEffect } from 'react'
import useForm from 'src/Hooks/useForm'
import Loader from 'src/components/Loader'
import SmallLoader from 'src/components/SmallLoader'
import CustomTable from 'src/components/customComponent/CustomTable'
import { toast } from 'react-toastify'
import NlmtDefinitionsApi from 'src/Service/Nlmt/Masters/NlmtDefinitionsApi'
import NlmtDefinitionsListApi from 'src/Service/Nlmt/Masters/NlmtDefinitionsListApi'
import NlmtDefinitionsMasterValidation from 'src/Utils/Nlmt/Masters/NlmtDefinitionsMasterValidation'

const NlmtDefinitionsListTable = () => {
  const REQ = () => <span className="text-danger"> * </span>

  const [modal, setModal] = useState(false)
  const [fetch, setFetch] = useState(false)
  const [smallfetch, setSmallFetch] = useState(false)
  const [rowData, setRowData] = useState([])
  const [definitionsAll, setDefinitionsAll] = useState([])
  const [currentDefinitionId, setCurrentDefinitionId] = useState('')
  const [disabled, setDisabled] = useState(true)
  const [save, setSave] = useState(true)
  const [editId, setEditId] = useState('')
  const [success, setSuccess] = useState('')
  const [update, setUpdate] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(true)

  const formValues = {
    definition_id: '',
    definition: '',
    definition_list_code: '',
  }

  const {
    values,
    errors,
    handleChange,
    onFocus,
    onBlur,
  } = useForm(() => { }, NlmtDefinitionsMasterValidation, formValues)

  /* ================= LOAD DEFINITIONS ================= */
  useEffect(() => {
    NlmtDefinitionsApi.getNlmtDefinitions().then((res) => {
      setDefinitionsAll(res.data.data || [])
      setFetch(true)
      setSmallFetch(true)
    })
  }, [])

  /* ================= LOAD LIST BY DEFINITION ================= */
  const assignValues = (id) => {
    values.definition_id = id
    setCurrentDefinitionId(id)

    if (!id || id == 0) {
      setDisabled(true)
      return
    }

    setDisabled(false)
    setSmallFetch(false)

    NlmtDefinitionsListApi.visibleNlmtDefinitionsListByDefinition(id).then((res) => {
      const viewData = res.data.data || []

      const rows = viewData.map((data, index) => ({
        sno: index + 1,
        Definition_List: data.definition_list_name,
        Code: data.definition_list_code,
        Status: data.definition_list_status === 1 ? '✔️' : '❌',
        Created_at: data.created_at,
        Action: (
          <div className="d-flex">
            <CTooltip content="Delete">
              <CButton
                size="sm"
                color="danger"
                className="m-1"
                onClick={() => Delete(data.definition_list_id)}
              >
                <i className="fa fa-trash" />
              </CButton>
            </CTooltip>
            <CTooltip content="Edit">
              <CButton
                size="sm"
                color="secondary"
                className="m-1"
                disabled={data.definition_list_status !== 1}
                onClick={() => Edit(data.definition_list_id)}
              >
                <i className="fa fa-edit" />
              </CButton>
            </CTooltip>
          </div>
        ),
      }))

      setRowData(rows)
      setPending(false)
      setSmallFetch(true)
    })
  }

  /* ================= REFRESH CURRENT ================= */
  const reloadCurrentDefinition = () => {
    if (currentDefinitionId) assignValues(currentDefinitionId)
  }

  /* ================= CREATE ================= */
  const Create = (e) => {
    e.preventDefault()

    const payload = {
      def_title_id: values.definition_id,
      def_list_name: values.definition,
      def_list_code: values.definition_list_code,
    }

    NlmtDefinitionsListApi.createNlmtDefinitionsList(payload)
      .then(() => {
        toast.success('New Definition List Added Successfully!')
        setModal(false)
        reloadCurrentDefinition()
      })
      .catch((err) => {
        setError(err.response?.data?.errors?.def_title?.[0])
      })
  }

  /* ================= EDIT ================= */
  const Edit = (id) => {
    setSave(false)
    setEditId(id)
    setSmallFetch(false)

    NlmtDefinitionsListApi.getNlmtDefinitionsListById(id).then((res) => {
      const d = res.data.data
      values.definition_id = d.definition_id
      values.definition = d.definition_list_name
      values.definition_list_code = d.definition_list_code
      setModal(true)
      setSmallFetch(true)
    })
  }

  /* ================= UPDATE ================= */
  const Update = () => {
    const payload = {
      def_title_id: values.definition_id,
      def_list_name: values.definition,
      def_list_code: values.definition_list_code,
    }

    NlmtDefinitionsListApi.updateNlmtDefinitionsList(payload, editId)
      .then(() => {
        toast.success('Definition Updated Successfully!')
        setModal(false)
        setSave(true)
        reloadCurrentDefinition()
      })
      .catch((err) => {
        setError(err.response?.data?.errors?.def_title?.[0])
      })
  }

  /* ================= DELETE ================= */
  const Delete = (id) => {
    NlmtDefinitionsListApi.deleteNlmtDefinitionsList(id).then(() => {
      toast.success('Definitions List Status Updated Successfully!')
      reloadCurrentDefinition()
    })
  }

  /* ================= TABLE COLUMNS ================= */
  const columns = [
    { name: 'S.No', selector: (row) => row.sno, center: true },
    { name: 'Creation date', selector: (row) => row.Created_at },
    { name: 'Definition List', selector: (row) => row.Definition_List },
    { name: 'Code', selector: (row) => row.Code },
    { name: 'Status', selector: (row) => row.Status },
    { name: 'Action', selector: (row) => row.Action, center: true },
  ]

  if (!fetch) return <Loader />

  return (
    <>
      <CContainer className="mt-2">
        <CRow >
          <CCol md={5}>
            <div className="p-3 border bg-light">
              <CInputGroup className="mb-3">
                <CInputGroupText component="label" htmlFor="inputGroupSelect01">Definitions</CInputGroupText>
                <CFormSelect
                  value={values.definition_id}
                  onChange={(e) => assignValues(e.target.value)}
                   id="inputGroupSelect01"
                >
                  <option value={0}>Select...</option>
                  {definitionsAll.map((d) => (
                    <option key={d.definition_id} value={d.definition_id}>
                      {d.definition_name}
                    </option>
                  ))}
                </CFormSelect>
              </CInputGroup>
            </div>
          </CCol>
        </CRow>

        {!smallfetch && <SmallLoader />}

        {smallfetch && !disabled && (
          <>

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
                  values.definition = ''
                  values.definition_list_code = ''
                  setSave(true)
                  setModal(true)
                }}
              >
                New
              </CButton>
            </CCol>
            <CCard>
              <CustomTable columns={columns} data={rowData} />
            </CCard>
          </>
        )}
      </CContainer>

      {/* MODAL */}
      <CModal visible={modal} onClose={() => setModal(false)}>
        <CModalHeader>
          <CModalTitle>Definition</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {success && <CAlert color="success">{success}</CAlert>}
          {update && <CAlert color="primary">{update}</CAlert>}
          {error && <CAlert color="danger">{error}</CAlert>}

          <CFormLabel>
            Definition Name <REQ />
          </CFormLabel>
          <CFormInput
            name="definition"
            value={values.definition}
            onChange={handleChange}
            onFocus={onFocus}
            onBlur={onBlur}
            className={errors.definition && 'is-invalid'}
          />

          <CFormLabel className="mt-2">Definition List Code</CFormLabel>
          <CFormInput
            name="definition_list_code"
            placeholder="-"
            value={values.definition_list_code}
            onChange={handleChange}
            onFocus={onFocus}
            onBlur={onBlur}
            className={errors.definition_list_code && 'is-invalid'}
          />
        </CModalBody>
        <CModalFooter>
          <CButton onClick={save ? Create : Update}>
            {save ? 'Save' : 'Update'}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default NlmtDefinitionsListTable
