import React from 'react';
import './Navegacion.css';
import { NavLink, Link } from 'react-router-dom';

function Navegacion() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4 p-0">
            <div className="container">
                <Link className="navbar-brand" to="/"><img src="https://www.tec.ac.cr/sites/all/themes/tec/img/logo.svg" alt="logo del TEC" /></Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarColor01">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link text" activeClassName="active" exact to="/">Inicio</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link text" activeClassName="active" to="/acceso">Acceso</NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navegacion;