import { PersonaResponse } from "./persona-response.model";
import { RolResponse } from "./rol-response.model";
import { UsuarioLoginResponse } from "./usuario-login-response.model";

export class LoginResponse {
    success: boolean = false;
    mensaje: string = "";
    token: string = "";
    tokenExpira: string = "";
    usuario: UsuarioLoginResponse = new UsuarioLoginResponse();
    rol: RolResponse = new RolResponse();
    persona: PersonaResponse = new PersonaResponse();
}