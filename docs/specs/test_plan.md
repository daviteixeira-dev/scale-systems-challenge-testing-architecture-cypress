# Plano de Testes de Software - Projeto X2 Eventos
## Em conformidade com a Norma ISO/IEC/IEEE 29119-3

### 1. Introdução e Contexto do Projeto
A X2 Eventos migrará seu gerenciamento manual de workshops para um sistema interno automatizado. Este documento estabelece a estratégia de garantia de qualidade para validar o formulário de inscrição, as regras de validação de dados, a concorrência do limite de vagas e o gerenciamento da lista em tempo real.

### 2. Escopo do Teste (Features Ofertadas)
*   **Em Escopo (A automatizar nesta suíte com Cypress):**
    *   Validação estrutural do formulário de inscrição (campos obrigatórios e opcionais).
    *   Regras de negócio de validação de inputs (Regex para E-mail e Nome Completo).
    *   Controle rígido do limite máximo de vagas (bloqueio e mensagem de esgotado).
    *   Ciclo de sucesso: persistência, limpeza de campos e reatividade da lista.
    *   Fluxo de remoção de participantes e reajuste dinâmico do saldo de vagas.
*   **Fora do Escopo:**
    *   Serviço de envio físico de e-mails (SMTP real - será validado via interceptação ou mock).

### 3. Matriz de Análise de Risco Técnico (Foco de Negócio)

| Identificador | Risco Mapeado | Impacto | Probabilidade | Estratégia de Mitigação no QA |
| :--- | :--- | :---: | :---: | :--- |
| **R-01** | *Overbooking* (Inscrições duplicadas em milissegundos excedendo o limite de 50 vagas). | Alto | Alta | Testes de estresse/concorrência simulados via automação para avaliar comportamento do estado da aplicação. |
| **R-02** | Injeção de caracteres inválidos ou scripts maliciosos no campo Nome Completo. | Médio | Média | Testes negativos utilizando tabelas de decisão com payloads numéricos e caracteres especiais. |
| **R-03** | Dessincronização do saldo de vagas visível na tela após remoções sequenciais de participantes. | Alto | Média | Automação de exclusões e asserção matemática da string de contador (`Vagas: X/50`). |

### 4. Critérios de Aceite e Conclusão (Quality Gates)
*   **Critério de Entrada:** Interface web da aplicação X2 Eventos disponível e acessível em ambiente local ou de staging.
*   **Critério de Saída (Sucesso):** 100% dos testes ponta a ponta (E2E) passando com zero regressões. Bloqueio estrito de requisições de inscrição quando o contador atingir o teto limite.
