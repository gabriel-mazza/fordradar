
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
  Input,
  BackHeader,
  Tag,
  Card,
  SectionHeader,
} from '../components/UI';

import { colors, spacing, radius } from '../theme';




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




const BRANDS = [
  'Toyota',
  'Volkswagen',
  'Chevrolet',
];




const DANGEROUS_CHARS = /[<>'"`\\|&${}()[\]]/;


function sanitize(value: string): string {
  return value.replace(DANGEROUS_CHARS, '').slice(0, 100);
}


function isSafe(value: string): boolean {
  return !DANGEROUS_CHARS.test(value);
}




export default function CompareScreen({ navigation }: any) {



  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [version, setVersion] = useState('');


  const [brandOpen, setBrandOpen] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const [versionOpen, setVersionOpen] = useState(false);




  const [attrInput, setAttrInput] = useState('');
  const [attributes, setAttributes] = useState<string[]>([]);




  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});




  const availableModels = MOCK_VEHICLES.filter(
    (vehicle) => vehicle.brand === brand
  );


 

  const availableVersions = MOCK_VEHICLES.filter(
    (vehicle) =>
      vehicle.brand === brand &&
      vehicle.model === model
  );


  

  function handleBrandSelect(selectedBrand: string) {

    setBrand(selectedBrand);

    
    setModel('');
    setVersion('');

    
    setBrandOpen(false);
    setModelOpen(false);
    setVersionOpen(false);

    
    setErrors((prev) => ({
      ...prev,
      brand: '',
      model: '',
      version: '',
    }));
  }




  function handleModelSelect(selectedModel: string) {

    setModel(selectedModel);

   
    setVersion('');

    
    setModelOpen(false);
    setVersionOpen(false);

    
    setErrors((prev) => ({
      ...prev,
      model: '',
      version: '',
    }));
  }


 

  function handleVersionSelect(selectedVersion: string) {

    setVersion(selectedVersion);

   
    setVersionOpen(false);

    
    setErrors((prev) => ({
      ...prev,
      version: '',
    }));
  }


  

  function handleBrandChange(text: string) {
    setBrand(sanitize(text));
    setErrors((prev) => ({ ...prev, brand: '' }));
  }

  function handleModelChange(text: string) {
    setModel(sanitize(text));
    setErrors((prev) => ({ ...prev, model: '' }));
  }

  function handleVersionChange(text: string) {
    setVersion(sanitize(text));
    setErrors((prev) => ({ ...prev, version: '' }));
  }



 

  function addAttribute(attr: string) {

    const clean = sanitize(
      attr.trim().toLowerCase()
    );

   
    if (!clean) return;


    
    if (clean.length > 50) {

      Alert.alert(
        'Atributo inválido',
        'O atributo deve ter no máximo 50 caracteres.'
      );

      return;
    }


    
    if (!isSafe(attr)) {

      Alert.alert(
        'Atributo inválido',
        'O atributo contém caracteres não permitidos.'
      );

      return;
    }


   
    if (attributes.includes(clean)) return;


    
    if (attributes.length >= 20) {

      Alert.alert(
        'Limite atingido',
        'Máximo de 20 atributos por análise.'
      );

      return;
    }


    
    setAttributes((prev) => [
      ...prev,
      clean,
    ]);


    setAttrInput('');
  }




  function removeAttribute(attr: string) {

    setAttributes((prev) =>
      prev.filter((a) => a !== attr)
    );
  }




  function validate() {

    const e: Record<string, string> = {};


  

    if (!brand.trim()) {

      e.brand = 'Marca é obrigatória';

    } else if (brand.trim().length > 100) {

      e.brand =
        'Marca deve ter no máximo 100 caracteres';

    } else if (!isSafe(brand)) {

      e.brand =
        'Marca contém caracteres não permitidos';
    }


  

    if (!model.trim()) {

      e.model = 'Modelo é obrigatório';

    } else if (model.trim().length > 100) {

      e.model =
        'Modelo deve ter no máximo 100 caracteres';

    } else if (!isSafe(model)) {

      e.model =
        'Modelo contém caracteres não permitidos';
    }


    

    if (!version.trim()) {

      e.version = 'Versão é obrigatória';

    } else if (version.trim().length > 100) {

      e.version =
        'Versão deve ter no máximo 100 caracteres';

    } else if (!isSafe(version)) {

      e.version =
        'Versão contém caracteres não permitidos';
    }


   

    if (attributes.length === 0) {

      e.attrs = 'Adicione ao menos 1 atributo';
    }


   
    setErrors(e);

    return Object.keys(e).length === 0;
  }




  async function handleAnalyze() {

    
    if (!validate()) return;

    setLoading(true);


    try {

      
      const result = await compareVehicle({

        brand: brand.trim(),

        model: model.trim(),

        version: version.trim(),

        targetAttributes: attributes,
      });


      
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


 

  return (

    <SafeAreaView style={styles.safe}>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >


      

        <BackHeader
          title="Radar de Concorrência"
          onBack={() => navigation.goBack()}
        />


        

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


      

        <Card style={styles.card}>

          <SectionHeader
            title="Veículo Concorrente"
            subtitle="Digite o veículo que deseja analisar — a IA busca a ficha técnica"
          />

          <Input
            label="Marca"
            value={brand}
            onChangeText={handleBrandChange}
            placeholder="Ex: Toyota"
            autoCapitalize="words"
          />

          {errors.brand && (
            <Text style={styles.errorText}>
              {errors.brand}
            </Text>
          )}

          <Input
            label="Modelo"
            value={model}
            onChangeText={handleModelChange}
            placeholder="Ex: Hilux"
            autoCapitalize="words"
          />

          {errors.model && (
            <Text style={styles.errorText}>
              {errors.model}
            </Text>
          )}

          <Input
            label="Versão"
            value={version}
            onChangeText={handleVersionChange}
            placeholder="Ex: GR-Sport"
            autoCapitalize="words"
          />

          {errors.version && (
            <Text style={styles.errorText}>
              {errors.version}
            </Text>
          )}

        </Card>


        

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


         

          {errors.attrs && (

            <Text style={styles.errorText}>
              {errors.attrs}
            </Text>

          )}

        </Card>


       

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



const styles = StyleSheet.create({

  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },


  scroll: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },




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




  card: {
    marginBottom: spacing.md,
  },


  cardError: {
    borderColor: colors.danger,
  },




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



  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: spacing.xs,
  },



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




  analyzeBtn: {
    marginTop: spacing.sm,
  },


  

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

