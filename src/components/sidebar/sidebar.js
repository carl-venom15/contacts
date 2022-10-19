import React from 'react'

// Components
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, useMediaQuery } from '@mui/material'
import { ContactPage, Home, GridView, Logout, PeopleOutline } from '@mui/icons-material'


const Sidebar = () => {

  let minScreenSize = useMediaQuery('(min-width: 850px)');

  const sidebarOptions = [
    {
      text: 'Homepage',
      icon: <Home sx={{ width: '100%'}}/>
    },
    {
      text: 'Dashboard',
      icon: <GridView sx={{ width: '100%'}}/>
    },
    {
      text: 'Users',
      icon: <PeopleOutline sx={{ width: '100%'}}/>
    },
    {
      text: 'Contacts',
      icon: <ContactPage sx={{ width: '100%'}}/>
    },
    {
      text: 'LogOut',
      icon: <Logout sx={{ width: '100%'}}/>
    }
  ]
  
  return (
    <div style={{height:'100%'}}>
      <List>
        {
          sidebarOptions.map( (opt, index) => {
            return(
              <ListItem disablePadding key={index}>
              <ListItemButton>
                <ListItemIcon sx={{ width: !minScreenSize ? '100%' : '' }}>
                  {opt.icon}
                </ListItemIcon>
                {
                  minScreenSize ? <ListItemText primary={opt.text} style={{ textAlign: 'center', fontSize: '4vw' }}/> : null
                }
              </ListItemButton>
            </ListItem>
            )
          })
        }
      </List>
    </div>
  )
}

export default Sidebar