import {  Outlet, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setBreadCrumbItemsAction, setToastAction } from "../../store/actions/appActions";
import { Button } from 'primereact/button';
import fetchApi from "../../helpers/fetchApi";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { SlideMenu } from 'primereact/slidemenu';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { profile_routes_items } from "../../routes/admin/profile_routes";



export default function ProfileListPage() {


  const [selectAll, setSelectAll] = useState(false);
  const [totalRecords, setTotalRecords] = useState(1);
  const [profiles, setProfiles] = useState([])
  const menu = useRef(null);
  const [selectedItems, setSelectedItems] = useState(null);
  const [inViewMenuItem, setInViewMenuItem] = useState(null)


  const navigate = useNavigate()

  const [lazyState, setlazyState] = useState({
    first: 0,
    rows: 10,
    page: 1,
    sortField: null,
    sortOrder: null,
    search: "",
    
  });


  const dispacth = useDispatch()

  const onPage = (event) => {
    setlazyState(event);
  };

  const onSort = (event) => {
    setlazyState(event);
  };

  const onFilter = (event) => {
    event['first'] = 0;
    setlazyState(event);
  };

  const onSelectionChange = (event) => {
    const value = event.value;
    setSelectedItems(value);
    setSelectAll(value.length === totalRecords);
  };

  const onSelectAllChange = (event) => {
    const selectAll = event.checked;

    if (selectAll) {
      setSelectAll(true);
      setSelectedItems(profiles);
    } else {
      setSelectAll(false);
      setSelectedItems([]);
    }
  };

  const deleteItems = async (itemsIds) => {
    try {
      const form = new FormData()
      form.append('ids', JSON.stringify(itemsIds))
      await fetchApi(`/administration/profiles/delete`, {
        method: 'POST',
        body: form
      })
      dispacth(setToastAction({ severity: 'success', summary: 'Profile supprimé', detail: "Le profile a été supprimé avec succès", life: 3000 }))
      fetchProfiles()
      setSelectAll(false)
      setSelectedItems(null)
    } catch (error) {
      console.log(error)
      dispacth(setToastAction({ severity: 'error', summary: 'Erreur du système', detail: 'Erreur du système, réessayez plus tard', life: 3000 }));
    } 
  }

  const handleDeletePress = (e, itemsids) => {
    e.preventDefault()
    e.stopPropagation()
    confirmDialog({
      header: 'Supprimer ?',
      message: <div className="d-flex flex-column align-items-center">
        {inViewMenuItem ? <>

          <div className="text-center">Voulez-vous vraiment supprimer ?</div>
        </> :
          <>
            <div className="text-muted">
              {selectedItems ? selectedItems.length : '0'} selectionné{selectedItems?.length > 1 && 's'}
            </div>
            <div className="text-center">Voulez-vous vraiment supprimer les éléments selectionnés ?</div>
          </>}
      </div>,
      acceptClassName: 'p-button-danger',
      accept: () => {
        deleteItems(itemsids)
      }
    });
  }



  const fetchProfiles = useCallback(async () => {
    try {
      const baseurl = `/administration/profiles?`
      var url = baseurl
      for (let key in lazyState) {
        const value = lazyState[key]
        if (value) {
          if (typeof (value) == 'object') {
            url += `${key}=${JSON.stringify(value)}&`
          } else {
            url += `${key}=${value}&`
          }
        }
      }
      const res = await fetchApi(url)

      setProfiles(res.result.totalRecords)
      setTotalRecords(res.result.totalRecords)
    } catch (error) {
      console.log(error)
    } 
  }, [lazyState])

  useEffect(() => {
    dispacth(setBreadCrumbItemsAction([
            profile_routes_items.profiles
    ]))
    return () => {
      dispacth(setBreadCrumbItemsAction([]))
    }
  }, [])
  useEffect(() => {
            fetchProfiles()
  }, []);
  return (
    <>
      <ConfirmDialog closable dismissableMask={true} />
    
      <div className="px-4 py-3 main_content">
        <div className="d-flex align-items-center justify-content-between">
          <h1 className="mb-3">Profiles</h1>
          <Button label="Nouveau profile" icon="pi pi-plus" size="small"
           onClick={() => {
            navigate("/profiles/new")
          }} />
        </div>
        <div className="content">
          <div className="shadow rounded mt-3 pr-1 bg-white">
            <DataTable
              lazy
              value={profiles}
              tableStyle={{ minWidth: '50rem' }}
              className=""
              paginator
              rowsPerPageOptions={[5, 10, 25, 50]}
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate={`Affichage de {first} à {last} dans ${totalRecords.length} éléments`}
              emptyMessage="Aucun profile trouvé"
              // paginatorLeft={paginatorLeft}
              // paginatorRight={paginatorRight}
              first={lazyState.first}
              rows={lazyState.rows}
              totalRecords={totalRecords.length}
              onPage={onPage}
              onSort={onSort}
              sortField={lazyState.sortField}
              sortOrder={lazyState.sortOrder}
              onFilter={onFilter}
              filters={lazyState.filters}
              selection={selectedItems}
              onSelectionChange={onSelectionChange}
              selectAll={selectAll}
              onSelectAllChange={onSelectAllChange}
              reorderableColumns
              resizableColumns
              columnResizeMode="expand"
              paginatorClassName="rounded"
              scrollable
            // size="normal"
            >
            
              <Column field="DESC_PROFILE" frozen header="DESC_PROFILE" sortable body={item => {
                return (
                  <span>{item.DESC_PROFIL}</span>
                )
              }} />
              
                        
              <Column field="" header="" alignFrozen="right" frozen 
              body={item => {
                const items = [

                  {
                    template: () => {
                      return (
                        <span
                        onClick={() => 
                          navigate("/profiles/edit",{state:inViewMenuItem })
                        }
                         
                        className="p-menuitem-link">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16" style={{ marginRight: "0.5rem" }}>
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                          </svg>
                          <span className="p-menuitem-text">Modifier</span>
                        </span>
                      )
                    }
                  },
                  {
                    template: () => {
                      return (
                        <a href="profiles" className="p-menuitem-link text-danger"
                         onClick={e => handleDeletePress(e, [inViewMenuItem.PROFIL_ID])}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16" style={{ marginRight: "0.5rem" }}>
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                          </svg>
                          <span className="p-menuitem-text text-danger">Supprimer</span>
                        </a>
                      )
                    }
                  }
                ];
                return (
                  <>
                    <SlideMenu ref={menu} model={items} popup viewportHeight={150} menuWidth={220} onHide={() => {
                      setInViewMenuItem(null)
                    }} />
                    <Button rounded severity="secondary" text aria-label="Menu" size="small" className="mx-1" onClick={(event) => {
                      setInViewMenuItem(item)
                      menu.current.toggle(event)
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots" viewBox="0 0 16 16">
                        <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                      </svg>
                    </Button>
                  </>
                )
              }} />

            </DataTable>
          </div>
        </div>
      </div>
      <Outlet />
    </>
  )
}