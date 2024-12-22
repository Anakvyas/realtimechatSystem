import Signuppage from './pages/signup'
import LoginPage from './pages/login'
import HomePage from './pages/home'
import {BrowserRouter as Router ,Route ,Routes} from 'react-router-dom'

function App() {

  return (
    <>
   
      <Router>
          <Routes>
            <Route  path='/' element = {<Signuppage/>}/>
            <Route  path='/signup' element = {<Signuppage/>}/>
            <Route  path='/login' element = {<LoginPage/>}/>
            <Route  path='/home' element = {<HomePage/>}/>
          </Routes>
      </Router>
    </>
  )
}

export default App
