//can import the button from chakra ui it is same as bootstrap
import {Button} from '@chakra-ui/react';
import Homepage  from './pages/Homepage';
import ChatPage from './pages/ChatPage';
import { createBrowserHistory } from "history";
import './App.css';
import {
  Router,
  Route,
  Switch,
  Link
} from "react-router-dom";


function App() {
  const history = createBrowserHistory();
  return (
      <div className='App'>
      <Router history={history}>
      <Switch>
        <Route exact path='/' component={Homepage} />
        <Route exact path="/chats" component={ChatPage}/>
        
      </Switch>
    </Router>
    </div>
    
  );
}

export default App;
