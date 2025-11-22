import { app, BrowserWindow, shell, ipcMain } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import os from 'node:os'
import { update } from './update'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// --- DATABASE CONNECTION ---
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
// ---------------------------

process.env.APP_ROOT = path.join(__dirname, '../..')

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

if (os.release().startsWith('6.1')) app.disableHardwareAcceleration()
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null
const preload = path.join(__dirname, '../preload/index.mjs')
const indexHtml = path.join(RENDERER_DIST, 'index.html')

async function createWindow() {
  win = new BrowserWindow({
    title: 'POS System',
    icon: path.join(process.env.VITE_PUBLIC, 'favicon.ico'),
    webPreferences: {
      preload,
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })

  update(win)
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})

// --- INVENTORY API ---

// 1. GET PRODUCTS
ipcMain.handle('get-products', async () => {
  try {
    console.log("Fetching products from DB...")
    const products = await prisma.product.findMany({
      include: { supplier: true, stockItems: true },
      orderBy: { createdAt: 'desc' }
    })
    
    return JSON.parse(JSON.stringify(products))
    
  } catch (e) {
    console.error("Database Error:", e)
    return []
  }
})

// 2. ADD PRODUCT
ipcMain.handle('add-product', async (event, data) => {
  const { 
    itemCode, supplier, billNo, billDate, description, 
    qty, warranty, sellingPrice, wholesalePrice, costPrice,
    trackSerial, serials 
  } = data
  
  try {
    // A. Handle Supplier
    let supplierRecord = null
    if (supplier && supplier.trim() !== '') {
      supplierRecord = await prisma.supplier.findUnique({ where: { name: supplier } })
      if (!supplierRecord) {
        supplierRecord = await prisma.supplier.create({ data: { name: supplier } })
      }
    }

    // B. Create Product
    const newProduct = await prisma.product.create({
      data: {
        itemCode,
        name: description, 
        description: `Bill: ${billNo}`, 
        
        supplier: supplierRecord ? { connect: { id: supplierRecord.id } } : undefined,
        
        costPrice: parseFloat(costPrice) || 0,
        wholesalePrice: parseFloat(wholesalePrice) || 0,
        sellingPrice: parseFloat(sellingPrice) || 0,
        
        qty: parseInt(qty) || 0,
        warrantyType: warranty,
        trackSerial: trackSerial,
        lastBillNo: billNo,
        lastBillDate: new Date(billDate)
      }
    })

    // C. Add Serials
    if (trackSerial && serials && serials.length > 0) {
      for (const serial of serials) {
        if (serial && serial.trim() !== "") {
          await prisma.stockItem.create({
            data: {
              serialNumber: serial,
              productId: newProduct.id,
              status: "AVAILABLE"
            }
          })
        }
      }
    }

    return JSON.parse(JSON.stringify(newProduct))

  } catch (e) {
    console.error("Failed to add product:", e)
    throw e
  }
})

// 3. UPDATE PRODUCT
ipcMain.handle('update-product', async (event, data) => {
  const { 
    id, itemCode, supplier, billNo, billDate, description, 
    qty, warranty, sellingPrice, wholesalePrice, costPrice,
    trackSerial, serials 
  } = data
  
  try {
    // A. Handle Supplier
    let supplierRecord = null
    if (supplier && supplier.trim() !== '') {
      supplierRecord = await prisma.supplier.findUnique({ where: { name: supplier } })
      if (!supplierRecord) {
        supplierRecord = await prisma.supplier.create({ data: { name: supplier } })
      }
    }

    // B. Update Main Record
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        itemCode,
        name: description,
        
        supplier: supplierRecord ? { connect: { id: supplierRecord.id } } : { disconnect: true },
        
        costPrice: parseFloat(costPrice) || 0,
        wholesalePrice: parseFloat(wholesalePrice) || 0,
        sellingPrice: parseFloat(sellingPrice) || 0,
        
        qty: parseInt(qty) || 0,
        warrantyType: warranty,
        trackSerial,
        lastBillNo: billNo,
        lastBillDate: new Date(billDate)
      }
    })

    // C. Update Serials
    if (trackSerial) {
      await prisma.stockItem.deleteMany({ where: { productId: id } })
      
      if (serials && serials.length > 0) {
        for (const serial of serials) {
          if (serial && serial.trim() !== "") {
            await prisma.stockItem.create({
              data: {
                serialNumber: serial,
                productId: id,
                status: "AVAILABLE"
              }
            })
          }
        }
      }
    }

    return JSON.parse(JSON.stringify(updatedProduct))
  } catch (e) {
    console.error("Failed to update product:", e)
    throw e
  }
})

