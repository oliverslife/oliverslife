export const translations = {
    en: {
        nav: {
            about: 'About',
            projects: 'Projects',
            insights: 'Insights',
            contact: 'Contact',
            dashboard: 'Cressets'
        },
        hero: {
            tagline: 'Full-Stack Developer • Seoul, Korea',
            title_prefix: 'Building',
            title_accent: 'Thoughtful',
            title_suffix: 'Digital Experiences',
            description: 'I enjoy bringing ideas to life through development. With a strong interest in blockchain, Web3, and security, I focus on creating robust and meaningful solutions that bridge innovation with practicality.',
            cta: 'View Projects',
            role: 'Developer'
        },
        about: {
            label: 'About Me',
            title: 'Background & Experience',
            intro: 'I take pleasure in imagining business concepts and transforming them into reality. Though my professional experience is still growing, I\'m actively learning through training programs led by top companies in each field.',
            skills: 'Core Skills',
            certifications: 'Certifications',
            experience: 'Experience'
        },
        projects: {
            label: 'Selected Work',
            title: 'Projects',
            featured_label: 'Featured Project',
            soulgrid: {
                title: 'SoulGrid Platform',
                desc_prefix: 'An integrated productivity and social networking platform combining personal journaling, project management, and interest-based matching.',
                desc_deploy: 'On-Premise Deployment:',
                desc_deploy_text: 'Hosted on a self-managed Mac Mini M4 cluster using Docker for container orchestration. Implemented a complete Self-Hosted CI/CD pipeline with Jenkins to manage the full lifecycle from development to production, ensuring data sovereignty and deep infrastructure control.',
                link: 'View on GitHub'
            },
            birdchain: {
                title: 'BirdChain',
                role: 'Blockchain Developer / Team Leader',
                desc: 'NFT platform promoting endangered birds awareness. Implemented smart contracts with Web3.js and managed NFT metadata on IPFS.'
            },
            defi_audit: {
                title: 'DeFi Lending Protocol Audit',
                role: 'Team Member',
                desc: 'Code Level Analysis of Compound Protocol\'s Deposit, Withdrawal, Loan, Repayment, and Liquidation Functions. Venus Protocol Isolated Pool, Cyan Audit and Invariant Check. Analyzed 352 findings from various lending protocol audits.'
            },
            persona: {
                title: 'Persona',
                role: 'Frontend Lead / Team Leader',
                desc: 'Community platform for AI-powered acting performance analysis using Mediapipe and Tensorflow.js for real-time feedback.'
            },
            plands: {
                title: 'Plands',
                role: 'Backend Developer',
                desc: 'Real-time video conference and collaborative planner with Spring Security, JWT authentication, and OpenVidu integration.'
            }
        },
        insights: {
            label: 'Technical Depth',
            title: 'Design Philosophy',
            items: [
                {
                    title: 'Microservices Architecture',
                    desc: 'Designed services around domain boundaries using DDD principles. Each service (User, Post, Date, Manage) operates independently with its own data store, enabling independent deployment and scaling.'
                },
                {
                    title: 'Hybrid Authentication',
                    desc: 'Implemented JWT-based stateless authentication with HttpOnly cookies. Integrated Web3 wallet login using ECDSA signature verification, bridgind centralized and decentralized identity.'
                },
                {
                    title: 'Polyglot Persistence',
                    desc: 'Strategic database selection: MySQL for transactional data, MongoDB for flexible schemas (chat, profiles), and Redis for caching and session management.'
                },
                {
                    title: 'Resilient Infrastructure',
                    desc: 'Spring Cloud ecosystem with Eureka, Config Server, and RabbitMQ Bus. Self-hosted CI/CD ensures reliable delivery on on-premise infrastructure.'
                }
            ]
        },
        contact: {
            title: "Let's Connect",
            subtitle: 'Open to discussing new opportunities and interesting projects.',
            github: 'GitHub',
            instagram: 'Instagram',
            linkedin: 'LinkedIn'
        },
        footer: {
            rights: '© 2026 Sojin Kim. All rights reserved.',
            location: 'Seoul, South Korea'
        },
        modal: {
            title: 'Cressets',
            subtitle: 'File Management System',
            placeholder: 'Enter API Key',
            button_auth: 'Authenticating...',
            button_access: 'Access System',
            error_invalid: 'Invalid API Key',
            error_connection: 'Connection Error'
        },
        bioPopup: {
            close: 'Continue',
            content: `I graduated from university with a major in Chemistry, but an experience in cryptocurrency investing sparked my curiosity about technology, which led me to software development. While analyzing blockchain projects and exploring GitHub repositories, I discovered the joy and potential of coding. I then pursued web development training, gaining hands-on experience across frontend, backend, blockchain, and infrastructure.

In team projects, I took on various roles including backend security authentication, frontend UI design, and integrating smart contracts for an NFT minting platform, building a strong understanding of end-to-end system architecture.

As a solo solution developer, I gained real-world service experience implementing business logic, debugging database queries, and handling client requests. This taught me the importance of stable service architecture and security. I then balanced freelance development work with a blockchain security training program, expanding my expertise. During the program, I analyzed smart contract vulnerabilities and studied the deposit, lending, repayment, and liquidation structures of Web3 financial services at the code level, learning both the possibilities and limitations of blockchain technology.

Currently, I work at the Korea Fiscal Information Service, operating the national settlement system. In this environment where the accuracy and stability of fiscal data directly impacts national trust, I am developing a strong sense of responsibility in system operations. However, due to the nature of public institutions, there are limitations in actively applying cutting-edge technology in practice. Therefore, I aim to take on roles that create direct value through technology in my spare time.`
        }
    },
    ko: {
        nav: {
            about: '소개',
            projects: '프로젝트',
            insights: '인사이트',
            contact: '문의',
            dashboard: 'Cressets'
        },
        hero: {
            tagline: '풀스택 개발자 • 대한민국 서울',
            title_prefix: '',
            title_accent: '생각이 담긴',
            title_suffix: '디지털 경험을 만듭니다',
            description: '아이디어를 개발을 통해 현실로 만드는 것을 즐깁니다. 블록체인, Web3, 보안에 깊은 관심을 가지고 있으며, 혁신과 실용성을 연결하는 견고하고 의미 있는 솔루션을 만드는 데 집중합니다.',
            cta: '프로젝트 보기',
            role: 'Developer'
        },
        about: {
            label: '소개',
            title: '경험 및 배경',
            intro: '비즈니스 컨셉을 상상하고 그것을 현실로 구현하는 과정에서 즐거움을 느낍니다. 각 분야 최고의 기업들이 주도하는 교육 과정을 통해 적극적으로 성장하고 있습니다.',
            skills: '핵심 역량',
            certifications: '자격증 및 수료',
            experience: '경력'
        },
        projects: {
            label: '포트폴리오',
            title: '주요 프로젝트',
            featured_label: '대표 프로젝트',
            soulgrid: {
                title: 'SoulGrid 플랫폼',
                desc_prefix: '개인 저널링, 프로젝트 관리, 관심사 기반 매칭을 결합한 통합 생산성 및 소셜 네트워킹 플랫폼입니다.',
                desc_deploy: '온프레미스 배포:',
                desc_deploy_text: 'Docker 기반 컨테이너 오케스트레이션을 사용하여 Mac Mini M4 클러스터에 자체 호스팅 환경을 구축했습니다. Jenkins를 통해 개발부터 운영까지 전체 라이프사이클을 관리하는 CI/CD 파이프라인을 구현하여 데이터 주권과 인프라 통제권을 확보했습니다.',
                link: 'GitHub에서 보기'
            },
            birdchain: {
                title: 'BirdChain',
                role: '블록체인 개발자 / 팀장',
                desc: '멸종 위기 조류 보호를 위한 NFT 플랫폼입니다. Web3.js로 스마트 컨트랙트를 연동하고 IPFS를 통해 NFT 메타데이터를 관리했습니다.'
            },
            defi_audit: {
                title: 'DeFi 렌딩 프로토콜 감사',
                role: '팀원',
                desc: 'Compound Protocol의 입금, 출금, 대출, 상환, 청산 함수 코드 레벨 분석. Venus Protocol Isolated Pool, Cyan 감사 및 불변성(Invariant) 검증 수행. 다양한 렌딩 프로토콜 감사 리포트에서 352개의 취약점(Findings) 분석.'
            },
            persona: {
                title: 'Persona',
                role: '프론트엔드 리드 / 팀장',
                desc: 'Mediapipe와 Tensorflow.js를 활용한 AI 연기 분석 및 실시간 피드백 커뮤니티 플랫폼입니다.'
            },
            plands: {
                title: 'Plands',
                role: '백엔드 개발자',
                desc: 'Spring Security와 JWT 인증, OpenVidu를 연동한 실시간 화상 회의 및 협업 플래너 서비스입니다.'
            }
        },
        insights: {
            label: '기술적 깊이',
            title: '설계 철학',
            items: [
                {
                    title: '마이크로서비스 아키텍처',
                    desc: 'DDD 원칙에 따라 도메인 경계를 중심으로 서비스를 설계했습니다. 각 서비스(User, Post, Date, Manage)는 독립된 데이터 저장소를 가지며 독립적인 배포와 확장이 가능합니다.'
                },
                {
                    title: '하이브리드 인증 시스템',
                    desc: 'HttpOnly 쿠키를 사용하는 JWT 기반의 무상태(Stateless) 인증을 구현했고, ECDSA 서명 검증을 통한 Web3 지갑 로그인을 통합하여 중앙화된 ID와 탈중앙화된 신원을 연결했습니다.'
                },
                {
                    title: '폴리글랏 퍼시스턴스',
                    desc: '데이터 특성에 맞는 최적의 DB를 선택했습니다. 트랜잭션 데이터는 MySQL, 비정형 데이터(채팅, 프로필)는 MongoDB, 캐싱 및 세션은 Redis를 사용합니다.'
                },
                {
                    title: '견고한 인프라스트럭처',
                    desc: 'Eureka, Config Server, RabbitMQ Bus를 활용한 Spring Cloud 생태계를 구축했습니다. 온프레미스 환경에서도 안정적인 배포를 위해 Self-hosted CI/CD를 운영합니다.'
                }
            ]
        },
        contact: {
            title: "함께 이야기해요",
            subtitle: '새로운 기회와 흥미로운 프로젝트에 대해 논의하는 것을 환영합니다.',
            github: 'GitHub',
            instagram: 'Instagram',
            linkedin: 'LinkedIn'
        },
        footer: {
            rights: '© 2026 Kim Sojin. All rights reserved.',
            location: '서울, 대한민국'
        },
        modal: {
            title: 'Cressets',
            subtitle: '파일 관리 시스템',
            placeholder: 'API 키 입력',
            button_auth: '인증 중...',
            button_access: '시스템 접속',
            error_invalid: '유효하지 않은 API 키입니다',
            error_connection: '연결 오류'
        },
        bioPopup: {
            close: '계속하기',
            content: `화학 전공으로 대학을 졸업했으나, 암호화폐 투자 경험을 계기로 기술에 대한 호기심이 개발로 이어졌습니다. 블록체인 프로젝트를 분석하며 깃허브의 코드를 살펴보는 과정에서 개발의 재미와 가능성을 느꼈고, 이후 웹 개발 교육을 통해 프론트엔드, 백엔드, 블록체인, 인프라 전반을 경험하였습니다. 팀 프로젝트에서는 백엔드 보안 인증, 프론트엔드 화면 설계, NFT 민팅 플랫폼의 스마트 컨트랙트 연동 등 다양한 역할을 수행하며 전체 시스템 흐름을 이해하는 역량을 쌓았습니다.

1인 솔루션 개발자로 활동하며 실제 서비스 운영 환경에서 비즈니스 로직 구현, 데이터베이스 쿼리 디버깅, 고객사 요청사항 대응을 경험하였습니다. 해당 경험을 바탕으로 보다 안정적인 서비스 구조와 보안의 중요성을 인식하게 되었고, 이후에는 프리랜서 개발 업무를 수행하는 동시에 블록체인 보안 교육과정을 수강하며 전문성을 확장하였습니다. 교육과정에서는 스마트 컨트랙트 취약점 분석, 웹3 금융 서비스의 입출금·대출·상환·청산 구조를 코드 레벨에서 분석하며, 블록체인 기술의 가능성과 한계를 함께 학습하였습니다.

현재는 한국재정정보원에서 국가 결산시스템 운영을 담당하며, 재정 데이터의 정확성과 안정성이 국가 신뢰로 직결되는 환경에서 시스템 운영의 책임감을 체득하고 있습니다. 다만 공공기관의 특성상 첨단 기술을 적극적으로 실무에 적용하는 데에는 한계가 있어, 여가 시간을 활용하여 기술을 통해 보다 직접적인 가치를 창출하는 역할을 수행하고자 하는 목표로 움직이고 있습니다.`
        }
    }
};
