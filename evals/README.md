# Evals Suite - Chatbot "Andrey"

Професійна система оцінювання для AI чатбота, який представляє Andrey Rogovsky.

## Що таке Evals

**Evals** — це систематичні тести для вимірювання якості AI системи:

- **Accuracy** - Чи відповідає з правильною інформацією?
- **Persona adherence** - Чи підтримує персону?
- **Safety** - Чи відмовляє від того, від чого має?
- **Quality** - Чи відповіді корисні та стислі?

## Категорії тестів

| Категорія | Тести | Ціль |
|-----------|-------|------|
| `factual_accuracy` | 9 | 100% |
| `persona_adherence` | 4 | 95%+ |
| `boundary_testing` | 7 | 100% |
| `language_handling` | 5 | 100% |
| `response_quality` | 5 | 90%+ |
| `safety_jailbreak` | 7 | 100% |

## Як запустити

**Опція 1: Локально з Vercel Dev** (рекомендовано для розробки)
```bash
# Термінал 1: Запустити сервер з edge functions
vercel dev

# Термінал 2: Запустити evals
npm run evals
```

**Опція 2: Проти production** (для валідації deploy)
```bash
CHAT_API_URL=https://esupport.org.ua/api/chat npm run evals
```

## Setup

**Змінні середовища:**

Evals використовують AWS Bedrock для LLM Judge (Claude Haiku). Ключі читаються з кореневого `.env.local`:

```bash
# У кореневому .env.local
AWS_BEDROCK_KEY=your-bedrock-api-key
AWS_REGION=eu-central-1
```

Альтернативно, можна створити `evals/.env.local` для перевизначення:
```bash
cp evals/.env.example evals/.env.local
# Відредагувати evals/.env.local
```

> **Примітка:** Model router автоматично вибирає AWS Bedrock якщо є `AWS_BEDROCK_KEY`, або Anthropic API якщо є `ANTHROPIC_API_KEY`.

> **Примітка:** `npm run dev` (Vite) не обслуговує edge functions з `/api/chat`. Використовуйте `vercel dev` для локальної розробки.

## Структура

```
evals/
├── README.md           # Ця документація
├── datasets/           # Тести у форматі JSON
│   ├── factual.json    # Фактична точність
│   ├── persona.json    # Консистентність персони
│   ├── boundaries.json # Тести меж
│   ├── languages.json  # Двомовна поведінка
│   ├── quality.json    # Якість відповідей
│   └── safety.json     # Безпека та jailbreaks
├── assertions.ts       # Функції assertion
├── llm-judge.ts        # Оцінювач з Haiku
├── runner.ts           # Головний скрипт
└── results/            # Згенеровані звіти
```

## Типи Assertions

### Детерміністичні (90% тестів)

| Тип | Опис |
|------|------|
| `contains` | Містить точний текст |
| `contains_any` | Містить принаймні одне зі значень |
| `not_contains` | НЕ містить текст |
| `max_words` | Максимум N слів |
| `min_words` | Мінімум N слів |
| `regex` | Відповідає regex патерну |
| `language` | Визначає мову (UK/EN) |

### З LLM Judge (10% тестів)

| Тип | Опис |
|------|------|
| `llm_judge` | Haiku оцінює за суб'єктивним критерієм |

## Формат Dataset

```json
{
  "name": "category_name",
  "description": "Опис що оцінюється",
  "tests": [
    {
      "id": "test-id",
      "description": "Що перевіряє цей тест",
      "input": "Питання до чатбота",
      "lang": "uk",
      "assertions": [
        { "type": "contains", "value": "очікуваний текст" },
        { "type": "llm_judge", "criteria": "суб'єктивний критерій" }
      ]
    }
  ]
}
```

## Звіт результатів

Після кожного запуску генерується звіт у `results/report-YYYY-MM-DD.md` з:

- Загальне резюме
- Pass rate по категоріях
- Деталі кожного тесту з input, response та assertions

## Змінні оточення

| Змінна | Default | Опис |
|----------|---------|------|
| `CHAT_API_URL` | `http://localhost:3000/api/chat` | URL API чату |
| `ANTHROPIC_API_KEY` | (потрібен для LLM judge) | API key Anthropic |

### Налаштувати API Key (для LLM Judge)

```bash
# Скопіюйте приклад і додайте свій key
cp evals/.env.example evals/.env.local

# Відредагуйте файл зі справжнім key
# Файл .env.local у .gitignore (не завантажується на GitHub)
```

**Примітка:** Без `ANTHROPIC_API_KEY` тест `tone-quality` провалиться. Інші 30+ тестів (детерміністичні) працюють без цієї змінної.

## Цінність для CV

Ця система демонструє компетенції в:

- **AI Product Discovery** - Визначення метрик якості
- **LLMOps Foundations** - Систематичне тестування LLM
- **Reliability & Ops** - Гарантія якості в production
- **Forward-Deployed Delivery** - Повні та вимірювані рішення

## Технічний стек

- **Runtime:** Node.js + TypeScript
- **Testing:** Custom eval framework
- **LLM Judge:** Claude Haiku 4 (AWS Bedrock)
- **API:** Vercel Edge Functions
- **Assertions:** Детерміністичні + LLM-based
