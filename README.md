# 📱 BoraUni - FrontEnd- Aplicativo de Carona Universitária

![Logo BoraUni](./assets/images/bora-uni-logo.png)

---

## Índice

- [1. Visão Geral](#1-visão-geral)
- [2. Tecnologias Utilizadas](#2-tecnologias-utilizadas)
- [3. Funcionalidades Principais](#3-funcionalidades-principais)
- [4. Estrutura do Projeto](#4-estrutura-do-projeto)
- [5. Roadmap de Desenvolvimento](#5-roadmap-de-desenvolvimento)
- [6. Configuração do Ambiente](#6-configuração-do-ambiente)
- [7. Como Rodar o Projeto](#7-como-rodar-o-projeto)
- [8. Considerações Finais](#8-considerações-finais)

---

## 1. Visão Geral

**Nome do Projeto:** BoraUni

**Descrição:**
O **BoraUni** é um aplicativo mobile de carona compartilhada para universitários, desenvolvido em **React Native** com Expo. Ele conecta estudantes que desejam dividir caronas para a faculdade, reduzindo custos, minimizando impactos ambientais e fortalecendo o espírito colaborativo.

**Contexto Acadêmico:**
- **Disciplina:** UPX - 4
- **Semestre:** Semestre 4
- **Universidade:** FACENS
- **Professor:** FERNANDO XAVIER

---

## 2. Tecnologias Utilizadas

**Frontend Mobile:**
- React Native + Expo (CLI)
- Expo Router / React Navigation
- Axios para chamadas HTTP

**Backend:**
- Node.js e Express
- TypeORM (com PostgreSQL)
- Autenticação: JWT

**Banco de Dados:**
- PostgreSQL

**Arquitetura & Padrões:**
- SOLID
- Injeção de Dependência

**Infraestrutura:**
- Docker (Containers para backend e banco)
- Migrations & Seeds

---

## 3. Funcionalidades Principais

### 3.1 Autenticação
- Registro e login de usuários (estudantes e motoristas)
- Validação de entrada e segurança JWT

### 3.2 Cadastro de Veículos (Motoristas)
- Motoristas podem cadastrar informações do veículo (modelo, placa, vagas)

### 3.3 Publicação e Busca de Caronas
- Motoristas criam ofertas de carona: origem, destino, data/hora, vagas
- Passageiros buscam caronas por filtros de rota e horário
- Sistema de reserva e confirmação de vaga

### 3.4 Chat em Tempo Real
- Conversas entre motorista e passageiro para combinar detalhes
- Notificações de novas mensagens

### 3.5 Avaliação e Feedback
- Motoristas e passageiros avaliam-se mutuamente após a viagem
- Mecanismo de reputação para segurança

---

## 4. Estrutura do Projeto

```
/borauni-app
├── mobile/                 # App React Native (Expo)
│   ├── assets/             # Logo, imagens, fontes
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── screens/        # Telas (Login, Cadastro, Home, etc.)
│   │   └── services/       # API calls (Axios)
│   └── app.json            # Configuração do Expo
├── server/                 # Backend Node.js
│   ├── src/
│   │   ├── controllers/
│   │   ├── entities/       # TypeORM entities
│   │   ├── migrations/
│   │   ├── routes/
│   │   └── index.ts        # Entrypoint
│   ├── ormconfig.js        # Configuração TypeORM
│   └── docker-compose.yml  # Serviços Docker
└── README.md               # Documentação
```

---

## 5. Roadmap de Desenvolvimento

1. **Planejamento & Setup**
   - Definição da arquitetura
   - Configuração Docker / Expo CLI
2. **Backend**
   - Entidades e migrations (usuário, veículo, carona)
   - Endpoints de autenticação e CRUD de caronas
3. **Mobile App**
   - Telas de login, cadastro e fluxo de navegação
   - Integração com API (Axios + JWT)
4. **Recursos Avançados**
   - Chat em tempo real (WebSocket ou Pusher)
   - Sistema de avaliações
5. **Testes & Deploy**
   - Testes unitários e integração
   - Deploy backend (Heroku, AWS, etc.) e app Expo

---

## 6. Configuração do Ambiente

### Pré-requisitos
- Node.js ≥ 16.x
- npm ou Yarn
- Docker & Docker Compose
- Expo CLI

### Passo a passo
1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/borauni-app.git
   cd borauni-app
   ```
2. Configurar variáveis de ambiente:
   - Copie `.env.example` para `.env` e preencha
3. Subir containers Docker:
   ```bash
   docker-compose up -d
   ```
4. Instalar dependências backend:
   ```bash
   cd server
   npm install
   npm run typeorm:run
   ```
5. Instalar dependências mobile:
   ```bash
   cd ../mobile
   npm install
   ```

---

## 7. Como Rodar o Projeto

### Backend
```bash
cd server
npm run dev
```
A API ficará disponível em `http://localhost:3000`.

### Mobile App
```bash
cd mobile
expo start
```
Use um emulador Android/iOS ou o app Expo Go para visualizar.

---

## 8. Considerações Finais

Este README serve como guia completo para configuração e desenvolvimento do **BoraUni**. Qualquer contribuição é bem-vinda! Para dúvidas ou sugestões, abra uma issue ou entre em contato.

---

<p align="center">Desenvolvido com ❤️ por Grupo 09 - 2025</p>
