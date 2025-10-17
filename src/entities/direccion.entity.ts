import { guardarDireccion } from "../services/api/direccion";

export class Direccion {
  calle: string;       // Calle de la dirección
  ciudad: string;      // Ciudad
  idUsuario: number;   // ID del usuario (FK en tabla usuarios)
  precioDel: number;   // Precio del delivery

  constructor(calle: string, ciudad: string, idUsuario: number, precioDel: number) {
    this.calle = calle;
    this.ciudad = ciudad;
    this.idUsuario = idUsuario;
    this.precioDel = precioDel;
  }

  // Validar que la calle tenga mínimo 3 caracteres
  private validarCalle(): boolean {
    return typeof this.calle === "string" && this.calle.trim().length >= 3;
  }

  // Validar que la ciudad tenga mínimo 2 caracteres
  private validarCiudad(): boolean {
    return typeof this.ciudad === "string" && this.ciudad.trim().length >= 2;
  }

  // Validar que el precio sea positivo
  private validarPrecio(): boolean {
    return this.precioDel > 0;
  }

  // Validación completa
  esValido(): boolean {
    return this.validarCalle() && this.validarCiudad() && this.validarPrecio();
  }

  // Guardar dirección en la API / Supabase
  async guardar(): Promise<any> {
    if (!this.esValido()) {
      throw new Error("Los datos de la dirección no son válidos.");
    }

    const datosDireccion = {
      calle: this.calle,
      ciudad: this.ciudad,
      id_usuario: this.idUsuario,
      precio_del: this.precioDel
    };

    try {
      const response = await guardarDireccion(datosDireccion);
      return response;
    } catch (error) {
      console.error("❌ Error al guardar la dirección:", error);
      return null;
    }
  }
}
