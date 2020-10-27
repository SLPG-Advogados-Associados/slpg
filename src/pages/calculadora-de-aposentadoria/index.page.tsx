import React from 'react'
import qs from 'qs'
import { useRouter } from 'next/router'
import { useFieldArray, FormProvider } from 'react-hook-form'
import { Heading, Button, Icons } from '~design'
import { Input, FieldWrapper } from '~modules/form'
import { Calculator } from '~modules/retirenment'
import { Page } from '~app/components/Page'
import { Section } from '~app/components/Section'
import { useConfirmUnload } from '~app/hooks/useConfirmUnload'

const meta = {
  title: 'Calculadora de Aposentadoria',
  description: 'Estude aqui suas possibilidades de aposentadoria',
}

const CalculatorFormPage = () => {
  const router = useRouter()
  const form = Calculator.useCalculatorForm()

  // block leaving in case form is modified
  useConfirmUnload(() => form.formState.isDirty, [form.formState.isDirty])

  const onSubmit = form.handleSubmit((values) => {
    router.push({
      pathname: '/calculadora-de-aposentadoria/resultado',
      query: {
        input: encodeURIComponent(
          qs.stringify(values, { encodeValuesOnly: true })
        ),
      },
    })
  })

  const contributions = useFieldArray({
    control: form.control,
    name: 'contributions',
  })

  if (contributions.fields.length === 0) {
    contributions.append({})
  }

  const titles = contributions.fields.map((_, index) =>
    form.watch(`contributions[${index}].service.title`, [])
  )

  return (
    <Page meta={meta}>
      <div className="bg-reverse text-white py-8">
        <Heading noMargins>Calculadora de Aposentadoria</Heading>
      </div>
      <FormProvider {...form}>
        <form onSubmit={onSubmit}>
          <main>
            <Section title="Dados pessoais" className="bg-aside" textual>
              <FieldWrapper
                name="sex"
                className="flex flex-col"
                wrapper="div"
                label="Sexo:"
              >
                <label className="cursor-pointer">
                  <input
                    name="sex"
                    type="radio"
                    value={Calculator.Sex.MALE}
                    className="mr-2"
                    ref={form.register}
                  />
                  Masculino
                </label>

                <label className="cursor-pointer">
                  <input
                    name="sex"
                    type="radio"
                    value={Calculator.Sex.FEMALE}
                    className="mr-2"
                    ref={form.register}
                  />
                  Feminino
                </label>

                {/* <ErrorMessage {...form.fields.sex.meta} /> */}
              </FieldWrapper>

              <FieldWrapper name="birthDate" label="Data de nascimento:">
                <Input
                  name="birthDate"
                  type="date"
                  placeholder="dd/mm/aaaa"
                  ref={form.register}
                />
              </FieldWrapper>
            </Section>

            <Section title="Contribuições" textual>
              {contributions.fields.map(({ id }, index) => (
                <fieldset
                  key={id}
                  className="border-l-4 border-divisor bg-aside p-8 mb-4 relative"
                >
                  <legend>{titles[index] || 'Sem título'}</legend>

                  <Icons.X
                    className="absolute top-0 right-0 mt-5 mr-2 opacity-50 hover:opacity-100 cursor-pointer"
                    onClick={() => contributions.remove(index)}
                  />

                  <div className="flex">
                    <FieldWrapper
                      name={`contributions[${index}].start`}
                      label="Início:"
                      className="flex-grow-0"
                    >
                      <Input
                        name={`contributions[${index}].start`}
                        type="date"
                        placeholder="dd/mm/aaaa"
                        ref={form.register()}
                      />
                    </FieldWrapper>

                    <FieldWrapper
                      name={`contributions[${index}].end`}
                      label="Fim:"
                      className="ml-8 flex-grow-0"
                    >
                      <Input
                        name={`contributions[${index}].end`}
                        type="date"
                        placeholder="dd/mm/aaaa"
                        ref={form.register()}
                      />
                    </FieldWrapper>

                    <FieldWrapper
                      label="Título"
                      className="block flex-grow ml-8"
                    >
                      <Input
                        name={`contributions[${index}].service.title`}
                        ref={form.register()}
                      />
                    </FieldWrapper>

                    <FieldWrapper
                      name={`contributions[${index}].service.kind`}
                      className="flex flex-col ml-8 flex-grow-0"
                      wrapper="div"
                      label="Setor:"
                    >
                      {Object.values(Calculator.ServiceKind).map((kind) => (
                        <label key={kind} className="cursor-pointer">
                          <input
                            name={`contributions[${index}].service.kind`}
                            type="radio"
                            value={kind}
                            className="mr-2"
                            ref={form.register()}
                          />
                          {kind}
                        </label>
                      ))}
                    </FieldWrapper>

                    <FieldWrapper
                      name={`contributions[${index}].service.post`}
                      className="flex flex-col ml-8 flex-grow-0"
                      wrapper="div"
                      label="Cargo:"
                    >
                      {Object.values(Calculator.Post).map((post) => (
                        <label key={post} className="cursor-pointer">
                          <input
                            name={`contributions[${index}].service.post`}
                            type="radio"
                            value={post}
                            className="mr-2"
                            ref={form.register()}
                          />
                          {post}
                        </label>
                      ))}
                    </FieldWrapper>

                    <FieldWrapper
                      label="Carreira"
                      className="ml-8 flex-grow-0 w-20"
                    >
                      <Input
                        name={`contributions[${index}].service.career`}
                        type="number"
                        min={1}
                        defaultValue={1}
                        ref={form.register()}
                      />
                    </FieldWrapper>
                  </div>
                </fieldset>
              ))}

              <Button
                small
                secondary
                type="button"
                onClick={() => contributions.append({})}
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
      </FormProvider>{' '}
    </Page>
  )
}

export default CalculatorFormPage
