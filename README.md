# Ford Radar — App Mobile

Aplicativo mobile (React Native + Expo) para consultores e analistas da rede Ford, com dois fluxos do desafio:

1. **Inteligência competitiva:** o usuário informa marca, modelo, versão e atributos de um veículo concorrente; o app consulta a API (que usa IA) e mostra a ficha técnica padronizada, comparada à Ford Ranger Raptor.
2. **Retenção de clientes (VIN Share):** lista de clientes com score de risco de evasão da pós-venda e detalhe com fatores de risco e histórico de ações.

Backend: [`fordradar-backend`](https://github.com/gabriel-mazza/fordradar-backend) (Spring Boot + Oracle + Gemini).

**Integrantes:** Gabriel Barros Mazzariol (RM 555410) · Jefferson Junior Alvarez Urbina (RM 558497)

---

## Telas

| Tela | Arquivo | Função |
|---|---|---|
| Login | `LoginScreen.tsx` | autenticação (JWT) |
| Cadastro | `RegisterScreen.tsx` | criação de conta (perfil ANALISTA) |
| Home | `HomeScreen.tsx` | menu principal e logout |
| Comparar veículo | `CompareScreen.tsx` | seleção de marca/modelo/versão/atributos |
| Resultado da comparação | `CompareResultScreen.tsx` | ficha técnica vs Ranger Raptor |
| Predições | `PredictionsScreen.tsx` | lista de clientes por risco |
| Detalhe da predição | `PredictionDetailScreen.tsx` | score, fatores de risco, histórico |

> Prints das telas: adicione as imagens em `docs/screens/` e referencie aqui.
> `![Login](docs/screens/login.png)` `![Home](docs/screens/home.png)` `![Comparar](docs/screens/compare.png)` `![Resultado](docs/screens/compare-result.png)` `![Predições](docs/screens/predictions.png)` `![Detalhe](docs/screens/prediction-detail.png)`

## Identidade visual

Tema escuro único definido em `src/theme/index.ts` (cores Ford `#003087` / `#0561AC`, acento `#00A6FF`, escala de espaçamento e raios) e componentes reutilizáveis em `src/components/UI.tsx` (Button, Input, Card…), usados em todas as telas.

## Arquitetura

```
App.tsx                     navegação (stack) — rotas públicas x protegidas pelo token
src/context/AuthContext.tsx sessão: token no SecureStore, logout automático em 401
src/services/api.ts         cliente axios, URL por variável de ambiente, HTTPS obrigatório em release
src/screens/                telas
src/components/UI.tsx       componentes visuais
src/theme/index.ts          design tokens
```

## Como rodar em desenvolvimento

```bash
npm install
cp .env.example .env        # EXPO_PUBLIC_API_URL da sua API
npx expo start --android
```

Emulador Android acessa o backend local por `http://10.0.2.2:8081`. Em celular físico, use o IP da máquina na mesma rede.

## Como gerar o APK (EAS Build)

O backend precisa estar publicado em **HTTPS** (builds de release recusam `http://`). Edite `EXPO_PUBLIC_API_URL` nos perfis `preview`/`production` do `eas.json` e rode:

```bash
npm install -g eas-cli
eas login
eas build:configure                      # 1ª vez: vincula o projeto
eas build -p android --profile preview   # gera o .apk
```

Ao terminar, o EAS mostra o link/QR code de download do `.apk`. Instale no celular (permitir fontes desconhecidas) ou arraste para o emulador.

## Segurança no app

- JWT guardado com `expo-secure-store` (Keystore/Keychain), nunca em AsyncStorage.
- Sessão encerrada automaticamente quando a API responde 401 (token expirado/revogado).
- HTTPS obrigatório em release; `allowBackup: false` (o token não vai para backups do Android).
- Cadastro não envia perfil; política de senha idêntica à do backend.
- Pipeline CI (`.github/workflows/devsecops.yml`): Gitleaks, Semgrep, npm audit + Trivy e checagem de tipos.

## Limitações conhecidas

- A lista de veículos do formulário de comparação e os dados da tela de **Predições** usam dados de demonstração locais (`MOCK_VEHICLES`, `MOCK_PREDICTIONS`); a chamada real à API já existe em `src/services/api.ts` (`compareVehicle`, `listPredictions`).
- Ícone e splash ainda são os padrões do Expo.
