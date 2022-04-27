import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import { app } from '../app';

import Users from '../database/models/users';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('/login endpoint', () => {
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
    });

    after(() => (Users.findOne as sinon.SinonStub).restore());

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
});