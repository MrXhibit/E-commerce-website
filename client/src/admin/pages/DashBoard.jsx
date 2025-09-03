import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Button,
  LinearProgress,
  useTheme
} from '@mui/material'
import Grid from '@mui/material/Grid2';
import {
  TrendingUp,
  ShoppingCart,
  Today,
  AttachMoney,
  MoreVert,
  Search,
  NavigateNext,
  NavigateBefore
} from '@mui/icons-material';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Sample data for charts
const salesData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4500 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 5500 },
  { name: 'Jul', value: 7000 }
];

const revenueData = [
  { name: 'Jeans', value: 480, color: '#8884d8' },
  { name: 'Hoodies', value: 300, color: '#82ca9d' },
  { name: 'Outerwear', value: 200, color: '#ffc658' },
  { name: 'Other', value: 100, color: '#ff7c7c' }
];

const recentOrders = [
  {
    id: 1,
    product: 'Decorative Plants',
    image: 'https://via.placeholder.com/40',
    date: '20 Sep - 03:00AM',
    price: '$637.50',
    status: 'Succeed'
  },
  {
    id: 2,
    product: 'Sticky Calendar',
    image: 'https://via.placeholder.com/40',
    date: '12 Mar - 08:32AM',
    price: '$637.50',
    status: 'Waiting'
  },
  {
    id: 3,
    product: 'Crystal Mug',
    image: 'https://via.placeholder.com/40',
    date: 'Feb 15 - 10:00AM',
    price: '$637.50',
    status: 'Succeed'
  },
  {
    id: 4,
    product: 'Melton Table Lamp',
    image: 'https://via.placeholder.com/40',
    date: 'Jun 10 - 12:30AM',
    price: '$637.50',
    status: 'Cancelled'
  }
];

const recentCustomers = [
  { name: 'Joanna Park', email: 'Park@company.com', avatar: 'https://via.placeholder.com/40' },
  { name: 'Yongjae Choi', email: 'Choi@company.com', avatar: 'https://via.placeholder.com/40' },
  { name: 'Seonll Jong', email: 'Jong@company.com', avatar: 'https://via.placeholder.com/40' },
  { name: 'Joohee Min', email: 'Min@company.com', avatar: 'https://via.placeholder.com/40' },
  { name: 'Seoyung Kim', email: 'Kim@company.com', avatar: 'https://via.placeholder.com/40' }
];

const topSellers = [
  { name: 'Gary Walters', product: 'Clothes', sold: 630, price: '$37.50', earnings: '$4275' },
  { name: 'Edwin Higgins', product: 'Shoes', sold: 956, price: '$24.75', earnings: '$2661' },
  { name: 'Aaron Higgins', product: 'Electronics', sold: 348, price: '$184.50', earnings: '$4206' },
  { name: 'Ralph Walters', product: 'Mobile', sold: 100, price: '$150.25', earnings: '$5025' }
];

// Statistics Card Component
const StatCard = ({ title, value, subtitle, icon, color, chartData }) => {
  const theme = useTheme();
  
  return (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h4" fontWeight="bold" color={color}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
            {icon}
          </Avatar>
        </Box>
        
        {/* Mini Chart */}
        <Box mt={2} height={60}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={color} 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

// Status Chip Component
const StatusChip = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'succeed': return 'success';
      case 'waiting': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <Chip 
      label={status} 
      color={getStatusColor(status)}
      size="small"
      variant="outlined"
    />
  );
};

function DashBoard() {
  const theme = useTheme();

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Ecommerce Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Dashboard / Ecommerce
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid spacing={3} mb={3}>
        <Grid xs={12} sm={6} md={3}>
          <StatCard
            title="Total Sales"
            value="12,463"
            subtitle="Compared to Apr 2024"
            icon={<TrendingUp />}
            color="#00bcd4"
            chartData={salesData}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <StatCard
            title="Orders Value"
            value="78,596"
            subtitle="Compared to Aug 2024"
            icon={<ShoppingCart />}
            color="#673ab7"
            chartData={salesData}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <StatCard
            title="Daily Orders"
            value="95,789"
            subtitle="Compared to Jun 2024"
            icon={<Today />}
            color="#ff9800"
            chartData={salesData}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <StatCard
            title="Daily Revenue"
            value="41,954"
            subtitle="Compared to July 2024"
            icon={<AttachMoney />}
            color="#ff9800"
            chartData={salesData}
          />
        </Grid>
      </Grid>

      {/* Main Content Grid */}
      <Grid spacing={3}>
        {/* Recent Orders */}
        <Grid xs={12} md={8}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Recent Orders
                </Typography>
                <IconButton>
                  <Search />
                </IconButton>
              </Box>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Recent Orders</TableCell>
                      <TableCell>Order Date</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar src={order.image} sx={{ width: 40, height: 40 }} />
                            <Typography variant="body2">{order.product}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {order.date}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {order.price}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <StatusChip status={order.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                <Typography variant="caption" color="text.secondary">
                  Showing 1 to 4 of 7 entries
                </Typography>
                <Box>
                  <IconButton size="small">
                    <NavigateBefore />
                  </IconButton>
                  <Button variant="contained" size="small" sx={{ mx: 1 }}>1</Button>
                  <Button variant="outlined" size="small" sx={{ mx: 1 }}>2</Button>
                  <IconButton size="small">
                    <NavigateNext />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sales Overview */}
        <Grid xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Sales Overview
              </Typography>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#00bcd4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Customers */}
        <Grid xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Recent Customers
              </Typography>
              <Box>
                {recentCustomers.map((customer, index) => (
                  <Box key={index} display="flex" alignItems="center" gap={2} py={1}>
                    <Avatar src={customer.avatar} />
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {customer.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {customer.email}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Revenue By Category */}
        <Grid xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Revenue By Category
              </Typography>
              <Box height={250} display="flex" alignItems="center" justifyContent="center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={revenueData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {revenueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Box display="flex" justifyContent="center" gap={2} mt={2}>
                {revenueData.map((item, index) => (
                  <Box key={index} display="flex" alignItems="center" gap={1}>
                    <Box 
                      width={12} 
                      height={12} 
                      borderRadius="50%" 
                      bgcolor={item.color}
                    />
                    <Typography variant="caption">{item.name}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* User By Continent */}
        <Grid xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                User By Continent
              </Typography>
              <Box height={200} display="flex" alignItems="center" justifyContent="center">
                <Typography variant="body2" color="text.secondary">
                  World Map Visualization
                </Typography>
              </Box>
              <Box mt={2}>
                <Typography variant="body2" fontWeight="bold" gutterBottom>
                  3,566 Users
                </Typography>
                <LinearProgress variant="determinate" value={75} sx={{ mb: 1 }} />
                <Typography variant="caption" color="text.secondary">
                  Global user distribution
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Seller */}
        <Grid xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Top Seller Of The Month
                </Typography>
                <IconButton>
                  <Search />
                </IconButton>
              </Box>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Seller Name</TableCell>
                      <TableCell>Product</TableCell>
                      <TableCell>Sold</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Earnings</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topSellers.map((seller, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar sx={{ width: 32, height: 32 }}>
                              {seller.name.charAt(0)}
                            </Avatar>
                            <Typography variant="body2">{seller.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{seller.product}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{seller.sold}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {seller.price}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold" color="success.main">
                            {seller.earnings}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DashBoard;
