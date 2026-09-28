import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import {
  BackHeader,
  ScoreBadge,
  Card,
} from '../components/UI';

import { listPredictions } from '../services/api';

import {
  colors,
  spacing,
  radius,
} from '../theme';

type RiskLevel = 'alto' | 'medio' | 'baixo';

type ActionHistory = {
  id: number;
  text: string;
  date: string;
  icon: keyof typeof Ionicons.glyphMap;
};

type MockPrediction = {
  id: number;
  customerName: string;
  customerEmail: string;
  phone: string;
  vin: string;
  predictionDate: string;
  retentionScore: number;
  risk: RiskLevel;
  vehicle: string;
  lastService: string;
  riskFactors: string[];
  actionHistory: ActionHistory[];
};


function mapRisk(score: number): RiskLevel {
  if (score < 40) return 'alto';
  if (score < 70) return 'medio';
  return 'baixo';
}

function mapApiPrediction(api: {
  id: number;
  vin: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  retentionScore: number;
  predictionDate: string;
}): MockPrediction {
  return {
    id: api.id,
    customerName: api.customerName,
    customerEmail: api.customerEmail,
    phone: api.phone,
    vin: api.vin,
    predictionDate: api.predictionDate,
    retentionScore: api.retentionScore,
    risk: mapRisk(api.retentionScore),
    vehicle: 'Não informado',
    lastService: 'Não informado',
    riskFactors: [],
    actionHistory: [],
  };
}

function getRiskLabel(risk: RiskLevel) {
  if (risk === 'alto') {
    return 'Alto risco';
  }

  if (risk === 'medio') {
    return 'Médio risco';
  }

  return 'Baixo risco';
}

function getRiskColor(risk: RiskLevel) {
  if (risk === 'alto') {
    return colors.scoreLow;
  }

  if (risk === 'medio') {
    return colors.scoreMid;
  }

  return colors.scoreHigh;
}

