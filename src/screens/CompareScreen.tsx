
import React, { useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { compareVehicle } from '../services/api';

import {
  Button,
  BackHeader,
  Tag,
  Card,
  SectionHeader,
} from '../components/UI';

import { colors, spacing, radius } from '../theme';


// ============================================================
// ATRIBUTOS SUGERIDOS
// ============================================================

const SUGGESTED_ATTRIBUTES = [
  'motor',
  'potência',
  'torque',
  'transmissão',
  'tração',
  'amortecedores',
  'capacidade de carga',
  'modos de condução',
  'consumo',
  'dimensões',
  'peso',
  'freios',
  'suspensão',
];


// ============================================================
// VEÍCULOS MOCKADOS
// ============================================================

const MOCK_VEHICLES = [
  {
    id: 'hilux',
    brand: 'Toyota',
    model: 'Hilux',
    version: 'GR-Sport',
  },
  {
    id: 'amarok',
    brand: 'Volkswagen',
    model: 'Amarok',
    version: 'V6',
  },
  {
    id: 's10',
    brand: 'Chevrolet',
    model: 'S10',
    version: 'High Country',
  },
];


// ============================================================
// MARCAS DISPONÍVEIS
// ============================================================

const BRANDS = [
  'Toyota',
  'Volkswagen',
  'Chevrolet',
];


// ============================================================
// VALIDAÇÃO / SEGURANÇA
// ============================================================

const DANGEROUS_CHARS = /[<>'"`\\|&${}()[\]]/;


function sanitize(value: string): string {
  return value.replace(DANGEROUS_CHARS, '').slice(0, 100);
}


function isSafe(value: string): boolean {
  return !DANGEROUS_CHARS.test(value);
}


// ============================================================
// TELA
// ============================================================

export default function CompareScreen({ navigation }: any) {

  // ==========================================================
  // ESTADOS DO VEÍCULO
  // ==========================================================

  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [version, setVersion] = useState('');

  // Controle de abertura dos seletores
  const [brandOpen, setBrandOpen] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const [versionOpen, setVersionOpen] = useState(false);


  // ==========================================================
  // ESTADOS DOS ATRIBUTOS
  // ==========================================================

  const [attrInput, setAttrInput] = useState('');
  const [attributes, setAttributes] = useState<string[]>([]);


  // ==========================================================
  // ESTADOS DA TELA
  // ==========================================================

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});


  // ==========================================================
  // MODELOS DISPONÍVEIS
  //
  // O modelo depende da marca escolhida.
  // ==========================================================

  const availableModels = MOCK_VEHICLES.filter(
    (vehicle) => vehicle.brand === brand
  );


  // ==========================================================
  // VERSÕES DISPONÍVEIS
  //
  // A versão depende da marca + modelo escolhidos.
  // ==========================================================

  const availableVersions = MOCK_VEHICLES.filter(
    (vehicle) =>
      vehicle.brand === brand &&
      vehicle.model === model
  );


  // ==========================================================
  // SELEÇÃO DA MARCA
  // ==========================================================

  function handleBrandSelect(selectedBrand: string) {

    setBrand(selectedBrand);

    // Ao trocar a marca, o modelo e a versão são resetados
    setModel('');
    setVersion('');

    // Fecha todos os menus
    setBrandOpen(false);
    setModelOpen(false);
    setVersionOpen(false);

    // Limpa os erros relacionados
    setErrors((prev) => ({
      ...prev,
      brand: '',
      model: '',
      version: '',
    }));
  }


  // ==========================================================
  // SELEÇÃO DO MODELO
  // ==========================================================

  function handleModelSelect(selectedModel: string) {

    setModel(selectedModel);

    // Ao trocar o modelo, a versão é resetada
    setVersion('');

    // Fecha os menus
    setModelOpen(false);
    setVersionOpen(false);

    // Limpa os erros relacionados
    setErrors((prev) => ({
      ...prev,
      model: '',
      version: '',
    }));
  }


  // ==========================================================
  // SELEÇÃO DA VERSÃO
  // ==========================================================

  function handleVersionSelect(selectedVersion: string) {

    setVersion(selectedVersion);

    // Fecha o menu
    setVersionOpen(false);

    // Limpa o erro
    setErrors((prev) => ({
      ...prev,
      version: '',
    }));
  }


  // ==========================================================
  // ENTRADA MANUAL DESATIVADA
  //
  // Essas funções foram mantidas comentadas para possível
  // utilização futura.
  // ==========================================================

  /*
  function handleBrandChange(text: string) {

    setBrand(sanitize(text));

    setModel('');
    setVersion('');

    setBrandOpen(false);
    setModelOpen(false);
    setVersionOpen(false);
  }


  function handleModelChange(text: string) {

    setModel(sanitize(text));

    setVersion('');

    setModelOpen(false);
    setVersionOpen(false);
  }


  function handleVersionChange(text: string) {

    setVersion(sanitize(text));

    setVersionOpen(false);
  }
  */


  // ==========================================================
  // ADICIONAR ATRIBUTO
  // ==========================================================

  function addAttribute(attr: string) {

    const clean = sanitize(
      attr.trim().toLowerCase()
    );

    // Não adiciona atributo vazio
    if (!clean) return;


    // Limite de caracteres
    if (clean.length > 50) {

      Alert.alert(
        'Atributo inválido',
        'O atributo deve ter no máximo 50 caracteres.'
      );

      return;
    }


    // Verificação de segurança
    if (!isSafe(attr)) {

      Alert.alert(
        'Atributo inválido',
        'O atributo contém caracteres não permitidos.'
      );

      return;
    }


    // Evita atributos duplicados
    if (attributes.includes(clean)) return;


    // Limite máximo de atributos
    if (attributes.length >= 20) {

      Alert.alert(
        'Limite atingido',
        'Máximo de 20 atributos por análise.'
      );

      return;
    }


    // Adiciona o atributo
    setAttributes((prev) => [
      ...prev,
      clean,
    ]);


    // Limpa o campo
    setAttrInput('');
  }


  // ==========================================================
  // REMOVER ATRIBUTO
  // ==========================================================

  function removeAttribute(attr: string) {

    setAttributes((prev) =>
      prev.filter((a) => a !== attr)
    );
  }


  // ==========================================================
  // VALIDAÇÃO DO FORMULÁRIO
  // ==========================================================

  function validate() {

    const e: Record<string, string> = {};


    // --------------------------------------------------------
    // MARCA
    // --------------------------------------------------------

    if (!brand.trim()) {

      e.brand = 'Marca é obrigatória';

    } else if (brand.trim().length > 100) {

      e.brand =
        'Marca deve ter no máximo 100 caracteres';

    } else if (!isSafe(brand)) {

      e.brand =
        'Marca contém caracteres não permitidos';
    }


    // --------------------------------------------------------
    // MODELO
    // --------------------------------------------------------

    if (!model.trim()) {

      e.model = 'Modelo é obrigatório';

    } else if (model.trim().length > 100) {

      e.model =
        'Modelo deve ter no máximo 100 caracteres';

    } else if (!isSafe(model)) {

      e.model =
        'Modelo contém caracteres não permitidos';
    }


    // --------------------------------------------------------
    // VERSÃO
    // --------------------------------------------------------

    if (!version.trim()) {

      e.version = 'Versão é obrigatória';

    } else if (version.trim().length > 100) {

      e.version =
        'Versão deve ter no máximo 100 caracteres';

    } else if (!isSafe(version)) {

      e.version =
        'Versão contém caracteres não permitidos';
    }


    // --------------------------------------------------------
    // ATRIBUTOS
    // --------------------------------------------------------

    if (attributes.length === 0) {

      e.attrs = 'Adicione ao menos 1 atributo';
    }


    // Salva os erros
    setErrors(e);

    return Object.keys(e).length === 0;
  }


  // ==========================================================
  // ANALISAR CONCORRÊNCIA
  // ==========================================================

  async function handleAnalyze() {

    // Primeiro valida o formulário
    if (!validate()) return;

    setLoading(true);


    try {

      // Envia os dados para a API
      const result = await compareVehicle({

        brand: brand.trim(),

        model: model.trim(),

        version: version.trim(),

        targetAttributes: attributes,
      });


      // Vai para a tela de resultado
      navigation.navigate('CompareResult', {

        result,

        attributes,
      });


    } catch (err: any) {

      const msg =
        err?.response?.data?.message ||
        'Não foi possível analisar o veículo. Verifique a conexão.';


      Alert.alert(
        'Erro na análise',
        msg
      );


    } finally {

      setLoading(false);
    }
  }


  // ==========================================================
  // INTERFACE
  // ==========================================================

  return (

    <SafeAreaView style={styles.safe}>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >


        {/* ==================================================
            CABEÇALHO
        ================================================== */}

        <BackHeader
          title="Radar de Concorrência"
          onBack={() => navigation.goBack()}
        />


        {/* ==================================================
            BANNER
        ================================================== */}

        <View style={styles.banner}>

          <Ionicons
            name="flash-outline"
            size={20}
            color={colors.accent}
          />

          <Text style={styles.bannerText}>

            Informe o veículo concorrente e os
            atributos. A nossa IA montará a
            ficha técnica comparativa.

          </Text>

        </View>


        {/* ==================================================
            VEÍCULO
        ================================================== */}

        <Card style={styles.card}>

          <SectionHeader
            title="Veículo Concorrente"
            subtitle="Selecione marca, modelo e versão"
          />


          {/* =================================================
              MARCA
          ================================================= */}

          <Text style={styles.fieldLabel}>
            Marca
          </Text>


          <TouchableOpacity

            style={[
              styles.select,

              brandOpen &&
                styles.selectActive,

              errors.brand &&
                styles.selectError,
            ]}

            onPress={() => {

              setBrandOpen(!brandOpen);

              setModelOpen(false);

              setVersionOpen(false);
            }}

            activeOpacity={0.8}
          >

            <View style={styles.selectLeft}>

              <View style={styles.selectIcon}>

                <Ionicons
                  name="business-outline"
                  size={18}
                  color={colors.accent}
                />

              </View>


              <Text
                style={[
                  styles.selectText,

                  !brand &&
                    styles.placeholder,
                ]}
              >

                {brand ||
                  'Selecionar marca'}

              </Text>

            </View>


            <Ionicons
              name={
                brandOpen
                  ? 'chevron-up-outline'
                  : 'chevron-down-outline'
              }
              size={18}
              color={colors.textMuted}
            />

          </TouchableOpacity>


          {/* =================================================
              OPÇÕES DE MARCA
          ================================================= */}

          {brandOpen && (

            <View style={styles.optionsList}>

              {BRANDS.map((item, index) => (

                <TouchableOpacity

                  key={item}

                  style={[
                    styles.option,

                    index === BRANDS.length - 1 &&
                      styles.optionLast,

                    brand === item &&
                      styles.optionSelected,
                  ]}

                  onPress={() =>
                    handleBrandSelect(item)
                  }

                  activeOpacity={0.75}
                >

                  <Text
                    style={[
                      styles.optionText,

                      brand === item &&
                        styles.optionTextSelected,
                    ]}
                  >

                    {item}

                  </Text>


                  {brand === item && (

                    <Ionicons
                      name="checkmark-outline"
                      size={19}
                      color={colors.accent}
                    />

                  )}

                </TouchableOpacity>

              ))}

            </View>

          )}


          {/* ERRO DA MARCA */}

          {errors.brand && (

            <Text style={styles.errorText}>
              {errors.brand}
            </Text>

          )}


          {/* =================================================
              MODELO
          ================================================= */}

          <Text style={styles.fieldLabelModel}>
            Modelo
          </Text>


          <TouchableOpacity

            style={[
              styles.select,

              !brand &&
                styles.selectDisabled,

              modelOpen &&
                styles.selectActive,

              errors.model &&
                styles.selectError,
            ]}

            onPress={() => {

              if (!brand) return;

              setModelOpen(!modelOpen);

              setBrandOpen(false);

              setVersionOpen(false);
            }}

            activeOpacity={0.8}

            disabled={!brand}
          >

            <View style={styles.selectLeft}>

              <View
                style={[
                  styles.selectIcon,

                  !brand &&
                    styles.selectIconDisabled,
                ]}
              >

                <Ionicons
                  name="car-outline"
                  size={18}
                  color={
                    brand
                      ? colors.accent
                      : colors.textMuted
                  }
                />

              </View>


              <Text
                style={[
                  styles.selectText,

                  !model &&
                    styles.placeholder,

                  !brand &&
                    styles.disabledText,
                ]}
              >

                {model ||

                  (brand
                    ? 'Selecionar modelo'
                    : 'Selecione a marca primeiro')}

              </Text>

            </View>


            <Ionicons
              name={
                modelOpen
                  ? 'chevron-up-outline'
                  : 'chevron-down-outline'
              }
              size={18}
              color={colors.textMuted}
            />

          </TouchableOpacity>


          {/* =================================================
              OPÇÕES DE MODELO
          ================================================= */}

          {modelOpen && (

            <View style={styles.optionsList}>

              {availableModels.map(
                (vehicle, index) => (

                  <TouchableOpacity

                    key={vehicle.model}

                    style={[
                      styles.option,

                      index ===
                        availableModels.length - 1 &&
                        styles.optionLast,

                      model === vehicle.model &&
                        styles.optionSelected,
                    ]}

                    onPress={() =>
                      handleModelSelect(
                        vehicle.model
                      )
                    }

                    activeOpacity={0.75}
                  >

                    <View style={styles.optionInfo}>

                      <Text
                        style={[
                          styles.optionText,

                          model === vehicle.model &&
                            styles.optionTextSelected,
                        ]}
                      >

                        {vehicle.model}

                      </Text>


                      <Text style={styles.optionSub}>

                        {vehicle.brand}

                      </Text>

                    </View>


                    {model === vehicle.model && (

                      <Ionicons
                        name="checkmark-outline"
                        size={19}
                        color={colors.accent}
                      />

                    )}

                  </TouchableOpacity>

                )
              )}

            </View>

          )}


          {/* ERRO DO MODELO */}

          {errors.model && (

            <Text style={styles.errorText}>
              {errors.model}
            </Text>

          )}


          {/* =================================================
              VERSÃO
          ================================================= */}

          <Text style={styles.fieldLabelModel}>
            Versão
          </Text>


          <TouchableOpacity

            style={[
              styles.select,

              !model &&
                styles.selectDisabled,

              versionOpen &&
                styles.selectActive,

              errors.version &&
                styles.selectError,
            ]}

            onPress={() => {

              if (!model) return;

              setVersionOpen(!versionOpen);

              setBrandOpen(false);

              setModelOpen(false);
            }}

            activeOpacity={0.8}

            disabled={!model}
          >

            <View style={styles.selectLeft}>

              <View
                style={[
                  styles.selectIcon,

                  !model &&
                    styles.selectIconDisabled,
                ]}
              >

                <Ionicons
                  name="options-outline"
                  size={18}
                  color={
                    model
                      ? colors.accent
                      : colors.textMuted
                  }
                />

              </View>


              <Text
                style={[
                  styles.selectText,

                  !version &&
                    styles.placeholder,

                  !model &&
                    styles.disabledText,
                ]}
              >

                {version ||

                  (model
                    ? 'Selecionar versão'
                    : 'Selecione o modelo primeiro')}

              </Text>

            </View>


            <Ionicons
              name={
                versionOpen
                  ? 'chevron-up-outline'
                  : 'chevron-down-outline'
              }
              size={18}
              color={colors.textMuted}
            />

          </TouchableOpacity>


          {/* =================================================
              OPÇÕES DE VERSÃO
          ================================================= */}

          {versionOpen && (

            <View style={styles.optionsList}>

              {availableVersions.map(
                (vehicle, index) => (

                  <TouchableOpacity

                    key={vehicle.version}

                    style={[
                      styles.option,

                      index ===
                        availableVersions.length - 1 &&
                        styles.optionLast,

                      version === vehicle.version &&
                        styles.optionSelected,
                    ]}

                    onPress={() =>
                      handleVersionSelect(
                        vehicle.version
                      )
                    }

                    activeOpacity={0.75}
                  >

                    <View style={styles.optionInfo}>

                      <Text
                        style={[
                          styles.optionText,

                          version === vehicle.version &&
                            styles.optionTextSelected,
                        ]}
                      >

                        {vehicle.version}

                      </Text>


                      <Text style={styles.optionSub}>

                        {vehicle.brand} •{' '}
                        {vehicle.model}

                      </Text>

                    </View>


                    {version === vehicle.version && (

                      <Ionicons
                        name="checkmark-outline"
                        size={19}
                        color={colors.accent}
                      />

                    )}

                  </TouchableOpacity>

                )
              )}

            </View>

          )}


          {/* ERRO DA VERSÃO */}

          {errors.version && (

            <Text style={styles.errorText}>
              {errors.version}
            </Text>

          )}


          {/* =================================================
              ENTRADA MANUAL DESATIVADA
              
              Mantida comentada para possível uso futuro.
              
              A tela atualmente utiliza SOMENTE:
              Marca → Modelo → Versão
          ================================================= */}

          {/*
          <View style={styles.manualDivider}>

            <View style={styles.dividerLine} />

            <Text style={styles.dividerText}>
              ou informe manualmente
            </Text>

            <View style={styles.dividerLine} />

          </View>


          <Input
            label="Marca"
            value={brand}
            onChangeText={handleBrandChange}
            placeholder="Ex: Toyota"
            autoCapitalize="words"
          />


          <Input
            label="Modelo"
            value={model}
            onChangeText={handleModelChange}
            placeholder="Ex: Hilux"
            autoCapitalize="words"
          />


          <Input
            label="Versão"
            value={version}
            onChangeText={handleVersionChange}
            placeholder="Ex: GR-Sport"
            autoCapitalize="words"
          />
          */}

        </Card>


        {/* ==================================================
            ATRIBUTOS
        ================================================== */}

        <Card
          style={[
            styles.card,

            errors.attrs
              ? styles.cardError
              : null,
          ]}
        >

          <SectionHeader
            title="Atributos para Análise"
            subtitle="O que você quer comparar?"
          />


          {/* =================================================
              CAMPO PARA ADICIONAR ATRIBUTO
          ================================================= */}

          <View style={styles.attrRow}>

            <TextInput

              value={attrInput}

              onChangeText={(text) =>
                setAttrInput(
                  sanitize(text)
                )
              }

              placeholder="Digite um atributo..."

              placeholderTextColor={
                colors.textMuted
              }

              style={styles.attrInput}

              onSubmitEditing={() =>
                addAttribute(attrInput)
              }

              returnKeyType="done"

              maxLength={50}
            />


            <TouchableOpacity

              style={styles.addBtn}

              onPress={() =>
                addAttribute(attrInput)
              }

              activeOpacity={0.8}
            >

              <Ionicons
                name="add-outline"
                size={25}
                color="#fff"
              />

            </TouchableOpacity>

          </View>


          {/* =================================================
              SUGESTÕES
          ================================================= */}

          <Text style={styles.suggestLabel}>
            Sugestões rápidas
          </Text>


          <View style={styles.suggestions}>

            {SUGGESTED_ATTRIBUTES

              .filter(
                (s) =>
                  !attributes.includes(s)
              )

              .slice(0, 8)

              .map((s) => (

                <TouchableOpacity

                  key={s}

                  style={styles.suggestion}

                  onPress={() =>
                    addAttribute(s)
                  }

                  activeOpacity={0.75}
                >

                  <Ionicons
                    name="add-outline"
                    size={14}
                    color={colors.accent}
                  />


                  <Text
                    style={
                      styles.suggestionText
                    }
                    numberOfLines={1}
                  >

                    {s}

                  </Text>

                </TouchableOpacity>

              ))}

          </View>


          {/* =================================================
              ATRIBUTOS SELECIONADOS
          ================================================= */}

          {attributes.length > 0 && (

            <View style={styles.selectedSection}>

              <Text style={styles.selectedLabel}>

                Selecionados (
                {attributes.length}/20):

              </Text>


              <View style={styles.tags}>

                {attributes.map((a) => (

                  <Tag
                    key={a}
                    label={a}
                    onRemove={() =>
                      removeAttribute(a)
                    }
                  />

                ))}

              </View>

            </View>

          )}


          {/* ERRO DOS ATRIBUTOS */}

          {errors.attrs && (

            <Text style={styles.errorText}>
              {errors.attrs}
            </Text>

          )}

        </Card>


        {/* ==================================================
            BOTÃO ANALISAR
        ================================================== */}

        <Button

          title={
            loading
              ? 'Analisando com IA...'
              : 'ANALISAR CONCORRÊNCIA'
          }

          onPress={handleAnalyze}

          loading={loading}

          style={styles.analyzeBtn}

        />


        {/* ==================================================
            AVISO
        ================================================== */}

        <View style={styles.disclaimerRow}>

          <Ionicons
            name="information-circle-outline"
            size={15}
            color={colors.textMuted}
          />


          <Text style={styles.disclaimer}>

            A análise usa IA e pode levar alguns
            segundos na primeira consulta.

          </Text>

        </View>

      </ScrollView>

    </SafeAreaView>
  );
}


