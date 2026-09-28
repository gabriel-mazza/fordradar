# Ford Radar - App Mobile

Gabriel Barros Mazzariol RM 555410
Jefferson Junior Alvarez Urbina RM 558497

Aplicativo mobile do projeto **Ford Radar**, desenvolvido com **React Native + Expo (TypeScript)** para apoiar a equipe comercial e de pós-venda da Ford.

O app consome a API do projeto: [fordradar-backend](https://github.com/gabriel-mazza/fordradar-backend).

---

## Links do projeto

| Item | Link |
|---|---|
| API publicada (HTTPS) | https://fordradar-backend.onrender.com |
| Download do APK (EAS Build) | https://expo.dev/accounts/gmazza28/projects/ford-radar/builds/9ccc0b72-ad84-4408-aca3-5afba39d8732 |
| Repositório do back-end | https://github.com/gabriel-mazza/fordradar-backend |

> A API roda no plano gratuito do Render e "dorme" após alguns minutos sem uso. No primeiro acesso, a resposta pode levar cerca de 1 minuto. Abra a URL da API no navegador antes de usar o app para acordá-la.

---

## O que o app faz

1. **Login e cadastro**: autenticação por JWT. O token fica guardado com segurança no aparelho.
2. **Comparar veículos concorrentes**: o usuário digita marca, modelo e versão de qualquer veículo e escolhe os atributos que quer comparar (motor, potência, torque, consumo, etc.). A API consulta o banco e, se o veículo ainda não estiver salvo, usa IA (Gemini) para montar a ficha técnica.
3. **Predições de retenção**: lista clientes com o score de retenção calculado, vindo direto do banco de dados.

A IA é um detalhe interno da API. Para o app, tudo funciona como uma chamada REST comum.

---

## Tecnologias

- React Native + Expo
- TypeScript
- Expo Secure Store (armazenamento seguro do token)
- Expo Font
- EAS Build (geração do APK)

---

## Estrutura do projeto

```
ford-radar-frontend/
├── src/
│   ├── screens/        # telas do app (login, comparar, predições, etc.)
│   ├── components/     # componentes reutilizáveis (Input, Card, botões)
│   ├── services/
│   │   └── api.ts      # cliente HTTP e configuração da URL da API
│   └── theme/
│       └── index.ts    # identidade visual única (cores, fontes, espaçamentos)
├── docs/
│   └── screens/        # prints das telas usados neste README
├── app.json            # configuração do Expo (nome, pacote Android)
├── eas.json            # perfis de build (development, preview, production)
└── .env.example        # exemplo de variável de ambiente
```

---

## Identidade visual

Todo o app usa um tema único, definido em `src/theme/index.ts` (paleta escura, tipografia e espaçamentos). As telas consomem esses valores, o que garante consistência visual entre todos os fluxos.

---

## Segurança no app

- **Token JWT** armazenado com `expo-secure-store` (criptografado pelo sistema operacional), nunca em texto puro.
- **HTTPS obrigatório** em builds de release: o `api.ts` bloqueia URLs `http://` fora do modo de desenvolvimento.
- **Validação e sanitização** dos campos de texto livre (marca, modelo e versão), bloqueando caracteres perigosos como `<`, `>` e `;` antes de enviar para a API.
- **Nenhuma senha ou chave de API** guardada no aparelho ou no repositório.
- `allowBackup: false` no Android, evitando cópia dos dados do app em backups.

---

## Como rodar localmente

### Pré-requisitos

- Node.js 18 ou superior
- Emulador Android ou o app Expo Go em um celular
- Back-end rodando (local ou o publicado)

### Passo a passo

```bash
git clone <url-deste-repositorio>
cd ford-radar-frontend
npm install
cp .env.example .env        # ajuste EXPO_PUBLIC_API_URL
npx expo start
```

### URL da API

A URL vem da variável `EXPO_PUBLIC_API_URL`:

| Cenário | Valor |
|---|---|
| Emulador Android com back-end local | `http://10.0.2.2:8081` |
| Celular físico com back-end local | `http://IP-DA-SUA-MAQUINA:8081` (mesma rede) |
| API publicada | `https://fordradar-backend.onrender.com` |

---

## Gerando o APK (EAS Build)

O back-end precisa estar publicado em **HTTPS**, pois builds de release recusam `http://`.

Os perfis `preview` e `production` do `eas.json` já apontam para `https://fordradar-backend.onrender.com`.

```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

Ao final, o EAS gera um link para baixar o `.apk`. Para instalar no celular, é preciso permitir a instalação de fontes desconhecidas.

---

## Demonstração das telas


### 1. Login
<img width="457" height="939" alt="image" src="https://github.com/user-attachments/assets/a51127ac-a266-4422-9587-2ca6a0b4397e" />


### 2. Cadastro
<img width="458" height="938" alt="image" src="https://github.com/user-attachments/assets/fb22616e-119e-48b1-9f7e-37a8b6223454" />


### 3. Home
<img width="459" height="934" alt="image" src="https://github.com/user-attachments/assets/ee1ad6a4-05e1-4e45-abce-4ada0059efe5" />


### 4. Comparar veículos (busca livre)
<img width="457" height="944" alt="image" src="https://github.com/user-attachments/assets/913abb9c-8128-4df2-8bc0-538f97f5272b" />


### 5. Resultado da comparação
<img width="456" height="944" alt="image" src="https://github.com/user-attachments/assets/911c6b6b-1e36-46e5-829f-bcdd77e7452a" />


### 6. Predições de retenção
<img width="461" height="944" alt="image" src="https://github.com/user-attachments/assets/882c6b34-3ea3-4eb5-a38c-baf3dde01e5f" />

<img width="459" height="934" alt="image" src="https://github.com/user-attachments/assets/d08e7e65-b175-40c6-875b-49e5b8a93eed" />



---

## Fluxos principais

**Comparação de veículo**
1. O usuário informa marca, modelo e versão.
2. Escolhe os atributos que deseja comparar.
3. O app envia os dados para `POST /api/v1/vehicles/compare`.
4. A API devolve a ficha técnica (do banco ou gerada pela IA) e o app exibe o resultado.
5. Consultas repetidas do mesmo veículo são mais rápidas, pois ficam salvas no banco.

**Predições**
1. O app chama `GET /api/v1/predictions`.
2. A API devolve os clientes com o score de retenção.
3. O app exibe a lista para a equipe de pós-venda.

---

## Observações

- Todas as rotas protegidas exigem o header `Authorization: Bearer TOKEN`, enviado automaticamente pelo app após o login.
- Se uma informação não existir na ficha técnica, a API retorna `empty / not available` e o app exibe essa mensagem.
- Os dados pessoais dos clientes são criptografados no banco (AES-256-GCM) pelo back-end.
