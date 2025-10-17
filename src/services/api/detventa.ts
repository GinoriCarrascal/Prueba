import axios, { AxiosRequestConfig } from "axios";
import "dotenv/config";

// 🔹 Variables de entorno
const API_URL = process.env.SUPABASE_URL?.endsWith("/")
  ? process.env.SUPABASE_URL
  : process.env.SUPABASE_URL + "/";
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const SUPABASE_TOKEN = process.env.SUPABASE_TOKEN;

if (!API_URL || !SUPABASE_KEY || !SUPABASE_TOKEN) {
  throw new Error("Faltan variables de entorno para conectarse a Supabase");
}

// 🔹 Cliente de Axios preconfigurado
const supabaseClient = axios.create({
  baseURL: `${API_URL}rest/v1/`,
  headers: {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_TOKEN}`,
    "Content-Type": "application/json",
  },
});

// 🔹 Tipo DetalleOrden
export interface DetalleOrden {
  id_detalle?: number;
  id_orden: number;
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
  precio_total: number;
}

// 🔹 Guardar cliente
const guardarDetVenta = async (data: any): Promise<any | null> => {
  try {
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${API_URL}rest/v1/detalle_orden`,
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_TOKEN}`,
        "Content-Type": "application/json",
        Prefer: "return=representation", // 👈 devuelve el objeto insertado/actualizado
      },
      data: data,
    };

   const response = await axios.request(config); // 👈 ahora sí con await

    if (response.data && response.data.length > 0) {
      //console.log("✅ DetalleVenta insertado:", response.data[0]);
      return response.data; // 👈 devuelve el array completo
    }

    console.error("⚠️ No se devolvió cliente al guardar.");
    return null;
  } catch (error: any) {
    console.error(
      "❌ Error al guardar detalle del cliente:",
      error.response?.data || error.message
    );
    return null;
  }
};


export { guardarDetVenta };
