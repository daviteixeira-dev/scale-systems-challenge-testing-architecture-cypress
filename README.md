# 🚀 Scale Systems Challenge: Testing Architecture with Cypress

Este repositório contém a solução completa para o desafio técnico de automação e engenharia de qualidade da **X2 Eventos**. O projeto consiste na validação, análise de negócio e estruturação da suíte de testes para a nova plataforma interna de gerenciamento automatizado de workshops.

---

## 📸 Visão Geral da Plataforma

Abaixo está o layout atualizado da tela de cadastro de participantes avaliada neste projeto:

![Tela de Cadastro de Workshops](./docs/images/x2-ventos-tela-de-cadastro-workshop.PNG)

---

## 🎯 Contexto do Desafio & História de Usuário

**Título:** Gerenciamento de Inscrições para Eventos
> **Eu como** um organizador de eventos  
> **Preciso** adicionar um novo participante a um evento existente através de um formulário e gerenciar a lista de inscritos  
> **Para que** eu possa manter o controle do número de participantes e garantir uma comunicação eficaz com eles.

### 📋 Critérios de Aceite Originais (AC)

| ID | Critério | Regra de Negócio Detalhada |
| :--- | :--- | :--- |
| **AC1** | **Formulário de Inscrição** | Apresentar campos na tela de detalhes: Nome Completo (Obrigatório), E-mail (Obrigatório) e Telefone com DDD (Opcional). |
| **AC2** | **Validação dos Campos** | Botão "Inscrever" só habilita se os campos obrigatórios estiverem preenchidos. Validação de Regex para e-mail padrão. Nome não deve aceitar caracteres especiais ou números. |
| **AC3** | **Limite de Vagas** | Bloquear inscrições se o limite do evento for atingido. Exibir mensagem em tela: `"Vagas esgotadas!"`. |
| **AC4** | **Confirmação de Inscrição** | Exibir feedback visual: `"Inscrição realizada com sucesso!"`. Limpar o formulário imediatamente após o envio. |
| **AC5** | **Atualização da Lista** | A listagem de participantes deve reagir em tempo real, renderizando o nome e e-mail do novo inscrito. |
| **AC6** | **E-mail de Confirmação** | Disparar um e-mail de confirmação automático para o endereço de e-mail informado pelo participante. |
| **AC7** | **Remoção de Participante** | Exibir botão "Remover" (lixeira) ao lado de cada inscrito. Ao clicar, o participante é removido e a contagem de vagas do evento é atualizada. |

---

## 🗂️ Documentação Estratégica da Entrega

Toda a análise de qualidade, especificação técnica e mapeamento de riscos foram centralizados na pasta `/docs` seguindo as melhores práticas do mercado (como a norma ISO 29119-3). Clique nos links abaixo para auditar cada artefato:

