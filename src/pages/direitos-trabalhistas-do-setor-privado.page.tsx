import React from 'react'
import { withGraphQL } from '~api'
import { Page } from '~app/components/Page'
import { map as expertises, Expertise } from '~modules/expertise'
import { Heading, HTMLContent } from '~design'
import { Section } from '~app/components/Section'

const expertise = expertises[Expertise.PrivateSector]

const StaticPage = () => (
  <Page meta={{ title: expertise.label, description: expertise.description }}>
    <div className="bg-reverse text-white py-8">
      <Heading noMargins>{expertise.label}</Heading>
    </div>

    <main>
      <Section>
        <HTMLContent>
          <p>
            Diferente dos servidores públicos, que normalmente têm suas relações
            com a Administração Pública marcadas por um caráter estatutário, os
            trabalhadores do setor privado têm suas relações de trabalho regidas
            pela CLT - Consolidação das Leis do Trabalho.
          </p>

          <p>
            Também estes trabalhadores, entretanto, sofrem constantes ataques
            aos seus direitos tanto de parte do próprio empregador, como dos
            Poderes Executivo e Legislativo, que não cansam de propor mudanças
            legislativas voltadas à redução destes direitos, e até mesmo do
            Poder Judiciário, que não raro decide as demandas trabalhistas
            fortemente influenciado pelo poder econômico.
          </p>

          <p>
            Nossa atuação, assim, está voltada à proteção dos direitos dos
            trabalhadores do setor privado, à regulamentação de direitos ainda
            pendentes desta providência, e à ampliação destes direitos, tendo
            por norte os direitos humanos e as convenções internacionais do
            trabalho.
          </p>
        </HTMLContent>
      </Section>

      <Section title="Direitos das relações celetistas de trabalho" textual>
        <HTMLContent>
          <p>
            O primeiro problema que geralmente surge das relações de trabalho no
            setor privado diz respeito à própria formalização desta relação,
            consistente no ato de assinar a Carteira de Trabalho.
          </p>

          <p>
            Superado este problema inicial, diversos outros surgem, como
            assegurar o recolhimento das contribuições previdenciárias devidas
            por empregados e empregadores ao INSS; assegurar o recolhimento das
            contribuições devidas pelos empregadores ao FGTS; garantir o
            pagamento de direitos como o 13º salário, o adicional de férias, os
            adicionais de insalubridade ou periculosidade, quando for o caso;
            assegurar o respeito às Convenções ou Acordos Coletivos de Trabalho,
            em especial das cláusulas que defiram direitos aos trabalhadores;
            dentre tantos outros problemas típicos da relação celetista de
            trabalho.
          </p>

          <h3>O que fazemos:</h3>

          <ul>
            <li>
              Ajuizamos ações judiciais visando o reconhecimento de vínculo
              empregatício entre o trabalhador e o respectivo empregador, com as
              consequências daí decorrentes no pagamento dos direitos
              trabalhistas de maneira geral,
            </li>

            <li>
              Ajuizamos ações judiciais visando assegurar o respeito dos
              empregadores aos direitos previstos na CLT, ou a cobrar as
              correspondentes verbas sonegadas durante o contrato de trabalho,
              quando estes direitos são desrespeitados, por exemplo: horas
              extras, intervalos para descanso e alimentação, adicionais,
              diferenças salariais por desvio ou acúmulo de função, férias,
              gratificação natalina, adicional de insalubridade ou
              periculosidade, comissões, entre outros;
            </li>

            <li>
              Ajuizamos ações judiciais visando impor ao empregador o respeito
              às normas que visam a preservação da saúde do trabalhador e
              condições seguras de trabalho, bem como de cobrança das
              indenizações decorrentes de acidentes do trabalho ou das más
              condições de trabalho, como indenização por danos morais e
              estéticos, danos materiais como ressarcimento de despesas médicas
              e pensionamento vitalício destinado a compensar a redução ou perda
              da capacidade de trabalho do empregado;
            </li>

            <li>
              Ajuizamos ações visando a preservação da integridade moral do
              trabalhador e a cobrança de indenização por danos morais
              decorrentes de atos lesivos à honra ou à imagem do trabalhador,
              atos de assédio moral;
            </li>

            <li>
              Analisamos as rescisões dos contratos de trabalho, verificando se
              todos os direitos trabalhistas foram respeitados, a existência de
              causas impeditivas da rescisão do contrato de trabalho, como
              estabilidade da gestante, estabilidade do dirigente sindical,
              estabilidade posterior ao gozo de benefício previdenciário
              acidentário, do membro da CIPA, do trabalhador que está prestes a
              contemplar os requisitos para concessão da aposentadoria, ainda
              verificamos se os prazos para pagamento das verbas rescisórias
              foram respeitados, se as verbas rescisórias devidas foram pagas,
              entre as quais aviso-prévio indenizado, férias vencidas e
              proporcionais, gratificação natalina, média de horas extras,
              multas sobre o saldo do fundo de garantia e se os valores pagos
              estão corretos;
            </li>

            <li>
              Assessoramos as entidades sindicais na luta pela manutenção dos
              direitos previstos na CLT e sua ampliação.
            </li>
          </ul>
        </HTMLContent>
      </Section>
    </main>
  </Page>
)

export default withGraphQL(StaticPage)
