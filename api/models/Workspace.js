import { Model } from 'objection';

class Workspace extends Model {
  static get tableName() {
    return 'workspaces';
  }
}

export default Workspace;
