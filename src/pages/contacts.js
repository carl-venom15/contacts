// Tools
import React, { useEffect, useState } from 'react'

// Components
import { Button, Grid, Modal } from '@mui/material'
import { Add, RestartAlt } from '@mui/icons-material'
import ContactForm from 'components/contacts/contact-form'
import ContactsTable from 'components/contacts/contacts-table'
import Swal from 'sweetalert2'; 

// Services
import { deleteContactsAPI, editContactsAPI, getContactsAPI, insertContactsAPI } from 'services/api'

const Contacts = () => {
  const [contacts, setContacts] = useState({data: [], count: 0});
  const [loading, setLoading] = useState(true);
  const [contactsQuery, setContactsQuery] = useState({per_page: 5})

  // Get Contacts
  const callGetContactsAPI = async(query=contactsQuery) => {
    setContactsQuery({...query})
    await getContactsAPI(query)
      .then( res => {
        let contactsData = {data: res.data.data, count: res.data.count}
        setContacts(contactsData)
        setLoading(false)
      })
      .catch( err =>{
        Swal.fire(
          'Error!',
          err.response?.data?.message || err.response?.data?.title || 'Check if API is running!',
          'error'
        )
        setContacts({data: [], count: 0})
        setLoading(false)
      });
  }

  // Add Contact Variables and Functions
  const [showContactForm, setShowContactForm] = useState(false);
  const callInsertContactAPI = async(form) => {
    await insertContactsAPI(form).then( async(res) => {
      Swal.fire(
        'Success!',
        res.data.message,
        'success'
      ).then( async()=> {
        await callGetContactsAPI()
        setShowContactForm(false)
      })
    })
    .catch( err => {
      Swal.fire(
        'Error!',
        err.response?.data.message || err.response.data.title || 'Check if API is running!',
        'error'
      )
    })
  }

  // Edit Contact Variables and Functions
  const [contact, setContact] = useState(null);
  const setEditContactForm = (form) => {
    let initialState = {
      id: form.id,
      fname: { value: form.fname, touched: false, hasError: true, error: "" },
      lname: { value: form.lname, touched: false, hasError: true, error: "" },
      mobile: { value: form.mobile, touched: false, hasError: true, error: "" },
      email: { value: form.email || '', touched: false, hasError: true, error: "" },
      group: { value: form.group || '', touched: false, hasError: true, error: "" },
      isFormValid: false,
    }
    setContact(initialState)
    setShowContactForm(true)
  }
  const callEditContactAPI = async(form) => {
    await editContactsAPI(form).then( async(res) => {
      Swal.fire(
        'Success!',
        res.data.message,
        'success'
      ).then( async()=> {
        await callGetContactsAPI()
        setShowContactForm(false)
      })
    })
    .catch( err => {
      Swal.fire(
        'Error!',
        err.response?.data.message || err.response.data.title || 'Check if API is running!',
        'error'
      )
    })
  }

  const toggleStarred = async(form) => {
      form.is_starred= 1 - form.is_starred
      await callEditContactAPI(form)
  }

  // Delete Contact Variables and Functions
  const callDeleteContactAPI = async(id) => {
    await deleteContactsAPI(id).then( async(res) => {
      Swal.fire(
        'Success!',
        res.data.message,
        'success'
      ).then( async()=> {
        await callGetContactsAPI()
      })
    })
    .catch( err => {
      Swal.fire(
        'Error!',
        err.response?.data.message || err.response.data.title ||  'Check if API is running!',
        'error'
      )
    })
  }

  const cancelForm = () => {
    setContact(null)
    setShowContactForm(false)
  }

  // Initial Call
  useEffect(() => {
    callGetContactsAPI()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      { !loading ? 
        <Grid container spacing={2} sx={{ p:2 }}>

          {/* Contacts Actions */}
          <Grid 
            container item xs={12} 
            justifyContent="flex-end" 
            alignItems="center"
          >
            <Button variant="outlined" onClick={() => window.location.reload()} style={{ margin: '0px 10px 0px 10px'}}> <RestartAlt/></Button>
            <Button variant="outlined" onClick={() => setShowContactForm(true)}> <Add/> Add Contact</Button>
          </Grid>
          
          {/* Contacts Table */}
          <Grid item xs={12}>
            <ContactsTable 
              data={contacts} 
              getCallback={callGetContactsAPI}
              setEditContactForm={setEditContactForm} 
              deleteCallback={callDeleteContactAPI} 
              toggleStarred={toggleStarred}
            /> 
          </Grid>

          {/* Contact Form */}
          <Modal 
            open={showContactForm} 
            onClose={cancelForm} 
            sx={{ zIndex: 0 }}
          >
            <div className="modal-form">
              <ContactForm 
                data={contact} 
                insertCallback={callInsertContactAPI} 
                editCallback={callEditContactAPI} 
                cancelFormCallback={() => cancelForm()}
              />
            </div>
          </Modal>

        </Grid>  
        : null
      } 
    </div>
  )
}

export default Contacts