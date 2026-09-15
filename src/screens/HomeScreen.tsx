import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, radius, shadow } from '../theme';

interface MenuCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  badge?: string;
  color: string;
  info: string;
  onPress: () => void;
}

function MenuCard({
  icon,
  title,
  subtitle,
  badge,
  color,
  info,
  onPress,
}: MenuCardProps) {
  return (
    <TouchableOpacity
      style={[
        styles.menuCard,
        { borderColor: color + '44' },
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View
        style={[
          styles.iconBox,
          { backgroundColor: color + '18' },
        ]}
      >
        <Ionicons
          name={icon}
          size={24}
          color={color}
        />
      </View>

      <View style={styles.menuInfo}>
        <View style={styles.titleRow}>
          <Text style={styles.menuTitle}>
            {title}
          </Text>

          {badge && (
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: color + '22',
                  borderColor: color,
                },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { color },
                ]}
              >
                {badge}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.menuSub}>
          {subtitle}
        </Text>

        <View style={styles.infoRow}>
          <Ionicons
            name="information-circle-outline"
            size={13}
            color={color}
          />

          <Text
            style={[
              styles.infoText,
              { color },
            ]}
          >
            {info}
          </Text>
        </View>
      </View>

      <Ionicons
        name="chevron-forward-outline"
        size={20}
        color={colors.textMuted}
      />
    </TouchableOpacity>
  );
}

export default function HomeScreen({ navigation }: any) {
  const { userName, logout } = useAuth();

  function handleLogout() {
    Alert.alert(
      'Sair',
      'Deseja encerrar sua sessão?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  }

  const firstName =
    userName?.split(' ')[0] ?? 'Consultor';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Top bar */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greet}>
              Olá, {firstName}
            </Text>

            <View style={styles.roleRow}>
              <View style={styles.statusDot} />

              <Text style={styles.role}>
                Consultor Ford
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleLogout}
            style={styles.logoutBtn}
            activeOpacity={0.7}
          >
            <Ionicons
              name="log-out-outline"
              size={16}
              color={colors.textSecondary}
            />

            <Text style={styles.logoutText}>
              Sair
            </Text>
          </TouchableOpacity>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroGlow} />
          <View style={styles.heroAccent} />

          <View style={styles.heroTop}>
            <View style={styles.activePill}>
              <View style={styles.activeDot} />

              <Text style={styles.heroLabel}>
                SISTEMA ATIVO
              </Text>
            </View>

            <Ionicons
              name="radio-outline"
              size={22}
              color={colors.accent}
            />
          </View>

          <Text style={styles.heroTitle}>
            Ford Radar
          </Text>

          <Text style={styles.heroSub}>
            Inteligência competitiva e retenção
            de clientes para apoiar suas
            apresentações.
          </Text>

          <View style={styles.heroStats}>
            <View style={styles.heroStat}>
              <Ionicons
                name="flash-outline"
                size={16}
                color={colors.accent}
              />

              <View>
                <Text style={styles.statValue}>
                  IA
                </Text>

                <Text style={styles.statLabel}>
                  Análise
                </Text>
              </View>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.heroStat}>
              <Ionicons
                name="people-outline"
                size={16}
                color={colors.accent}
              />

              <View>
                <Text style={styles.statValue}>
                  Clientes
                </Text>

                <Text style={styles.statLabel}>
                  Retenção
                </Text>
              </View>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.heroStat}>
              <Ionicons
                name="analytics-outline"
                size={16}
                color={colors.accent}
              />

              <View>
                <Text style={styles.statValue}>
                  Radar
                </Text>

                <Text style={styles.statLabel}>
                  Competitivo
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Section */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionLabel}>
              MÓDULOS
            </Text>

            <Text style={styles.sectionTitle}>
              O que você deseja analisar?
            </Text>
          </View>

          <View style={styles.moduleCount}>
            <Text style={styles.moduleCountText}>
              02
            </Text>
          </View>
        </View>

        {/* Menu */}
        <MenuCard
          icon="flash-outline"
          title="Radar da Concorrência"
          subtitle="Compare especificações de veículos com auxílio da IA."
          badge="IA"
          color={colors.accent}
          info="Análise competitiva"
          onPress={() =>
            navigation.navigate('Compare')
          }
        />

        <MenuCard
          icon="analytics-outline"
          title="Retenção de Clientes"
          subtitle="Visualize scores preditivos de fidelização."
          color={colors.success}
          info="Análise de risco"
          onPress={() =>
            navigation.navigate('Predictions')
          }
        />

        {/* Footer hint */}
        <View style={styles.hint}>
          <View style={styles.hintIcon}>
            <Ionicons
              name="bulb-outline"
              size={19}
              color={colors.warning}
            />
          </View>

          <View style={styles.hintContent}>
            <Text style={styles.hintTitle}>
              Dica rápida
            </Text>

            <Text style={styles.hintText}>
              Use o Radar antes de cada
              apresentação para ter argumentos
              técnicos mais precisos.
            </Text>
          </View>
        </View>

        <Text style={styles.version}>
          Ford Radar
        </Text>
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

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  greet: {
    fontSize: 19,
    fontWeight: '800',
    color: colors.textPrimary,
  },

  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },

  role: {
    fontSize: 11,
    color: colors.textSecondary,
    letterSpacing: 0.4,
  },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },

  logoutText: {
    color: colors.textSecondary,
    fontSize: 12,
  },

  hero: {
    backgroundColor: colors.fordBlueDark,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.fordBlue,
    overflow: 'hidden',
    position: 'relative',
  },

  heroGlow: {
    position: 'absolute',
    top: -90,
    right: -70,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.accent + '08',
  },

  heroAccent: {
    position: 'absolute',
    bottom: -55,
    left: -45,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.accent + '06',
  },

  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },

  heroLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2.5,
    color: colors.accent,
  },

  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 2,
    marginTop: 8,
    marginBottom: 4,
  },

  heroSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.62)',
    lineHeight: 19,
    maxWidth: 320,
  },

  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },

  heroStat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginHorizontal: 5,
  },

  statValue: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },

  statLabel: {
    color: 'rgba(255,255,255,0.42)',
    fontSize: 8,
    marginTop: 1,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },

  sectionLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2.5,
    color: colors.textMuted,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 3,
  },

  moduleCount: {
    width: 30,
    height: 30,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
  },

  moduleCountText: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '700',
  },

  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    gap: spacing.md,
    ...shadow.card,
  },

  iconBox: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  menuInfo: {
    flex: 1,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  menuTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  menuSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 3,
    lineHeight: 16,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 7,
  },

  infoText: {
    fontSize: 9,
    fontWeight: '600',
  },

  badge: {
    borderRadius: radius.full,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderWidth: 1,
  },

  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warningBg,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.warning + '44',
    gap: spacing.sm,
  },

  hintIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.warning + '12',
  },

  hintContent: {
    flex: 1,
  },

  hintTitle: {
    color: colors.warning,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 2,
  },

  hintText: {
    color: colors.warning,
    fontSize: 11,
    lineHeight: 16,
  },

  version: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 9,
    marginTop: spacing.lg,
    opacity: 0.7,
  },
});
