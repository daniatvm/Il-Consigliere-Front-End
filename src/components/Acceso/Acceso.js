import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import auth from '../../helpers/auth'
import './Acceso.css';
import Navegacion from '../Navegacion/Navegacion';

export default class Acceso extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cedula: '',
            clave: '',
            redirect: false
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        const token = await auth.isAuthenticated();
        if (token) {
            this.setState({
                redirect: true
            });
        }
    }

    handleInputChange(e) {
        let value = e.target.value;
        let name = e.target.name;
        if ((name === 'cedula') && (!Number(value)) && (value !== '')) {
            return;
        }
        this.setState({
            [name]: value
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        const usuario = {
            cedula: this.state.cedula,
            clave: this.state.clave
        }
        const res = await axios.post('http://localhost:5000/usuario/inicio_sesion', usuario);
        if (res.data.success) {
            localStorage.setItem('il-consigliere', JSON.stringify({
                token: res.data.token
            }));
            this.setState({
                redirect: true
            });
        } else {
            this.setState({
                clave: ''
            });
        }
    }

    render() {
        return this.state.redirect ? <Redirect to='/consejos' /> :
            <>
                <Navegacion />
                <div className="row m-0 my-row">
                    <div className="col-md-4 mx-auto my-auto">
                        <div className="card border-primary mb-3">
                            <div className="card-body">
                                <h4 className="card-title text-center mb-4">Il Consigliere</h4>
                                <form onSubmit={this.handleSubmit}>
                                    <div className="form-group">
                                        <input type="text" required maxLength="20" name="cedula"
                                            placeholder="Cédula" autoComplete="off" className="form-control"
                                            autoFocus onChange={this.handleInputChange} value={this.state.cedula} />
                                    </div>
                                    <div className="form-group">
                                        <input type="password" required maxLength="20" name="clave"
                                            placeholder="Contraseña" className="form-control"
                                            onChange={this.handleInputChange} value={this.state.clave} />
                                    </div>
                                    <div className="form-group">
                                        <button type="submit" className="btn btn-outline-primary btn-block mt-4">Accesar</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        {/* hacer un informativo de pedir al administrador los datos */}
                    </div>
                </div>
            </>
    }
}