// ============================================================
// ESTILOS
// ============================================================

const styles = StyleSheet.create({

  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },


  scroll: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },


  // ==========================================================
  // BANNER
  // ==========================================================

  banner: {
    flexDirection: 'row',
    backgroundColor: colors.accentGlow,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.accentDim,
    gap: spacing.sm,
    alignItems: 'flex-start',
  },


  bannerText: {
    color: colors.accent,
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },


  // ==========================================================
  // CARD
  // ==========================================================

  card: {
    marginBottom: spacing.md,
  },


  cardError: {
    borderColor: colors.danger,
  },


  // ==========================================================
  // LABELS
  // ==========================================================

  fieldLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 6,
  },


  fieldLabelModel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    marginTop: spacing.md,
    marginBottom: 6,
  },


  // ==========================================================
  // SELECT
  // ==========================================================

  select: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.bgInput,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
  },


  selectActive: {
    borderColor: colors.accent,
  },


  selectDisabled: {
    opacity: 0.55,
  },


  selectError: {
    borderColor: colors.danger,
  },


  selectLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.sm,
  },


  // ==========================================================
  // ÍCONE DO SELECT
  // ==========================================================

  selectIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.md,
    backgroundColor: colors.accentGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },


  selectIconDisabled: {
    backgroundColor: colors.bgElevated,
  },


  // ==========================================================
  // TEXTO DO SELECT
  // ==========================================================

  selectText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },


  placeholder: {
    color: colors.textMuted,
    fontWeight: '500',
  },


  disabledText: {
    color: colors.textMuted,
  },


  // ==========================================================
  // LISTA DE OPÇÕES
  // ==========================================================

  optionsList: {
    marginTop: 6,
    backgroundColor: colors.bgElevated,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },


  option: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },


  optionLast: {
    borderBottomWidth: 0,
  },


  optionSelected: {
    backgroundColor: colors.accentGlow,
  },


  optionInfo: {
    flex: 1,
  },


  optionText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },


  optionTextSelected: {
    color: colors.accent,
  },


  optionSub: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 3,
  },


  // ==========================================================
  // ERROS
  // ==========================================================

  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: spacing.xs,
  },


  // ==========================================================
  // DIVISOR DA ENTRADA MANUAL
  //
  // Atualmente não aparece porque o bloco está comentado.
  // Mantido para uso futuro.
  // ==========================================================

  manualDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: spacing.md,
  },


  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },


  dividerText: {
    color: colors.textMuted,
    fontSize: 9,
  },


  // ==========================================================
  // ATRIBUTOS
  // ==========================================================

  attrRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },


  attrInput: {
    flex: 1,
    backgroundColor: colors.bgInput,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    color: colors.textPrimary,
    fontSize: 14,
  },


  addBtn: {
    width: 48,
    backgroundColor: colors.fordBlueLight,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },


  // ==========================================================
  // SUGESTÕES
  // ==========================================================

  suggestLabel: {
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 8,
  },


  suggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },


  suggestion: {
    width: '48%',
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 5,
    backgroundColor: colors.bgElevated,
    borderRadius: radius.md,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: colors.border,
  },


  suggestionText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },


  // ==========================================================
  // ATRIBUTOS SELECIONADOS
  // ==========================================================

  selectedSection: {
    marginTop: spacing.md,
  },


  selectedLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },


  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },


  // ==========================================================
  // BOTÃO ANALISAR
  // ==========================================================

  analyzeBtn: {
    marginTop: spacing.sm,
  },


  // ==========================================================
  // DISCLAIMER
  // ==========================================================

  disclaimerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginTop: spacing.md,
  },


  disclaimer: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 11,
    lineHeight: 16,
    flex: 1,
  },

});

