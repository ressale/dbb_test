import {Dropbox} from 'dropbox'
import {useState} from "react"
import {v4 as uuidv4} from 'uuid'
import date from "date-and-time"

const App = () => {

    const [data, setData] = useState('')
    const [statePath, setStatePath] = useState('')
    const [error, setError] = useState(false)
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [dblClick, setDblClick] = useState(false)

    let dbx = new Dropbox(
        {
            accessToken: 'sl.BEZBCwFvbC-Y2NQyH7U903-PMRAbQqs1F_h6_OpBBZVXIP6b_h58-EU3F2z2tCRAtsWmlO9BDogO1lEwTRkgmNFGF519jayBerk29ZddHpPTUTsEcESg4CemQbvZb_kprIgOcyKa'
        }
    )

    const readFile = (path) => {
        dbx.filesDownload({
            path: path
        }).then(response => {
                let reader = new FileReader()
                reader.readAsText(response.result.fileBlob, 'utf-8')
                reader.onload = () => setBody(reader.result)
                reader.onerror = () => console.log(reader.error)
            }
        )
            .catch((e) => console.log(e.message))
    }

    const getFile = (id) => {
        let file = data.find(el => el.id === id)
        console.log('file', file)
        setTitle(file.name)
    }

    const getData = (path) => {
        setError(false)
        dbx.filesListFolder({
            path: path
        }).then(response => setData(response.result.entries))
            .catch((e) => {
                    console.log('e.message', e.message)
                    setError(true)
                }
            )
    }
    console.log('statePath', statePath)
    const delDocument = (path) => {
        dbx.filesDeleteV2({path: path})
            .then((response) => {
                    if (response.status === 200) {
                        getData(statePath)
                    }
                }
            )
            .catch((e) => {
                    console.error(e.message)
                }
            )
    }

    const dblClickFunction = (path, type) => {
        if (!dblClick) {
            setDblClick(true)
            setTimeout(() => {
                setDblClick(false)
            }, 300)
        } else if (type === 'folder') {
            getData(path)
            setStatePath(path)
        }
    }

    return (
        <>
            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false"
                 tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">{title}</h5>
                            <button onClick={() => {
                                setBody('')
                                setTitle('')
                            }} type="button" className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body text-center">
                            {body ? body : "Empty file"}
                        </div>
                    </div>
                </div>
            </div>
            <div className='d-flex justify-content-start container mt-3'>
                <div className="dropdown">
                    <button
                        className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1"
                        data-bs-toggle="dropdown" aria-expanded="false"
                    >
                        Navigation
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        {
                            data ?
                                <li>
                                    <a onClick={() => {
                                        getData('')
                                        setStatePath('')
                                    }}
                                       className="dropdown-item" type='button'>
                                        root
                                    </a>
                                    {
                                        data.map(el => {
                                                return (
                                                    <div key={uuidv4()}
                                                         data-bs-toggle={Object.values(el)[0] === "folder" ? "" : "modal"}
                                                         data-bs-target="#staticBackdrop">
                                                        <a key={uuidv4()}
                                                           onClick={() => {
                                                               if (Object.values(el)[0] === "folder") {
                                                                   getData(el.path_lower)
                                                                   setStatePath(el.path_lower)
                                                               } else {
                                                                   readFile(el.path_display)
                                                                   getFile(el.id)
                                                               }
                                                               if (Object.values(el)[0] === "folder") {
                                                                   setStatePath(el.path_lower)
                                                               }
                                                           }
                                                           }
                                                           className="dropdown-item" type='button'>
                                                            {el.name}
                                                        </a>
                                                    </div>
                                                )
                                            }
                                        )
                                    }
                                </li> :
                                <li>
                                    <a onClick={() => {
                                        getData('')
                                        setStatePath('')
                                    }}
                                       className="dropdown-item" type='button'>
                                        root
                                    </a>
                                </li>
                        }
                    </ul>
                </div>
                <button className='btn btn-outline-primary ms-3' data-bs-dismiss="modal" data-bs-toggle="modal"
                        data-bs-target="#exampleModal">
                    File
                </button>
                <button className='btn btn-outline-primary ms-3' data-bs-dismiss="modal" data-bs-toggle="modal"
                        data-bs-target="#exampleModal">
                    Load
                </button>
                <button className='btn btn-outline-primary ms-3' data-bs-dismiss="modal" data-bs-toggle="modal"
                        data-bs-target="#exampleModal">
                    Save
                </button>
                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel"
                     aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close">
                                </button>
                            </div>
                            <div className="modal-body">
                                <h4 className='text-center'>Not implemented</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {error ? <>Invalid file path</> : null}
            <hr/>
            <div className='row d-flex text-center mt-3'>
                <table className='table table-hover'>
                    <thead>
                    <tr>
                        <th>file/folder name</th>
                        <th>file/folder modification date</th>
                        <th>file size</th>
                        <th>selected</th>
                    </tr>
                    </thead>
                    {
                        data ?
                            <>
                                {
                                    data.map(el => {
                                            let tableDate
                                            if (el.server_modified) {
                                                let myDate = new Date(el.server_modified)
                                                tableDate = date.format(myDate, 'YYYY/MM/DD HH:mm:ss')
                                            }
                                            return (
                                                <tbody key={uuidv4()}>
                                                <tr>
                                                    <td>
                                                        <div
                                                            data-bs-toggle={Object.values(el)[0] === "folder" ? "" : "modal"}
                                                            data-bs-target="#staticBackdrop">
                                                            <a onClick={() => {
                                                                if (Object.values(el)[0] === "folder") {
                                                                    dblClickFunction(el.path_lower, Object.values(el)[0])
                                                                } else {
                                                                    readFile(el.path_lower)
                                                                    getFile(el.id)
                                                                }
                                                            }} type='button'>
                                                                {el.name}
                                                            </a>
                                                        </div>
                                                        <div className=" dropdown dropdown-toggle" type='button'
                                                             id="dropdownMenuButton1"
                                                             data-bs-toggle="dropdown" aria-expanded="false">
                                                        </div>
                                                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                                            <li>
                                                                <a onClick={() => {
                                                                    delDocument(el.path_lower)
                                                                    setStatePath(el.path_lower)
                                                                }}
                                                                    className="dropdown-item" type='button'>
                                                                    Delete
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </td>
                                                    <td>{tableDate}</td>
                                                    <td>{el.size}</td>
                                                    <td>
                                                        <input className="form-check-input" type="checkbox"/>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            )
                                        }
                                    )
                                } </> : null
                    }
                </table>
                {!data ? <div>Select files</div> : null}
            </div>
        </>
    )
}

export default App