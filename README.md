# Project Canis TG

A version of canis from WhatsApp!

> ⚠️ **Warning:**
> This repository is for educational and entertainment purposes only.
> Canis is not affiliated with Telegram.
> Use at your own risk, your Telegram account may be subject to suspension or bans.

> ⚠️ **Warning:**
> Spaghetting code ahead

## Supported AI Providers

Canis supports multiple AI providers out of the box:

- [OpenRouter](https://openrouter.ai/)
- [OpenAI](https://openai.com/)
- [Groq](https://groq.com/)
- [Gemini (Google)](https://ai.google.dev/gemini)
- [Ollama](https://ollama.com/)

## Prerequisites

- Node.js (>=18.x)
- MySQL

  You can changed the db provider in `prisma/schema.prisma`

- Redis/Valkey
- Telegram Account

## Getting started

1. **Clone repo**

   ```sh
   git clone https://github.com/mrepol742/project-canis-tg.git
   cd project-canis-tg

2. **Install dependencies**

   ```sh
   npm install
   ```

3. **Setup environment variables**

   ```sh
   cp .env.example .env
   # Configure your AI Provider, models and other necessary preferences.
   ```

4. **Run Migration**

   ```sh
   npx prisma migrate dev
   ```

5. **Run**

   ```sh
   npm run dev
   ```

#### PM2

1. **Build**

   ```
   npm run build
   ```

2. **Start**

   ```
   pm2 start ecosystem.config.js
   ```

#### NodeJS

1. **Build**

   ```
   npm run build
   ```

2. **Start**

   ```
   npm run start
   ```

## WhatsApp Version

A WhatsApp version of Project Canis is available at [project-canis](https://github.com/mrepol742/project-canis).

## License

   Copyright 2025 Melvin Jones Repol

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
