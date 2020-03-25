export class MyError {
    msg:string

    constructor(msg: string) {
        this.msg = msg;
    }

    public static translateAuthError(code: string) {
        let msg = "Authentificacion incorrecta"
        switch (code) {
            case "auth/wrong-password":
                msg = "Contraseña incorrecta";
                break;
            case "auth/invalid-email":
                msg = "Email desconocido o incorrecto";
                break;
            default:
                break;
        }
        return msg;
    }
}
