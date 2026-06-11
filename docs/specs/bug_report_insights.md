# Relatório de Bugs e Insights Técnicos - X2 Eventos
## Comunicação Clara de Falhas e Melhorias de Produto

Este documento formaliza os defeitos críticos de lógica, comportamento e interface mapeados durante a fase de especificação e testes exploratórios na aplicação X2 Eventos, além de insights para o time de desenvolvimento.

---

## 1. Registro Formal de Bugs (Bug Report)

### 🔴 BUG-001: Erro de Lógica Inversa na Contagem de Vagas Pós-Exclusão (AC7)
*   **Componente:** Módulo de Gerenciamento de Vagas / Lista de Participantes
*   **Severidade:** Alta (Quebra regra de negócio essencial)
*   **Prioridade:** Alta (Impede o funcionamento correto do fluxo de inscrições)
*   **Descrição:** Ao acionar a remoção de um participante da lista, o sistema diminui a contagem de vagas em vez de liberar o saldo. Se o sistema operasse com o saldo de vagas disponíveis (ex: 50), ele reduz para 49, impedindo que novas pessoas se inscrevam, matando o fluxo de rotatividade do workshop.
*   **Passos para Reproduzir:**
    1. Acessar a tela do workshop (Contador inicial aponta: `Vagas Ocupadas: 5/50`).
    2. Localizar qualquer participante ativo na Lista de Participantes.
    3. Clicar no botão/ícone de remoção daquele participante.
    4. Observar o indicador visual de contagem de vagas na tela.
*   **Resultado Esperado:** O registro do participante deve ser removido e o contador deve atualizar para `4/50` (diminuindo as ocupadas) ou o saldo disponível deve aumentar em 1.
*   **Resultado Real:** O participante é removido, mas o contador decrementa a capacidade ou o saldo incorretamente (ex: vai para `49` vagas totais ou bloqueia uma vaga permanentemente).

### 🔴 BUG-002: Desalinhamento Crítico de Layout na Lista por Tamanho de String (UI Overflow)
*   **Componente:** Componente Visual da Lista de Inscritos (CSS/Design)
*   **Severidade:** Média/Alta (Quebra a consistência visual e usabilidade da interface)
*   **Prioridade:** Alta (Impacta diretamente a estética e o padrão visual do produto)
*   **Descrição:** Os cartões da lista de participantes não possuem tratamento de limite de caracteres ou propriedade de flexibilidade rígida. Nomes muito extensos (ex: "Ricardo Martins de Souza") empurram o botão de exclusão (ícone de lixeira) para fora do alinhamento vertical da grade, gerando um layout torto e inconsistente.
*   **Passos para Reproduzir:**
    1. Preencher o formulário com o nome "Ricardo Martins de Souza".
    2. Concluir a inscrição.
    3. Observar a linha correspondente a esse usuário na listagem em comparação com as linhas superiores de nomes mais curtos.
*   **Resultado Esperado:** O nome deve se ajustar ao contêiner (truncando com reticências se necessário), mantendo todos os botões de lixeira perfeitamente alinhados na mesma coordenada X (vertical).
*   **Resultado Real:** O texto empurra o componente de ação, desalinhando o botão em relação ao restante da lista.

---

### 🟡 BUG-003: Incongruência Semântica no Contador de Vagas da Tela
*   **Componente:** Elemento de Texto / Indicador de Vagas (`Vagas: 47/50`)
*   **Severidade:** Média (Gera confusão cognitiva no usuário/organizador)
*   **Prioridade:** Média
*   **Descrição:** O topo da aplicação exibe a label `Vagas: 47/50`, porém a listagem logo abaixo exibe apenas 3 participantes cadastrados. A semântica do contador está matematicamente invertida ou confusa: ele deveria representar "Vagas Ocupadas" (que seriam 3/50) ou "Vagas Restantes" (apenas o número 47 isolado).
*   **Passos para Reproduzir:**
    1. Carregar a aplicação com exatamente 3 usuários cadastrados na base de dados.
    2. Olhar para o indicador de vagas no topo da página.
