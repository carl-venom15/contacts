// Tools
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

// Pages
import MainLayout from "components/layouts/main-layout";
import FourOhFour from "pages/404";
import Contact from 'pages/contacts'

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout/>}>
          <Route name="Contacts" path="/" element={<Contact/>}/>
        </Route>
        <Route path='*' element={<FourOhFour/>}/>
      </Routes>
    </Router>
  );
}

export default App;
