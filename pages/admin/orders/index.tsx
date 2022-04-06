import { ConfirmationNumberOutlined } from "@mui/icons-material"
import { Grid, Chip } from "@mui/material"
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid"
import AdminLayout from "../../../components/layouts/AdminLayout"
import useSWR from "swr"
import { OrderType } from "../../../interfaces/order"
import { UserType } from "../../../interfaces/user"

const columns: GridColDef[] = [
  { field: "id", headerName: "Order ID", width: 250 },
  { field: "email", headerName: "Correo", width: 250 },
  { field: "name", headerName: "Nombre completo", width: 250 },
  { field: "total", headerName: "Total" },
  {
    field: "isPaid",
    headerName: "Pagada",
    renderCell: ({ row }: GridValueGetterParams) => {
      return row.isPaid ? (
        <Chip variant="outlined" label="pagada" color="success" />
      ) : (
        <Chip variant="outlined" label="Pendiente" color="error" />
      )
    },
  },
  {
    field: "noProducts",
    headerName: "No.Productos",
    align: "center",
    width: 150,
  },
  {
    field: "check",
    headerName: "Ver orden",
    renderCell: ({ row }: GridValueGetterParams) => {
      return (
        <a href={`/admin/orders/${row.id}`} target="_blank" rel="noreferrer">
          Ver Orden
        </a>
      )
    },
  },
  { field: "createdAt", headerName: "Creada en", width: 200 },
]

export default function OrdersPage() {
  const { data, error } = useSWR<OrderType[]>("/api/admin/orders")

  if (!data && !error) return <></>

  const rows = data!.map((order) => ({
    id: order._id,
    email: (order.user as UserType).email,
    name: (order.user as UserType).name,
    total: order.total,
    isPaid: order.isPaid,
    noProducts: order.numbersOfItems,
    createdAt: order.createdAt,
  }))
  return (
    <AdminLayout
      title={"Orders"}
      subtitle={"Mantenimiento de orders"}
      icon={<ConfirmationNumberOutlined />}
    >
      <Grid container className="fadeIn">
        <Grid
          item
          xs={12}
          sx={{
            height: 650,
            width: "100%",
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 20, 50, 100]}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  )
}
