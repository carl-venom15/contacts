// Tools
import React, { useState } from 'react'

// Components
import { DeleteOutline, Edit, Star, StarOutline } from '@mui/icons-material';
import { Button } from '@mui/material'
import { DataGrid, GridToolbarContainer, GridToolbarQuickFilter  } from '@mui/x-data-grid';
import Swal from 'sweetalert2'; 

const ContactsTable = ({ data, getCallback, deleteCallback, setEditContactForm, toggleStarred }) => {

  // Star variables and Functions
  const [toggleStarFilter, setToggledStarFilter] = useState(false)

  const toggleStarFunction = async() => {
    let newToggleStar = !toggleStarFilter
    setToggledStarFilter(newToggleStar)
    await getCallback({...pageOptions, is_starred : newToggleStar ? 1 : null})
  }

  // Delete Call
  const callDeleteTest = (id) => {
    Swal.fire({
      title: 'Delete Contact?',
      text: "This will delete the selected contact!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Submit'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Deleting Contact',
          html: `Don't refresh the page while deleting your contact!`,
          allowOutsideClick: false,
          didOpen: async() => {
            Swal.showLoading()
            await deleteCallback(id)
          },
        })
      }
    })
  }

  // Page Options
  const [pageOptions, setPageOptions] = useState({ page: 1, per_page: 5})
  const updatePageOptions = async(newPageOptions) => {
    setLoading(true)
    let updatedPageOptions = {...pageOptions, ...newPageOptions, is_starred : toggleStarFilter ? 1 : null}
    setPageOptions(updatedPageOptions)
    await getCallback(updatedPageOptions)
    setLoading(false)
  }

  // Filters Options
  const updateSearch = async(search) => {
    setLoading(true)
    await getCallback({search, ...pageOptions, is_starred : toggleStarFilter ? 1 : null})
    setLoading(false)
  }

  // Table Options
  const [loading, setLoading] = useState(false)
  const columns = [
    { field:"starred", headerName: "", sortable: false, width: 100, disableColumnMenu: true, renderCell: (params) => {
      return <Button variant="outlined" onClick={()=>toggleStarred(params.row)}>
        { params.row.is_starred === 1 ?
          <Star style={{ color: 'yellow' }}/>
          : <StarOutline />
        }
      </Button>
    }},
    { field: 'id', headerName: 'ID', sortable: true, flex: 1, disableColumnMenu: true, maxWidth: 60 },
    { field: 'fullName', headerName: 'Full name', sortable: false, flex: 1, disableColumnMenu: true, valueGetter: (params) => `${params.row.fname || ''} ${params.row.lname || ''}`, width: 150},
    { field: 'mobile', headerName: 'Mobile', sortable: false, flex: 1, width: 150,  disableColumnMenu: true },
    { field: 'email', headerName: 'Email', sortable: true, flex: 1, disableColumnMenu: true },
    { field: 'group', headerName: 'Group', sortable: true, flex: 1,  disableColumnMenu: true },
    { field: 'created_at', headerName: 'Created At', sortable: false, flex: 1, maxWidth: 150,  disableColumnMenu: true, valueGetter: (params) => new Date(Date.parse(params.row.created_at)) },
    { field: 'updated_at', headerName: 'Updated At', sortable: false, flex: 1, maxWidth: 150,  disableColumnMenu: true, valueGetter: (params) => (params.row.updated_at !== null) ? new Date(Date.parse(params.row.updated_at)) : null},
    { field: 'actions', headerName: 'Actions', sortable: false, flex: 1, disableColumnMenu: true, renderCell: (params) => {
        return <><Button variant="outlined" onClick={()=>setEditContactForm(params.row)}><Edit/></Button><Button variant="outlined" color="error" onClick={()=>callDeleteTest(params.row.id)}><DeleteOutline/></Button></>
      }
    }
  ];

  const tableToolBar = () => {
    return(
      <GridToolbarContainer>
        <div style={{width: '100%', textAlign:'end'}}>
          <Button onClick={ () => toggleStarFunction()}> 
          { 
            toggleStarFilter ?
            <Star style={{ color: 'yellow' }}/>
            : <StarOutline />
          }
          </Button>
          <GridToolbarQuickFilter/>
        </div>
      </GridToolbarContainer>
    )
  }

  return (
    <div style={{ height: 450, width: '100%' }}>
      <DataGrid
        rows={data.data}
        columns={columns}
        loading={loading}
        pagination
        rowCount={data.count}
        paginationMode="server"
        pageSize={pageOptions.per_page}
        rowsPerPageOptions={[5, 10]}
        onPageSizeChange={(newPageSize) => updatePageOptions({per_page: newPageSize})}
        onPageChange={(newPage) => updatePageOptions({page: newPage + 1})}
        filterMode="server"
        onFilterModelChange={ e => updateSearch(e.quickFilterValues[0])}
        components={{ Toolbar: tableToolBar }}
        componentsProps={{
          toolbar: {
            quickFilterProps: { debounceMs: 500 }
          },
        }}
        sx={{
          '.MuiDataGrid-columnSeparator': {
            display: 'none',
          },
          zIndex: 0
        }}
      />
    </div>
  )
}

export default ContactsTable