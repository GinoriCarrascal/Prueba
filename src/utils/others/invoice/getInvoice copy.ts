import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { uploadToStrapi } from '../../../services/api/guardarimg'
import FormData from 'form-data'
import { Readable } from 'stream'

//src/utils/others/invoice/htmlPlantilla.html
export class InvoiceGeneratorr {
  private data: any

  constructor(data: any) {
    this.data = data
  }

  private generateHTML(): string {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)

    const rutaFactura = path.join(__dirname, 'html.html')
    let html = fs.readFileSync(rutaFactura, 'utf8')

    html = html.replace(
      '{{modo}}',
      this.data.tipo === 'delivery' ? 'DELIVERY' : 'RECOJO'
    )

    html = html
      .replace('{{cliente}}', this.data.nombre)
      .replace('{{ordenId}}', this.data.ordenId)
      .replace('{{nombre}}', this.data.nombre)
      .replace('{{telefono}}', this.data.telefono)
      .replace(
        '{{direccion}}',
        this.data.tipo === 'delivery' && this.data.direccion
          ? `${this.data.direccion.calle ?? ''} ${this.data.direccion.numero ?? ''}`
          : ''
      )

      .replace('{{fecha}}', this.obtenerFecha())
      .replace('{{importe}}', this.data.importe)

    let itemsHTML = ''
    this.data.ventas.forEach((venta: any) => {
      const subtotal = venta.cantidad * venta.precio_unitario
      itemsHTML += `
          <tr>
              <td>${venta.plato}</td>
              <td>${venta.cantidad}</td>
              <td>$${venta.precio_unitario}</td>
              <td>$${subtotal.toFixed(2)}</td>
          </tr>`
    })

    return html.replace('{{items}}', itemsHTML)
  }

  public async saveInvoiceLocal(): Promise<string> {
    const buffer = await this.generateImage()
    const fileName = `invoice_${Date.now()}.png`
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const filePath = path.join(__dirname, fileName)

    fs.writeFileSync(filePath, buffer) // Guardamos en disco
    console.log('Imagen guardada en:', filePath)
    return filePath
  }


  public async generateImage(): Promise<Buffer> {
    console.log('Generando imagen')
    const browser = await puppeteer.launch()
    console.log('Generando pupper')
    const page = await browser.newPage()
    console.log('Generando page')
    const htmlContent = this.generateHTML()

    await page.setContent(htmlContent)
    await page.setViewport({ width: 900, height: 1200 })

    const imageBuffer = await page.screenshot({ fullPage: true })

    await browser.close()

    return Buffer.from(imageBuffer)
  }
  /*
    public async saveInvoice(): Promise<string> {
      const imageBuffer = Buffer.from(await this.generateImage())
  
      // Convertir Buffer en Stream
      const stream = Readable.from(imageBuffer)
  
      // Crear FormData ✅ usamos const
      const data = new FormData()
      data.append('files', stream, {
        filename: `invoice_${Date.now()}.png`,
        contentType: 'image/png'
      })
  
      // Subir imagen a Strapi
      const response = await uploadToStrapi(data)
      return response
    }*/

  private obtenerFecha = (): string => {
    const ahora = new Date()
    return ahora
      .toLocaleString('es-PE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
      .replace(',', '')
  }
}
