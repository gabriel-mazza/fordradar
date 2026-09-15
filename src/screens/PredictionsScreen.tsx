import React, { useMemo, useState } from 'react';
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

import {
  BackHeader,
  ScoreBadge,
  Card,
} from '../components/UI';

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

const MOCK_PREDICTIONS: MockPrediction[] = [
  {
    id: 1,
    customerName: 'João da Silva',
    customerEmail: 'joao.silva@email.com',
    phone: '(11) 99999-1001',
    vin: '9BWZZZ377VT004251',
    predictionDate: '2026-09-12',
    retentionScore: 28.5,
    risk: 'alto',
    vehicle: 'Ford Territory 2025',
    lastService: '08/02/2026',
    riskFactors: [
      'Última revisão há mais de 6 meses',
      'Baixa frequência de contato',
      'Não realizou a revisão recomendada',
    ],
    actionHistory: [
      {
        id: 101,
        text: 'Acompanhamento prioritário agendado',
        date: '11/09/2026 15:20',
        icon: 'calendar-outline',
      },
      {
        id: 102,
        text: 'Contato de relacionamento realizado',
        date: '10/09/2026 10:45',
        icon: 'call-outline',
      },
      {
        id: 103,
        text: 'Revisão preventiva recomendada',
        date: '04/09/2026 14:10',
        icon: 'construct-outline',
      },
    ],
  },

  {
    id: 2,
    customerName: 'Maria Oliveira',
    customerEmail: 'maria.oliveira@email.com',
    phone: '(11) 98888-2002',
    vin: '8AFZZZ377VT008912',
    predictionDate: '2026-09-12',
    retentionScore: 78.4,
    risk: 'baixo',
    vehicle: 'Ford Mustang Mach-E',
    lastService: '21/07/2026',
    riskFactors: [
      'Revisões em dia',
      'Bom histórico de relacionamento',
    ],
    actionHistory: [
      {
        id: 201,
        text: 'Acompanhamento de relacionamento registrado',
        date: '05/09/2026 11:30',
        icon: 'checkmark-circle-outline',
      },
      {
        id: 202,
        text: 'Contato de relacionamento realizado',
        date: '28/08/2026 16:15',
        icon: 'call-outline',
      },
      {
        id: 203,
        text: 'Revisão de manutenção realizada',
        date: '21/07/2026 09:40',
        icon: 'construct-outline',
      },
    ],
  },

  {
    id: 3,
    customerName: 'Carlos Santos',
    customerEmail: 'carlos.santos@email.com',
    phone: '(11) 97777-3003',
    vin: '9BFZZZ377VT002345',
    predictionDate: '2026-09-11',
    retentionScore: 51.2,
    risk: 'medio',
    vehicle: 'Ford Ranger 2024',
    lastService: '15/04/2026',
    riskFactors: [
      'Intervalo elevado desde a última revisão',
      'Pouca interação recente',
    ],
    actionHistory: [
      {
        id: 301,
        text: 'Acompanhamento agendado',
        date: '10/09/2026 13:20',
        icon: 'calendar-outline',
      },
      {
        id: 302,
        text: 'Contato com cliente registrado',
        date: '08/09/2026 09:50',
        icon: 'call-outline',
      },
    ],
  },

  {
    id: 4,
    customerName: 'Ana Paula Costa',
    customerEmail: 'ana.costa@email.com',
    phone: '(11) 96666-4004',
    vin: '8AFZZZ377VT005678',
    predictionDate: '2026-09-10',
    retentionScore: 84.7,
    risk: 'baixo',
    vehicle: 'Ford Bronco Sport 2025',
    lastService: '02/08/2026',
    riskFactors: [
      'Revisões em dia',
      'Alta interação com a concessionária',
    ],
    actionHistory: [
      {
        id: 401,
        text: 'Oportunidade de renovação apresentada',
        date: '02/09/2026 14:35',
        icon: 'car-outline',
      },
      {
        id: 402,
        text: 'Contato de relacionamento realizado',
        date: '15/08/2026 10:20',
        icon: 'call-outline',
      },
      {
        id: 403,
        text: 'Revisão preventiva concluída',
        date: '02/08/2026 08:55',
        icon: 'checkmark-circle-outline',
      },
    ],
  },

  {
    id: 5,
    customerName: 'Ricardo Mendes',
    customerEmail: 'ricardo.mendes@email.com',
    phone: '(11) 95555-5005',
    vin: '9BWZZZ377VT007891',
    predictionDate: '2026-09-09',
    retentionScore: 35.8,
    risk: 'alto',
    vehicle: 'Ford Maverick 2024',
    lastService: '12/01/2026',
    riskFactors: [
      'Revisão atrasada',
      'Queda na frequência de visitas',
      'Cliente sem contato recente',
    ],
    actionHistory: [
      {
        id: 501,
        text: 'Plano de retenção registrado',
        date: '09/09/2026 16:40',
        icon: 'shield-checkmark-outline',
      },
      {
        id: 502,
        text: 'Acompanhamento prioritário agendado',
        date: '08/09/2026 11:15',
        icon: 'calendar-outline',
      },
      {
        id: 503,
        text: 'Tentativa de contato registrada',
        date: '07/09/2026 09:25',
        icon: 'call-outline',
      },
    ],
  },

  {
    id: 6,
    customerName: 'Fernanda Lima',
    customerEmail: 'fernanda.lima@email.com',
    phone: '(11) 94444-6006',
    vin: '8AFZZZ377VT009876',
    predictionDate: '2026-09-08',
    retentionScore: 63.9,
    risk: 'medio',
    vehicle: 'Ford Territory 2024',
    lastService: '29/05/2026',
    riskFactors: [
      'Próxima revisão se aproximando',
      'Interação moderada com a concessionária',
    ],
    actionHistory: [
      {
        id: 601,
        text: 'Revisão preventiva recomendada',
        date: '06/09/2026 15:10',
        icon: 'construct-outline',
      },
      {
        id: 602,
        text: 'Contato de relacionamento realizado',
        date: '04/09/2026 10:35',
        icon: 'call-outline',
      },
      {
        id: 603,
        text: 'Acompanhamento de manutenção registrado',
        date: '01/09/2026 14:50',
        icon: 'car-outline',
      },
    ],
  },
];

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

  const filteredPredictions = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return MOCK_PREDICTIONS.filter(
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
  }, [search, filter]);

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
                MOCK_PREDICTIONS.filter(
                  (item) =>
                    item.risk === 'alto'
                ).length
              }
            </Text>
          </View>
        </View>

        {filteredPredictions.length === 0 ? (
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