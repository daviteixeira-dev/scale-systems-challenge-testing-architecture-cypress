# Análise Crítica e Heurísticas de Teste - X2 Eventos
## Abordagem de Investigação Sistemática e Espírito Exploratório

### 1. Aplicação de Heurísticas de Teste (Baseado em James Bach / SFDPOT)
Para explorar o sistema além dos requisitos, apliquei as seguintes heurísticas de teste adaptadas para o contexto do gerenciamento de workshops:

* **Estrutura (Structure):** Investigar os limites físicos da interface. O que acontece se o nome do participante tiver 200 caracteres? A interface quebra o layout (*UI overflow*) ou trunca o texto com reticências? Como as caixas da lista se comportam com nomes de comprimentos muito diferentes?
* **Função (Function):** O que o sistema *não deve* fazer. O formulário não deve processar envios se o botão for clicado via teclado (Enter) estando inválido. A lista não deve perder os dados se a página sofrer um *refresh* acidental (F5) caso os dados dependam apenas de estado em memória local.
* **Dados (Data):** Exploração de tipos primitivos e limites. Injeção de caracteres especiais no e-mail (ex: `usuario+teste@dominio.com` que é um e-mail válido, ou `test@domain..com` que é inválido). Validação de números de telefone com menos de 10 dígitos.
* **Plataforma (Platform):** Comportamento responsivo. Como o formulário e a lista de participantes se comportam em telas mobile (iPhone/Android/Tablets)? O layout se ajusta dinamicamente mudando de duas colunas para uma coluna vertical para evitar quebra de componentes? O botão "Remover" continua acessível ou sofre problemas de *misclick*?
* **Operações (Operations):** Foco na usabilidade do Organizador. Investigar a navegação via teclado (acessibilidade com Tab/Enter) para preenchimento rápido de múltiplos participantes. Avaliar o comportamento do contraste visual do Modo Escuro (*Dark Mode*) fixo quando o sistema for operado em tablets sob luz solar direta na portaria do evento.
* **Tempo (Time):** Testar a concorrência temporal e concorrência de estado. O que acontece se a página ficar aberta por longo período? Há sincronização assíncrona (real-time) da listagem se outro organizador remover ou adicionar participantes em outro navegador?

---

### 2. Matriz "O que aconteceria se...?" (Cenários de Exceção e Limites)

| Cenário de Pergunta ("E se...?") | Impacto no Sistema | Comportamento Esperado (O que DEVE fazer) | Comportamento Impeditivo (O que NÃO DEVE fazer) |
| :--- | :---: | :--- | :--- |
| **...dois usuários clicarem em "Inscrever" ao mesmo tempo restando 1 vaga?** | Crítico | O sistema deve processar a primeira requisição que chegou ao servidor, alocar a vaga 50/50 e retornar erro amigável de "Vagas esgotadas" para o segundo usuário. | **Não deve** permitir *overbooking* (ex: registrar 51 pessoas) e nem corromper o contador visual exibindo números negativos ou acima de 50. |
| **...o organizador inserir um e-mail idêntico para dois participantes diferentes?** | Médio | O sistema deve rejeitar o segundo cadastro informando "Este e-mail já está inscrito neste workshop" (Garantia de unicidade). | **Não deve** aceitar cadastros duplicados que invalidem o envio posterior de certificados individuais ou comunicações. |
| **...o campo de telefone receber caracteres alfabéticos (letras/símbolos)?** | Baixo | O sistema deve higienizar o input (*sanitize*) em tempo real, permitindo que apenas dígitos numéricos sejam digitados ou colados (Ctrl+V). | **Não deve** enviar letras para o backend e nem mascarar o campo de forma incorreta inviabilizando o contato. |
| **...o botão "Remover" for clicado consecutivamente de forma muito rápida?** | Médio | O sistema deve desabilitar o botão no primeiro clique, processar a exclusão e atualizar o estado da lista uma única vez. | **Não deve** disparar múltiplas requisições de exclusão para o mesmo ID, o que geraria erros de "Elemento não encontrado" (HTTP 404). |

---

### 3. Revisão Crítica de Regras de Negócio (Incoerências Encontradas)

Durante a análise estática dos Critérios de Aceite (AC), identifiquei uma falha grave de lógica no documento original:

*   **Incoerência no AC7 (Remoção de Participante):** O texto original afirma que ao remover um participante, *"a contagem de vagas do workshop correspondente deve ser diminuída em 1"*. 
    *   **Correção Crítica:** Se a contagem de vagas totais ou ocupadas for diminuída, o sistema estará reduzindo a capacidade do evento ou indicando que há menos pessoas de forma errônea. O comportamento logicamente correto para a regra de negócio é: **Aumentar em 1 as vagas disponíveis** (liberando espaço para novos inscritos) ou **Diminuir em 1 a contagem de vagas ocupadas**.

