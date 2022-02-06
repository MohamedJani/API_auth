import './App.css';
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom';
import Login from './components/Login/Login.jsx';
import Register from './components/Register/Register.jsx';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        
        
        <Router>
          
          <Switch>
            <Route path="/" exact>
              <Login/>
              
            </Route>
            <Route path="/Register">
              <Register/>
              
            </Route>
          </Switch>
        </Router>
      </header>
    </div>
  );
}

export default App;
