import { fixManagerApi } from "../api/fixManagerApi";
import { UserCliente } from "../interface/userCliente";

export interface AuthResponse {
  token: string;
  rol: string;
  id: number;
  email: string;
  nombre: string;
}

const returnUserToken = (data: AuthResponse) => {
  const { id, email, nombre, token } = data;

  const user: UserCliente = { id, email, nombre };

  return {
    user,
    token,
  };
};

export const authLogin = async (email: string, contrasenia: string) => {
  email = email.toLocaleLowerCase();

  try {
    const { data } = await fixManagerApi.post<AuthResponse>("/clientes/login", {
      email,
      contrasenia,
    });

    return returnUserToken(data);
  } catch (error) {
    console.log(error);
    //throw new Error("User and/or password not valid")
    return null;
  }
};

export const authCheckStatus = async () => {
  try {
    const { data } =
      await fixManagerApi.get<AuthResponse>("/auth/check-status");

    return returnUserToken(data);
  } catch (error) {
    console.log(error);
    return null;
  }
};
