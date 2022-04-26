import _ = require('lodash');
import Matches from '../database/models/matches';
import Teams from '../database/models/teams';

class Camelizer {
  static snakeToCamel = (obj: Teams | Matches) => _.mapKeys(obj, (_v, key) => _.camelCase(key));
}

export default Camelizer;
