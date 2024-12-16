(function ($) {
    let signInForm = $('#signin-form'),
        signUpForm = $('#signup-form');


    function checkString (strVal, varName, allowEmpty=false) {
        if (typeof strVal === "undefined") {//we're using typeof since false === undefined. This avoids that.
            throw new Error(`Error: ${varName} is undefined`);
        }
        if (strVal === null) {
            throw new Error(`Error: ${varName} is null`);
        }
        if (typeof strVal !== 'string') throw new Error(`Error: ${varName} must be a string!`);
        strVal = $.trim(strVal);
        if (strVal.length === 0 && !allowEmpty)
            throw new Error(`Error: ${varName} is empty when it shouldn't be`);
        return strVal;
    }

    signUpForm.submit(function (event){
        console.log("Hello")
        let error = $('clientError'),
            usernameElem = $('useranme'),
            passwordElem = $('password'),
            confirmPasswordElem = $('confirmPassword');

        error.hide();
        let errors = [];

        let username = usernameElem.val(),
            password = passwordElem.val(),
            confirmPassword = confirmPasswordElem.val();

        //Same Error checking as /data/users.js
        try{
            checkString(username, "username");
            if(username.includes(" ")) errors.append("Error: Username cannot contain spaces!");
            for (let x of username){
                let y = x.charCodeAt(0);
                if (((y >= 0) && (y < 48)) || ((y > 57) && (y < 65)) || ((y > 90) && (y < 97)) || (y > 122) ) throw new Error("Error: Username can only contain letters, numbers, or underscores")
            }
        } catch(e){
            errors.append(e.message)
        }

        try{
            checkString(password, "password");
            if(password.includes(" ")) errors.append("Error: Password cannot contain spaces!");
        
            if(password.length < 8) errors.append("Error: Password is too short (must be between 8-64 characters)!");
            if(password.length > 64) errors.append("Error: Password is too long (must be between 8-64 characters)!");
        
            let hasNum = false;
            let hasLower = false;
            let hasUpper = false;
            let hasSpecial = false;
            
            for(let x of password){
                let y = x.charCodeAt(0);
                if((y > 47) && (y < 58)) hasNum = true;
        
                if((y > 96) && (y < 123)) hasLower = true;
        
                if((y > 64) && (y < 91)) hasUpper = true;
        
                if(((y > 32) && (y < 48)) || ((y > 57) && (y < 65)) || ((y > 90) && (y < 97)) || (y > 122)) hasSpecial = true;
            }
        
            if(!hasNum || !hasLower || !hasUpper || !hasSpecial) throw new Error("Error: Password must contain 1 lowercase letter, 1 uppercase letter, 1 special character, and 1 number");
        } catch(e){
            errors.append(e.message);
        }

        try{
            checkString(confirmPassword, "confirmPassword")
            if (confirmPassword !== password) throw "Error: Passwords do not match!"

        } catch(e) {
            errors.append(e.message);
        }

        if(errors.length >= 1){
            event.preventDefault();
            error.empty();
            error.show();

            let myUl = $(`<ul></ul>`);

            for (let x of errors){
                let element = $(`<li>${x}</li>`)
                myUl.append(element);
            }

            error.append(myUl);
        }
    })

    signInForm.submit(function (event){
        let error = $('client-error')
    })



})