// import { useEffect, useState } from "react"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { setBreadCrumbItemsAction, setToastAction } from "../../store/actions/appActions"
import { profile_routes_items } from "../../routes/admin/profile_routes"
import { Button } from 'primereact/button';
import { useForm } from "../../hooks/useForm";
import { useFormErrorsHandle } from "../../hooks/useFormErrorsHandle";
import fetchApi from "../../helpers/fetchApi";
import { InputText } from 'primereact/inputtext';
import { useNavigate } from "react-router-dom";



export default function NewProfilePage() {
  const dispacth = useDispatch()

  const initialForm = {
    DESC_PROFIL: '',
   

  }
  const [data, handleChange] = useForm(initialForm)


  const [isSubmitting, setIsSubmitting] = useState(false)


  const navigate = useNavigate()

  const { hasError, getError, setErrors, checkFieldData, isValidate } = useFormErrorsHandle(data, {
    DESC_PROFIL: {
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
      form.append("DESC_PROFIL", data.DESC_PROFIL)
    
      await fetchApi('/administration/profiles', {
        method: 'POST',
        body: form
      })
      dispacth(setToastAction({ severity: 'success', summary: 'profile enregistré', detail: "Le profile a été enregistré avec succès", life: 3000 }))
      navigate('/profiles')
    } catch (error) {
      console.log(error)
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
    dispacth(setBreadCrumbItemsAction([
      profile_routes_items.profiles,
      profile_routes_items.new_profiles
    ]))

  }, [])


  return (
    <>

      <div className="px-4 py-3 main_content bg-white has_footer">
        <div className="">
          <h1 className="mb-3">Nouveau profile</h1>
          <hr className="w-100" />
        </div>
        <form className="form w-75 mt-5" onSubmit={handleSubmit}>
          <div className="form-group col-sm">
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="name" className="label mb-1">Description</label>
              </div>
              <div className="col-sm">
                <InputText autoFocus type="text" placeholder="Ecrire le profile" id="DESC_PROFIL" name="DESC_PROFIL" value={data.DESC_PROFIL} onChange={handleChange} onBlur={checkFieldData} className={`w-100 is-invalid ${hasError('DESC_PROFIL') ? 'p-invalid' : ''}`} />
                <div className="invalid-feedback" style={{ minHeight: 21, display: 'block' }}>
                  {hasError('DESC_PROFIL') ? getError('DESC_PROFIL') : ""}
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