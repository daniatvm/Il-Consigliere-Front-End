import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Acceso from './components/Acceso/Acceso';
import Inicio from './components/Inicio/Inicio';
import Consejos from './components/Consejos/Consejos';
import RegistroConsejos from './components/Consejos/RegistroConsejos';
import ListaUsuarios from './components/Usuarios/ListaUsuarios';
import Registro from './components/Usuarios/Registro';
import Usuario from './components/Usuarios/Usuario';
import Cuenta from './components/Cuenta/Cuenta';
import ProtectedRoute from './helpers/ProtectedRoute';
import { DefaultComponent } from './helpers/DefaultComponent';
import { Role } from './helpers/Role';

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/acceso' component={Acceso} />
        <Route exact path='/' component={Inicio} />
        <ProtectedRoute path='/gUsuarios/usuarios' role={Role.UserModifier} component={ListaUsuarios} />
        <ProtectedRoute path='/gUsuarios/registro' role={Role.UserModifier} component={Registro} />
        <ProtectedRoute path='/gUsuarios/:usuario' role={Role.UserModifier} component={Usuario} />
        <ProtectedRoute path='/gConsejos' role={Role.CouncilModifier} component={RegistroConsejos} />
        <ProtectedRoute path='/consejos' component={Consejos} />
        <ProtectedRoute path='/cuenta' component={Cuenta} />
        <Route path='*' component={DefaultComponent} />
      </Switch>
    </Router>
  );
}

export default App;
