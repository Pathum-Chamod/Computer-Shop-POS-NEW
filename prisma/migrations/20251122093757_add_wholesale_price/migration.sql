-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "itemCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "supplierId" INTEGER,
    "costPrice" DECIMAL NOT NULL DEFAULT 0,
    "wholesalePrice" DECIMAL DEFAULT 0,
    "sellingPrice" DECIMAL NOT NULL DEFAULT 0,
    "warrantyType" TEXT,
    "qty" INTEGER NOT NULL DEFAULT 0,
    "trackSerial" BOOLEAN NOT NULL DEFAULT false,
    "lastBillNo" TEXT,
    "lastBillDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Product_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("costPrice", "createdAt", "description", "id", "itemCode", "lastBillDate", "lastBillNo", "name", "qty", "sellingPrice", "supplierId", "trackSerial", "warrantyType") SELECT "costPrice", "createdAt", "description", "id", "itemCode", "lastBillDate", "lastBillNo", "name", "qty", "sellingPrice", "supplierId", "trackSerial", "warrantyType" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_itemCode_key" ON "Product"("itemCode");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
