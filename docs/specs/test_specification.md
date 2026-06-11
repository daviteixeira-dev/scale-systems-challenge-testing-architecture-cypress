# Especificação de Casos de Teste (BDD / Gherkin)

## Mapeamento do Formulário e Regras de Negócio (AC1, AC2, AC4, AC5)

### Caso de Teste: CT-001 — Inscrição Concluída com Sucesso (Caminho Feliz)

| Campo | Descrição Detalhada |
| :--- | :--- |
| **ID do Caso de Teste** | CT-001 |
| **Título / Objetivo** | Validar a inscrição bem-sucedida de um participante preenchendo todos os campos e verificando a reatividade da lista. |
| **Pré-condições** | 1. O workshop possui vagas disponíveis (Contador de ocupação menor que 50).<br>2. O usuário está na tela de gerenciamento. |
| **Cenário Gherkin** | **Dado** que o workshop possui vagas disponíveis na lista<br>**Quando** o organizador preenche o nome completo "Carlos Pereira", o e-mail "carlos.p@email.com" e o telefone "11987654321"<br>**E** clica no botão "Inscrever"<br>**Então** o sistema deve exibir a mensagem de sucesso "Inscrição realizada com sucesso!"<br>**E** deve limpar os campos do formulário para uma nova inserção<br>**E** o novo inscrito deve constar imediatamente na Lista de Participantes |
| **Passos de Execução** | 1. Acessar a página de gerenciamento de inscrições.<br>2. Preencher os inputs de Nome, E-mail e Telefone.<br>3. Clicar em "Inscrever" e capturar o alerta/toast de sucesso.<br>4. Validar os elementos de texto inseridos no container da lista à direita. |
| **Dados de Entrada** | `nome: "Carlos Pereira"`, `email: "carlos.p@email.com"`, `telefone: "11987654321"`. |
| **Resultado Esperado** | 1. Mensagem "Inscrição realizada com sucesso!" exibida.<br>2. Inputs redefinidos para o estado original em branco.<br>3. Componente visual da lista acrescido com o nome e e-mail informados.<br>4. Contador de vagas atualizado corretamente refletindo a nova ocupação. |
| **Pós-condições** | O contador de vagas ocupadas do workshop é incrementado em 1 unidade. |

### Caso de Teste: CT-002 — Bloqueio do Botão por Falta de Dados Obrigatórios

| Campo | Descrição Detalhada |
| :--- | :--- |
| **ID do Caso de Teste** | CT-002 |
| **Título / Objetivo** | Validar que o botão "Inscrever" permanece desabilitado se campos obrigatórios estiverem vazios. |
| **Pré-condições** | Formulário limpo carregado em tela. Campos obrigatórios identificados visualmente com asterisco (`*`). |
| **Cenário Gherkin** | **Dado** que o formulário de inscrição foi carregado em tela<br>**Quando** o organizador preenche apenas o campo opcional de Telefone, deixando Nome e E-mail em branco<br>**Então** o botão "Inscrever" deve permanecer desabilitado para o clique (atributo `disabled` ativo) |
| **Passos de Execução** | 1. Identificar o estado do atributo `disabled` do botão no carregamento inicial.<br>2. Digitar o telefone no input.<br>3. Validar se o atributo `disabled` continua presente no botão. |
| **Dados de Entrada** | `nome: ""`, `email: ""`, `telefone: "11987654321"`. |
| **Resultado Esperado** | O elemento do botão contém a propriedade HTML `disabled` ou classe CSS de bloqueio inviabilizando a ação. |
| **Pós-condições** | Nenhuma requisição é disparada ao servidor e nenhum participante é inserido na lista. |

---

## Mapeamento de Limites, Exceções e UX (AC2, AC3, AC7)

### Caso de Teste: CT-003 — Bloqueio de Interface ao Atingir Lotação Máxima (50/50)

| Campo | Descrição Detalhada |
| :--- | :--- |
| **ID do Caso de Teste** | CT-003 |
| **Título / Objetivo** | Garantir que o sistema bloqueie o formulário e mude seu estado visual para "Inscrições Encerradas" ao atingir o teto de 50 vagas. |
| **Pré-condições** | O workshop atingiu o status de lotação máxima com 50 participantes cadastrados. |
| **Cenário Gherkin** | **Dado** que o contador de vagas atingiu o limite de "50/50"<br>**Quando** a interface renderizar o estado de lotação máxima<br>**Então** todos os campos de input e o botão "Inscrever" devem receber o atributo `disabled`<br>**E** o formulário deve exibir uma sinalização visual clara de "Inscrições Encerradas" |
| **Passos de Execução** | 1. Injetar ou cadastrar 50 registros válidos no painel.<br>2. Validar a atualização do contador para 50/50.<br>3. Verificar se as tags `<input>` e `<button>` do formulário possuem a propriedade `disabled`. |
| **Dados de Entrada** | Estado da aplicação com 50 registros ativos. |
| **Resultado Esperado** | Bloqueio completo de novas interações no formulário, mitigando o risco de *overbooking* diretamente na UI. |
| **Pós-condições** | Nenhuma tentativa de digitação ou submissão é permitida enquanto a lista contiver 50 participantes. |

### Caso de Teste: CT-004 — Remoção de Inscrito com Confirmação em Modal e Recálculo de Vagas

