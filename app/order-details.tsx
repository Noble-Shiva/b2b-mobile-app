import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Package, 
  Truck, 
  CreditCard, 
  Calendar,
  Eye,
  FileText,
  BarChart3,
  CheckCircle,
  Clock,
  AlertCircle,
  Palette
} from 'lucide-react-native';
import { Text, Button } from '@/components/ui';
import { colors, getTheme } from '@/utils/theme';
import { useSelector } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';
import { getOrderDetails } from '@/api/orders';
import type { UserOrder } from '@/api/orders';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type DesignType = 'executive' | 'invoice' | 'modern';

export default function OrderDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const isDark = useSelector(selectIsDark);
  const theme = getTheme(isDark);
  
  const [order, setOrder] = useState<UserOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [currentDesign, setCurrentDesign] = useState<DesignType>('executive');

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const orderId = parseInt(id as string);
      const orderData = await getOrderDetails(orderId);
      setOrder(orderData);
    } catch (err: any) {
      setError(err.message || 'Failed to load order details');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return '#10B981';
      case 'processing':
        return '#3B82F6';
      case 'pending':
        return '#F59E0B';
      case 'cancelled':
      case 'failed':
        return '#EF4444';
      case 'on-hold':
        return '#8B5CF6';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return CheckCircle;
      case 'processing':
        return Clock;
      case 'pending':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const formatCurrency = (amount: string) => {
    return `₹${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Design switching component - COMMENTED OUT
  // const DesignSwitcher = () => (
  //   <View style={[styles.designSwitcher, { backgroundColor: theme.background.secondary }]}>
  //     <Text variant="body-sm" weight="medium" style={styles.switcherLabel}>Design Style:</Text>
  //     <View style={styles.switcherButtons}>
  //       <TouchableOpacity
  //         style={[
  //           styles.switcherButton,
  //           { backgroundColor: currentDesign === 'executive' ? colors.primary[600] : theme.background.tertiary }
  //         ]}
  //         onPress={() => setCurrentDesign('executive')}
  //       >
  //         <BarChart3 size={16} color={currentDesign === 'executive' ? '#FFFFFF' : theme.icon.secondary} />
  //         <Text 
  //           variant="caption" 
  //           weight="medium"
  //           color={currentDesign === 'executive' ? 'inverse' : 'secondary'}
  //           style={styles.switcherText}
  //         >
  //           Executive
  //         </Text>
  //       </TouchableOpacity>
  //       
  //       <TouchableOpacity
  //         style={[
  //           styles.switcherButton,
  //           { backgroundColor: currentDesign === 'invoice' ? colors.primary[600] : theme.background.tertiary }
  //         ]}
  //         onPress={() => setCurrentDesign('invoice')}
  //       >
  //         <FileText size={16} color={currentDesign === 'invoice' ? '#FFFFFF' : theme.icon.secondary} />
  //         <Text 
  //           variant="caption" 
  //           weight="medium"
  //           color={currentDesign === 'invoice' ? 'inverse' : 'secondary'}
  //           style={styles.switcherText}
  //         >
  //           Invoice
  //         </Text>
  //       </TouchableOpacity>
  //       
  //       <TouchableOpacity
  //         style={[
  //           styles.switcherButton,
  //           { backgroundColor: currentDesign === 'modern' ? colors.primary[600] : theme.background.tertiary }
  //         ]}
  //         onPress={() => setCurrentDesign('modern')}
  //       >
  //         <Palette size={16} color={currentDesign === 'modern' ? '#FFFFFF' : theme.icon.secondary} />
  //         <Text 
  //           variant="caption" 
  //           weight="medium"
  //           color={currentDesign === 'modern' ? 'inverse' : 'secondary'}
  //           style={styles.switcherText}
  //         >
  //           Modern
  //         </Text>
  //       </TouchableOpacity>
  //     </View>
  //   </View>
  // );

  // Design 1: Executive Dashboard Style - COMMENTED OUT
  // const ExecutiveDesign = ({ order }: { order: UserOrder }) => {
  //   const StatusIcon = getStatusIcon(order.status);
  //   
  //   return (
  //     <ScrollView style={styles.executiveContainer} showsVerticalScrollIndicator={false}>
  //       {/* Order Header */}
  //       <View style={[styles.executiveCard, { backgroundColor: theme.background.secondary }]}>
  //         <View style={styles.executiveHeader}>
  //           <View>
  //             <Text variant="h2" weight="bold" style={styles.orderTitle}>
  //               Order #{order.order_id}
  //             </Text>
  //             <Text variant="body" color="secondary">
  //               Placed on {formatDate(order.date_created)}
  //             </Text>
  //           </View>
  //           <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '15' }]}>
  //             <StatusIcon size={16} color={getStatusColor(order.status)} />
  //             <Text 
  //               variant="body-sm" 
  //               weight="semibold"
  //               style={[styles.statusText, { color: getStatusColor(order.status) }]}
  //             >
  //               {order.status.toUpperCase()}
  //             </Text>
  //           </View>
  //         </View>
  //       </View>
  //
  //       {/* Financial Summary */}
  //       <View style={[styles.executiveCard, { backgroundColor: theme.background.secondary }]}>
  //         <Text variant="h4" weight="semibold" style={styles.sectionTitle}>
  //           Financial Summary
  //         </Text>
  //         <View style={styles.financialGrid}>
  //           <View style={styles.financialItem}>
  //             <CreditCard size={20} color={colors.primary[600]} />
  //             <Text variant="body-sm" color="secondary">Order Total</Text>
  //             <Text variant="h3" weight="bold" color="primary">{formatCurrency(order.total)}</Text>
  //           </View>
  //           <View style={styles.financialItem}>
  //             <Truck size={20} color="#10B981" />
  //             <Text variant="body-sm" color="secondary">Shipping</Text>
  //             <Text variant="body" weight="semibold">{formatCurrency(order.shipping_total)}</Text>
  //           </View>
  //           <View style={styles.financialItem}>
  //             <Package size={20} color="#8B5CF6" />
  //             <Text variant="body-sm" color="secondary">Items</Text>
  //             <Text variant="body" weight="semibold">{order.items.length}</Text>
  //           </View>
  //         </View>
  //       </View>
  //
  //       {/* Customer Information */}
  //       <View style={[styles.executiveCard, { backgroundColor: theme.background.secondary }]}>
  //         <Text variant="h4" weight="semibold" style={styles.sectionTitle}>
  //           Customer Information
  //         </Text>
  //         <View style={styles.customerInfo}>
  //           <View style={styles.customerItem}>
  //             <Building2 size={16} color={theme.icon.secondary} />
  //             <Text variant="body" weight="medium">
  //               {order.billing.first_name} {order.billing.last_name}
  //             </Text>
  //           </View>
  //           <View style={styles.customerItem}>
  //             <Mail size={16} color={theme.icon.secondary} />
  //             <Text variant="body" color="secondary">{order.billing.email}</Text>
  //           </View>
  //           <View style={styles.customerItem}>
  //             <Phone size={16} color={theme.icon.secondary} />
  //             <Text variant="body" color="secondary">{order.billing.phone}</Text>
  //           </View>
  //         </View>
  //       </View>
  //
  //       {/* Addresses */}
  //       <View style={styles.addressesContainer}>
  //         <View style={[styles.addressCard, { backgroundColor: theme.background.secondary }]}>
  //           <Text variant="body" weight="semibold" style={styles.addressTitle}>
  //             Billing Address
  //           </Text>
  //           <View style={styles.addressContent}>
  //             <MapPin size={16} color={colors.primary[600]} />
  //             <View style={styles.addressText}>
  //               <Text variant="body-sm">{order.billing.address_1}</Text>
  //               {order.billing.address_2 && <Text variant="body-sm">{order.billing.address_2}</Text>}
  //               <Text variant="body-sm">
  //                 {order.billing.city}, {order.billing.state} {order.billing.postcode}
  //               </Text>
  //             </View>
  //           </View>
  //         </View>
  //
  //         <View style={[styles.addressCard, { backgroundColor: theme.background.secondary }]}>
  //           <Text variant="body" weight="semibold" style={styles.addressTitle}>
  //             Shipping Address
  //           </Text>
  //           <View style={styles.addressContent}>
  //             <Truck size={16} color="#10B981" />
  //             <View style={styles.addressText}>
  //               <Text variant="body-sm">{order.shipping.address_1}</Text>
  //               {order.shipping.address_2 && <Text variant="body-sm">{order.shipping.address_2}</Text>}
  //               <Text variant="body-sm">
  //                 {order.shipping.city}, {order.shipping.state} {order.shipping.postcode}
  //               </Text>
  //             </View>
  //           </View>
  //         </View>
  //       </View>
  //
  //       {/* Items */}
  //       <View style={[styles.executiveCard, { backgroundColor: theme.background.secondary }]}>
  //         <Text variant="h4" weight="semibold" style={styles.sectionTitle}>
  //           Order Items ({order.items.length})
  //         </Text>
  //         {order.items.map((item, index) => (
  //           <View key={index} style={[styles.itemRow, index < order.items.length - 1 && styles.itemBorder]}>
  //             <View style={styles.itemInfo}>
  //               <Text variant="body" weight="medium" numberOfLines={2}>
  //                 {item.name}
  //               </Text>
  //               <Text variant="body-sm" color="secondary">
  //                 Qty: {item.quantity} • {formatCurrency(item.total)}
  //               </Text>
  //             </View>
  //             <View style={styles.itemPrice}>
  //               <Text variant="body" weight="semibold">
  //                 {formatCurrency(item.total)}
  //               </Text>
  //             </View>
  //           </View>
  //         ))}
  //       </View>
  //     </ScrollView>
  //   );
  // };

  // Design 2: Invoice Document Style - COMMENTED OUT
  // const InvoiceDesign = ({ order }: { order: UserOrder }) => (
  //   <ScrollView style={styles.invoiceContainer} showsVerticalScrollIndicator={false}>
  //     {/* Invoice Header */}
  //     <View style={[styles.invoiceHeader, { backgroundColor: theme.background.secondary }]}>
  //       <View style={styles.invoiceTitle}>
  //         <Text variant="h1" weight="bold">INVOICE</Text>
  //         <Text variant="body" color="secondary">#{order.order_id}</Text>
  //       </View>
  //       <View style={styles.companyInfo}>
  //         <Text variant="h4" weight="semibold">Srotas</Text>
  //         <Text variant="body-sm" color="secondary">B2B Marketplace</Text>
  //         <Text variant="body-sm" color="secondary">Mumbai, Maharashtra</Text>
  //       </View>
  //     </View>
  //
  //     {/* Invoice Details */}
  //     <View style={[styles.invoiceDetails, { backgroundColor: theme.background.secondary }]}>
  //       <View style={styles.invoiceRow}>
  //         <View style={styles.invoiceColumn}>
  //           <Text variant="body-sm" weight="semibold">Invoice Date:</Text>
  //           <Text variant="body-sm">{formatDate(order.date_created)}</Text>
  //         </View>
  //         <View style={styles.invoiceColumn}>
  //           <Text variant="body-sm" weight="semibold">Status:</Text>
  //           <Text variant="body-sm" style={{ color: getStatusColor(order.status) }}>
  //             {order.status.toUpperCase()}
  //           </Text>
  //         </View>
  //       </View>
  //       <View style={styles.invoiceRow}>
  //         <View style={styles.invoiceColumn}>
  //           <Text variant="body-sm" weight="semibold">Payment Method:</Text>
  //           <Text variant="body-sm">{order.payment_method || 'Not specified'}</Text>
  //         </View>
  //         <View style={styles.invoiceColumn}>
  //           <Text variant="body-sm" weight="semibold">Currency:</Text>
  //           <Text variant="body-sm">{order.currency}</Text>
  //         </View>
  //       </View>
  //     </View>
  //
  //     {/* Bill To */}
  //     <View style={[styles.invoiceSection, { backgroundColor: theme.background.secondary }]}>
  //       <Text variant="body" weight="semibold" style={styles.invoiceSectionTitle}>
  //         BILL TO:
  //       </Text>
  //       <Text variant="body" weight="medium">
  //         {order.billing.first_name} {order.billing.last_name}
  //       </Text>
  //       <Text variant="body-sm">{order.billing.company}</Text>
  //       <Text variant="body-sm">{order.billing.address_1}</Text>
  //       {order.billing.address_2 && <Text variant="body-sm">{order.billing.address_2}</Text>}
  //       <Text variant="body-sm">
  //         {order.billing.city}, {order.billing.state} {order.billing.postcode}
  //       </Text>
  //       <Text variant="body-sm">{order.billing.email}</Text>
  //       <Text variant="body-sm">{order.billing.phone}</Text>
  //     </View>
  //
  //     {/* Ship To */}
  //     <View style={[styles.invoiceSection, { backgroundColor: theme.background.secondary }]}>
  //       <Text variant="body" weight="semibold" style={styles.invoiceSectionTitle}>
  //         SHIP TO:
  //       </Text>
  //       <Text variant="body" weight="medium">
  //         {order.shipping.first_name} {order.shipping.last_name}
  //       </Text>
  //       <Text variant="body-sm">{order.shipping.company}</Text>
  //       <Text variant="body-sm">{order.shipping.address_1}</Text>
  //       {order.shipping.address_2 && <Text variant="body-sm">{order.shipping.address_2}</Text>}
  //       <Text variant="body-sm">
  //         {order.shipping.city}, {order.shipping.state} {order.shipping.postcode}
  //       </Text>
  //       <Text variant="body-sm">{order.shipping.phone}</Text>
  //     </View>
  //
  //     {/* Items Table */}
  //     <View style={[styles.invoiceTable, { backgroundColor: theme.background.secondary }]}>
  //       <View style={[styles.tableHeader, { backgroundColor: colors.primary[600] }]}>
  //         <Text variant="body-sm" weight="semibold" color="inverse" style={styles.tableHeaderText}>
  //           DESCRIPTION
  //         </Text>
  //         <Text variant="body-sm" weight="semibold" color="inverse" style={styles.tableHeaderQty}>
  //           QTY
  //         </Text>
  //         <Text variant="body-sm" weight="semibold" color="inverse" style={styles.tableHeaderPrice}>
  //           TOTAL
  //         </Text>
  //       </View>
  //       {order.items.map((item, index) => (
  //         <View key={index} style={[styles.tableRow, { borderBottomColor: theme.border.light }]}>
  //           <View style={styles.tableCell}>
  //             <Text variant="body-sm" numberOfLines={2}>{item.name}</Text>
  //             <Text variant="caption" color="secondary">ID: {item.product_id}</Text>
  //           </View>
  //           <Text variant="body-sm" style={styles.tableCellQty}>{item.quantity}</Text>
  //           <Text variant="body-sm" weight="medium" style={styles.tableCellPrice}>
  //             {formatCurrency(item.total)}
  //           </Text>
  //         </View>
  //       ))}
  //     </View>
  //
  //     {/* Invoice Total */}
  //     <View style={[styles.invoiceTotal, { backgroundColor: theme.background.secondary }]}>
  //       <View style={styles.totalRow}>
  //         <Text variant="body" color="secondary">Subtotal:</Text>
  //         <Text variant="body">{formatCurrency(order.total)}</Text>
  //       </View>
  //       <View style={styles.totalRow}>
  //         <Text variant="body" color="secondary">Shipping:</Text>
  //         <Text variant="body">{formatCurrency(order.shipping_total)}</Text>
  //       </View>
  //       <View style={styles.totalRow}>
  //         <Text variant="body" color="secondary">Discount:</Text>
  //         <Text variant="body">-{formatCurrency(order.discount_total)}</Text>
  //       </View>
  //       <View style={[styles.totalRow, styles.grandTotal, { borderTopColor: theme.border.primary }]}>
  //         <Text variant="h4" weight="bold">TOTAL:</Text>
  //         <Text variant="h4" weight="bold" color="primary">
  //           {formatCurrency(order.total)}
  //         </Text>
  //       </View>
  //     </View>
  //   </ScrollView>
  // );

  // Design 3: Modern Analytics Style
  const ModernDesign = ({ order }: { order: UserOrder }) => {
    const StatusIcon = getStatusIcon(order.status);
    
    return (
      <ScrollView style={styles.modernContainer} showsVerticalScrollIndicator={false}>
        {/* Modern Header with Gradient */}
        <View style={[styles.modernHeader, { backgroundColor: colors.primary[600] }]}>
          <View style={styles.modernHeaderContent}>
            <View style={styles.modernOrderInfo}>
              <Text variant="h2" weight="bold" color="inverse">
                #{order.order_id}
              </Text>
              <Text variant="body" color="inverse" style={{ opacity: 0.9 }}>
                {formatDate(order.date_created)}
              </Text>
            </View>
            <TouchableOpacity style={[styles.modernTrackBadge, { backgroundColor: '#ffffff' }]}>
              <Eye size={16} color="#10B981" />
              <Text variant="body-sm" weight="bold" style={{ color: '#10B981' }}>
                Track Order
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Modern Summary Card */}
        <View style={styles.modernSummaryContainer}>
          <View style={[styles.modernSummaryCard, { backgroundColor: theme.background.secondary }]}>
            <View style={styles.modernSummaryHeader}>
              <View style={[styles.modernSummaryIcon, { backgroundColor: colors.primary[100] }]}>
                <Package size={28} color={colors.primary[600]} />
              </View>
              <View style={styles.modernSummaryTitle}>
                <Text variant="h3" weight="bold">Order Summary</Text>
                <Text variant="body-sm" color="secondary">Items & Total Amount</Text>
              </View>
            </View>
            
            <View style={styles.modernSummaryContent}>
              <View style={styles.modernSummaryRow}>
                <View style={styles.modernSummaryItem}>
                  <Text variant="body" color="secondary">Total Items</Text>
                  <Text variant="h2" weight="bold" color="primary">
                    {order.items.length}
                  </Text>
                </View>
                
                <View style={styles.modernSummaryDivider} />
                
                <View style={styles.modernSummaryItem}>
                  <Text variant="body" color="secondary">Total Price</Text>
                  <Text variant="h2" weight="bold" color="primary">
                    {formatCurrency(order.total)}
                  </Text>
                </View>
              </View>
              
              <View style={[
                styles.modernSummaryFooter, 
                { backgroundColor: order.status.toLowerCase() === 'delivered' || order.status.toLowerCase() === 'completed' ? '#10B98115' : '#F59E0B15' }
              ]}>
                <Text 
                  variant="h4" 
                  weight="bold" 
                  style={{ 
                    color: order.status.toLowerCase() === 'delivered' || order.status.toLowerCase() === 'completed' ? '#10B981' : '#F59E0B' 
                  }}
                >
                  Order Status: {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Modern Customer Card */}
        <View style={[styles.modernCard, { backgroundColor: theme.background.secondary }]}>
          <View style={styles.modernCardHeader}>
            <Building2 size={20} color={colors.primary[600]} />
            <Text variant="h4" weight="semibold">Customer Details</Text>
          </View>
          <View style={styles.modernCustomerGrid}>
            <View style={styles.modernCustomerInfo}>
              <Text variant="body" weight="semibold">
                {order.billing.first_name} {order.billing.last_name}
              </Text>
              <View style={styles.modernContactItem}>
                <Mail size={14} color={theme.icon.secondary} />
                <Text variant="body-sm" color="secondary">{order.billing.email}</Text>
              </View>
              <View style={styles.modernContactItem}>
                <Phone size={14} color={theme.icon.secondary} />
                <Text variant="body-sm" color="secondary">{order.billing.phone}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Modern Address Cards */}
        <View style={styles.modernAddressContainer}>
          <View style={[styles.modernFullAddressCard, { backgroundColor: theme.background.secondary }]}>
            <View style={[styles.modernAddressHeader, { backgroundColor: colors.primary[50] }]}>
              <MapPin size={18} color={colors.primary[600]} />
              <Text variant="body" weight="semibold">Billing Address</Text>
            </View>
            <View style={styles.modernAddressContent}>
              <Text variant="body" weight="medium">
                {order.billing.first_name} {order.billing.last_name}
              </Text>
              <Text variant="body-sm">{order.billing.address_1}</Text>
              {order.billing.address_2 && <Text variant="body-sm">{order.billing.address_2}</Text>}
              <Text variant="body-sm">
                {order.billing.city}, {order.billing.state} {order.billing.postcode}
              </Text>
              <Text variant="body-sm" color="secondary">{order.billing.phone}</Text>
            </View>
          </View>

          <View style={[styles.modernFullAddressCard, { backgroundColor: theme.background.secondary }]}>
            <View style={[styles.modernAddressHeader, { backgroundColor: '#10B98115' }]}>
              <Truck size={18} color="#10B981" />
              <Text variant="body" weight="semibold">Shipping Address</Text>
            </View>
            <View style={styles.modernAddressContent}>
              <Text variant="body" weight="medium">
                {order.shipping.first_name} {order.shipping.last_name}
              </Text>
              <Text variant="body-sm">{order.shipping.address_1}</Text>
              {order.shipping.address_2 && <Text variant="body-sm">{order.shipping.address_2}</Text>}
              <Text variant="body-sm">
                {order.shipping.city}, {order.shipping.state} {order.shipping.postcode}
              </Text>
              <Text variant="body-sm" color="secondary">{order.shipping.phone}</Text>
            </View>
          </View>
        </View>

        {/* Modern Items List */}
        <View style={[styles.modernCard, { backgroundColor: theme.background.secondary }]}>
          <View style={styles.modernCardHeader}>
            <Package size={20} color={colors.primary[600]} />
            <Text variant="h4" weight="semibold">Order Items</Text>
          </View>
          {order.items.map((item, index) => (
            <View key={index} style={[styles.modernItemCard, { backgroundColor: theme.background.tertiary }]}>
              <View style={styles.modernItemContent}>
                <View style={styles.modernItemInfo}>
                  <Text variant="body" weight="medium" numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text variant="body-sm" color="secondary">
                    Product ID: {item.product_id}
                  </Text>
                </View>
                <View style={styles.modernItemMeta}>
                  <View style={[styles.modernQtyBadge, { backgroundColor: colors.primary[100] }]}>
                    <Text variant="body-sm" weight="semibold" color="primary">
                      Qty: {item.quantity}
                    </Text>
                  </View>
                  <Text variant="body" weight="bold">
                    {formatCurrency(item.total)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background.primary }]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <View style={[styles.header, { backgroundColor: theme.background.secondary, borderBottomColor: theme.border.light }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={theme.icon.primary} />
          </TouchableOpacity>
          <Text variant="h4" weight="semibold">Order Details</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[600]} />
          <Text variant="body" color="secondary" style={styles.loadingText}>
            Loading order details...
          </Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background.primary }]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <View style={[styles.header, { backgroundColor: theme.background.secondary, borderBottomColor: theme.border.light }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={theme.icon.primary} />
          </TouchableOpacity>
          <Text variant="h4" weight="semibold">Order Details</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Text variant="h4" weight="semibold" style={styles.errorTitle}>
            Unable to load order
          </Text>
          <Text variant="body" color="secondary" style={styles.errorText}>
            {error}
          </Text>
          <Button variant="primary" style={styles.retryButton} onPress={fetchOrderDetails}>
            Try Again
          </Button>
        </View>
      </View>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background.primary }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <View style={[styles.header, { backgroundColor: theme.background.secondary, borderBottomColor: theme.border.light }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.icon.primary} />
        </TouchableOpacity>
        <Text variant="h4" weight="semibold">Order Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ModernDesign order={order} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    minWidth: 120,
  },

  // Design Switcher
  designSwitcher: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  switcherLabel: {
    marginRight: 12,
  },
  switcherButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  switcherButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  switcherText: {
    fontSize: 12,
  },

  // Executive Design
  executiveContainer: {
    flex: 1,
    padding: 16,
  },
  executiveCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  executiveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderTitle: {
    marginBottom: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  statusText: {
    fontSize: 12,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  financialGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  financialItem: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  customerInfo: {
    gap: 12,
  },
  customerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  addressesContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  addressCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addressTitle: {
    marginBottom: 12,
  },
  addressContent: {
    flexDirection: 'row',
    gap: 12,
  },
  addressText: {
    flex: 1,
    gap: 2,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  itemInfo: {
    flex: 1,
    marginRight: 16,
  },
  itemPrice: {
    alignItems: 'flex-end',
  },

  // Invoice Design
  invoiceContainer: {
    flex: 1,
    padding: 16,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 24,
    borderRadius: 12,
    marginBottom: 16,
  },
  invoiceTitle: {
    alignItems: 'flex-start',
  },
  companyInfo: {
    alignItems: 'flex-end',
  },
  invoiceDetails: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  invoiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  invoiceColumn: {
    flex: 1,
  },
  invoiceSection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  invoiceSectionTitle: {
    marginBottom: 8,
    letterSpacing: 1,
  },
  invoiceTable: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    padding: 16,
  },
  tableHeaderText: {
    flex: 2,
  },
  tableHeaderQty: {
    flex: 1,
    textAlign: 'center',
  },
  tableHeaderPrice: {
    flex: 1,
    textAlign: 'right',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
  },
  tableCell: {
    flex: 2,
  },
  tableCellQty: {
    flex: 1,
    textAlign: 'center',
  },
  tableCellPrice: {
    flex: 1,
    textAlign: 'right',
  },
  invoiceTotal: {
    padding: 16,
    borderRadius: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  grandTotal: {
    borderTopWidth: 2,
    paddingTop: 12,
    marginTop: 8,
  },

  // Modern Design
  modernContainer: {
    flex: 1,
  },
  modernHeader: {
    padding: 24,
    paddingTop: 32,
  },
  modernHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  modernOrderInfo: {
    flex: 1,
  },
  modernTrackBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  modernSummaryContainer: {
    paddingHorizontal: 16,
    marginTop: -20,
    marginBottom: 16,
  },
  modernSummaryCard: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  modernSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 16,
  },
  modernSummaryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modernSummaryTitle: {
    flex: 1,
  },
  modernSummaryContent: {
    gap: 16,
  },
  modernSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modernSummaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  modernSummaryDivider: {
    width: 1,
    height: 60,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 20,
  },
  modernSummaryFooter: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modernCard: {
    margin: 16,
    marginBottom: 8,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  modernCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  modernCustomerGrid: {
    gap: 16,
  },
  modernCustomerInfo: {
    gap: 8,
  },
  modernContactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modernAddressContainer: {
    paddingHorizontal: 16,
    gap: 16,
    marginBottom: 8,
  },
  modernFullAddressCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  modernAddressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  modernAddressContent: {
    padding: 12,
    gap: 4,
  },
  modernItemCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  modernItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  modernItemInfo: {
    flex: 1,
    marginRight: 16,
  },
  modernItemMeta: {
    alignItems: 'flex-end',
    gap: 8,
  },
  modernQtyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
}); 