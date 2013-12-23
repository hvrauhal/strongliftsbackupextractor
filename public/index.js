$(function() {
  $(':button').click(function(e) {
    var formData = new FormData($('form')[0]);
    $.ajax({
      url: '/readfile',
      type: 'POST',
      data: formData,
      cache: false,
      contentType: false,
      processData: false
    }).done(displayWorkouts('#workouts .results'))
  })
  function displayWorkouts(target) {
    return function (workouts) {
      console.log('First three', JSON.stringify(_.first(workouts, 3)))
      $(target).empty().append($('<ul>').append(workouts.map(printSession)))
    }
  }

  function printSession(session) {
    return $('<li>')
      .append($('<span>').addClass('date').text(new Date(session.date).toLocaleDateString()))
      .append(" ")
      .append($('<span>').addClass('time').text(new Date(session.date).toLocaleTimeString()))
      .append(" ")
      .append($('<span>').addClass('bodyweight').text(session.bodyweight))
      .append(" ")
      .append($('<span>').addClass('notes').text(session.notes))
      .append($('<ul>').addClass('exercises').append(session.exercises.map(printExercise)))
  }
  function printExercise(exercise) {
    return $('<li>')
      .append($('<span>').addClass("name").text(exercise.name))
      .append(" ")
      .append($('<span>').addClass("weight").text(exercise.weight))
      .append(" ")
      .append($('<span>').addClass("sets").text(exercise.sets.map(function(s) {return s || '-'}). join(', ')))
  }

  $(document)
    .ajaxSend(function() {
      $('#workouts .loading').show()
      $('#workouts .example').hide()
    })
    .ajaxStop(function () {
      $('#workouts .loading').hide()
    })

  var samples = [{"date":"2013-09-14T11:10:15Z","n":1,"notes":"Felt good!","bodyweight":76,"exercises":[{"n":0,"weight":20,"name":"squats","sets":[5,5,5,5,5],"totalweight":0},{"n":1,"weight":20,"name":"benchpress","sets":[5,5,5,5,5],"totalweight":0},{"n":2,"weight":30,"name":"barbellrow","sets":[5,5,5,5,5],"totalweight":0}]},{"date":"2013-09-16T05:03:12Z","n":2,"notes":"The shoulderpress felt quite heavy with just the bar","bodyweight":76,"exercises":[{"n":0,"weight":22.5,"name":"squats","sets":[5,5,5,5,5],"totalweight":0},{"n":1,"weight":20,"name":"overheadpress","sets":[5,5,5,5,5],"totalweight":0},{"n":2,"weight":40,"name":"deadlifts","sets":[5,null,0,0,0],"totalweight":0}]},{"date":"2013-09-18T05:21:10Z","n":3,"notes":"The Bench press feels good","bodyweight":76,"exercises":[{"n":0,"weight":25,"name":"squats","sets":[5,5,5,5,5],"totalweight":0},{"n":1,"weight":22.5,"name":"benchpress","sets":[5,5,5,5,5],"totalweight":0},{"n":2,"weight":32.5,"name":"barbellrow","sets":[5,5,5,5,5],"totalweight":0}]}]
  displayWorkouts('#workouts .example .exampleworkout')(samples)
})