| Campo | Descrição Detalhada |
| :--- | :--- |
| **ID do Caso de Teste** | CT-004 |
| **Título / Objetivo** | Validar que o botão "Remover" aciona uma barreira de segurança (modal) antes de excluir o participante e liberar a vaga de forma correta. |
| **Pré-condições** | Existem participantes listados em tela e a contagem indica vagas ocupadas (ex: 3/50). |
| **Cenário Gherkin** | **Dado** que o participante "Juliana Costa" está cadastrado e visível na lista<br>**Quando** o organizador clica no botão "Remover" (ícone de lixeira) associado ao card dela<br>**E** confirma a ação clicando em "Sim, remover" no modal de confirmação de exclusão<br>**Então** o registro de "Juliana Costa" deve ser excluído da tela imediatamente<br>**E** a contagem de vagas ocupadas deve diminuir em 1 unidade (ex: de 3/50 para 2/50) |
| **Passos de Execução** | 1. Localizar o card correspondente à "Juliana Costa" na listagem.<br>2. Clicar no botão vermelho de exclusão contido naquele card específico.<br>3. Validar a abertura do modal de segurança e clicar em confirmar.<br>4. Verificar o desaparecimento do card e o decremento do contador de ocupação. |
| **Dados de Entrada** | Clique nos elementos de ação (Lixeira -> Confirmação do Modal). |
| **Resultado Esperado** | 1. Remoção física/visual do card na lista de inscritos.<br>2. Atualização matemática correta do contador liberando uma vaga no evento. |
| **Pós-condições** | A vaga liberada fica disponível para novos cadastros e um e-mail de notificação de cancelamento é disparado ao participante. |

---

## Casos de Teste Avançados (Heurísticas e Melhorias de UX)

### Caso de Teste: CT-005 — Resiliência de Layout com Strings Longas (Truncamento)

| Campo | Descrição Detalhada |
| :--- | :--- |
| **ID do Caso de Teste** | CT-005 |
| **Título / Objetivo** | Validar que nomes extremamente longos não causem quebra de layout (*UI overflow*) e mantenham os botões de exclusão alinhados. |
| **Pré-condições** | O organizador está na tela de cadastro. |
| **Cenário Gherkin** | **Dado** que o organizador insere um nome com mais de 50 caracteres (ex: "Ricardo Martins de Souza Castro Vasconcelos da Silva")<br>**Quando** a inscrição é processada e inserida na lista<br>**Then** o texto do nome deve ser exibido de forma truncada utilizando reticências (CSS `text-overflow: ellipsis`)<br>**E** o botão de exclusão (lixeira) deve permanecer perfeitamente alinhado na grade vertical com os demais botões |
| **Passos de Execução** | 1. Cadastrar um usuário com string de nome massiva.<br>2. Avaliar visualmente ou via asserção de propriedades CSS se houve quebra de contêiner.<br>3. Validar o alinhamento horizontal do botão de lixeira através das coordenadas do elemento. |
| **Dados de Entrada** | `nome: "Ricardo Martins de Souza Castro Vasconcelos da Silva"`, `email: "ricardo@teste.com"`. |
| **Resultado Esperado** | Layout íntegro, sem vazamento de texto e botões mantendo um alinhamento consistente em padrão de grade (*grid/flexbox*). |

### Caso de Teste: CT-006 — Flexibilidade de Máscara de Telefone e Sanitização de Input

| Campo | Descrição Detalhada |
| :--- | :--- |
| **ID do Caso de Teste** | CT-006 |
| **Título / Objetivo** | Validar que o campo telefone aceite formatos de 10 e 11 dígitos e limpe caracteres inválidos (*sanitize*). |
| **Pré-condições** | Formulário limpo carregado em tela. |
| **Cenário Gherkin** | **Dado** que o organizador insere um telefone fixo com 10 dígitos "1133221100" ou tenta colar letras e símbolos como "11A-98765_4321"<br>**Quando** o sistema processa o input<br>**Então** o campo deve reter apenas os dígitos numéricos brutos<br>**E** o formulário deve aceitar tanto a extensão de 10 quanto de 11 dígitos como válidas para envio |
| **Passos de Execução** | 1. Tentar digitar letras no campo Telefone e validar o bloqueio em tempo real.<br>2. Enviar um cadastro com telefone de 10 dígitos e validar o sucesso.<br>3. Enviar um cadastro com telefone de 11 dígitos e validar o sucesso. |
| **Dados de Entrada** | `telefone_1: "1133221100" (Fixo)`, `telefone_2: "11A-98765_4321" (Sujo)`. |
| **Resultado Esperado** | O sistema higieniza o input de letras instantaneamente e valida com sucesso ambas as extensões numéricas nacionais. |

### Caso de Teste: CT-007 — Validação de Disparos de E-mail Notificadores (Ciclo de Vida)

| Campo | Descrição Detalhada |
| :--- | :--- |
| **ID do Caso de Teste** | CT-007 |
| **Título / Objetivo** | Validar a integração (camada de transporte/mock) dos disparos automáticos de e-mail de confirmação e exclusão. |
| **Pré-condições** | Sistema de e-mails interceptado/mockado através do Cypress para validação de chamadas assíncronas. |
| **Cenário Gherkin** | **Dado** que um fluxo de alteração de estado de participante ocorre no sistema<br>**Quando** uma nova inscrição é concluída com sucesso<br>**Então** uma chamada de API deve ser disparada para enviar o e-mail de "Confirmação de Vaga"<br>**Quando** um participante existente é removido através do modal<br>**Então** uma chamada de API deve ser disparada para enviar o e-mail de "Notificação de Cancelamento" |
| **Passos de Execução** | 1. Realizar uma inscrição e interceptar o payload da requisição de e-mail utilizando `cy.intercept()`.<br>2. Realizar uma exclusão e interceptar a requisição de e-mail correspondente.<br>3. Validar se os dados do participante correto constam no corpo dos payloads interceptados. |
| **Dados de Entrada** | Ações de Inscrição e Exclusão do sistema. |
| **Resultado Esperado** | Interceptação bem-sucedida das chamadas HTTP direcionadas ao microsserviço de e-mail com status esperado de trigger ativo. |