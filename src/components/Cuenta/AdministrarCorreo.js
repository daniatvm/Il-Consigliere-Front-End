import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
import auth from '../../helpers/auth';

export default class AdministrarCorreo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            correo: '',
            correos: [],
            redirect: false
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.deleteEmail = this.deleteEmail.bind(this);
    }

    componentDidMount() {
        this.getEmails();
    }

    getEmails() {
        auth.verifyToken()
            .then(value => {
                if (value) {
                    const cedula = auth.getInfo().cedula;
                    axios.get(`/correo/${cedula}`)
                        .then(res => {
                            if (res.data.success) {
                                this.setState({
                                    correos: res.data.emails
                                });
                            }
                            else {
                                this.setState({
                                    correos: []
                                })
                            }
                        })
                        .catch((err) => console.log(err));
                } else {
                    this.setState({
                        redirect: true
                    });
                    auth.logOut();
                }
            })
            .catch((err) => console.log(err));
    }

    handleInputChange(e) {
        let value = e.target.value;
        let name = e.target.name;
        this.setState({
            [name]: value
        });
    }

    deleteEmail(e, email) {
        e.preventDefault();
        auth.verifyToken()
            .then(value => {
                if (value) {
                    swal({
                        title: "Confirmación",
                        text: `Se eliminará ${email}`,
                        icon: "warning",
                        buttons: ["Cancelar", "Confirmar"],
                        dangerMode: true,
                    })
                        .then((willDelete) => {
                            if (willDelete) {
                                axios.delete('/correo', { data: { correo: email } })
                                    .then(() => {
                                        this.getEmails();
                                    })
                                    .catch((err) => console.log(err));
                            }
                        });
                } else {
                    this.setState({
                        redirect: true
                    });
                    auth.logOut();
                }
            })
            .catch((err) => console.log(err));
    }

    handleSubmit(e) {
        e.preventDefault();
        auth.verifyToken()
            .then(value => {
                if (value) {
                    axios.post('/correo/verificar_correo', { correo: this.state.correo })
                        .then(res => {
                            if (!res.data.taken) {
                                const cedula = auth.getInfo().cedula;
                                axios.post(`/correo/${cedula}`, { correo: this.state.correo })
                                    .then(() => {
                                        this.getEmails()
                                        this.setState({
                                            correo: ''
                                        })
                                    })
                                    .catch((err) => console.log(err));
                            } else {
                                swal({
                                    title: "Este correo ya existe",
                                    text: "El correo que se digitó ya se encuentra registrado en el sistema.",
                                    icon: "warning",
                                    button: "Ok",
                                });
                            }
                        })
                        .catch((err) => console.log(err));
                } else {
                    this.setState({
                        redirect: true
                    });
                    auth.logOut();
                }
            })
            .catch((err) => console.log(err));
    }

    emailsList() {
        const emails = [];
        for (let i = 0; i < this.state.correos.length; i++) {
            const correo = this.state.correos[i].correo;
            emails.push(
                <div className="d-flex my-div mx-auto" key={i}>
                    <div className="my-email2 mx-auto my-border">{correo}</div>
                    <i className="fas fa-trash-alt my-icon fa-lg my-auto" onClick={(e) => this.deleteEmail(e, correo)} />
                </div>
            );
        }
        return emails;
    }

    render() {
        return (this.state.redirect ? <Redirect to='/' /> :
            <div className="container">
                <h3 className="mb-4 text-center">Administración de Correos</h3>
                <form onSubmit={this.handleSubmit}>
                    <div className="d-flex my-div mx-auto">
                        <div className="form-group my-email m-auto d-block">
                            <input type="email" required maxLength="40" name="correo"
                                placeholder="Nuevo correo" autoComplete="off" className="form-control"
                                autoFocus onChange={this.handleInputChange} value={this.state.correo} />
                        </div>
                        <div className="form-group my-auto d-block">
                            <button className="my-button" type="submit"><i className="fas fa-save my-icon fa-lg" /></button>
                        </div>
                    </div>
                </form>
                {this.state.correos.length === 0 &&
                    <div className="my-div mx-auto">
                        <p className="my-muted">No tiene correos registrados.</p>
                    </div>
                }
                <div className="email-container">
                    {this.emailsList()}
                </div>
            </div>
        );
    }
}
