import React from 'react'
import { withGraphQL } from '~api'
import { Page } from '~app/components/Page'
import { map as expertises, Expertise } from '~modules/expertise'
import { Heading, HTMLContent } from '~design'
import { Section } from '~app/components/Section'

const expertise = expertises[Expertise.SocialSecurity]

const StaticPage = () => (
  <Page>
    <div className="bg-reverse text-white py-8">
      <Heading noMargins>{expertise.label}</Heading>
    </div>

    <main>
      <Section>
        <HTMLContent>
          <p>
            Desde a Constituição de 1988 os direitos à saúde, à assistência
            social e à aposentadoria públicas são tratados de forma integrada na
            Seguridade Social, sendo financiados por uma série de tributos,
            pagos por toda a sociedade.
          </p>
          <p>
            O acesso a estes direitos, entretanto, constitui um desafio
            constante, enfrentado por grande parte do povo brasileiro, em
            particular no que diz respeito à garantia de acesso a uma saúde
            pública de qualidade e a uma aposentadoria digna.
          </p>
          <p>
            Convivem com o sistema público de Seguridade Social, sistemas
            privados de saúde suplementar e de previdência complementar, que
            também geram constantes reclamações por parte dos seus usuários.
          </p>
        </HTMLContent>
      </Section>

      <Section
        title="Acesso aos serviços de saúde"
        textual
        className="bg-aside"
      >
        <HTMLContent>
          <p>
            O principal problema enfrentado pela saúde pública tem sido a grande
            demora no acesso da população aos serviços por ela prestados, o que
            normalmente decorre da falta de investimentos públicos na ampliação
            da rede e na contratação de servidores especializados em cada área.
          </p>
          <p>
            Este problema se repete em praticamente todas as instituições
            prestadoras de saúde suplementar, agravado, aqui, pelos constantes e
            abusivos reajustes nas contribuições devidas por aqueles que aderem
            a estas instituições.
          </p>
          <h3>O que fazemos:</h3>
          <ul>
            <li>
              Ajuizamos ações com o objetivo de assegurar o acesso imediato aos
              serviços de saúde pública, como atendimentos urgentes,
              fornecimento de medicamentos indispensáveis aos tratamentos,
              marcação de cirurgias etc.
            </li>
            <li>
              Ajuizamos ações contra os reajustes abusivos dos planos de saúde
              privados;
            </li>
            <li>
              Ajuizamos ações com o objetivo de assegurar o acesso imediato aos
              serviços de saúde privados (atendimentos urgentes, fornecimento de
              medicamentos indispensáveis aos tratamentos, marcação de cirurgias
              etc.) nos casos em que os servidores públicos ou trabalhadores do
              setor privado mantêm vínculo com estas instituições;
            </li>
            <li>
              Assessoramos as entidades sindicais na luta pela melhoria e
              ampliação da saúde pública e na formulação de políticas que
              assegurem uma gestão participativa em planos de saúde privados,
              como são exemplos a GEAP e a CAPESAÚDE.
            </li>
          </ul>
        </HTMLContent>
      </Section>

      <Section title="Acesso à aposentadoria" textual>
        <HTMLContent>
          <p>
            A aposentadoria é o direito de afastar-se do trabalho em razão de
            incapacidade física ou do cumprimento de requisitos como idade e
            tempo de contribuição, passando a receber benefício do INSS (quando
            se tratar de trabalhador do setor privado) ou dos regimes próprios
            de previdência (quando se tratar de servidor público).
          </p>
          <p>
            As recentes e constantes reformas nas regras de acesso às
            aposentadorias e nas formas de cálculo dos benefícios, entretanto,
            têm gerado inúmeras dificuldades tanto para a comprovação do
            cumprimento dos requisitos, como para a definição do valor desta
            aposentadoria, violando direitos reconhecidos pela Constituição
            Federal.
          </p>
          <p>
            A atuação do Escritório, assim, está voltada para o esclarecimento
            sobre estas regras, de modo a defender os direitos dos servidores
            públicos e trabalhadores do setor privado tanto no campo judicial,
            como da formulação de normas voltadas à regulamentação dos direitos
            previstos na Constituição.
          </p>
          <h3>O que fazemos:</h3>
          <ul>
            <li>
              Ajuizamos ações para reconhecimento de tempo de contribuição com
              vistas à aposentadoria;
            </li>
            <li>
              Ajuizamos ações com o objetivo de revisar o valor das
              aposentadorias já concedidas;
            </li>
            <li>
              Ajuizamos Ações postulando a concessão de benefícios por
              incapacidade, como aposentadoria por invalidez, auxílio-acidente
              &nbsp;e auxílio-doença;
            </li>
            <li>
              Ajuizamos ações com a finalidade de demonstrar a exposição do
              servidor público ou trabalhador do setor privado à ação de agentes
              nocivos à saúde ou à integridade física, com vistas à
              aposentadoria especial ou à contagem especial deste tempo de
              serviço;
            </li>
            <li>
              Discutimos em juízo o direito dos servidores públicos à
              integralidade de suas aposentadorias, com a incorporação das
              gratificações de desempenho;
            </li>
            <li>
              Enfrentamos decisões em que o Tribunal de Contas da União
              determina a anulação de aposentadorias ou pensões ou a redução do
              valor destes benefício pagos a servidores públicos;
            </li>
            <li>
              Ajuizamos ações tratando do direito às pensões previdenciárias;
            </li>
            <li>
              Assessoramos as entidades sindicais na formulação de políticas
              voltadas a impedir a aprovação das repetidas propostas de reformas
              previdenciárias, quase sempre voltadas à redução dos direitos dos
              trabalhadores e servidores públicos;
            </li>
            <li>
              Elaboramos estudos sobre a questão previdenciária no Brasil,
              visando aprimorar a doutrina a respeito do assunto e influenciar a
              jurisprudência.
            </li>
          </ul>
        </HTMLContent>
      </Section>
    </main>
  </Page>
)

export default withGraphQL(StaticPage)
