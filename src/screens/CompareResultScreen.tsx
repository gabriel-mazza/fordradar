import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { BackHeader, Card, SectionHeader } from '../components/UI';
import { colors, spacing, radius } from '../theme';
import { CompareResponse } from '../services/api';

const FORD_VEHICLE = {
  brand: 'Ford',
  model: 'Ranger',
  version: 'Raptor',
};

function parseSpec(techSpec: string): Record<string, string> {
  try {
    const parsed = JSON.parse(techSpec);
    if (typeof parsed === 'object' && parsed !== null) return parsed;
    return {};
  } catch {
    return {};
  }
}

function formatKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

function isUnavailable(val: string): boolean {
  if (!val || typeof val !== 'string') return true;
  return (
    val === 'empty / not available' ||
    val.toLowerCase().includes('não disponível') ||
    val.toLowerCase().includes('not available') ||
    val.toLowerCase() === 'null' ||
    val.toLowerCase() === 'n/a'
  );
}

interface RowProps {
  label: string;
  fordValue: string;
  competitorValue: string;
}

function CompareRow({ label, fordValue, competitorValue }: RowProps) {
  const compUnavailable = isUnavailable(competitorValue);
  const fordUnavailable = isUnavailable(fordValue);

  return (
    <View style={rowStyles.row}>
      <Text style={rowStyles.label}>{label}</Text>

      <View style={rowStyles.cells}>
        
        <View style={[rowStyles.cell, rowStyles.fordCell]}>
          <Text
            style={[
              rowStyles.cellText,
              fordUnavailable && rowStyles.unavailText,
            ]}
          >
            {fordUnavailable ? '—' : fordValue}
          </Text>
        </View>

       
        <View
          style={[
            rowStyles.cell,
            compUnavailable && rowStyles.unavailCell,
          ]}
        >
          {compUnavailable ? (
            <View style={rowStyles.unavailBadge}>
              <Text style={rowStyles.unavailBadgeText}>
                Não disponível
              </Text>
            </View>
          ) : (
            <Text style={rowStyles.cellText}>
              {competitorValue}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  row: {
    marginBottom: spacing.sm,
  },

  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 4,
  },

  cells: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  cell: {
    flex: 1,
    backgroundColor: colors.bgElevated,
    borderRadius: radius.sm,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },

  fordCell: {
    borderColor: colors.fordBlue + '88',
    backgroundColor: colors.fordBlueDark + 'AA',
  },

  unavailCell: {
    borderColor: colors.danger + '33',
    backgroundColor: colors.dangerBg,
  },

  cellText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
  },

  unavailText: {
    color: colors.textMuted,
  },

  unavailBadge: {
    backgroundColor: colors.danger + '22',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },

  unavailBadgeText: {
    color: colors.danger,
    fontSize: 11,
    fontWeight: '700',
  },
});

