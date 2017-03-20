/*
// TODO - refactor for usage in components
const makeRequest = function(url) {
  // mock fetch
  return new Promise((resolve, reject) => {
    if(Math.random() < 0.5) {
        resolve({ res: 'some fake response' });
    }
    reject(new Error('fake error'));
};

// use a generator to encapsulate an endpoint request
// and inject sequential params
function* createObservable() {
  // .next('some url here').value
  // - pass in path (and/or params) for request
  // - return a thenable promise
  const endpoint = yield makeRequest(url);
  // .next(requestResult)
  // - this is probalby not useful, but demonstrating chaining execution
  //   and generator internal logic
  // - could manipulate the response or have some logic at this step
  //   before returning a response
  const requestResult = yield response;
  return 'need to review promise propagation';
}

const req = createObservable();
req.next('http://www.fakeapi.io').value // pass in url and get promise response
.then( res => req.next(res).value )
.then( finalString => console.log(finalString) )
.catch( err => console.log(err) );

// can use 'for of' loop to iterate through generator yields
// can also use `yield*` within generator

// npm 'co' - coroutine: recursively executes promise until resolution
// - example using generic coroutine
const coroutine = gen => {
  const generator = gen();
  const handle = res => {
    if(result.done) {
      return Promise.resolve(result.value);
    }
    return Promise.resolve(result.value)
    .then(res => handle(generator.next(res)))
  }
  return handle(generator.next());
}

const genericReq = coroutine(createObservible);
*/
