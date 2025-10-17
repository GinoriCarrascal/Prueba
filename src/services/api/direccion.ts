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

const buscarDireccion = async (dir: number): Promise<any | null> => {
  try {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${API_URL}rest/v1/direcciones?id_usuario=eq.${dir}`,
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_TOKEN}`,
        "Content-Type": "application/json",
      },
    };
    const response = await axios.request(config);
    console.log("BUSCAR DIRECCION DE CLIENTE", response);
    return response.data[0];
  } catch (error: any) {
    console.error(
      "❌ Error al buscar el cliente",
      error.response?.data || error.message
    );
    return null;
  }
};

// 🔹 Guardar cliente
const guardarDireccion = async (dataa: any): Promise<any | null> => {
  try {
    const data = JSON.stringify(dataa);
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${API_URL}rest/v1/direcciones`,
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
      "❌ Error al guardar direcion",error) }}

      export {buscarDireccion,guardarDireccion}