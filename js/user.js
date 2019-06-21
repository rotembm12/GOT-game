class User { 
    constructor(user,pass){
        this.user = user;
        this.pass = pass;
    }
    alertMe = () => {
        alert(`hi ${this.user}, your pass is ${this.pass}`);
    }
}

export default User;

