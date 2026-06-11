describe('X2 Eventos - Gerenciamento de Inscrições para Eventos', () => {
  
  beforeEach(() => {
    // 1. MOCK DA API: Intercepta a rota que carrega os participantes iniciais
    cy.intercept('GET', '/api/workshops/1/participants', {
      statusCode: 200,
      body: [
        { id: 1, name: "Ana Souza", email: "ana@email.com" },
        { id: 2, name: "Bruno Lima", email: "bruno@email.com" }
      ]
    }).as('getParticipants');

    // 2. MOCK DO EMAIL: Intercepta o disparo de e-mail de confirmação (CT-007)
    cy.intercept('POST', '/api/notifications/email', {
      statusCode: 200,
      body: { success: true, message: "E-mail enviado" }
    }).as('sendEmailNotification');

    // 3. MOCK DO CADASTRO: Intercepta o envio do formulário de inscrição
    cy.intercept('POST', '/api/workshops/1/enroll', {
      statusCode: 201,
      body: { id: 3, name: "Carlos Pereira", email: "carlos.p@email.com" }
    }).as('enrollParticipant');

    // Visita a página inicial simulada
    cy.visit('/');
    cy.wait('@getParticipants');
  });

  it('CT-001 — Deve concluir a inscrição com sucesso e validar reatividade da lista', () => {
    // Mapeamento lógico de elementos baseado na imagem do sistema
    const nomeCompleto = 'Carlos Pereira';
    const emailValido = 'carlos.p@email.com';
    const telefoneValido = '11987654321';

    // Preenche o formulário usando seletores semânticos ideais
    cy.get('input[name="name"]').type(nomeCompleto);
    cy.get('input[name="email"]').type(emailValido);
    cy.get('input[name="phone"]').type(telefoneValido);

    // Clicar no botão inscrever
    cy.get('button[type="submit"]').click();

    // ASSERÇÃO 1: Deve exibir a mensagem de sucesso (Toast/Alerta)
    cy.get('.toast-success')
      .should('be.visible')
      .and('contain', 'Inscrição realizada com sucesso!');

    // ASSERÇÃO 2: Validar o disparo do e-mail de confirmação (CT-007)
    cy.wait('@sendEmailNotification').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });

    // ASSERÇÃO 3: Os campos do formulário devem ser limpos após o envio
    cy.get('input[name="name"]').should('have.value', '');
    cy.get('input[name="email"]').should('have.value', '');

    // ASSERÇÃO 4: O novo inscrito deve constar imediatamente na lista à direita
    cy.get('.participant-list')
      .should('contain', nomeCompleto)
      .and('contain', emailValido);
  });
});
