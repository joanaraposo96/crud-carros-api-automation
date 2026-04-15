describe('Testes da API de Carros', () => {
  let allCars;
  let newCar = {
    marca: 'BMW',
    modelo: 'X1',
    ano: 2018,
    cor: 'Preto',
    preco: 80000
  }

  let storedCar;

  it('Listar todos os carros', () => {
    cy.request({
      method: 'GET',
      url: '/carros'
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.exist;
      expect(response.body).to.be.an('array');
      cy.log(JSON.stringify(response.body));
      allCars = response.body;
    })
  });

  it.skip('Obter detalhes de um carro específico', () => {
    cy.request({
      method: 'GET',
      url: `/carros/${allCars[0].id}`
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.marca).to.equal('Toyota');
      expect(response.body.modelo).to.equal('Corolla');
      expect(response.body.ano).to.equal(2023);
      expect(response.body.cor).to.equal('Prata');
      expect(response.body.preco).to.equal(25000);
      cy.log(JSON.stringify(response.body));
    })
  });

  it('Criar um novo carro', () => {
    for (let i = 0; i < 2; i++) {
      cy.request({
        method: 'POST',
        url: '/carros',
        body: newCar
      }).then((response) => { 
        allCars.push(response.body);
        expect(response.status).to.equal(201);
        expect(response.body.id).to.exist;
        cy.log(JSON.stringify(response.body));
        if (i == 1) {
          storedCar = response.body;
        }
      });
    }
  });

  it('Deletar um carro específico', () => {
    cy.request({
        method: 'DELETE',
        url: `/carros/${storedCar.id}`
      }).then((response) => {
        expect(response.status).to.equal(200);
        cy.log(JSON.stringify({
          id: storedCar.id,
          mensagem: response.body.mensagem
        }));
      });
  });
    
  it.skip('Deletar todos os novos carros', () => {
    const carsToDelete = allCars.slice(2)
    cy.wrap(carsToDelete).each((element) => {
      cy.request({
        method: 'DELETE',
        url: `/carros/${element.id}`
      }).then((response) => {
        expect(response.status).to.equal(200);
        cy.log(JSON.stringify({
          id: element.id,
          mensagem: response.body.mensagem
        }));
      });
    })
  });
});