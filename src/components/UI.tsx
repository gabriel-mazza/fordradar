import React, { ReactNode } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  StyleSheet,
  ViewStyle,
  StyleProp,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, shadow } from '../theme';



interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  loading,
  disabled,
  variant = 'primary',
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const variantStyles: Record<string, ViewStyle> = {
    primary: {
      backgroundColor: colors.fordBlueLight,
    },
    secondary: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: colors.accent,
    },
    ghost: {
      backgroundColor: 'transparent',
    },
    danger: {
      backgroundColor: colors.danger,
    },
  };

  const variantTextStyles: Record<string, TextStyle> = {
    primary: {
      color: '#fff',
    },
    secondary: {
      color: colors.accent,
    },
    ghost: {
      color: colors.textSecondary,
    },
    danger: {
      color: '#fff',
    },
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        btnStyles.base,
        variantStyles[variant],
        isDisabled && btnStyles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'secondary' ? colors.accent : '#fff'}
          size="small"
        />
      ) : (
        <Text style={[btnStyles.text, variantTextStyles[variant]]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const btnStyles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    ...shadow.card,
  },
  disabled: {
    opacity: 0.45,
  },
  text: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});



interface InputProps {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  error?: string;
  multiline?: boolean;
}

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  autoCapitalize = 'none',
  keyboardType = 'default',
  error,
  multiline,
}: InputProps) {
  const [focused, setFocused] = React.useState(false);

  return (
    <View style={inputStyles.wrapper}>
      <Text style={inputStyles.label}>{label}</Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        multiline={multiline}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          inputStyles.input,
          focused && inputStyles.focused,
          error ? inputStyles.error : null,
          multiline && {
            height: 90,
            textAlignVertical: 'top',
          },
        ]}
      />

      {error ? (
        <Text style={inputStyles.errorText}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const inputStyles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.bgInput,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    color: colors.textPrimary,
    fontSize: 15,
  },
  focused: {
    borderColor: colors.accent,
    backgroundColor: '#0A1622',
  },
  error: {
    borderColor: colors.danger,
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 4,
  },
});



interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Card({ children, style }: CardProps) {
  return (
    <View style={[cardStyles.card, style]}>
      {children}
    </View>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
});



export function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 70
      ? colors.scoreHigh
      : score >= 40
        ? colors.scoreMid
        : colors.scoreLow;

  const label =
    score >= 70
      ? 'Alta retenção'
      : score >= 40
        ? 'Média'
        : 'Risco alto';

  return (
    <View
      style={[
        scoreBadgeStyles.wrapper,
        {
          borderColor: color,
          backgroundColor: color + '18',
        },
      ]}
    >
      <Text style={[scoreBadgeStyles.score, { color }]}>
        {score.toFixed(1)}%
      </Text>

      <Text style={[scoreBadgeStyles.label, { color }]}>
        {label}
      </Text>
    </View>
  );
}

const scoreBadgeStyles = StyleSheet.create({
  wrapper: {
    borderRadius: radius.md,
    borderWidth: 1.5,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    minWidth: 90,
  },
  score: {
    fontSize: 20,
    fontWeight: '800',
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginTop: 2,
  },
});



export function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={sectionStyles.wrapper}>
      <Text style={sectionStyles.title}>
        {title}
      </Text>

      {subtitle ? (
        <Text style={sectionStyles.subtitle}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.accent,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
});



export function Tag({
  label,
  onRemove,
}: {
  label: string;
  onRemove?: () => void;
}) {
  return (
    <View style={tagStyles.tag}>
      <Text style={tagStyles.label}>
        {label}
      </Text>

      {onRemove && (
        <TouchableOpacity
          onPress={onRemove}
          hitSlop={{
            top: 8,
            bottom: 8,
            left: 8,
            right: 8,
          }}
        >
          <Ionicons
            name="close-outline"
            size={15}
            color={colors.accent}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const tagStyles = StyleSheet.create({
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentGlow,
    borderWidth: 1,
    borderColor: colors.accentDim,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
    gap: 4,
  },
  label: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '600',
  },
});



export function BackHeader({
  title,
  onBack,
}: {
  title: string;
  onBack: () => void;
}) {
  return (
    <View style={backHeaderStyles.row}>
      <TouchableOpacity
        onPress={onBack}
        hitSlop={{
          top: 10,
          bottom: 10,
          left: 10,
          right: 10,
        }}
        style={backHeaderStyles.backButton}
      >
        <Ionicons
          name="arrow-back-outline"
          size={18}
          color={colors.accent}
        />

        <Text style={backHeaderStyles.back}>
          Voltar
        </Text>
      </TouchableOpacity>

      <Text style={backHeaderStyles.title}>
        {title}
      </Text>

      <View style={{ width: 60 }} />
    </View>
  );
}

const backHeaderStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  back: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
});

