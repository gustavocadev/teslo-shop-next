import { Chip, Grid, Link, Typography } from "@mui/material"
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid"
import ShopLayout from "../../components/layouts/ShopLayout"
import NextLink from "next/link"
import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import { getOrdersByUser } from "../../database/dbOrders"
import { OrderType } from "../../interfaces"
const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    width: 100,
  },
  {
    field: "fullName",
    headerName: "Nombre completo",
    width: 300,
  },

  {
    field: "paid",
    headerName: "Pagada",
    description: "Muestra información si está pagada la orden o no",
    sortable: false,
    width: 200,
    renderCell: ({ row }: GridValueGetterParams) => {
      return row.paid ? (
        <Chip label="Pagada" color="success" variant="outlined" />
      ) : (
        <Chip label="No pagada" color="error" variant="outlined" />
      )
    },
  },
  {
    field: "order",
    headerName: "Orden",
    width: 200,
    sortable: false,
    renderCell: ({ row }: GridValueGetterParams) => {
      return (
        <NextLink href={`/orders/${row._id}`} passHref>
          <Link underline="always">Ver detalles</Link>
        </NextLink>
      )
    },
  },
]

type Props = {
  orders: OrderType[]
}

export default function HistoryPage({ orders }: Props) {
  const rows = orders.map((order, idx) => ({
    _id: order._id,
    id: idx + 1,
    fullName: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
    paid: order.isPaid,
  }))
  return (
    <ShopLayout
      title="Historial de ordenes"
      pageDescription="Historial de ordenes del cliente"
    >
      <Typography variant="h1" component="h1">
        Historial de ordenes
      </Typography>

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
    </ShopLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session: any = await getSession({ req })

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?page=/orders/history`,
        permanent: false,
      },
    }
  }

  const orders = await getOrdersByUser(session.user._id)

  return {
    props: {
      orders,
    },
  }
}
