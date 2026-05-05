/// <reference types="node" />
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.componente.deleteMany({});

    const componentes: any[] = [
        {
            sku: "CPU-AMD-9700X",
            nombre: "AMD Ryzen 7 9700X",
            tipo: "CPU",
            precio: 6500.00,
            stock: 12,
            activo: true,
            atributos: { socket: "AM5", consumo: 65 }
        },
        {
            sku: "CPU-AMD-7600X",
            nombre: "AMD Ryzen 5 7600X",
            tipo: "CPU",
            precio: 4200.00,
            stock: 18,
            activo: true,
            atributos: { socket: "AM5", consumo: 105 }
        },
        {
            sku: "CPU-AMD-7950X3D",
            nombre: "AMD Ryzen 9 7950X3D",
            tipo: "CPU",
            precio: 12500.00,
            stock: 3,
            activo: true,
            atributos: { socket: "AM5", consumo: 120 }
        },
        {
            sku: "CPU-INT-14600K",
            nombre: "Intel Core i5-14600K",
            tipo: "CPU",
            precio: 5800.00,
            stock: 5,
            activo: true,
            atributos: { socket: "LGA1700", consumo: 125 }
        },
        {
            sku: "CPU-INT-14700K",
            nombre: "Intel Core i7-14700K",
            tipo: "CPU",
            precio: 7900.00,
            stock: 8,
            activo: true,
            atributos: { socket: "LGA1700", consumo: 125 }
        },
        {
            sku: "CPU-INT-14900K",
            nombre: "Intel Core i9-14900K",
            tipo: "CPU",
            precio: 11200.00,
            stock: 4,
            activo: true,
            atributos: { socket: "LGA1700", consumo: 125 }
        },
        {
            sku: "GPU-NV-5070",
            nombre: "NVIDIA GeForce RTX 5070",
            tipo: "GPU",
            precio: 11500.00,
            stock: 4,
            activo: true,
            atributos: { vram: "12GB", consumo: 250, longitudMM: 280 }
        },
        {
            sku: "GPU-NV-5080",
            nombre: "NVIDIA GeForce RTX 5080",
            tipo: "GPU",
            precio: 19500.00,
            stock: 2,
            activo: true,
            atributos: { vram: "16GB", consumo: 320, longitudMM: 310 }
        },
        {
            sku: "GPU-NV-4060",
            nombre: "NVIDIA GeForce RTX 4060",
            tipo: "GPU",
            precio: 5800.00,
            stock: 22,
            activo: true,
            atributos: { vram: "8GB", consumo: 115, longitudMM: 240 }
        },
        {
            sku: "GPU-NV-4070TIS",
            nombre: "NVIDIA GeForce RTX 4070 Ti SUPER",
            tipo: "GPU",
            precio: 15800.00,
            stock: 6,
            activo: true,
            atributos: { vram: "16GB", consumo: 285, longitudMM: 305 }
        },
        {
            sku: "GPU-AMD-7600",
            nombre: "AMD Radeon RX 7600",
            tipo: "GPU",
            precio: 5200.00,
            stock: 15,
            activo: true,
            atributos: { vram: "8GB", consumo: 165, longitudMM: 240 }
        },
        {
            sku: "GPU-AMD-7800XT",
            nombre: "AMD Radeon RX 7800 XT",
            tipo: "GPU",
            precio: 9800.00,
            stock: 8,
            activo: true,
            atributos: { vram: "16GB", consumo: 263, longitudMM: 320 }
        },
        {
            sku: "GPU-AMD-7900XTX",
            nombre: "AMD Radeon RX 7900 XTX",
            tipo: "GPU",
            precio: 18500.00,
            stock: 3,
            activo: true,
            atributos: { vram: "24GB", consumo: 355, longitudMM: 344 }
        },
        {
            sku: "RAM-KIN-32GB-5600",
            nombre: "Kingston Fury Beast Black 32GB (1x32GB) DDR5 5600MT/s",
            tipo: "RAM",
            precio: 2100.00,
            stock: 25,
            activo: true,
            atributos: { tipo: "DDR5", velocidad: 5600, capacidad_gb: 32 }
        },
        {
            sku: "RAM-COR-64GB-6000",
            nombre: "Corsair Vengeance RGB 64GB (2x32GB) DDR5 6000MT/s",
            tipo: "RAM",
            precio: 4500.00,
            stock: 10,
            activo: true,
            atributos: { tipo: "DDR5", velocidad: 6000, capacidad_gb: 64 }
        },
        {
            sku: "RAM-GSK-32GB-6400",
            nombre: "G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5 6400MT/s",
            tipo: "RAM",
            precio: 2800.00,
            stock: 14,
            activo: true,
            atributos: { tipo: "DDR5", velocidad: 6400, capacidad_gb: 32 }
        },
        {
            sku: "RAM-COR-16GB-3200",
            nombre: "Corsair Vengeance LPX 16GB (2x8GB) DDR4 3200MT/s",
            tipo: "RAM",
            precio: 850.00,
            stock: 40,
            activo: true,
            atributos: { tipo: "DDR4", velocidad: 3200, capacidad_gb: 16 }
        },
        {
            sku: "MB-ASUS-B650",
            nombre: "ASUS ROG Strix B650E-F Gaming WiFi",
            tipo: "MOTHERBOARD",
            precio: 4200.00,
            stock: 7,
            activo: true,
            atributos: { socket: "AM5", tipoRAM: "DDR5", formato: "ATX" }
        },
        {
            sku: "MB-GIG-X670E",
            nombre: "Gigabyte X670E AORUS MASTER",
            tipo: "MOTHERBOARD",
            precio: 8500.00,
            stock: 4,
            activo: true,
            atributos: { socket: "AM5", tipoRAM: "DDR5", formato: "E-ATX" }
        },
        {
            sku: "MB-ASUS-B760",
            nombre: "ASUS TUF Gaming B760-PLUS WiFi D4",
            tipo: "MOTHERBOARD",
            precio: 3200.00,
            stock: 12,
            activo: true,
            atributos: { socket: "LGA1700", tipoRAM: "DDR4", formato: "ATX" }
        },
        {
            sku: "MB-MSI-Z790",
            nombre: "MSI PRO Z790-P WiFi",
            tipo: "MOTHERBOARD",
            precio: 3900.00,
            stock: 10,
            activo: true,
            atributos: { socket: "LGA1700", tipoRAM: "DDR5", formato: "ATX" }
        },
        {
            sku: "PSU-COR-850",
            nombre: "Corsair RM850x 850W 80 Plus Gold",
            tipo: "PSU",
            precio: 2400.00,
            stock: 15,
            activo: true,
            atributos: { potenciaW: 850, certificacion: "Gold" }
        },
        {
            sku: "PSU-SEA-1000",
            nombre: "Seasonic Focus GX-1000 1000W 80 Plus Gold",
            tipo: "PSU",
            precio: 3200.00,
            stock: 8,
            activo: true,
            atributos: { potenciaW: 1000, certificacion: "Gold" }
        },
        {
            sku: "PSU-EVG-650",
            nombre: "EVGA SuperNOVA 650 G6 650W 80 Plus Gold",
            tipo: "PSU",
            precio: 1800.00,
            stock: 20,
            activo: true,
            atributos: { potenciaW: 650, certificacion: "Gold" }
        },
        {
            sku: "GAB-NZXT-H5",
            nombre: "NZXT H5 Flow Compact ATX",
            tipo: "GABINETE",
            precio: 1800.00,
            stock: 9,
            activo: true,
            atributos: { factorForma: "ATX", maxLongitudGPUMM: 365 }
        },
        {
            sku: "GAB-COR-4000D",
            nombre: "Corsair 4000D Airflow Tempered Glass",
            tipo: "GABINETE",
            precio: 2100.00,
            stock: 14,
            activo: true,
            atributos: { factorForma: "E-ATX", maxLongitudGPUMM: 360 }
        },
        {
            sku: "GAB-LIA-O11",
            nombre: "Lian Li O11 Dynamic EVO",
            tipo: "GABINETE",
            precio: 3100.00,
            stock: 6,
            activo: true,
            atributos: { factorForma: "E-ATX", maxLongitudGPUMM: 426 }
        },
        {
            sku: "ALM-WD-1TB",
            nombre: "WD Black SN850X 1TB NVMe M.2",
            tipo: "ALMACENAMIENTO",
            precio: 1650.00,
            stock: 30,
            activo: true,
            atributos: { tipo: "NVMe", capacidad_tb: 1 }
        },
        {
            sku: "ALM-SAM-2TB",
            nombre: "Samsung 990 PRO 2TB NVMe M.2",
            tipo: "ALMACENAMIENTO",
            precio: 3400.00,
            stock: 12,
            activo: true,
            atributos: { tipo: "NVMe", capacidad_tb: 2 }
        },
        {
            sku: "ALM-CRU-1TB",
            nombre: "Crucial P3 Plus 1TB NVMe M.2",
            tipo: "ALMACENAMIENTO",
            precio: 1100.00,
            stock: 45,
            activo: true,
            atributos: { tipo: "NVMe", capacidad_tb: 1 }
        },
        {
            sku: "ALM-SEA-2TB",
            nombre: "Seagate Barracuda 2TB HDD 7200RPM",
            tipo: "ALMACENAMIENTO",
            precio: 950.00,
            stock: 25,
            activo: true,
            atributos: { tipo: "HDD", capacidad_tb: 2 }
        },
        // ---- MEME COMPONENTS ----
        {
            sku: "CPU-MEME-EPYC",
            nombre: "AMD EPYC 9684X (96 Cores / 192 Threads)",
            tipo: "CPU",
            precio: 250000.00,
            stock: 1,
            activo: true,
            atributos: { socket: "SP5", consumo: 400 }
        },
        {
            sku: "MB-MEME-SP5",
            nombre: "ASUS Pro WS WRX90E-SAGE SE (SP5 Threadripper)",
            tipo: "MOTHERBOARD",
            precio: 65000.00,
            stock: 1,
            activo: true,
            atributos: { socket: "SP5", tipoRAM: "DDR6", consumo: 80 }
        },
        {
            sku: "RAM-MEME-512GB",
            nombre: "G.Skill Galactic 512GB (8×64GB) DDR6 20000MT/s",
            tipo: "RAM",
            precio: 800000.00,
            stock: 1,
            activo: true,
            atributos: { tipo: "DDR6", capacidad_gb: 512, velocidad: 20000, consumo: 120 }
        },
        {
            sku: "GPU-MEME-5090",
            nombre: "NVIDIA GeForce RTX 5090 ULTRA (100GB GDDR7X)",
            tipo: "GPU",
            precio: 500000.00,
            stock: 1,
            activo: true,
            atributos: { vram: "100GB", consumo: 900, longitudMM: 420 }
        },
        {
            sku: "ALM-MEME-100TB",
            nombre: "Samsung 990 PRO RAID 100TB NVMe M.2 (x10 Array)",
            tipo: "ALMACENAMIENTO",
            precio: 350000.00,
            stock: 1,
            activo: true,
            atributos: { tipo: "NVMe RAID", capacidad_tb: 100, consumo: 50 }
        },
        {
            sku: "PSU-MEME-5000W",
            nombre: "Corsair AX5000i 5000W 80 Plus Titanium",
            tipo: "PSU",
            precio: 85000.00,
            stock: 1,
            activo: true,
            atributos: { potenciaW: 5000, consumo: 0 }
        },
        {
            sku: "GAB-MEME-RACK",
            nombre: "Compaq Presario 5000 Beige Tower (1998)",
            tipo: "GABINETE",
            precio: 150.00,
            stock: 1,
            activo: true,
            atributos: { maxLongitudGPUMM: 180, consumo: 0 }
        },
        // ============================================
        // PERIFÉRICOS — Monitores
        // ============================================
        {
            sku: "MON-LG-27GP850",
            nombre: "LG UltraGear 27GP850 27\" QHD 180Hz IPS",
            tipo: "MONITOR",
            precio: 8500.00,
            stock: 11,
            activo: true,
            atributos: { tamanoPulgadas: 27, resolucion: "2560x1440", tasaRefresco: 180, panel: "IPS", conectores: "HDMI 2.1, DisplayPort 1.4" }
        },
        {
            sku: "MON-SAM-G5",
            nombre: "Samsung Odyssey G5 32\" QHD 165Hz VA Curvo",
            tipo: "MONITOR",
            precio: 7200.00,
            stock: 8,
            activo: true,
            atributos: { tamanoPulgadas: 32, resolucion: "2560x1440", tasaRefresco: 165, panel: "VA", conectores: "HDMI, DisplayPort" }
        },
        {
            sku: "MON-AOC-24",
            nombre: "AOC 24G2 24\" FHD 144Hz IPS",
            tipo: "MONITOR",
            precio: 3900.00,
            stock: 20,
            activo: true,
            atributos: { tamanoPulgadas: 24, resolucion: "1920x1080", tasaRefresco: 144, panel: "IPS", conectores: "HDMI, DisplayPort, VGA" }
        },
        {
            sku: "MON-LG-4K27",
            nombre: "LG 27UL500 27\" 4K UHD IPS HDR10",
            tipo: "MONITOR",
            precio: 7800.00,
            stock: 6,
            activo: true,
            atributos: { tamanoPulgadas: 27, resolucion: "3840x2160", tasaRefresco: 60, panel: "IPS", conectores: "HDMI, DisplayPort" }
        },
        // ============================================
        // PERIFÉRICOS — Teclados
        // ============================================
        {
            sku: "TEC-LOG-G-PRO",
            nombre: "Logitech G Pro X Mecánico GX Blue",
            tipo: "TECLADO",
            precio: 2800.00,
            stock: 14,
            activo: true,
            atributos: { tipo: "Mecánico", layout: "Latinoamericano", conexion: "USB", rgb: true }
        },
        {
            sku: "TEC-RED-K552",
            nombre: "Redragon Kumara K552 Mecánico Outemu Red",
            tipo: "TECLADO",
            precio: 950.00,
            stock: 35,
            activo: true,
            atributos: { tipo: "Mecánico", layout: "Latinoamericano", conexion: "USB", rgb: true }
        },
        {
            sku: "TEC-COR-K70",
            nombre: "Corsair K70 RGB PRO Cherry MX Red",
            tipo: "TECLADO",
            precio: 3900.00,
            stock: 7,
            activo: true,
            atributos: { tipo: "Mecánico", layout: "Latinoamericano", conexion: "USB", rgb: true }
        },
        {
            sku: "TEC-LOG-K380",
            nombre: "Logitech K380 Bluetooth Multi-Device",
            tipo: "TECLADO",
            precio: 1100.00,
            stock: 22,
            activo: true,
            atributos: { tipo: "Membrana", layout: "Latinoamericano", conexion: "Bluetooth", rgb: false }
        },
        // ============================================
        // PERIFÉRICOS — Mouses
        // ============================================
        {
            sku: "MOU-LOG-G502",
            nombre: "Logitech G502 HERO 25K DPI",
            tipo: "MOUSE",
            precio: 1350.00,
            stock: 28,
            activo: true,
            atributos: { dpi: 25000, botones: 11, conexion: "USB", rgb: true }
        },
        {
            sku: "MOU-RAZ-DEATH",
            nombre: "Razer DeathAdder V3 Pro Inalámbrico",
            tipo: "MOUSE",
            precio: 3100.00,
            stock: 10,
            activo: true,
            atributos: { dpi: 30000, botones: 5, conexion: "Inalámbrico", rgb: false }
        },
        {
            sku: "MOU-RED-M711",
            nombre: "Redragon Cobra M711 RGB",
            tipo: "MOUSE",
            precio: 420.00,
            stock: 50,
            activo: true,
            atributos: { dpi: 10000, botones: 7, conexion: "USB", rgb: true }
        },
        {
            sku: "MOU-LOG-MX3",
            nombre: "Logitech MX Master 3S Inalámbrico",
            tipo: "MOUSE",
            precio: 2400.00,
            stock: 15,
            activo: true,
            atributos: { dpi: 8000, botones: 7, conexion: "Bluetooth", rgb: false }
        },
        // ============================================
        // PERIFÉRICOS — Audífonos
        // ============================================
        {
            sku: "AUD-HYP-CLOUDII",
            nombre: "HyperX Cloud II Gaming 7.1 Surround",
            tipo: "AUDIFONOS",
            precio: 1900.00,
            stock: 18,
            activo: true,
            atributos: { tipo: "Over-ear", conexion: "USB", microfono: true, surround: "7.1" }
        },
        {
            sku: "AUD-LOG-G733",
            nombre: "Logitech G733 Lightspeed Inalámbrico",
            tipo: "AUDIFONOS",
            precio: 3200.00,
            stock: 9,
            activo: true,
            atributos: { tipo: "Over-ear", conexion: "Inalámbrico", microfono: true, surround: "7.1" }
        },
        {
            sku: "AUD-RED-ZEUS",
            nombre: "Redragon Zeus H510 RGB",
            tipo: "AUDIFONOS",
            precio: 850.00,
            stock: 30,
            activo: true,
            atributos: { tipo: "Over-ear", conexion: "USB", microfono: true, surround: "7.1" }
        },
        {
            sku: "AUD-SON-WH1000",
            nombre: "Sony WH-1000XM5 Bluetooth Noise Cancelling",
            tipo: "AUDIFONOS",
            precio: 7900.00,
            stock: 5,
            activo: true,
            atributos: { tipo: "Over-ear", conexion: "Bluetooth", microfono: true, surround: "Estéreo" }
        },

        // ====== Variedad adicional de componentes de PC (2026-05) ======
        // CPU
        { sku: "CPU-AMD-9600X", nombre: "AMD Ryzen 5 9600X", tipo: "CPU", precio: 4900.00, stock: 14, activo: true,
          atributos: { socket: "AM5", consumo: 65 } },
        { sku: "CPU-AMD-9950X", nombre: "AMD Ryzen 9 9950X", tipo: "CPU", precio: 13800.00, stock: 6, activo: true,
          atributos: { socket: "AM5", consumo: 170 } },
        { sku: "CPU-INT-14100", nombre: "Intel Core i3-14100", tipo: "CPU", precio: 2700.00, stock: 25, activo: true,
          atributos: { socket: "LGA1700", consumo: 60 } },
        { sku: "CPU-INT-13600K", nombre: "Intel Core i5-13600K", tipo: "CPU", precio: 5200.00, stock: 10, activo: true,
          atributos: { socket: "LGA1700", consumo: 125 } },

        // GPU
        { sku: "GPU-AMD-7800XT", nombre: "AMD Radeon RX 7800 XT", tipo: "GPU", precio: 9400.00, stock: 8, activo: true,
          atributos: { vram: "16GB", consumo: 263, longitudMM: 287 } },
        { sku: "GPU-AMD-7900XTX", nombre: "AMD Radeon RX 7900 XTX", tipo: "GPU", precio: 17600.00, stock: 4, activo: true,
          atributos: { vram: "24GB", consumo: 355, longitudMM: 287 } },
        { sku: "GPU-NV-4070S", nombre: "NVIDIA GeForce RTX 4070 SUPER", tipo: "GPU", precio: 12900.00, stock: 7, activo: true,
          atributos: { vram: "12GB", consumo: 220, longitudMM: 304 } },
        { sku: "GPU-NV-4090", nombre: "NVIDIA GeForce RTX 4090", tipo: "GPU", precio: 32500.00, stock: 2, activo: true,
          atributos: { vram: "24GB", consumo: 450, longitudMM: 336 } },
        { sku: "GPU-NV-5090", nombre: "NVIDIA GeForce RTX 5090 (retail)", tipo: "GPU", precio: 38900.00, stock: 1, activo: true,
          atributos: { vram: "32GB", consumo: 575, longitudMM: 358 } },

        // RAM
        { sku: "RAM-COR-32GB-5200", nombre: "Corsair Vengeance 32GB DDR5-5200", tipo: "RAM", precio: 2300.00, stock: 22, activo: true,
          atributos: { tipo: "DDR5", velocidad: 5200, capacidad_gb: 32 } },
        { sku: "RAM-GSK-64GB-6000", nombre: "G.Skill Trident Z5 64GB DDR5-6000", tipo: "RAM", precio: 5900.00, stock: 8, activo: true,
          atributos: { tipo: "DDR5", velocidad: 6000, capacidad_gb: 64 } },
        { sku: "RAM-KIN-32GB-3600", nombre: "Kingston Fury 32GB DDR4-3600", tipo: "RAM", precio: 2100.00, stock: 18, activo: true,
          atributos: { tipo: "DDR4", velocidad: 3600, capacidad_gb: 32 } },
        { sku: "RAM-COR-16GB-6000", nombre: "Corsair Vengeance 16GB DDR5-6000", tipo: "RAM", precio: 1500.00, stock: 30, activo: true,
          atributos: { tipo: "DDR5", velocidad: 6000, capacidad_gb: 16 } },

        // MOTHERBOARD
        { sku: "MB-MSI-B650M", nombre: "MSI PRO B650M-A WiFi", tipo: "MOTHERBOARD", precio: 3700.00, stock: 12, activo: true,
          atributos: { socket: "AM5", tipoRAM: "DDR5", formato: "Micro-ATX" } },
        { sku: "MB-ASUS-X670E", nombre: "ASUS ROG STRIX X670E-E", tipo: "MOTHERBOARD", precio: 9800.00, stock: 4, activo: true,
          atributos: { socket: "AM5", tipoRAM: "DDR5", formato: "ATX" } },
        { sku: "MB-GIG-B760", nombre: "Gigabyte B760M DS3H", tipo: "MOTHERBOARD", precio: 2700.00, stock: 16, activo: true,
          atributos: { socket: "LGA1700", tipoRAM: "DDR4", formato: "Micro-ATX" } },
        { sku: "MB-ASUS-Z790E", nombre: "ASUS ROG STRIX Z790-E Gaming", tipo: "MOTHERBOARD", precio: 9100.00, stock: 5, activo: true,
          atributos: { socket: "LGA1700", tipoRAM: "DDR5", formato: "ATX" } },

        // PSU
        { sku: "PSU-COR-550", nombre: "Corsair CV550 Bronze 550W", tipo: "PSU", precio: 1100.00, stock: 20, activo: true,
          atributos: { potenciaW: 550, certificacion: "Bronze" } },
        { sku: "PSU-EVG-750G", nombre: "EVGA SuperNOVA 750W Gold Modular", tipo: "PSU", precio: 2400.00, stock: 11, activo: true,
          atributos: { potenciaW: 750, certificacion: "Gold" } },
        { sku: "PSU-SEA-1000P", nombre: "Seasonic Prime PX 1000W Platinum", tipo: "PSU", precio: 4500.00, stock: 4, activo: true,
          atributos: { potenciaW: 1000, certificacion: "Platinum" } },

        // GABINETE
        { sku: "GAB-COO-Q300L", nombre: "Cooler Master MasterBox Q300L (Mid-Tower budget)", tipo: "GABINETE", precio: 1100.00, stock: 18, activo: true,
          atributos: { factorForma: "Micro-ATX", maxLongitudGPUMM: 360 } },
        { sku: "GAB-FRA-DEFINE7", nombre: "Fractal Design Define 7 (Full-Tower premium)", tipo: "GABINETE", precio: 4200.00, stock: 4, activo: true,
          atributos: { factorForma: "E-ATX", maxLongitudGPUMM: 491 } },
        { sku: "GAB-NZX-H1V2", nombre: "NZXT H1 v2 (ITX compacto)", tipo: "GABINETE", precio: 3900.00, stock: 3, activo: true,
          atributos: { factorForma: "Mini-ITX", maxLongitudGPUMM: 324 } },

        // ALMACENAMIENTO
        { sku: "ALM-WD-SATA-1TB", nombre: "WD Blue SSD SATA 1TB", tipo: "ALMACENAMIENTO", precio: 1100.00, stock: 25, activo: true,
          atributos: { tipo: "SATA SSD", capacidad_tb: 1 } },
        { sku: "ALM-SAM-990PRO-2TB", nombre: "Samsung 990 PRO NVMe Gen5 2TB", tipo: "ALMACENAMIENTO", precio: 3300.00, stock: 9, activo: true,
          atributos: { tipo: "NVMe", capacidad_tb: 2 } },
        { sku: "ALM-SEA-HDD-4TB", nombre: "Seagate Barracuda HDD 4TB", tipo: "ALMACENAMIENTO", precio: 1300.00, stock: 14, activo: true,
          atributos: { tipo: "HDD", capacidad_tb: 4 } },

        // ====== Nuevos tipos de periféricos (2026-05) ======
        // SILLA
        { sku: "SIL-DXR-OH-K99", nombre: "DXRacer OH/K99 Gamer Básica", tipo: "SILLA", precio: 4200.00, stock: 8, activo: true,
          atributos: { tipo: "Gamer", material: "Tela", pesoMaxKg: 120, reposacabezas: true, apoyabrazos: "2D", reclinable: true } },
        { sku: "SIL-SEC-TITAN", nombre: "Secretlab Titan Evo Premium", tipo: "SILLA", precio: 11900.00, stock: 4, activo: true,
          atributos: { tipo: "Gamer", material: "Piel", pesoMaxKg: 130, reposacabezas: true, apoyabrazos: "4D", reclinable: true } },
        { sku: "SIL-HER-AERON", nombre: "Herman Miller Aeron Ergonómica", tipo: "SILLA", precio: 23500.00, stock: 2, activo: true,
          atributos: { tipo: "Ergonómica", material: "Mesh", pesoMaxKg: 159, reposacabezas: false, apoyabrazos: "4D", reclinable: true } },
        { sku: "SIL-COR-T3", nombre: "Corsair T3 RUSH Racing Edition", tipo: "SILLA", precio: 6800.00, stock: 6, activo: true,
          atributos: { tipo: "Racing", material: "Tela", pesoMaxKg: 120, reposacabezas: true, apoyabrazos: "3D", reclinable: true } },

        // MOUSEPAD
        { sku: "MPD-LOG-G240", nombre: "Logitech G240 Cloth Standard", tipo: "MOUSEPAD", precio: 320.00, stock: 40, activo: true,
          atributos: { tamano: "Standard", largoMM: 280, anchoMM: 340, material: "Tela", rgb: false } },
        { sku: "MPD-COR-MM700", nombre: "Corsair MM700 RGB Extended XL", tipo: "MOUSEPAD", precio: 1300.00, stock: 15, activo: true,
          atributos: { tamano: "XL", largoMM: 930, anchoMM: 400, material: "Tela", rgb: true } },
        { sku: "MPD-SS-QCK-XXL", nombre: "SteelSeries QcK XXL", tipo: "MOUSEPAD", precio: 850.00, stock: 22, activo: true,
          atributos: { tamano: "XXL", largoMM: 900, anchoMM: 400, material: "Tela", rgb: false } },

        // WEBCAM
        { sku: "CAM-LOG-C270", nombre: "Logitech C270 HD 720p", tipo: "WEBCAM", precio: 650.00, stock: 30, activo: true,
          atributos: { resolucion: "720p", fps: 30, microfonoIntegrado: true, enfoqueAutomatico: false, conexion: "USB-A" } },
        { sku: "CAM-LOG-C920", nombre: "Logitech C920 Pro 1080p", tipo: "WEBCAM", precio: 1500.00, stock: 18, activo: true,
          atributos: { resolucion: "1080p", fps: 30, microfonoIntegrado: true, enfoqueAutomatico: true, conexion: "USB-A" } },
        { sku: "CAM-LOG-BRIO4K", nombre: "Logitech Brio 4K Streaming", tipo: "WEBCAM", precio: 4200.00, stock: 6, activo: true,
          atributos: { resolucion: "4K", fps: 30, microfonoIntegrado: true, enfoqueAutomatico: true, conexion: "USB-C" } },

        // MICROFONO
        { sku: "MIC-BLU-YETI", nombre: "Blue Yeti USB Cardioide", tipo: "MICROFONO", precio: 2700.00, stock: 12, activo: true,
          atributos: { tipo: "USB cardioide", patronPolar: "Multipatrón", frecuenciaMuestreoKHz: 48, incluyeTripode: true } },
        { sku: "MIC-RDE-NTUSB", nombre: "Rode NT-USB Condensador", tipo: "MICROFONO", precio: 4900.00, stock: 5, activo: true,
          atributos: { tipo: "Condensador XLR", patronPolar: "Cardioide", frecuenciaMuestreoKHz: 48, incluyeTripode: true } },
        { sku: "MIC-RDE-LAV", nombre: "Rode Lavalier GO", tipo: "MICROFONO", precio: 1800.00, stock: 9, activo: true,
          atributos: { tipo: "Lavalier", patronPolar: "Omnidireccional", frecuenciaMuestreoKHz: 44.1, incluyeTripode: false } },

        // BOCINAS
        { sku: "BOC-LOG-Z200", nombre: "Logitech Z200 2.0 Escritorio", tipo: "BOCINAS", precio: 750.00, stock: 28, activo: true,
          atributos: { configuracion: "2.0", potenciaW: 10, conexion: "3.5mm", subwoofer: false } },
        { sku: "BOC-LOG-Z313", nombre: "Logitech Z313 2.1 con Subwoofer", tipo: "BOCINAS", precio: 1200.00, stock: 16, activo: true,
          atributos: { configuracion: "2.1", potenciaW: 25, conexion: "3.5mm", subwoofer: true } },
        { sku: "BOC-CRE-STAGE", nombre: "Creative Stage V2 Soundbar", tipo: "BOCINAS", precio: 2200.00, stock: 7, activo: true,
          atributos: { configuracion: "Soundbar", potenciaW: 80, conexion: "Bluetooth", subwoofer: true } }
    ];

    for (const componente of componentes) {
        await prisma.componente.create({
            data: componente
        });
    }

    // ---- Pre-built PC Configurations ----
    console.log('Seeding pre-built PCs...');

    // Delete existing pre-built configs
    await prisma.configuracionComponente.deleteMany({});
    await prisma.configuracion.deleteMany({ where: { esPrearmada: true } });

    // Helper to find component by SKU
    const findBySku = async (sku: string) => {
        const comp = await prisma.componente.findUnique({ where: { sku } });
        if (!comp) throw new Error(`Component ${sku} not found`);
        return comp;
    };

    // Pre-built 1: Budget Gaming
    const budgetParts = await Promise.all([
        findBySku('CPU-AMD-7600X'),
        findBySku('MB-ASUS-B650'),
        findBySku('RAM-KIN-32GB-5600'),
        findBySku('GPU-AMD-7600'),
        findBySku('ALM-CRU-1TB'),
        findBySku('PSU-EVG-650'),
        findBySku('GAB-NZXT-H5'),
    ]);
    const budgetTotal = budgetParts.reduce((s, c) => s + c.precio, 0);
    const budgetConsumo = budgetParts.filter(c => c.tipo !== 'PSU' && c.tipo !== 'GABINETE')
        .reduce((s, c) => s + (typeof (c.atributos as any).consumo === 'number' ? (c.atributos as any).consumo : 0), 0);

    await prisma.configuracion.create({
        data: {
            nombre: 'Budget Gamer — Entry Level',
            esPrearmada: true,
            categoria: 'Gaming',
            descripcion: 'PC perfecta para iniciar en el gaming a 1080p. Corre Fortnite, Valorant y CS2 sin problemas. Ideal para presupuestos ajustados sin sacrificar rendimiento.',
            destacada: false,
            precioTotal: budgetTotal,
            consumoEstimado: budgetConsumo,
            componentes: {
                create: budgetParts.map(c => ({ componenteId: c.id })),
            },
        },
    });

    // Pre-built 2: Gaming Pro
    const proParts = await Promise.all([
        findBySku('CPU-AMD-9700X'),
        findBySku('MB-ASUS-B650'),
        findBySku('RAM-GSK-32GB-6400'),
        findBySku('GPU-NV-5070'),
        findBySku('ALM-WD-1TB'),
        findBySku('PSU-COR-850'),
        findBySku('GAB-COR-4000D'),
    ]);
    const proTotal = proParts.reduce((s, c) => s + c.precio, 0);
    const proConsumo = proParts.filter(c => c.tipo !== 'PSU' && c.tipo !== 'GABINETE')
        .reduce((s, c) => s + (typeof (c.atributos as any).consumo === 'number' ? (c.atributos as any).consumo : 0), 0);

    await prisma.configuracion.create({
        data: {
            nombre: 'Gaming Pro — 1440p Monster',
            esPrearmada: true,
            categoria: 'Gaming',
            descripcion: 'Domina cualquier juego a 1440p con máximos detalles. RTX 5070 + Ryzen 7 9700X, la combinación perfecta para gaming competitivo y AAA.',
            destacada: true,
            precioTotal: proTotal,
            consumoEstimado: proConsumo,
            componentes: {
                create: proParts.map(c => ({ componenteId: c.id })),
            },
        },
    });

    // Pre-built 3: Enthusiast
    const enthParts = await Promise.all([
        findBySku('CPU-AMD-7950X3D'),
        findBySku('MB-GIG-X670E'),
        findBySku('RAM-COR-64GB-6000'),
        findBySku('GPU-NV-5080'),
        findBySku('ALM-SAM-2TB'),
        findBySku('PSU-SEA-1000'),
        findBySku('GAB-LIA-O11'),
    ]);
    const enthTotal = enthParts.reduce((s, c) => s + c.precio, 0);
    const enthConsumo = enthParts.filter(c => c.tipo !== 'PSU' && c.tipo !== 'GABINETE')
        .reduce((s, c) => s + (typeof (c.atributos as any).consumo === 'number' ? (c.atributos as any).consumo : 0), 0);

    await prisma.configuracion.create({
        data: {
            nombre: 'Enthusiast — Sin Compromiso',
            esPrearmada: true,
            categoria: 'Gaming',
            descripcion: 'La build definitiva. RTX 5080 + Ryzen 9 7950X3D con 64GB RAM y 2TB NVMe. Para quienes quieren lo mejor de lo mejor, sin importar el presupuesto.',
            destacada: true,
            precioTotal: enthTotal,
            consumoEstimado: enthConsumo,
            componentes: {
                create: enthParts.map(c => ({ componenteId: c.id })),
            },
        },
    });

    // Pre-built 4: Workstation
    const wsParts = await Promise.all([
        findBySku('CPU-INT-14700K'),
        findBySku('MB-MSI-Z790'),
        findBySku('RAM-COR-64GB-6000'),
        findBySku('GPU-NV-4070TIS'),
        findBySku('ALM-SAM-2TB'),
        findBySku('PSU-COR-850'),
        findBySku('GAB-COR-4000D'),
    ]);
    const wsTotal = wsParts.reduce((s, c) => s + c.precio, 0);
    const wsConsumo = wsParts.filter(c => c.tipo !== 'PSU' && c.tipo !== 'GABINETE')
        .reduce((s, c) => s + (typeof (c.atributos as any).consumo === 'number' ? (c.atributos as any).consumo : 0), 0);

    await prisma.configuracion.create({
        data: {
            nombre: 'Workstation — Creador de Contenido',
            esPrearmada: true,
            categoria: 'Workstation',
            descripcion: 'Diseñada para edición de video 4K, renderizado 3D y streaming. Intel i7-14700K con 64GB RAM y RTX 4070 Ti SUPER para máximo rendimiento creativo.',
            destacada: false,
            precioTotal: wsTotal,
            consumoEstimado: wsConsumo,
            componentes: {
                create: wsParts.map(c => ({ componenteId: c.id })),
            },
        },
    });

    // Pre-built 5: MEME — SKYNET MASTER
    const memeParts = await Promise.all([
        findBySku('CPU-MEME-EPYC'),
        findBySku('MB-MEME-SP5'),
        findBySku('RAM-MEME-512GB'),
        findBySku('GPU-MEME-5090'),
        findBySku('ALM-MEME-100TB'),
        findBySku('PSU-MEME-5000W'),
        findBySku('GAB-MEME-RACK'),
    ]);
    const memeTotal = memeParts.reduce((s, c) => s + c.precio, 0);
    const memeConsumo = memeParts.filter(c => c.tipo !== 'PSU' && c.tipo !== 'GABINETE')
        .reduce((s, c) => s + (typeof (c.atributos as any).consumo === 'number' ? (c.atributos as any).consumo : 0), 0);

    await prisma.configuracion.create({
        data: {
            nombre: 'SKYNET MASTER — La PC de Dios',
            esPrearmada: true,
            categoria: 'Gaming',
            descripcion: '¿Quieres correr Crysis? ¿A 16K? ¿En 3 monitores? ¿Mientras entrenas una IA que predice el futuro? Esta es tu PC. EPYC 96 cores, 512GB DDR6, RTX 5090 100GB, 100TB RAID. Tu factura de luz te va a llorar. 💀🔥',
            destacada: true,
            precioTotal: memeTotal,
            consumoEstimado: memeConsumo,
            imagenUrl: '/meme-skynet.png',
            componentes: {
                create: memeParts.map(c => ({ componenteId: c.id })),
            },
        },
    });

    console.log('Seed completed: components + pre-built PCs + SKYNET MASTER 💀');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });