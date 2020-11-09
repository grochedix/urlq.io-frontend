import './App.css';
import Homepage from './Homepage'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import HashRedirect from './Hashredirect'

function App() {
  return (
    <div className="App" style={{height:"100vh"}}>
      <Router>
        <Switch>
          <Route path="/:hash(-?[0-9a-z]+)">
            <HashRedirect/>
          </Route>
          <Route path="/">
            <Homepage />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
