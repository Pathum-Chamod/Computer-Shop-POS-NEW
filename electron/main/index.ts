import { app, BrowserWindow, shell, ipcMain } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import os from 'node:os'
import { update } from './update'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// --- DATABASE CONNECTION ---
// Now that we fixed schema.prisma and vite.config.ts, 
// we can use the standard package name.
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

ipcMain.handle('get-products', async () => {
  try {
    console.log("Fetching products from DB...")
    const products = await prisma.product.findMany({
      include: { category: true, stockItems: true },
      orderBy: { createdAt: 'desc' }
    })
    
    // FIX: Convert to plain JSON to prevent "Object could not be cloned" error
    return JSON.parse(JSON.stringify(products))
    
  } catch (e) {
    console.error("Database Error:", e)
    return []
  }
})

ipcMain.handle('add-product', async (event, data) => {
  const { name, brand, price, cost, categoryName } = data
  try {
    let category = await prisma.category.findUnique({ where: { name: categoryName } })
    if (!category) {
      category = await prisma.category.create({ data: { name: categoryName } })
    }
    
    const newProduct = await prisma.product.create({
      data: {
        name,
        brand,
        price: parseFloat(price),
        cost: parseFloat(cost),
        categoryId: category.id,
      }
    })

    // FIX: Convert to plain JSON here too!
    return JSON.parse(JSON.stringify(newProduct))

  } catch (e) {
    console.error("Failed to add product:", e)
    throw e
  }
})