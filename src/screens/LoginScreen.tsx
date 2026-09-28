import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/api';
import { Button, Input } from '../components/UI';
import { colors, spacing, radius } from '../theme';

export default function LoginScreen({ navigation }: any) {
  const { saveToken } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  function validate() {
    const e: typeof errors = {};

    if (!email.includes('@')) e.email = 'E-mail inválido';
    if (password.length === 0) e.password = 'Informe a senha';

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleLogin() {
    if (!validate()) return;

    setLoading(true);

    try {
      const { token } = await login(email.trim(), password);
      await saveToken(token);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        'Credenciais inválidas. Verifique e-mail e senha.';

      Alert.alert('Erro ao entrar', msg);
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
        
        <View style={styles.header}>
          <View style={styles.logoGlow}>
            <View style={styles.logoRing}>
              <Text style={styles.logoText}>⬡</Text>
            </View>
          </View>

          <Text style={styles.brand}>FORD RADAR</Text>

          <View style={styles.taglineRow}>
            <View style={styles.taglineLine} />
            <Text style={styles.tagline}>INTELIGÊNCIA COMPETITIVA</Text>
            <View style={styles.taglineLine} />
          </View>

          <Text style={styles.taglineSub}>
            Informações estratégicas para o seu dia a dia
          </Text>
        </View>

        
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>Acesso</Text>
              <Text style={styles.cardSub}>
                Entre para acessar o Ford Radar
              </Text>
            </View>

            <View style={styles.statusDot} />
          </View>

          <View style={styles.divider} />

          <Input
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            keyboardType="email-address"
            error={errors.email}
          />

          <Input
            label="Senha"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            error={errors.password}
          />

          <Button
            title="ENTRAR"
            onPress={handleLogin}
            loading={loading}
            style={styles.btn}
          />

          
          <View style={styles.security}>
            <Text style={styles.securityIcon}>✓</Text>
            <Text style={styles.securityText}>
              Ambiente seguro e protegido
            </Text>
          </View>
        </View>

        
        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
          style={styles.registerLink}
          activeOpacity={0.7}
        >
          <Text style={styles.registerText}>
            Ainda não possui acesso?{' '}
            <Text style={styles.registerAction}>Criar conta</Text>
          </Text>
        </TouchableOpacity>

        
        <View style={styles.footerContainer}>
          <View style={styles.footerLine} />
          <Text style={styles.footer}>FORD RADAR</Text>
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
    justifyContent: 'center',
  },

  

  header: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    marginBottom: spacing.md,
  },

  logoGlow: {
    width: 86,
    height: 86,
    borderRadius: 43,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentGlow,
    marginBottom: spacing.md,
  },

  logoRing: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgCard,
  },

  logoText: {
    fontSize: 31,
    color: colors.accent,
    fontWeight: '700',
  },

  brand: {
    fontSize: 27,
    fontWeight: '900',
    letterSpacing: 5,
    color: colors.textPrimary,
  },

  taglineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },

  taglineLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },

  tagline: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.accent,
    letterSpacing: 1.5,
    marginHorizontal: 10,
  },

  taglineSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 7,
  },

  

  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,

    
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

  cardTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },

  cardSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
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

  btn: {
    marginTop: spacing.sm,
  },

  

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

  

  registerLink: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },

  registerText: {
    color: colors.textSecondary,
    fontSize: 13,
  },

  registerAction: {
    color: colors.accent,
    fontWeight: '700',
  },

  

  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: spacing.sm,
  },

  footerLine: {
    width: 30,
    height: 1,
    backgroundColor: colors.border,
  },

  footer: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 1,
  },
});