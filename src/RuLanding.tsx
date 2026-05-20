import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function RuLanding() {
  useEffect(() => {
    document.title = 'Андрей Роговский | Искусственный Интеллект · Senior AI Engineer · DevOps'
    const meta = document.querySelector('meta[name="description"]')
    if (meta) {
      meta.setAttribute(
        'content',
        'Разработка искусственного интеллекта в production. Senior AI Engineer, DevOps инженер, MLOps специалист. 25 лет опыта. ИИ онлайн — LangGraph, RAG, Kubernetes. Удалённая работа EU/US.'
      )
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">

      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between max-w-4xl mx-auto w-full">
        <span className="text-sm text-white/40 font-mono">esupport.org.ua</span>
        <Link
          to="/en"
          className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1.5"
        >
          <span>English</span>
          <span>→</span>
        </Link>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 max-w-4xl mx-auto w-full">
        <div className="w-full max-w-2xl space-y-10">

          {/* Name + role */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Искусственный Интеллект в Production
            </h1>
            <p className="text-xl text-white/70">
              Андрей Роговский — Senior AI Engineer
            </p>
            <p className="text-sm text-white/40 font-mono">
              DevOps Инженер · MLOps Специалист · ИИ Разработчик
            </p>
          </div>

          {/* Positioning */}
          <div className="space-y-4 text-white/80 leading-relaxed">
            <p className="text-base">
              Разрабатываю системы искусственного интеллекта, которые работают в production —
              agentic workflows, RAG pipelines, LLM-интеграции. 25 лет опыта в cloud-инфраструктуре
              и безопасности.
            </p>
            <p className="text-base">
              ИИ онлайн, нейросети, генеративный AI — строю решения, которые масштабируются
              и остаются безопасными. Открыт к удалённым позициям в компаниях EU и США.
            </p>
          </div>

          {/* Tech stack pills */}
          <div className="flex flex-wrap gap-2">
            {[
              'ИИ / Искусственный Интеллект',
              'LLM Engineering',
              'Нейросети (RAG)',
              'GenAI · LangGraph',
              'MLOps',
              'DevOps Инженер',
              'Kubernetes',
              'Terraform',
              'AWS · GCP · Azure',
              'Python',
            ].map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-md text-xs font-mono bg-white/5 border border-white/10 text-white/70"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { value: '25+', label: 'лет в Cloud & Security' },
              { value: '5+', label: 'ИИ-продуктов в production' },
              { value: 'EU/US', label: 'удалённая работа' },
            ].map((item) => (
              <div key={item.label} className="border border-white/10 rounded-lg p-4 space-y-1">
                <div className="text-2xl font-bold">{item.value}</div>
                <div className="text-xs text-white/50">{item.label}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="space-y-3 pt-2">
            <Link
              to="/en"
              className="block w-full text-center bg-white text-black font-semibold py-3.5 px-6 rounded-lg hover:bg-white/90 transition-colors text-sm"
            >
              Посмотреть портфолио и кейсы →
            </Link>
            <div className="flex gap-3">
              <a
                href="mailto:esupport@esupport.org.ua"
                className="flex-1 text-center border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-colors py-3 px-4 rounded-lg text-sm"
              >
                Email
              </a>
              <a
                href="https://t.me/andreyrogovsky"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-colors py-3 px-4 rounded-lg text-sm"
              >
                Telegram
              </a>
            </div>
          </div>

          {/* Expertise */}
          <div className="border-t border-white/10 pt-8 space-y-4">
            <p className="text-xs text-white/30 uppercase tracking-widest font-mono">Экспертиза</p>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li>→ <strong className="text-white/80">Разработка искусственного интеллекта</strong> — agentic workflows, LLM-агенты, ИИ онлайн</li>
              <li>→ <strong className="text-white/80">MLOps специалист</strong> — Kubeflow, AWS SageMaker, Azure ML, Databricks</li>
              <li>→ <strong className="text-white/80">DevOps инженер</strong> — Kubernetes, Terraform, CI/CD, облачная инфраструктура</li>
              <li>→ <strong className="text-white/80">GenAI консалтинг</strong> — RAG pipeline, нейросети, LangGraph для вашей компании</li>
            </ul>
          </div>

          {/* Secondary CTA — English version */}
          <div className="border border-white/10 rounded-lg p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Полное портфолио на английском</p>
              <p className="text-xs text-white/40 mt-0.5">Кейсы, проекты, опыт работы</p>
            </div>
            <Link
              to="/en"
              className="shrink-0 border border-white/20 hover:border-white/40 text-white/70 hover:text-white transition-colors py-2.5 px-5 rounded-lg text-sm whitespace-nowrap"
            >
              Открыть на English →
            </Link>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-5 max-w-4xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <span>Андрей Роговский · ИИ инженер · DevOps · MLOps · Украина</span>
          <Link to="/en" className="hover:text-white/60 transition-colors">
            English version →
          </Link>
        </div>
      </footer>

    </div>
  )
}
