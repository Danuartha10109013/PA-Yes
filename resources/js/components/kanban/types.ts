export interface KanbanTask {
  id: number;
  transactionCode: string;
  columnId: string;
  productId: string;
  contactId: string;
  currentPrice: number;
  quantity: number;
  grandTotal: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Column {
  id: string;
  name: string;
  items: KanbanTask[];
}

export interface Columns {
  [key: string]: Column;
}
