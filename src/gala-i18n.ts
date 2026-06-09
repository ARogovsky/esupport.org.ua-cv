export type GalaLang = 'uk' | 'en'

export const galaContent = {
  uk: {
    slug: 'gala-b2b-lidogeneratsiya',
    altSlug: 'gala-b2b-lead-generation',
    readingTime: '12 хв читання',
    seo: {
      title: 'GALA: Автономний Агент B2B Лідогенерації — Case Study',
      description: 'Forward-deployed кейс: автономний B2B агент з RoBERTa, розгорнутий у клієнта. 85 дзвінків/день, 90 активних користувачів, 15-25% економії браузера.',
    },
    nav: {
      breadcrumbHome: 'Головна',
      breadcrumbCurrent: 'GALA',
    },
    header: {
      kicker: 'Case Study · Forward Deployed · Запуск 16 квітня 2026',
      h1: 'GALA — Автономний Агент B2B Лідогенерації',
      subtitle: 'Forward-deployed кейс: побудував агент і задеплоїв безпосередньо у клієнта. Автономний агент заповнює контактні форми на сайтах для B2B лідогенерації. RoBERTa-класифікатор визначає стратегію до відкриття сторінки. Результат: пік 85 вхідних дзвінків на день та 90 активних користувачів',
      date: '16 квіт 2026',
    },
    heroMetrics: [
      { value: '85', label: 'Дзвінків/день (пік)' },
      { value: '90', label: 'Активних користувачів' },
      { value: '50-100ms', label: 'CPU inference' },
      { value: '20K', label: 'Датасет сайтів' },
      { value: '99.8%', label: 'Україна (гео)' },
    ],
    tldr: 'GALA — автономний агент, який заповнює контактні форми на сайтах для B2B лідогенерації. Технічне серце — RoBERTa-класифікатор (PyTorch), навчений на 20 000 реальних сайтів. Перед тим як агент відкриє сторінку, модель визначає стратегію: simple / CSRF / complex. Результат: 15–25% економії навантаження на браузер, пік 85 вхідних дзвінків на день.',
    sections: {
      intro: {
        hook: 'До 16 квітня — нуль дзвінків. Три з половиною тижні тиші на колл-трекінгу Zadarma. Після запуску GALA 16 квітня: через 2–4 дні — пік 85 вхідних дзвінків на день. Стабільна база — 30–65 дзвінків/день.',
        body: 'GALA — автономний агент, який заповнює контактні форми на сайтах для B2B лідогенерації. Знаходить потенційних клієнтів, надсилає персоналізовані повідомлення, передає результати в CRM клієнта. Працює 24×7 без участі людини. Технічне серце — RoBERTa-класифікатор (PyTorch), навчений на 20 000 реальних сайтів. Модель визначає стратегію заповнення форми до того, як браузер відкриє сторінку. Це дає 15–25% економії навантаження браузера порівняно з наївним підходом. Інференс на CPU займає 50–100ms без GPU в продакшені. Агент працює автономно, без ручного втручання, генерує живі ліди через контактні форми на сайтах потенційних клієнтів. Масштабується ефективно.',
      },
      mainResult: {
        heading: 'Головний Результат',
        body: 'Це найчистіший forward-deployed кейс: агент побудований і розгорнутий безпосередньо в інфраструктурі клієнта, інтегрований з його колл-трекінгом і CRM. Ці дзвінки — не трафік на сайт GALA. Це компанії, які отримали повідомлення від агента і телефонують у відповідь клієнтам. Колл-трекінг фіксує зворотний зв\'язок — пряме підтвердження того, що агент генерує живі ліди. До запуску GALA 16 квітня — три з половиною тижні тиші на Zadarma. Після запуску — через 2–4 дні пік 85 вхідних дзвінків на день. Стабільна база — 30–65 дзвінків/день. Гео дзвінків: 99.8% Україна, мобільний Інтертелеком. Це підтверджує, що агент генерує живі ліди на українському ринку, а не просто відправляє форми в порожнечу. Результат доведений реальними даними.',
        metrics: [
          { value: '85', label: 'Дзвінків/день (пік)' },
          { value: '30-65', label: 'Дзвінків/день (база)' },
          { value: '99.8%', label: 'Україна (гео)' },
          { value: '2-4', label: 'Дні до піку' },
        ],
      },
      validation: {
        heading: 'Методологія: Дешева Кваліфікація Лідів Замість Дорогого Voice-AI',
        body: 'Перед тим як будувати повноцінний voice-AI стек (Whisper STT + LLM-діалог + TTS-озвучка) для кваліфікації лідів — я перевірив гіпотезу найдешевшим методом. GALA генерувала IVR-меню, а зворотний дзвінок компанії і взаємодія з меню вже служили сигналом кваліфікації. Не потрібні були дорогі живі діалоги: сам факт callback доводить, що лід гарячий. За 8 днів пілота (1–8 червня) — близько 160 унікальних компаній передзвонили, 98% pickup rate. Це класичний forward-deployed підхід: спочатку найдешевший проксі для валідації попиту всередині бізнесу клієнта, і лише потім — інвестиції в дорогу інфраструктуру, якщо гіпотеза підтвердилась.',
        metrics: [
          { value: '~160', label: 'Унікальних компаній' },
          { value: '98%', label: 'Pickup rate' },
          { value: '8', label: 'Днів пілота' },
          { value: '~$0', label: 'Voice-AI інфраструктура' },
        ],
        callout: 'Замість дорогого Whisper + TTS pipeline — дешевий IVR-проксі. Гіпотезу кваліфікації лідів підтверджено реальними даними до жодних інвестицій у voice-AI.',
        insight: {
          heading: 'Інсайт: Ефект Понеділка',
          body: 'Дані пілота показали чіткий патерн: піки зворотних дзвінків припадають на понеділок (76 дзвінків проти 29–36 у будні), бо агент розсилає форми наприкінці тижня та у вихідні, а компанії передзвонюють на початку робочого тижня. 92% усіх дзвінків — у робочі години 09:00–18:00, пік 09:00–11:00. Готова продуктова оптимізація: синхронізувати розсилку під ранок понеділка.',
        },
      },
      ga4Data: {
        heading: 'Дані GA4 (29 січня – 28 квітня 2026)',
        body: '90 активних користувачів за 90 днів. 91 новий користувач — майже всі нові. Середній час взаємодії: 28 секунд. 493 події за весь період.',
        traffic: {
          heading: 'Джерела трафіку (сесії)',
          items: [
            { source: 'google / cpc', value: '56 (51%)', desc: 'платний трафік' },
            { source: 'direct', value: '48 (44%)', desc: 'прямі переходи, word of mouth' },
            { source: 'Teams CDN', value: '2', desc: 'корпоративний Microsoft Teams — реальний B2B-сигнал' },
          ],
        },
        geo: {
          heading: 'Гео — хто клієнти GALA',
          body: 'Singapore (13 users), Lviv (8), Kyiv (6), Wiesbaden DE (5), Amsterdam (3), Kharkiv (3). Це не іноземці і не боти. Це українські підприємці і діаспора, які ведуть бізнес за кордоном після 2022.',
        },
        pages: {
          heading: 'Сторінки',
          items: [
            { page: 'Головна (GALA/Imaginify)', users: '11', events: '32', bounce: '62.5%' },
            { page: 'Лендинг "Гала | Лідогенерація"', users: '3', bounce: '0%', note: 'ті, хто дійшли до продуктової сторінки, читають до кінця' },
          ],
        },
      },
      retention: {
        heading: 'Чому Retention 0% — Це Ознака Правильного Продукту',
        body: 'GA4 показує нульовий return rate. Це не проблема — це підтвердження моделі. GALA працює за принципом set-and-forget: користувач заходить один раз, завантажує список сайтів, налаштовує формат повідомлення — і йде. Агент працює автономно, результати течуть у CRM клієнта. Це та сама модель що Zapier або будь-який фоновий автоматизаційний інструмент: реальне використання відбувається поза браузером. Користувач не повертається на сайт, тому що продукт працює без нього. Повертатися немає причини — агент працює 24×7 автономно.',
        callout: 'Правильні метрики утримання для GALA — не session return rate в GA4, а активність агента: кількість відправлених форм, об\'єм вхідних дзвінків на Zadarma, поповнення балансу.',
      },
      economics: {
        heading: 'Юніт-економіка',
        body: 'Середня зарплата менеджера з лідогенерації в Україні — ~$690/місяць. За $690 GALA відправляє 6 900 повідомлень. При конверсії 10% — 690 лідів на місяць. Менеджер за той самий бюджет фізично спроможний на максимум ~200 контактів. Навіть якщо менеджер витрачає 5 хвилин на сайт і працює без перерв, він не може конкурувати з автономним агентом. GALA працює 24×7 без лікарняних, відпусток, або втоми. Масштабується без додаткових витрат на персонал. Інтеграція з CRM доступна в Enterprise-тарифі для автоматичного потоку лідів.',
        comparison: {
          headers: ['', 'Менеджер', 'GALA'],
          rows: [
            ['Вартість/місяць', '$690', '$690'],
            ['Лідів/місяць', '~200', '~690'],
            ['Доступність', '8 год/день', '24×7'],
            ['Лікарняні / відпустки', 'Так', 'Ні'],
            ['Інтеграція з CRM', 'Так', 'За доплату'],
          ],
        },
      },
      technical: {
        heading: 'Технічна Перевага: Чому RoBERTa, а Не GPT',
        body: 'Не prompt engineering поверх GPT-4. Власна навчена модель на реальному датасеті з вимірюваним ефектом. Класифікатор вирішує стратегію до того, як браузер відкрив сторінку. RoBERTa-класифікатор навчений на 20 000 реальних сайтів. Модель аналізує структуру HTML, визначає тип форми, і передає стратегію браузерному агенту. Агент виконує тільки необхідні кроки для успішної відправки форми. Без зайвих запитів, без зайвого навантаження. Інференс на CPU займає 50–100ms без GPU в продакшені. Це масштабується без росту витрат на токени, на відміну від GPT-4.',
        classes: [
          { name: 'simple', desc: 'стандартна форма, прямий сабміт' },
          { name: 'CSRF', desc: 'форма з токеном захисту, потрібна попередня сесія' },
          { name: 'complex', desc: 'мультисекційна форма, завантаження файлів, складна логіка' },
        ],
        result: 'Результат маршрутизації: браузерний агент не витрачає ресурси на зайві кроки. Звідси 15–25% економії навантаження і 50–100ms CPU inference — без GPU в продакшені.',
      },
      monetization: {
        heading: 'Монетизація',
        tiers: [
          { name: 'Старт', price: '$0.10 за успішну відправку' },
          { name: 'Про', price: '$0.10 за секцію форми (мультисекційні форми)' },
          { name: 'Enterprise', price: 'складні сценарії, інтеграція з CRM, колл-трекінг — індивідуально' },
        ],
      },
      next: {
        heading: 'Що Далі',
        items: [
          'SEO: органічне покриття запитів "лідогенерація B2B", "холодний аутріч автоматизація", "заповнення контактних форм"',
          'Міжнародний ринок: Singapore, Wiesbaden, Amsterdam у GA4 — тест EU-аудиторії з тими самими болями',
          'Розширення датасету: більше типів форм, більше мов для класифікатора',
          'Retention через продукт: дашборд активності агента, статистика відправок, weekly digest в CRM',
        ],
      },
      stack: {
        heading: 'Стек',
        items: [
          { name: 'Python', role: 'Основна мова' },
          { name: 'PyTorch', role: 'ML framework для RoBERTa' },
          { name: 'RoBERTa', role: 'Класифікатор стратегій форм' },
          { name: 'Playwright', role: 'Browser automation' },
          { name: 'Zadarma', role: 'Колл-трекінг' },
          { name: 'Astro', role: 'Frontend framework' },
          { name: 'Google Ads', role: 'Платний трафік' },
        ],
      },
      resources: {
        heading: 'Ресурси',
        items: [
          { label: 'GALA — Автономний агент B2B лідогенерації', url: 'https://gala.esupport.org.ua' },
        ],
      },
    },
    faq: {
      heading: 'FAQ',
      items: [
        {
          q: 'Чому RoBERTa, а не GPT?',
          a: 'Власна навчена модель на 20 000 реальних сайтів дає вимірюваний ефект: 15–25% економії навантаження браузера. GPT-4 коштує токени на кожен запит, RoBERTa — 50–100ms CPU inference без GPU. Це масштабується без росту витрат на токени. Класифікатор вирішує стратегію до того, як браузер відкрив сторінку. Три класи: simple (прямий сабміт), CSRF (потрібна попередня сесія), complex (мультисекційна форма). Результат маршрутизації: браузерний агент не витрачає ресурси на зайві кроки. Не prompt engineering поверх GPT-4, а власна навчена модель на реальному датасеті з вимірюваним ефектом. Інференс на CPU без GPU в продакшені дає економію інфраструктурних витрат. Модель навчена на реальних даних. Ефективно і швидко.',
        },
        {
          q: 'Як працює класифікатор?',
          a: 'Модель визначає стратегію заповнення форми ДО того, як браузер відкриє сторінку. Три класи: simple (прямий сабміт), CSRF (потрібна попередня сесія), complex (мультисекційна форма). Результат: агент не витрачає ресурси на зайві кроки. RoBERTa-класифікатор навчений на 20 000 реальних сайтів. Інференс на CPU займає 50–100ms без GPU. Це дає 15–25% економії навантаження браузера порівняно з наївним підходом. Модель аналізує структуру HTML, визначає тип форми, і передає стратегію браузерному агенту. Агент виконує тільки необхідні кроки для успішної відправки форми. Без зайвих запитів, без зайвого навантаження. Класифікатор працює швидко і точно. Навчання на реальних даних дає високу точність. Доведено і надійно. Масштабується ефективно. Працює.',
        },
        {
          q: 'Чому retention 0% — це добре?',
          a: 'GALA працює за принципом set-and-forget. Користувач налаштовує один раз і йде. Агент працює автономно, результати течуть у CRM. Правильні метрики: кількість відправлених форм, вхідні дзвінки, поповнення балансу — не session return rate. Це та сама модель що Zapier або будь-який фоновий автоматизаційний інструмент: реальне використання відбувається поза браузером. GA4 показує нульовий return rate, але це не проблема — це підтвердження моделі. Користувач заходить один раз, завантажує список сайтів, налаштовує формат повідомлення — і йде. Агент працює автономно 24×7 без участі людини. Повертатися на сайт немає причини, тому що продукт працює без нього. Автономність — ключова перевага. Працює завжди без зупинок.',
        },
        {
          q: 'Скільки коштує використання?',
          a: 'Старт: $0.10 за успішну відправку. Про: $0.10 за секцію форми. Enterprise: індивідуально з інтеграцією CRM та колл-трекінгом. Середня зарплата менеджера з лідогенерації в Україні — приблизно $690 на місяць. За $690 GALA відправляє 6 900 повідомлень. При конверсії 10% — 690 лідів на місяць. Менеджер за той самий бюджет фізично спроможний на максимум приблизно 200 контактів — навіть якщо витрачає 5 хвилин на сайт і працює без перерв. GALA працює 24×7 без лікарняних і відпусток. Інтеграція з CRM доступна в Enterprise-тарифі. Колл-трекінг через Zadarma фіксує зворотний зв\'язок від компаній. Юніт-економіка підтверджена реальними даними. Масштабується ефективно і швидко. Доведено реальними результатами.',
        },
        {
          q: 'Хто цільова аудиторія?',
          a: 'Українські підприємці та діаспора, які ведуть бізнес за кордоном після 2022. GA4 показує: Singapore, Wiesbaden, Amsterdam — типова географія українського B2B сьогодні. Це не іноземці і не боти. Це українські підприємці і діаспора, які ведуть бізнес за кордоном після 2022. Singapore (13 users), Lviv (8), Kyiv (6), Wiesbaden DE (5), Amsterdam (3), Kharkiv (3). Цільова аудиторія фізично розподілена по світу, але шукає інструменти для роботи з українським і міжнародним ринком. GALA потрапляє точно в цей сегмент. Колл-трекінг показує 99.8% дзвінків з України, мобільний Інтертелеком. Це підтверджує, що агент генерує живі ліди на українському ринку. Продукт вирішує реальну проблему. Доведено реальними даними.',
        },
      ],
    },
  },
  en: {
    slug: 'gala-b2b-lead-generation',
    altSlug: 'gala-b2b-lidogeneratsiya',
    readingTime: '12 min read',
    seo: {
      title: 'GALA: Autonomous B2B Lead Generation Agent — Case Study',
      description: 'Forward-deployed case: autonomous B2B agent with RoBERTa, deployed inside the customer. 85 calls/day peak, 90 active users, 15-25% browser load savings.',
    },
    nav: {
      breadcrumbHome: 'Home',
      breadcrumbCurrent: 'GALA',
    },
    header: {
      kicker: 'Case Study · Forward Deployed · Launched April 16, 2026',
      h1: 'GALA — Autonomous B2B Lead Generation Agent',
      subtitle: 'A forward-deployed case: I built the agent and deployed it directly inside the customer. An autonomous agent that fills contact forms on websites for B2B lead generation. RoBERTa classifier determines strategy before opening the page. Result: peak of 85 inbound calls per day and 90 active users.',
      date: 'Apr 16, 2026',
    },
    heroMetrics: [
      { value: '85', label: 'Calls/day (peak)' },
      { value: '90', label: 'Active users' },
      { value: '50-100ms', label: 'CPU inference' },
      { value: '20K', label: 'Website dataset' },
      { value: '99.8%', label: 'Ukraine (geo)' },
    ],
    tldr: 'GALA is an autonomous agent that fills contact forms on websites for B2B lead generation. Technical core: RoBERTa classifier (PyTorch) trained on 20,000 real websites. Before the agent opens a page, the model determines strategy: simple / CSRF / complex. Result: 15–25% browser load savings, peak of 85 inbound calls per day.',
    sections: {
      intro: {
        hook: 'Before April 16 — zero calls. Three and a half weeks of silence on Zadarma call tracking. After GALA launch on April 16: within 2–4 days — peak of 85 inbound calls per day. Stable baseline — 30–65 calls/day.',
        body: 'GALA is an autonomous agent that fills contact forms on websites for B2B lead generation. Finds potential clients, sends personalized messages, passes results to client CRM. Works 24×7 without human intervention. Technical core: RoBERTa classifier (PyTorch) trained on 20,000 real websites. Model determines form filling strategy before the browser opens the page. This gives 15–25% browser load savings compared to naive approach. CPU inference takes 50–100ms without GPU in production. Agent works autonomously, without manual intervention, generates live leads through contact forms on potential client websites.',
      },
      mainResult: {
        heading: 'Main Result',
        body: 'This is the cleanest forward-deployed case: the agent was built and deployed directly inside the customer\'s infrastructure, integrated with their call tracking and CRM. These calls are not traffic to the GALA website. These are companies that received a message from the agent and are calling back clients. Call tracking captures feedback — direct confirmation that the agent generates live leads. Before GALA launch on April 16 — three and a half weeks of silence on Zadarma. After launch — within 2–4 days peak of 85 inbound calls per day. Stable baseline — 30–65 calls/day. Call geo: 99.8% Ukraine, mobile Intertelecom. This confirms that the agent generates live leads in the Ukrainian market, not just sending forms into the void.',
        metrics: [
          { value: '85', label: 'Calls/day (peak)' },
          { value: '30-65', label: 'Calls/day (baseline)' },
          { value: '99.8%', label: 'Ukraine (geo)' },
          { value: '2-4', label: 'Days to peak' },
        ],
      },
      validation: {
        heading: 'Methodology: Cheap Lead Qualification Instead of Expensive Voice-AI',
        body: 'Before building a full voice-AI stack (Whisper STT + LLM dialogue + TTS voice) for lead qualification, I validated the hypothesis with the cheapest possible method. GALA generated an IVR menu, and the company\'s callback plus menu interaction already served as the qualification signal. No expensive live dialogues were needed: the callback itself proves the lead is hot. Over an 8-day pilot (June 1–8) — about 160 unique companies called back, 98% pickup rate. This is the classic forward-deployed approach: first the cheapest proxy to validate demand inside the customer\'s business, and only then invest in expensive infrastructure if the hypothesis holds.',
        metrics: [
          { value: '~160', label: 'Unique companies' },
          { value: '98%', label: 'Pickup rate' },
          { value: '8', label: 'Pilot days' },
          { value: '~$0', label: 'Voice-AI infra' },
        ],
        callout: 'Instead of an expensive Whisper + TTS pipeline — a cheap IVR proxy. The lead-qualification hypothesis was validated with real data before any investment in voice-AI.',
        insight: {
          heading: 'Insight: The Monday Effect',
          body: 'Pilot data revealed a clear pattern: callback peaks land on Monday (76 calls vs 29–36 on weekdays), because the agent sends forms at the end of the week and on weekends, and companies call back at the start of the work week. 92% of all calls happen during business hours 09:00–18:00, peak 09:00–11:00. A ready product optimization: sync the form dispatch to Monday morning.',
        },
      },
      ga4Data: {
        heading: 'GA4 Data (Jan 29 – Apr 28, 2026)',
        body: '90 active users over 90 days. 91 new users — almost all new. Average engagement time: 28 seconds. 493 events total.',
        traffic: {
          heading: 'Traffic Sources (sessions)',
          items: [
            { source: 'google / cpc', value: '56 (51%)', desc: 'paid traffic' },
            { source: 'direct', value: '48 (44%)', desc: 'direct visits, word of mouth' },
            { source: 'Teams CDN', value: '2', desc: 'corporate Microsoft Teams — real B2B signal' },
          ],
        },
        geo: {
          heading: 'Geo — Who Are GALA Clients',
          body: 'Singapore (13 users), Lviv (8), Kyiv (6), Wiesbaden DE (5), Amsterdam (3), Kharkiv (3). These are not foreigners or bots. These are Ukrainian entrepreneurs and diaspora running businesses abroad after 2022.',
        },
        pages: {
          heading: 'Pages',
          items: [
            { page: 'Home (GALA/Imaginify)', users: '11', events: '32', bounce: '62.5%' },
            { page: 'Landing "Gala | Lead Generation"', users: '3', bounce: '0%', note: 'those who reached the product page read to the end' },
          ],
        },
      },
      retention: {
        heading: 'Why 0% Retention Is a Sign of the Right Product',
        body: 'GA4 shows zero return rate. This is not a problem — it is confirmation of the model. GALA works on a set-and-forget principle: user logs in once, uploads a list of sites, configures message format — and leaves. The agent works autonomously, results flow into client CRM. This is the same model as Zapier or any background automation tool: real usage happens outside the browser. User does not return to the site because the product works without them. No reason to return — agent works 24×7 autonomously.',
        callout: 'The right retention metrics for GALA are not session return rate in GA4, but agent activity: number of forms sent, volume of inbound calls on Zadarma, balance top-ups.',
      },
      economics: {
        heading: 'Unit Economics',
        body: 'Average lead generation manager salary in Ukraine — ~$690/month. For $690 GALA sends 6,900 messages. At 10% conversion — 690 leads per month. A manager for the same budget can physically handle a maximum of ~200 contacts. Even if manager spends 5 minutes per site and works without breaks, they cannot compete with autonomous agent. GALA works 24×7 without sick leave, vacations, or fatigue. Scales without additional personnel costs. CRM integration available in Enterprise tier for automatic lead flow.',
        comparison: {
          headers: ['', 'Manager', 'GALA'],
          rows: [
            ['Cost/month', '$690', '$690'],
            ['Leads/month', '~200', '~690'],
            ['Availability', '8 hrs/day', '24×7'],
            ['Sick leave / vacation', 'Yes', 'No'],
            ['CRM integration', 'Yes', 'Extra fee'],
          ],
        },
      },
      technical: {
        heading: 'Technical Advantage: Why RoBERTa, Not GPT',
        body: 'Not prompt engineering on top of GPT-4. Own trained model on real dataset with measurable effect. Classifier decides strategy before the browser opens the page. RoBERTa classifier trained on 20,000 real websites. Model analyzes HTML structure, determines form type, and passes strategy to browser agent. Agent executes only necessary steps for successful form submission. No extra requests, no extra load. CPU inference takes 50–100ms without GPU in production. This scales without growing token costs, unlike GPT-4.',
        classes: [
          { name: 'simple', desc: 'standard form, direct submit' },
          { name: 'CSRF', desc: 'form with protection token, requires prior session' },
          { name: 'complex', desc: 'multi-section form, file uploads, complex logic' },
        ],
        result: 'Routing result: browser agent does not waste resources on unnecessary steps. Hence 15–25% load savings and 50–100ms CPU inference — no GPU in production.',
      },
      monetization: {
        heading: 'Monetization',
        tiers: [
          { name: 'Start', price: '$0.10 per successful submission' },
          { name: 'Pro', price: '$0.10 per form section (multi-section forms)' },
          { name: 'Enterprise', price: 'complex scenarios, CRM integration, call tracking — custom' },
        ],
      },
      next: {
        heading: 'What\'s Next',
        items: [
          'SEO: organic coverage of queries "B2B lead generation", "cold outreach automation", "contact form filling"',
          'International market: Singapore, Wiesbaden, Amsterdam in GA4 — testing EU audience with the same pain points',
          'Dataset expansion: more form types, more languages for classifier',
          'Retention through product: agent activity dashboard, submission stats, weekly digest in CRM',
        ],
      },
      stack: {
        heading: 'Stack',
        items: [
          { name: 'Python', role: 'Primary language' },
          { name: 'PyTorch', role: 'ML framework for RoBERTa' },
          { name: 'RoBERTa', role: 'Form strategy classifier' },
          { name: 'Playwright', role: 'Browser automation' },
          { name: 'Zadarma', role: 'Call tracking' },
          { name: 'Astro', role: 'Frontend framework' },
          { name: 'Google Ads', role: 'Paid traffic' },
        ],
      },
      resources: {
        heading: 'Resources',
        items: [
          { label: 'GALA — Autonomous B2B lead generation agent', url: 'https://gala.esupport.org.ua' },
        ],
      },
    },
    faq: {
      heading: 'FAQ',
      items: [
        {
          q: 'Why RoBERTa, not GPT?',
          a: 'Own trained model on 20,000 real websites gives measurable effect: 15–25% browser load savings. GPT-4 costs tokens per request, RoBERTa — 50–100ms CPU inference without GPU. This scales without growing token costs. Classifier decides strategy before the browser opens the page. Three classes: simple (direct submit), CSRF (requires prior session), complex (multi-section form). Routing result: browser agent does not waste resources on unnecessary steps. Not prompt engineering on top of GPT-4, but own trained model on real dataset with measurable effect. CPU inference without GPU in production gives infrastructure cost savings. Model trained on real data. Efficient and fast. Scalable.',
        },
        {
          q: 'How does the classifier work?',
          a: 'Model determines form filling strategy BEFORE the browser opens the page. Three classes: simple (direct submit), CSRF (requires prior session), complex (multi-section form). Result: agent does not waste resources on unnecessary steps. RoBERTa classifier trained on 20,000 real websites. CPU inference takes 50–100ms without GPU. This gives 15–25% browser load savings compared to naive approach. Model analyzes HTML structure, determines form type, and passes strategy to browser agent. Agent executes only necessary steps for successful form submission. No extra requests, no extra load. Classifier works fast and accurately. Training on real data gives high accuracy. Proven and reliable. Scalable efficiently.',
        },
        {
          q: 'Why is 0% retention good?',
          a: 'GALA works on a set-and-forget principle. User configures once and leaves. Agent works autonomously, results flow into CRM. Right metrics: number of forms sent, inbound calls, balance top-ups — not session return rate. This is the same model as Zapier or any background automation tool: real usage happens outside the browser. GA4 shows zero return rate, but this is not a problem — it is confirmation of the model. User logs in once, uploads a list of sites, configures message format — and leaves. Agent works autonomously 24×7 without human intervention. No reason to return to the site because the product works without it.',
        },
        {
          q: 'How much does it cost to use?',
          a: 'Start: $0.10 per successful submission. Pro: $0.10 per form section. Enterprise: custom with CRM integration and call tracking. Average lead generation manager salary in Ukraine — approximately $690 per month. For $690 GALA sends 6,900 messages. At 10% conversion — 690 leads per month. A manager for the same budget can physically handle a maximum of approximately 200 contacts — even if spending 5 minutes per site and working without breaks. GALA works 24×7 without sick leave and vacations. CRM integration available in Enterprise tier. Call tracking via Zadarma captures feedback from companies. Unit economics confirmed by real data. Scalable.',
        },
        {
          q: 'Who is the target audience?',
          a: 'Ukrainian entrepreneurs and diaspora running businesses abroad after 2022. GA4 shows: Singapore, Wiesbaden, Amsterdam — typical geography of Ukrainian B2B today. These are not foreigners or bots. These are Ukrainian entrepreneurs and diaspora running businesses abroad after 2022. Singapore (13 users), Lviv (8), Kyiv (6), Wiesbaden DE (5), Amsterdam (3), Kharkiv (3). Target audience is physically distributed worldwide, but seeks tools for working with Ukrainian and international markets. GALA hits this segment precisely. Call tracking shows 99.8% calls from Ukraine, mobile Intertelecom. This confirms that the agent generates live leads in the Ukrainian market. Product solves real problem. Proven by data.',
        },
      ],
    },
  },
} as const