*   **Incoerência Visual no Contador de Vagas:** A label exibe `Vagas: 47/50`, porém a listagem exibe apenas 3 participantes cadastrados. A semântica do contador está confusa: ele deveria representar "Vagas Restantes" (47 disponíveis) ou "Vagas Ocupadas" (3/50). Exibir `47/50` ao lado de uma lista com 3 itens gera ambiguidade cognitiva para o organizador.

* **Campos Opcionais vs Obrigatórios:** O campo Telefone diz `(Opcional)`. O sistema precisa validar estritamente a obrigatoriedade dos campos Nome e E-mail, impedindo que o formulário seja enviado em branco ou apenas com espaços vazios (*whitespace*).

* **Máscara de Input de Telefone:** O placeholder mostra `11987654321` (formato com 11 dígitos - celular). É preciso garantir que o sistema aceite também telefones fixos de 10 dígitos (ex: `1133221100`) sem quebrar a validação ou rejeitar o input.

* **Bug de Alinhamento por Tamanho de String:** No design atual da Lista de Inscritos, o botão de exclusão (lixeira) fica desalinhado horizontalmente em relação aos outros cartões devido ao tamanho do nome do usuário (ex: o nome "Ricardo Martins de Souza" empurra o botão para a extremidade oposta de forma inconsistente com os nomes menores superiores).

---

### 4. Sugestões de Melhorias para UX/UI e Acessibilidade (Garantia de Qualidade Proativa)
1.  **Modal de Confirmação de Exclusão:** Evitar ações destrutivas acidentais. Ao clicar em remover, exibir: *"Deseja realmente remover o participante X do workshop?"*.
2.  **Estado Desabilitado Pós-Lotação:** Quando o contador atingir `50/50`, aplicar o atributo `disabled` em todos os inputs e no botão, mudando a cor do formulário para um estado legível de "Inscrições Encerradas".
3.  **Feedback Visual de Carregamento (Spinner):** Exibir um estado de *loading* no botão "Inscrever" para dar feedback assíncrono ao usuário e evitar cliques duplos por ansiedade.
4.  **Indicação Clara de Campos Obrigatórios:** Adicionar um asterisco (`*`) nos campos "Nome Completo" e "E-mail" para diferenciar visualmente do campo "Telefone", que já possui a marcação de opcional.
5.  **Tratamento de Texto Extenso (*Text Truncation*):** Aplicar limites de exibição de caracteres nos cartões da lista de inscritos utilizando propriedades CSS (como `text-overflow: ellipsis`). Isso garante que os botões de exclusão fiquem perfeitamente alinhados verticalmente na mesma linha da grade, independente do tamanho do nome do participante.
6.  **Alternância de Tema (Light/Dark Mode Toggle):** Implementar um botão para alternar entre modo claro e escuro. Isso garante a acessibilidade visual e legibilidade caso o organizador precise utilizar o sistema em dispositivos móveis (como tablets) sob luz solar intensa na recepção do evento.
7.  **Disparo Assíncrono de E-mail de Confirmação (Notificação):** Assim que a inscrição for processada com sucesso no backend, o sistema deve disparar automaticamente um e-mail de confirmação para o endereço cadastrado, contendo o nome do participante, o título do workshop e um comprovante de inscrição. Isso reduz a ansiedade do usuário e valida a autenticidade do e-mail inserido.
8.  **Notificação de Cancelamento/Exclusão por E-mail:** Caso o organizador remova um participante da lista, o sistema deve disparar um e-mail automático notificando o usuário sobre o cancelamento da sua inscrição. Isso garante transparência, serve como registro formal e evita que o participante compareça ao workshop em caso de exclusões acidentais ou administrativas.

---

### 5. Referências Bibliográficas e Metodológicas
Caso haja interesse em se aprofundar nas origens das heurísticas aplicadas nesta análise técnica, seguem as fontes e os artigos oficiais:

* **Heuristic Test Strategy Model (HTSM):** Artigo original e guia de diretrizes criado por James Bach, que estabelece os pilares de estratégias de teste baseadas em contexto e pensamento crítico. Disponível no repositório oficial da [Satisfice, Inc.](https://www.satisfice.com/download/heuristic-test-strategy-model).
* **A Evolução do Mnemônico SFDIPOT:** Nota histórica publicada por Michael Bolton detalhando a transição do antigo conceito *SFDPO* ("San Francisco DePOT") para o atual mapeamento de elementos multidimensionais de produto na metodologia *Rapid Software Testing* (RST). Disponível no blog corporativo [DevelopSense](https://developsense.com/blog/2014/07/how-models-change).
* **Guia Prático de Cobertura de Código com SFDIPOT:** Artigo técnico que ilustra os benefícios práticos do uso do mnemônico para encontrar vulnerabilidades ocultas que estão fora do alcance das especificações tradicionais de interfaces de usuário (UI). Disponível no portal técnico da engenheira [Sharon O'Brien](https://www.sharonob.com/blog/sfdipot).
