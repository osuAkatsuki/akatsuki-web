import FavoriteIcon from "@mui/icons-material/Favorite"
import {
  Avatar,
  Box,
  Container,
  Grid,
  Stack,
  TablePagination,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

import {
  fetchUserFriends,
  UserFriend,
} from "../adapters/akatsuki-api/userRelationships"
import StaticPageBanner from "../components/images/banners/static_page_banner.svg"
import { UserFriendsIcon } from "../components/images/icons/UserFriendsIcon"

const PAGE_SIZE = 21

const getUserIdFromQueryParams = (identifier?: string): number => {
  let userId = parseInt(identifier || "")
  if (isNaN(userId)) {
    // TODO: do API lookup
    userId = 0
  }
  return userId
}

export const UserFriendsPage = () => {
  const queryParams = useParams()
  const pageUserId = getUserIdFromQueryParams(queryParams["userId"])

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const [page, setPage] = useState(1)
  const [userFriends, setUserFriends] = useState<UserFriend[]>([])

  useEffect(() => {
    ;(async () => {
      let userFriends
      try {
        userFriends = await fetchUserFriends({ page, pageSize: PAGE_SIZE })
      } catch (e: any) {
        console.error(e)
        return
      }
      setUserFriends(userFriends?.friends ?? [])
    })()
  }, [page])

  return (
    <>
      <Box
        height={{ xs: 0, sm: 340 }}
        // TODO: do we need anything like this?
        // pt={{ xs: 0, sm: 10 }}
        sx={{
          backgroundSize: "cover",
          backgroundImage: `url(${StaticPageBanner})`,
        }}
      />
      <Container maxWidth="md" sx={{ mt: isMobile ? 0 : -20 }}>
        <Stack direction="column" borderRadius={4}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              backgroundSize: "cover",
              backgroundImage: `url(${StaticPageBanner})`,
            }}
            py={5}
          >
            <Stack direction="column" alignItems="center">
              <Box width={22} height={22}>
                <UserFriendsIcon />
              </Box>
              <Typography variant="h5">Friends</Typography>
            </Stack>
          </Box>
          <Box bgcolor="#191527">
            <Grid container>
              {userFriends.map((friend: UserFriend) => (
                <Grid key={friend.id} item xs={12} sm={4} p={1}>
                  <Link
                    to={`/u/${friend.id}`}
                    // eslint-disable-next-line react/forbid-component-props
                    style={{
                      color: "#FFFFFF",
                      textDecoration: "none",
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={2}
                      p={2}
                      border="1px solid #211D35"
                      borderRadius={4}
                    >
                      <Avatar
                        alt="user-avatar"
                        src={`https://a.akatsuki.gg/${friend.id}`}
                        variant="circular"
                        sx={{ width: 36, height: 36 }}
                      />
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        width="100%"
                      >
                        <Typography variant="h5">{friend.username}</Typography>
                        {friend.is_mutual ? (
                          <Tooltip title="Mutual friend">
                            <FavoriteIcon sx={{ color: "#cc4499" }} />
                          </Tooltip>
                        ) : null}
                      </Stack>
                    </Stack>
                  </Link>
                </Grid>
              ))}
            </Grid>
            <TablePagination
              component={Box}
              sx={{ background: "#191527" }}
              count={-1}
              rowsPerPage={PAGE_SIZE}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPageOptions={[]}
              labelDisplayedRows={({ from, to }) => {
                return `Results ${from}-${to}`
              }}
            />
          </Box>
        </Stack>
      </Container>
    </>
  )
}
