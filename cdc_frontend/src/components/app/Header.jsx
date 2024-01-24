import "../../styles/app/header.css"
import { Button } from 'primereact/button';
// import { Avatar } from 'primereact/avatar';
import moment from 'moment'
import Image from '../../../public/images/girl.jpg'
import BreadCrumb from "./BreadCrumb";

export default function Header() {
    

          return (
                    <header className="d-flex align-items-center justify-content-between px-4">
                              <div className="d-flex align-items-center">
                                        <div className="text-muted">
                                                  { moment().format("dddd DD MMM YYYY HH:mm")}
                                        </div>
                                        <BreadCrumb />
                              </div>
                              <div className="flex align-items-center py-2">
                                        <Button rounded text aria-label="Messages" size="small" className="mx-1">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-chat-left-text" viewBox="0 0 16 16">
                                                  <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                                                  <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
                                                  </svg>
                                        </Button>
            
                                        <button className="btn p-0 avatar mx-2">
                                                  <img src={Image} alt=""  className=""/>
                                        </button>
                              </div>
                    </header>
          )
}