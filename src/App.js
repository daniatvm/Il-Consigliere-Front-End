import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Acceso from './components/Acceso/Acceso';
import { Inicio } from './components/Inicio/Inicio';
import Consejos from './components/Consejos/Consejos';
import ListaUsuarios from './components/Usuarios/ListaUsuarios';
import ProtectedRoute from './helpers/ProtectedRoute';
import Registro from './components/Usuarios/Registro';
import Cuenta from './components/Cuenta/Cuenta';

function App() {
  return (
    <Router>
      <Switch>
        <ProtectedRoute path='/consejos' component={Consejos} />
        <ProtectedRoute path='/gUsuarios/usuarios' component={ListaUsuarios} />
        <ProtectedRoute path='/gUsuarios/registro' component={Registro} />
        <ProtectedRoute path='/cuenta' component={Cuenta} />
        <Route path='/acceso' component={Acceso} />
        <Route exact path='/' component={Inicio} />
        <Route path='*' component={() => '404 NOT FOUND'} />
      </Switch>
    </Router>
  );
}

export default App;
