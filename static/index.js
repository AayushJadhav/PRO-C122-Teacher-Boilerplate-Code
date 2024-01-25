var date = new Date()
let display_date = "Date:" + date.toLocaleDateString()

let predicted_emotion;

$(document).ready(function () {
    $("#display_date").html(display_date)
    $('#save_button').prop('disabled', true);
    displayBot()
})

$(function () {
    $("#predict_button").click(function () {

        let input_data = {
            "text": $("#text").val()
        }
        $.ajax({
            type: 'POST',
            url: "/predict-emotion",
            data: JSON.stringify(input_data),
            dataType: "json",
            contentType: 'application/json',
            success: function (result) {

                predicted_emotion = result.data.predicted_emotion
                emotion_img_url=result.data.predicted_emotion_img_url
                
                //Send the predicted emotion and image url to HTML
                $("#prediction").html(predicted_emotion)
                $("#emo_img_url").attr('src', emotion_img_url);

                //Set the display 
                $('#prediction').css("display", "");
                $('#emo_img_url').css("display", "");

               //Enable the Save Button
                $('#save_button').prop('disabled', false);
            },
            error: function (result) {
                alert(result.responseJSON.message)
            }
        });
    });

    $("#save_button").click(function () {
        save_data = {
            "date": display_date,
            "text": $("#text").val(),
            "emotion": predicted_emotion
        }
        $.ajax({
            type: 'POST',
            url: "/save-entry",
            data: JSON.stringify(save_data),
            dataType: "json",
            contentType: 'application/json',
            success: function () {
                alert("Your entry has been saved successfully!")
                window.location.reload()
            },
            error: function (result) {
                alert(result.responseJSON.message)
            }
        });

    });
})



function displayBot() {
    $('.chatbox__button').click(function () {
        $('.chatbox__chat').toggle()
    });
    //Start Conversation with Bot
    askBot()
}

//askBot function
function askbot() {
    $("#send_button").click(function(){
        var user_text = $("#bot_input_text").val()

        if (user_text != "") {
            $("#chat_messages").append('<div class="user__messages>' + user_text + '</div>')
        }

        $("#bot_input_text").val("")

        chat_input_data = {
            "user_text": user_text
        }

        $.ajax({
            type: 'POST',
            url: '/bot-response',
            data: JSON.stringify(chat_input_data),
            dataType: 'json',
            contentType: 'application/json',
            success: function (result) {
                $("#chat_messages").append('<div class="bot__messages">' + result.bot_response + '</div>')

                $(".chatbox__messages__cotainer").animate({ scrollTop: $(".chatbox__messages__cotainer")[0].scrollHeight }, 1000)
            },
            error: function (result) {
                alert(result.responseJSON.message)
            }
        })
    })

    $("#bot_input_text").keypress(function (e) {
        if (e.keyCode == 13) {
            $("#send_button").click()
        }
        /** Alt.
        if (e.which == 13) {
            $("#send_button").click()
        }
        */
    })
}
       
