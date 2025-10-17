import { guardarCliente } from "../services/api/customer";

export class Usuario {
  telefono: string;
  dni: string;
  nombre: string | null;
  ruc: number | null;

  constructor(
    telefono: string,
    dni: string,
    nombre: string | null,
    ruc: number | null
  ) {
    this.telefono = telefono;
    this.dni = dni;
    this.nombre = nombre;
    this.ruc = ruc ?? null;
  }

  // Validar que el DNI tiene 8 dígitos numéricos
  validarDni(): boolean {
    return /^\d{8}$/.test(this.dni);
  }

  // Validar que el nombre no es nulo ni vacío
  validarNombre(): boolean {
    return this.nombre !== null && this.nombre.trim() !== "";
  }

  // Validar todos los campos

  // Crear usuario en el API
  async crearUsuario(): Promise<any> {
    const data = {
      nombre: this.nombre,
      dni: this.dni,
      telefono: this.telefono ? Number(this.telefono) : null,
      ruc: this.ruc !== null ? Number(this.ruc) : null,
    };

    console.log(data);
    try {
      const response = await guardarCliente(data[0]);
      return response;
    } catch (error) {
      console.error("Error en la solicitud:", error);
      return null;
    }
  }
}