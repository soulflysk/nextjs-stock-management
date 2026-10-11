export type Product = {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
  updatedAt: string;
};
export const products: Product[] = [
  {
    id: "1",
    sku: "SKU-1001",
    name: "Wireless Mouse",
    category: "Accessories",
    price: 590,
    stock: 42,
    minStock: 10,
    updatedAt: "2026-10-05",
  },
  {
    id: "2",
    sku: "SKU-1002",
    name: "Mechanical Keyboard",
    category: "Accessories",
    price: 1890,
    stock: 8,
    minStock: 10,
    updatedAt: "2026-10-05",
  },
  {
    id: "3",
    sku: "SKU-1003",
    name: "USB-C Hub",
    category: "Accessories",
    price: 990,
    stock: 25,
    minStock: 8,
    updatedAt: "2026-10-04",
  },
  {
    id: "4",
    sku: "SKU-1004",
    name: "27-inch Monitor",
    category: "Display",
    price: 7490,
    stock: 4,
    minStock: 5,
    updatedAt: "2026-10-03",
  },
  {
    id: "5",
    sku: "SKU-1005",
    name: "Webcam Full HD",
    category: "Camera",
    price: 1590,
    stock: 18,
    minStock: 5,
    updatedAt: "2026-10-02",
  },
];
