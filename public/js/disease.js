
const tbodyDiseaseList = document.querySelector('.js-tbody-disease-list');
const inputName = document.querySelector('.js-input-name');
const textareaReason = document.querySelector('.js-textarea-reason');
const textareaManagement = document.querySelector('.js-textarea-management');
const buttonCancel = document.querySelector('.js-button-cancel');
const buttonDiseaseAdd = document.querySelector('.js-button-disease-add');
const buttonDiseaseSave = document.querySelector('.js-button-disease-save');
const selectOperation = document.querySelector('.js-select-operation');
const inputHiddenDId = document.querySelector('.js-input-hidden-d-id');
const divFoodNutrientList = document.querySelector('.js-div-food-nutrient-list');
const buttonFoodNutrientAdd = document.querySelector('.js-button-food-nutrient-add');
const divSymptomList = document.querySelector('.js-div-symptom-list');
const buttonSymptomAdd = document.querySelector('.js-button-symptom-add');


function getDiseaseList() {
    fetch('/api/disease/get/all')
    .then((data) => { return data.json(); })
    .then((response) => {

        if (response.status != 'OK') {
            alert('에러가 발생했습니다.');
            return;
        }

        let diseaseList = response.result;
        let html = '';
        for (let i = 0; i < diseaseList.length; i++) {
            let disease = diseaseList[i];
            html += '<tr class="js-tr-disease" dId="' + disease.d_id + '">';
            html +=     '<td>' + disease.d_id + '</td>';
            html +=     '<td>' + disease.d_name + '</td>';
            html +=     '<td>' + idToBodyPart(disease.d_bp_id) + '(' + disease.d_bp_id + ')</td>';
            html +=     '<td>' + noneToDash(disease.d_reason) + '</td>';
            html +=     '<td>' + noneToDash(disease.d_management) + '</td>';
            html +=     '<td class="buttons">';
            html +=         '<a href="/disease/detail/' + disease.d_id + '"><button class="default">자세히</button></a>';
            html +=         '<button class="js-button-remove default remove">삭제</button>';
            html +=     '</td>';
            html += '</tr>';
        }

        tbodyDiseaseList.innerHTML = html;

        tbodyDiseaseList.querySelectorAll('.js-button-remove').forEach((buttonRemove) => {
            buttonRemove.addEventListener('click', function() {
                let dId = this.parentElement.parentElement.getAttribute('dId');
                removeDisease(dId);
            });
        });
    });
}


function getDisease(dId) {
    fetch('/api/disease/get?dId=' + dId)
    .then((data) => { return data.json(); })
    .then((response) => {
        if (response.status != 'OK') {
            alert('에러가 발생했습니다.');
            return;
        }

        let disease = response.result.disease;
        let foodNutrientList = response.result.nutrientFoodList;
        let symptomList = response.result.symptomList;

        inputName.value = disease.d_name;
        selectBodyPart.value = disease.d_bp_id;
        textareaReason.value = disease.d_reason;
        textareaManagement.value = disease.d_management;
        selectOperation.value = disease.d_operation;

        let keywordList = disease.d_keyword.split('|');

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
        for (let i = 0; i < foodNutrientList.length; i++) {
            let dataType = foodNutrientList[i].mdnf_type;
            if (dataType == 'FOOD') {
                let fId = foodNutrientList[i].f_id;
                let fName = foodNutrientList[i].f_name;
                html += '<button class="js-button-food-nutrient relationship default" fId="' + fId + '" dataType="FOOD">' + fName + ' <span>(음식)</span></button>';
            } else {
                let nId = foodNutrientList[i].n_id;
                let nName = foodNutrientList[i].n_name;
                html += '<button class="js-button-food-nutrient relationship default" nId="' + nId + '" dataType="NUTRIENT">' + nName + ' <span>(영양소)</span></button>';
            }
        }
        buttonFoodNutrientAdd.insertAdjacentHTML('beforebegin', html);

        divFoodNutrientList.querySelectorAll('.js-button-food-nutrient').forEach((buttonFoodNutrient) => {
            buttonFoodNutrient.addEventListener('click', function() {
                this.remove();
            });
        });

        html = '';
        for (let i = 0; i < symptomList.length; i++) {
            let sId = symptomList[i].s_id;
            let sName = symptomList[i].s_name;
            html += '<button class="js-button-symptom relationship default" sId="' + sId + '">' + sName + '</button>';
        } 
        buttonSymptomAdd.insertAdjacentHTML('beforebegin', html);

        divSymptomList.querySelectorAll('.js-button-symptom').forEach((buttonSymptom) => {
            buttonSymptom.addEventListener('click', function() {
                this.remove();
            });
        });
    });
}


