
const tbodyPetList = document.querySelector('.js-tbody-pet-list');


function getPetList() {
    fetch('/api/pet/get/all')
    .then((data) => { return data.json(); })
    .then((response) => {

        if (response.status != 'OK') {
            alert('에러가 발생했습니다.');
            return;
        }

        let petList = response.result;
        let html = '';
        for (let i = 0; i < petList.length; i++) {
            let pet = petList[i];
            html += '<tr class="js-tr-pet" peId="' + pet.pe_id + '">';
            html +=     '<td>' + pet.pe_id + '</td>';
            html +=     '<td>' + pet.u_nick_name + '</td>';
            html +=     '<td>' + pet.b_name + '</td>';
            html +=     '<td>' + pet.pe_name + '</td>';
            html +=     '<td>' + pet.pe_birth + '</td>';
            html +=     '<td class="buttons">';
            html +=         '<a href="/pet/detail/' + pet.pe_id + '"><button class="default">자세히</button></a>';
            html +=     '</td>';
            html += '</tr>';
        }

        tbodyPetList.innerHTML = html;
    });
}


function initPet() {
    if (menu == 'pet') {
        getPetList();
    }
}
initPet();
