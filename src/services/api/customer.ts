import axios from "axios";
import "dotenv/config";
import { url } from "inspector";

// 🔹 Variables de entorno
const API_URL = process.env.SUPABASE_URL?.endsWith("/")
  ? process.env.SUPABASE_URL
  : process.env.SUPABASE_URL + "/";
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const SUPABASE_TOKEN = process.env.SUPABASE_TOKEN;

if (!API_URL || !SUPABASE_KEY || !SUPABASE_TOKEN) {
  throw new Error(
    "❌ Faltan variables de entorno: SUPABASE_URL, SUPABASE_KEY o SUPABASE_TOKEN"
  );
}

// 🔹 Cliente de Axios preconfigurado
const supabaseClient = axios.create({
  baseURL: `${API_URL}rest/v1/`,
  headers: {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_TOKEN}`,
    "Content-Type": "application/json",
    Prefer: "return=representation", // 👈 devuelve el objeto insertado/actualizado
  },
});

// 🔹 Tipo de cliente (ajústalo según tu tabla en Supabase)
export interface Cliente {
  telefono: string;
  dni: string;
  nombre: string | null;
  ruc: string | null; // 👈 lo cambié a string porque RUC puede ser muy largo para number
  id_usuario: number;
}

// 🔹 Buscar cliente por teléfono
const buscarCliente = async (telefono: string): Promise<any | null> => {
  try {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${API_URL}rest/v1/customer?telefono=eq.${telefono}`,
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_TOKEN}`,
        "Content-Type": "application/json",
      },
    };
    const response = await axios.request(config);
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Error al guardar cliente:",
      error.response?.data || error.message
    );
    return null;
  }
};

// 🔹 Guardar cliente
const guardarCliente = async (data: any): Promise<any | null> => {
  try {
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${API_URL}rest/v1/customer`,
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_TOKEN}`,
        "Content-Type": "application/json",
        Prefer: "return=representation", // 👈 devuelve el objeto insertado/actualizado
      },
      data: data,
    };

    console.log(config);

    const response = await axios.request(config); // 👈 ahora sí con await

    if (response.data && response.data.length > 0) {
      console.log("✅ Cliente insertado:", response.data[0]);
      return response.data; // 👈 devuelve el array completo
    }

    console.error("⚠️ No se devolvió cliente al guardar.");
    return null;
  } catch (error: any) {
    console.error(
      "❌ Error al guardar cliente:",
      error.response?.data || error.message
    );
    return null;
  }
};

export {buscarCliente,guardarCliente}