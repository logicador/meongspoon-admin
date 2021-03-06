
const tbodyBreedList = document.querySelector('.js-tbody-breed-list');
const inputName = document.querySelector('.js-input-name');
const selectType = document.querySelector('.js-select-type');
const buttonCancel = document.querySelector('.js-button-cancel');
const buttonBreedAdd = document.querySelector('.js-button-breed-add');
const buttonBreedSave = document.querySelector('.js-button-breed-save');
const buttonBreedAgeGroupAdd = document.querySelector('.js-button-breed-age-group-add');
const inputHiddenBId = document.querySelector('.js-input-hidden-b-id');
const inputHiddenOriginalBreedAgeGroupData = document.querySelector('.js-input-hidden-original-breed-age-group-data');

const inputHiddenBagId = document.querySelector('.js-input-hidden-bag-id');
const buttonWeakDiseaseAdd = document.querySelector('.js-button-weak-disease-add');
const tbodyWeakDiseaseList = document.querySelector('.js-tbody-breed-weak-disease-list');
// const inputCharacteristics = document.querySelector('.js-input-characteristics');

const inputBcAda = document.querySelector('.js-input-ada');
const inputBcAff = document.querySelector('.js-input-aff');
const inputBcApa = document.querySelector('.js-input-apa');
const inputBcBar = document.querySelector('.js-input-bar');
const inputBcCat = document.querySelector('.js-input-cat');
const inputBcKid = document.querySelector('.js-input-kid');
const inputBcDog = document.querySelector('.js-input-dog');
const inputBcExe = document.querySelector('.js-input-exe');
const inputBcTri = document.querySelector('.js-input-tri');
const inputBcHea = document.querySelector('.js-input-hea');
const inputBcInt = document.querySelector('.js-input-int');
const inputBcJok = document.querySelector('.js-input-jok');
const inputBcHai = document.querySelector('.js-input-hai');
const inputBcSoc = document.querySelector('.js-input-soc');
const inputBcStr = document.querySelector('.js-input-str');
const inputBcDom = document.querySelector('.js-input-dom');
const inputBcTra = document.querySelector('.js-input-tra');
const inputBcPro = document.querySelector('.js-input-pro');

let originalBagIdList = [];


function getBreedList() {
    fetch('/api/breed/get/all')
    .then((data) => { return data.json(); })
    .then((response) => {

        if (response.status != 'OK') {
            alert('????????? ??????????????????.');
            return;
        }

        let breedList = response.result;
        let html = '';
        for (let i = 0; i < breedList.length; i++) {
            let breed = breedList[i];
            html += '<tr class="js-tr-breed" bId="' + breed.b_id + '">';
            html +=     '<td>' + breed.b_id + '</td>';
            html +=     '<td>' + breed.b_name + '</td>';
            html +=     '<td class="buttons">';
            html +=         '<a href="/breed/detail/' + breed.b_id + '"><button class="default">?????????</button></a>';
            html +=         '<button class="js-button-remove default remove">??????</button>';
            html +=     '</td>';
            html += '</tr>';
        }

        tbodyBreedList.innerHTML = html;
        tbodyBreedList.querySelectorAll('.js-button-remove').forEach((buttonRemove) => {
            buttonRemove.addEventListener('click', function() {
                let bId = this.parentElement.parentElement.getAttribute('bId');
                removeBreed(bId);
            });
        });
    });
}


