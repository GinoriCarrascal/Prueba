import { guardarVenta } from "../services/api/venta";
import type { Venta as VentaDTO } from "../services/api/venta"; // el interface correcto

export class Venta {
  idCliente: number; // 🔹 debe ser number, no string
  metodoPago: string;
  tipo: "delivery" | "retira";
  direccion: number | null; // 🔹 debe ser un id (number), no string
  horaRecogida: string | null;
  importe: number;
  estado: string;

  constructor(
    idCliente: number,
    metodoPago: string,
    direccion: number | null,
    horaRecogida: string | null,
    importe: number,
    tipo: "delivery" | "retira",
    estado: string = "en proceso de pago"
  ) {
    this.idCliente = idCliente;
    this.metodoPago = metodoPago;
    this.direccion = direccion;
    this.horaRecogida = horaRecogida;
    this.importe = importe;
    this.tipo = tipo;
    this.estado = estado;
  }

  esValido(): boolean {
    return (
      typeof this.idCliente === "number" &&
      this.metodoPago.trim().length > 0 &&
      this.importe > 0 &&
      ["delivery", "retira"].includes(this.tipo) &&
      this.estado.trim().length > 0
    );
  }

  async crearVenta(): Promise<any> {
    if (!this.esValido()) {
      throw new Error("❌ La venta no es válida");
    }

    // 🔹 Adaptamos la clase a la interface Venta
    const datosUsuario: VentaDTO = {
      id_usuario: this.idCliente,
      direccion_id: this.direccion ?? 0, // si puede ser null, tu API debe aceptarlo
      importe: this.importe,
      //tipo: this.tipo,
      total: this.importe, // si el total es lo mismo que importe
      metodo_de_pago: this.metodoPago,
      tipo_venta: this.tipo, // aquí revisa si backend distingue entre tipo y tipo_venta
      hora_de_recojo: this.horaRecogida ?? "",
      estado: this.estado,
    };

    console.log("➡️ Enviando venta:", datosUsuario);

    try {
      return await guardarVenta(datosUsuario);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      return null;
    }
  }
}