*   **Resultado Esperado:** O contador deve exibir de forma inequívoca o estado atual do evento (ex: `Inscritos: 3/50` ou `Vagas Restantes: 47`).
*   **Resultado Real:** É exibida a string `Vagas: 47/50` simultaneamente a uma lista com apenas 3 elementos, confundindo o organizador sobre a lotação real.

### 🟡 BUG-004: Inscrição Duplicada Permitida para o Mesmo E-mail (AC2 / AC5)
*   **Componente:** Formulário de Inscrição / Validação de Input
*   **Severidade:** Média (Inconsistência de integridade de dados)
*   **Prioridade:** Média (Impacta a experiência de e-mail de confirmação)
*   **Descrição:** O formulário aceita que o mesmo endereço de e-mail seja cadastrado múltiplas vezes seguidas no mesmo workshop se o nome for minimamente alterado, burlando a trava de unicidade de participante.
*   **Passos para Reproduzir:**
    1. No formulário, preencher Nome: "Davi Teste", E-mail: "davi@dev.com", Telefone: "85999999999".
    2. Clicar em "Inscrever". (Cadastro efetuado com sucesso).
    3. No mesmo formulário limpo, preencher Nome: "Davi Silva", E-mail idêntico: "davi@dev.com", Telefone: "85999999999".
    4. Clicar em "Inscrever".
*   **Resultado Esperado:** O sistema deve validar a duplicidade do e-mail no escopo daquele workshop, bloquear a submissão e exibir um alerta: *"Este e-mail já está inscrito neste workshop."*
*   **Resultado Real:** O sistema aceita a requisição, insere um segundo card na lista e consome uma vaga válida do evento de forma duplicada.

---

### 🔵 BUG-005: Permissão de Submissão de Espaços em Branco no Input de Nome (Falta de Sanitize)
*   **Componente:** Validação de Formulário
*   **Severidade:** Média (Injeção de strings vazias na UI)
*   **Prioridade:** Baixa/Média
*   **Descrição:** O sistema habilita o botão "Inscrever" se o usuário digitar apenas caracteres de espaço (barra de espaço) no campo "Nome Completo", permitindo salvar um participante invisível na lista.
*   **Passos para Reproduzir:**
    1. No campo "Nome Completo", digitar 5 espaços vazios ("     ").
    2. Preencher e-mail e telefone válidos.
    3. Observar o estado do botão "Inscrever".
    4. Clicar em "Inscrever".
*   **Resultado Esperado:** O botão deve permanecer desabilitado ou disparar erro de validação informando que o nome não pode conter apenas espaços vazios.
*   **Resultado Real:** O botão é habilitado, a inscrição é concluída e um card em branco (sem nome visível) é renderizado na Lista de Participantes.

---

## 2. Insights e Sugestões Arquiteturais para o Time

* **Implementação de Throttling/Debounce no Botão:** Sugere-se aplicar uma técnica de `debounce` de 500ms ou desabilitar o estado do botão imediatamente após o primeiro clique no botão "Inscrever". Isso mitiga o risco de o organizador clicar duas vezes rapidamente por lag na rede, gerando duas requisições HTTP POST idênticas no banco.
* **Estratégia de Acessibilidade e Contraste Ambientes Externos:** Identificamos que a aplicação possui apenas o Modo Escuro (*Dark Mode*) fixo. Para organizadores operando o sistema em tablets/celulares na entrada de eventos sob luz solar direta, o reflexo na tela pode inviabilizar a leitura. Sugere-se a criação de um seletor de tema (*Theme Toggle*) claro/escuro.
* **Validação de Telefone via Regex Internacional:** O campo telefone precisa de uma validação via código um pouco mais estrita. Propõe-se o uso da biblioteca `libphonenumber` no backend ou uma Regex nativa no frontend que force o padrão mínimo de DDD + 9 dígitos (permitindo também o formato de 10 dígitos para telefones fixos), rejeitando números fictícios como `00000000000`.
* **Estratégia de Cache para a Listagem:** Como a lista precisa ser atualizada "imediatamente" ao inserir ou remover (Reatividade), o time pode adotar ferramentas de gerenciamento de estado como React Query ou mutações otimistas (*Optimistic Updates*) para dar uma percepção de performance instantânea ao usuário, sincronizando com o servidor em background.