function getBreed(bId) {
    fetch('/api/breed/get?bId=' + bId)
    .then((data) => { return data.json(); })
    .then((response) => {
        if (response.status != 'OK') {
            alert('????????? ??????????????????.');
            return;
        }

        let breed = response.result.breed;
        let breedAgeGroupList = response.result.breedAgeGroupList;
        let breedCharacter = response.result.breedCharacter;

        inputName.value = breed.b_name;
        selectType.value = breed.b_type;

        let keywordList = breed.b_keyword.split('|');

        let html = '';
        for (let i = 0; i < keywordList.length; i++) {
            if (keywordList[i] === '') continue;
            html += '<button class="js-button-keyword default keyword">' + keywordList[i] + '</button>';
        }
        divKeywordAdd.insertAdjacentHTML('beforebegin', html);
        divKeywordList.querySelectorAll('.js-button-keyword').forEach((buttonKeyword) => {
            buttonKeyword.addEventListener('click', function() {
                this.remove();
            });
        });

        html = '';
        for (let i = 0; i < breedAgeGroupList.length; i++) {
            let breedAgeGroup = breedAgeGroupList[i];
            html += '<div class="js-div-breed-age-group breed-age-group" bagId="' + breedAgeGroup.bag_id + '">';
            html +=     '<label>MIN ??????</label><input class="js-input-min-age default" type="text" value="' + breedAgeGroup.bag_min_age + '" />';
            html +=     '<label class="center">~</label>';
            html +=     '<label>MAX ??????</label><input class="js-input-max-age default" type="text" value="' + breedAgeGroup.bag_max_age + '" />';
            html +=     '<div class="js-div-remove remove"><i class="fal fa-times"></i></div>';
            // html +=     '<a href="/breed/weak/disease/' + breedAgeGroup.bag_id + '"><div class="js-div-disease disease"><i class="fal fa-biohazard"></i></div></a>';
            html += '</div>';

            originalBagIdList.push(breedAgeGroup.bag_id);
        }
        buttonBreedAgeGroupAdd.insertAdjacentHTML('beforebegin', html);
        document.querySelectorAll('.js-div-breed-age-group').forEach((divBreedAgeGroup) => {
            divBreedAgeGroup.querySelector('.js-div-remove').addEventListener('click', function() {
                // if (!confirm('??????????????? ????????? ???????????? ???????????????. ?????????????????????????')) return;
                divBreedAgeGroup.remove();
            });
            divBreedAgeGroup.querySelectorAll('input').forEach((input) => {
                input.addEventListener('keyup', checkNumber);
            });
        });

        inputBcAda.value = breedCharacter.bc_ada;
        inputBcAff.value = breedCharacter.bc_aff;
        inputBcApa.value = breedCharacter.bc_apa;
        inputBcBar.value = breedCharacter.bc_bar;
        inputBcCat.value = breedCharacter.bc_cat;
        inputBcKid.value = breedCharacter.bc_kid;
        inputBcDog.value = breedCharacter.bc_dog;
        inputBcExe.value = breedCharacter.bc_exe;
        inputBcTri.value = breedCharacter.bc_tri;
        inputBcHea.value = breedCharacter.bc_hea;
        inputBcInt.value = breedCharacter.bc_int;
        inputBcJok.value = breedCharacter.bc_jok;
        inputBcHai.value = breedCharacter.bc_hai;
        inputBcSoc.value = breedCharacter.bc_soc;
        inputBcStr.value = breedCharacter.bc_str;
        inputBcDom.value = breedCharacter.bc_dom;
        inputBcTra.value = breedCharacter.bc_tra;
        inputBcPro.value = breedCharacter.bc_pro;
    });
}


function removeBreed(bId) {
    if (!confirm('?????? ?????????????????????????')) return;

    fetch('/api/breed/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bId: bId })
    })
    .then((data) => { return data.json(); })
    .then((response) => {
        if (response.status != 'OK') {
            if (response.status == 'ERR_EXISTS_PET') {
                alert('????????? ??? ???????????? ???????????????.');
            } else if (response.status == 'ERR_EXISTS_BREED_AGE_GROUP') {
                alert('????????? ????????? ????????? ????????? ???????????????.');
            } else {
                alert('????????? ??????????????????.');
            }
            return;
        }

        alert('????????? ?????????????????????.');
        tbodyBreedList.querySelector('.js-tr-breed[bId="' + bId + '"]').remove();
    });
}


