const sanctuary = require('sanctuary');
const $ = require('sanctuary-def');
const F = require('fluture');
const { env: flutureEnv } = require('fluture-sanctuary-types');
const S = sanctuary.create
  ({
    checkTypes: true,
    env: sanctuary.env.concat
      (flutureEnv)
  });

const fetch = require('isomorphic-fetch');

const getData = S.pipe
  ([
    F.encaseP
      (fetch),
    S.chain
      (res =>
        res.ok
          ? F.attemptP
              (res.json.bind
                  (res))
          : F.reject
              (`HTTP error ${res.status}: ${res.statusText}`)
      ),
    S.map
      (S.value
          ('data'))
  ]);

const calc = S.compose
  (S.justs)
  (S.map
      (item =>
        S.unchecked.sequence
          (S.Maybe)
          ({
            name: S.unchecked.value
              ('name')
              (item),
            populationPerKM2: S.lift2
              (S.div)
              (S.filter
                  (x => x > 0)
                  (S.unchecked.value
                      ('areaKM2')
                      (item)))
              (S.unchecked.value
                  ('population')
                  (item))
          })
      ));
      
F.fork
  (x => {
    console.error
      ('Error: ',
        x);
  })
  (data => {
    console.log
      ('Data: ',
        data);
  })
  (S.compose
      (S.map
          (S.map
              (calc)))
      (getData)
      ('http://outlier.oliversturm.com:8080/countries'));

