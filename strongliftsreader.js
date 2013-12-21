var sqlite3 = require('sqlite3').verbose(),
  async = require('async'),
  _ = require('lodash')

function readStrongliftsSqlite(filename, cb) {
  var db = new sqlite3.Database(filename, sqlite3.OPEN_READONLY)
  db.all("SELECT strftime('%Y-%m-%dT%H:%M:%SZ', ZDATE, 'unixepoch', '+31 years') sessiondate, ZNUMBER, ZNOTE, ZBODYWEIGHT, Z_PK from ZSESSION order by ZNUMBER", function (err, sessions) {
    if(err) return cb(err)
    async.map(sessions, populateSessionWithExercises, function (err, filledSessions) {
      try {
        db.close()
      } catch (e) {
      }
      if (err) return cb(err)
      cb(null, filledSessions.map(jsonifySession))
    })

    function jsonifySession(s) {
      return {
        date: s.sessiondate,
        n: s.ZNUMBER,
        notes: s.ZNOTE || '',
        bodyweight: s.ZBODYWEIGHT,
        exercises: s.exercises.map(jsonifyExercise)
      }
      function jsonifyExercise(e) {
        return {
          n: e.ZNUMBER,
          weight: e.ZWEIGHT,
          name: e.ZNAME,
          sets: _.pluck(e.sets, 'ZREPS'),
          totalweight: e.ZTOTALWEIGHT
        }
      }
    }

    function populateSessionWithExercises(session, sessionCallback) {
      db.all('select ZNUMBER, ZTOTALWEIGHT, ZWEIGHT, ZNAME, Z_PK from ZEXERCISE where ZBELONGSTOSESSION = ? order by ZNUMBER', session.Z_PK,
        function (err, exercises) {
          if (err) return sessionCallback(err)
          async.map(exercises, populateExerciseWithSets, function (err, filledExercises) {
            if (err) return sessionCallback(err)
            sessionCallback(null, _.assign({}, session, {exercises: filledExercises}))
          })
          function populateExerciseWithSets(exercise, exerciseCb) {
            db.all('select ZNUMBER, ZREPS, Z_PK from ZSET where ZINEXERCISE = ? order by ZNUMBER', exercise.Z_PK, function (err, sets) {
              if (err) return exerciseCb(err)
              exerciseCb(null, _.assign({}, exercise, {sets: sets}))
            })
          }
        })
    }
  })
}

exports.readStrongliftsSqlite = readStrongliftsSqlite

if (require.main === module) {
  readStrongliftsSqlite(process.argv[2], function (err, contents) {
    console.log(JSON.stringify(contents))
  })
}