function removeDisease(dId) {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    fetch('/api/disease/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dId: dId })
    })
    .then((data) => { return data.json(); })
    .then((response) => {
        if (response.status != 'OK') {
            if (response.status == 'ERR_EXISTS_SYMPTOM') {
                alert('연관된 증상 데이터가 존재합니다.');
            } else if (response.status == 'ERR_EXISTS_PRODUCT') {
                alert('연관된 제품 데이터가 존재합니다.');
            } else if (response.status == 'ERR_EXISTS_BREED_AGE_GROUP') {
                alert('연관된 견종별 나이대 그룹이 존재합니다.');
            } else {
                alert('에러가 발생했습니다.');
            }
            return;
        }

        alert('질병이 삭제되었습니다.');
        tbodyDiseaseList.querySelector('.js-tr-disease[dId="' + dId + '"]').remove();
    });
}


function saveDisease(mode, callback) {
    let name = inputName.value.trim();
    let reason = textareaReason.value.trim();
    let management = textareaManagement.value.trim();
    let bpId = selectBodyPart.value;

    if (name === '') {
        alert('질병 이름을 입력해주세요.');
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
    //     alert('질병 검색어 키워드를 입력해주세요.');
    //     return;
    // }

    let keyword = keywordList.join('|');

    let foodNutrientList = [];
    divFoodNutrientList.querySelectorAll('.js-button-food-nutrient').forEach((buttonFoodNutrient) => {
        let dataType = buttonFoodNutrient.getAttribute('dataType');
        foodNutrientList.push({ type: dataType, targetId: ((dataType == 'FOOD') ? buttonFoodNutrient.getAttribute('fId') : buttonFoodNutrient.getAttribute('nId')) });
    });

    let symptomList = [];
    divSymptomList.querySelectorAll('.js-button-symptom').forEach((buttonSymptom) => {
        symptomList.push(buttonSymptom.getAttribute('sId'));
    });

    fetch('/api/disease/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            mode: mode,
            name: name,
            bpId: bpId,
            keyword: keyword,
            reason: reason,
            management: management,
            nutrientFoodData: foodNutrientList,
            symptomData: symptomList,
            operation: selectOperation.value,
            dId: (mode === 'MODIFY') ? inputHiddenDId.value : ''
        })
    })
    .then(function(data) { return data.json(); })
    .then(function(response) {
        if (response.status != 'OK') {
            alert('에러가 발생했습니다.');
            return;
        }
        
        callback(response);
    });
}


function getFoodList(callback) {
    fetch('/api/food/get/all')
    .then((data) => { return data.json(); })
    .then((response) => {
        if (response.status != 'OK') {
            alert('에러가 발생했습니다.');
            return;
        }
        callback(response.result);
    });
}


function getNutrientList(callback) {
    fetch('/api/nutrient/get/all')
    .then((data) => { return data.json(); })
    .then((response) => {
        if (response.status != 'OK') {
            alert('에러가 발생했습니다.');
            return;
        }
        callback(response.result);
    });
}


function getSymptomList(callback) {
    fetch('/api/symptom/get/all')
    .then((data) => { return data.json(); })
    .then((response) => {
        if (response.status != 'OK') {
            alert('에러가 발생했습니다.');
            return;
        }
        callback(response.result);
    });
}


