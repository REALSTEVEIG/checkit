export class Order {
  id!: number;
  description!: string;
  specifications!: string;
  quantity!: number;
  status!: 'Review' | 'Processing' | 'Completed';
  userId!: number;
}
