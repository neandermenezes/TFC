
import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import { app } from '../app';

import Users from '../database/models/users';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testing post /login endpoints', () => {
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
  })
});