function saveBreed(mode, callback) {
    let name = inputName.value.trim();

    if (name === '') {
        alert('?????? ????????? ??????????????????.');
        return;
    }

    let keywordList = [];
    divKeywordList.querySelectorAll('.js-button-keyword').forEach((buttonKeyword) => {
        keywordList.push(buttonKeyword.innerText);
    });

    let reName = removeSpace(name, '');
    if (!keywordList.includes(name)) {
        keywordList.push(name);
    }
    if (!keywordList.includes(reName)) {
        keywordList.push(reName);
    }

    // if (keywordList.length == 0) {
    //     alert('?????? ????????? ???????????? ??????????????????.');
    //     return;
    // }

    let keyword = keywordList.join('|');

    let isBreedAgeGroupValid = true;
    let breedAgeGroupList = [];
    let divBreedAgeGroupList = document.querySelectorAll('.js-div-breed-age-group');
    divBreedAgeGroupList.forEach((divBreedAgeGroup) => {
        let bagId = divBreedAgeGroup.getAttribute('bagId');
        let minAge = divBreedAgeGroup.querySelector('.js-input-min-age').value;
        let maxAge = divBreedAgeGroup.querySelector('.js-input-max-age').value;
        breedAgeGroupList.push({ bagId: bagId, minAge: minAge, maxAge: maxAge });
        if (minAge.trim() === '' || maxAge.trim() === '') {
            isBreedAgeGroupValid = false;
            return false;
        }
    });

    if (!isBreedAgeGroupValid) {
        alert('?????? ???????????? ?????? MIN?????? ?????? MAX????????? ??????????????????.');
        return;
    }

    // breed_detail??? ?????? ????????? ????????? ???????????????
    let deleteBreedAgeGroupList = [];
    if (menu == 'breed_detail') {
        for (let i = 0; i < originalBagIdList.length; i++) {
            let bagId = originalBagIdList[i];
            let isFind = false;
            for (let j = 0; j < breedAgeGroupList.length; j++) {
                let searchBagId = breedAgeGroupList[j].bagId;
                if (bagId == searchBagId) {
                    isFind = true;
                    break;
                }
            }
            if (!isFind) deleteBreedAgeGroupList.push(bagId);
        }
    }

    let bcAda = getBreedCharacter(inputBcAda.value);
    let bcAff = getBreedCharacter(inputBcAff.value);
    let bcApa = getBreedCharacter(inputBcApa.value);
    let bcBar = getBreedCharacter(inputBcBar.value);
    let bcCat = getBreedCharacter(inputBcCat.value);
    let bcKid = getBreedCharacter(inputBcKid.value);
    let bcDog = getBreedCharacter(inputBcDog.value);
    let bcExe = getBreedCharacter(inputBcExe.value);
    let bcTri = getBreedCharacter(inputBcTri.value);
    let bcHea = getBreedCharacter(inputBcHea.value);
    let bcInt = getBreedCharacter(inputBcInt.value);
    let bcJok = getBreedCharacter(inputBcJok.value);
    let bcHai = getBreedCharacter(inputBcHai.value);
    let bcSoc = getBreedCharacter(inputBcSoc.value);
    let bcStr = getBreedCharacter(inputBcStr.value);
    let bcDom = getBreedCharacter(inputBcDom.value);
    let bcTra = getBreedCharacter(inputBcTra.value);
    let bcPro = getBreedCharacter(inputBcPro.value);

    fetch('/api/breed/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            mode: mode,
            name: name,
            keyword: keyword,
            breedAgeGroups: breedAgeGroupList,
            deleteBreedAgeGroups: deleteBreedAgeGroupList,
            bType: selectType.value,

            bcAda: bcAda, bcAff: bcAff, bcApa: bcApa, bcBar: bcBar, bcCat: bcCat, bcKid: bcKid,
            bcDog: bcDog, bcExe: bcExe, bcTri: bcTri, bcHea: bcHea, bcInt: bcInt, bcJok: bcJok,
            bcHai: bcHai, bcSoc: bcSoc, bcStr: bcStr, bcDom: bcDom, bcTra: bcTra, bcPro: bcPro,

            bId: (mode === 'MODIFY') ? inputHiddenBId.value : ''
        })
    })
    .then(function(data) { return data.json(); })
    .then(function(response) {
        if (response.status != 'OK') {
            alert('????????? ??????????????????.');
            return;
        }

        callback(response);
    });
}


