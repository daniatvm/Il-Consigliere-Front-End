import React, { Component } from "react";
import auth from "../../helpers/auth";
import axios from 'axios';
import swal from 'sweetalert';

export default class AdministrarCorreo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            correo: '',
            correos: []
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.deleteEmail = this.deleteEmail.bind(this);
    }

    componentDidMount() {
        this.getEmails();
    }

    getEmails() {
        const cedula = auth.getInfo().cedula;
        axios.get(`http://localhost:5000/correo/${cedula}`)
            .then(res => {
                this.setState({
                    correos: res.data
                });
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
        swal({
            title: "Confirmación",
            text: `Se eliminará ${email}`,
            icon: "warning",
            buttons: ["Cancelar", "Confirmar"],
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    axios.delete('http://localhost:5000/correo', { data: { correo: email } })
                        .then(() => {
                            this.getEmails();
                        })
                        .catch((err) => console.log(err));
                }
            });
    }

    handleSubmit(e) {
        e.preventDefault();
        const cedula = auth.getInfo().cedula;
        axios.post(`http://localhost:5000/correo/${cedula}`, { correo: this.state.correo })
            .then(() => {
                this.getEmails()
                this.setState({
                    correo: ''
                })
            })
            .catch((err) => console.log(err));
    }

    emailsList() {
        const emails = [];
        for (let i = 0; i < this.state.correos.length; i++) {
            const correo = this.state.correos[i].correo;
            emails.push(
                <div className="d-flex my-div mx-auto my-border" key={i}>
                    <div className="my-email2 mx-auto">{correo}</div>
                    <button className='btn btn-outline-primary' onClick={(e) => this.deleteEmail(e, correo)}><i className="fas fa-trash-alt"></i></button>
                </div>
            );
        }
        return emails;
    }

    render() {
        return (
            <div className="container">
                <h3 className="mb-4 text-center">Administración de Correos</h3>
                <form onSubmit={this.handleSubmit}>
                    <div className="d-flex my-div mx-auto">
                        <div className="form-group my-email mx-auto">
                            <input type="email" required maxLength="40" name="correo"
                                placeholder="Nuevo correo" autoComplete="off" className="form-control"
                                autoFocus onChange={this.handleInputChange} value={this.state.correo} />
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-outline-primary"><i className="fas fa-save"></i></button>
                        </div>
                    </div>
                </form>
                {this.emailsList()}
            </div>
        );
    }
}