1. 🧠 **[Análise Heurística & Crítica (SFDPOT)](https://github.com/daviteixeira-dev/scale-systems-challenge-testing-architecture-cypress/blob/main/docs/specs/test_analysis_heuristics.md)**: Investigação profunda baseada no modelo de James Bach. Contém o mapeamento de limites físicos, matriz *"E se...?"* de exceções, e a revisão de acessibilidade para operações no mundo real.
2. 📝 **[Plano de Testes de Software (ISO 29119-3)](https://github.com/daviteixeira-dev/scale-systems-challenge-testing-architecture-cypress/blob/main/docs/specs/test_plan.md)**: Definição formal do escopo, matriz de riscos técnicos do negócio (Foco em *Overbooking* e integridade), além das travas de qualidade (*Quality Gates*).
3. 🥒 **[Especificação de Casos de Teste (BDD / Gherkin)](https://github.com/daviteixeira-dev/scale-systems-challenge-testing-architecture-cypress/blob/main/docs/specs/test_specification.md)**: Mapeamento detalhado dos cenários de teste traduzidos em sintaxe Gherkin. Cobre desde o caminho feliz até comportamentos de resiliência de layout (*text truncation*).
4. 🐛 **[Relatório de Bugs & Insights Arquiteturais](https://github.com/daviteixeira-dev/scale-systems-challenge-testing-architecture-cypress/blob/main/docs/specs/bug_report_insights.md)**: Registro formal de defeitos críticos encontrados (incluindo o erro de lógica inversa do AC7 e inconsistência visual do contador) com sugestões de engenharia (*Debounce* e *Optimistic Updates*).

*O documento original com as diretrizes do processo seletivo encontra-se arquivado localmente em: [Processo Seletivo QA - Desafio Técnico.pdf](https://github.com/daviteixeira-dev/scale-systems-challenge-testing-architecture-cypress/blob/main/docs/Processo%20seletivo%20QA%20-%20Desafio%20T%C3%A9cnico.pdf).*

---

## 🛠️ Guia de Configuração e Execução do Projeto

Siga o passo a passo abaixo para preparar o ambiente e rodar a suíte de testes automatizados localmente em qualquer computador.

### 1. Pré-requisitos (Instalação do Node.js)
O Cypress necessita do ambiente **Node.js** para gerenciar dependências e executar.
* Abra o seu terminal e verifique se já possui o Node instalado digitando: `node -v`.
* Caso o comando não seja reconhecido, faça o download da versão estável **LTS** no site oficial [nodejs.org](https://nodejs.org) e instale-a seguindo o instalador padrão. Reinicie o seu terminal após a conclusão.

### 2. Clonando o Repositório
No terminal, faça o clone deste projeto para a sua máquina local e acesse a pasta raiz:
```bash
git clone https://github.com/daviteixeira-dev/scale-systems-challenge-testing-architecture-cypress.git
cd scale-systems-challenge-testing-architecture-cypress
```

### 3. Instalando as Dependências
Com o ambiente acessado, baixe o framework Cypress e todas as configurações necessárias através do gerenciador de pacotes padrão (NPM):
```bash
npm install
```

### 4. Executando a Suíte de Testes Automatizados

Como a aplicação real ainda não possui um servidor frontend ativo, os testes foram desenvolvidos utilizando uma estratégia arquitetural avançada de **Injeção de Interface em Memória Dinâmica**. Desse modo, o Cypress renderiza o escopo visual e intercepta as chamadas HTTP (Mocks/Spy) sem a necessidade de servidores web adicionais.

Você pode executar os testes de duas maneiras:

#### Opção A: Interface Gráfica Interativa (Recomendado)
Para abrir o painel interativo do Cypress e acompanhar as asserções visualmente:
```bash
npx cypress open
```
1. No painel que se abrirá, clique em **E2E Testing**.
2. Selecione o navegador de sua preferência (ex: Chrome ou Electron) e clique em **Start E2E Testing**.
3. Na lista de especificações, clique sobre o arquivo **`cadastro_workshop.cy.js`** para assistir à execução dos 7 cenários em tempo real.

#### Opção B: Modo Headless (Execução rápida em terminal)
Para rodar os testes direto no terminal (ideal para esteiras de Integração Contínua / CI/CD):
```bash
npx cypress run
```

## 🏁 Conclusão & Práticas de Engenharia Aplicadas

Este projeto foi desenvolvido aplicando metodologias modernas de Engenharia de Qualidade e Testes de Software Orientados ao Contexto, indo muito além da escrita mecânica de scripts de automação.

### 💡 Principais Diferenciais Desta Entrega:
*   **Abordagem Shift-Left Testing:** Análise estática dos requisitos realizada antes da codificação, permitindo identificar e documentar falhas lógicas críticas (como a inversão da regra do AC7 e ambiguidade no display de vagas) de forma proativa.
*   **Estratégia de UI In-Memory TDD:** Arquitetura de automação inovadora desenvolvida sem dependência de um servidor frontend ativo. A injeção dinâmica de componentes HTML em memória simula perfeitamente o comportamento reativo da aplicação real.
*   **Isolamento Absoluto de Testes (Mocking/Spying):** interceptação de chamadas de API (`cy.intercept`) e implementação de *Window Spies* para validar a integridade de payloads enviados a microsserviços externos de e-mail de forma confiável e resiliente.
*   **Padrões Profissionais de Mercado:** Toda a documentação estratégica foi estruturada em total conformidade com as diretrizes internacionais da norma **ISO/IEC/IEEE 29119-3**, utilizando histórico de versionamento com **Commits Semânticos**.

---
*Desafio concluído com sucesso e pronto para avaliação. Sinta-se à vontade para explorar os artefatos técnicos na pasta `/docs` e executar a suíte Cypress localmente!*
