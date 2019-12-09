import React from 'react'
import { withGraphQL } from '~api'
import { Page } from '~app/components/Page'
import { map as expertises, Expertise } from '~modules/expertise'
import { Heading, HTMLContent } from '~design'
import { Section } from '~app/components/Section'

const expertise = expertises[Expertise.Civil]

const StaticPage = () => (
  <Page>
    <div className="bg-reverse text-white py-8">
      <Heading noMargins>{expertise.label}</Heading>
    </div>

    <main>
      <Section>
        <HTMLContent>
          <p>
            Nosso Escritório atende também na área do Direito Civil, em especial
            nas áreas do Direito de Família, Sucessões, e Direito Imobiliário,
            atuando em processos judiciais e extrajudiciais, de acordo com as
            necessidades de cada cliente, incluindo a advocacia preventiva, cuja
            prática, sem dúvida, evita a equivocada cultura do litígio e as
            consequências de uma longa e onerosa batalha judicial.
          </p>
          <p>
            O Direito Civil é o ramo do direito privado que trata do conjunto de
            normas jurídicas reguladoras das relações jurídicas entre as
            pessoas, antes mesmo do seu nascimento, até após o óbito, envolvendo
            os direitos e as obrigações a elas inerentes, tais como o direito ao
            nome, o direito a realizar contratos, o direito às relações
            familiares e à sucessão.
          </p>
        </HTMLContent>
      </Section>

      <Section title="Direito de Família" textual className="bg-aside">
        <HTMLContent>
          <p>
            É um ramo do direito privado que regula a celebração do casamento e
            da união estável, estabelecendo a sua validade e os desdobramentos
            resultantes destes institutos; as relações pessoais entre cônjuges,
            companheiros, seus efeitos patrimoniais e as formas de sua extinção;
            as relações de parentesco entre pais e filhos, bem como os
            institutos da tutela e curatela.
          </p>
          <h3>O que fazemos:</h3>
          <ul>
            <li>
              Orientamos os cônjuges e companheiros no planejamento do regime de
              bens a ser adotado no casamento ou na união estável;
            </li>
            <li>
              Ajuizamos ações de separação de corpos nas situações em que o
              afastamento do lar de um dos cônjuges ou dos companheiros se fizer
              necessário;
            </li>
            <li>Ajuizamos ação de separação consensual ou litigiosa;</li>
            <li>
              Ingressamos com pedido de escritura pública de separação
              &nbsp;extrajudicial, a ser feita em cartório nas situações em que
              for permitido;
            </li>
            <li>Ajuizamos ação de divórcio consensual ou litigioso;</li>
            <li>
              Ingressamos com pedido de escritura pública de divórcio
              &nbsp;extrajudicial, a ser feito em cartório nas situações em que
              for permitido;
            </li>
            <li>
              Ajuizamos ação de reconhecimento e dissolução de união estável
              consensual ou litigiosa;
            </li>
            <li>
              Ingressamos com pedido de escritura pública de reconhecimento e
              dissolução de união estável extrajudicial, a ser feita em
              cartório, nas situações em que for permitido;
            </li>
            <li>
              Ajuizamos ação de exoneração de pensão alimentícia nas situações
              em que o alimentante não mais necessite prestar alimentos ao
              alimentado;
            </li>
            <li>
              Ajuizamos ação de interdição, requerendo a tutela ou curatela nas
              situações em que a pessoa necessite ser interditada por não reunir
              condições de administrar seus atos da vida civil.
            </li>
          </ul>
        </HTMLContent>
      </Section>

      <Section title="Direito das Sucessões" textual>
        <HTMLContent>
          <p>
            É um ramo do direito privado que regula a transferência do
            patrimônio (ativo e passivo – créditos e débitos) de alguém depois
            de sua morte, em virtude da lei (sucessão legítima) ou testamento
            (sucessão testamentária).
          </p>
          <h3>O que fazemos:</h3>
          <ul>
            <li>
              Orientamos o planejamento sucessório, a fim de que, por meio de
              testamento ou doação, não haja litígio entre os herdeiros no
              momento da partilha dos bens deixados pelo falecido;
            </li>
            <li>
              Ajuizamos ações de inventário, pedidos de alvará judicial e ainda
              ingressamos com pedido nos autos para habilitações de herdeiros;
            </li>
            <li>
              Ingressamos com pedido de escritura pública de inventário, a ser
              feita em cartório, nas situações em que for permitido.
            </li>
          </ul>
        </HTMLContent>
      </Section>

      <Section title="Direito Imobiliário" textual className="bg-aside">
        <HTMLContent>
          <p>
            É o ramo do direito privado que trata de vários aspectos
            patrimoniais, tais como a locação (aluguel), compra e venda de
            imóveis, as diversas espécies de contratos, a posse e a propriedade
            de imóveis, inclusive o usucapião etc.
          </p>
          <h3>O que fazemos:</h3>
          <ul>
            <li>
              Prestamos assessoria em contratos de compra e venda de imóvel,
              tanto na elaboração, como na confecção de escrituras públicas;
            </li>
            <li>
              Prestamos assessoria na locação de imóvel, seja na parte
              preventiva, como no ajuizamento de ações pertinentes à relação
              entre locador, inquilino e fiador, quais sejam: ações de despejo,
              ação revisional de aluguel, ação renovatória de locação, ação de
              consignação, execução de encargos da locação, notificação judicial
              e extrajudicial etc.;
            </li>
            <li>Ajuizamos ação de usucapião;</li>
            <li>
              Ingressamos com pedido de usucapião, a ser feito pela via
              extrajudicial, &nbsp;em cartório, nas situações em que for
              permitido.
            </li>
          </ul>
        </HTMLContent>
      </Section>

      <Section title="Direito Registral e Notarial" textual>
        <HTMLContent>
          <p>
            É um ramo do direito público, cujas normas têm a finalidade de dar
            publicidade, autenticidade, segurança e eficácia aos atos jurídicos,
            tratando dos mais importantes e significativos atos praticados na
            órbita civil, seja na vida de pessoas físicas, seja na existência de
            pessoas jurídicas, como por exemplo: nascimento, emancipação,
            casamento, separação, divórcio, óbito, compra, venda e financiamento
            de imóveis etc.
          </p>
          <h3>O que fazemos:</h3>
          <ul>
            <li>
              Providenciamos o pedido de retificação de certidões de nascimento,
              casamento e óbito nas situações em houver equívoco no lançamento
              de dados nesses documentos;
            </li>
            <li>
              Ingressamos com ação de retificação do nome nas situações em que
              se fizer necessária a alteração;
            </li>
            <li>
              Assessoramos na elaboração de ata notarial, que consiste em
              documento com fé pública, feito por tabelião, destinado a
              registrar fato jurídico, por ele constatado, &nbsp;visando
              tornar-se meio de prova, nas situações em que esta se fizer
              necessária para salvaguardar direitos da parte interessada, em
              eventuais litígios;
            </li>
            <li>
              Providenciamos a averbação de pendência judicial na matrícula do
              imóvel.
            </li>
          </ul>
        </HTMLContent>
      </Section>

      <Section title="Responsabilidade Civil" textual className="bg-aside">
        <HTMLContent>
          <p>
            Área do Direito Civil que visa à reparação de um dano causado à
            vítima, que pode ser de ordem material ou imaterial.
          </p>
          <h3>O que fazemos:</h3>
          <ul>
            <li>Ingressamos com ação de dano moral por acidente;</li>
            <li>Ingressamos com ação de dano moral por morte.</li>
          </ul>
          <h2>Demais questões do Direito Civil</h2>
          <p>
            Considerando a amplitude da área do Direito Civil, &nbsp;outros
            assuntos poderão ser contratados, mediante consulta prévia acerca do
            tema.
          </p>
        </HTMLContent>
      </Section>
    </main>
  </Page>
)

export default withGraphQL(StaticPage)
