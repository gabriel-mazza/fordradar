import React, { useState } from 'react';
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
import {
  BackHeader,
  Card,
  SectionHeader,
} from '../components/UI';
import { colors, spacing, radius } from '../theme';

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
  actionHistory?: ActionHistory[];
};




function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={infoStyles.row}>
      <Text style={infoStyles.label}>
        {label}
      </Text>

      <Text style={infoStyles.value}>
        {value}
      </Text>
    </View>
  );
}


const infoStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  label: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },

  value: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '500',
    maxWidth: '60%',
    textAlign: 'right',
  },
});




function ScoreGauge({
  score,
}: {
  score: number;
}) {
  const color =
    score >= 70
      ? colors.scoreHigh
      : score >= 40
      ? colors.scoreMid
      : colors.scoreLow;

  const filled = Math.round(score / 10);

  const message =
    score >= 70
      ? 'Alta probabilidade de retenção'
      : score >= 40
      ? 'Potencial de retenção'
      : 'Risco de perda';

  const icon =
    score >= 70
      ? 'checkmark-circle-outline'
      : score >= 40
      ? 'warning-outline'
      : 'alert-circle-outline';

  return (
    <View style={gaugeStyles.wrapper}>

      <View style={gaugeStyles.scoreRow}>

        <Text
          style={[
            gaugeStyles.value,
            { color },
          ]}
        >
          {score.toFixed(1)}
        </Text>

        <Text style={gaugeStyles.max}>
          /100
        </Text>

      </View>


      <View style={gaugeStyles.bar}>

        {Array.from({ length: 10 }).map(
          (_, i) => (

            <View
              key={i}
              style={[
                gaugeStyles.segment,

                i < filled
                  ? {
                      backgroundColor: color,
                      opacity:
                        1 - i * 0.03,
                    }
                  : {
                      backgroundColor:
                        colors.border,
                    },
              ]}
            />

          )
        )}

      </View>


      <View style={gaugeStyles.riskRow}>

        <Ionicons
          name={icon}
          size={17}
          color={color}
        />

        <Text
          style={[
            gaugeStyles.riskLabel,
            { color },
          ]}
        >
          {message}
        </Text>

      </View>

    </View>
  );
}


const gaugeStyles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },

  scoreRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },

  value: {
    fontSize: 56,
    fontWeight: '900',
    lineHeight: 64,
  },

  max: {
    fontSize: 16,
    color: colors.textMuted,
    marginBottom: 7,
    marginLeft: 3,
  },

  bar: {
    flexDirection: 'row',
    gap: 4,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },

  segment: {
    width: 24,
    height: 8,
    borderRadius: 4,
  },

  riskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  riskLabel: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});




