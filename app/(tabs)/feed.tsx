import { View, Text, StyleSheet } from 'react-native';
import { Screen } from '../../components/layout/Screen';
import { EmptyState } from '../../components/feature/EmptyState';
import { theme } from '../../constants/theme';

export default function FeedScreen() {
  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Matched Listings</Text>
      </View>

      <EmptyState
        icon="newspaper-outline"
        title="No matches yet"
        message="New listings that match your alerts will appear here"
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
  },
});
