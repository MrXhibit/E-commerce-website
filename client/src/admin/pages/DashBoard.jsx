import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  IconButton,
  useTheme,
} from "@mui/material";
import {
  TrendingUp,
  ShoppingCart,
  CalendarToday,
  AttachMoney,
  Search,
} from "@mui/icons-material";

// Mock data for the dashboard
const mockData = {
  totalSales: 12463,
  ordersValue: 78596,
  dailyOrders: 95789,
  dailyRevenue: 41954,
  recentOrders: [
    {
      id: 1,
      product: "Decorative Plants",
      date: "20 Sep - 03:00AM",
      price: 637.50,
      status: "Succeed",
      avatar: "D",
    },
    {
      id: 2,
      product: "Sticky Calendar",
      date: "12 Mar - 08:32AM",
      price: 637.50,
      status: "Waiting",
      avatar: "S",
    },
    {
      id: 3,
      product: "Crystal Mug",
      date: "Feb 15 - 10:00AM",
      price: 637.50,
      status: "Succeed",
      avatar: "C",
    },
    {
      id: 4,
      product: "Melton Table Lamp",
      date: "Jun 10 - 12:30AM",
      price: 637.50,
      status: "Cancelled",
      avatar: "M",
    },
  ],
  recentCustomers: [
    { name: "Joanna Park", email: "Park@company.com" },
    { name: "Yongjae Choi", email: "Choi@company.co" },
    { name: "Seonll Jong", email: "Jong@company.com" },
    { name: "Joohee Min", email: "Min@company.com" },
    { name: "Seoyung Kim", email: "Kim@company.com" },
  ],
  topSellers: [
    { name: "Gary Walters", product: "Clothes", sold: 630, price: 37.50, earnings: 4275 },
    { name: "Edwin Higgins", product: "Shoes", sold: 956, price: 24.75, earnings: 2661 },
  ],
};