export default function CompareResultScreen({
  route,
  navigation,
}: any) {
  const { result, attributes } = route.params as {
    result: CompareResponse;
    attributes: string[];
  };

  const competitorSpec = useMemo(
    () => parseSpec(result.technicalSpec),
    [result.technicalSpec]
  );

  
  const fordSpec: Record<string, string> = {
    motor: '3.0L V6 EcoBoost Biturbo',
    potência: '397 cv a 5.650 rpm',
    torque: '583 Nm entre 3.500–3.800 rpm',
    transmissão: 'Automática 10 velocidades SelectShift',
    tração: '4WD com redu­tora eletrônica',
    amortecedores:
      'Fox Racing Shox com válvulas de controle interno',
    'capacidade de carga':
      '750 kg (1.000 kg com suporte)',
    'modos de condução':
      'Normal, Sport, Slippery, Mud/Ruts, Sand, Rock, Baja',
    consumo:
      '11,8 L/100km cidade / 9,2 L/100km estrada',
    dimensões:
      '5.410 x 2.028 x 1.873 mm',
    peso: '2.450 kg',
    freios:
      'Disco ventilado nas quatro rodas com ABS e EBD',
    suspensão:
      'Independente dianteira / eixo rígido com molas helicoidais traseira',
  };

  const displayAttributes =
    attributes.length > 0
      ? attributes
      : Object.keys(competitorSpec);

  const advantages = displayAttributes.filter((attr) => {
    const compVal = competitorSpec[attr] || '';
    return isUnavailable(compVal);
  });

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <BackHeader
          title="Resultado"
          onBack={() => navigation.goBack()}
        />

        
        <Card style={styles.summaryCard}>
          <View style={styles.vsRow}>
            
            <View style={styles.vsItem}>
              <View
                style={[
                  styles.brandBadge,
                  {
                    backgroundColor:
                      colors.fordBlue + '33',
                    borderColor: colors.fordBlue,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.brandLetter,
                    { color: colors.accent },
                  ]}
                >
                  F
                </Text>
              </View>

              <Text style={styles.vsVehicle}>
                {FORD_VEHICLE.model}
              </Text>

              <Text style={styles.vsVersion}>
                {FORD_VEHICLE.version}
              </Text>
            </View>

            <View style={styles.vsCenter}>
              <Text style={styles.vsText}>VS</Text>
            </View>

            
            <View style={styles.vsItem}>
              <View
                style={[
                  styles.brandBadge,
                  {
                    backgroundColor: colors.bgElevated,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.brandLetter,
                    { color: colors.textSecondary },
                  ]}
                >
                  {result.brand[0].toUpperCase()}
                </Text>
              </View>

              <Text style={styles.vsVehicle}>
                {result.model}
              </Text>

              <Text style={styles.vsVersion}>
                {result.version}
              </Text>
            </View>
          </View>
        </Card>

        
        {advantages.length > 0 && (
          <View style={styles.advantageBanner}>
            

            <Text style={styles.advantageText}>
              A Ranger Raptor tem vantagem em{' '}
              {advantages.length} atributo(s) que o
              concorrente não oferece.
            </Text>
          </View>
        )}

        
        <View style={styles.colHeaders}>
          <View style={styles.colHeaderCells}>
            <View
              style={[
                styles.colHeader,
                styles.colHeaderFord,
              ]}
            >
              <Text style={styles.colHeaderText}>
                Ford
              </Text>
            </View>

            <View style={styles.colHeader}>
              <Text style={styles.colHeaderText}>
                {result.brand}
              </Text>
            </View>
          </View>
        </View>

        
        <Card>
          {displayAttributes.map((attr, i) => {
            const fordVal =
              fordSpec[attr] || '—';

            const compVal =
              competitorSpec[attr] ||
              'não disponível';

            return (
              <View key={attr}>
                <CompareRow
                  label={formatKey(attr)}
                  fordValue={fordVal}
                  competitorValue={compVal}
                />

                {i <
                  displayAttributes.length - 1 && (
                  <View
                    style={styles.rowDivider}
                  />
                )}
              </View>
            );
          })}
        </Card>

        
        <View style={styles.retentionSection}>
          <SectionHeader
            title="Radar de Retenção"
            subtitle="Vantagens do pós-venda Ford para reforçar na venda"
          />

          <Card style={styles.retentionCard}>
            {[
              {
                icon: '',
                title: 'Plano de Revisões Ford',
                desc:
                  'Previsibilidade de custos com pacotes fixos anuais.',
              },
              {
                icon: '',
                title: 'Peças Originais Garantidas',
                desc:
                  'Logística nacional com peças disponíveis em 48h.',
              },
              {
                icon: '',
                title: 'Garantia Estendida',
                desc:
                  'Até 5 anos com cobertura total em toda rede Ford.',
              },
              {
                icon: '',
                title: 'FordPass Connect',
                desc:
                  'Monitoramento remoto, assistência 24h integrada.',
              },
            ].map((item) => (
              <View
                key={item.title}
                style={styles.retentionItem}
              >
                <Text
                  style={styles.retentionIcon}
                >
                  {item.icon}
                </Text>

                <View style={{ flex: 1 }}>
                  <Text
                    style={styles.retentionTitle}
                  >
                    {item.title}
                  </Text>

                  <Text
                    style={styles.retentionDesc}
                  >
                    {item.desc}
                  </Text>
                </View>
              </View>
            ))}
          </Card>
        </View>

        
        <TouchableOpacity
          style={styles.newBtn}
          onPress={() =>
            navigation.navigate('Compare')
          }
          activeOpacity={0.8}
        >
          <Text style={styles.newBtnText}>
            + Nova Comparação
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  scroll: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },

  summaryCard: {
    marginBottom: spacing.md,
  },

  vsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  vsItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },

  brandBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },

  brandLetter: {
    fontSize: 22,
    fontWeight: '900',
  },

  vsVehicle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },

  vsVersion: {
    fontSize: 11,
    color: colors.textSecondary,
  },

  vsCenter: {
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },

  vsText: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.textMuted,
    letterSpacing: 2,
  },

  advantageBanner: {
    flexDirection: 'row',
    backgroundColor: colors.successBg,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.success + '44',
    gap: spacing.sm,
    alignItems: 'center',
  },

  advantageIcon: {
    fontSize: 16,
  },

  advantageText: {
    color: colors.success,
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },

  colHeaders: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
    alignItems: 'center',
  },

  colHeaderCells: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
  },

  colHeader: {
    flex: 1,
    backgroundColor: colors.bgElevated,
    borderRadius: radius.sm,
    paddingVertical: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },

  colHeaderFord: {
    borderColor: colors.fordBlue,
    backgroundColor: colors.fordBlueDark + 'AA',
  },

  colHeaderText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },

  rowDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },

  retentionSection: {
    marginTop: spacing.lg,
  },

  retentionCard: {
    gap: spacing.sm,
  },

  retentionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },

  retentionIcon: {
    fontSize: 20,
    width: 28,
  },

  retentionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },

  retentionDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
  },

  newBtn: {
    marginTop: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.accent,
    borderRadius: radius.md,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },

  newBtnText: {
    color: colors.accent,
    fontWeight: '700',
    fontSize: 14,
  },
});