import React, { Component } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import auth from '../../helpers/auth';
import { Redirect } from 'react-router-dom';

export default class CambioClave extends Component {
    constructor(props) {
        super(props);
        this.state = {
            actual: '',
            nueva: '',
            confirmacion: '',
            redirect: false
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(e) {
        let value = e.target.value;
        let name = e.target.name;
        this.setState({
            [name]: value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        auth.verifyToken()
            .then(value => {
                if (value) {
                    if (this.state.nueva === this.state.confirmacion) {
                        const user = {
                            cedula: auth.getInfo().cedula,
                            clave: this.state.actual
                        }
                        axios.post('http://localhost:5000/usuario/verificar_clave', user)
                            .then(res => {
                                if (res.data.success) {
                                    const pass = {
                                        clave: this.state.nueva
                                    }
                                    axios.post(`http://localhost:5000/usuario/cambiar_clave/${user.cedula}`, pass)
                                        .then(res => {
                                            if (res.data.success) {
                                                this.myAlert('Éxito', 'La contraseña se ha cambiado satisfactoriamente.', 'success');
                                            } else {
                                                this.myAlert('Inténtelo más tarde', 'Error interno del servidor.', 'error');
                                            }
                                        })
                                        .catch((err) => console.log(err));
                                } else {
                                    this.myAlert('Verifique', 'Parece que digitaste mal la contraseña actual.', 'error');
                                }
                            })
                            .catch((err) => console.log(err));
                    } else {
                        this.myAlert('Verifique', 'La contraseña nueva y su confirmación son distintas.', 'error');
                    }
                } else {
                    this.setState({
                        redirect: true
                    });
                    auth.logOut();
                }
            })
            .catch((err) => console.log(err));
    }

    myAlert(title, text, icon) {
        swal({
            title: title,
            text: text,
            icon: icon,
            button: "Ok"
        });
        this.setState({
            actual: '',
            nueva: '',
            confirmacion: ''
        });
    }

    render() {
        return (this.state.redirect ? <Redirect to='/' /> :
            <>
                <h4 className="text-center mb-4">Cambio de Contraseña</h4>
                <p className="my-muted">La contraseña debe tener un largo mínimo de 4 caracteres.</p>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <input type="password" required maxLength="20" name="actual"
                            placeholder="Contraseña actual" className="form-control"
                            onChange={this.handleInputChange} value={this.state.actual} />
                    </div>
                    <div className="form-group">
                        <input type="password" required minLength="4" maxLength="20" name="nueva"
                            placeholder="Contraseña nueva" className="form-control"
                            onChange={this.handleInputChange} value={this.state.nueva} />
                    </div>
                    <div className="form-group">
                        <input type="password" required minLength="4" maxLength="20" name="confirmacion"
                            placeholder="Confirme contraseña nueva" className="form-control"
                            onChange={this.handleInputChange} value={this.state.confirmacion} />
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-outline-primary btn-block mt-4">Guardar</button>
                    </div>
                </form>
            </>
        );
    }
}
