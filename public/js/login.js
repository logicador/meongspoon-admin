
const inputId = document.querySelector('.js-input-id');
const inputPassword = document.querySelector('.js-input-password');
const buttonLogin = document.querySelector('.js-button-login');


function initLogin() {

    buttonLogin.addEventListener('click', function() {
        
        let id = inputId.value.trim();
        let password = inputPassword.value.trim();
        
        if (id === '' || password === '') return;

        fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: id,
                password: password
            })
        })
        .then((data) => { return data.json(); })
        .then((response) => {
            if (response.status != 'OK') {
                alert('로그인 실패');
                return;
            }
            location.href = '/';
        });

    });
    
}
initLogin();
