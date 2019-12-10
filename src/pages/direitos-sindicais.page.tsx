import React from 'react'
import { withGraphQL } from '~api'
import { Page } from '~app/components/Page'
import { map as expertises, Expertise } from '~modules/expertise'
import { Heading, HTMLContent } from '~design'
import { Section } from '~app/components/Section'

const expertise = expertises[Expertise.Unions]

const StaticPage = () => (
  <Page meta={{ title: expertise.label, description: expertise.description }}>
    <div className="bg-reverse text-white py-8">
      <Heading noMargins>{expertise.label}</Heading>
    </div>

    <main>
      <Section>
        <HTMLContent>
          <p>
            A garantia de direitos sindicais dos servidores públicos e dos
            trabalhadores do setor privado é preocupação que consta da
            Declaração Universal dos Direitos&nbsp;Humanos, aprovada pela ONU -
            Organização das Nações Unidas - em 1948.
          </p>
          <p>
            Sua efetivação no plano interno de cada País, entretanto, vem
            enfrentando constantes obstáculos por parte daqueles que não querem
            permitir a concretização destes direitos e a ampliação do poder de
            pressão exercido pelas entidades sindicais sobre os patrões, sejam
            eles empresários do setor privado ou gestores públicos.
          </p>
          <p>
            Especificamente no Brasil, a Constituição Federal ainda carece de
            regulamentação no que diz respeito ao exercício do direito de greve
            pelos servidores públicos; é dúbia quanto ao direito destes
            servidores à negociação coletiva de suas condições salariais e de
            trabalho; ainda exige a unicidade sindical, que implica clara
            intervenção do Poder Público na liberdade de organização sindical; e
            mantém o modelo compulsório de financiamento da estrutura sindical.
          </p>
        </HTMLContent>
      </Section>

      <Section title="Direito de greve" textual className="bg-aside">
        <HTMLContent>
          <p>
            Tanto no setor privado quanto no serviço público, têm sido variadas
            as tentativas de limitação ao exercício do direito de greve, como
            decisões judiciais impondo multas absurdas contra as entidades
            sindicais; as decisões judiciais que determinam que os piquetes de
            greve se localizem longe dos locais de trabalho, impedindo a própria
            ação de mobilização das entidades sindicais; a imposição de
            descontos remuneratórios desde a deflagração dos movimentos
            grevistas, mesmo quando estes ocorrem em razão do descumprimento de
            acordos por parte dos patrões; e decisões do Supremo Tribunal
            Federal que impõem aos servidores públicos a mesma legislação de
            greve aplicável ao setor privado, nem sempre adequada à específica
            situação dos serviços públicos.
          </p>
          <h3>O que fazemos:</h3>
          <ul>
            <li>
              Ajuizamos ações visando a impedir a realização de descontos
              remuneratórios antes do desfecho dos movimentos grevistas;
            </li>
            <li>
              Defendemos as entidades sindicais contra os interditos
              proibitórios ajuizados com a finalidade de afastar os piquetes dos
              locais de trabalho;
            </li>
            <li>
              Defendemos as entidades sindicais na decretação de multas contra
              elas, determinadas pelo Poder Judiciário;
            </li>
            <li>
              Elaboramos estudos com vistas à regulamentação do direito de
              greve, sempre com a preocupação de que esta regulamentação esteja
              voltada à efetivação do direito, e não à sua limitação.
            </li>
          </ul>
        </HTMLContent>
      </Section>

      <Section title="Negociação coletiva" textual>
        <HTMLContent>
          <p>
            A negociação coletiva constitui, sem dúvida, um dos pilares
            fundamentais do direito à sindicalização, já que está voltada
            exatamente para a solução dos conflitos decorrentes da relação de
            trabalho. Ainda assim, entretanto, no serviço público ainda não
            temos regulamentado este direito, o que permite aos gestores tratar
            as pautas de reivindicações dos servidores com pouco ou nenhum
            interesse, fazendo eclodir greves muitas vezes voltadas apenas à
            abertura destas negociações.
          </p>
          <p>
            Esta situação perdura mesmo depois da ratificação, pelo Brasil, das
            Convenções nºs 151 e 154, da OIT - Organização Internacional do
            Trabalho -, o que denota o desprezo do Poder Público pela efetivação
            deste direito humano fundamental no plano interno.
          </p>
          <p>
            No setor privado, por sua vez, ainda que a negociação coletiva
            esteja regulamentada, convivemos hoje com as propostas de supremacia
            do negociado sobre o legislado que se forem aprovadas certamente
            reduzirão ainda mais os direitos dos trabalhadores, haja vista a
            correlação de forças desfavorável entre sindicatos de empregados e
            de empregadores.
          </p>
          <h3>O que fazemos:</h3>
          <ul>
            <li>
              Prestamos assessoria às entidades sindicais na formulação de suas
              pautas de reivindicações e nas negociações destas pautas com os
              empregadores (ou o Poder Público, no caso dos servidores);
            </li>
            <li>
              Ajuizamos medidas judiciais voltadas a obrigar a Administração
              Pública à instauração de mesas de negociação com as entidades
              representativas de servidores públicos;
            </li>
            <li>
              Elaboramos estudos sobre a regulamentação do direito dos
              servidores públicos à negociação coletiva, visando a contribuir
              com a doutrina e a jurisprudência sobre o assunto;
            </li>
            <li>
              Formulamos denúncias em organismos internacionais sobre o
              desrespeito do Estado brasileiro a direitos humanos fundamentais,
              como os direitos à liberdade de organização sindical, de greve, e
              de negociação coletiva.
            </li>
          </ul>
        </HTMLContent>
      </Section>

      <Section
        title="Liberdade de organização sindical"
        textual
        className="bg-aside"
      >
        <HTMLContent>
          <p>
            Ainda que a Constituição de 1988 haja assegurado o direito à
            liberdade de organização sindical, o seu próprio texto cai em
            contradições, como a manutenção do sistema confederativo, da
            unicidade sindical e da contribuição sindical obrigatória (antigo
            imposto sindical), o que só tem servido para dificultar a livre
            organização dos trabalhadores e manter no poder dirigentes sindicais
            interessados apenas na manutenção dos seus espaços de poder e não em
            defender efetivamente os interesses da categoria representada.
          </p>
          <p>
            No serviço público esta situação se agrava em razão da evidente
            incompatibilidade entre o modelo confederativo, empregado entre os
            sindicatos do setor privado desde a publicação da CLT durante o
            Governo Vargas e o modelo de liberdade sindical adotado pelas
            entidades de servidores públicos a partir de 1988, quando a
            Constituição lhes estendeu o direito à sindicalização, o que tem
            levado a algumas dificuldades de registro destas entidades junto ao
            Ministério do Trabalho.
          </p>
          <p>
            Por outro lado, é preciso ter em conta que a liberdade de
            organização sindical encerra também o direito de organização (e
            reunião) nos locais de trabalho; o direito à liberação de dirigentes
            sindicais de suas atividades laborais normais, de modo que possam se
            dedicar à atividade sindical e o direito de livre escolha sobre a
            forma como a atividade sindical será financiada; questões sobre as
            quais ainda se enfrenta sérias dificuldades, seja entre as
            organizações sindicais dos trabalhadores do setor privado ou do
            serviço público.
          </p>
          <h3>O que fazemos:</h3>
          <ul>
            <li>
              Prestamos assessoria às entidades sindicais no acompanhamento de
              pedidos de registro junto ao Ministério do Trabalho;
            </li>
            <li>
              Elaboramos estudos sobre o direito à liberdade de organização
              sindical, visando a contribuir com a doutrina e a jurisprudência
              sobre o assunto;
            </li>
            <li>
              Ajuizamos ações objetivando assegurar o direito de acesso e de
              reunião das entidades sindicais nos locais de trabalho.
            </li>
          </ul>
        </HTMLContent>
      </Section>
    </main>
  </Page>
)

export default withGraphQL(StaticPage)
