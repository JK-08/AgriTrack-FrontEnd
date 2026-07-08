import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import OwnerTabNavigator from './OwnerTabNavigator';
import FleetDashboardScreen from '../screens/owner/FleetDashboard/FleetDashboardScreen';
import ExpenseListScreen from '../screens/owner/ExpenseList/ExpenseListScreen';
import ProfitLossScreen from '../screens/owner/ProfitLoss/ProfitLossScreen';
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
import TractorDocumentsScreen from '../screens/owner/TractorDocuments/TractorDocumentsScreen';
import BookingRequestsScreen from '../screens/owner/BookingRequests/BookingRequestsScreen';
import BookingDetailScreen from '../screens/owner/BookingDetail/BookingDetailScreen';
import DriverListScreen from '../screens/owner/DriverList/DriverListScreen';
import AddDriverScreen from '../screens/owner/AddDriver/AddDriverScreen';
import DriverDetailScreen from '../screens/owner/DriverDetail/DriverDetailScreen';
import DriverAttendanceScreen from '../screens/owner/DriverAttendance/DriverAttendanceScreen';
import DriverPayrollScreen from '../screens/owner/DriverPayroll/DriverPayrollScreen';
import PaymentTrackingScreen from '../screens/owner/PaymentTracking/PaymentTrackingScreen';
import ReportsScreen from '../screens/owner/Reports/ReportsScreen';
import AnalyticsScreen from '../screens/owner/Reports/AnalyticsScreen';
import NotificationPreferencesScreen from '../screens/owner/NotificationPreferences/NotificationPreferencesScreen';
import AiInsightsScreen from '../screens/owner/Reports/AiInsightsScreen';
import NotificationsScreen from '../screens/owner/Notifications/NotificationsScreen';
import OwnerProfileScreen from '../screens/owner/OwnerProfile/OwnerProfileScreen';
import ChatListScreen from '../screens/shared/ChatList/ChatListScreen';
import ChatScreen from '../screens/shared/Chat/ChatScreen';
import LanguageScreen from '../screens/shared/Language/LanguageScreen';
import ThemeScreen from '../screens/shared/Theme/ThemeScreen';
import RateAlertScreen from '../screens/shared/RateAlert/RateAlertScreen';

const Stack = createNativeStackNavigator();

export default function OwnerNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="OwnerTabs"          component={OwnerTabNavigator} />
      <Stack.Screen name="FleetDashboard"     component={FleetDashboardScreen} />
      <Stack.Screen name="ExpenseList"        component={ExpenseListScreen} />
      <Stack.Screen name="ProfitLoss"         component={ProfitLossScreen} />
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
      <Stack.Screen name="TractorDocuments"   component={TractorDocumentsScreen} />
      <Stack.Screen name="BookingRequests"    component={BookingRequestsScreen} />
      <Stack.Screen name="BookingDetail"      component={BookingDetailScreen} />
      <Stack.Screen name="DriverList"         component={DriverListScreen} />
      <Stack.Screen name="AddDriver"          component={AddDriverScreen} />
      <Stack.Screen name="DriverDetail"       component={DriverDetailScreen} />
      <Stack.Screen name="DriverAttendance"   component={DriverAttendanceScreen} />
      <Stack.Screen name="DriverPayroll"      component={DriverPayrollScreen} />
      <Stack.Screen name="PaymentTracking"    component={PaymentTrackingScreen} />
      <Stack.Screen name="Reports"            component={ReportsScreen} />
      <Stack.Screen name="Analytics"          component={AnalyticsScreen} />
      <Stack.Screen name="AiInsights"         component={AiInsightsScreen} />
      <Stack.Screen name="Notifications"      component={NotificationsScreen} />
      <Stack.Screen name="NotificationPreferences" component={NotificationPreferencesScreen} />
      <Stack.Screen name="OwnerProfile"       component={OwnerProfileScreen} />
      <Stack.Screen name="ChatList"           component={ChatListScreen} />
      <Stack.Screen name="Chat"               component={ChatScreen} />
      <Stack.Screen name="Language"           component={LanguageScreen} />
      <Stack.Screen name="Theme"              component={ThemeScreen} />
      <Stack.Screen name="RateAlerts"         component={RateAlertScreen} />
    </Stack.Navigator>
  );
}
