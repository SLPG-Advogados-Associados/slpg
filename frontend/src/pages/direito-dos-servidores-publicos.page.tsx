import React from 'react'
import { Page } from '~app/components/Page'
import { map as expertises, Expertise } from '~modules/expertise'
import { Heading, HTMLContent } from '~design'
import { Section } from '~app/components/Section'

const expertise = expertises[Expertise.PublicSector]

const PostPage = () => (
  <Page>
    <div className="bg-reverse text-white py-8">
      <Heading noMargins>{expertise.label}</Heading>
    </div>

    <main>
      <Section>
        <HTMLContent>
          <p>
            A Constituição de 1988 trouxe importantes modificações no sentido de
            conferir aos servidores públicos o status de trabalhadores, sujeitos
            de direitos e obrigações à semelhança do que ocorre com os
            trabalhadores do setor privado. Entretanto, em que pese essas
            modificações, alguns setores da Administração Pública e dos Poderes
            Legislativo e Judiciário, ao lado de parte dos doutrinadores do
            direito administrativo, ainda opõem séria resistência ao
            reconhecimento de que a relação entre os servidores e o Estado não
            lhes retira a condição de trabalhadores, ainda que sujeitos a
            algumas regras específicas aplicáveis à Administração Pública.
          </p>

          <p>
            Nosso trabalho, assim, consiste exatamente em buscar elementos
            capazes de enfrentar essa resistência e fazer valer os direitos dos
            servidores públicos em patamares semelhantes àqueles reconhecidos em
            favor dos trabalhadores do setor privado, como o direito à livre
            constituição de sindicatos, o direito de greve, e o direito à
            negociação coletiva de suas condições salariais e de trabalho,
            dentre outros.
          </p>
        </HTMLContent>
      </Section>

      <Section title="Reajustes salariais" textual className="bg-aside">
        <HTMLContent>
          <p>
            Um dos principais problemas normalmente existentes na relação entre
            os servidores e Administração Pública se refere à fixação de regras
            claras de reajustamento dos salários, constantemente negadas pelos
            Poderes Executivo, Legislativo e Judiciário.
          </p>

          <p>
            A luta por estes reajustes constitui uma das principais iniciativas
            jurídicas do Escritório, tanto quando este assessora os movimentos
            reivindicatórios dos servidores, como quando ajuíza medidas
            judiciais no sentido da obtenção destes reajustes ou da fixação das
            regras que conduzam à sua concessão.
          </p>

          <h3>O que fazemos:</h3>

          <ul>
            <li>
              Ajuizamos ações judiciais com o objetivo de assegurar reajustes
              salariais não concedidos pela Administração Pública ou concedidos
              a apenas algumas categorias, em detrimento de outras;
            </li>

            <li>
              Atuamos na construção de uma doutrina que reconheça o direito dos
              servidores públicos à recuperação do poder aquisitivo dos seus
              salários;
            </li>

            <li>
              Assessoramos as entidades sindicais na elaboração de suas pautas
              de reivindicações e nas negociações instauradas com a
              Administração Pública.
            </li>
          </ul>
        </HTMLContent>
      </Section>

      <Section title="Estruturação de carreiras" textual>
        <HTMLContent>
          <p>
            A organização de planos de cargos ou de carreiras constitui
            importante medida no sentido da melhoria da qualidade dos serviços
            públicos e da valorização dos servidores.
          </p>

          <p>
            Apesar disso, mesmo quando a Administração Pública sugere a adoção
            destes mecanismos, regra geral o faz unicamente com o objetivo de
            compor novas tabelas salariais específicas de determinados grupos de
            servidores, evitando assim a concessão dos reajustes gerais
            determinados pela Constituição.
          </p>

          <p>
            Nossa atuação aqui visa não só à estruturação de efetivos planos de
            carreiras onde eles não existam, mas também à reestruturação
            daqueles existentes, de modo que ambos incorporem as diretrizes
            aprovadas há alguns anos pelas entidades nacionais representativas
            de servidores públicos.
          </p>

          <h3>O que fazemos:</h3>

          <ul>
            <li>
              Ajuizamos ações judiciais com o objetivo de fazer com que as
              estruturas de carreiras criadas respeitem direitos adquiridos na
              anterior relação do servidor com a Administração Pública;
            </li>

            <li>
              Atuamos no sentido de demonstrar a viabilidade jurídica da
              estruturação ou reestruturação de carreiras, inclusive quando
              estas implicam a aglutinação ou transformação dos cargos públicos
              anteriores, sem que isso gere lesão ao princípio do concurso
              público;
            </li>

            <li>
              Assessoramos as entidades sindicais nos estudos a respeito da
              estruturação ou reestruturação de carreiras, bem como na
              elaboração das normas legais respectivas.
            </li>
          </ul>
        </HTMLContent>
      </Section>

      <Section title="Saúde" textual className="bg-aside">
        <HTMLContent>
          <p>
            A questão envolvendo as dificuldade de acesso à saúde tem merecido,
            nos últimos anos, uma atenção especial, não só em razão do interesse
            social e econômico que desperta, mas também em razão dos aspectos
            jurídicos aqui envolvidos, sobretudo quando lembramos que a
            Constituição de 1988 assegurou a todos os brasileiros o acesso
            universal aos serviços de saúde, que devem ser prestados com a
            necessária qualidade.
          </p>

          <p>
            Questões como acesso a medicamentos e tratamentos pelo SUS - Sistema
            Único de Saúde - ou pelos planos privados de saúde (como GEAP,
            CAPESAÚDE, UNIMED etc); questões relativas aos reajustes abusivos
            das mensalidades destes planos privados ou questões atinentes à
            gestão democrática destes planos, são matérias que constituem
            interesses cada vez mais relevantes para os servidores públicos e
            trabalhadores de maneira geral, justificando uma atuação mais forte
            do Escritório nesta área.
          </p>

          <h3>O que fazemos:</h3>

          <ul>
            <li>
              Ajuizamos ações judiciais visando a garantir o acesso a
              medicamentos ou tratamentos que são negados ou postergados pelos
              SUS ou pelos planos privados de saúde;
            </li>

            <li>
              Ajuizamos ações judiciais visando a ver reconhecida a abusividade
              de alguns reajustes aplicados nas mensalidades devidas aos planos
              privados de saúde;
            </li>

            <li>
              Assessoramos as entidades sindicais na luta por uma gestão
              democrática dos planos privados de saúde, em especial quando
              organizados na modalidade de autogestão (como a GEAP ou a
              CAPESAÚDE).
            </li>
          </ul>
        </HTMLContent>
      </Section>

      <Section title="Outros direitos funcionais de maneira geral" textual>
        <HTMLContent>
          <p>
            Além do direito aos reajustes salariais e da importância da
            organização dos servidores em carreiras, diversos outros direitos
            funcionais precisam ser cotidianamente defendidos contra iniciativas
            legislativas ou governamentais que quase sempre visam a extingui-los
            ou a reduzir sua eficácia, como de resto ocorre na relação entre os
            trabalhadores do setor privado e seus empregadores.
          </p>

          <p>
            Lutar pela regulamentação de alguns dos direitos inseridos na
            Constituição de 1988, pelo respeito aos direitos adquiridos pelos
            servidores ao longo de suas vidas funcionais ou ainda lutar pela
            extensão a estes servidores de direitos humanos já reconhecidos em
            favor dos trabalhadores do setor privado, constitui um dos objetivos
            do nosso Escritório.
          </p>

          <h3>O que fazemos:</h3>

          <ul>
            <li>
              Ajuizamos ações judiciais com o objetivo de assegurar o direito
              dos servidores públicos à progressão nas carreiras; à conversão de
              licença-prêmio em dinheiro; ao enquadramento dos servidores
              anistiados no regime jurídico estatutário; para impedir a
              reposição ao erário de parcelas recebidas de boa-fé pelo servidor;
              para averbar tempo de serviço não reconhecido pela Administração
              Pública, para fins de aposentadoria; para obter indenização em
              decorrência de doença causada pela atividade laboral; ajuizamos
              ações para fazer cessar o assédio moral no ambiente de trabalho,
              com a correspondente indenização do ofendido; e interpomos medidas
              judiciais visando à melhoria das condições ambientais de trabalho,
              dentre outras;
            </li>

            <li>
              Assessoramos o movimento sindical na busca da melhoria da
              legislação e dos regulamentos aplicáveis aos servidores públicos,
              bem como na luta pelo reconhecimento de direitos a eles ainda
              negados;
            </li>

            <li>
              Atuamos para a construção de teses que dêem sustentação aos
              direitos dos servidores públicos e à sua ampliação, em especial
              quando tratamos de direitos humanos fundamentais.
            </li>
          </ul>
        </HTMLContent>
      </Section>
    </main>
  </Page>
)

export default PostPage
