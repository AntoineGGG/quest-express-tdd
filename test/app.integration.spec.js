// test/app.integration.spec.js
const request = require('supertest');
require('dotenv').config();
const connection = require('../connection');
const app = require('../app');

describe('Test routes', () => {
  beforeEach((done) => connection.query('TRUNCATE bookmark', done));
  it('GET / sends "Hello World" as json', (done) => {
    request(app)
      .get('/')
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        const expected = { message: 'Hello World!' };
        expect(response.body).toEqual(expected);
        done();
      });
  });

  it('POST /bookmarks - error (fields missing) ', (done) => {
    request(app)
      .post('/bookmarks')
      .send({})
      .expect(422)
      .expect('Content-Type', /json/)
      .then((response) => {
        const expected = { error: 'required field(s) missing' };
        expect(response.body).toEqual(expected);
        done();
      });
  });

  it('POST /bookmarks - OK (fields provided) ', (done) => {
    request(app)
      .post('/bookmarks')
      .send({ url: 'https://jestjs.io', title: 'Jest' })
      .expect(201)
      .expect('Content-Type', /json/)
      .then((response) => {
        const expected = { id: 1, url: 'https://jestjs.io', title: 'Jest' };
        expect(response.body).toEqual(expected);
        done();
      })
      .catch(done);
  });
  describe('GET /bookmarks/:id', () => {
    const testBookmark = { url: 'https://nodejs.org/', title: 'Node.js' };
    beforeEach((done) =>
      connection.query('TRUNCATE bookmark', () =>
        connection.query('INSERT INTO bookmark SET ?', testBookmark, done)
      )
    );

    // Write your tests HERE!
    it('Get an error cause wrong bookmark id', (done) => {
      request(app)
        .get('/bookmarks/:id')
        .expect(404)
        .expect('Content-Type', /json/)
        .then((res) => {
          const expected = { error: 'bookmark not found' };
          expect(res.body).toEqual(expected);
          done();
        });
    });
    it('Get the right bookmarks depend on the ID provided', (done) => {
      request(app)
        .get('/bookmarks/:id')
        .expect(200)
        .expect('Content-Type', /json/)
        .then((res) => {
          expect(res.body).toEqual(testBookmark);
          done();
        });
    });
  });
});
