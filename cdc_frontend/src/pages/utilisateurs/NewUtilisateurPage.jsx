// import { useEffect, useState } from "react"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { setBreadCrumbItemsAction, setToastAction } from "../../store/actions/appActions"
import { administration_routes_items } from "../../routes/admin/administration_routes"
import { Button } from 'primereact/button';
import { useForm } from "../../hooks/useForm";
import { useFormErrorsHandle } from "../../hooks/useFormErrorsHandle";
import fetchApi from "../../helpers/fetchApi";
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import moment from "moment";
import { Dropdown } from 'primereact/dropdown';
// import wait from "../../helpers/wait";
import { useNavigate } from "react-router-dom";
import { FileUpload } from 'primereact/fileupload';



export default function NewUtilisateurPage() {
  const dispacth = useDispatch()
  const [dateinfo, setdateinfo] = useState(null)
  const [fonctions, setFonctions] = useState([])
  const [fonctionsinfo, setFonctionsinfo] = useState({})

  const [sexes, setSexes] = useState([])
  const [sexesinfo, setSexesinfo] = useState({})

  const [profiles, setProfiles] = useState([])
  const [profilesinfo, setProfilesinfo] = useState({})
  
  const initialForm = {
    NOM: '',
    PRENOM: '',
    EMAIL: '',
    PHONE:'',
    sexes:'',
    IMAGE: '',
    DATE_NAISSANCE:dateinfo,
    fonction: '',
    profiles:''
  }
  const [data, handleChange] = useForm(initialForm)


  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploaded, setIsUploaded] = useState(false)

  const navigate = useNavigate()

  const { hasError, getError, setErrors, checkFieldData, isValidate } = useFormErrorsHandle(data, {
    NOM: {
      required: true,
      alpha: true,
      length: [2, 50]
    },
    PRENOM: {
      required: true,
      alpha: true,
      length: [2, 50]
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
      form.append("IMAGE", isUploaded)
      form.append("DATE_NAISSANCE", moment(dateinfo).format("YYYY-MM-DD"))
    
      form.append("FONCTION_ID", fonctionsinfo.code)
      form.append("SEXE_ID", sexesinfo.code)
      form.append("PROFIL_ID", profilesinfo.code)

      await fetchApi('/administration/utilisateurs', {
        method: 'POST',
        body: form
      })
      dispacth(setToastAction({ severity: 'success', summary: 'Utilisateur enregistré', detail: "L'utilisateur a été enregistré avec succès", life: 3000 }))
      navigate('/utilisateurs')
    } catch (error) {
      
      if (error.httpStatus == "UNPROCESSABLE_ENTITY") {
        setErrors(error.result)
      } else {
        dispacth(setToastAction({ severity: 'error', summary: 'Erreur du système', detail: 'Erreur du système, réessayez plus tard', life: 3000 }));
      }
    } finally {
      setIsSubmitting(false)
    }
  }


  // console.log(isUploaded)
  // useEffect(() => {
  //   if(data.image) {
  //             checkFieldData({ target: { name: "image" }})
  //   }
  //  }, [data.image])

  useEffect(() => {
    dispacth(setBreadCrumbItemsAction([
      administration_routes_items.utilisateurs,
      administration_routes_items.new_utilisateurs
    ]))

  }, [])

  useEffect(() => {
    (async () => {

      try {
        const res = await fetchApi(`/administration/utilisateurs/fonc`)
        // console.log(res)
        setFonctions(res.result.map(comm => {
          return {
            name: comm.DESC_FONCTION,
            code: comm.FONCTION_ID
          }
        }))
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
        setSexes(res.result.map(comm => {
          return {
            name: comm.SEXE,
            code: comm.SEXE_ID
          }
        }))
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
        setProfiles(res.result.map(comm => {
          return {
            name: comm.DESC_PROFIL,
            code: comm.PROFIL_ID
          }
        }))
      } catch (error) {
        console.log(error)
      }

    })()
  }, [])
  return (
    <>
     
      <div className="px-4 py-3 main_content bg-white has_footer">
        <div className="">
          <h1 className="mb-3">Nouveau utilisateur</h1>
          <hr className="w-100" />
        </div>
        <form className="form w-75 mt-5" onSubmit={handleSubmit}>
          <div className="form-group col-sm">
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="NOM" className="label mb-1">Nom</label>
              </div>
              <div className="col-sm">
                <InputText autoFocus type="text" placeholder="Ecrire le nom" id="NOM" name="NOM" value={data.NOM} onChange={handleChange} onBlur={checkFieldData} className={`w-100 is-invalid ${hasError('NOM') ? 'p-invalid' : ''}`} />
                <div className="invalid-feedback" style={{ minHeight: 21, display: 'block' }}>
                  {hasError('NOM') ? getError('NOM') : ""}
                </div>
              </div>
            </div>
          </div>
          <div className="form-group col-sm">
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="PRENOM" className="label mb-1">Prenom</label>
              </div>
              <div className="col-sm">
                <InputText autoFocus type="text" placeholder="Ecrire le nom" id="PRENOM" name="PRENOM" value={data.PRENOM} onChange={handleChange} onBlur={checkFieldData} className={`w-100 is-invalid ${hasError('PRENOM') ? 'p-invalid' : ''}`} />
                <div className="invalid-feedback" style={{ minHeight: 21, display: 'block' }}>
                  {hasError('PRENOM') ? getError('PRENOM') : ""}
                </div>
              </div>
            </div>
          </div>
          <div className="form-group col-sm mt-5">
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="EMAIL" className="label mb-1">Email</label>
              </div>
              <div className="col-sm">
                <InputText type="text" placeholder="Ecrire le email" name="EMAIL" value={data.EMAIL} onChange={handleChange} onBlur={checkFieldData} className={`w-100 is-invalid ${hasError('EMAIL') ? 'p-invalid' : ''}`} />
                <div className="invalid-feedback" style={{ minHeight: 21, display: 'block' }}>
                  {hasError('EMAIL') ? getError('EMAIL') : ""}
                </div>
              </div>
            </div>
          </div>

          <div className="form-group mt-5">
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="fonction" className="label mb-1">Sexe</label>
              </div>
              <div className="col-sm">
                <div className="w-100">
                  <Dropdown
                    value={sexesinfo}
                    options={sexes}
                    onChange={e => setSexesinfo(e.value)}
                    optionLabel="name"
                    id="sexes"
                    filter
                    showClear
                    filterBy="name"
                    placeholder="Selectionner la fonction"
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
                <label htmlFor="PHONE" className="label mb-1">Phone</label>
              </div>
              <div className="col-sm">
                <InputText type="text" placeholder="Ecrire le numero" name="PHONE" value={data.PHONE} onChange={handleChange} onBlur={checkFieldData} className={`w-100 is-invalid ${hasError('PHONE') ? 'p-invalid' : ''}`} />
                <div className="invalid-feedback" style={{ minHeight: 21, display: 'block' }}>
                  {hasError('PHONE') ? getError('PHONE') : ""}
                </div>
              </div>
            </div>
          </div>


          <div className="form-group mt-5">
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="zone" className="label mb-1">Image</label>
              </div>
              <div className="col-sm">
                <FileUpload
                  chooseLabel="Choisir l'image"
                  cancelLabel="Annuler"
                  name="IMAGE"
                  uploadOptions={{
                    style: { display: 'none' }
                  }}
                  // value={data.image}
                  className="p-invalid"
                  accept="image/*"

                  onSelect={(e) => {
                    const file = e.files[0];
                    setIsUploaded(file)
                  }
                  }
                  maxFileSize={4000000}
                  invalidFileSizeMessageDetail="Image trop lourde(max: 4Mo)"
                  emptyTemplate={<p className="m-0">Glisser et déposez image ici.</p>}

                />
                <div className="invalid-feedback" style={{ minHeight: 21, display: 'block' }}>
                  {hasError('IMAGE') ? getError('IMAGE') : ""}
                </div>
              </div>
            </div>
          </div>
          
          <div className="form-group mt-5">
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="DATE_NAISSANCE" className="label mb-1">Date de naissance</label>
              </div>
              <div className="col-sm">
                <Calendar
                  value={dateinfo}
                  name="DATE_NAISSANCE"
                  onChange={e => {
                    setdateinfo(e.target.value)
                    // setError("date_naissance", {})
                  }}
                  placeholder="Choisir la date de naissance"
                  inputClassName="w-100"
                  onHide={() => {
                    checkFieldData({ target: { name: "DATE_NAISSANCE" } })
                  }}
                  className={`d-block w-100 ${hasError('DATE_NAISSANCE') ? 'p-invalid' : ''}`}
                />
                <div className="invalid-feedback" style={{ minHeight: 21, display: 'block' }}>
                  {hasError('DATE_NAISSANCE') ? getError('DATE_NAISSANCE') : ""}
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
                    optionLabel="name"
                    id="fonction"
                    filter
                    showClear
                    filterBy="name"
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
                <label htmlFor="fonction" className="label mb-1">Profile</label>
              </div>
              <div className="col-sm">
                <div className="w-100">
                  <Dropdown
                    value={profilesinfo}
                    options={profiles}
                    onChange={e => setProfilesinfo(e.value)}
                    optionLabel="name"
                    id="profiles"
                    filter
                    showClear
                    filterBy="name"
                    placeholder="Selectionner la fonction"
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

            <Button label="Envoyer" type="submit" className="mt-3 ml-3" size="small" disabled={!isValidate() || isSubmitting} />
          </div>
        </form>
      </div>
    </>
  )
}