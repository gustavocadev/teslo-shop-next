import { PeopleOutline } from "@mui/icons-material"
import AdminLayout from "../../components/layouts/AdminLayout"
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid"
import { Grid, MenuItem, Select } from "@mui/material"
import useSWR from "swr"
import { UserType } from "../../interfaces"
import { useState, useEffect } from "react"

export default function UsersPage() {
  const { data, error } = useSWR<UserType[]>("/api/admin/users")

  const [users, setUsers] = useState<UserType[]>([])

  useEffect(() => {
    if (data) {
      setUsers(data)
    }
  }, [data])

  if (!data && !error) return <div>Loading...</div>

  const handleRoleUpdated = async (userId: string, newRole: string) => {
    // create a copy of the users array
    const previousUsers = [...users]

    const updatedUsers = users.map((user) => {
      if (userId !== user._id) return user

      return { ...user, role: newRole }
    })
    setUsers(updatedUsers)
    try {
      const resp = await fetch(`/api/admin/users`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, role: newRole }),
      })

      if (!resp.ok) {
        throw new Error(resp.statusText)
      }
    } catch (error) {
      setUsers(previousUsers)
      alert("Error updating user role")
      console.error(error)
    }
  }

  const columns: GridColDef[] = [
    {
      field: "email",
      headerName: "Correo",
      width: 250,
    },
    {
      field: "name",
      headerName: "Nombre completo",
      width: 300,
    },
    {
      field: "role",
      headerName: "Rol",
      width: 300,
      renderCell: ({ row }: GridValueGetterParams) => {
        return (
          <Select
            value={row.role}
            label="Rol"
            onChange={({ target }) => handleRoleUpdated(row.id, target.value)}
            sx={{
              width: "300px",
            }}
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="client">Client</MenuItem>
          </Select>
        )
      },
    },
  ]

  const rows = users.map((user) => ({
    id: user._id,
    email: user.email,
    name: `${user.name}`,
    role: user.role,
  }))

  return (
    <AdminLayout
      title="Users"
      subtitle="Users management"
      icon={<PeopleOutline />}
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
