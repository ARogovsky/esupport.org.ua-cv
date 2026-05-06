export type SmartCoursesLang = 'uk' | 'en'

export const smartCoursesContent = {
  uk: {
    slug: 'smartcourses-edtech-platforma',
    altSlug: 'smartcourses-edtech-platform',
    readingTime: '8 хв читання',
    seo: {
      title: 'SmartCourses: EdTech Platform | AI Software Engineer',
      description: 'EdTech платформа з університетською акредитацією. 502 реєстрації, 500 бажаючих купити, CTR 13-17%. AI-driven GTM і автоматизований sales pipeline.',
    },
    nav: {
      breadcrumbHome: 'Головна',
      breadcrumbCurrent: 'SmartCourses',
    },
    header: {
      kicker: 'Case Study: eij.com.ua',
      h1: 'SmartCourses — EdTech платформа для підвищення кваліфікації вчителів',
      subtitle: 'EdTech платформа з акредитованими сертифікатами від університету, AI-driven outreach і повністю автоматизованим sales pipeline. 502 реєстрації, 500 бажаючих купити, CTR 13-17%.',
      date: 'eij.com.ua',
    },
    heroMetrics: [
      { value: '502', label: 'Реєстрації' },
      { value: '500', label: 'Бажаючих купити' },
      { value: '13-17%', label: 'CTR Google Ads' },
      { value: '22', label: 'Пілотні продажі' },
      { value: '13 100₴', label: 'Авансові надходження' },
    ],
    tldr: 'Українські вчителі зобов\'язані регулярно проходити курси підвищення кваліфікації. Після 2022 року офлайн-формат став проблематичним. SmartCourses — EdTech платформа з акредитованими сертифікатами від Тернопільського національного педагогічного університету, AI-driven outreach і повністю автоматизованим sales pipeline. Результат: 502 реєстрації, 500 бажаючих купити, CTR 13-17%, 22 пілотні продажі. Масштабування зупинилось через масові відключення електроенергії в Україні.',
    sections: {
      context: {
        heading: 'Контекст',
        problem: 'Українські вчителі зобов\'язані регулярно проходити курси підвищення кваліфікації. Після 2022 року офлайн-формат став проблематичним — переміщення, безпека, логістика. Онлайн-альтернативи або дорогі, або не мають університетської акредитації.',
        idea: 'Ідея: побудувати EdTech платформу з акредитованими сертифікатами від університету, AI-driven outreach і повністю автоматизованим sales pipeline.',
      },
      role: {
        heading: 'Моя Роль',
        intro: 'Я виступав як Product Lead, GTM-інженер і BizDev.',
        responsibilities: [
          {
            title: 'Стратегія і BizDev',
            desc: 'Знайшов і закрив партнерство з Тернопільським національним педагогічним університетом. Університетська акредитація означає, що сертифікати SmartCourses юридично зараховуються вчителям як офіційне підвищення кваліфікації — це конкурентна перевага, яку потрібно домовитись, а не купити.',
          },
          {
            title: 'GTM і технічна реалізація',
            desc: 'Написав генератор рекламних кампаній через Google Ads SDK з використанням AI для підбору ключових слів і генерації оголошень. Система автоматично формувала рекламні матеріали під конкретні сегменти аудиторії без ручного написання кожного оголошення. Архітектура базується на промпт-інженерингу з автоматичним аналізом пошукового попиту в EdTech вертикалі. AI генерує кластери ключових слів, створює варіанти оголошень під кожен сегмент, SDK програмно запускає кампанії через Google Ads API. Жодного ручного налаштування — весь процес від аналізу до запуску автоматизований. Результат: CTR 13-17% при середньому CPC $5.34 і CPA ~$12, що в 4-8 разів нижче типового EdTech CPA $50-100. Паралельно побудував AI-driven outreach і sales pipeline повністю на prompt engineering без дорогих CRM-систем. Pipeline обробив 502 реєстрації і конвертував 500 у бажаючих купити — конверсія 99.6% від реєстрації до наміру купівлі. Система використовувала prompt engineering для кваліфікації лідів, обробки заперечень, планування дзвінків і супроводу через процес прийняття рішення. Менеджер з продажів працював у рамках процесів, які я побудував, виконуючи, але не проектуючи workflow. Цей підхід масштабований без пропорційного збільшення штату.',
          },
          {
            title: 'Продукт',
            desc: 'Сайт eij.com.ua створений через AI з фокусом на конверсію та довіру через університетське партнерство. Уся операційна модель — від залучення до закриття продажу — автоматизована через інтеграцію Google Ads SDK, AI-driven outreach і prompt-engineered sales pipeline. Платформа обробляла реєстрації, кваліфікувала ліди, планувала дзвінки і супроводжувала потенційних клієнтів через процес прийняття рішення без ручного втручання на кожному етапі. Університетська акредитація від Тернопільського національного педагогічного університету забезпечила легітимність сертифікатів і закрила головне заперечення вчителів — юридичне визнання курсів як офіційного підвищення кваліфікації. Це конкурентна перевага, яку неможливо відтворити без інституційного партнерства. Продукт валідував попит: 502 реєстрації, 500 бажаючих купити, 22 пілотні продажі з авансовими платежами 13 100 грн. Масштабування зупинилось через масові відключення електроенергії, а не через відсутність попиту або проблеми з продуктом.',
          },
        ],
      },
      numbers: {
        heading: 'Що Показали Цифри',
        googleAds: {
          heading: 'Google Ads (серпень–листопад 2025)',
          metrics: [
            { label: 'Кліки', value: '220' },
            { label: 'Покази', value: '1 590' },
            { label: 'CTR', value: '13.83%' },
            { label: 'Avg CPC', value: '$5.34' },
            { label: 'Витрачено', value: '$1 180' },
            { label: 'CPA', value: '~$12' },
            { label: 'Конверсії', value: '98' },
          ],
          topSegments: [
            { segment: 'курси для вчителів', ctr: '14.30%', clicks: '193' },
            { segment: 'підвищення кваліфікації', ctr: '17.39%', clicks: '-' },
          ],
        },
        audience: {
          heading: 'Аудиторія',
          items: [
            'Вчителі 35–54 роки',
            'Mobile-first (97% витрат — мобільні)',
            'Активність: Пн–Пт, 12:00–18:00',
            'Гео: вся Україна',
          ],
        },
        registrations: {
          heading: 'Реєстрації та попит',
          items: [
            { label: '502 реєстрації', desc: 'на платформі через AI-driven outreach і повністю автоматизований sales pipeline без ручного втручання на кожному етапі' },
            { label: '500 бажаючих купити', desc: 'підтверджений намір купівлі, люди були готові платити за університетські акредитовані сертифікати від Тернопільського національного педагогічного університету. Конверсія 99.6% від реєстрації до наміру купівлі — виняткова для EdTech, де типова конверсія становить 10-20%. Різниця: AI-driven кваліфікація лідів до реєстрації і автоматизований follow-up для підтримки залученості через процес прийняття рішення' },
          ],
        },
        sales: {
          heading: 'Пілотні продажі',
          items: [
            { label: '22 транзакції', desc: 'успішно завершені — перші авансові платежі пілоту підтверджені' },
            { label: '500 не завершили', desc: 'через відключення світла — форс-мажор, не відмова від продукту' },
            { label: '13 100 грн', desc: 'авансові надходження пілоту — реальні гроші, не тестові транзакції' },
          ],
        },
      },
      whyStopped: {
        heading: 'Чому Масштабування Зупинилось',
        intro: 'Не провал продукту і не провал GTM. Масові відключення електроенергії в Україні зробили неможливим три речі одночасно:',
        reasons: [
          {
            title: 'Стабільне проведення онлайн-уроків',
            desc: 'Вчителі і учні без світла не можуть підключитись',
          },
          {
            title: 'Завершення оплати',
            desc: '500 бажаючих не могли пройти платіжну форму під час відключень',
          },
          {
            title: 'Операційна робота',
            desc: 'Sales pipeline потребує стабільного з\'єднання',
          },
        ],
        conclusion: 'Продукт, партнерство і попит були доведені. Зовнішні обставини зупинили масштабування.',
      },
      proven: {
        heading: 'Що Доведено',
        items: [
          {
            title: 'Ніша підтверджена',
            desc: 'CTR 13–17% — виняткові показники для EdTech. Вчителі активно шукають онлайн-курси.',
          },
          {
            title: 'Попит підтверджений',
            desc: '500 людей, готових платити — це не ліди, це покупці, яким завадили інфраструктурні проблеми, а не якість продукту.',
          },
          {
            title: 'Партнерська модель працює',
            desc: 'Університет закриває головне заперечення — легітимність сертифікату. Це те, що неможливо відтворити без інституційного партнерства.',
          },
          {
            title: 'AI ads generator — ефективний',
            desc: 'Google Ads SDK + AI для підбору ключів і генерації оголошень дав CTR 13–17% без ручного написання кампаній. Це відтворюваний підхід для будь-якого EdTech продукту.',
          },
          {
            title: 'AI sales pipeline — масштабований',
            desc: 'Побудований на prompt engineering, без дорогих CRM-систем. Від outreach до закриття угоди — автоматизовано.',
          },
        ],
      },
      potential: {
        heading: 'Потенціал При Стабільній Інфраструктурі',
        intro: 'При стабільному електропостачанні і бюджеті $329/день:',
        items: [
          '500 бажаючих → ~400–450 завершених продажів за той самий період',
          'CPA $12 при LTV курсу — окупність з першої транзакції',
          'Партнерська модель з університетами — відтворювана в інших регіонах і країнах',
        ],
      },
      stack: {
        heading: 'Стек',
        items: [
          { name: 'Google Ads SDK', role: 'Платформа реклами' },
          { name: 'AI (prompt engineering)', role: 'Генерація контенту' },
          { name: 'Screener', role: 'Аналіз даних' },
          { name: 'Партнерство з університетом', role: 'Акредитація' },
          { name: 'eij.com.ua', role: 'Платформа' },
        ],
      },
      resources: {
        heading: 'Ресурси',
        items: [
          { label: 'EIJ.com.ua — Платформа онлайн-курсів', url: 'https://eij.com.ua' },
        ],
      },
    },
    faq: {
      heading: 'FAQ',
      items: [
        {
          q: 'Чому вчителі не могли завершити оплату?',
          a: 'Масові відключення електроенергії в Україні стали критичною перешкодою. 500 бажаючих купити не могли пройти платіжну форму під час відключень світла. Це не відмова від продукту, а інфраструктурна проблема. Продукт, партнерство і попит були доведені. Зовнішні обставини зупинили масштабування. Вчителі були готові платити — 22 пілотні транзакції успішно завершені з авансовими платежами на суму 13 100 грн. Решта 500 не змогли завершити оплату не тому, що передумали, а тому що фізично не могли отримати доступ до платіжної форми під час відключень світла. Це критична відмінність: sales pipeline працював, продукт резонував, університетське партнерство забезпечило довіру. Що не спрацювало — інфраструктура, а не бізнес-модель.',
        },
        {
          q: 'Чому університетська акредитація важлива?',
          a: 'Сертифікати SmartCourses юридично зараховуються вчителям як офіційне підвищення кваліфікації згідно з державними вимогами України для педагогів. Це конкурентна перевага, яку неможливо відтворити без інституційного партнерства з університетом. Українські вчителі зобов\'язані регулярно проходити курси підвищення кваліфікації. Після 2022 року офлайн-формат став проблематичним — переміщення, безпека, логістика. Онлайн-альтернативи або дорогі, або не мають університетської акредитації. SmartCourses вирішив це через партнерство з Тернопільським національним педагогічним університетом. Університетська акредитація означає, що сертифікати юридично зараховуються як обов\'язкове підвищення кваліфікації. Це закриває головне заперечення — легітимність сертифікату. Це те, що домовляєшся, а не купуєш. Партнерська модель відтворювана в інших регіонах і країнах з подібними регуляторними вимогами.',
        },
        {
          q: 'Як працював AI ads generator?',
          a: 'Google Ads SDK + AI для підбору ключових слів і генерації оголошень. Система автоматично формувала рекламні матеріали під конкретні сегменти аудиторії без ручного написання кожного оголошення. Результат: CTR 13-17%. Підхід відтворюваний для будь-якого EdTech продукту. AI аналізує пошуковий попит, генерує кластери ключових слів, створює варіанти оголошень, SDK запускає кампанії. Жодного ручного налаштування кампаній — весь процес автоматизований. Топ-сегмент курси для вчителів показав CTR 14.30% з 193 кліками. Сегмент підвищення кваліфікації досяг CTR 17.39%. Середній CPC $5.34, загальні витрати $1 180, CPA ~$12. Це виняткові показники для EdTech вертикалі, де типовий CPA становить $50-100. Той самий підхід я використовував у PerfectSquad для ігрового трафіку і AI Tools для дослідження каталогу.',
        },
        {
          q: 'Що таке AI sales pipeline?',
          a: 'Повністю автоматизований процес від outreach до закриття угоди, побудований на prompt engineering без дорогих CRM-систем. Менеджер з продажів працював у рамках процесів, які я побудував. Pipeline обробив 502 реєстрації і конвертував 500 у бажаючих купити — конверсія 99.6% від реєстрації до наміру купівлі. Це нетипово для EdTech, де конверсія реєстрація-купівля в середньому становить 10-20%. Різниця: AI-driven outreach кваліфікував ліди до реєстрації, а автоматизований follow-up підтримував залученість. Система використовувала prompt engineering для обробки заперечень, планування дзвінків, надсилання матеріалів і супроводу потенційних клієнтів через процес прийняття рішення. Менеджер з продажів виконував, але процес був розроблений для мінімізації ручної роботи і максимізації конверсії. Цей підхід масштабований і відтворюваний без пропорційного збільшення штату.',
        },
        {
          q: 'Чому CTR 13-17% — це виняткові показники?',
          a: 'Середній CTR для EdTech кампаній — 2-5%. CTR 13-17% означає, що оголошення резонують з аудиторією і вчителі активно шукають онлайн-курси підвищення кваліфікації. Це валідує нішу. Вчителі 35-54 роки, mobile-first (97% витрат на мобільні), активні Пн-Пт 12:00-18:00. Гео: вся Україна. Аудиторія чітко визначена і активно шукає. Топ-ключові слова: курси для вчителів (CTR 14.30%), підвищення кваліфікації (CTR 17.39%). Це не холодний трафік — це теплий, intent-driven пошук. Для порівняння, типовий CTR Google Ads по всіх індустріях становить 3-5%. EdTech зазвичай показує нижчі результати на рівні 2-3%. SmartCourses досяг 13-17%, тому що пропозиція (університетські акредитовані сертифікати) точно відповідала потребі (обов\'язкове підвищення кваліфікації) у правильний час (перехід на онлайн після 2022).',
        },
      ],
    },
  },
  en: {
    slug: 'smartcourses-edtech-platform',
    altSlug: 'smartcourses-edtech-platforma',
    readingTime: '8 min read',
    seo: {
      title: 'SmartCourses: Teacher Platform | AI Software Engineer',
      description: 'EdTech platform with university accreditation. 502 registrations, 500 willing to buy, 13-17% CTR. AI-driven GTM and automated sales pipeline.',
    },
    nav: {
      breadcrumbHome: 'Home',
      breadcrumbCurrent: 'SmartCourses',
    },
    header: {
      kicker: 'Case Study: eij.com.ua',
      h1: 'SmartCourses — EdTech Platform for Teacher Professional Development',
      subtitle: 'EdTech platform with accredited certificates from university, AI-driven outreach and fully automated sales pipeline. 502 registrations, 500 willing to buy, 13-17% CTR.',
      date: 'eij.com.ua',
    },
    heroMetrics: [
      { value: '502', label: 'Registrations' },
      { value: '500', label: 'Willing to Buy' },
      { value: '13-17%', label: 'CTR Google Ads' },
      { value: '22', label: 'Pilot Sales' },
      { value: '₴13,100', label: 'Advance Payments' },
    ],
    tldr: 'Ukrainian teachers are required to regularly complete professional development courses. After 2022, offline format became problematic. SmartCourses — EdTech platform with accredited certificates from Ternopil National Pedagogical University, AI-driven outreach and fully automated sales pipeline. Result: 502 registrations, 500 willing to buy, 13-17% CTR, 22 pilot sales. Scaling stopped due to massive power outages in Ukraine.',
    sections: {
      context: {
        heading: 'Context',
        problem: 'Ukrainian teachers are required to regularly complete professional development courses. After 2022, offline format became problematic — relocation, safety, logistics. Online alternatives are either expensive or lack university accreditation.',
        idea: 'Idea: build an EdTech platform with accredited certificates from university, AI-driven outreach and fully automated sales pipeline.',
      },
      role: {
        heading: 'My Role',
        intro: 'I acted as Product Lead, GTM engineer and BizDev.',
        responsibilities: [
          {
            title: 'Strategy & BizDev',
            desc: 'Found and closed partnership with Ternopil National Pedagogical University. University accreditation means SmartCourses certificates are legally counted as official professional development — this is a competitive advantage you need to negotiate, not buy.',
          },
          {
            title: 'GTM & Technical Implementation',
            desc: 'Built ad campaign generator via Google Ads SDK using AI for keyword selection and ad generation. System automatically created ad materials for specific audience segments without manual writing of each ad. Architecture based on prompt engineering with automatic analysis of search demand in EdTech vertical. AI generates keyword clusters, creates ad variants for each segment, SDK programmatically launches campaigns via Google Ads API. No manual setup — entire process from analysis to launch automated. Result: 13-17% CTR with average CPC $5.34 and CPA ~$12, which is 4-8x lower than typical EdTech CPA $50-100. In parallel, built AI-driven outreach and sales pipeline entirely on prompt engineering without expensive CRM systems. Pipeline handled 502 registrations and converted 500 into willing buyers — 99.6% conversion from registration to purchase intent. System used prompt engineering for lead qualification, objection handling, call scheduling, and guiding through decision process. Sales manager worked within processes I built, executing but not designing workflow. This approach scales without proportional headcount increase.',
          },
          {
            title: 'Product',
            desc: 'Website eij.com.ua created via AI with focus on conversion and trust through university partnership. Entire operational model — from acquisition to closing sale — automated through integration of Google Ads SDK, AI-driven outreach, and prompt-engineered sales pipeline. Platform handled registrations, qualified leads, scheduled calls, and guided prospects through decision process without manual intervention at each stage. University accreditation from Ternopil National Pedagogical University provided certificate legitimacy and closed main teacher objection — legal recognition of courses as official professional development. This is competitive advantage impossible to replicate without institutional partnership. Product validated demand: 502 registrations, 500 willing to buy, 22 pilot sales with advance payments of 13,100 UAH. Scaling stopped due to massive power outages, not lack of demand or product issues.',
          },
        ],
      },
      numbers: {
        heading: 'What the Numbers Showed',
        googleAds: {
          heading: 'Google Ads (August–November 2025)',
          metrics: [
            { label: 'Clicks', value: '220' },
            { label: 'Impressions', value: '1,590' },
            { label: 'CTR', value: '13.83%' },
            { label: 'Avg CPC', value: '$5.34' },
            { label: 'Spent', value: '$1,180' },
            { label: 'CPA', value: '~$12' },
            { label: 'Conversions', value: '98' },
          ],
          topSegments: [
            { segment: 'courses for teachers', ctr: '14.30%', clicks: '193' },
            { segment: 'professional development', ctr: '17.39%', clicks: '-' },
          ],
        },
        audience: {
          heading: 'Audience',
          items: [
            'Teachers 35–54 years old',
            'Mobile-first (97% spend — mobile)',
            'Activity: Mon–Fri, 12:00–18:00',
            'Geo: all Ukraine',
          ],
        },
        registrations: {
          heading: 'Registrations and Demand',
          items: [
            { label: '502 registrations', desc: 'on platform via AI-driven outreach and automated sales pipeline' },
            { label: '500 willing to buy', desc: 'confirmed purchase intent, people were ready to pay for university-accredited certificates. Conversion 99.6% from registration to purchase intent — exceptional for EdTech where typical conversion is 10-20%. Difference: AI-driven lead qualification before registration and automated follow-up to maintain engagement through decision process' },
          ],
        },
        sales: {
          heading: 'Pilot Sales',
          items: [
            { label: '22 transactions', desc: 'successfully completed — first advance payments of pilot confirmed' },
            { label: '500 didn\'t complete', desc: 'due to power outages — force majeure, not product rejection' },
            { label: '₴13,100', desc: 'pilot advance payments — real money, not test transactions' },
          ],
        },
      },
      whyStopped: {
        heading: 'Why Scaling Stopped',
        intro: 'Not product failure and not GTM failure. Massive power outages in Ukraine made three things impossible simultaneously:',
        reasons: [
          {
            title: 'Stable online lessons',
            desc: 'Teachers and students without power can\'t connect',
          },
          {
            title: 'Payment completion',
            desc: '500 willing buyers couldn\'t complete payment form during outages',
          },
          {
            title: 'Operational work',
            desc: 'Sales pipeline requires stable connection',
          },
        ],
        conclusion: 'Product, partnership and demand were proven. External circumstances stopped scaling.',
      },
      proven: {
        heading: 'What Was Proven',
        items: [
          {
            title: 'Niche confirmed',
            desc: 'CTR 13–17% — exceptional metrics for EdTech. Teachers actively search for online courses.',
          },
          {
            title: 'Demand confirmed',
            desc: '500 people ready to pay — these are not leads, these are buyers hindered by infrastructure problems, not product quality.',
          },
          {
            title: 'Partnership model works',
            desc: 'University closes main objection — certificate legitimacy. This is something impossible to replicate without institutional partnership.',
          },
          {
            title: 'AI ads generator — effective',
            desc: 'Google Ads SDK + AI for keyword selection and ad generation gave 13–17% CTR without manual campaign writing. This is a reproducible approach for any EdTech product.',
          },
          {
            title: 'AI sales pipeline — scalable',
            desc: 'Built on prompt engineering, without expensive CRM systems. From outreach to closing deal — automated.',
          },
        ],
      },
      potential: {
        heading: 'Potential With Stable Infrastructure',
        intro: 'With stable power supply and $329/day budget:',
        items: [
          '500 willing → ~400–450 completed sales in same period',
          'CPA $12 with course LTV — payback from first transaction',
          'Partnership model with universities — reproducible in other regions and countries',
        ],
      },
      stack: {
        heading: 'Stack',
        items: [
          { name: 'Google Ads SDK', role: 'Advertising platform' },
          { name: 'AI (prompt engineering)', role: 'Content generation' },
          { name: 'Screener', role: 'Data analysis' },
          { name: 'University Partnership', role: 'Accreditation' },
          { name: 'eij.com.ua', role: 'Platform' },
        ],
      },
      resources: {
        heading: 'Resources',
        items: [
          { label: 'EIJ.com.ua — Online Courses Platform', url: 'https://eij.com.ua' },
        ],
      },
    },
    faq: {
      heading: 'FAQ',
      items: [
        {
          q: 'Why couldn\'t teachers complete payment?',
          a: 'Massive power outages in Ukraine. 500 willing buyers couldn\'t complete payment form during outages. This is not product rejection, but infrastructure problem. The product, partnership, and demand were proven. External circumstances stopped scaling. Teachers were ready to pay — 22 pilot transactions were successfully completed with advance payments totaling 13,100 UAH. The remaining 500 couldn\'t complete payment not because they changed their mind, but because they physically couldn\'t access the payment form during blackouts. This is a critical distinction: the sales pipeline worked, the product resonated, the university partnership delivered credibility. What failed was the infrastructure, not the business model.',
        },
        {
          q: 'Why is university accreditation important?',
          a: 'SmartCourses certificates are legally counted as official professional development. This is a competitive advantage impossible to replicate without institutional partnership with university. Ukrainian teachers are required to regularly complete professional development courses. After 2022, offline format became problematic — movement, safety, logistics. Online alternatives are either expensive or lack university accreditation. SmartCourses solved this by partnering with Ternopil National Pedagogical University. University accreditation means certificates legally count toward mandatory professional development requirements. This closes the main objection — certificate legitimacy. It\'s something you negotiate, not buy. The partnership model is reproducible in other regions and countries with similar regulatory requirements.',
        },
        {
          q: 'How did AI ads generator work?',
          a: 'Google Ads SDK + AI for keyword selection and ad generation. System automatically created ad materials for specific audience segments without manual writing of each ad. Result: 13-17% CTR. The approach is reproducible for any EdTech product. AI analyzes search demand, generates keyword clusters, creates ad variants, SDK launches campaigns. No manual campaign setup — entire process automated. Top segment courses for teachers showed 14.30% CTR with 193 clicks. Professional development segment reached 17.39% CTR. Average CPC $5.34, total spend $1,180, CPA ~$12. This is exceptional for EdTech vertical where typical CPA ranges $50-100. The same approach I used in PerfectSquad for gaming traffic and AI Tools for catalog research.',
        },
        {
          q: 'What is AI sales pipeline?',
          a: 'Fully automated process from outreach to closing deal, built on prompt engineering without expensive CRM systems. Sales manager worked within processes I built. The pipeline handled 502 registrations and converted 500 into willing buyers — 99.6% conversion from registration to purchase intent. This is not typical for EdTech where registration-to-purchase conversion averages 10-20%. The difference: AI-driven outreach qualified leads before registration, and automated follow-up maintained engagement. The system used prompt engineering to handle objections, schedule calls, send materials, and guide prospects through decision process. Sales manager executed, but the process was designed to minimize manual work and maximize conversion. This approach is scalable and reproducible without proportional increase in headcount.',
        },
        {
          q: 'Why is 13-17% CTR exceptional?',
          a: 'Average CTR for EdTech campaigns is 2-5%. CTR 13-17% means ads resonate with audience and teachers actively search for online professional development courses. This validates the niche. Teachers 35-54 years old, mobile-first (97% spend on mobile), active Mon-Fri 12:00-18:00. Geo: entire Ukraine. The audience is clearly defined and actively searching. Top keywords: courses for teachers (14.30% CTR), professional development (17.39% CTR). These are not cold traffic numbers — this is warm, intent-driven search. For comparison, typical Google Ads CTR across all industries is 3-5%. EdTech usually underperforms at 2-3%. SmartCourses achieved 13-17% because the offer (university-accredited certificates) matched the exact need (mandatory professional development) at the right time (post-2022 shift to online).',
        },
      ],
    },
  },
} as const
