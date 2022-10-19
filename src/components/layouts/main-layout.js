// Tools
import React, { useState } from 'react'
import { Outlet, useLocation  } from 'react-router-dom';

// Components
import Header from 'components/headers/header'
import Sidebar from 'components/sidebar/sidebar';
import { Avatar, Grid, Modal, useMediaQuery } from '@mui/material';
import { Menu, MenuOpen } from '@mui/icons-material';

const MainLayout = () => {
  
  // Sidebar Options
  const [floatSidebar , setFloatSidebar] = useState(false)

  // Set Header Title
  const location = useLocation();
  let LayoutTitle = "Default"
  switch(location.pathname){
    case "/": LayoutTitle = "Contacts"
              break;
    default: LayoutTitle = "Home"
  }

  let minScreenSize = useMediaQuery('(min-width: 600px)');
  return (
    <div>
        <Header title={LayoutTitle}/>

        <Grid container className='main-page' columns={16}>
          {
             minScreenSize ?
            <Grid item xs={2} sm={4} md={4} lg={3} xl={3}>
              <div className='default-sidebar'>
                <Sidebar/>
              </div>
            </Grid>
            : <Avatar className='float-menu ' onClick={() => setFloatSidebar(!floatSidebar)}>
                {
                  floatSidebar ? <MenuOpen/> :<Menu/>
                }
              </Avatar>
          }

          {
            !minScreenSize ? <Modal open={floatSidebar } onClose={() => setFloatSidebar(false)}>
            <div className='float-sidebar '>
              <Sidebar/>
            </div>
          </Modal> : null
          }
     
          
          <Grid item xs={16} sm={12} md={12} lg={13} xl={13}>
            <div className='default-page'>
              <Outlet/>
            </div>
          </Grid>
        </Grid>

    </div>
  )
}

export default MainLayout