function initDisease() {
    if (menu == 'disease') {
        getDiseaseList();
    } else if (menu == 'disease_detail') {
        getDisease(inputHiddenDId.value);
    }

    if (buttonCancel) {
        buttonCancel.addEventListener('click', () => {
            location.href = '/disease';
        });
    }
    
    if (buttonDiseaseAdd) {
        buttonDiseaseAdd.addEventListener('click', () => {
            saveDisease('ADD', (response) => {
                alert('질병이 추가되었습니다.');
                location.href = '/disease';
            });
        });
    }

    if (buttonDiseaseSave) {
        buttonDiseaseSave.addEventListener('click', () => {
            saveDisease('MODIFY', (response) => {
                alert('질병이 수정되었습니다.');
            });
        });
    }

    if (buttonFoodNutrientAdd) {
        buttonFoodNutrientAdd.addEventListener('click', () => {
            document.querySelector('body').insertAdjacentHTML('beforeend', '<div class="js-div-overlay overlay" key="DIALOG_SEARCH_RELATIONSHIP" style="z-index: 999;"></div>');

            let html = '';
            html += '<div class="js-div-dialog-search-relationship dialog-search-relationship">';
            html +=     '<div class="header">';
            html +=         '<h1 class="title">음식 및 영양소 검색</h1>';
            html +=         '<i class="js-i-close fal fa-times"></i>';
            html +=     '</div>';
            html +=     '<div class="body">';
            html +=         '<div class="tab-wrapper">';
            html +=             '<div class="js-div-tab tab" dataType="FOOD">음식</div>';
            html +=             '<div class="js-div-tab tab" dataType="NUTRIENT">영양소</div>';
            html +=         '</div>';
            html +=         '<table class="data-list">';
            html +=             '<thead><tr class="js-tr-header"></tr></thead>';
            html +=             '<tbody class="js-tbody-food-nutrient-list"></tbody>';
            html +=         '</table>';
            html +=     '</div>';
            html += '</div>';
            document.querySelector('body').insertAdjacentHTML('beforeend', html);

            let iClose = document.querySelector('.js-div-dialog-search-relationship .js-i-close');
            iClose.addEventListener('click', () => {
                document.querySelector('.js-div-overlay[key="DIALOG_SEARCH_RELATIONSHIP"]').remove();
                document.querySelector('.js-div-dialog-search-relationship').remove();
            });

            document.querySelectorAll('.js-div-dialog-search-relationship .js-div-tab').forEach((divTab) => {
                divTab.addEventListener('click', function() {
                    if (this.classList.contains('selected')) return;

                    if (document.querySelector('.js-div-dialog-search-relationship .js-div-tab.selected')) {
                        document.querySelector('.js-div-dialog-search-relationship .js-div-tab.selected').classList.remove('selected');
                    }
                    this.classList.add('selected');

                    let dataType = divTab.getAttribute('dataType');
                    let trHeader = document.querySelector('.js-div-dialog-search-relationship .js-tr-header');
                    let tBodyFoodNutrientList = document.querySelector('.js-div-dialog-search-relationship .js-tbody-food-nutrient-list');
                    tBodyFoodNutrientList.innerHTML = '';

                    if (dataType == 'FOOD') {
                        let selectedFIdList = [];
                        divFoodNutrientList.querySelectorAll('.js-button-food-nutrient[dataType="FOOD"]').forEach((buttonFood) => {
                            selectedFIdList.push(parseInt(buttonFood.getAttribute('fId')));
                        });

                        trHeader.innerHTML = '<th>ID</th><th>이름</th><th>썸네일</th><th>설명</th>';
                        getFoodList((foodList) => {
                            let html = '';
                            for (let i = 0; i < foodList.length; i++) {
                                let food = foodList[i];
                                html += '<tr class="js-tr-food ' + ((selectedFIdList.indexOf(food.f_id) === -1) ? '': 'selected') + '" fId="' + food.f_id + '" fName="' + food.f_name + '" >';
                                html +=     '<td>' + food.f_id + '</td>';
                                html +=     '<td>' + food.f_name + '</td>';
                                html +=     '<td><div class="thumbnail" style="background-image: url(' + food.f_thumbnail + '), url(/img/no_image.png)"></div></td>';
                                html +=     '<td>' + noneToDash(food.f_desc) + '</td>';
                                html += '</tr>';
                            }
                            tBodyFoodNutrientList.innerHTML = html;

                            tBodyFoodNutrientList.querySelectorAll('.js-tr-food').forEach((trFood) => {
                                trFood.addEventListener('click', function() {
                                    let fId = this.getAttribute('fId');
            
                                    if (this.classList.contains('selected')) {
                                        this.classList.remove('selected');
                                        divFoodNutrientList.querySelector('.js-button-food-nutrient[dataType="FOOD"][fId="' + fId + '"]').remove();
                                        
                                    } else {
                                        this.classList.add('selected');
                                        let fName = this.getAttribute('fName');
            
                                        let html = '<button class="js-button-food-nutrient relationship default" fId="' + fId + '" dataType="FOOD">' + fName + ' <span>(음식)</span></button>';
                                        buttonFoodNutrientAdd.insertAdjacentHTML('beforebegin', html);
                
                                        let buttonFoodNutrientList = divFoodNutrientList.querySelectorAll('.js-button-food-nutrient');
                                        let buttonFoodNutrient = buttonFoodNutrientList[buttonFoodNutrientList.length - 1];
                
                                        buttonFoodNutrient.addEventListener('click', function() {
                                            this.remove();
                                        });
                                    }
                                });
                            });
                        });

                    } else {
                        let selectedNIdList = [];
                        divFoodNutrientList.querySelectorAll('.js-button-food-nutrient[dataType="NUTRIENT"]').forEach((buttonNutrient) => {
                            selectedNIdList.push(parseInt(buttonNutrient.getAttribute('nId')));
                        });

                        trHeader.innerHTML = '<th>ID</th><th>이름</th>';
                        getNutrientList((nutrientList) => {
                            let html = '';
                            for (let i = 0; i < nutrientList.length; i++) {
                                let nutrient = nutrientList[i];
                                html += '<tr class="js-tr-nutrient ' + ((selectedNIdList.indexOf(nutrient.n_id) === -1) ? '': 'selected') + '" nId="' + nutrient.n_id + '" nName="' + nutrient.n_name + '" >';
                                html +=     '<td>' + nutrient.n_id + '</td>';
                                html +=     '<td>' + nutrient.n_name + '</td>';
                                // html +=     '<td>' + effectToString(nutrient.n_effect) + '</td>';
                                html += '</tr>';
                            }
                            tBodyFoodNutrientList.innerHTML = html;

                            tBodyFoodNutrientList.querySelectorAll('.js-tr-nutrient').forEach((trNutrient) => {
                                trNutrient.addEventListener('click', function() {
                                    let nId = this.getAttribute('nId');
            
                                    if (this.classList.contains('selected')) {
                                        this.classList.remove('selected');
                                        divFoodNutrientList.querySelector('.js-button-food-nutrient[dataType="NUTRIENT"][nId="' + nId + '"]').remove();
                                        
                                    } else {
                                        this.classList.add('selected');
                                        let nName = this.getAttribute('nName');
            
                                        let html = '<button class="js-button-food-nutrient relationship default" nId="' + nId + '" dataType="NUTRIENT">' + nName + ' <span>(영양소)</span></button>';
                                        buttonFoodNutrientAdd.insertAdjacentHTML('beforebegin', html);
                
                                        let buttonFoodNutrientList = divFoodNutrientList.querySelectorAll('.js-button-food-nutrient');
                                        let buttonFoodNutrient = buttonFoodNutrientList[buttonFoodNutrientList.length - 1];
                
                                        buttonFoodNutrient.addEventListener('click', function() {
                                            this.remove();
                                        });
                                    }
                                });
                            });
                        });
                    }
                });
            });

            document.querySelector('.js-div-dialog-search-relationship .js-div-tab[dataType="FOOD"]').click();
        });
    }

    if (buttonSymptomAdd) {
        buttonSymptomAdd.addEventListener('click', () => {
            document.querySelector('body').insertAdjacentHTML('beforeend', '<div class="js-div-overlay overlay" key="DIALOG_SEARCH_RELATIONSHIP" style="z-index: 999;"></div>');

            let html = '';
            html += '<div class="js-div-dialog-search-relationship dialog-search-relationship">';
            html +=     '<div class="header">';
            html +=         '<h1 class="title">증상 검색</h1>';
            html +=         '<i class="js-i-close fal fa-times"></i>';
            html +=     '</div>';
            html +=     '<div class="body">';
            html +=         '<table class="data-list">';
            html +=             '<thead>';
            html +=                 '<tr>';
            html +=                     '<th>ID</th>';
            html +=                     '<th>이름</th>';
            html +=                     '<th>신체부위</th>';
            html +=                 '</tr>';
            html +=             '</thead>';
            html +=             '<tbody class="js-tbody-symptom-list"></tbody>';
            html +=         '</table>';
            html +=     '</div>';
            html += '</div>';
            document.querySelector('body').insertAdjacentHTML('beforeend', html);

            let iClose = document.querySelector('.js-div-dialog-search-relationship .js-i-close');
            iClose.addEventListener('click', () => {
                document.querySelector('.js-div-overlay[key="DIALOG_SEARCH_RELATIONSHIP"]').remove();
                document.querySelector('.js-div-dialog-search-relationship').remove();
            });

            getSymptomList((symptomList) => {
                let selectedSIdList = [];
                divSymptomList.querySelectorAll('.js-button-symptom').forEach((buttonSymptom) => {
                    selectedSIdList.push(parseInt(buttonSymptom.getAttribute('sId')));
                });

                let tbodySymptomList = document.querySelector('.js-div-dialog-search-relationship .js-tbody-symptom-list');

                let html = '';
                for (let i = 0; i < symptomList.length; i++) {
                    let symptom = symptomList[i];
                    html += '<tr class="js-tr-symptom ' + ((selectedSIdList.indexOf(symptom.s_id) === -1) ? '': 'selected') + '" sId="' + symptom.s_id + '" sName="' + symptom.s_name + '" >';
                    html +=     '<td>' + symptom.s_id + '</td>';
                    html +=     '<td>' + symptom.s_name + '</td>';
                    html +=     '<td>' + idToBodyPart(symptom.s_bp_id) + '(' + symptom.s_bp_id + ')</td>';
                    html += '</tr>';
                }
                tbodySymptomList.innerHTML = html;

                tbodySymptomList.querySelectorAll('.js-tr-symptom').forEach((trSymptom) => {
                    trSymptom.addEventListener('click', function() {
                        let sId = this.getAttribute('sId');

                        if (this.classList.contains('selected')) {
                            this.classList.remove('selected');
                            divSymptomList.querySelector('.js-button-symptom[sId="' + sId + '"]').remove();
                            
                        } else {
                            this.classList.add('selected');
                            let sName = this.getAttribute('sName');

                            let html = '<button class="js-button-symptom relationship default" sId="' + sId + '">' + sName + '</button>';
                            buttonSymptomAdd.insertAdjacentHTML('beforebegin', html);
    
                            let buttonSymptomList = divSymptomList.querySelectorAll('.js-button-symptom');
                            let buttonSymptom = buttonSymptomList[buttonSymptomList.length - 1];
    
                            buttonSymptom.addEventListener('click', function() {
                                this.remove();
                            });
                        }
                    });
                });
            });
        });
    }

}
initDisease();
