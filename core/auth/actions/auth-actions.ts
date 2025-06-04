import { fixManagerApi } from "../api/fixManagerApi";
import { UserCliente } from "../interface/userCliente";
import { UserTaller } from "../interface/userTaller"; // ✅ NUEVO

export interface AuthResponse {
  token: string;
  rol: string;
  id: number;
  email: string;
  nombre: string;
}

const returnUserClienteToken = (data: AuthResponse) => {
  const { id, email, nombre, token, rol } = data;
  const user: UserCliente = { id, email, nombre, rol };
  return { user, token };
};

const returnUserTallerToken = (data: AuthResponse) => {
  const { id, email, nombre, token, rol } = data;
  const user: UserTaller = { id, email, nombre, rol };
  return { user, token };
};

export const authLogin = async (email: string, contrasenia: string) => {
  email = email.toLocaleLowerCase();

  try {
    const { data } = await fixManagerApi.post<AuthResponse>("/clientes/login", {
      email,
      contrasenia,
    });

    return returnUserClienteToken(data);
  } catch (error) {
    console.log("Error login cliente:", error);
    return null;
  }
};

export const authLoginTaller = async (email: string, contrasenia: string) => {
  email = email.toLocaleLowerCase();

  try {
    const { data } = await fixManagerApi.post<AuthResponse>("/talleres/login", {
      email,
      contrasenia,
    });

    return returnUserTallerToken(data);
  } catch (error) {
    console.log("Error login taller:", error);
    return null;
  }
};
export const authCheckStatus = async () => {
  try {
    const { data } =
      await fixManagerApi.get<AuthResponse>("/auth/check-status");

    if (data.rol === "CLIENTE") {
      return returnUserClienteToken(data);
    }

    if (data.rol === "TALLER") {
      return returnUserTallerToken(data);
    }

    return null;
  } catch (error) {
    console.log("Error check status:", error);
    return null;
  }
};
