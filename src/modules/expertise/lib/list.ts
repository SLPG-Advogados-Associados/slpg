export enum Expertise {
  PublicSector = 'Direitos dos Servidores Públicos',
  PrivateSector = 'Direitos Trabalhistas',
  SocialSecurity = 'Direitos Previdenciários',
  Unions = 'Direitos Sindicais',
  Civil = 'Direitos Civis',
}

const map = {
  [Expertise.PublicSector]: {
    id: Expertise.PublicSector,
    href: '/direito-dos-servidores-publicos',
    label: 'Direitos dos Servidores Públicos',
    description:
      'Reajustes salariais, estruturação de carreiras, saúde e outros direitos funcionais de maneira geral.',
  },
  [Expertise.PrivateSector]: {
    id: Expertise.PrivateSector,
    href: '/direitos-trabalhistas-do-setor-privado',
    label: 'Direitos Trabalhistas',
    description: 'Direitos das relações celetistas de trabalho (CLT).',
  },
  [Expertise.SocialSecurity]: {
    id: Expertise.SocialSecurity,
    href: '/direitos-previdenciarios',
    label: 'Direitos Previdenciários',
    description: 'Acesso aos serviços de saúde e acesso à aposentadoria.',
  },
  [Expertise.Unions]: {
    id: Expertise.Unions,
    href: '/direitos-sindicais',
    label: 'Direitos Sindicais',
    description:
      'Direito de greve, negociação coletiva e liberdade de organização sindical.',
  },
  [Expertise.Civil]: {
    id: Expertise.Civil,
    href: '/direitos-civis',
    label: 'Direitos Civis',
    description:
      'Direito de família, direito das sucessões, direito imobiliário, direito registral e notarial, responsabilidade civil e demais questões do direito civil.',
  },
}

const list = Object.values(map)

export { map, list }
