var express = require("express"),
  logfmt = require("logfmt"),
  path = require('path'),
  reader = require('./strongliftsreader.js'),
  fs = require('fs'),
  app = express()

app.configure(function () {
  app.use(express.favicon())
  app.use(express.bodyParser())
  app.use(logfmt.requestLogger())
  app.use(app.router)
  app.use(express.static(path.join(__dirname, 'public')))
})

app.post('/readfile', function (req, res, next) {
  var filename = req.files.sqlitefile.path
  console.log(filename)
  reader.readStrongliftsSqlite(filename, function (err, workouts) {
    if (err) return next(err)
    res.send(workouts)
    fs.unlink(filename)
  })
})


var port = process.env.PORT || 5000
app.listen(port, function () {
  console.log("Listening on " + port);
})