import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import { app } from '../app';

import Users from '../database/models/users';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

import * as Jwt from 'jsonwebtoken';

import allMatches = require('./mocks/allMatches.json');
import allMatchesCamelized = require('./mocks/allMatchesCamelized.json');

import Matches from '../database/models/matches';
import Camelizer from '../utils/Camelizer';
import AuthService from '../services/AuthService';
import Teams from '../database/models/teams';

const authService = new AuthService();

describe('Tests', () => {
  describe('Login succeeds', async () => {
    before(async () => {
      sinon.stub(Users, 'findOne')
      .resolves({
        id: 1,
        username: 'Admin',
        role: 'admin',
        email: 'admin@admin.com',
        password: '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW',
      } as Users);
      sinon.stub(Matches, 'create').resolves({ id: 1 } as any);
      sinon.stub(Jwt, 'verify').resolves({
      email: 'admin@admin.com',
      password: 'secret_admin',
    } as any);
    sinon.stub(Matches, 'update').resolves()
    });

    after(() => {
      (Users.findOne as sinon.SinonStub).restore();
      (Matches.create as sinon.SinonStub).restore();
      (Jwt.verify as sinon.SinonStub).restore();
      after(() => (Matches.update as sinon.SinonStub).restore());
    });

    it('Status code is 200', async () => {
      const body = {
        email: 'admin@admin.com',
        password: 'secret_admin',
      }

      const response = await chai.request(app).post('/login').send(body);

      expect(response.status).to.equal(200);
    });

    it('Returns user role', async () => {
      const response = await chai.request(app).get('/login/validate');
  
      expect(response.status).to.equal(401);
    })

    it('Returns status code 201 when creating match', async () => {
      const body = {
          homeTeam: 12,
          awayTeam: 3,
          homeTeamGoals: 2,
          awayTeamGoals: 1,
          inProgress: true
        }
  
      const response = await chai.request(app).post('/matches')
        .set('authorization', 'aaaaaaaaaa')
        .send(body);
  
      expect(response.status).equal(201);
      expect(response.body).deep.equal({
        id: 1,
        ...body,
      })
    });

    it('Returns id of the finished match', async () => {
      const responseBody = {
        id: "41",
      }

      const response = await chai.request(app).patch('/matches/41/finish')
        .set('authorization', 'aaaaaaaaaa');
  
      expect(response.status).to.equal(200);
      expect(response.body).deep.equal(responseBody);
    })

    it('Successfully updates a match', async () => {
      const body = {
          homeTeamGoals: 3,
          awayTeamGoals: 1
        }

      const responseBody = {
        id: "48",
      }

      const response = await chai.request(app).patch('/matches/48')
        .set('authorization', 'aaaaaaaaaaa').send(body);

      expect(response.status).to.equal(200);
      expect(response.body).deep.equal(responseBody);
      })
    })
  });

  describe('Login Fails', () => {
    before(async () => {
      sinon.stub(Users, 'findOne')
      .resolves()
    });

    after(() => (Users.findOne as sinon.SinonStub).resolves());

    it('Incorrect email', async () => {
      const body = {
        email: 'aaaaaa',
        password: 'secret_admin',
      }

      const response = await await chai.request(app).post('/login').send(body);

      expect(response.body.message).to.be.equal('Incorrect email or password');
      expect(response.status).to.equal(401);
    });

    it('Incorrect password', async () => {
      const body = {
        email: 'admin@admin.com',
        password: 'NOKIATIJOLAO',
      }

      const response = await chai.request(app).post('/login').send(body)

      expect(response.status).to.equal(401);
      expect(response.body.message).to.be.equal('Incorrect email or password');
    });

    it('Empty email', async () => {
      const body = {
        password: 'secret_admin',
      }

      const response = await chai.request(app).post('/login').send(body)

      expect(response.body.message).to.be.equal('All fields must be filled');
      expect(response.status).to.equal(400);
    });

    it('Empty password', async () => {
      const body = {
        email: 'admin@admin.com',
      }

      const response = await chai.request(app).post('/login').send(body)

      expect(response.body.message).to.be.equal('All fields must be filled');
      expect(response.status).to.equal(400);
    });
});

describe('/matches endpoint', () => {
  before(async () => {
    sinon.stub(Matches, 'findAll')
      .resolves(allMatches as any);

    sinon.stub(Camelizer, 'snakeToCamel')
      .returns(allMatchesCamelized as any)
  })

  after(() => {
    (Matches.findAll as sinon.SinonStub).restore();
    (Camelizer.snakeToCamel as sinon.SinonStub).restore();
  });

  it('No query returns all matches', async () => {
    const response = await chai.request(app).get('/matches');

    expect(response.status).equal(200);
  });

  it('/matches?inProgress=true', async () => {
    const response = await chai.request(app).get('/matches?inProgress=true');

    expect(response.status).equal(200);
  });

  it('/matches?inProgress=false', async () => {
    const response = await chai.request(app).get('/matches?inProgress=false');

    expect(response.status).equal(200);
  })
});

describe('Testing teams endpoints', () => {
  before(() => {
    sinon.stub(Teams, 'findAll').resolves([{
      id: 1,
      teamName: "Avaí/Kindermann"
    },
    {
      id: 2,
      teamName: "Bahia"
    }] as any)
  });

  after(() => (Teams.findAll as sinon.SinonStub).resolves());

  it('Get all teams', async () => {
    const response = await chai.request(app).get('/teams');

    expect(response.status).to.equal(200);
  });

  it('get an specific Team', async () => {
    const teamIdOne = {
      id: 1,
      teamName: "Avaí/Kindermann"
    }
    sinon.stub(Teams, 'findOne').resolves(teamIdOne as any);

    const response = await chai.request(app).get('/teams/1');

    expect(response.status).to.equal(200);
    expect(response.body).deep.equal(teamIdOne);

    (Teams.findOne as sinon.SinonStub).restore();
  })
})

// describe('Tests finish match endpoint', () => {


//   before(() => {
//   });



// })