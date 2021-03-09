
const tbodyUserList = document.querySelector('.js-tbody-user-list');


function getUserList() {
    fetch('/api/user/get/all')
    .then((data) => { return data.json(); })
    .then((response) => {

        if (response.status != 'OK') {
            alert('에러가 발생했습니다.');
            return;
        }

        let userList = response.result;
        let html = '';
        for (let i = 0; i < userList.length; i++) {
            let user = userList[i];
            html += '<tr class="js-tr-user" uId="' + user.u_id + '">';
            html +=     '<td>' + user.u_id + '</td>';
            html +=     '<td>' + user.u_type + '</td>';
            html +=     '<td>' + user.u_nick_name + '</td>';
            html +=     '<td class="' + user.u_is_logined + '">' + ((user.u_is_logined == 'Y') ? '로그인' : '로그아웃') + '</td>';
            html +=     '<td>' + user.u_level + '</td>';
            html +=     '<td>' + user.u_status + '</td>';
            html +=     '<td>' + user.u_created_date + '</td>';
            html +=     '<td class="buttons">';
            html +=         '<a href="/user/detail/' + user.u_id + '"><button class="default">자세히</button></a>';
            html +=     '</td>';
            html += '</tr>';
        }

        tbodyUserList.innerHTML = html;
    });
}


function initUser() {
    if (menu == 'user') {
        getUserList();
    }
}
initUser();
