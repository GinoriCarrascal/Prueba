
const functions = [
    {
        name: "getURLsaved",
        description: "Obtiene los datos para crear una boleta de pedido",
        parameters: {
            type: "object",
            properties: {
                nombre: { type: "string", description: "Nombre del cliente" },
                dni: { type: "string", description: "numero de identificacion del cliente" },
                tipo: { type: "string", description: "determina si es para delivery o recojo" },
                direccion: { type: "object",nullable: true, properties: {
                    numero: {
                        type: "string",
                        description: "Número de la calle",
                    },
                    calle: {
                        type: "string",
                        description: "Nombre de la calle",
                    },
                }},
                metodo: { type: "string" , description: "metodo de pago(yape, plin o efectivo)"},
                telefono: { type: "string", default:11111111111 },
                ventas: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            plato: { type: "string", description: "nombre del plato" },
                            cantidad: { type: "number", description: "numero de plato" },
                            precio_unitario: { type: "number", description: "precio unitario del plato" },
                        },
                        required: ["plato", "cantidad", "precio_unitario"],
                    },
                },
                importe: { type: "number" },
                preciodelivery: { type: "number", default: 1 },
            },
            required: ["data"],
        },
    },
];


export { functions };