import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { setBreadCrumbItemsAction, setToastAction } from "../../store/actions/appActions"
import { administration_routes_items } from "../../routes/admin/administration_routes"
import { Button } from 'primereact/button';
import { useForm } from "../../hooks/useForm";
import { useFormErrorsHandle } from "../../hooks/useFormErrorsHandle";
import fetchApi from "../../helpers/fetchApi";
import { InputText } from 'primereact/inputtext';
import { useNavigate, useLocation } from "react-router-dom";
import { Dropdown } from 'primereact/dropdown';


export default function EditUtilisateurPage() {
  const dispacth = useDispatch()
  const location = useLocation()
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fonctions, setFonctions] = useState([])
  const [fonctionsinfo, setFonctionsinfo] = useState(location?.state?.fonction)
   
  const [sexes, setSexes] = useState([])
  const [sexesinfo, setSexesinfo] = useState(location?.state?.sexes)

  const [profiles, setProfiles] = useState([])
  const [profilesinfo, setProfilesinfo] = useState(location?.state?.profiles)
  console.log(location.state.profiles)
  const navigate = useNavigate()
 


  const initialForm = {
    NOM: location?.state?.NOM,
    PRENOM: location?.state?.PRENOM,
    EMAIL: location?.state?.EMAIL,
    PHONE: location?.state?.PHONE,
    sexes: location?.state?.sexes,
    fonction: location?.state?.fonction,
    profiles: location?.state?.profiles,
  

  }
  const [data, handleChange] = useForm(initialForm)
  const { hasError, getError, setErrors, checkFieldData, isValidate } = useFormErrorsHandle(data, {
    NOM: {
      required: true,
      alpha: true,
      length: [2, 191]
    },



  })

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      if (!isValidate()) return false
      setIsSubmitting(true)
      const form = new FormData()
      form.append("NOM", data.NOM)
      form.append("PRENOM", data.PRENOM)
      form.append("EMAIL", data.EMAIL)
      form.append("PHONE", data.PHONE)

      form.append("FONCTION_ID", fonctionsinfo.FONCTION_ID)
      form.append("SEXE_ID", sexesinfo.SEXE_ID)
      form.append("PROFIL_ID", profilesinfo.PROFIL_ID)

      const idProfile = location?.state?.UTIL_ID

      await fetchApi(`/administration/utilisateurs/update/${idProfile}`, {
        method: 'PUT',
        body: form
      })
      dispacth(setToastAction({ severity: 'success', summary: 'Profile enregistré', detail: "Le profile a été enregistré avec succès", life: 3000 }))
      navigate('/utilisateurs')
    } catch (error) {
      // console.log(error)
      if (error.httpStatus == "UNPROCESSABLE_ENTITY") {
        setErrors(error.result)
      } else {
        dispacth(setToastAction({ severity: 'error', summary: 'Erreur du système', detail: 'Erreur du système, réessayez plus tard', life: 3000 }));
      }
    } finally {
      setIsSubmitting(false)
    }
  }


  useEffect(() => {

  }, [])

  useEffect(() => {
    dispacth(setBreadCrumbItemsAction([
      administration_routes_items.utilisateurs,
      administration_routes_items.edit_utilisateurs
    ]))
    return () => {
      dispacth(setBreadCrumbItemsAction([]))
    }
  }, [])

  useEffect(() => {
    (async () => {

      try {
        const res = await fetchApi(`/administration/utilisateurs/fonc`)
        // console.log(res)
        setFonctions(res.result)
      } catch (error) {
        console.log(error)
      }

    })()
  }, [])

  
  useEffect(() => {
    (async () => {

      try {
        const res = await fetchApi(`/administration/utilisateurs/sexe`)
        // console.log(res)
        setSexes(res.result)
      } catch (error) {
        console.log(error)
      }

    })()
  }, [])

  
  useEffect(() => {
    (async () => {

      try {
        const res = await fetchApi(`/administration/utilisateurs/profile`)
        // console.log(res)
        setProfiles(res.result)
      } catch (error) {
        console.log(error)
      }

    })()
  }, [])

  return (
    <>

      <div className="px-4 py-3 main_content bg-white has_footer">

        <form className="form w-75 mt-5" onSubmit={handleSubmit}>
          <div className="form-group col-sm mt-5">
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="NOM" className="label mb-1">NOM</label>
              </div>
              <div className="col-sm">
                <InputText type="text" placeholder="profile" name="NOM" value={data.NOM} onChange={handleChange} onBlur={checkFieldData} className={`w-100 is-invalid ${hasError('NOM') ? 'p-invalid' : ''}`} />
                <div className="invalid-feedback" style={{ minHeight: 21, display: 'block' }}>
                  {hasError('NOM') ? getError('NOM') : ""}
                </div>
              </div>
            </div>
          </div>
          <div className="form-group col-sm mt-5">
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="NOM" className="label mb-1">NOM</label>
              </div>
              <div className="col-sm">
                <InputText type="text" placeholder="PRENOM" name="PRENOM" value={data.PRENOM} onChange={handleChange} onBlur={checkFieldData} className={`w-100 is-invalid ${hasError('PRENOM') ? 'p-invalid' : ''}`} />
                <div className="invalid-feedback" style={{ minHeight: 21, display: 'block' }}>
                  {hasError('PRENOM') ? getError('PRENOM') : ""}
                </div>
              </div>
            </div>
          </div>
          <div className="form-group col-sm mt-5">
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="EMAIL" className="label mb-1">EMAIL</label>
              </div>
              <div className="col-sm">
                <InputText type="text" placeholder="EMAIL" name="EMAIL" value={data.EMAIL} onChange={handleChange} onBlur={checkFieldData} className={`w-100 is-invalid ${hasError('EMAIL') ? 'p-invalid' : ''}`} />
                <div className="invalid-feedback" style={{ minHeight: 21, display: 'block' }}>
                  {hasError('EMAIL') ? getError('EMAIL') : ""}
                </div>
              </div>
            </div>
          </div>
          <div className="form-group mt-5">
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="sexes" className="label mb-1">Sexe</label>
              </div>
              <div className="col-sm">
                <div className="w-100">
                  <Dropdown
                    value={sexesinfo}
                    options={sexes}
                    onChange={e => setSexesinfo(e.value)}
                    optionLabel="SEXE"
                    id="sexes"
                    filter
                    showClear
                    filterBy="SEXE"
                    placeholder="Selectionner le genre"
                    emptyFilterMessage="Aucun élément trouvé"
                    emptyMessage="Aucun élément trouvé"
                    name="sexes"
                    onHide={() => {
                      checkFieldData({ target: { name: "sexes" } })
                    }}
                    className={`w-100 ${hasError('sexes') ? 'p-invalid' : ''}`}
                  />
                  <div className="invalid-feedback" style={{ minHeight: 21, display: 'block' }}>
                    {hasError('sexes') ? getError('sexes') : ""}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="form-group col-sm mt-5">
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="PHONE" className="label mb-1">EMAIL</label>
              </div>
              <div className="col-sm">
                <InputText type="text" placeholder="PHONE" name="PHONE" value={data.PHONE} onChange={handleChange} onBlur={checkFieldData} className={`w-100 is-invalid ${hasError('PHONE') ? 'p-invalid' : ''}`} />
                <div className="invalid-feedback" style={{ minHeight: 21, display: 'block' }}>
                  {hasError('PHONE') ? getError('PHONE') : ""}
                </div>
              </div>
            </div>
          </div>
          
          
          <div className="form-group mt-5">
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="fonction" className="label mb-1">Fonction</label>
              </div>
              <div className="col-sm">
                <div className="w-100">
                  <Dropdown
                    value={fonctionsinfo}
                    options={fonctions}
                    onChange={e => setFonctionsinfo(e.value)}
                    optionLabel="DESC_FONCTION"
                    id="fonction"
                    filter
                    showClear
                    filterBy="DESC_FONCTION"
                    placeholder="Selectionner la fonction"
                    emptyFilterMessage="Aucun élément trouvé"
                    emptyMessage="Aucun élément trouvé"
                    name="fonction"
                    onHide={() => {
                      checkFieldData({ target: { name: "fonction" } })
                    }}
                    className={`w-100 ${hasError('foncton') ? 'p-invalid' : ''}`}
                  />
                  <div className="invalid-feedback" style={{ minHeight: 21, display: 'block' }}>
                    {hasError('fonction') ? getError('fonction') : ""}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-group mt-5">
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="profiles" className="label mb-1">Profile</label>
              </div>
              <div className="col-sm">
                <div className="w-100">
                  <Dropdown
                    value={profilesinfo}
                    options={profiles}
                    onChange={e => setProfilesinfo(e.value)}
                    optionLabel="DESC_PROFIL"
                    id="profiles"
                    filter
                    showClear
                    filterBy="DESC_PROFIL"
                    placeholder="Selectionner le profile"
                    emptyFilterMessage="Aucun élément trouvé"
                    emptyMessage="Aucun élément trouvé"
                    name="profiles"
                    onHide={() => {
                      checkFieldData({ target: { name: "profiles" } })
                    }}
                    className={`w-100 ${hasError('profiles') ? 'p-invalid' : ''}`}
                  />
                  <div className="invalid-feedback" style={{ minHeight: 21, display: 'block' }}>
                    {hasError('profiles') ? getError('profiles') : ""}
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div style={{ position: 'absolute', bottom: 0, right: 0 }} className="w-100 d-flex justify-content-end shadow-4 pb-3 pr-5 bg-white">

            <Button label="Modifier" type="submit" className="mt-3 ml-3" size="small" disabled={!isValidate() || isSubmitting} />
          </div>
        </form>
      </div>
    </>
  )
}