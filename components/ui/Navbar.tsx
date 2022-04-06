import {
  ClearOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
} from "@mui/icons-material"
import {
  AppBar,
  Badge,
  Button,
  IconButton,
  Input,
  InputAdornment,
  Link,
  Toolbar,
  Typography,
} from "@mui/material"
import { Box } from "@mui/system"
import NextLink from "next/link"
import { useRouter } from "next/router"
import { useContext, useState } from "react"
import { UIContext } from "../../context/ui/UIContext"
import { CartContext } from "../../context/cart/CartContext"

type Props = {}

const Navbar = (props: Props) => {
  const { pathname, push } = useRouter()
  const { toggleSideMenu } = useContext(UIContext)
  const { numberOfItems } = useContext(CartContext)

  const [searchTerm, setSearchTerm] = useState("")
  const [isSearchVisible, setIsSearchVisible] = useState(false)

  const handleSearchTerm = () => {
    if (searchTerm.trim().length === 0) return
    push(`/search/${searchTerm}`)
  }

  return (
    <AppBar>
      <Toolbar>
        <NextLink href="/" passHref>
          <Link display="flex" alignItems="center">
            <Typography variant="h6">Testo |</Typography>
            <Typography
              sx={{
                ml: 0.5,
              }}
            >
              Shop
            </Typography>
          </Link>
        </NextLink>

        <Box flex="1" />

        <Box
          sx={{
            display: isSearchVisible
              ? "none"
              : {
                  xs: "none",
                  md: "flex",
                },
          }}
          className="fadeIn"
        >
          <NextLink href="/category/men" passHref>
            <Link>
              <Button
                color={`${pathname === "/category/men" ? "info" : "primary"}`}
              >
                Hombres
              </Button>
            </Link>
          </NextLink>
          <NextLink href="/category/women" passHref>
            <Link>
              <Button
                color={`${pathname === "/category/women" ? "info" : "primary"}`}
              >
                Mujeres
              </Button>
            </Link>
          </NextLink>
          <NextLink href="/category/kid" passHref>
            <Link>
              <Button
                color={`${pathname === "/category/kid" ? "info" : "primary"}`}
              >
                Niños
              </Button>
            </Link>
          </NextLink>
        </Box>

        <Box flex="1" />

        {/* for big screens */}

        {isSearchVisible ? (
          <Input
            sx={{
              display: {
                xs: "none",
                md: "flex",
              },
            }}
            autoFocus
            className="fadeIn"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyUp={(e) => e.key === "Enter" && handleSearchTerm()}
            type="text"
            placeholder="Buscar..."
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={() => setIsSearchVisible(false)}>
                  <ClearOutlined />
                </IconButton>
              </InputAdornment>
            }
          />
        ) : (
          <IconButton
            onClick={() => setIsSearchVisible(true)}
            className="fadeIn"
            sx={{
              display: {
                xs: "none",
                md: "flex",
              },
            }}
          >
            <SearchOutlined />
          </IconButton>
        )}

        {/* for little screens */}
        <IconButton
          sx={{
            display: {
              xs: "flex",
              sm: "none",
            },
          }}
          onClick={toggleSideMenu}
        >
          <SearchOutlined />
        </IconButton>

        <NextLink href="/cart" passHref>
          <Link>
            <IconButton>
              <Badge
                badgeContent={numberOfItems > 9 ? "+9" : numberOfItems}
                color="secondary"
              >
                <ShoppingCartOutlined />
              </Badge>
            </IconButton>
          </Link>
        </NextLink>

        <Button onClick={toggleSideMenu}>Menú</Button>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
