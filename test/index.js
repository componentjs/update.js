
var resolve = require('component-resolver');
var semver = require('semver');
var assert = require('assert');
var path = require('path');
var co = require('co');
var fs = require('fs');

var update = require('..');

var filename = path.resolve('component.json');

describe('update', function () {
  beforeEach(function (done) {
    fs.unlink(filename, function (err) {
      done();
    });
  })

  it('should update dependencies', co(function* () {
    yield* write({
      name: 'test',
      dependencies: {
        "component/emitter": "1.0.1"
      }
    });

    var tree = yield* resolve(process.cwd());

    yield* update(tree);

    var json = yield* read();
    assert(semver.gt(json.dependencies['component/emitter'], '1.0.1'));
  }))

  it('should update development dependencies', co(function* () {
    yield* write({
      name: 'test',
      development: {
        dependencies: {
          "component/emitter": "1.0.1"
        }
      }
    });

    var tree = yield* resolve(process.cwd());

    yield* update(tree, {
      development: true
    });

    var json = yield* read();
    assert(semver.gt(json.development.dependencies['component/emitter'], '1.0.1'));
  }))
})

function* write(json) {
  yield fs.writeFile.bind(null, filename, JSON.stringify(json, null, 2));
}

function* read() {
  var string = yield fs.readFile.bind(null, filename, 'utf8');
  return JSON.parse(string);
}