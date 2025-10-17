import axios from "axios";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

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

const getProductos = async () => {
  try {
    const response = await axios.get(`${API_URL}/rest/v1/productos?select=*`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    return response.data; 
  } catch (error: any) {
    console.error("❌ Error al obtener productos:", error.response?.data || error.message);
  }
};

// 🔹 Buscar cliente por teléfono
const buscarProducto = async (hamburguesa: string): Promise<any | null> => {
  try {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${API_URL}rest/v1/productos?nombre=eq.${hamburguesa}`,
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_TOKEN}`,
        "Content-Type": "application/json",
      },
    };
    const response = await axios.request(config);
    return response.data[0].id_producto;
  } catch (error: any) {
    console.error(
      "❌ Error al buscar producto( funcion buscar producto)",
      error.response?.data || error.message
    );
    return null;
  }
};

export {getProductos,buscarProducto}