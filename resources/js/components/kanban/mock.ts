import { Columns } from "./types";

export const initialKanbanData: Columns = {
  "prospecting": {
    id: "prospecting",
    name: "Prospecting",
    items: [
      {
        id: 1,
        transactionCode: "TRX001",
        columnId: "prospecting",
        productId: "P001",
        contactId: "C001",
        currentPrice: 50000,
        quantity: 2,
        grandTotal: 100000,
        createdAt: "2025-06-11T08:00:00Z",
        updatedAt: "2025-06-11T08:00:00Z",
        deletedAt: null,
      },
    ],
  },
  "contacting": {
    id: "contacting",
    name: "Processing",
    items: [],
  },
  "completed": {
    id: "completed",
    name: "Completed",
    items: [],
  },
};