const StatCard = ({ title, value, comparison, icon, color, trend }) => {
  const theme = useTheme();
  
  // Fallback colors if theme is not available
  const colors = {
    grey: {
      100: "#f8fafc",
      400: "#94a3b8",
      600: "#475569",
      700: "#334155",
    },
    card: {
      main: "#2D3748",
    },
    ...color && { [color]: color }
  };

  return (
    <Card
      sx={{
        backgroundColor: colors.card.main,
        borderRadius: 3,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography
              variant="h3"
              sx={{
                color: colors.grey[100],
                fontWeight: 700,
                mb: 1,
              }}
            >
              {value.toLocaleString()}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: colors.grey[400],
                mb: 2,
              }}
            >
              {comparison}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}20`,
              borderRadius: "50%",
              width: 56,
              height: 56,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
        </Box>
        
        {/* Simple trend visualization */}
        <Box
          sx={{
            height: 4,
            backgroundColor: colors.grey[700],
            borderRadius: 2,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Box
            sx={{
              height: "100%",
              width: trend === "up" ? "70%" : trend === "down" ? "30%" : "50%",
              backgroundColor: color,
              borderRadius: 2,
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

const DashboardTable = ({ title, children, searchIcon = true }) => {
  const theme = useTheme();
  
  // Fallback colors if theme is not available
  const colors = {
    grey: {
      100: "#f8fafc",
      400: "#94a3b8",
    },
    card: {
      main: "#2D3748",
    },
  };

  return (
    <Card
      sx={{
        backgroundColor: colors.card.main,
        borderRadius: 3,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" sx={{ color: colors.grey[100], fontWeight: 600 }}>
            {title}
          </Typography>
          {searchIcon && (
            <IconButton sx={{ color: colors.grey[400] }}>
              <Search />
            </IconButton>
          )}
        </Box>
        {children}
      </CardContent>
    </Card>
  );
};

function DashBoard() {
  const theme = useTheme();
  
  // Fallback colors if theme is not available
  const colors = {
    grey: {
      100: "#f8fafc",
      300: "#cbd5e1",
      400: "#94a3b8",
      600: "#475569",
      700: "#334155",
    },
    background: {
      default: "#0f172a",
    },
    card: {
      main: "#2D3748",
      light: "#374151",
    },
    greenAccent: {
      500: "#22c55e",
    },
    redAccent: {
      500: "#ef4444",
    },
    orangeAccent: {
      500: "#f97316",
    },
    blueAccent: {
      400: "#60a5fa",
      500: "#3b82f6",
    },
    purpleAccent: {
      500: "#a855f7",
    },
    pinkAccent: {
      500: "#ec4899",
    },
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Succeed":
        return colors.greenAccent[500];
      case "Waiting":
        return colors.orangeAccent[500];
      case "Cancelled":
        return colors.redAccent[500];
      default:
        return colors.grey[500];
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: colors.background.default, minHeight: "100vh" }}>
      {/* Overview Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Sales"
            value={mockData.totalSales}
            comparison="Compared to Apr 2024"
            icon={<TrendingUp sx={{ color: colors.blueAccent[400], fontSize: 28 }} />}
            color={colors.blueAccent[400]}
            trend="up"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Orders Value"
            value={mockData.ordersValue}
            comparison="Compared to Aug 2024"
            icon={<ShoppingCart sx={{ color: colors.purpleAccent[500], fontSize: 28 }} />}
            color={colors.purpleAccent[500]}
            trend="stable"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Daily Orders"
            value={mockData.dailyOrders}
            comparison="Compared to Jun 2024"
            icon={<CalendarToday sx={{ color: colors.orangeAccent[500], fontSize: 28 }} />}
            color={colors.orangeAccent[500]}
            trend="up"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Daily Revenue"
            value={mockData.dailyRevenue}
            comparison="Compared to July 2024"
            icon={<AttachMoney sx={{ color: colors.pinkAccent[500], fontSize: 28 }} />}
            color={colors.pinkAccent[500]}
            trend="down"
          />
        </Grid>
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Recent Orders */}
        <Grid item xs={12} lg={8}>
          <DashboardTable title="Recent Orders">
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: colors.grey[400], fontWeight: 600 }}>
                      Recent Orders
                    </TableCell>
                    <TableCell sx={{ color: colors.grey[400], fontWeight: 600 }}>
                      Order Date
                    </TableCell>
                    <TableCell sx={{ color: colors.grey[400], fontWeight: 600 }}>
                      Price
                    </TableCell>
                    <TableCell sx={{ color: colors.grey[400], fontWeight: 600 }}>
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockData.recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar
                            sx={{
                              backgroundColor: colors.grey[600],
                              color: colors.grey[100],
                              width: 32,
                              height: 32,
                              fontSize: "14px",
                            }}
                          >
                            {order.avatar}
                          </Avatar>
                          <Typography sx={{ color: colors.grey[100] }}>
                            {order.product}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: colors.grey[300] }}>
                        {order.date}
                      </TableCell>
                      <TableCell sx={{ color: colors.grey[100], fontWeight: 600 }}>
                        ${order.price}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={order.status}
                          size="small"
                          sx={{
                            backgroundColor: getStatusColor(order.status),
                            color: colors.grey[100],
                            fontWeight: 600,
                            borderRadius: "16px",
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            {/* Pagination */}
            <Box display="flex" justifyContent="center" alignItems="center" mt={3}>
              <Typography variant="body2" sx={{ color: colors.grey[400] }}>
                Showing 1 to 4 of 7 entries
              </Typography>
            </Box>
          </DashboardTable>
        </Grid>

        {/* Right Sidebar */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={3}>
            {/* Recent Customers */}
            <Grid item xs={12}>
              <DashboardTable title="Recent Customers" searchIcon={false}>
                <Box>
                  {mockData.recentCustomers.map((customer, index) => (
                    <Box
                      key={index}
                      display="flex"
                      alignItems="center"
                      gap={2}
                      mb={2}
                      p={2}
                      sx={{
                        backgroundColor: colors.card.light,
                        borderRadius: 2,
                        "&:last-child": { mb: 0 },
                      }}
                    >
                      <Avatar
                        sx={{
                          backgroundColor: colors.grey[600],
                          color: colors.grey[100],
                          width: 40,
                          height: 40,
                          fontSize: "16px",
                        }}
                      >
                        {customer.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ color: colors.grey[100], fontWeight: 500 }}
                        >
                          {customer.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: colors.grey[400] }}
                        >
                          {customer.email}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </DashboardTable>
            </Grid>

            {/* Revenue By Category */}
            <Grid item xs={12}>
              <DashboardTable title="Revenue By Category" searchIcon={false}>
                <Box textAlign="center" py={3}>
                  <Box
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: "50%",
                      border: `8px solid ${colors.grey[700]}`,
                      borderTop: `8px solid ${colors.purpleAccent[500]}`,
                      borderRight: `8px solid ${colors.greenAccent[500]}`,
                      borderBottom: `8px solid ${colors.orangeAccent[500]}`,
                      borderLeft: `8px solid ${colors.pinkAccent[500]}`,
                      margin: "0 auto 20px",
                      transform: "rotate(-45deg)",
                    }}
                  />
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          backgroundColor: colors.purpleAccent[500],
                          borderRadius: "50%",
                        }}
                      />
                      <Typography variant="body2" sx={{ color: colors.grey[300] }}>
                        Jeans
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          backgroundColor: colors.greenAccent[500],
                          borderRadius: "50%",
                        }}
                      />
                      <Typography variant="body2" sx={{ color: colors.grey[300] }}>
                        Hoodies
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          backgroundColor: colors.orangeAccent[500],
                          borderRadius: "50%",
                        }}
                      />
                      <Typography variant="body2" sx={{ color: colors.grey[300] }}>
                        Outerwear
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          backgroundColor: colors.pinkAccent[500],
                          borderRadius: "50%",
                        }}
                      />
                      <Typography variant="body2" sx={{ color: colors.grey[300] }}>
                        Other
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </DashboardTable>
            </Grid>

            {/* User By Continent */}
            <Grid item xs={12}>
              <DashboardTable title="User By Continent" searchIcon={false}>
                <Box textAlign="center" py={3}>
                  <Typography
                    variant="h6"
                    sx={{ color: colors.grey[300], mb: 2 }}
                  >
                    World Map Visualization
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ color: colors.grey[100], fontWeight: 700, mb: 1 }}
                  >
                    3,566 Users
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: colors.grey[400] }}
                  >
                    Global user distribution
                  </Typography>
                </Box>
              </DashboardTable>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Top Seller Table */}
      <Box mt={4}>
        <DashboardTable title="Top Seller Of The Month">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: colors.grey[400], fontWeight: 600 }}>
                    Seller Name
                  </TableCell>
                  <TableCell sx={{ color: colors.grey[400], fontWeight: 600 }}>
                    Product
                  </TableCell>
                  <TableCell sx={{ color: colors.grey[400], fontWeight: 600 }}>
                    Sold
                  </TableCell>
                  <TableCell sx={{ color: colors.grey[400], fontWeight: 600 }}>
                    Price
                  </TableCell>
                  <TableCell sx={{ color: colors.grey[400], fontWeight: 600 }}>
                    Earnings
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockData.topSellers.map((seller, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                          sx={{
                            backgroundColor: colors.grey[600],
                            color: colors.grey[100],
                            width: 32,
                            height: 32,
                            fontSize: "14px",
                          }}
                        >
                          {seller.name.charAt(0)}
                        </Avatar>
                        <Typography sx={{ color: colors.grey[100] }}>
                          {seller.name.charAt(0)} {seller.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: colors.grey[300] }}>
                      {seller.product}
                    </TableCell>
                    <TableCell sx={{ color: colors.grey[100] }}>
                      {seller.sold.toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ color: colors.grey[100] }}>
                      ${seller.price}
                    </TableCell>
                    <TableCell sx={{ color: colors.grey[100], fontWeight: 600 }}>
                      ${seller.earnings.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DashboardTable>
      </Box>
    </Box>
  );
}

export default DashBoard;
