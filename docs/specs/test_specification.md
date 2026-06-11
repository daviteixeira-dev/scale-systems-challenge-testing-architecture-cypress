# Especificação de Casos de Teste (BDD / Gherkin)

## Mapeamento do Formulário e Regras de Negócio (AC1, AC2, AC4, AC5)

### Caso de Teste: CT-001 — Inscrição Concluída com Sucesso (Caminho Feliz)

| Campo | Descrição Detalhada |
| :--- | :--- |
| **ID do Caso de Teste** | CT-001 |
| **Título / Objetivo** | Validar a inscrição bem-sucedida de um participante preenchendo todos os campos e verificando a reatividade da lista. |
| **Pré-condições** | 1. O workshop possui vagas disponíveis (ex: 47/50).<br>2. O usuário está na tela de gerenciamento. |
| **Cenário Gherkin** | **Dado** que o workshop possui vagas disponíveis na lista<br>**Quando** o organizador preenche o nome completo "Carlos Pereira", o e-mail "carlos.p@email.com" e o telefone "11987654321"<br>**E** clica no botão "Inscrever"<br>**Então** o sistema deve exibir a mensagem de sucesso "Inscrição realizada com sucesso!"<br>**E** deve limpar os campos do formulário para uma nova inserção<br>**E** o novo inscrito deve constar imediatamente na Lista de Participantes |
| **Passos de Execução** | 1. Acessar a página de gerenciamento de inscrições.<br>2. Preencher os inputs de Nome, E-mail e Telefone.<br>3. Clicar em "Inscrever" e capturar o alerta/toast de sucesso.<br>4. Validar os elementos de texto inseridos no container da lista à direita. |
| **Dados de Entrada** | `nome: "Carlos Pereira"`, `email: "carlos.p@email.com"`, `telefone: "11987654321"`. |
| **Resultado Esperado** | 1. Mensagem "Inscrição realizada com sucesso!" exibida.<br>2. Inputs redefinidos para o estado original em branco.<br>3. Componente visual da lista acrescido com o nome e e-mail informados. |
| **Pós-condições** | O contador de vagas ocupadas do workshop é incrementado em 1. |

### Caso de Teste: CT-002 — Bloqueio do Botão por Falta de Dados Obrigatórios

| Campo | Descrição Detalhada |
| :--- | :--- |
| **ID do Caso de Teste** | CT-002 |
| **Título / Objetivo** | Validar que o botão "Inscrever" permanece desabilitado se campos obrigatórios estiverem vazios. |
| **Pré-condições** | Formulário limpo carregado em tela. |
| **Cenário Gherkin** | **Dado** que o formulário de inscrição foi carregado em tela<br>**Quando** o organizador preenche apenas o campo de Telefone, deixando Nome e E-mail em branco<br>**Então** o botão "Inscrever" deve permanecer desabilitado para o clique |
| **Passos de Execução** | 1. Identificar o estado do atributo `disabled` do botão no carregamento inicial.<br>2. Digitar o telefone no input.<br>3. Validar se o atributo `disabled` continua presente no botão. |
| **Dados de Entrada** | `nome: ""`, `email: ""`, `telefone: "11987654321"`. |
| **Resultado Esperado** | O elemento do botão contém a propriedade HTML `disabled` ou classe css de bloqueio inviabilizando a ação. |
| **Pós-condições** | Nenhuma requisição é disparada ao servidor e nenhum participante é inserido na lista. |

---

## Mapeamento de Limites e Exceções (AC2, AC3, AC7)

### Caso de Teste: CT-003 — Tentativa de Inscrição em Workshop com Vagas Esgotadas

| Campo | Descrição Detalhada |
| :--- | :--- |
| **ID do Caso de Teste** | CT-003 |
| **Título / Objetivo** | Garantir que o sistema impeça novas inscrições e lance feedback adequado se o limite de 50 vagas for atingido. |
| **Pré-condições** | O workshop atingiu o status de lotação máxima com 50 participantes cadastrados (50/50). |
| **Cenário Gherkin** | **Dado** que o workshop atingiu o limite máximo de 50 participantes inscritos<br>**Quando** o organizador tenta forçar a submissão de um novo perfil válido<br>**Então** o sistema não deve efetivar o cadastro na lista<br>**E** deve exibir na tela a mensagem de erro impeditiva "Vagas esgotadas!" |
| **Passos de Execução** | 1. Injetar ou cadastrar 50 registros válidos no painel.<br>2. Preencher os inputs com um 51º participante.<br>3. Tentar submeter e mapear a mensagem na interface. |
| **Dados de Entrada** | `nome: "Ana da Silva"`, `email: "ana@dominio.com"`, Contador em `50/50`. |
| **Resultado Esperado** | Exibição obrigatória do texto "Vagas esgotadas!" e bloqueio de novos cards na lista. |
| **Pós-condições** | A contagem de inscritos permanece travada estritamente em 50 participantes. |

### Caso de Teste: CT-004 — Remoção de Inscrito e Recalculo do Saldo de Vagas

| Campo | Descrição Detalhada |
| :--- | :--- |
| **ID do Caso de Teste** | CT-004 |
| **Título / Objetivo** | Validar que o botão "Remover" exclui o participante correto e libera uma vaga no contador de controle. |
| **Pré-condições** | Existem participantes listados em tela e a contagem indica vagas ocupadas (ex: 47/50). |
| **Cenário Gherkin** | **Dado** que o participante "Juliana Costa" está cadastrado e visível na lista<br>**Quando** o organizador clica no botão "Remover" (ícone de lixeira) associado ao card dela<br>**Então** o registro de "Juliana Costa" deve ser excluído da tela imediatamente<br>**E** a contagem de vagas disponíveis para o evento deve ser atualizada liberando espaço |
| **Passos de Execução** | 1. Localizar o card correspondente à "Juliana Costa" na listagem.<br>2. Clicar no botão vermelho de exclusão contido naquele card específico.<br>3. Validar o desaparecimento do elemento gráfico da tela.<br>4. Capturar a string do contador e validar o decremento da ocupação (ex: de 47/50 para 46/50). |
| **Dados de Entrada** | Clique no elemento de ação associado ao identificador do participante. |
| **Resultado Esperado** | 1. Remoção física/visual do card na lista de inscritos.<br>2. Atualização matemática do display de vagas aumentando a disponibilidade em 1 unidade. |
| **Pós-condições** | O espaço liberado permite que uma nova pessoa seja cadastrada no workshop. |
