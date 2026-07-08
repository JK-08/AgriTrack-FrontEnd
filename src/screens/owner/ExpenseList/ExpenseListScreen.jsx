import React, { useCallback, useMemo, useState } from 'react';
import { View, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppText from '../../../components/ui/appcomponents/AppText';
import AppInput from '../../../components/ui/appcomponents/AppInput';
import AppButton from '../../../components/ui/appcomponents/AppButton';
import AppModal from '../../../components/ui/appcomponents/AppModal';
import AppChip from '../../../components/ui/appcomponents/AppChip';
import AppEmptyState from '../../../components/ui/appcomponents/AppEmptyState';
import ListRow from '../../../components/agri/ListRow';
import { useToast } from '../../../components/ui/Toast';
import { useAuth } from '../../../providers/AuthProvider';
import { expenseService } from '../../../api/services';
import { formatCurrency, formatDate } from '../../../utils/agriHelpers';
import { exportRowsAsCsv, exportRowsAsExcel, exportHtmlAsPdf, buildReportHtml } from '../../../utils/exportHelpers';

const CATEGORIES = [
  { key: 'FUEL', label: 'Fuel', icon: 'water-outline' },
  { key: 'REPAIRS', label: 'Repairs', icon: 'hammer-outline' },
  { key: 'SPARE_PARTS', label: 'Spare Parts', icon: 'cog-outline' },
  { key: 'INSURANCE', label: 'Insurance', icon: 'shield-checkmark-outline' },
  { key: 'DRIVER_SALARY', label: 'Driver Salary', icon: 'people-outline' },
  { key: 'EMI', label: 'EMI', icon: 'card-outline' },
  { key: 'TAXES', label: 'Taxes', icon: 'document-text-outline' },
  { key: 'MISC', label: 'Misc', icon: 'ellipsis-horizontal-outline' },
];
const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.key, c]));

const EMPTY_FORM = { expenseId: null, category: 'FUEL', amount: '', vendor: '', description: '', expenseDate: '', billUrl: '' };

