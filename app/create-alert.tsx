import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../components/layout/Screen';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAlerts } from '../hooks/useAlerts';
import { theme } from '../constants/theme';

const MARKETPLACES = ['Facebook Marketplace', 'Kijiji', 'Craigslist'];
const CONDITIONS = ['Any', 'New', 'Used'];

export default function CreateAlertScreen() {
  const router = useRouter();
  const { createAlert } = useAlerts();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [keywords, setKeywords] = useState('');
  const [excludeKeywords, setExcludeKeywords] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [location, setLocation] = useState('');
  const [radiusKm, setRadiusKm] = useState('');
  const [condition, setCondition] = useState('Any');
  const [selectedMarketplaces, setSelectedMarketplaces] = useState<string[]>([]);

  const toggleMarketplace = (marketplace: string) => {
    setSelectedMarketplaces((prev) =>
      prev.includes(marketplace)
        ? prev.filter((m) => m !== marketplace)
        : [...prev, marketplace]
    );
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter an alert name');
      return;
    }

    if (selectedMarketplaces.length === 0) {
      Alert.alert('Error', 'Please select at least one marketplace');
      return;
    }

    setLoading(true);

    const alertData = {
      name: name.trim(),
      keywords_include: keywords
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean),
      keywords_exclude: excludeKeywords
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean),
      price_min: priceMin ? parseInt(priceMin, 10) : undefined,
      price_max: priceMax ? parseInt(priceMax, 10) : undefined,
      location: location.trim() || undefined,
      radius_km: radiusKm ? parseInt(radiusKm, 10) : undefined,
      condition: condition === 'Any' ? undefined : condition.toLowerCase(),
      marketplaces: selectedMarketplaces,
    };

    const { error } = await createAlert(alertData);
    setLoading(false);

    if (error) {
      Alert.alert('Error', 'Failed to create alert. Please try again.');
    } else {
      router.back();
    }
  };

  return (
    <Screen topInset={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Input
            label="Alert Name"
            value={name}
            onChangeText={setName}
            placeholder="e.g., Gaming PC under $1000"
          />

          <Input
            label="Keywords (comma separated)"
            value={keywords}
            onChangeText={setKeywords}
            placeholder="e.g., gaming, computer, RTX"
            multiline
          />

          <Input
            label="Exclude Keywords (comma separated)"
            value={excludeKeywords}
            onChangeText={setExcludeKeywords}
            placeholder="e.g., broken, damaged"
            multiline
          />

          <View style={styles.row}>
            <Input
              label="Min Price"
              value={priceMin}
              onChangeText={setPriceMin}
              placeholder="0"
              keyboardType="numeric"
              style={styles.halfInput}
            />
            <Input
              label="Max Price"
              value={priceMax}
              onChangeText={setPriceMax}
              placeholder="999999"
              keyboardType="numeric"
              style={styles.halfInput}
            />
          </View>

          <Input
            label="Location"
            value={location}
            onChangeText={setLocation}
            placeholder="e.g., Toronto"
          />

          <Input
            label="Search Radius (km)"
            value={radiusKm}
            onChangeText={setRadiusKm}
            placeholder="50"
            keyboardType="numeric"
          />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Condition</Text>
            <View style={styles.chipContainer}>
              {CONDITIONS.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[styles.chip, condition === c && styles.chipActive]}
                  onPress={() => setCondition(c)}
                >
                  <Text style={[styles.chipText, condition === c && styles.chipTextActive]}>
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Marketplaces</Text>
            <View style={styles.chipContainer}>
              {MARKETPLACES.map((marketplace) => (
                <TouchableOpacity
                  key={marketplace}
                  style={[
                    styles.chip,
                    selectedMarketplaces.includes(marketplace) && styles.chipActive,
                  ]}
                  onPress={() => toggleMarketplace(marketplace)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedMarketplaces.includes(marketplace) && styles.chipTextActive,
                    ]}
                  >
                    {marketplace}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Button
            title="Create Alert"
            onPress={handleSubmit}
            loading={loading}
            fullWidth
            size="lg"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    padding: theme.spacing.md,
  },

  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },

  halfInput: {
    flex: 1,
  },

  section: {
    marginBottom: theme.spacing.lg,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },

  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },

  chip: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },

  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },

  chipText: {
    fontSize: 14,
    color: theme.colors.text,
  },

  chipTextActive: {
    color: theme.colors.background,
    fontWeight: '500',
  },
});
