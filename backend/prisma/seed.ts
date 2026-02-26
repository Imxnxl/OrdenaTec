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
            atributos: { socket: "AM5", tdp: 65 }
        },
        {
            sku: "CPU-AMD-7600X",
            nombre: "AMD Ryzen 5 7600X",
            tipo: "CPU",
            precio: 4200.00,
            stock: 18,
            activo: true,
            atributos: { socket: "AM5", tdp: 105 }
        },
        {
            sku: "CPU-AMD-7950X3D",
            nombre: "AMD Ryzen 9 7950X3D",
            tipo: "CPU",
            precio: 12500.00,
            stock: 3,
            activo: true,
            atributos: { socket: "AM5", tdp: 120 }
        },
        {
            sku: "CPU-INT-14600K",
            nombre: "Intel Core i5-14600K",
            tipo: "CPU",
            precio: 5800.00,
            stock: 5,
            activo: true,
            atributos: { socket: "LGA1700", tdp: 125 }
        },
        {
            sku: "CPU-INT-14700K",
            nombre: "Intel Core i7-14700K",
            tipo: "CPU",
            precio: 7900.00,
            stock: 8,
            activo: true,
            atributos: { socket: "LGA1700", tdp: 125 }
        },
        {
            sku: "CPU-INT-14900K",
            nombre: "Intel Core i9-14900K",
            tipo: "CPU",
            precio: 11200.00,
            stock: 4,
            activo: true,
            atributos: { socket: "LGA1700", tdp: 125 }
        },
        {
            sku: "GPU-NV-5070",
            nombre: "NVIDIA GeForce RTX 5070",
            tipo: "GPU",
            precio: 11500.00,
            stock: 4,
            activo: true,
            atributos: { vram: "12GB", consumo: 250, longitud_mm: 280 }
        },
        {
            sku: "GPU-NV-5080",
            nombre: "NVIDIA GeForce RTX 5080",
            tipo: "GPU",
            precio: 19500.00,
            stock: 2,
            activo: true,
            atributos: { vram: "16GB", consumo: 320, longitud_mm: 310 }
        },
        {
            sku: "GPU-NV-4060",
            nombre: "NVIDIA GeForce RTX 4060",
            tipo: "GPU",
            precio: 5800.00,
            stock: 22,
            activo: true,
            atributos: { vram: "8GB", consumo: 115, longitud_mm: 240 }
        },
        {
            sku: "GPU-NV-4070TIS",
            nombre: "NVIDIA GeForce RTX 4070 Ti SUPER",
            tipo: "GPU",
            precio: 15800.00,
            stock: 6,
            activo: true,
            atributos: { vram: "16GB", consumo: 285, longitud_mm: 305 }
        },
        {
            sku: "GPU-AMD-7600",
            nombre: "AMD Radeon RX 7600",
            tipo: "GPU",
            precio: 5200.00,
            stock: 15,
            activo: true,
            atributos: { vram: "8GB", consumo: 165, longitud_mm: 240 }
        },
        {
            sku: "GPU-AMD-7800XT",
            nombre: "AMD Radeon RX 7800 XT",
            tipo: "GPU",
            precio: 9800.00,
            stock: 8,
            activo: true,
            atributos: { vram: "16GB", consumo: 263, longitud_mm: 320 }
        },
        {
            sku: "GPU-AMD-7900XTX",
            nombre: "AMD Radeon RX 7900 XTX",
            tipo: "GPU",
            precio: 18500.00,
            stock: 3,
            activo: true,
            atributos: { vram: "24GB", consumo: 355, longitud_mm: 344 }
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
            atributos: { socket: "AM5", ram_tipo: "DDR5", formato: "ATX" }
        },
        {
            sku: "MB-GIG-X670E",
            nombre: "Gigabyte X670E AORUS MASTER",
            tipo: "MOTHERBOARD",
            precio: 8500.00,
            stock: 4,
            activo: true,
            atributos: { socket: "AM5", ram_tipo: "DDR5", formato: "E-ATX" }
        },
        {
            sku: "MB-ASUS-B760",
            nombre: "ASUS TUF Gaming B760-PLUS WiFi D4",
            tipo: "MOTHERBOARD",
            precio: 3200.00,
            stock: 12,
            activo: true,
            atributos: { socket: "LGA1700", ram_tipo: "DDR4", formato: "ATX" }
        },
        {
            sku: "MB-MSI-Z790",
            nombre: "MSI PRO Z790-P WiFi",
            tipo: "MOTHERBOARD",
            precio: 3900.00,
            stock: 10,
            activo: true,
            atributos: { socket: "LGA1700", ram_tipo: "DDR5", formato: "ATX" }
        },
        {
            sku: "PSU-COR-850",
            nombre: "Corsair RM850x 850W 80 Plus Gold",
            tipo: "PSU",
            precio: 2400.00,
            stock: 15,
            activo: true,
            atributos: { watts: 850, certificacion: "Gold" }
        },
        {
            sku: "PSU-SEA-1000",
            nombre: "Seasonic Focus GX-1000 1000W 80 Plus Gold",
            tipo: "PSU",
            precio: 3200.00,
            stock: 8,
            activo: true,
            atributos: { watts: 1000, certificacion: "Gold" }
        },
        {
            sku: "PSU-EVG-650",
            nombre: "EVGA SuperNOVA 650 G6 650W 80 Plus Gold",
            tipo: "PSU",
            precio: 1800.00,
            stock: 20,
            activo: true,
            atributos: { watts: 650, certificacion: "Gold" }
        },
        {
            sku: "GAB-NZXT-H5",
            nombre: "NZXT H5 Flow Compact ATX",
            tipo: "GABINETE",
            precio: 1800.00,
            stock: 9,
            activo: true,
            atributos: { formato_max: "ATX", gpu_max_mm: 365 }
        },
        {
            sku: "GAB-COR-4000D",
            nombre: "Corsair 4000D Airflow Tempered Glass",
            tipo: "GABINETE",
            precio: 2100.00,
            stock: 14,
            activo: true,
            atributos: { formato_max: "E-ATX", gpu_max_mm: 360 }
        },
        {
            sku: "GAB-LIA-O11",
            nombre: "Lian Li O11 Dynamic EVO",
            tipo: "GABINETE",
            precio: 3100.00,
            stock: 6,
            activo: true,
            atributos: { formato_max: "E-ATX", gpu_max_mm: 426 }
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
        }
    ];

    for (const componente of componentes) {
        await prisma.componente.create({
            data: componente
        });
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });