import React from 'react'
import { hot } from 'react-hot-loader/root'
import { Heading, Button } from '~design'
import { Input, FieldWrapper, ErrorMessage } from '~modules/form'
import { Calculator } from '~modules/retirenment'
import { Section } from '~app/components/Section'
import { Page } from '~app/components/Page'

const meta = {
  title: 'Calculadora de Aposentadoria',
  description: 'Estude aqui suas possibilidades de aposentadoria',
}

const CalculatorPage = () => {
  const form = Calculator.useCalculatorForm()

  const onSubmit = form.handleSubmit(values => {
    // eslint-disable-next-line
    console.log({ values })
  })

  return (
    <Page off={{ contactCTA: true }} meta={meta}>
      <div className="bg-reverse text-white py-8">
        <Heading noMargins>Calculadora de Aposentadoria</Heading>
      </div>

      <form onSubmit={onSubmit}>
        <main>
          <Section title="Dados pessoais" className="bg-aside" textual>
            <FieldWrapper className="flex flex-col" wrapper="div" label="Sexo:">
              <label className="cursor-pointer">
                <input
                  type="radio"
                  value={Calculator.Gender.MALE}
                  className="mr-2"
                  {...form.fields.gender.input}
                />
                Masculino
              </label>

              <label className="cursor-pointer">
                <input
                  type="radio"
                  value={Calculator.Gender.FEMALE}
                  className="mr-2"
                  {...form.fields.gender.input}
                />
                Feminino
              </label>

              <ErrorMessage {...form.fields.gender.meta} />
            </FieldWrapper>

            <FieldWrapper
              {...form.fields.birthDate.meta}
              label="Data de nascimento:"
            >
              <Input
                {...form.fields.birthDate.input}
                placeholder="dd/mm/aaaa"
              />
            </FieldWrapper>
          </Section>

          <Section title="Contribuições" textual>
            {form.fields.contributions.items.map(({ item, field }, index) => (
              <fieldset
                key={item.id}
                className="border-l-4 border-divisor bg-aside p-8 mb-4"
              >
                <legend>
                  {form.fields.contributions.value?.[index]?.service.title ||
                    'Sem título'}
                </legend>

                <div className="flex">
                  <FieldWrapper {...field.start.meta} label="Início:">
                    <Input {...field.start.input} placeholder="dd/mm/aaaa" />
                  </FieldWrapper>

                  <FieldWrapper
                    {...field.end.meta}
                    label="Fim:"
                    className="ml-8"
                  >
                    <Input {...field.end.input} placeholder="dd/mm/aaaa" />
                  </FieldWrapper>

                  <FieldWrapper
                    {...field.service.title.meta}
                    label="Título"
                    className="block flex-grow ml-8"
                  >
                    <Input {...field.service.title.input} />
                  </FieldWrapper>

                  <FieldWrapper
                    className="flex flex-col ml-8"
                    wrapper="div"
                    label="Setor:"
                  >
                    {Object.values(Calculator.ServiceKind).map(kind => (
                      <label key={kind} className="cursor-pointer">
                        <input
                          type="radio"
                          value={kind}
                          className="mr-2"
                          {...field.service.kind.input}
                        />
                        {kind}
                      </label>
                    ))}

                    <ErrorMessage {...field.service.kind.meta} />
                  </FieldWrapper>

                  <FieldWrapper
                    className="flex flex-col ml-8"
                    wrapper="div"
                    label="Cargo:"
                  >
                    {Object.values(Calculator.Post).map(post => (
                      <label key={post} className="cursor-pointer">
                        <input
                          type="radio"
                          value={post}
                          className="mr-2"
                          {...field.service.post.input}
                        />
                        {post}
                      </label>
                    ))}

                    <ErrorMessage {...field.service.post.meta} />
                  </FieldWrapper>
                </div>
              </fieldset>
            ))}

            <Button
              small
              secondary
              type="button"
              onClick={() => form.fields.contributions.append({})}
            >
              Adicionar período
            </Button>
          </Section>

          <Section textual className="bg-aside">
            <Button
              type="submit"
              className="w-full justify-center"
              disabled={form.formState.isSubmitting}
              loading={form.formState.isSubmitting}
              children="Enviar"
            />
          </Section>
        </main>
      </form>
    </Page>
  )
}

export default hot(CalculatorPage)
