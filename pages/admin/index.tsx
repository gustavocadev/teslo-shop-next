import {
  AccessTimeOutlined,
  AttachmentOutlined,
  AttachMoneyOutlined,
  CancelPresentationOutlined,
  CategoryOutlined,
  CreditCardOffOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  GroupOutlined,
  ProductionQuantityLimitsOutlined,
} from "@mui/icons-material"
import { Grid, Typography } from "@mui/material"
import { SummaryTitle } from "../../components/admin"
import AdminLayout from "../../components/layouts/AdminLayout"
import useSWR from "swr"
import { DashboardSummaryResponse } from "../../interfaces"
import { useEffect, useState } from "react"
export default function DashboardPage() {
  const { data, error } = useSWR<DashboardSummaryResponse>(
    "/api/admin/dashboard",
    {
      refreshInterval: 30 * 1000, // 30 seconds
    }
  )
  const [refreshIn, setRefreshIn] = useState(30)

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("tick")
      setRefreshIn((refreshIn) => (refreshIn > 0 ? refreshIn - 1 : 30))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!error && !data) {
    return <></>
  }
  if (error) {
    console.log(error)
    return <Typography>Error al cargar la información</Typography>
  }

  const {
    notPaidOrders,
    numberOfOrders,
    paidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory,
  } = data!

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Estadisticas generales"
      icon={<DashboardOutlined />}
    >
      <Grid container spacing={2}>
        <SummaryTitle
          title={numberOfOrders}
          subtitle="Ordenes totales"
          icon={<CreditCardOutlined color="secondary" sx={{ fontSize: 40 }} />}
        />
        <SummaryTitle
          title={paidOrders}
          subtitle="Ordenes Pagadas"
          icon={<AttachMoneyOutlined color="success" />}
        />
        <SummaryTitle
          title={notPaidOrders}
          subtitle="Ordenes pendientes"
          icon={<CreditCardOffOutlined color="error" sx={{ fontSize: 40 }} />}
        />
        <SummaryTitle
          title={numberOfClients}
          subtitle="Clientes"
          icon={<GroupOutlined color="primary" sx={{ fontSize: 40 }} />}
        />
        <SummaryTitle
          title={numberOfProducts}
          subtitle="Productos"
          icon={<CategoryOutlined color="warning" sx={{ fontSize: 40 }} />}
        />
        <SummaryTitle
          title={productsWithNoInventory}
          subtitle="Productos sin existencias"
          icon={
            <CancelPresentationOutlined color="error" sx={{ fontSize: 40 }} />
          }
        />
        <SummaryTitle
          title={lowInventory}
          subtitle="Productos sin existencias bajo inventario"
          icon={
            <ProductionQuantityLimitsOutlined
              color="warning"
              sx={{ fontSize: 40 }}
            />
          }
        />
        <SummaryTitle
          title={refreshIn}
          subtitle="Actualización en: "
          icon={<AccessTimeOutlined color="secondary" sx={{ fontSize: 40 }} />}
        />
      </Grid>
    </AdminLayout>
  )
}
