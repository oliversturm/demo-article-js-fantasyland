const S = require('sanctuary');


const getConfigValue = name => json =>
  S.map
    (map =>
      S.maybe
        // (42) 
        ('<placeholder>')
        (S.I)
        (S.value
            (name)
            (map))
    )
    (S.encase
        (JSON.parse)
      (json));

// This works and returns the "thing" value
getConfigValue('thing')('{ "thing": "a thing" }'); //?

// This works and returns the placeholder
getConfigValue('other')('{ "thing": "a thing" }'); //?

// This fails with an error
getConfigValue('thing')('{ INVALID "thing": "a thing" }'); //?
