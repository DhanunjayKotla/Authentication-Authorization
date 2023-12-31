$('.phonelogin').click(function () {
    getloginform('phone')
})

$('.emaillogin').click(function () {
    getloginform('email')
})

$('.emailsignup').click(function () {
    getsignupform('email')
})

$('.phonesignup').click(function () {
    getsignupform('phone')
})

function getloginform(type) {
    $('.container').empty();
    $('.container').append(`<form action="/login" method="POST">
                                <p class="err"></p>
                                <input type="text" placeholder=${type} class="input ${type}input" name="username">
                                <input type="password" placeholder="password" class="input passwordinput" name="password">
                                <input type="text" name="type" value=${type} style="display: none">
                                <input type="submit" class="submitbtn submitform">
                            </form>`)
}

function getsignupform(type) {
    $('.container').empty();
    $('.container').append(`<form action="/signup" method="POST">
                                <p class="err"></p>
                                <input type="text" placeholder=${type} class="input ${type}input" name="username">
                                <input type="password" placeholder="password" class="input passwordinput" name="password">
                                <input type="password" placeholder="confirm password" class="input conpasswordinput">
                                <input type="text" name="type" value=${type} style="display: none">
                                <input type="submit" class="submitbtn submitform">
                            </form>`)
}

$('.container').on('focus', '.phoneinput', function () {
    !validatephone($(this).val()) && $(this).addClass('invalid')
})
$('.container').on('focus', '.emailinput', function () {
    !validateemail($(this).val()) && $(this).addClass('invalid')
})

$('.container').on('input', '.phoneinput', function () {
    validatephone() ? $(this).removeClass('invalid') : $(this).addClass('invalid');
})
$('.container').on('input', '.emailinput', function () {
    validateemail() ? $(this).removeClass('invalid') : $(this).addClass('invalid');
})

function validatephone() {
    return $('.phoneinput').val().length === 10 && !isNaN($('.phoneinput').val()) ? true : false
}
function validateemail() {
    return /^\S+@\S+\.\S+$/.test($('.emailinput').val()) ? true : false
}
function validatepassword() {
    return $('.passwordinput').val().trim() === "" ? false : true
}

$('.container').on('click', '.submitform', function (e) {
    e.preventDefault()
    var err = $('.err');
    if ($('.emailinput').length === 0 && !validatephone()) {
        err.text('check your mobile number')
    } else if ($('.emailinput').length !== 0 && !validateemail()) {
        err.text('check your email')
    } else if (!validatepassword()) {
        err.text('enter valid password')
    } else if ($('.conpasswordinput').length !== 0 && $('.passwordinput').val() !== $('.conpasswordinput').val()) {
        err.text('passwords do not match!')
    } else {
        const type = $('.emailinput').length === 0 ? 'phone' : 'email'
        $.get('/user', { username: $(`.${type}input`).val() }, function (result) {
            if ($('form').attr('action') == '/signup' && result.length != 0) err.text('Already have an account with that username')
            else $('form').submit();
        })
    }
})

function getotphtml(client, type) {
    const c = type === 'email' ? client.email : client.phone
    $('.container').empty()
    $('.container').append(`<h3>Autheticate your account</h3>
                            <p>Your protection is our top priority. Please confirm your<br> account by entering the autherization code sent to <br> ${c}</p>
                            <form action="/codeVerify" method="POST">
                                <input type="text" class="partitioned" name="code" maxlength="6" onkeyup="if(this.value.length == 6) this.blur()" onfocus="if(this.value.length == 3) this.blur()" autofocus>
                                <input type="submit" class="submitbtn" value="verify and signin">
                                <input type="text" value=${client._id} style="display:none" name="clientId">
                            </form>`)
}
