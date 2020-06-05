import axios from 'axios';
import auth from './auth';

class Roles {
    constructor(){
        this.roles = []
    }

    async checkRoles(){
        const user = auth.getInfo();
        if(user.cedula === ''){
            this.roles = [];
        }else{
            const roles = await axios.get(`http://localhost:5000/usuario/${user.cedula}$`);
            this.roles = roles;
        }
    }

    getRoles(){
        return this.roles;
    }
}

export default new Roles();
