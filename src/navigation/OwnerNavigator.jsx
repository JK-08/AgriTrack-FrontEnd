import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import OwnerTabNavigator from './OwnerTabNavigator';
import AddCustomerScreen from '../screens/owner/AddCustomer/AddCustomerScreen';
import CustomerDetailScreen from '../screens/owner/CustomerDetail/CustomerDetailScreen';
import WorkSummaryScreen from '../screens/owner/WorkSummary/WorkSummaryScreen';
import WorkDetailScreen from '../screens/owner/WorkDetail/WorkDetailScreen';
import RatesScreen from '../screens/owner/Rates/RatesScreen';
import EditRateScreen from '../screens/owner/EditRate/EditRateScreen';
import InvoiceListScreen from '../screens/owner/InvoiceList/InvoiceListScreen';
import InvoiceGenerateScreen from '../screens/owner/InvoiceGenerate/InvoiceGenerateScreen';
import InvoicePreviewScreen from '../screens/owner/InvoicePreview/InvoicePreviewScreen';
import TractorManagementScreen from '../screens/owner/TractorManagement/TractorManagementScreen';
import AddTractorScreen from '../screens/owner/AddTractor/AddTractorScreen';
import MaintenanceLogScreen from '../screens/owner/MaintenanceLog/MaintenanceLogScreen';
import BookingRequestsScreen from '../screens/owner/BookingRequests/BookingRequestsScreen';
import BookingDetailScreen from '../screens/owner/BookingDetail/BookingDetailScreen';
import PaymentTrackingScreen from '../screens/owner/PaymentTracking/PaymentTrackingScreen';
import ReportsScreen from '../screens/owner/Reports/ReportsScreen';
import NotificationsScreen from '../screens/owner/Notifications/NotificationsScreen';
import OwnerProfileScreen from '../screens/owner/OwnerProfile/OwnerProfileScreen';
import ChatListScreen from '../screens/shared/ChatList/ChatListScreen';
import ChatScreen from '../screens/shared/Chat/ChatScreen';

const Stack = createNativeStackNavigator();

export default function OwnerNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="OwnerTabs"          component={OwnerTabNavigator} />
      <Stack.Screen name="AddCustomer"        component={AddCustomerScreen} />
      <Stack.Screen name="CustomerDetail"     component={CustomerDetailScreen} />
      <Stack.Screen name="WorkSummary"        component={WorkSummaryScreen} />
      <Stack.Screen name="WorkDetail"         component={WorkDetailScreen} />
      <Stack.Screen name="Rates"              component={RatesScreen} />
      <Stack.Screen name="EditRate"           component={EditRateScreen} />
      <Stack.Screen name="InvoiceList"        component={InvoiceListScreen} />
      <Stack.Screen name="InvoiceGenerate"    component={InvoiceGenerateScreen} />
      <Stack.Screen name="InvoicePreview"     component={InvoicePreviewScreen} />
      <Stack.Screen name="TractorManagement"  component={TractorManagementScreen} />
      <Stack.Screen name="AddTractor"         component={AddTractorScreen} />
      <Stack.Screen name="MaintenanceLog"     component={MaintenanceLogScreen} />
      <Stack.Screen name="BookingRequests"    component={BookingRequestsScreen} />
      <Stack.Screen name="BookingDetail"      component={BookingDetailScreen} />
      <Stack.Screen name="PaymentTracking"    component={PaymentTrackingScreen} />
      <Stack.Screen name="Reports"            component={ReportsScreen} />
      <Stack.Screen name="Notifications"      component={NotificationsScreen} />
      <Stack.Screen name="OwnerProfile"       component={OwnerProfileScreen} />
      <Stack.Screen name="ChatList"           component={ChatListScreen} />
      <Stack.Screen name="Chat"               component={ChatScreen} />
    </Stack.Navigator>
  );
}