function getBreedWeakDiseaseList() {
    // ORDER BY bcs
    fetch('/api/breed/weak/disease/get?bagId=' + inputHiddenBagId.value)
    .then((data) => { return data.json(); })
    .then((response) => {
        if (response.status != 'OK') {
            alert('????????? ??????????????????.');
            return;
        }

        let weakDiseaseList = response.result;
        let html = '';
        for (let i = 0; i < weakDiseaseList.length; i++) {
            let weakDisease = weakDiseaseList[i];
            html += '<tr class="js-tr-weak-disease" mbagdId="' + weakDisease.mbagd_id + '">';
            html +=     '<td>' + weakDisease.mbagd_id + '</td>';
            html +=     '<td>' + weakDisease.d_name + '(' + weakDisease.mbagd_d_id + ')</td>';
            html +=     '<td>' + weakDisease.mbagd_bcs + '</td>';
            html +=     '<td class="buttons">';
            html +=         '<button class="js-button-remove default remove">??????</button>';
            html +=     '</td>';
            html += '</tr>';
        }

        tbodyWeakDiseaseList.innerHTML = html;
        tbodyWeakDiseaseList.querySelectorAll('.js-button-remove').forEach((buttonRemove) => {
            buttonRemove.addEventListener('click', function() {
                let mbagdId = this.parentElement.parentElement.getAttribute('mbagdId');
                removeWeakDisease(mbagdId);
            });
        });
    });
}


function removeWeakDisease(mbagdId) {
    if (!confirm('?????? ?????????????????????????')) return;

    fetch('/api/breed/weak/disease/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mbagdId: mbagdId })
    })
    .then((data) => { return data.json(); })
    .then((response) => {
        if (response.status != 'OK') {
            alert('????????? ??????????????????.');
            return;
        }

        alert('??????????????? ?????????????????????.');
        tbodyWeakDiseaseList.querySelector('.js-tr-weak-disease[mbagdId="' + mbagdId + '"]').remove();
    });
}


function addWeakDisease(dId, bcs) {
    fetch('/api/breed/weak/disease/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            bagId: inputHiddenBagId.value,
            dId: dId,
            bcs: bcs
        })
    })
    .then((data) => { return data.json(); })
    .then((response) => {
        if (response.status != 'OK') {
            alert('????????? ??????????????????.');
            return;
        }

        alert('??????????????? ?????????????????????.');
        location.reload();
    });
}


function getDiseaseList(callback) {
    fetch('/api/disease/get/all')
    .then((data) => { return data.json(); })
    .then((response) => {
        if (response.status != 'OK') {
            alert('????????? ??????????????????.');
            return;
        }
        callback(response.result);
    });
}


function getBreedCharacter(value) {
    value = parseInt(value);
    if (value < 0 || value > 5) {
        return 0;
    }
    return value;
}


