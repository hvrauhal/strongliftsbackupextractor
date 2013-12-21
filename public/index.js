$(function() {
  $(':button').click(function(e) {
    var formData = new FormData($('form')[0]);
    $.ajax({
      url: '/readfile',
      type: 'POST',
      xhr: function() {  // Custom XMLHttpRequest
        var myXhr = $.ajaxSettings.xhr();
        if(myXhr.upload){ // Check if upload property exists
          myXhr.upload.addEventListener('progress',progressHandlingFunction, false); // For handling the progress of the upload
        }
        return myXhr;
      },
      data: formData,
      cache: false,
      contentType: false,
      processData: false
    }).done(function (workouts) {
        $('#workouts').empty().append($('<ul>').append(workouts.map(printSession)))
      }
    );
  })

  function progressHandlingFunction(a,b,c) {
    console.log('pong', a, b, c)
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
})