import { CreditCardOffOutlined } from "@mui/icons-material"
import { Card, CardContent, Grid, Typography } from "@mui/material"
import { ReactNode } from "react"

type Props = {
  title: string | number
  subtitle: string
  icon?: ReactNode
}

const SummaryTitle = ({ icon, title, subtitle }: Props) => {
  return (
    <Grid item xs={12} sm={4} md={3}>
      <Card sx={{ display: "flex" }}>
        <CardContent
          sx={{
            width: 50,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* <CreditCardOffOutlined color="secondary" sx={{ fontSize: 40 }} /> */}
          {icon}
        </CardContent>
        <CardContent
          sx={{
            flex: "1 0 auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h3">{title}</Typography>
          <Typography variant="caption">{subtitle}</Typography>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default SummaryTitle