function PredictionCard({
  item,
  onPress,
}: {
  item: MockPrediction;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Card style={styles.predCard}>
        <View style={styles.predRow}>
          <View style={styles.predInfo}>
            <Text style={styles.predName}>
              {item.customerName}
            </Text>

            <Text style={styles.predVehicle}>
              {item.vehicle}
            </Text>

            <Text style={styles.predVin}>
              VIN: {item.vin}
            </Text>

            <View style={styles.riskRow}>
              <View
                style={[
                  styles.riskDot,
                  {
                    backgroundColor: getRiskColor(
                      item.risk
                    ),
                  },
                ]}
              />

              <Text
                style={[
                  styles.riskText,
                  {
                    color: getRiskColor(
                      item.risk
                    ),
                  },
                ]}
              >
                {getRiskLabel(item.risk)}
              </Text>
            </View>
          </View>

          <ScoreBadge
            score={item.retentionScore}
          />
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.dateText}>
            Análise:{' '}
            {new Date(
              item.predictionDate
            ).toLocaleDateString('pt-BR')}
          </Text>

          <View style={styles.detailsButton}>
            <Text style={styles.detailsText}>
              Ver detalhes
            </Text>

            <Ionicons
              name="chevron-forward-outline"
              size={15}
              color={colors.accent}
            />
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

export default function PredictionsScreen({
  navigation,
}: any) {
  const [search, setSearch] = useState('');

  const [filter, setFilter] = useState<
    'todos' | RiskLevel
  >('todos');

  const [predictions, setPredictions] = useState<MockPrediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fetchPredictions = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const page = await listPredictions(0, 50);
      setPredictions(page.content.map(mapApiPrediction));
    } catch (err) {
      setLoadError('Não foi possível carregar os clientes. Puxe para atualizar ou tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  
  useFocusEffect(
    useCallback(() => {
      fetchPredictions();
    }, [fetchPredictions])
  );

  const filteredPredictions = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return predictions.filter(
      (item) => {
        const matchesSearch =
          !normalizedSearch ||
          item.customerName
            .toLowerCase()
            .includes(normalizedSearch) ||
          item.vin
            .toLowerCase()
            .includes(normalizedSearch);

        const matchesFilter =
          filter === 'todos' ||
          item.risk === filter;

        return (
          matchesSearch &&
          matchesFilter
        );
      }
    );
  }, [search, filter, predictions]);

  function handlePredictionPress(
    item: MockPrediction
  ) {
    navigation.navigate(
      'PredictionDetail',
      {
        prediction: item,
      }
    );
  }

  function handleSearch() {
    if (!search.trim()) {
      Alert.alert(
        'Buscar cliente',
        'Digite o nome ou VIN do cliente.'
      );
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <BackHeader
            title="Retenção de Clientes"
            onBack={() =>
              navigation.goBack()
            }
          />

          <Text style={styles.subtitle}>
            Identifique clientes com risco de
            abandono e tome ações preventivas.
          </Text>

          <View style={styles.searchBar}>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Buscar por nome ou VIN..."
              placeholderTextColor={
                colors.textMuted
              }
              style={styles.searchInput}
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={styles.searchBtn}
              onPress={handleSearch}
              activeOpacity={0.8}
            >
              <Ionicons
                name="search-outline"
                size={20}
                color={colors.textPrimary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.filters}>
            {[
              {
                key: 'todos',
                label: 'Todos',
              },
              {
                key: 'alto',
                label: 'Alto',
              },
              {
                key: 'medio',
                label: 'Médio',
              },
              {
                key: 'baixo',
                label: 'Baixo',
              },
            ].map((item) => (
              <TouchableOpacity
                key={item.key}
                onPress={() =>
                  setFilter(
                    item.key as
                      | 'todos'
                      | RiskLevel
                  )
                }
                style={[
                  styles.filterButton,
                  filter === item.key &&
                    styles.filterButtonActive,
                ]}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filterText,
                    filter === item.key &&
                      styles.filterTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.summary}>
          <View>
            <Text style={styles.summaryLabel}>
              CLIENTES MONITORADOS
            </Text>

            <Text style={styles.summaryValue}>
              {filteredPredictions.length}
            </Text>
          </View>

          <View style={styles.summaryRisk}>
            <Text style={styles.summaryLabel}>
              ALTO RISCO
            </Text>

            <Text
              style={[
                styles.summaryValue,
                {
                  color: colors.scoreLow,
                },
              ]}
            >
              {
                predictions.filter(
                  (item) =>
                    item.risk === 'alto'
                ).length
              }
            </Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Carregando clientes...</Text>
          </View>
        ) : loadError ? (
          <View style={styles.empty}>
            <Ionicons
              name="alert-circle-outline"
              size={42}
              color={colors.scoreLow}
              style={{ marginBottom: spacing.md }}
            />
            <Text style={styles.emptyTitle}>{loadError}</Text>
            <TouchableOpacity onPress={fetchPredictions} style={{ marginTop: spacing.md }}>
              <Text style={{ color: colors.accent, fontWeight: '600' }}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : filteredPredictions.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons
              name="search-outline"
              size={42}
              color={colors.textMuted}
              style={{
                marginBottom: spacing.md,
              }}
            />

            <Text style={styles.emptyTitle}>
              Nenhum cliente encontrado
            </Text>

            <Text style={styles.emptyText}>
              Tente outro nome, VIN ou filtro.
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredPredictions}
            keyExtractor={(item) =>
              item.id.toString()
            }
            renderItem={({ item }) => (
              <PredictionCard
                item={item}
                onPress={() =>
                  handlePredictionPress(
                    item
                  )
                }
              />
            )}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={
              false
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  container: {
    flex: 1,
  },

  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  subtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: spacing.md,
  },

  searchBar: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  searchInput: {
    flex: 1,
    backgroundColor: colors.bgInput,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 11,
    color: colors.textPrimary,
    fontSize: 13,
  },

  searchBtn: {
    width: 46,
    backgroundColor: colors.fordBlueLight,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  filters: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },

  filterButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgInput,
  },

  filterButtonActive: {
    backgroundColor: colors.fordBlueLight,
    borderColor: colors.fordBlueLight,
  },

  filterText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },

  filterTextActive: {
    color: colors.textPrimary,
  },

  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },

  summaryRisk: {
    alignItems: 'flex-end',
  },

  summaryLabel: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
  },

  summaryValue: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    marginTop: 2,
  },

  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.sm,
  },

  predCard: {
    padding: spacing.md,
  },

  predRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },

  predInfo: {
    flex: 1,
  },

  predName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  predVehicle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },

  predVin: {
    fontSize: 10,
    color: colors.accent,
    fontFamily: 'Courier New',
    letterSpacing: 0.5,
    marginTop: 3,
  },

  riskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 8,
  },

  riskDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },

  riskText: {
    fontSize: 10,
    fontWeight: '700',
  },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
  },

  dateText: {
    fontSize: 9,
    color: colors.textMuted,
  },

  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },

  detailsText: {
    fontSize: 10,
    color: colors.accent,
    fontWeight: '700',
  },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },

  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },

  emptyText: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: spacing.xs,
  },
});