import React, { useCallback, useState } from 'react';
import { View, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppText from '../../../components/ui/appcomponents/AppText';
import AppInput from '../../../components/ui/appcomponents/AppInput';
import AppButton from '../../../components/ui/appcomponents/AppButton';
import AppModal from '../../../components/ui/appcomponents/AppModal';
import AppCard from '../../../components/ui/appcomponents/AppCard';
import AppBadge from '../../../components/ui/appcomponents/AppBadge';
import AppChip from '../../../components/ui/appcomponents/AppChip';
import { useToast } from '../../../components/ui/Toast';
import { documentService } from '../../../api/services';
import { formatDate } from '../../../utils/agriHelpers';

const DOC_TYPES = [
  { key: 'RC', label: 'RC Book', icon: 'document-text-outline' },
  { key: 'INSURANCE', label: 'Insurance', icon: 'shield-checkmark-outline' },
  { key: 'PERMIT', label: 'Permit', icon: 'ribbon-outline' },
  { key: 'PUC', label: 'PUC', icon: 'leaf-outline' },
  { key: 'FITNESS', label: 'Fitness', icon: 'checkmark-circle-outline' },
];

function expiryStatus(expiryDate) {
  if (!expiryDate) return { label: 'No expiry set', variant: 'neutral' };
  const days = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
  if (days < 0) return { label: 'Expired', variant: 'error' };
  if (days <= 30) return { label: `Expires in ${days}d`, variant: 'warning' };
  return { label: `Valid till ${formatDate(expiryDate)}`, variant: 'success' };
}

export default function TractorDocumentsScreen({ route }) {
  const { COLORS, SIZES } = useTheme();
  const toast = useToast();
  const tractor = route?.params?.tractor || {};

  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ documentType: 'RC', documentNumber: '', expiryDate: '', fileUrl: '', fileName: '' });
  const set = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));

  const byType = Object.fromEntries(docs.map((d) => [d.documentType, d]));

  const load = useCallback(async () => {
    if (!tractor?.tractorId) return;
    try {
      const r = await documentService.byTractor(tractor.tractorId);
      setDocs(Array.isArray(r) ? r : []);
    } catch (e) {
      toast?.error?.('Could not load documents');
    } finally {
      setLoading(false);
    }
  }, [tractor?.tractorId]);

  useFocusEffect(useCallback(() => { load(); }, [load]));
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const openFor = (typeKey) => {
    const existing = byType[typeKey];
    setForm({
      documentType: typeKey,
      documentNumber: existing?.documentNumber || '',
      expiryDate: existing?.expiryDate || '',
      fileUrl: existing?.fileUrl || '',
      fileName: existing ? 'Current file attached' : '',
    });
    setOpen(true);
  };

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: ['application/pdf', 'image/*'], copyToCacheDirectory: true });
    if (result.canceled || !result.assets?.[0]) return;
    const asset = result.assets[0];

    const formData = new FormData();
    formData.append('file', { uri: asset.uri, name: asset.name || 'document.pdf', type: asset.mimeType || 'application/pdf' });

    setUploading(true);
    try {
      const res = await documentService.uploadFile(formData);
      set('fileUrl')(res?.url || '');
      set('fileName')(asset.name || 'document');
      toast?.success?.('File uploaded');
    } catch (e) {
      toast?.error?.('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const onSave = async () => {
    if (!form.fileUrl) { toast?.error?.('Attach a file first'); return; }
    setUploading(true);
    try {
      await documentService.upload({
        tractorId: tractor.tractorId,
        documentType: form.documentType,
        documentNumber: form.documentNumber || null,
        expiryDate: form.expiryDate || null,
        fileUrl: form.fileUrl,
      });
      toast?.success?.('Document saved');
      setOpen(false);
      load();
    } catch (e) {
      toast?.error?.(e?.message || 'Save failed');
    } finally {
      setUploading(false);
    }
  };

  const previewOrDownload = (doc) => {
    if (!doc?.fileUrl) return;
    Linking.openURL(doc.fileUrl).catch(() => toast?.error?.('Could not open file'));
  };

  return (
    <ScreenWrapper scroll paddingHorizontal={0} onRefresh={onRefresh} refreshing={refreshing}
      header={<AppHeader title="Tractor Documents" subtitle={tractor.model || tractor.registrationNumber || `Tractor #${tractor.tractorId}`}
        variant="primary" showBack />}
    >
      <View style={{ paddingHorizontal: SIZES.padding.container, paddingTop: 12 }}>
        {DOC_TYPES.map((type) => {
          const doc = byType[type.key];
          const status = doc ? expiryStatus(doc.expiryDate) : { label: 'Not uploaded', variant: 'neutral' };
          return (
            <AppCard key={type.key} style={{ marginBottom: 10 }} onPress={() => openFor(type.key)}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={[{ width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }, { backgroundColor: COLORS.primaryPale }]}>
                  <Ionicons name={type.icon} size={20} color={COLORS.primary} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <AppText variant="bodyMedium">{type.label}</AppText>
                  <AppText variant="caption" color={COLORS.textSecondary}>
                    {doc?.documentNumber || (doc ? 'No document number' : 'Tap to upload')}
                  </AppText>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <AppBadge label={status.label} variant={status.variant} size="sm" />
                  {!!doc && (
                    <View style={{ flexDirection: 'row', marginTop: 6 }}>
                      <TouchableOpacity onPress={() => previewOrDownload(doc)} style={{ marginRight: 10 }}>
                        <Ionicons name="eye-outline" size={16} color={COLORS.primary} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => previewOrDownload(doc)}>
                        <Ionicons name="download-outline" size={16} color={COLORS.primary} />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </AppCard>
          );
        })}
      </View>

      <AppModal visible={open} onClose={() => setOpen(false)}
        title={`${byType[form.documentType] ? 'Replace' : 'Upload'} ${DOC_TYPES.find((t) => t.key === form.documentType)?.label || 'Document'}`}
        position="bottom">
        <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 460 }}>
          <AppText variant="label" style={{ marginBottom: 6 }}>Document Type</AppText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 }}>
            {DOC_TYPES.map((t) => (
              <View key={t.key} style={{ marginRight: 8, marginBottom: 8 }}>
                <AppChip label={t.label} selected={form.documentType === t.key} onPress={() => set('documentType')(t.key)} />
              </View>
            ))}
          </View>

          <AppInput label="Document Number" value={form.documentNumber} onChangeText={set('documentNumber')} />
          <AppInput label="Expiry Date (YYYY-MM-DD)" value={form.expiryDate} onChangeText={set('expiryDate')} />

          <AppButton
            label={form.fileName || 'Select File (PDF/Image)'}
            variant="outline" leftIcon="cloud-upload-outline" loading={uploading}
            onPress={pickFile} style={{ marginTop: 6, marginBottom: 12 }}
          />

          <AppButton label="Save Document" onPress={onSave} loading={uploading} />
        </ScrollView>
      </AppModal>
    </ScreenWrapper>
  );
}
