import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../components/layout/Screen';
import { AlertCard } from '../../components/feature/AlertCard';
import { EmptyState } from '../../components/feature/EmptyState';
import { useAlerts } from '../../hooks/useAlerts';
import { theme } from '../../constants/theme';
import { AlertProfile } from '../../services/alerts';

export default function AlertsScreen() {
  const router = useRouter();
  const { alerts, loading, refreshing, toggleAlert, deleteAlert, refresh } = useAlerts();

  const handleToggle = async (alertId: string, isActive: boolean) => {
    const { error } = await toggleAlert(alertId, isActive);
    if (error) {
      Alert.alert('Error', 'Failed to update alert');
    }
  };

  const handleEdit = (alert: AlertProfile) => {
    // Will implement in Phase 2
    Alert.alert('Coming Soon', 'Edit functionality will be available soon');
  };

  const handleDelete = async (alertId: string) => {
    Alert.alert(
      'Delete Alert',
      'Are you sure you want to delete this alert?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const { error } = await deleteAlert(alertId);
            if (error) {
              Alert.alert('Error', 'Failed to delete alert');
            }
          },
        },
      ]
    );
  };

  const renderAlert = ({ item }: { item: AlertProfile }) => (
    <AlertCard
      alert={item}
      onToggle={(isActive) => handleToggle(item.id, isActive)}
      onEdit={() => handleEdit(item)}
      onDelete={() => handleDelete(item.id)}
    />
  );

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>My Alerts</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/create-alert')}
        >
          <Ionicons name="add" size={24} color={theme.colors.background} />
        </TouchableOpacity>
      </View>

      {alerts.length === 0 && !loading ? (
        <EmptyState
          icon="notifications-outline"
          title="No alerts yet"
          message="Create your first alert to start monitoring marketplace listings"
        />
      ) : (
        <FlatList
          data={alerts}
          renderItem={renderAlert}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              tintColor={theme.colors.primary}
            />
          }
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
  },

  addButton: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.md,
  },

  list: {
    padding: theme.spacing.md,
  },
});
