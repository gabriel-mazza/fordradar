import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { register } from '../services/api';
import { Button, Input, BackHeader } from '../components/UI';
import { colors, spacing, radius } from '../theme';

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};

    if (name.trim().length < 2) e.name = 'Nome muito curto';
    if (!email.includes('@')) e.email = 'E-mail inválido';
    if (password.length < 6) e.password = 'Senha: mínimo 6 caracteres';

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleRegister() {
    if (!validate()) return;

    setLoading(true);

    try {
      await register(name.trim(), email.trim(), password);

      Alert.alert('Conta criada!', 'Faça login para continuar.', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Login'),
        },
      ]);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        'Erro ao criar conta. Tente novamente.';

      Alert.alert('Erro', msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho */}
        <BackHeader
          title="Criar Conta"
          onBack={() => navigation.goBack()}
        />

        {/* Card de cadastro */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.headerContent}>
              <Text style={styles.title}>Novo Consultor</Text>
              <Text style={styles.sub}>
                Crie seu acesso para começar a utilizar o Ford Radar
              </Text>
            </View>

            <View style={styles.statusDot} />
          </View>

          <View style={styles.divider} />

          {/* Dados pessoais */}
          <Text style={styles.sectionLabel}>DADOS DE ACESSO</Text>

          <Input
            label="Nome completo"
            value={name}
            onChangeText={setName}
            placeholder="João Silva"
            autoCapitalize="words"
            error={errors.name}
          />

          <Input
            label="E-mail corporativo"
            value={email}
            onChangeText={setEmail}
            placeholder="joao@ford.com.br"
            keyboardType="email-address"
            error={errors.email}
          />

          <Input
            label="Senha"
            value={password}
            onChangeText={setPassword}
            placeholder="Mínimo 6 caracteres"
            secureTextEntry
            error={errors.password}
          />

          {/* Perfil */}
          <View style={styles.roleInfo}>
            <View style={styles.roleIcon}>
              <Text style={styles.roleIconText}>✓</Text>
            </View>

            <View style={styles.roleContent}>
              <Text style={styles.roleTitle}>Perfil de acesso</Text>
              <Text style={styles.roleDescription}>
                Sua conta será criada como Consultor (Analista).
              </Text>
            </View>
          </View>

          <Button
            title="CRIAR CONTA"
            onPress={handleRegister}
            loading={loading}
            style={styles.btn}
          />

          {/* Segurança */}
          <View style={styles.security}>
            <Text style={styles.securityIcon}>✓</Text>
            <Text style={styles.securityText}>
              Seus dados são utilizados de forma segura
            </Text>
          </View>
        </View>

        {/* Rodapé */}
        <View style={styles.footer}>
          <View style={styles.footerLine} />

          <Text style={styles.footerText}>
            FORD RADAR
          </Text>

          <View style={styles.footerLine} />
        </View>
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
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },

  /* =========================
     CARD
  ========================= */

  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.md,

    // Sombra discreta
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 5,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerContent: {
    flex: 1,
    paddingRight: spacing.md,
  },

  title: {
    fontSize: 21,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },

  sub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },

  /* =========================
     SEÇÃO
  ========================= */

  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.accent,
    letterSpacing: 1.4,
    marginBottom: spacing.md,
  },

  /* =========================
     PERFIL
  ========================= */

  roleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentGlow,
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.accentDim,
  },

  roleIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    marginRight: spacing.sm,
  },

  roleIconText: {
    color: colors.bg,
    fontSize: 13,
    fontWeight: '900',
  },

  roleContent: {
    flex: 1,
  },

  roleTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 2,
  },

  roleDescription: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
  },

  /* =========================
     BOTÃO
  ========================= */

  btn: {
    marginTop: spacing.xs,
  },

  /* =========================
     SEGURANÇA
  ========================= */

  security: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    gap: 6,
  },

  securityIcon: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '800',
  },

  securityText: {
    fontSize: 11,
    color: colors.textMuted,
  },

  /* =========================
     FOOTER
  ========================= */

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },

  footerLine: {
    width: 30,
    height: 1,
    backgroundColor: colors.border,
  },

  footerText: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 1,
  },
});