export default function PredictionDetailScreen({
  route,
  navigation,
}: any) {

  const prediction =
    route.params?.prediction as MockPrediction;

  const score =
    Number(prediction.retentionScore);


  

  const [actions, setActions] =
    useState<ActionHistory[]>(
      prediction.actionHistory || []
    );


 

  const recommendedActions =
    score >= 70
      ? [
          'Fortalecer o relacionamento com o cliente',
          'Reforçar o calendário de manutenção preventiva',
          'Apresentar oportunidades de renovação de veículo',
        ]
      : score >= 40
      ? [
          'Realizar contato de relacionamento nas próximas 48 horas',
          'Avaliar o histórico recente de serviços',
          'Apresentar condições personalizadas de renovação',
        ]
      : [
          'Priorizar contato com o cliente',
          'Encaminhar o atendimento para o responsável pelo relacionamento',
          'Apresentar uma proposta personalizada de retenção',
        ];




  function addAction(
    text: string,
    icon: keyof typeof Ionicons.glyphMap
  ) {

    const newAction: ActionHistory = {
      id: Date.now(),
      text,
      icon,
      date: new Date().toLocaleString(
        'pt-BR'
      ),
    };


    setActions((prev) => [
      newAction,
      ...prev,
    ]);


    Alert.alert(
      'Ação registrada',
      'A atividade foi registrada no histórico do cliente.'
    );
  }


 

  function simulateContact() {

    addAction(
      'Contato com cliente registrado',
      'call-outline'
    );

    Alert.alert(
      'Contato registrado',
      `O contato com ${prediction.customerName} foi registrado com sucesso.`
    );
  }


 

  function scheduleFollowUp() {

    addAction(
      'Acompanhamento agendado',
      'calendar-outline'
    );

    Alert.alert(
      'Acompanhamento agendado',
      'O acompanhamento foi registrado para este cliente.'
    );
  }


 

  function markActionDone() {

    addAction(
      'Ação de retenção concluída',
      'checkmark-circle-outline'
    );
  }


  

  return (

    <SafeAreaView style={styles.safe}>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >

        

        <BackHeader
          title="Detalhes do Cliente"
          onBack={() => navigation.goBack()}
        />


        

        <Card style={styles.scoreCard}>

          <Text style={styles.scoreLabel}>
            SCORE DE RETENÇÃO
          </Text>

          <ScoreGauge score={score} />

        </Card>


        

        <Card style={styles.card}>

          <SectionHeader
            title="Dados do Cliente"
          />

          <InfoRow
            label="Nome"
            value={
              prediction.customerName ||
              '—'
            }
          />

          <InfoRow
            label="E-mail"
            value={
              prediction.customerEmail ||
              '—'
            }
          />

          <InfoRow
            label="Telefone"
            value={
              prediction.phone ||
              '—'
            }
          />

          <InfoRow
            label="Veículo"
            value={
              prediction.vehicle ||
              '—'
            }
          />

          <InfoRow
            label="VIN"
            value={
              prediction.vin ||
              '—'
            }
          />

          <InfoRow
            label="Última revisão"
            value={
              prediction.lastService ||
              '—'
            }
          />

        </Card>


        

        <Card style={styles.card}>

          <SectionHeader
            title="Indicadores de Retenção"
            subtitle="Principais fatores identificados"
          />


          {prediction.riskFactors.map(
            (factor, index) => (

              <View
                key={index}
                style={styles.factorItem}
              >

                <View style={styles.factorIcon}>

                  <Ionicons
                    name="ellipse"
                    size={7}
                    color={colors.accent}
                  />

                </View>


                <Text style={styles.factorText}>
                  {factor}
                </Text>

              </View>

            )
          )}

        </Card>


        

        <Card style={styles.card}>

          <SectionHeader
            title="Recomendações de Retenção"
            subtitle="Ações prioritárias para este cliente"
          />


          {recommendedActions.map(
            (action, index) => (

              <View
                key={index}
                style={styles.actionItem}
              >

                <Text
                  style={styles.actionNumber}
                >
                  {index + 1}
                </Text>


                <Text style={styles.actionText}>
                  {action}
                </Text>

              </View>

            )
          )}

        </Card>


        

        <Card style={styles.card}>

          <SectionHeader
            title="Gestão de Retenção"
            subtitle="Ações disponíveis"
          />


          

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={simulateContact}
            activeOpacity={0.8}
          >

            <Ionicons
              name="call-outline"
              size={18}
              color={colors.textPrimary}
            />

            <Text
              style={styles.primaryButtonText}
            >
              Registrar contato
            </Text>

          </TouchableOpacity>


          

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={scheduleFollowUp}
            activeOpacity={0.8}
          >

            <Ionicons
              name="calendar-outline"
              size={18}
              color={colors.textPrimary}
            />

            <Text
              style={styles.secondaryButtonText}
            >
              Agendar acompanhamento
            </Text>

          </TouchableOpacity>


          

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={markActionDone}
            activeOpacity={0.8}
          >

            <Ionicons
              name="checkmark-circle-outline"
              size={18}
              color={colors.textPrimary}
            />

            <Text
              style={styles.secondaryButtonText}
            >
              Registrar ação concluída
            </Text>

          </TouchableOpacity>

        </Card>


        

        <Card style={styles.card}>

          <SectionHeader
            title="Histórico de Ações"
            subtitle="Atividades registradas"
          />


          {actions.length === 0 ? (

            <View style={styles.historyEmpty}>

              <Ionicons
                name="document-text-outline"
                size={30}
                color={colors.textMuted}
                style={styles.historyEmptyIcon}
              />

              <Text
                style={styles.historyEmptyText}
              >
                Nenhuma atividade registrada.
              </Text>

            </View>

          ) : (

            actions.map((action) => (

              <View
                key={action.id}
                style={styles.historyItem}
              >

                <View style={styles.historyIcon}>

                  <Ionicons
                    name={action.icon}
                    size={16}
                    color={colors.accent}
                  />

                </View>


                <View style={styles.historyContent}>

                  <Text
                    style={styles.historyText}
                  >
                    {action.text}
                  </Text>


                  <Text
                    style={styles.historyDate}
                  >
                    {action.date}
                  </Text>

                </View>

              </View>

            ))

          )}

        </Card>


        

        <View style={styles.radarSection}>

          <SectionHeader
            title="Radar de Pós-Venda Ford"
            subtitle="Recursos de pós-venda"
          />


          <View style={styles.radarGrid}>

            {[
              {
                icon:
                  'construct-outline' as const,
                label:
                  'Revisões Programadas',
              },
              {
                icon:
                  'shield-checkmark-outline' as const,
                label:
                  'Garantia Estendida',
              },
              {
                icon:
                  'phone-portrait-outline' as const,
                label:
                  'FordPass App',
              },
              {
                icon:
                  'cube-outline' as const,
                label:
                  'Peças Originais',
              },
            ].map((item) => (

              <View
                key={item.label}
                style={styles.radarItem}
              >

                <Ionicons
                  name={item.icon}
                  size={26}
                  color={colors.accent}
                />

                <Text
                  style={styles.radarLabel}
                >
                  {item.label}
                </Text>

              </View>

            ))}

          </View>

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
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },


  

  scoreCard: {
    marginBottom: spacing.md,
    alignItems: 'center',
  },

  scoreLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 3,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },


  

  card: {
    marginBottom: spacing.md,
  },


  

  factorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  factorIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.accentGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },

  factorText: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
  },


  

  actionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  actionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accentGlow,
    borderWidth: 1,
    borderColor: colors.accent,
    textAlign: 'center',
    lineHeight: 22,
    fontSize: 12,
    fontWeight: '700',
    color: colors.accent,
  },

  actionText: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 20,
  },


  

  primaryButton: {
    backgroundColor: colors.fordBlueLight,
    borderRadius: radius.md,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.sm,
  },

  primaryButtonText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },


  

  secondaryButton: {
    backgroundColor: colors.bgInput,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.sm,
  },

  secondaryButtonText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },


  

  historyEmpty: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },

  historyEmptyIcon: {
    marginBottom: spacing.sm,
  },

  historyEmptyText: {
    color: colors.textMuted,
    fontSize: 12,
  },

  historyItem: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  historyIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.accentGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },

  historyContent: {
    flex: 1,
  },

  historyText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },

  historyDate: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 3,
  },


  

  radarSection: {
    marginTop: spacing.sm,
  },

  radarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },

  radarItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },

  radarLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
  },

});