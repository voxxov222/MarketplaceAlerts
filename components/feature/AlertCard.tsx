import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { theme } from '../../constants/theme';
import { AlertProfile } from '../../services/alerts';

interface AlertCardProps {
  alert: AlertProfile;
  onToggle: (isActive: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function AlertCard({ alert, onToggle, onEdit, onDelete }: AlertCardProps) {
  const priceRange = alert.price_min || alert.price_max
    ? `$${alert.price_min || 0} - $${alert.price_max || '∞'}`
    : 'Any price';

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{alert.name}</Text>
          <Switch
            value={alert.is_active}
            onValueChange={onToggle}
            trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
            thumbColor={alert.is_active ? theme.colors.primary : theme.colors.textTertiary}
          />
        </View>
      </View>

      <View style={styles.details}>
        {alert.keywords_include.length > 0 && (
          <View style={styles.detailRow}>
            <Ionicons name="search" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.detailText}>{alert.keywords_include.join(', ')}</Text>
          </View>
        )}
        
        <View style={styles.detailRow}>
          <Ionicons name="pricetag" size={16} color={theme.colors.textSecondary} />
          <Text style={styles.detailText}>{priceRange}</Text>
        </View>

        {alert.location && (
          <View style={styles.detailRow}>
            <Ionicons name="location" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.detailText}>
              {alert.location} {alert.radius_km ? `(${alert.radius_km}km)` : ''}
            </Text>
          </View>
        )}

        {alert.marketplaces.length > 0 && (
          <View style={styles.tags}>
            {alert.marketplaces.map((marketplace, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{marketplace}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
          <Ionicons name="create-outline" size={20} color={theme.colors.primary} />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
          <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
          <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.md,
  },

  header: {
    marginBottom: theme.spacing.md,
  },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    flex: 1,
  },

  details: {
    gap: theme.spacing.sm,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },

  detailText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    flex: 1,
  },

  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },

  tag: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },

  tagText: {
    fontSize: 12,
    color: theme.colors.background,
    fontWeight: '500',
  },

  actions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },

  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.primary,
  },

  deleteText: {
    color: theme.colors.error,
  },
});
