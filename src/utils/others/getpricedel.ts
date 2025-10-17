import { Usuario } from "../../entities/cliente.entity";
import { Direccion } from "../../entities/direccion.entity";
import { Venta } from "../../entities/venta.entity";
import { DetalleVenta } from "../../entities/detalleVenta.entity";
import { obtenerCoordenadas } from "../../utils/others/getCordinades";
import { buscarCliente } from "../../services/api/customer";
import { buscarProducto } from "../../services/api/producto";
import { buscarDireccion } from "../../services/api/direccion";
import { InvoiceGeneratorr } from "../../utils/others/invoice/getInvoice copy";

// 🔹 Nuevos imports
import { guardarVenta } from "../../services/api/venta";
import { guardarDetVenta } from "../../services/api/detventa";
export class ClienteService {
  /**
   * Verifica cliente, dirección, guarda datos de venta y genera invoice.
   */
  async verificarDireccionCliente(obj: any, ctx: any): Promise<string> {
    try {
      // 1️⃣ Cliente
      let idUsuario: number;
      const numero = String(ctx.from);
      const cliente = await buscarCliente(numero);
      console.log(cliente);

      if (cliente) {
        idUsuario = cliente[0].idcustomer;
        console.log("si existe", idUsuario);
      } else {
        const nuevo = new Usuario(obj.nombre, obj.dni, numero, obj.ruc);
        const creado = await nuevo.crearUsuario();
        idUsuario = creado[0].idcustomer;
        console.log("no existe", idUsuario);
      }

      console.log("PASAMOS A DELIVERY");

      // 2️⃣ Delivery
      let precioDelivery = 0;
      let idDireccion = null;
      if (obj.tipo === "delivery") {
        // si es delivery
        const buscarDireccionn = await buscarDireccion(idUsuario);
        console.log("buscamos al cliente", buscarDireccionn);
        if (buscarDireccionn && buscarDireccionn.length > 0) {
          precioDelivery = buscarDireccionn[0].precio_del;
          idDireccion = buscarDireccionn[0].id_direccion; // ✅ corregido
          console.log("Direccion 1");
        } else {
          precioDelivery = await this.determinarCosto(
            obj.direccion.numero,
            obj.direccion.calle
          );
          console.log("direccion 2");
        }
        idDireccion=new Direccion(obj.direccion.calle+" "+obj.direccion.numero,"Cajamarca",idUsuario,precioDelivery)
        obj.ventas.push({
          plato: "Precio delivery",
          cantidad: 1,
          precio_unitario: precioDelivery,
        });
        idDireccion = buscarDireccion[0].id_direccion;
      }

      //console.log("Id direccion", idDireccion);

      // 3️⃣ Ajustar importe
      obj.telefono = numero;
      obj.idUsuario = idUsuario;
      obj.preciodelivery = precioDelivery;
      obj.importe = (Number(obj.importe) || 0) + precioDelivery;

      // 4️⃣ Guardar Venta/*
      const venta = {
        id_usuario: idUsuario,
        id_direccion: idDireccion || null,
        fecha: new Date().toISOString(),
        total: obj.importe,
        metodo_de_pago: obj.metodoPago || "efectivo",
        tipo_venta: obj.tipo,
        hora_de_recojo: obj.horaRecojo
          ? new Date(obj.horaRecojo).toISOString()
          : null,
        estado: "registrado",
      };

      const ventaGuardada = await guardarVenta(venta);

      if (!ventaGuardada) {
        throw new Error("No se pudo guardar la venta.");
      }

      // 5️⃣ Guardar detalles de la venta menos precio delivery
      for (const item of obj.ventas) {
        const plato=item.plato
        const idProducto= await buscarProducto(plato.toUpperCase())
        const detalle = {
          id_orden: ventaGuardada[0].id_orden, // la PK de la venta creada
          id_producto: idProducto,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario,
          precio_total: item.cantidad * item.precio_unitario,
        };

        await guardarDetVenta(detalle);
      }

      // 6️⃣ Invoice
      const invoice = new InvoiceGeneratorr(obj);
      const rutaLocal = await invoice.saveInvoiceLocal();

      if (!rutaLocal) {
        console.warn("⚠️ No se pudo subir la imagen.");
        return "no existe";
      }

      console.log("🌍 URL de la imagen en Strapi:", rutaLocal);
      return rutaLocal;
    } catch (error) {
      console.error("❌ Error en verificarDireccionCliente:", error);
      return "error";
    }
  }

  /**
   * Calcula costo de delivery buscando primero en la BD,
   * si no existe la dirección, calcula y guarda.
   */
   async determinarCosto(numero: number, direccion: string): Promise<number> {
        try {
            let precio=0;
            const dir = `${direccion} ${numero}`;
                        precio = await obtenerCoordenadas(numero, direccion);
            return precio;
        } catch (error) {
            console.error("Error verificando la dirección:", error);
            throw new Error("Error al verificar la dirección.");
        }
    }}