function initBreed() {
    if (menu == 'breed') {
        getBreedList();
    } else if (menu == 'breed_detail') {
        getBreed(inputHiddenBId.value);
    } else if (menu == 'breed_weak_disease') {
        getBreedWeakDiseaseList();
    }

    if (buttonCancel) {
        buttonCancel.addEventListener('click', () => {
            location.href = '/breed';
        });
    }

    if (buttonBreedAdd) {
        buttonBreedAdd.addEventListener('click', () => {
            createOverlay(999, 'SAVE_BREED');
            createSpinner(999, 'SAVE_BREED');
            saveBreed('ADD', (response) => {
                let bId = response.bId;

                // if (inputCharacteristics.value) { // ???????????? ????????? ????????????
                //     let form = inputCharacteristics.parentElement;
                //     let formData = new FormData(form);
                //     formData.append('bId', bId);
                //
                //     fetch('/api/upload/breed/characteristics', {
                //         method: 'POST',
                //         body: formData
                //     })
                //     .then(data => data.json())
                //     .then((response) => {
                //         if (response.status != 'OK') {
                //             alert("????????? ??????????????????.");
                //             removeSpinner('SAVE_BREED');
                //             removeOverlay('SAVE_BREED');
                //             return;
                //         }
                //
                //         alert('????????? ?????????????????????.');
                //         location.href = '/breed';
                //     });
                // } else {
                    alert('????????? ?????????????????????.');
                    location.href = '/breed';
                // }
            });
        });
    }

    if (buttonBreedSave) {
        buttonBreedSave.addEventListener('click', () => {
            createOverlay(999, 'SAVE_BREED');
            createSpinner(999, 'SAVE_BREED');
            saveBreed('MODIFY', (response) => {
                alert('????????? ?????????????????????.');
                location.reload();
            });
        });
    }

    if (buttonBreedAgeGroupAdd) {
        buttonBreedAgeGroupAdd.addEventListener('click', () => {
            let html = '';
            html += '<div class="js-div-breed-age-group breed-age-group" bagId="0">';
            html +=     '<label>MIN ??????</label><input class="js-input-min-age default" type="text" />';
            html +=     '<label class="center">~</label>';
            html +=     '<label>MAX ??????</label><input class="js-input-max-age default" type="text" />';
            html +=     '<div class="js-div-remove remove"><i class="fal fa-times"></i></div>';
            html += '</div>';

            buttonBreedAgeGroupAdd.insertAdjacentHTML('beforebegin', html);

            let divBreedAgeGroupList = document.querySelectorAll('.js-div-breed-age-group');
            let divBreedAgeGroup = divBreedAgeGroupList[divBreedAgeGroupList.length - 1];
            divBreedAgeGroup.querySelector('.js-div-remove').addEventListener('click', function() {
                divBreedAgeGroup.remove();
            });
            divBreedAgeGroup.querySelectorAll('input').forEach((input) => {
                input.addEventListener('keyup', checkNumber);
            });
        });
    }

    if (buttonWeakDiseaseAdd) {
        buttonWeakDiseaseAdd.addEventListener('click', () => {
            document.querySelector('body').insertAdjacentHTML('beforeend', '<div class="js-div-overlay overlay" key="DIALOG_ADD_WEAK_DISEASE" style="z-index: 999;"></div>');

            let html = '';
            html += '<div class="js-div-dialog-add-weak-disease dialog-add-weak-disease">';
            html +=     '<div class="header">';
            html +=         '<h1 class="title">???????????? ??????</h1>';
            html +=         '<i class="js-i-close fal fa-times"></i>';
            html +=     '</div>';
            html +=     '<div class="body">';
            html +=         '<div class="form-box">';
            html +=             '<p>?????? ??????</p>';
            html +=             '<select class="js-select-disease default"></select>';
            html +=         '</div>';
            html +=         '<div class="form-box">';
            html +=             '<p>???????????? ??????</p>';
            html +=             '<select class="js-select-bcs default"></select>';
            html +=         '</div>';
            html +=     '</div>';
            html +=     '<div class="footer">';
            html +=         '<button class="js-button-add-weak-disease-cancel default">??????</button>';
            html +=         '<button class="js-button-add-weak-disease default">??????</button>';
            html +=     '</div>';
            html += '</div>';
            document.querySelector('body').insertAdjacentHTML('beforeend', html);

            let iClose = document.querySelector('.js-div-dialog-add-weak-disease .js-i-close');
            iClose.addEventListener('click', () => {
                document.querySelector('.js-div-overlay[key="DIALOG_ADD_WEAK_DISEASE"]').remove();
                document.querySelector('.js-div-dialog-add-weak-disease').remove();
            });

            let buttonAddWeakDiseaseCancel = document.querySelector('.js-div-dialog-add-weak-disease .js-button-add-weak-disease-cancel');
            buttonAddWeakDiseaseCancel.addEventListener('click', () => {
                document.querySelector('.js-div-overlay[key="DIALOG_ADD_WEAK_DISEASE"]').remove();
                document.querySelector('.js-div-dialog-add-weak-disease').remove();
            });

            let selectDisease = document.querySelector('.js-div-dialog-add-weak-disease .js-select-disease');
            let selectBcs = document.querySelector('.js-div-dialog-add-weak-disease .js-select-bcs');

            getDiseaseList((diseaseList) => {
                let html = '';
                for (let i = 0; i < diseaseList.length; i++) {
                    let disease = diseaseList[i];
                    html += '<option value="' + disease.d_id + '" ' + ((i == 0) ? 'selected' : '') + '>' + disease.d_name + '(' + disease.d_id + ')</option>';
                }
                selectDisease.innerHTML = html;
            });

            html = '';
            for (let i = 1; i < 6; i++) {
                html += '<option value="' + i + '" ' + ((i == 1) ? 'selected' : '') + '>' + i + '</option>';
            }
            selectBcs.innerHTML = html;

            let buttonAddWeakDisease = document.querySelector('.js-div-dialog-add-weak-disease .js-button-add-weak-disease');
            buttonAddWeakDisease.addEventListener('click', () => {
                let dId = selectDisease.value;
                let bcs = selectBcs.value;
                addWeakDisease(dId, bcs);
            });
        });
    }

}
initBreed();
