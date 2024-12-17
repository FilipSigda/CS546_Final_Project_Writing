$('#addchapter').on('click', (event) =>
    {
        event.preventDefault();
        var l = $('#chapterList').length;
        var element = `<li><input type="text" id="${'ch' + l}" name="Chapter ${l}" value="Title"></input><textarea name="body${l}" rows="10" cols="100"> </textArea></li>`
        $('#chapterList').append(element);
    });