import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import ProtectedRoute from './helpers/ProtectedRoutes/ProtectedRoute';
import { ProtectCouncil } from './helpers/ProtectedRoutes/ProtectCouncil';
import { ProtectUsers } from './helpers/ProtectedRoutes/ProtectUsers';
import Acceso from './components/Acceso/Acceso';
import Inicio from './components/Inicio/Inicio';
import Consejos from './components/Consejos/Consejos';
import RegistroConsejos from './components/Consejos/RegistroConsejos';
import ListaUsuarios from './components/Usuarios/ListaUsuarios';
import Registro from './components/Usuarios/Registro';
import Cuenta from './components/Cuenta/Cuenta';

function App() {
  return (
    <Router>
      <Switch>
        <ProtectedRoute path='/consejos' component={Consejos} />
        <ProtectUsers path='/gUsuarios/usuarios' component={ListaUsuarios} />
        <ProtectUsers path='/gUsuarios/registro' component={Registro} />
        <ProtectCouncil path='/gConsejos' component={RegistroConsejos} />
        <ProtectedRoute path='/cuenta' component={Cuenta} />
        <Route path='/acceso' component={Acceso} />
        <Route exact path='/' component={Inicio} />
        <Route path='*' component={() => '404 NOT FOUND'} />
      </Switch>
    </Router>
  );
}

export default App;
