import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import allMatches = require('./mocks/allMatches.json');
import allMatchesCamelized = require('./mocks/allMatchesCamelized.json');

import { app } from '../app';

import Users from '../database/models/users';

import { Response } from 'superagent';
import Matches from '../database/models/matches';
import Camelizer from '../utils/Camelizer';

chai.use(chaiHttp);

const { expect } = chai;

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
});