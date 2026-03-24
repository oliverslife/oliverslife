'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Github, Instagram, Linkedin, ChevronDown, ExternalLink, X, Command, Lock, Globe } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import './portfolio.css';
import { translations } from './translations';

export default function PortfolioPage() {
  const [lang, setLang] = useState<'en' | 'ko'>('en'); // Default to English
  const [activeSoulGridImg, setActiveSoulGridImg] = useState('/images/soulgrid_landing.png');
  const [showApiModal, setShowApiModal] = useState(false);
  const [heroImageFlipped, setHeroImageFlipped] = useState(false);
  const [showBioPopup, setShowBioPopup] = useState(false);

  // Auto-rotate hero image every 1.5 seconds (shortened for quick viewing)
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageFlipped(prev => !prev);
    }, 1500);
    return () => clearInterval(interval);
  }, []);
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const t = translations[lang];

  // Experience Data Handling
  const experienceData = {
    en: [
      {
        id: 1, date: '2025 - Present', title: 'Public Financial System Operator', company: 'Korea Fiscal Information Service',
        desc: 'Financial closing and ledger management, maintaining accrual-based double-entry accounting ledgers and ensuring data pipeline stability.'
      },
      {
        id: 2, date: '2024', title: 'DeFi Protocol Auditor (Trainee)', company: 'Dunamu & Theori',
        desc: 'Code-level analysis of Compound Protocol, Venus Protocol Isolated Pool, and Cyan audit with invariant checks.'
      },
      {
        id: 3, date: '2024', title: 'Freelance AI Trainer', company: 'EBIT',
        desc: 'Training generative AI models through coding projects in SQL, Python, Java, JavaScript, and TypeScript.'
      },
      {
        id: 4, date: '2023', title: 'Solutions Developer', company: 'Wooam Corporation (BlueWorks)',
        desc: "Maintained and developed new features for Document Conference Solution 'SmartPlace'."
      },
      {
        id: 5, date: '2022 - 2023', title: 'Java Track Trainee (1600H)', company: 'Samsung SW Academy For Youth (SSAFY) 8th',
        desc: 'Intensive training in algorithms, web development with Spring Boot, MySQL, Vue.js, and completed 3 major team projects.'
      }
    ],
    ko: [
      {
        id: 1, date: '2025 - 현재', title: '공공 재정 시스템 운영', company: '한국재정정보원',
        desc: '발생주의 복식부기 회계 원장 관리 및 재정 마감 업무 수행, 데이터 파이프라인 안정성 확보 및 원장 데이터 무결성 관리.'
      },
      {
        id: 2, date: '2024', title: 'DeFi 프로토콜 오디터 (교육생)', company: '두나무 & 티오리',
        desc: 'Compound Protocol, Venus Protocol Isolated Pool 코드 레벨 분석 및 불변성(Invariant) 체크를 포함한 Cyan 감사 실습.'
      },
      {
        id: 3, date: '2024', title: '프리랜서 AI 트레이너', company: 'EBIT',
        desc: 'SQL, Python, Java 등 다양한 언어로 코딩 프로젝트를 수행하며 생성형 AI 모델 학습 데이터 구축 및 품질 검증.'
      },
      {
        id: 4, date: '2023', title: '솔루션 개발자', company: '우암코퍼레이션 (BlueWorks)',
        desc: "문서 없는 회의 솔루션 'SmartPlace'의 유지보수 및 신규 기능 개발 참여."
      },
      {
        id: 5, date: '2022 - 2023', title: 'Java 트랙 교육생 (1600시간)', company: '삼성 청년 SW 아카데미 (SSAFY) 8기',
        desc: '알고리즘, Spring Boot, MySQL, Vue.js 등 웹 개발 심화 과정 수료 및 3회의 대규모 팀 프로젝트 완수.'
      }
    ]
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey }),
      });

      if (res.ok) {
        router.push('/dashboard');
      } else {
        setError(t.modal.error_invalid);
      }
    } catch {
      setError(t.modal.error_connection);
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const soulGridImages = [
    { src: '/images/soulgrid_landing.png', alt: 'Landing Page', title: 'Landing' },
    { src: '/images/soulgrid_workflow.png', alt: 'Workflow Dashboard', title: 'Workflow' },
    { src: '/images/soulgrid_kanban.png', alt: 'Kanban Board', title: 'Kanban' },
    { src: '/images/soulgrid_issue_create.png', alt: 'Issue Management', title: 'Issue Creation' },
    { src: '/images/soulgrid_backlog.png', alt: 'Project Backlog', title: 'Backlog' }
  ];

  // PLANDS - 여행계획 서비스
  const plandsImages = [
    { src: '/images/plands/mainfeat.png', alt: 'Main Features', title: 'Features' },
    { src: '/images/plands/gi1.gif', alt: 'Main Page Demo', title: 'Main' },
    { src: '/images/plands/gi2.gif', alt: 'Travel Plan', title: 'Planning' },
    { src: '/images/plands/gi3.gif', alt: 'WebRTC Demo', title: 'WebRTC' },
    { src: '/images/plands/architecture.png', alt: 'Architecture', title: 'Arch' }
  ];

  // Persona - 연기 연습 서비스
  const personaImages = [
    { src: '/images/persona/007.png', alt: 'Main Feature', title: 'Main' },
    { src: '/images/persona/008.png', alt: 'Emotion Analysis', title: 'AI Analysis' },
    { src: '/images/persona/009.png', alt: 'Speech Recognition', title: 'Speech' },
    { src: '/images/persona/012.png', alt: 'Script Analysis', title: 'Script' }
  ];

  // Birdchain - NFT 기부 서비스
  const birdchainImages = [
    { src: '/images/birdchain/image5.png', alt: 'Bird Info', title: 'Info' },
    { src: '/images/birdchain/image6.png', alt: 'Bird Strike Map', title: 'Map' },
    { src: '/images/birdchain/image7.png', alt: 'NFT Donation', title: 'NFT' }
  ];

  // DeFi Audit - Dunamu & Theori
  const defiAuditImages = [
    { src: '/images/defi-audit/invariant_compound.png', alt: 'Lending Invariant via Compound', title: 'Invariant' },
    { src: '/images/defi-audit/invariant_checklist.png', alt: 'Invariant Checklist', title: 'Checklist' },
    { src: '/images/defi-audit/threat_modeling.png', alt: 'Threat Modeling Diagram', title: 'Threat Model' },
    { src: '/images/defi-audit/audit_analysis.png', alt: 'Audit Analysis', title: 'Analysis' },
    { src: '/images/defi-audit/invariant_validation.png', alt: 'Invariant Validation', title: 'Validation' }
  ];

  // Active image states for each project
  const [activePlandsImg, setActivePlandsImg] = useState(plandsImages[0].src);
  const [activePersonaImg, setActivePersonaImg] = useState(personaImages[0].src);
  const [activeBirdchainImg, setActiveBirdchainImg] = useState(birdchainImages[0].src);
  const [activeDefiAuditImg, setActiveDefiAuditImg] = useState(defiAuditImages[0].src);

  return (
    <div className="portfolio-page">
      {/* Navigation */}
      <nav className="portfolio-nav">
        <div className="nav-logo">Sojin Kim</div>

        <div className="nav-links">
          <button onClick={() => scrollToSection('about')} className="nav-link-btn">{t.nav.about}</button>
          <button onClick={() => scrollToSection('projects')} className="nav-link-btn">{t.nav.projects}</button>
          <button onClick={() => scrollToSection('insights')} className="nav-link-btn">{t.nav.insights}</button>
          <button onClick={() => scrollToSection('contact')} className="nav-link-btn">{t.nav.contact}</button>
        </div>

        <div className="flex items-center gap-6">
          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')}
            className="lang-toggle-btn"
            title="Switch Language"
          >
            <Globe size={16} />
            <span className={`lang-text ${lang === 'ko' ? 'active' : ''}`}>KR</span>
            <span className="lang-divider">|</span>
            <span className={`lang-text ${lang === 'en' ? 'active' : ''}`}>EN</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <p className="hero-tagline">{t.hero.tagline}</p>
          <h1 className="hero-title">
            {t.hero.title_prefix && <>{t.hero.title_prefix} <br /></>}
            <em>{t.hero.title_accent}</em><br />
            {t.hero.title_suffix}
          </h1>
          <p className="hero-description">
            {t.hero.description}
          </p>
          <button onClick={() => scrollToSection('projects')} className="hero-cta">
            {t.hero.cta} <ArrowRight size={16} />
          </button>
        </div>
        <div className="hero-visual">
          <div className="hero-image-container">
            <div
              className={`hero-flip-card ${heroImageFlipped ? 'flipped' : ''}`}
              onClick={() => setShowBioPopup(true)}
              style={{ cursor: 'pointer' }}
            >
              {/* Front: SK Logo */}
              <div className="hero-flip-card-front">
                <div className="hero-image" style={{
                  background: 'linear-gradient(135deg, #8B7355 0%, #A68B6A 50%, #6B5744 100%)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontFamily: "'Cormorant Garamond', serif"
                }}>
                  <div style={{ fontSize: '4rem', fontWeight: 300, marginBottom: '1rem' }}>SK</div>
                  <div style={{ fontSize: '0.9rem', letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.8 }}>
                    {t.hero.role}
                  </div>
                </div>
              </div>
              {/* Back: Developer Photo */}
              <div className="hero-flip-card-back">
                <Image
                  src="/images/developer_photo.jpg"
                  alt="Sojin Kim - Developer"
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'center top' }}
                  priority
                />
                <div className="hero-photo-overlay">
                  <span>{t.hero.role}</span>
                </div>
              </div>
            </div>
            <div className="hero-image-frame"></div>
            {/* Click indicator - placed outside flip-card to avoid rotation */}
            <div className="hero-click-indicator">
              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                onClick={() => setShowBioPopup(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'rgba(0, 0, 0, 0.6)',
                  backdropFilter: 'blur(4px)',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  color: 'white',
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  cursor: 'pointer'
                }}
              >
                <span style={{ fontSize: '0.9rem' }}>👆</span>
                {lang === 'ko' ? '클릭하여 더 보기' : 'Click to learn more'}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section about-section">
        <div className="section-header">
          <p className="section-label">{t.about.label}</p>
          <h2 className="section-title">{t.about.title}</h2>
        </div>

        <div className="about-grid">
          <div className="about-intro">
            {t.about.intro}
          </div>

          <div className="about-details">
            <div className="about-block">
              <h3>{t.about.skills}</h3>
              <ul>
                <li>Java & Spring Boot Ecosystem</li>
                <li>Blockchain & Smart Contract Development</li>
                <li>Full-Stack Web Development (React, Next.js)</li>
                <li>Database Design & Optimization</li>
                <li>On-Premise Infrastructure & Container Orchestration</li>
                <li>Cloud Infrastructure & DevOps</li>
              </ul>
            </div>

            <div className="about-block">
              <h3>{t.about.certifications}</h3>
              <ul>
                <li>정보처리기사 (Engineer Information Processing)</li>
                <li>블록체인 통합 기본과정 II 수료</li>
                <li>Samsung SW Academy For Youth (SSAFY)</li>
              </ul>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '4rem' }}>
          <h3 style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--color-primary)',
            marginBottom: '2rem'
          }}>
            {t.about.experience}
          </h3>

          <div className="experience-list">
            {experienceData[lang].map((exp) => (
              <div key={exp.id} className="experience-item">
                <div className="experience-date">{exp.date}</div>
                <div className="experience-content">
                  <h4>{exp.title}</h4>
                  <p className="company">{exp.company}</p>
                  <p>{exp.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="section projects-section">
        <div className="section-header">
          <p className="section-label">{t.projects.label}</p>
          <h2 className="section-title">{t.projects.title}</h2>
        </div>

        {/* Featured Project - SoulGrid */}
        <div className="project-featured">
          <div className="project-image">
            <div className="project-gallery">
              <div className="project-main-container">
                <Image
                  src={activeSoulGridImg}
                  alt="SoulGrid Feature"
                  className="project-main-img"
                  width={800}
                  height={500}
                  unoptimized
                />
              </div>
              <div className="project-sub-imgs">
                {soulGridImages.map((img) => (
                  <div
                    key={img.src}
                    className={`thumb-container ${activeSoulGridImg === img.src ? 'active' : ''}`}
                    onClick={() => setActiveSoulGridImg(img.src)}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      title={img.title}
                      width={200}
                      height={120}
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="project-content">
            <span className="project-label">{t.projects.featured_label} · 2025.11 - 2025.12</span>
            <h3 className="project-title">{t.projects.soulgrid.title}</h3>
            <p className="project-card-role">Solo Development (1인 개발)</p>
            <p className="project-description">
              {t.projects.soulgrid.desc_prefix}
              <br /><br />
              <b>{t.projects.soulgrid.desc_deploy}</b> {t.projects.soulgrid.desc_deploy_text}
            </p>
            <div className="project-tech">
              <span className="tech-tag" style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>On-Premise</span>
              <span className="tech-tag">Mac Mini M4</span>
              <span className="tech-tag">Docker</span>
              <span className="tech-tag">CI/CD</span>
              <span className="tech-tag">Spring Cloud</span>
              <span className="tech-tag">Next.js 15</span>
              <span className="tech-tag">MySQL</span>
              <span className="tech-tag">MongoDB</span>
              <span className="tech-tag">Redis</span>
              <span className="tech-tag">RabbitMQ</span>
              <span className="tech-tag">Web3</span>
            </div>
            <a
              href="https://github.com/soulgrid"
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              {t.projects.soulgrid.link} <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* DeFi Audit Project - 24.09 ~ 24.10 */}
        <div className="project-featured project-featured-alt">
          <div className="project-content">
            <span className="project-label">Dunamu & Theori · 2024.09 - 2024.10</span>
            <h3 className="project-title">{t.projects.defi_audit.title}</h3>
            <p className="project-card-role">{t.projects.defi_audit.role}</p>
            <p className="project-description" style={{ whiteSpace: 'pre-line' }}>{t.projects.defi_audit.desc}</p>
            <div className="project-tech">
              <span className="tech-tag" style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>DeFi Audit</span>
              <span className="tech-tag">Compound Protocol</span>
              <span className="tech-tag">Venus Protocol</span>
              <span className="tech-tag">Solidity</span>
              <span className="tech-tag">Invariant Testing</span>
              <span className="tech-tag">Threat Modeling</span>
            </div>
          </div>
          <div className="project-image">
            <div className="project-gallery">
              <div className="project-main-container">
                <Image
                  src={activeDefiAuditImg}
                  alt="DeFi Audit Feature"
                  className="project-main-img"
                  width={800}
                  height={500}
                  unoptimized
                />
              </div>
              <div className="project-sub-imgs">
                {defiAuditImages.map((img) => (
                  <div
                    key={img.src}
                    className={`thumb-container ${activeDefiAuditImg === img.src ? 'active' : ''}`}
                    onClick={() => setActiveDefiAuditImg(img.src)}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      title={img.title}
                      width={200}
                      height={120}
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Birdchain Project - 23.04 ~ 23.05 */}
        <div className="project-featured project-featured-alt">
          <div className="project-content">
            <span className="project-label">SSAFY Team Project · 2023.04 - 2023.05</span>
            <h3 className="project-title">{t.projects.birdchain.title}</h3>
            <p className="project-card-role">{t.projects.birdchain.role}</p>
            <p className="project-description">{t.projects.birdchain.desc}</p>
            <div className="project-tech">
              <span className="tech-tag" style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>Blockchain</span>
              <span className="tech-tag">Solidity</span>
              <span className="tech-tag">Vue.js 3.0</span>
              <span className="tech-tag">Spring Boot</span>
              <span className="tech-tag">PWA</span>
              <span className="tech-tag">Truffle</span>
            </div>
          </div>
          <div className="project-image">
            <div className="project-gallery">
              <div className="project-main-container">
                <Image
                  src={activeBirdchainImg}
                  alt="Birdchain Feature"
                  className="project-main-img"
                  width={800}
                  height={500}
                  unoptimized
                />
              </div>
              <div className="project-sub-imgs project-sub-imgs-3">
                {birdchainImages.map((img) => (
                  <div
                    key={img.src}
                    className={`thumb-container ${activeBirdchainImg === img.src ? 'active' : ''}`}
                    onClick={() => setActiveBirdchainImg(img.src)}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      title={img.title}
                      width={200}
                      height={120}
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Persona Project - 23.02 ~ 23.04 */}
        <div className="project-featured">
          <div className="project-image">
            <div className="project-gallery">
              <div className="project-main-container">
                <Image
                  src={activePersonaImg}
                  alt="Persona Feature"
                  className="project-main-img"
                  width={800}
                  height={500}
                  unoptimized
                />
              </div>
              <div className="project-sub-imgs project-sub-imgs-4">
                {personaImages.map((img) => (
                  <div
                    key={img.src}
                    className={`thumb-container ${activePersonaImg === img.src ? 'active' : ''}`}
                    onClick={() => setActivePersonaImg(img.src)}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      title={img.title}
                      width={200}
                      height={120}
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="project-content">
            <span className="project-label">SSAFY Team Project · 2023.02 - 2023.04</span>
            <h3 className="project-title">{t.projects.persona.title}</h3>
            <p className="project-card-role">{t.projects.persona.role}</p>
            <p className="project-description">{t.projects.persona.desc}</p>
            <div className="project-tech">
              <span className="tech-tag">React.js</span>
              <span className="tech-tag">Spring Boot</span>
              <span className="tech-tag">TensorFlow</span>
              <span className="tech-tag">Whisper AI</span>
              <span className="tech-tag">Redis</span>
              <span className="tech-tag">MySQL</span>
            </div>
          </div>
        </div>

        {/* PLANDS Project - 23.01 ~ 23.02 */}
        <div className="project-featured project-featured-alt">
          <div className="project-content">
            <span className="project-label">SSAFY Team Project · 2023.01 - 2023.02</span>
            <h3 className="project-title">{t.projects.plands.title}</h3>
            <p className="project-card-role">{t.projects.plands.role}</p>
            <p className="project-description">{t.projects.plands.desc}</p>
            <div className="project-tech">
              <span className="tech-tag">Spring Boot</span>
              <span className="tech-tag">React.js</span>
              <span className="tech-tag">OpenVidu</span>
              <span className="tech-tag">Y.js (CRDT)</span>
              <span className="tech-tag">Redis</span>
              <span className="tech-tag">JWT</span>
            </div>
          </div>
          <div className="project-image">
            <div className="project-gallery">
              <div className="project-main-container">
                <Image
                  src={activePlandsImg}
                  alt="PLANDS Feature"
                  className="project-main-img"
                  width={800}
                  height={500}
                  unoptimized
                />
              </div>
              <div className="project-sub-imgs">
                {plandsImages.map((img) => (
                  <div
                    key={img.src}
                    className={`thumb-container ${activePlandsImg === img.src ? 'active' : ''}`}
                    onClick={() => setActivePlandsImg(img.src)}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      title={img.title}
                      width={200}
                      height={120}
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Insights Section ... (unchanged) */}
      <section id="insights" className="section insights-section">
        {/* ... */}
        <div className="section-header">
          <p className="section-label">{t.insights.label}</p>
          <h2 className="section-title">{t.insights.title}</h2>
        </div>

        <div className="insights-grid">
          {t.insights.items.map((item, idx) => (
            <div key={idx} className="insight-card">
              <div className="insight-number">0{idx + 1}</div>
              <h4 className="insight-title">{item.title}</h4>
              <p className="insight-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section ... (unchanged) */}
      <section id="contact" className="section contact-section">
        {/* ... */}
        <h2 className="contact-title">{t.contact.title}</h2>
        <p className="contact-subtitle">
          {t.contact.subtitle}
        </p>

        <div className="contact-links">
          <a href="https://github.com/tail-s" target="_blank" rel="noopener noreferrer" className="contact-link">
            <div className="contact-icon"><Github size={22} /></div>
            <span className="contact-label">{t.contact.github}</span>
          </a>
          <a href="https://www.instagram.com/dev_mode_" target="_blank" rel="noopener noreferrer" className="contact-link">
            <div className="contact-icon"><Instagram size={22} /></div>
            <span className="contact-label">{t.contact.instagram}</span>
          </a>
          <a href="https://www.linkedin.com/in/oliverslife" target="_blank" rel="noopener noreferrer" className="contact-link">
            <div className="contact-icon"><Linkedin size={22} /></div>
            <span className="contact-label">{t.contact.linkedin}</span>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="portfolio-footer">
        <span>{t.footer.rights}</span>
        <span>{t.footer.location}</span>
      </footer>

      {/* Oliverslife Login Modal */}
      <AnimatePresence>
        {showApiModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowApiModal(false)}
            />
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '400px',
                padding: '3rem 2.5rem',
                background: '#F5F0E8',
                borderRadius: '4px',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
                zIndex: 101,
                border: '1px solid #E0D8CC',
                fontFamily: "'Inter', sans-serif"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowApiModal(false)}
                style={{
                  position: 'absolute',
                  top: '1.5rem',
                  right: '1.5rem',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9B9B9B',
                  transition: 'color 0.2s'
                }}
              >
                <X size={20} />
              </button>

              <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <div style={{ marginBottom: '1rem', color: '#8B7355', display: 'flex', justifyContent: 'center' }}>
                  <Lock size={32} strokeWidth={1.5} />
                </div>
                <h2 style={{ fontSize: '2rem', fontWeight: 400, color: '#2C2C2C', fontFamily: "'Cormorant Garamond', serif", marginBottom: '0.5rem' }}>
                  {t.modal.title}
                </h2>
                <p style={{ fontSize: '0.75rem', color: '#9B9B9B', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  {t.modal.subtitle}
                </p>
              </div>

              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: '#FFFFFF',
                      border: '1px solid #E0D8CC',
                      borderRadius: '2px',
                      fontSize: '0.9rem',
                      fontFamily: 'monospace',
                      textAlign: 'center',
                      outline: 'none',
                      color: '#2C2C2C',
                    }}
                    placeholder={t.modal.placeholder}
                    autoFocus
                  />
                </div>

                {error && <div style={{ fontSize: '0.8rem', color: '#DC2626', textAlign: 'center' }}>{error}</div>}

                <button
                  type="submit"
                  disabled={loading || !apiKey}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: '#2C2C2C',
                    border: 'none',
                    borderRadius: '2px',
                    color: 'white',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    cursor: loading || !apiKey ? 'not-allowed' : 'pointer',
                    opacity: loading || !apiKey ? 0.7 : 1,
                    transition: 'all 0.3s'
                  }}
                >
                  {loading ? t.modal.button_auth : t.modal.button_access}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bio Popup Modal */}
      <AnimatePresence>
        {showBioPopup && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(139,115,85,0.15) 0%, rgba(0,0,0,0.5) 100%)',
                backdropFilter: 'blur(8px)'
              }}
              onClick={() => setShowBioPopup(false)}
            />
            <motion.div
              initial={{ scale: 0.9, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 40, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '700px',
                maxHeight: '85vh',
                overflowY: 'auto',
                padding: '3rem',
                background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(245,240,232,0.98) 100%)',
                borderRadius: '16px',
                boxShadow: '0 25px 80px -12px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.2)',
                zIndex: 101,
                border: '1px solid rgba(139,115,85,0.2)',
                fontFamily: "'Inter', sans-serif"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative header line */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60px',
                height: '4px',
                background: 'linear-gradient(90deg, var(--color-primary), var(--color-primary-light))',
                borderRadius: '0 0 4px 4px'
              }} />

              {/* Close button - stylish chevron design */}
              <motion.button
                onClick={() => setShowBioPopup(false)}
                whileHover={{ scale: 1.1, x: 4 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  position: 'absolute',
                  top: '1.5rem',
                  right: '1.5rem',
                  background: 'linear-gradient(135deg, #8B7355 0%, #6B5744 100%)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  cursor: 'pointer',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(139,115,85,0.3)',
                  transition: 'all 0.2s'
                }}
                title={lang === 'ko' ? '닫기' : 'Close'}
              >
                <ChevronDown size={20} style={{ transform: 'rotate(-90deg)' }} />
              </motion.button>

              {/* Language toggle inside popup */}
              <motion.button
                onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  position: 'absolute',
                  top: '1.5rem',
                  left: '1.5rem',
                  background: 'rgba(139, 115, 85, 0.1)',
                  border: '1px solid rgba(139, 115, 85, 0.3)',
                  borderRadius: '20px',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s'
                }}
                title={lang === 'ko' ? 'Switch to English' : '한국어로 전환'}
              >
                <Globe size={14} style={{ color: 'var(--color-primary)' }} />
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  color: lang === 'ko' ? 'var(--color-text-muted)' : 'var(--color-text)'
                }}>EN</span>
                <span style={{
                  fontSize: '0.7rem',
                  color: 'var(--color-text-muted)'
                }}>|</span>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  color: lang === 'ko' ? 'var(--color-text)' : 'var(--color-text-muted)'
                }}>KR</span>
              </motion.button>

              {/* Content */}
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: '50px',
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, var(--color-primary))'
                  }} />
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'var(--color-primary)'
                  }}>
                    {lang === 'ko' ? '자기소개' : 'About Me'}
                  </span>
                  <div style={{
                    width: '50px',
                    height: '1px',
                    background: 'linear-gradient(90deg, var(--color-primary), transparent)'
                  }} />
                </div>
                <h2 style={{
                  fontSize: '2rem',
                  fontWeight: 400,
                  color: '#2C2C2C',
                  fontFamily: "'Cormorant Garamond', serif",
                  marginBottom: '0.5rem'
                }}>
                  Sojin Kim
                </h2>
                <p style={{
                  fontSize: '0.8rem',
                  color: '#9B9B9B',
                  letterSpacing: '0.1em'
                }}>
                  Full-Stack Developer
                </p>
              </div>

              {/* Bio Content */}
              <div style={{
                fontSize: '0.95rem',
                lineHeight: '2',
                color: '#4A4A4A',
                textAlign: 'justify',
                whiteSpace: 'pre-line'
              }}>
                {t.bioPopup.content}
              </div>

              {/* Continue Button */}
              <motion.button
                onClick={() => setShowBioPopup(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  marginTop: '2.5rem',
                  width: '100%',
                  padding: '1rem 2rem',
                  background: 'linear-gradient(135deg, #8B7355 0%, #6B5744 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(139,115,85,0.25)',
                  transition: 'all 0.3s'
                }}
              >
                {t.bioPopup.close}
                <ChevronDown size={16} style={{ transform: 'rotate(-90deg)' }} />
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hidden Lock Button */}
      <button
        onClick={() => setShowApiModal(true)}
        style={{
          position: 'fixed',
          bottom: '1rem',
          right: '1rem',
          opacity: 0.1,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          zIndex: 99,
          color: 'var(--color-text)',
          transition: 'opacity 0.3s'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.1')}
        title={t.nav.dashboard}
      >
        <Lock size={14} />
      </button>
    </div>
  );
}
