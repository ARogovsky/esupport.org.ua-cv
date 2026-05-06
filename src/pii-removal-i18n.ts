export type PiiRemovalLang = 'uk' | 'en'

export const piiRemovalContent = {
  uk: {
    slug: 'pii-removal-roberta-ukrainska',
    altSlug: 'pii-removal-roberta-ukrainian',
    readingTime: '10 хв читання',
    seo: {
      title: 'PII Removal: RoBERTa Ukrainian | AI ML Engineer',
      description: 'Fine-tuned RoBERTa модель для видалення персональних даних з українських текстів. 76-87% точність vs 14% AWS і 37% Azure. Knowledge distillation від OpenAI.',
    },
    nav: {
      breadcrumbHome: 'Головна',
      breadcrumbCurrent: 'PII Removal',
    },
    header: {
      kicker: 'Case Study: CTO & Tech Lead',
      h1: 'PII Removal — Fine-tuned RoBERTa для українських персональних даних',
      subtitle: 'Модель для видалення персональних даних з українських текстів. Навчена на реальних витоках даних з підтримкою кирилиці, транслітерації (до і після 2010) та українських ідентифікаторів.',
      date: 'pii.it-sprout.org.ua',
    },
    heroMetrics: [
      { value: '76-87%', label: 'Загальна точність' },
      { value: '+450%', label: 'vs AWS Comprehend' },
      { value: '+105%', label: 'vs Azure AI Language' },
      { value: '100%', label: 'ПІБ кирилицею' },
      { value: '10', label: 'Категорій PII' },
    ],
    tldr: 'Стандартні хмарні рішення (AWS Comprehend, Azure AI Language) показують 14% і 37% точності на українських текстах. Причина: відсутність навчальних даних з кирилицею, підтримки транслітерації та розуміння українських ідентифікаторів (РНОКПП, ЄДРПОУ). Рішення: fine-tuned RoBERTa модель, навчена на реальних витоках українських даних з knowledge distillation від OpenAI. Результат: 76-87% точність — +105% до Azure, +450% до AWS.',
    sections: {
      context: {
        heading: 'Контекст',
        problem: 'Стандартні хмарні рішення для видалення персональних даних — AWS Comprehend і Azure AI Language — показують 14% і 37% точності на українських текстах.',
        reason: 'Причина проста: обидва сервіси не мають ні навчальних даних з кирилицею, ні підтримки транслітерації за українськими правилами, ні розуміння специфічних ідентифікаторів — РНОКПП, ЄДРПОУ, серій паспортів. AWS Comprehend навчений переважно на англійських текстах з латиницею, Azure AI Language має базову підтримку кирилиці для російської мови, але не розуміє українську специфіку. Обидва сервіси не враховують історичні зміни у транслітерації: до 2010 року діяла одна система, після постанови КМУ №55 — інша. Volodimir став Volodymyr, Irina — Iryna, але старі документи залишились з попередньою транслітерацією. Хмарні сервіси також не розуміють формати українських ідентифікаторів: РНОКПП з 10 цифр, ЄДРПОУ з 8 цифр, серії паспортів типу АА №123456. Для них це просто числа без контексту.',
        task: 'Завдання: побудувати модель, яка працює з реальними українськими даними — кирилицею, транслітерацією (сучасною і до 2010 року), змішаними текстами, юридичними особами і медичними записами. Модель повинна розпізнавати ПІБ у кирилиці та латиниці, телефони у різних форматах (+380, 380, 0), email з українськими доменами, адреси з скороченнями вул., пров., бул., фінансові дані IBAN та номери карток, документи паспорт, РНОКПП, ЄДРПОУ, медичні записи з діагнозами та препаратами, юридичні особи з ПІБ директорів. Критично: модель повинна працювати на CPU без GPU, мати інференс до 100ms, бути детерміністичною для compliance.',
      },
      role: {
        heading: 'Моя Роль',
        intro: 'Я працював як CTO і технічний лід команди з двох інтернів.',
        responsibilities: [
          {
            percentage: '60%',
            title: 'Менеджмент і архітектура',
            desc: 'Визначав технічну стратегію: вибір підходу knowledge distillation від OpenAI замість навчання з нуля, архітектуру пайплайну, пріоритети розробки. Ставив задачі інтернам, ревʼювив код і результати тренувань, приймав архітектурні рішення. Відповідав за те, щоб команда рухалась у правильному напрямку і не витрачала час на хибні підходи. Планував спринти, розподіляв задачі між інтернами, проводив щоденні стендапи, ревʼювив pull requests, аналізував метрики тренування, приймав рішення про зміну гіперпараметрів. Вибирав між різними підходами: fine-tuning vs training from scratch, RoBERTa vs BERT vs DistilBERT, knowledge distillation vs manual annotation. Кожне рішення обґрунтовував метриками і часом розробки.',
          },
          {
            percentage: '30%',
            title: 'Hands-on',
            desc: 'Особисто відповідав за MLOps інфраструктуру і деплой у продакшн. Налаштовував середовище тренування, CI/CD для моделей, моніторинг і інференс у проді. Також особисто розробляв правила транслітерації — критична частина, яку інтерни не могли зробити самостійно. Налаштовував Docker контейнери для тренування і інференсу, писав скрипти для версіонування моделей, інтегрував Weights & Biases для трекінгу експериментів, розгортав FastAPI для production API, налаштовував моніторинг латентності і throughput. Правила транслітерації розробляв особисто: аналізував постанову КМУ №55, порівнював з попередніми стандартами, тестував на реальних прикладах з витоків даних, валідував на edge cases.',
          },
          {
            percentage: '10%',
            title: 'Менторинг',
            desc: 'Пояснював інтернам принципи fine-tuning трансформерів, code review, розбір помилок у тренуванні. Навчав як читати метрики loss і accuracy, як інтерпретувати confusion matrix, як дебажити overfitting і underfitting, як оптимізувати гіперпараметри learning rate, batch size, epochs. Показував як працювати з PyTorch, як використовувати Hugging Face Transformers, як писати custom datasets і dataloaders, як профілювати код для оптимізації швидкості.',
          },
        ],
      },
      technical: {
        heading: 'Технічне Рішення',
        approaches: [
          {
            title: 'Knowledge distillation від OpenAI',
            desc: 'Замість ручної розмітки всього датасету — використали OpenAI як "вчителя" для генерації розмічених прикладів. Це прискорило підготовку навчальних даних і підвищило якість розмітки порівняно з ручним процесом.',
          },
          {
            title: 'Датасет — реальні витоки',
            desc: 'Модель навчалась на реальному датасеті витоків українських персональних даних. Це критично: синтетичні дані не відображають реальну варіативність — помилки у іменах, нестандартні формати телефонів, змішані кирилично-латинські тексти.',
          },
          {
            title: 'Правила транслітерації по роках',
            desc: 'Окремий компонент для обробки транслітерації. Правила різняться до і після 2010 року (постанова КМУ №55): Volodimir/Volodymyr, Irina/Iryna, Tkachenko/Tkachenko — модель розпізнає обидва варіанти. Це розроблено особисто мною.',
          },
          {
            title: 'RoBERTa fine-tuned на PyTorch',
            desc: 'Базова архітектура — roberta-base, fine-tuning для NER задачі з класами: Person, PhoneNumber, Location, SocialMedia, DocumentID.',
          },
          {
            title: 'MLOps і деплой — особисто',
            desc: 'Інфраструктура тренування, версіонування моделей, деплой API у продакшн — моя відповідальність від початку до кінця.',
          },
        ],
      },
      benchmark: {
        heading: 'Результати Бенчмарку',
        intro: 'Тестував на власному датасеті з 10 категорій, 64 PII-сутності — кирилиця, транслітерація, змішані тексти, фінансові дані, медичні записи, юридичні особи.',
        categories: [
          { name: 'ПІБ кирилицею', accuracy: '100%' },
          { name: 'Транслітерація сучасна (post-2010)', accuracy: '100%' },
          { name: 'Транслітерація стара (pre-2010)', accuracy: '100%' },
          { name: 'Телефони + email', accuracy: '90%' },
          { name: 'Складний змішаний текст', accuracy: '90%' },
          { name: 'Фінансові дані (IBAN, картки)', accuracy: '80%' },
          { name: 'Юридичні особи + директор', accuracy: '80%' },
          { name: 'Медичні дані', accuracy: '80%' },
          { name: 'Документи (паспорт, РНОКПП)', accuracy: '86%' },
          { name: 'Адреси', accuracy: '67%' },
        ],
        overall: 'Загальна точність: ~76–87%',
        comparison: {
          heading: 'Порівняння з конкурентами на українських даних',
          tools: [
            { name: 'AWS Comprehend', accuracy: '14%' },
            { name: 'Azure AI Language', accuracy: '37%' },
            { name: 'PII Removal (наша модель)', accuracy: '76–87%' },
          ],
          result: 'Результат: +105% до Azure, +450% до AWS на українських текстах.',
        },
      },
      gaps: {
        heading: 'Що Відомо Про Прогалини',
        issues: [
          {
            title: 'Boundary clipping',
            desc: 'Модель обрізає краї токенів на початку і кінці сутностей. Проявляється у коротких текстах без контексту. У PDF-тесті з довшими фрагментами проблема зменшується: контекст допомагає.',
          },
          {
            title: 'Адреси (67%)',
            desc: 'Назви вулиць без слова "вул." пропускаються. Потребує окремого класу і додаткових прикладів.',
          },
          {
            title: 'ЄДРПОУ і номери паспортів',
            desc: 'За ЗУ "Про захист персональних даних" паспортні дані фізособи є персональними. ЄДРПОУ — публічний реєстр держави. Модель поки не розрізняє ці два класи явно — наступна ітерація.',
          },
        ],
        future: 'При фіксі boundary clipping і розширенні класифікатора для документів — модель виходить на 90%+.',
      },
      next: {
        heading: 'Що Далі',
        items: [
          'Фікс boundary clipping через донавчання на граничних кейсах',
          'Окремий клас для DocumentID з підтипами: паспорт, РНОКПП, ЄДРПОУ, ІПН',
          'Розширення датасету для адрес — без явних маркерів типу "вул."',
          'Підтримка PDF з кирилицею без втрати encoding (поточний артефакт nnn)',
        ],
      },
      stack: {
        heading: 'Стек',
        items: [
          { name: 'Python', role: 'Основна мова' },
          { name: 'PyTorch', role: 'ML framework' },
          { name: 'RoBERTa', role: 'Transformer model' },
          { name: 'Knowledge Distillation', role: 'Оптимізація моделі' },
          { name: 'OpenAI API', role: 'Генерація даних' },
          { name: 'FastAPI', role: 'API framework' },
          { name: 'Docker', role: 'Контейнеризація' },
          { name: 'MLOps', role: 'Deployment' },
        ],
      },
    },
    faq: {
      heading: 'FAQ',
      items: [
        {
          q: 'Чому не використали готові рішення AWS або Azure?',
          a: 'AWS Comprehend показує 14% точності на українських текстах, Azure AI Language — 37%. Обидва не мають навчальних даних з кирилицею і не розуміють українські ідентифікатори РНОКПП, ЄДРПОУ. Наша модель досягає 76-87% точності завдяки навчанню на реальних витоках українських даних з підтримкою кирилиці, транслітерації за правилами до і після 2010 року, розпізнаванням специфічних форматів документів та ідентифікаторів. Хмарні сервіси не можуть обробляти змішані кирилично-латинські тексти, не розуміють варіативність українських імен у транслітерації та не враховують особливості форматування персональних даних у локальних документах і базах даних. Додатково, хмарні рішення мають обмеження по приватності даних: передача персональних даних на зовнішні сервери може порушувати GDPR та українське законодавство про захист персональних даних.',
        },
        {
          q: 'Чому RoBERTa, а не GPT?',
          a: 'RoBERTa — спеціалізована модель для NER задач з швидким інференсом 50-100ms на CPU. GPT — генеративна модель, яка потребує більше ресурсів і менш передбачувана для класифікації. Для production PII removal потрібна швидкість і точність, а не генерація тексту. RoBERTa навчена на masked language modeling, що робить її ідеальною для розуміння контексту і класифікації токенів. Вона споживає менше памʼяті, працює швидше на CPU без GPU, має детерміністичний output для кожного input, що критично для compliance і аудиту. GPT потребує GPU для прийнятної швидкості, має варіативний output навіть з temperature=0, споживає у 3-5 разів більше памʼяті. Для задач класифікації і NER RoBERTa показує кращі результати при менших витратах ресурсів.',
        },
        {
          q: 'Що таке knowledge distillation від OpenAI?',
          a: 'Замість ручної розмітки тисяч прикладів ми використали OpenAI як вчителя для генерації розмічених даних. Це прискорило підготовку датасету і підвищило якість розмітки порівняно з ручним процесом. Процес виглядає так: беремо неразмічений текст з реальних витоків, передаємо в OpenAI API з промптом для розпізнавання PII, отримуємо розмічені сутності, валідуємо результат, додаємо в тренувальний датасет. Це дозволило створити понад 10000 розмічених прикладів за тиждень замість місяців ручної роботи. Якість розмітки вища за ручну, бо OpenAI розуміє контекст краще за людину-аннотатора без спеціалізації. Підхід knowledge distillation дозволяє отримати компактну модель з якістю близькою до великої teacher моделі, але з набагато меншими вимогами до ресурсів.',
        },
        {
          q: 'Чому модель навчалась на реальних витоках даних?',
          a: 'Синтетичні дані не відображають реальну варіативність: помилки у іменах, нестандартні формати телефонів, змішані кирилично-латинські тексти. Реальні витоки дають модель розуміння того, як виглядають дані в продакшені. У реальних даних зустрічаються опечатки в іменах, неповні адреси, телефони без кодів країн, email з помилками, змішані формати дат, транслітерація за різними стандартами, застарілі формати документів. Синтетичні датасети генерують ідеальні приклади, які не готують модель до реального світу. Навчання на витоках дає модель стійкість до шуму, розуміння контексту і здатність розпізнавати PII навіть у некоректно відформатованих текстах. Це критично для роботи з legacy системами та базами даних з неконсистентним форматуванням даних та складною структурою.',
        },
        {
          q: 'Що з boundary clipping?',
          a: 'Модель іноді обрізає краї токенів на початку і кінці сутностей. Це проявляється у коротких текстах без контексту. Фікс — донавчання на граничних кейсах. У довших текстах PDF проблема менш помітна. Причина в токенізації: RoBERTa розбиває текст на subword tokens, і якщо сутність починається або закінчується на рідкісний subword, модель може пропустити його. Наприклад, Ткаченко може токенізуватись як Тка-чен-ко, і модель може пропустити Тка або ко. Рішення: розширити тренувальний датасет прикладами з граничними токенами, додати augmentation з обрізанням контексту, використати CRF layer для врахування залежностей між токенами. Також планується експеримент з різними токенізаторами для кращої обробки українських слів та морфології української мови.',
        },
      ],
    },
  },
  en: {
    slug: 'pii-removal-roberta-ukrainian',
    altSlug: 'pii-removal-roberta-ukrainska',
    readingTime: '10 min read',
    seo: {
      title: 'PII Removal: RoBERTa Model | AI ML Engineer',
      description: 'Fine-tuned RoBERTa model for removing personal data from Ukrainian texts. 76-87% accuracy vs 14% AWS and 37% Azure. Knowledge distillation from OpenAI.',
    },
    nav: {
      breadcrumbHome: 'Home',
      breadcrumbCurrent: 'PII Removal',
    },
    header: {
      kicker: 'Case Study: CTO & Tech Lead',
      h1: 'PII Removal — Fine-tuned RoBERTa for Ukrainian Personal Data',
      subtitle: 'Model for removing personal data from Ukrainian texts. Trained on real data leaks with support for Cyrillic, transliteration (pre/post-2010), and Ukrainian identifiers.',
      date: 'pii.it-sprout.org.ua',
    },
    heroMetrics: [
      { value: '76-87%', label: 'Overall Accuracy' },
      { value: '+450%', label: 'vs AWS Comprehend' },
      { value: '+105%', label: 'vs Azure AI Language' },
      { value: '100%', label: 'Names in Cyrillic' },
      { value: '10', label: 'PII Categories' },
    ],
    tldr: 'Standard cloud solutions (AWS Comprehend, Azure AI Language) show 14% and 37% accuracy on Ukrainian texts. Reason: no training data with Cyrillic, no transliteration support, no understanding of Ukrainian identifiers (RNOKPP, EDRPOU). Solution: fine-tuned RoBERTa model trained on real Ukrainian data leaks with knowledge distillation from OpenAI. Result: 76-87% accuracy — +105% vs Azure, +450% vs AWS.',
    sections: {
      context: {
        heading: 'Context',
        problem: 'Standard cloud solutions for PII removal — AWS Comprehend and Azure AI Language — show 14% and 37% accuracy on Ukrainian texts.',
        reason: 'Simple reason: both services lack training data with Cyrillic, transliteration support per Ukrainian rules, and understanding of specific identifiers — RNOKPP, EDRPOU, passport series. AWS Comprehend is trained primarily on English texts with Latin script, Azure AI Language has basic Cyrillic support for Russian language but doesn\'t understand Ukrainian specifics. Both services don\'t account for historical changes in transliteration: before 2010 one system was used, after CMU resolution №55 — another. Volodimir became Volodymyr, Irina — Iryna, but old documents remained with previous transliteration. Cloud services also don\'t understand formats of Ukrainian identifiers: RNOKPP with 10 digits, EDRPOU with 8 digits, passport series like AA №123456. For them, these are just numbers without context.',
        task: 'Task: build a model that works with real Ukrainian data — Cyrillic, transliteration (modern and pre-2010), mixed texts, legal entities, and medical records. Model must recognize names in Cyrillic and Latin, phones in different formats (+380, 380, 0), emails with Ukrainian domains, addresses with abbreviations street, lane, boulevard, financial data IBAN and card numbers, documents passport, RNOKPP, EDRPOU, medical records with diagnoses and medications, legal entities with director names. Critical: model must work on CPU without GPU, have inference under 100ms, be deterministic for compliance.',
      },
      role: {
        heading: 'My Role',
        intro: 'I worked as CTO and tech lead of a team with two interns.',
        responsibilities: [
          {
            percentage: '60%',
            title: 'Management & Architecture',
            desc: 'Defined technical strategy: choosing knowledge distillation from OpenAI instead of training from scratch, pipeline architecture, development priorities. Assigned tasks to interns, reviewed code and training results, made architectural decisions. Responsible for keeping the team moving in the right direction and not wasting time on wrong approaches. Planned sprints, distributed tasks between interns, conducted daily standups, reviewed pull requests, analyzed training metrics, made decisions about hyperparameter changes. Chose between different approaches: fine-tuning vs training from scratch, RoBERTa vs BERT vs DistilBERT, knowledge distillation vs manual annotation. Justified each decision with metrics and development time.',
          },
          {
            percentage: '30%',
            title: 'Hands-on',
            desc: 'Personally responsible for MLOps infrastructure and production deployment. Set up training environment, CI/CD for models, monitoring and inference in prod. Also personally developed transliteration rules — critical part that interns couldn\'t do independently. Configured Docker containers for training and inference, wrote scripts for model versioning, integrated Weights & Biases for experiment tracking, deployed FastAPI for production API, set up monitoring for latency and throughput. Developed transliteration rules personally: analyzed CMU resolution №55, compared with previous standards, tested on real examples from data leaks, validated on edge cases.',
          },
          {
            percentage: '10%',
            title: 'Mentoring',
            desc: 'Explained transformer fine-tuning principles to interns, code review, analysis of training errors. Taught how to read loss and accuracy metrics, how to interpret confusion matrix, how to debug overfitting and underfitting, how to optimize hyperparameters learning rate, batch size, epochs. Showed how to work with PyTorch, how to use Hugging Face Transformers, how to write custom datasets and dataloaders, how to profile code for speed optimization.',
          },
        ],
      },
      technical: {
        heading: 'Technical Solution',
        approaches: [
          {
            title: 'Knowledge distillation from OpenAI',
            desc: 'Instead of manual annotation of the entire dataset — used OpenAI as a "teacher" to generate labeled examples. This accelerated training data preparation and improved annotation quality compared to manual process.',
          },
          {
            title: 'Dataset — real leaks',
            desc: 'Model trained on real dataset of Ukrainian personal data leaks. This is critical: synthetic data doesn\'t reflect real variability — name typos, non-standard phone formats, mixed Cyrillic-Latin texts.',
          },
          {
            title: 'Transliteration rules by year',
            desc: 'Separate component for transliteration processing. Rules differ before and after 2010 (CMU resolution №55): Volodimir/Volodymyr, Irina/Iryna, Tkachenko/Tkachenko — model recognizes both variants. Developed personally by me.',
          },
          {
            title: 'RoBERTa fine-tuned on PyTorch',
            desc: 'Base architecture — roberta-base, fine-tuning for NER task with classes: Person, PhoneNumber, Location, SocialMedia, DocumentID.',
          },
          {
            title: 'MLOps & deployment — personally',
            desc: 'Training infrastructure, model versioning, production API deployment — my responsibility from start to finish.',
          },
        ],
      },
      benchmark: {
        heading: 'Benchmark Results',
        intro: 'Tested on own dataset with 10 categories, 64 PII entities — Cyrillic, transliteration, mixed texts, financial data, medical records, legal entities.',
        categories: [
          { name: 'Names in Cyrillic', accuracy: '100%' },
          { name: 'Modern transliteration (post-2010)', accuracy: '100%' },
          { name: 'Old transliteration (pre-2010)', accuracy: '100%' },
          { name: 'Phones + email', accuracy: '90%' },
          { name: 'Complex mixed text', accuracy: '90%' },
          { name: 'Financial data (IBAN, cards)', accuracy: '80%' },
          { name: 'Legal entities + director', accuracy: '80%' },
          { name: 'Medical data', accuracy: '80%' },
          { name: 'Documents (passport, RNOKPP)', accuracy: '86%' },
          { name: 'Addresses', accuracy: '67%' },
        ],
        overall: 'Overall accuracy: ~76–87%',
        comparison: {
          heading: 'Comparison with competitors on Ukrainian data',
          tools: [
            { name: 'AWS Comprehend', accuracy: '14%' },
            { name: 'Azure AI Language', accuracy: '37%' },
            { name: 'PII Removal (our model)', accuracy: '76–87%' },
          ],
          result: 'Result: +105% vs Azure, +450% vs AWS on Ukrainian texts.',
        },
      },
      gaps: {
        heading: 'Known Gaps',
        issues: [
          {
            title: 'Boundary clipping',
            desc: 'Model clips token edges at the beginning and end of entities. Appears in short texts without context. In PDF tests with longer fragments, the problem decreases: context helps.',
          },
          {
            title: 'Addresses (67%)',
            desc: 'Street names without the word "street" are missed. Requires separate class and additional examples.',
          },
          {
            title: 'EDRPOU and passport numbers',
            desc: 'Per Law "On Personal Data Protection", passport data of individuals is personal. EDRPOU is a public state registry. Model doesn\'t explicitly distinguish these two classes yet — next iteration.',
          },
        ],
        future: 'With boundary clipping fix and expanded document classifier — model reaches 90%+.',
      },
      next: {
        heading: 'What\'s Next',
        items: [
          'Fix boundary clipping through retraining on edge cases',
          'Separate class for DocumentID with subtypes: passport, RNOKPP, EDRPOU, IPN',
          'Dataset expansion for addresses — without explicit markers like "street"',
          'PDF support with Cyrillic without encoding loss (current artifact nnn)',
        ],
      },
      stack: {
        heading: 'Stack',
        items: [
          { name: 'Python', role: 'Primary language' },
          { name: 'PyTorch', role: 'ML framework' },
          { name: 'RoBERTa', role: 'Transformer model' },
          { name: 'Knowledge Distillation', role: 'Model optimization' },
          { name: 'OpenAI API', role: 'Data generation' },
          { name: 'FastAPI', role: 'API framework' },
          { name: 'Docker', role: 'Containerization' },
          { name: 'MLOps', role: 'Deployment' },
        ],
      },
    },
    faq: {
      heading: 'FAQ',
      items: [
        {
          q: 'Why not use ready-made AWS or Azure solutions?',
          a: 'AWS Comprehend shows 14% accuracy on Ukrainian texts, Azure AI Language — 37%. Both lack training data with Cyrillic and don\'t understand Ukrainian identifiers RNOKPP, EDRPOU. Our model achieves 76-87% accuracy thanks to training on real Ukrainian data leaks with support for Cyrillic, transliteration per pre/post-2010 rules, recognition of specific document formats and identifiers. Cloud services cannot process mixed Cyrillic-Latin texts, don\'t understand variability of Ukrainian names in transliteration, and don\'t account for peculiarities of personal data formatting in local documents and databases. Additionally, cloud solutions have data privacy limitations: transferring personal data to external servers may violate GDPR and Ukrainian personal data protection legislation.',
        },
        {
          q: 'Why RoBERTa and not GPT?',
          a: 'RoBERTa is a specialized model for NER tasks with fast inference 50-100ms on CPU. GPT is a generative model that requires more resources and is less predictable for classification. For production PII removal, we need speed and accuracy, not text generation. RoBERTa is trained on masked language modeling, making it ideal for understanding context and token classification. It consumes less memory, runs faster on CPU without GPU, has deterministic output for each input, which is critical for compliance and audit. GPT requires GPU for acceptable speed, has variable output even with temperature=0, consumes 3-5x more memory. For classification and NER tasks, RoBERTa shows better results with lower resource costs.',
        },
        {
          q: 'What is knowledge distillation from OpenAI?',
          a: 'Instead of manually annotating thousands of examples, we used OpenAI as a teacher to generate labeled data. This accelerated dataset preparation and improved annotation quality compared to manual process. The process looks like this: take unlabeled text from real leaks, pass to OpenAI API with prompt for PII recognition, receive labeled entities, validate result, add to training dataset. This allowed creating over 10000 labeled examples in a week instead of months of manual work. Annotation quality is higher than manual because OpenAI understands context better than a human annotator without specialization. Knowledge distillation approach allows obtaining a compact model with quality close to large teacher model, but with much lower resource requirements.',
        },
        {
          q: 'Why train on real data leaks?',
          a: 'Synthetic data doesn\'t reflect real variability: name typos, non-standard phone formats, mixed Cyrillic-Latin texts. Real leaks give the model understanding of what data looks like in production. Real data contains typos in names, incomplete addresses, phones without country codes, emails with errors, mixed date formats, transliteration per different standards, outdated document formats. Synthetic datasets generate perfect examples that don\'t prepare the model for the real world. Training on leaks gives the model robustness to noise, context understanding, and ability to recognize PII even in incorrectly formatted texts. This is critical for working with legacy systems and databases with inconsistent formatting.',
        },
        {
          q: 'What about boundary clipping?',
          a: 'Model sometimes clips token edges at the beginning and end of entities. This appears in short texts without context. Fix — retraining on edge cases. In longer PDF texts, the problem is less noticeable. The reason is tokenization: RoBERTa splits text into subword tokens, and if an entity starts or ends with a rare subword, the model may miss it. For example, Tkachenko may tokenize as Tka-chen-ko, and the model may miss Tka or ko. Solution: expand training dataset with edge token examples, add augmentation with context clipping, use CRF layer to account for dependencies between tokens. Also planning experiment with different tokenizers for better processing of Ukrainian words.',
        },
      ],
    },
  },
} as const
