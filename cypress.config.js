const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    allowCypressEnv: false,           // Remove o aviso de insegurança do terminal
    baseUrl: "http://localhost:3000", // URL local simulada do ambiente de staging
    viewportWidth: 1280,              // Resolução padrão de desktop
    viewportHeight: 720,
    specPattern: "cypress/e2e/specs/**/*.cy.js", // Onde o Cypress buscará os testes
    setupNodeEvents(on, config) {
      // Implementação de plugins
    },
  },
});
