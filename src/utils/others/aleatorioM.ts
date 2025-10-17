export default function aleatorio(lista) {
  try {
    const value = lista[Math.floor(Math.random() * lista.length)] // ✅ const
    return value
  } catch (err) {
    console.error("Error en aleatorio:", err)
    return undefined
  }
}
