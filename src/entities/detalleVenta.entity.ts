import { guardarDetVenta } from "../services/api/detventa";

export class DetalleVenta {
  id_orden: number;
  id_producto: number;
  cantidad: number; // Cantidad (obligatoria, debe ser positiva)
  precioUnitario: number; // Precio unitario (obligatorio, debe ser positivo)
  precioTotal: number; // Precio total calculado

  constructor(
    id_orden: number,
    id_producto: number,
    cantidad: number,
    precioUnitario: number
  ) {
    this.id_orden = id_orden;
    this.id_producto = id_producto;
    this.cantidad = cantidad;
    this.precioUnitario = precioUnitario;
    this.precioTotal = this.calcularPrecioTotal();
  }

  // Calcular precio total
  private calcularPrecioTotal(): number {
    return this.cantidad * this.precioUnitario;
  }

  // Validar que la cantidad sea positiva
  private validarCantidad(): boolean {
    return this.cantidad > 0;
  }

  // Validar que el precio unitario sea positivo
  private validarPrecioUnitario(): boolean {
    return this.precioUnitario > 0;
  }

  // Validación completa
  esValido(): boolean {
    return this.validarCantidad() && this.validarPrecioUnitario();
  }

  // Guardar detalle de venta en la API
  async crearDetalleVenta(): Promise<any> {
    if (!this.esValido()) {
      throw new Error("Cantidad o precio unitario no son válidos.");
    }

    const datosVenta = {
      cantidad: this.cantidad,
      precioUnitario: this.precioUnitario,
      precioTotal: this.calcularPrecioTotal(),
    };

    try {
      const response = await guardarDetVenta(datosVenta);
      return response;
    } catch (error) {
      console.error("Error al guardar el detalle de venta:", error);
      return null;
    }
  }
}