export default function ExpenseListScreen({ navigation }) {
  const { COLORS, SIZES } = useTheme();
  const toast = useToast();
  const { ownerId } = useAuth();

  const [items, setItems] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [activeCategory, setActiveCategory] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const set = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));

  const load = useCallback(async () => {
    if (!ownerId) return;
    try {
      const res = await expenseService.searchPaged(ownerId, {
        search: search || undefined,
        category: activeCategory || undefined,
        page: 0, size: 50, sortBy: 'expenseDate', sortDir: 'desc',
      });
      setItems(res?.content || []);
      setTotalElements(res?.totalElements ?? 0);
    } catch (e) {
      toast?.error?.('Could not load expenses');
    } finally {
      setLoading(false);
    }
  }, [ownerId, search, activeCategory]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const totalAmount = useMemo(
    () => items.reduce((sum, e) => sum + (Number(e.amount) || 0), 0),
    [items]
  );

  const openAdd = () => { setForm(EMPTY_FORM); setOpen(true); };
  const openEdit = (item) => {
    setForm({
      expenseId: item.expenseId,
      category: item.category,
      amount: String(item.amount ?? ''),
      vendor: item.vendor || '',
      description: item.description || '',
      expenseDate: item.expenseDate || '',
      billUrl: item.billUrl || '',
    });
    setOpen(true);
  };

  const attachBill = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) { toast?.error?.('Photo library permission needed'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.7, allowsEditing: true });
    if (result.canceled || !result.assets?.[0]) return;

    const asset = result.assets[0];
    const formData = new FormData();
    formData.append('file', { uri: asset.uri, name: 'bill.jpg', type: 'image/jpeg' });

    setUploading(true);
    try {
      const res = await expenseService.uploadBill(formData);
      set('billUrl')(res?.url || '');
      toast?.success?.('Bill attached');
    } catch (e) {
      toast?.error?.('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const onSave = async () => {
    if (!form.category) { toast?.error?.('Select a category'); return; }
    if (!form.amount || Number(form.amount) <= 0) { toast?.error?.('Enter a valid amount'); return; }

    const payload = {
      category: form.category,
      amount: Number(form.amount),
      expenseDate: form.expenseDate || new Date().toISOString().slice(0, 10),
      vendor: form.vendor || null,
      description: form.description || null,
      billUrl: form.billUrl || null,
    };

    setSaving(true);
    try {
      if (form.expenseId) {
        await expenseService.update(form.expenseId, payload);
        toast?.success?.('Expense updated');
      } else {
        await expenseService.create(payload);
        toast?.success?.('Expense added');
      }
      setOpen(false);
      setForm(EMPTY_FORM);
      load();
    } catch (e) {
      toast?.error?.(e?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!form.expenseId) return;
    setSaving(true);
    try {
      await expenseService.remove(form.expenseId);
      toast?.success?.('Expense deleted');
      setOpen(false);
      setForm(EMPTY_FORM);
      load();
    } catch (e) {
      toast?.error?.('Delete failed');
    } finally {
      setSaving(false);
    }
  };

  const exportRows = () => items.map((e) => ({
    Date: formatDate(e.expenseDate),
    Category: CATEGORY_MAP[e.category]?.label || e.category,
    Vendor: e.vendor || '',
    Amount: e.amount,
    Description: e.description || '',
  }));

  const doExportCsv = () => exportRowsAsCsv(exportRows(), 'expenses').catch(() => toast?.error?.('Export failed'));
  const doExportExcel = () => exportRowsAsExcel(exportRows(), 'expenses').catch(() => toast?.error?.('Export failed'));
  const doExportPdf = () => {
    const html = buildReportHtml({
      title: 'Expense Report',
      subtitle: `${items.length} expenses · Total ${formatCurrency(totalAmount)}`,
      columns: [
        { key: 'Date', label: 'Date' },
        { key: 'Category', label: 'Category' },
        { key: 'Vendor', label: 'Vendor' },
        { key: 'Amount', label: 'Amount' },
        { key: 'Description', label: 'Description' },
      ],
      rows: exportRows(),
    });
    return exportHtmlAsPdf(html, 'expenses').catch(() => toast?.error?.('Export failed'));
  };

  return (
    <ScreenWrapper paddingHorizontal={0} onRefresh={onRefresh} refreshing={refreshing}
      header={
        <AppHeader title="Expenses" subtitle={`${totalElements} recorded · ${formatCurrency(totalAmount)}`} variant="primary" showBack
          actions={[
            { iconName: 'analytics-outline', onPress: () => navigation.navigate('ProfitLoss') },
            { iconName: 'add', onPress: openAdd },
          ]}
        />
      }
    >
      <View style={{ paddingHorizontal: SIZES.padding.container, paddingTop: 10 }}>
        <AppInput placeholder="Search vendor or description" leftIcon="search-outline" value={search}
          onChangeText={(v) => setSearch(v)} onSubmitEditing={load} />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 4, marginBottom: 4 }}>
          <AppChip label="All" selected={!activeCategory} onPress={() => setActiveCategory(null)} style={{ marginRight: 8 }} />
          {CATEGORIES.map((c) => (
            <AppChip key={c.key} label={c.label} leftIcon={c.icon} selected={activeCategory === c.key}
              onPress={() => setActiveCategory(activeCategory === c.key ? null : c.key)} style={{ marginRight: 8 }} />
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
          <AppButton label="PDF" size="sm" variant="outline" leftIcon="document-text-outline" onPress={doExportPdf} style={{ marginRight: 8 }} />
          <AppButton label="Excel" size="sm" variant="outline" leftIcon="grid-outline" onPress={doExportExcel} style={{ marginRight: 8 }} />
          <AppButton label="CSV" size="sm" variant="outline" leftIcon="download-outline" onPress={doExportCsv} style={{ marginRight: 8 }} />
        </ScrollView>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.expenseId)}
        contentContainerStyle={{ paddingHorizontal: SIZES.padding.container, paddingBottom: 30 }}
        onRefresh={onRefresh}
        refreshing={refreshing}
        renderItem={({ item }) => (
          <ListRow
            icon={CATEGORY_MAP[item.category]?.icon || 'wallet-outline'}
            title={CATEGORY_MAP[item.category]?.label || item.category}
            subtitle={`${item.vendor ? item.vendor + ' · ' : ''}${formatDate(item.expenseDate)}`}
            value={formatCurrency(item.amount)}
            onPress={() => openEdit(item)}
          />
        )}
        ListEmptyComponent={
          !loading && (
            <AppEmptyState variant="no-data" title="No expenses yet"
              subtitle="Track fuel, repairs, salaries and more to see your true profit."
              cta={{ label: 'Add Expense', onPress: openAdd, icon: '➕' }} />
          )
        }
      />

      <AppModal visible={open} onClose={() => setOpen(false)}
        title={form.expenseId ? 'Edit Expense' : 'Add Expense'} position="bottom">
        <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 480 }}>
          <AppText variant="label" style={{ marginBottom: 6 }}>Category</AppText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 }}>
            {CATEGORIES.map((c) => (
              <TouchableOpacity key={c.key} onPress={() => set('category')(c.key)} style={{ marginRight: 8, marginBottom: 8 }}>
                <AppChip label={c.label} leftIcon={c.icon} selected={form.category === c.key} />
              </TouchableOpacity>
            ))}
          </View>
          <AppInput label="Amount (₹)" value={form.amount} onChangeText={set('amount')} keyboardType="numeric" required />
          <AppInput label="Date (YYYY-MM-DD)" value={form.expenseDate} onChangeText={set('expenseDate')}
            placeholder={new Date().toISOString().slice(0, 10)} />
          <AppInput label="Vendor" value={form.vendor} onChangeText={set('vendor')} />
          <AppInput label="Description" value={form.description} onChangeText={set('description')} />

          <AppButton
            label={form.billUrl ? 'Bill Attached ✓' : 'Attach Bill / Receipt'}
            variant="outline" leftIcon="camera-outline" loading={uploading}
            onPress={attachBill} style={{ marginTop: 6, marginBottom: 12 }}
          />

          <AppButton label={form.expenseId ? 'Save Changes' : 'Add Expense'} onPress={onSave} loading={saving} />
          {!!form.expenseId && (
            <AppButton label="Delete Expense" variant="danger" onPress={onDelete} loading={saving} style={{ marginTop: 10 }} />
          )}
        </ScrollView>
      </AppModal>
    </ScreenWrapper>
  );
}
