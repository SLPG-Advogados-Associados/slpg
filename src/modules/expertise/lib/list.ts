export enum Expertise {
  PublicSector = 'Direitos dos Servidores Públicos',
  PrivateSector = 'Direitos Trabalhistas',
  SocialSecurity = 'Direitos Previdenciários',
  Unions = 'Direitos Sindicais',
  Civil = 'Direitos Civis',
}

// prettier-ignore
const map = {
  [Expertise.PublicSector]: { id: Expertise.PublicSector, href: '/direito-dos-servidores-publicos', label: 'Direitos dos Servidores Públicos', },
  [Expertise.PrivateSector]: { id: Expertise.PrivateSector, href: '/direitos-trabalhistas-do-setor-privado', label: 'Direitos Trabalhistas', },
  [Expertise.SocialSecurity]: { id: Expertise.SocialSecurity, href: '/direitos-previdenciarios', label: 'Direitos Previdenciários', },
  [Expertise.Unions]: { id: Expertise.Unions, href: '/direitos-sindicais', label: 'Direitos Sindicais', },
  [Expertise.Civil]: { id: Expertise.Civil, href: '/direitos-civis', label: 'Direitos Civis', },
}

const list = Object.values(map)

export { map, list }