// 4. DELETE PRODUCT
ipcMain.handle('delete-product', async (event, id) => {
  try {
    await prisma.stockItem.deleteMany({ where: { productId: id } })
    const deleted = await prisma.product.delete({ where: { id } })
    return JSON.parse(JSON.stringify(deleted))
  } catch (e) {
    console.error("Failed to delete product:", e)
    throw e
  }
})

// --- NEW SALES API (ADDED) ---

// A. FIND PRODUCT BY SERIAL (Scanning Logic)
ipcMain.handle('scan-serial', async (event, serial) => {
  try {
    // 1. Try to find a specific stock item (Serial)
    const stockItem = await prisma.stockItem.findUnique({
      where: { serialNumber: serial },
      include: { product: true }
    })

    if (stockItem) {
      // Found via Serial
      if (stockItem.status === 'SOLD') {
        throw new Error("Item already sold!")
      }
      return JSON.parse(JSON.stringify({ type: 'SERIAL_MATCH', data: stockItem }))
    } 
    
    return null 
  } catch (e: any) {
    console.error(e)
    throw e
  }
})

// B. FIND PRODUCT BY SEARCH (Description/Code Logic)
ipcMain.handle('search-products-sales', async (event, term) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: term } },
          { itemCode: { contains: term } }
        ]
      },
      include: { stockItems: true }
    })
    return JSON.parse(JSON.stringify(products))
  } catch (e) {
    return []
  }
})

// C. CREATE INVOICE (The Big Transaction)
ipcMain.handle('create-invoice', async (event, payload) => {
  const { invoiceData, items } = payload

  // Use transaction to ensure stock and sales stay in sync
  try {
    const result = await prisma.$transaction(async (tx: any) => {
      
      // 1. Create Invoice Header
      const newInvoice = await tx.invoice.create({
        data: {
          invoiceNo: invoiceData.invoiceNo,
          customerName: invoiceData.customerName,
          date: new Date(invoiceData.date),
          totalAmount: invoiceData.totalAmount,
          type: invoiceData.type // 'INVOICE' or 'QUOTATION'
        }
      })

      // 2. Process Each Item
      for (const item of items) {
        // Save Line Item
        await tx.invoiceItem.create({
          data: {
            invoiceId: newInvoice.id,
            itemCode: item.itemCode,
            description: item.description,
            serialNumber: item.serialNumber,
            warranty: item.warranty,
            qty: item.qty,
            unitPrice: item.unitPrice,
            total: item.total
          }
        })

        // ONLY DEDUCT STOCK IF IT'S AN INVOICE (Not a Quotation)
        if (invoiceData.type === 'INVOICE') {
          // 3. Mark Serial as SOLD (if applicable)
          if (item.serialNumber && item.trackSerial) {
             await tx.stockItem.update({
               where: { serialNumber: item.serialNumber },
               data: { status: 'SOLD' }
             })
          }

          // 4. Decrement Product Qty
          if (item.productId) {
            await tx.product.update({
              where: { id: item.productId },
              data: { qty: { decrement: item.qty } }
            })
          }
        }
      }
      
      return newInvoice
    })

    return JSON.parse(JSON.stringify(result))

  } catch (e) {
    console.error("Transaction Failed:", e)
    throw e
  }
})