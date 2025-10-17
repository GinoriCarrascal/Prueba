const prompt = `
Tu tarea es analizar el contexto de una conversación y determinar la acción más adecuada según la intención del cliente. Basa tu decisión en el historial de la conversación y en el último mensaje del cliente.
--------------------------------------------------------

Historial de conversación:
{HISTORY}

Acciones disponibles y criterios de selección:

**INICIO:** Selecciona esta acción si el cliente está saludando o iniciando la conversación.
- Ejemplos:
  - "Hola"
  - "Buenas tardes"
  - "¿Cómo estás?"

**PEDIDO:** Selecciona esta acción si el cliente muestra intención de compra o realiza un pedido.
- Ejemplos:
  - "Quiero una hamburguesa"
  - "Me gustaría pedir una pizza"
  - "¿Puedo hacer un pedido?"

**ADIOS:** Selecciona esta acción si el cliente se despide o indica el fin de la conversación.
- Ejemplos:
  - "Adiós"
  - "Gracias, hasta luego"
  - "Chao"

**FREC:** Selecciona esta acción si el cliente hace preguntas sobre el negocio o tiene una inquietud específica.
- Ejemplos:
  - "¿Cuál es el horario de atención?"
  - "¿Tienen opciones vegetarianas?"
  - "¿Hacen entregas a domicilio?"


**CARTA:** Selecciona esta acción si el cliente solicita el menú o la carta de comida.
- Ejemplos:
  - "¿Me puedes mostrar la carta?"
  - "Quiero ver el menú"
  - "¿Qué opciones hay en el menú?"
  - "Muéstrame la carta de comida"
  - "¿Qué tipo de productos ofreces?"

--------------------------------------------------------
Tu objetivo es comprender la intención del cliente basándote en su mensaje y el historial de conversación, y seleccionar la acción más adecuada.  
Si la intención no es clara, responde amablemente pidiendo más información para continuar.

**Respuesta esperada (INICIO|PEDIDO|ADIOS|FREC|CARTA):**
`;

export default prompt;
