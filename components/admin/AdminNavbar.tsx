import { AppBar, Button, Link, Toolbar, Typography } from "@mui/material"
import { Box } from "@mui/system"
import NextLink from "next/link"
import { useContext } from "react"
import { UIContext } from "../../context/ui/UIContext"

const AdminNavbar = () => {
  const { toggleSideMenu } = useContext(UIContext)

  return (
    <AppBar>
      <Toolbar>
        <NextLink href="/" passHref>
          <Link display="flex" alignItems="center">
            <Typography variant="h6">Testo |</Typography>
            <Typography sx={{ ml: 0.5 }}>Shop</Typography>
          </Link>
        </NextLink>

        <Box flex="1" />

        <Button onClick={toggleSideMenu}>Menú</Button>
      </Toolbar>
    </AppBar>
  )
}

export default AdminNavbar
