import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Acceso from './components/Acceso/Acceso';
import { Inicio } from './components/Inicio/Inicio';
import Consejos from './components/Consejos/Consejos';
import ProtectedRoute from './helpers/ProtectedRoute';

function App() {
  return (
    <Router>
      <Switch>
        <ProtectedRoute path='/consejos' component={Consejos} />
        <Route path='/acceso' component={Acceso} />
        <Route exact path='/' component={Inicio} />
        <Route path='*' component={() => '404 NOT FOUND'} />
      </Switch>
    </Router>
  );
}

export default App;
