import { Box, CircularProgress, Typography } from "@mui/material"

type Props = {}

const FullScreenLoading = (props: Props) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="calc(100vh - 200px)"
    >
      <Typography sx={{ mb: 3 }} variant="h2" fontWeight={200} fontSize={30}>
        Cargando
      </Typography>
      <CircularProgress thickness={2} size={80} />
    </Box>
  )
}

export default FullScreenLoading
