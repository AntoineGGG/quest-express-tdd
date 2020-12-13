const request = require('supertest');
const app = require('../app');

describe('Test routes', () => {
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
  it('Post /bookmarks should return an error', (done) => {
    request(app)
      .post('/bookmarks')
      .send({})
      .expect(422)
      .expect('Content-Type', /json/)
      .then((res) => {
        const expected = { error: 'required fields missing' };
        expect(res.body).toEqual(expected);
        done();
      });
  });
  it('Post /bookmarks should return a status 201', (done) => {
    request(app)
      .post('/bookmarks')
      .send({ url: 'https://jestjs.io', title: 'Jest' })
      .expect(201)
      .expect('Content-Type', /json/)
      .then((res) => {
        const expected = { id: 4, url: 'https://jestjs.io', title: 'Jest' };
        expect(res.body).toEqual(expected);
        done();
      })
      .catch(done);
  });
});
