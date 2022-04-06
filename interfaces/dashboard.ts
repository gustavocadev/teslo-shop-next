export interface DashboardSummaryResponse {
  notPaidOrders: number
  numberOfOrders: number
  paidOrders: number
  numberOfClients: number
  numberOfProducts: number
  productsWithNoInventory: number
  lowInventory: number
}
