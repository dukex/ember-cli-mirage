import Mirage from 'ember-cli-mirage';
import Model from 'ember-cli-mirage/orm/model';
import Schema from 'ember-cli-mirage/orm/schema';
import Db from 'ember-cli-mirage/orm/db';
import {module, test} from 'qunit';

var schema, link, zelda, address;
module('mirage:integration:schema:belongsTo#saved-child-saved-parent', {
  beforeEach: function() {
    var db = new Db({
      users: [
        {id: 1, name: 'Link'},
        {id: 2, name: 'Zelda'}
      ],
      addresses: [{id: 1, user_id: 1}]
    });
    schema = new Schema(db);

    var User = Model.extend();
    var Address = Model.extend({
      user: Mirage.belongsTo()
    });

    schema.registerModel('user', User);
    schema.registerModel('address', Address);

    link = schema.user.find(1);
    zelda = schema.user.find(2);
    address = schema.address.find(1);
  }
});


// Read
test('the child references the model, and its foreign key is correct', function(assert) {
  assert.deepEqual(address.user, link);
  assert.equal(address.user_id, 1);
  assert.deepEqual(address.attrs, {id: 1, user_id: 1});
});

// Update
test('the child can update its relationship to a saved parent via parent_id', function(assert) {
  address.user_id = 2;

  assert.equal(address.user_id, 2);
  assert.deepEqual(address.user, zelda);
  assert.deepEqual(address.attrs, {id: 1, user_id: 2});
});

test('the child can update its relationship to a saved parent via parent', function(assert) {
  address.user = zelda;

  assert.equal(address.user_id, 2);
  assert.deepEqual(address.user, zelda);
  assert.deepEqual(address.attrs, {id: 1, user_id: 2});
});

test('the child can update its relationship to a new parent via parent', function(assert) {
  var ganon = schema.user.new({name: 'Ganon'});
  address.user = ganon;

  assert.equal(address.user_id, null);
  assert.deepEqual(address.user, ganon);
  assert.deepEqual(address.attrs, {id: 1, user_id: null});
});

test('the child can update its relationship to null via parent_id', function(assert) {
  address.user_id = null;

  assert.equal(address.user_id, null);
  assert.deepEqual(address.user, null);
  assert.deepEqual(address.attrs, {id: 1, user_id: null});
});

test('the child can update its relationship to null via parent', function(assert) {
  address.user = null;

  assert.equal(address.user_id, null);
  assert.deepEqual(address.user, null);
  assert.deepEqual(address.attrs, {id: 1, user_id: null});
});
