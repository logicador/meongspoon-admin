
const tbodyProductList = document.querySelector('.js-tbody-product-list');
const tbodyProductCategoryList = document.querySelector('.js-tbody-product-category-list');
const tbodyProductBrandList = document.querySelector('.js-tbody-product-brand-list');
const divThumbnail = document.querySelector('.js-div-thumbnail');
const inputThumbnail = document.querySelector('.js-input-thumbnail');
const selectCategory = document.querySelector('.js-select-category');
const selectBrand = document.querySelector('.js-select-brand');
const inputName = document.querySelector('.js-input-name');
const inputPrice = document.querySelector('.js-input-price');
const inputOrigin = document.querySelector('.js-input-origin');
const inputManufacturer = document.querySelector('.js-input-manufacturer');
const inputPackingVolume = document.querySelector('.js-input-packing-volume');
const inputRecommend = document.querySelector('.js-input-recommend');
const buttonImageAdd = document.querySelector('.js-button-image-add');
const buttonImageDetailAdd = document.querySelector('.js-button-image-detail-add');
const divImageBox = document.querySelector('.js-div-image-box');
const divImageDetailBox = document.querySelector('.js-div-image-detail-box');
const buttonProductCategoryAdd = document.querySelector('.js-button-product-category-add');
const buttonProductBrandAdd = document.querySelector('.js-button-product-brand-add');
const buttonCancel = document.querySelector('.js-button-cancel');
const buttonProductAdd = document.querySelector('.js-button-product-add');
const buttonProductSave = document.querySelector('.js-button-product-save');
const divFoodNutrientList = document.querySelector('.js-div-food-nutrient-list');
const buttonFoodNutrientAdd = document.querySelector('.js-button-food-nutrient-add');

const inputHiddenPId = document.querySelector('.js-input-hidden-p-id');
const inputHiddenPcId = document.querySelector('.js-input-hidden-pc-id');
const inputHiddenPbId = document.querySelector('.js-input-hidden-pb-id');
const inputHiddenFnProt = document.querySelector('.js-input-hidden-fn-prot');
const inputHiddenFnFat = document.querySelector('.js-input-hidden-fn-fat');
const inputHiddenFnFibe = document.querySelector('.js-input-hidden-fn-fibe');
const inputHiddenFnAsh = document.querySelector('.js-input-hidden-fn-ash');
const inputHiddenFnCalc = document.querySelector('.js-input-hidden-fn-calc');
const inputHiddenFnPhos = document.querySelector('.js-input-hidden-fn-phos');
const inputHiddenFnMois = document.querySelector('.js-input-hidden-fn-mois');
const inputHiddenOriginalImageData = document.querySelector('.js-input-hidden-original-image-data');
const inputHiddenOriginalImageDetailData = document.querySelector('.js-input-hidden-original-image-detail-data');


function getProductList() {
    fetch('/api/product/get/all')
    .then((data) => { return data.json(); })
    .then((response) => {

        if (response.status != 'OK') {
            alert('????????? ??????????????????.');
            return;
        }

        let productList = response.result;
        let html = '';
        for (let i = 0; i < productList.length; i++) {
            let product = productList[i];
            html += '<tr class="js-tr-product" pId="' + product.p_id + '">';
            html +=     '<td>' + product.p_id + '</td>';
            html +=     '<td>' + product.p_name + '</td>';
            html +=     '<td>' + product.pc_name + '(' + product.p_pc_id + ')</td>';
            html +=     '<td>' + product.pb_name + '(' + product.p_pb_id + ')</td>';
            html +=     '<td><div class="thumbnail" style="background-image: url(' + product.p_thumbnail + '), url(/img/no_image.png)"></div></td>';
            html +=     '<td class="buttons">';
            html +=         '<a href="/product/detail/' + product.p_id + '"><button class="default">?????????</button></a>';
            html +=         '<button class="js-button-remove default remove">??????</button>';
            html +=     '</td>';
            html += '</tr>';
        }

        tbodyProductList.innerHTML = html;

        tbodyProductList.querySelectorAll('.js-button-remove').forEach((buttonRemove) => {
            buttonRemove.addEventListener('click', function() {
                let pId = this.parentElement.parentElement.getAttribute('pId');
                removeProduct(pId);
            });
        });
    });
}


function getProduct(pId) {
    fetch('/api/product/get?pId=' + pId)
    .then((data) => { return data.json(); })
    .then((response) => {
        if (response.status != 'OK') {
            alert('????????? ??????????????????.');
            return;
        }

        let product = response.result.product;
        // let feedNutrients = response.result.feedNutrients;
        let imageList = response.result.imageList;
        let foodNutrientList = response.result.nutrientFoodList;

        inputName.value = product.p_name;
        inputPrice.value = product.p_price;
        inputOrigin.value = product.p_origin;
        inputManufacturer.value = product.p_manufacturer;
        inputPackingVolume.value = product.p_packing_volume;
        inputRecommend.value = product.p_recommend;

        let keywordList = product.p_keyword.split('|');

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
            let dataType = foodNutrientList[i].mpnf_type;
            if (dataType == 'FOOD') {
                let fId = foodNutrientList[i].f_id;
                let fName = foodNutrientList[i].f_name;
                html += '<button class="js-button-food-nutrient relationship default" fId="' + fId + '" dataType="FOOD">' + fName + ' <span>(??????)</span></button>';
            } else {
                let nId = foodNutrientList[i].n_id;
                let nName = foodNutrientList[i].n_name;
                html += '<button class="js-button-food-nutrient relationship default" nId="' + nId + '" dataType="NUTRIENT">' + nName + ' <span>(?????????)</span></button>';
            }
        }
        buttonFoodNutrientAdd.insertAdjacentHTML('beforebegin', html);
        divFoodNutrientList.querySelectorAll('.js-button-food-nutrient').forEach((buttonFoodNutrient) => {
            buttonFoodNutrient.addEventListener('click', function() {
                this.remove();
            });
        });

        divThumbnail.style.backgroundImage = 'url(' + ((product.p_thumbnail) ? product.p_thumbnail : '') + ')';
        divThumbnail.setAttribute("original", ((product.p_thumbnail) ? product.p_thumbnail : ''));
    
        let imageData = [];
        let imageDetailData = [];
        let imageHtml = '';
        let detailImageHtml = '';
        for (let i = 0; i < imageList.length; i++) {
            let image = imageList[i];

            let html = '';
            html += '<div class="js-div-image-wrapper image-wrapper" iId="' + image.i_id + '">';
            html +=     '<form method="post" enctype="multipart/form-data"><input class="js-input-image" name="image" type="file" accept="image/jpeg,image/png" /></form>';
            html +=     '<div class="js-div-remove remove"><i class="fal fa-times"></i></div>';
            html +=     '<div class="js-div-image image" style="background-image: url(' + image.i_path + ')" original="' + image.i_path + '"></div>';
            html += '</div>';

            if (image.i_type == 'IMAGE') {
                imageData.push(image);
                imageHtml += html;
            } else { // IMAGE_DETAIL
                imageDetailData.push(image);
                detailImageHtml += html;
            }
        }

        buttonImageAdd.insertAdjacentHTML('beforebegin', imageHtml);
        buttonImageDetailAdd.insertAdjacentHTML('beforebegin', detailImageHtml);
        inputHiddenOriginalImageData.value = JSON.stringify(imageData);
        inputHiddenOriginalImageDetailData.value = JSON.stringify(imageDetailData);

        document.querySelectorAll('.js-div-image-wrapper').forEach((divImageWrapper) => {
            divImageWrapper.querySelector('.js-div-remove').addEventListener('click', () => {
                divImageWrapper.remove();
            });
            // divImageWrapper.querySelector('.js-div-image').addEventListener('click', () => {
            //     divImageWrapper.querySelector('.js-input-image').click();
            // });
            // divImageWrapper.querySelector('.js-input-image').addEventListener('change', (event) => {
            //     changeInputImage(event, (error, result) => {
            //         if (error) {
            //             divImageWrapper.querySelector('.js-div-image').style.backgroundImage = 'url()';
            //             return;
            //         }
            //         divImageWrapper.querySelector('.js-div-image').style.backgroundImage = 'url(' + result + ')';
            //     });
            // });
        });
    });
}


function saveProduct(mode, callback) {

    let name = inputName.value.trim();

    if (name === '') {
        alert('?????? ????????? ??????????????????.');
        removeSpinner('SAVE_PRODUCT');
        removeOverlay('SAVE_PRODUCT');
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
    //     removeSpinner('SAVE_PRODUCT');
    //     removeOverlay('SAVE_PRODUCT');
    //     return;
    // }

    let keyword = keywordList.join('|');

    if (menu == 'product_add' && !inputThumbnail.value) {
        alert('?????? ????????? ???????????? ??????????????????.');
        removeSpinner('SAVE_PRODUCT');
        removeOverlay('SAVE_PRODUCT');
        return;
    }

    if (!selectBrand.value) {
        alert('?????? ???????????? ??????????????????.');
        removeSpinner('SAVE_PRODUCT');
        removeOverlay('SAVE_PRODUCT');
        return;
    }

    let foodNutrientList = [];
    divFoodNutrientList.querySelectorAll('.js-button-food-nutrient').forEach((buttonFoodNutrient) => {
        let dataType = buttonFoodNutrient.getAttribute('dataType');
        foodNutrientList.push({ type: dataType, targetId: ((dataType == 'FOOD') ? buttonFoodNutrient.getAttribute('fId') : buttonFoodNutrient.getAttribute('nId')) });
    });

    let pcId = selectCategory.value;

    let feedNutrients = {};
    if (pcId == 1) {
        let tableFeedNutrientWrapper = document.querySelector('.js-table-feed-nutrient-wrapper');
        feedNutrients = {
            prot: tableFeedNutrientWrapper.querySelector('.js-input-prot').value,
            fat: tableFeedNutrientWrapper.querySelector('.js-input-fat').value,
            fibe: tableFeedNutrientWrapper.querySelector('.js-input-fibe').value,
            ash: tableFeedNutrientWrapper.querySelector('.js-input-ash').value,
            calc: tableFeedNutrientWrapper.querySelector('.js-input-calc').value,
            phos: tableFeedNutrientWrapper.querySelector('.js-input-phos').value,
            mois: tableFeedNutrientWrapper.querySelector('.js-input-mois').value
        };
    }

    let pbId = selectBrand.value;
    let price = inputPrice.value;
    let origin = inputOrigin.value;
    let manufacturer = inputManufacturer.value;
    let packingVolume = inputPackingVolume.value;
    let recommend = inputRecommend.value;

    fetch('/api/product/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            mode: mode,
            name: name,
            keyword: keyword,
            pcId: pcId,
            pbId: pbId,
            price: price,
            origin: origin,
            manufacturer: manufacturer,
            packingVolume: packingVolume,
            recommend: recommend,
            feedNutrients: feedNutrients,
            nutrientFoodData: foodNutrientList,
            pId: (mode === 'MODIFY') ? inputHiddenPId.value : ''
        })
    })
    .then(function(data) { return data.json(); })
    .then(function(response) {
        if (response.status != 'OK') {
            alert('????????? ??????????????????.');
            removeSpinner('SAVE_PRODUCT');
            removeOverlay('SAVE_PRODUCT');
            return;
        }
        callback(response);
    });
}


function removeProduct(pId) {
    if (!confirm('?????? ?????????????????????????')) return;

    fetch('/api/product/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pId: pId })
    })
    .then((data) => { return data.json(); })
    .then((response) => {
        if (response.status != 'OK') {
            if (response.status == 'ERR_EXISTS_PET') {
                alert('????????? ??? ???????????? ???????????????.');
            } else if (response.status == 'ERR_EXISTS_REVIEW') {
                alert('????????? ?????? ???????????? ???????????????.');
            } else {
                alert('????????? ??????????????????.');
            }
            return;
        }

        alert('????????? ?????????????????????.');
        tbodyProductList.querySelector('.js-tr-product[pId="' + pId + '"]').remove();
    });
}


function getProductCategoryList(callback) {
    fetch('/api/product/category/get/all')
    .then((data) => { return data.json(); })
    .then((response) => {
        if (response.status != 'OK') {
            alert('????????? ??????????????????.');
            return;
        }
        callback(response);
    });
}


function saveProductCategory(mode, pcId, name, callback) {
    fetch('/api/product/category/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            mode: mode,
            name: name,
            pcId: pcId
        })
    })
    .then(function(data) { return data.json(); })
    .then(function(response) {
        if (response.status != 'OK') {
            if (response.status == 'ERR_EXISTS_NAME') {
                alert('????????? ???????????? ????????? ???????????????.');
            } else {
                alert('????????? ??????????????????.');
            }
            return;
        }
        callback(response);
    });
}


function removeProductCategory(pcId) {
    if (!confirm('?????? ?????????????????????????')) return;

    fetch('/api/product/category/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pcId: pcId })
    })
    .then((data) => { return data.json(); })
    .then((response) => {
        if (response.status != 'OK') {
            if (response.status == 'ERR_EXISTS_PRODUCT') {
                alert('????????? ?????? ???????????? ???????????????.');
            } else {
                alert('????????? ??????????????????.');
            }
            return;
        }

        alert('?????? ??????????????? ?????????????????????.');
        tbodyProductCategoryList.querySelector('.js-tr-product-category[pcId="' + pcId + '"]').remove();
    });
}


function getProductBrandList(callback) {
    fetch('/api/product/brand/get/all')
    .then((data) => { return data.json(); })
    .then((response) => {
        if (response.status != 'OK') {
            alert('????????? ??????????????????.');
            return;
        }
        callback(response);
    });
}


function saveProductBrand(mode, pbId, name, callback) {
    fetch('/api/product/brand/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            mode: mode,
            name: name,
            pbId: pbId
        })
    })
    .then(function(data) { return data.json(); })
    .then(function(response) {
        if (response.status != 'OK') {
            if (response.status == 'ERR_EXISTS_NAME') {
                alert('????????? ????????? ????????? ???????????????.');
            } else {
                alert('????????? ??????????????????.');
            }
            return;
        }
        callback(response);
    });
}


function removeProductBrand(pbId) {
    if (!confirm('?????? ?????????????????????????')) return;

    fetch('/api/product/brand/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pbId: pbId })
    })
    .then((data) => { return data.json(); })
    .then((response) => {
        if (response.status != 'OK') {
            if (response.status == 'ERR_EXISTS_PRODUCT') {
                alert('????????? ?????? ???????????? ???????????????.');
            } else {
                alert('????????? ??????????????????.');
            }
            return;
        }

        alert('?????? ???????????? ?????????????????????.');
        tbodyProductBrandList.querySelector('.js-tr-product-brand[pbId="' + pbId + '"]').remove();
    });
}


function getFoodList(callback) {
    fetch('/api/food/get/all')
    .then((data) => { return data.json(); })
    .then((response) => {
        if (response.status != 'OK') {
            alert('????????? ??????????????????.');
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
            alert('????????? ??????????????????.');
            return;
        }
        callback(response.result);
    });
}


function checkUploadImageAndDelete() {
    let deleteImageList = [];

    if (inputThumbnail.value) {
        deleteImageList.push({ type: "THUMB", path: divThumbnail.getAttribute('original') });
    }

    let originalImageData = JSON.parse(inputHiddenOriginalImageData.value);
    let originalDetailImageData = JSON.parse(inputHiddenOriginalImageDetailData.value);

    for (let i = 0; i < originalImageData.length; i++) {
        let image = originalImageData[i];
        let iId = image.i_id;
        let iPath = image.i_path;
        let isRemoved = true;
        divImageBox.querySelectorAll('.js-div-image-wrapper').forEach((divImageWrapper) => {
            if (iPath == divImageWrapper.querySelector('.js-div-image').getAttribute('original')) {
                isRemoved = false;
            }
        });
        if (isRemoved) deleteImageList.push({ iId: iId, path: iPath });
    }

    for (let i = 0; i < originalDetailImageData.length; i++) {
        let image = originalDetailImageData[i];
        let iType = image.i_type;
        let iId = image.i_id;
        let iPath = image.i_path;
        let isRemoved = true;
        divImageDetailBox.querySelectorAll('.js-div-image-wrapper').forEach((divImageWrapper) => {
            if (iPath == divImageWrapper.querySelector('.js-div-image').getAttribute('original')) {
                isRemoved = false;
            }
        });
        if (isRemoved) deleteImageList.push({ type: iType, iId: iId, path: iPath });
    }

    if (deleteImageList.length > 0) {
        removeImage(deleteImageList, (response) => {
            if (response.status != 'OK') {
                alert("????????? ??????????????????.");
                removeSpinner('SAVE_PRODUCT');
                removeOverlay('SAVE_PRODUCT');
                return;
            }
    
            alert('????????? ?????????????????????.');
            location.reload();
        });
    } else {
        alert('????????? ?????????????????????.');
        location.reload();
    }
    
    
}


function initProduct() {
    if (menu == 'product') {
        getProductList();
    } else if (menu == 'product_detail') {
        getProduct(inputHiddenPId.value);
    } else if (menu == 'product_category') {
        getProductCategoryList((response) => {
            let productCategoryList = response.result;
            let html = '';
            for (let i = 0; i < productCategoryList.length; i++) {
                let productCategory = productCategoryList[i];
                html += '<tr class="js-tr-product-category" pcId="' + productCategory.pc_id + '">';
                html +=     '<td>' + productCategory.pc_id + '</td>';
                html +=     '<td class="js-td-name">' + productCategory.pc_name + '</td>';
                html +=     '<td class="buttons">';
                html +=         '<button class="js-button-modify default">??????</button>';
                html +=         '<button class="js-button-remove default remove">??????</button>';
                html +=     '</td>';
                html += '</tr>';
            }

            tbodyProductCategoryList.innerHTML = html;
            tbodyProductCategoryList.querySelectorAll('.js-button-remove').forEach((buttonRemove) => {
                buttonRemove.addEventListener('click', function() {
                    let pcId = this.parentElement.parentElement.getAttribute('pcId');
                    removeProductCategory(pcId);
                });
            });
            tbodyProductCategoryList.querySelectorAll('.js-button-modify').forEach((buttonModify) => {
                buttonModify.addEventListener('click', function() {
                    let origin_name = this.parentElement.parentElement.querySelector('.js-td-name').innerText;
                    let value = prompt('???????????? ?????? ??????', origin_name);
                    if (!value) return;
                    let name = value.trim();
                    if (name == '') {
                        alert('???????????? ????????? ??????????????????.');
                        return;
                    }

                    if (origin_name === name) return;

                    let pcId = this.parentElement.parentElement.getAttribute('pcId');

                    saveProductCategory('MODIFY', pcId, name, (response) => {
                        alert('?????? ??????????????? ?????????????????????.');
                        location.reload();
                    });
                });
            });
        });

    } else if (menu == 'product_brand') {
        getProductBrandList((response) => {
            let productBrandList = response.result;
            let html = '';
            for (let i = 0; i < productBrandList.length; i++) {
                let productBrand = productBrandList[i];
                html += '<tr class="js-tr-product-brand" pbId="' + productBrand.pb_id + '">';
                html +=     '<td>' + productBrand.pb_id + '</td>';
                html +=     '<td class="js-td-name">' + productBrand.pb_name + '</td>';
                html +=     '<td class="buttons">';
                html +=         '<button class="js-button-modify default">??????</button>';
                html +=         '<button class="js-button-remove default remove">??????</button>';
                html +=     '</td>';
                html += '</tr>';
            }

            tbodyProductBrandList.innerHTML = html;
            tbodyProductBrandList.querySelectorAll('.js-button-remove').forEach((buttonRemove) => {
                buttonRemove.addEventListener('click', function() {
                    let pbId = this.parentElement.parentElement.getAttribute('pbId');
                    removeProductBrand(pbId);
                });
            });
            tbodyProductBrandList.querySelectorAll('.js-button-modify').forEach((buttonModify) => {
                buttonModify.addEventListener('click', function() {
                    let origin_name = this.parentElement.parentElement.querySelector('.js-td-name').innerText;
                    let value = prompt('????????? ?????? ??????', origin_name);
                    if (!value) return;
                    let name = value.trim();
                    if (name == '') {
                        alert('????????? ????????? ??????????????????.');
                        return;
                    }

                    if (origin_name === name) return;

                    let pbId = this.parentElement.parentElement.getAttribute('pbId');

                    saveProductBrand('MODIFY', pbId, name, (response) => {
                        alert('?????? ???????????? ?????????????????????.');
                        location.reload();
                    });
                });
            });
        });
    }

    if (buttonCancel) {
        buttonCancel.addEventListener('click', () => {
            location.href = '/product';
        });
    }
    
    if (buttonProductAdd) {
        buttonProductAdd.addEventListener('click', () => {
            createOverlay(999, 'SAVE_PRODUCT');
            createSpinner(999, 'SAVE_PRODUCT');
            saveProduct('ADD', (response) => {
                let pId = response.pId;

                let form = inputThumbnail.parentElement;
                let formData = new FormData(form);
                formData.append('type', 'THUMB');
                formData.append('dataType', 'product');
                formData.append('targetId', pId);
                uploadImage(formData, (response) => {
                    if (response.status != 'OK') {
                        alert("????????? ??????????????????.");
                        removeSpinner('SAVE_FOOD');
                        removeOverlay('SAVE_FOOD');
                        return;
                    }

                    let formDataList = [];
                    divImageBox.querySelectorAll('.js-div-image-wrapper').forEach((divImageWrapper) => {
                        let form = divImageWrapper.querySelector('form');
                        let input = form.querySelector('input');
                        if (!input.value) return true;

                        let formData = new FormData(form);
                        formData.append('targetId', pId);
                        formData.append('type', 'IMAGE');
                        formData.append('dataType', 'product');
                        formDataList.push(formData);
                    });

                    let detailFormDataList = [];
                    divImageDetailBox.querySelectorAll('.js-div-image-wrapper').forEach((divImageWrapper) => {
                        let form = divImageWrapper.querySelector('form');
                        let input = form.querySelector('input');
                        if (!input.value) return true;

                        let formData = new FormData(form);
                        formData.append('targetId', pId);
                        formData.append('type', 'IMAGE_DETAIL');
                        formData.append('dataType', 'product');
                        detailFormDataList.push(formData);
                    });

                    let responseCnt = 0;
                    if (formDataList.length > 0) {
                        for (let i = 0; i < formDataList.length; i++) {
                            let formData = formDataList[i];
                            uploadImage(formData, (response) => {
                                if (response.status != 'OK') {
                                    alert("????????? ??????????????????.");
                                    removeSpinner('SAVE_FOOD');
                                    removeOverlay('SAVE_FOOD');
                                    return;
                                }
    
                                responseCnt++;
                                if (responseCnt == formDataList.length) {
                                    responseCnt = 0;
                                    if (detailFormDataList.length > 0) {
                                        for (let j = 0; j < detailFormDataList.length; j++) {
                                            let formData = detailFormDataList[j];
                                            uploadImage(formData, (response) => {
                                                if (response.status != 'OK') {
                                                    alert("????????? ??????????????????.");
                                                    removeSpinner('SAVE_FOOD');
                                                    removeOverlay('SAVE_FOOD');
                                                    return;
                                                }
                    
                                                responseCnt++;
                                                if (responseCnt == detailFormDataList.length) {
                                                    alert('????????? ?????????????????????.');
                                                    location.href = '/product';
                                                }
                                            });
                                        }
                                    } else {
                                        alert('????????? ?????????????????????.');
                                        location.href = '/product';
                                    }
                                }
                            });
                        }
                    } else {
                        if (detailFormDataList.length > 0) {
                            for (let j = 0; j < detailFormDataList.length; j++) {
                                let formData = detailFormDataList[j];
                                uploadImage(formData, (response) => {
                                    if (response.status != 'OK') {
                                        alert("????????? ??????????????????.");
                                        removeSpinner('SAVE_FOOD');
                                        removeOverlay('SAVE_FOOD');
                                        return;
                                    }
        
                                    responseCnt++;
                                    if (responseCnt == detailFormDataList.length) {
                                        alert('????????? ?????????????????????.');
                                        location.href = '/product';
                                    }
                                });
                            }
                        } else {
                            alert('????????? ?????????????????????.');
                            location.href = '/product';
                        }
                    }
                });
            });
        });
    }

    if (buttonProductSave) {
        buttonProductSave.addEventListener('click', () => {
            createOverlay(999, 'SAVE_PRODUCT');
            createSpinner(999, 'SAVE_PRODUCT');
            saveProduct('MODIFY', (response) => {
                let pId = inputHiddenPId.value;

                if (inputThumbnail.value) { // ????????? ?????? ??????.
                    let form = inputThumbnail.parentElement;
                    let formData = new FormData(form);
                    formData.append('type', 'THUMB');
                    formData.append('dataType', 'product');
                    formData.append('targetId', pId);
                    uploadImage(formData, (response) => {
                        if (response.status != 'OK') {
                            alert("????????? ??????????????????.");
                            removeSpinner('SAVE_FOOD');
                            removeOverlay('SAVE_FOOD');
                            return;
                        }
    
                        let formDataList = [];
                        divImageBox.querySelectorAll('.js-div-image-wrapper').forEach((divImageWrapper) => {
                            let form = divImageWrapper.querySelector('form');
                            let input = form.querySelector('input');
                            if (!input.value) return true;
    
                            let formData = new FormData(form);
                            formData.append('targetId', pId);
                            formData.append('type', 'IMAGE');
                            formData.append('dataType', 'product');
                            formDataList.push(formData);
                        });
    
                        let detailFormDataList = [];
                        divImageDetailBox.querySelectorAll('.js-div-image-wrapper').forEach((divImageWrapper) => {
                            let form = divImageWrapper.querySelector('form');
                            let input = form.querySelector('input');
                            if (!input.value) return true;
    
                            let formData = new FormData(form);
                            formData.append('targetId', pId);
                            formData.append('type', 'IMAGE_DETAIL');
                            formData.append('dataType', 'product');
                            detailFormDataList.push(formData);
                        });
    
                        let responseCnt = 0;
                        if (formDataList.length > 0) {
                            for (let i = 0; i < formDataList.length; i++) {
                                let formData = formDataList[i];
                                uploadImage(formData, (response) => {
                                    if (response.status != 'OK') {
                                        alert("????????? ??????????????????.");
                                        removeSpinner('SAVE_FOOD');
                                        removeOverlay('SAVE_FOOD');
                                        return;
                                    }
        
                                    responseCnt++;
                                    if (responseCnt == formDataList.length) {
                                        responseCnt = 0;
                                        if (detailFormDataList.length > 0) {
                                            for (let j = 0; j < detailFormDataList.length; j++) {
                                                let formData = detailFormDataList[j];
                                                uploadImage(formData, (response) => {
                                                    if (response.status != 'OK') {
                                                        alert("????????? ??????????????????.");
                                                        removeSpinner('SAVE_FOOD');
                                                        removeOverlay('SAVE_FOOD');
                                                        return;
                                                    }
                        
                                                    responseCnt++;
                                                    if (responseCnt == detailFormDataList.length) {
                                                        checkUploadImageAndDelete();
                                                    }
                                                });
                                            }
                                        } else {
                                            checkUploadImageAndDelete();
                                        }
                                    }
                                });
                            }
                        } else {
                            if (detailFormDataList.length > 0) {
                                for (let j = 0; j < detailFormDataList.length; j++) {
                                    let formData = detailFormDataList[j];
                                    uploadImage(formData, (response) => {
                                        if (response.status != 'OK') {
                                            alert("????????? ??????????????????.");
                                            removeSpinner('SAVE_FOOD');
                                            removeOverlay('SAVE_FOOD');
                                            return;
                                        }
            
                                        responseCnt++;
                                        if (responseCnt == detailFormDataList.length) {
                                            checkUploadImageAndDelete();
                                        }
                                    });
                                }
                            } else {
                                checkUploadImageAndDelete();
                            }
                        }
                    });

                } else { // ????????? ?????? ?????????.
                    let formDataList = [];
                    divImageBox.querySelectorAll('.js-div-image-wrapper').forEach((divImageWrapper) => {
                        let form = divImageWrapper.querySelector('form');
                        let input = form.querySelector('input');
                        if (!input.value) return true;

                        let formData = new FormData(form);
                        formData.append('targetId', pId);
                        formData.append('type', 'IMAGE');
                        formData.append('dataType', 'product');
                        formDataList.push(formData);
                    });

                    let detailFormDataList = [];
                    divImageDetailBox.querySelectorAll('.js-div-image-wrapper').forEach((divImageWrapper) => {
                        let form = divImageWrapper.querySelector('form');
                        let input = form.querySelector('input');
                        if (!input.value) return true;

                        let formData = new FormData(form);
                        formData.append('targetId', pId);
                        formData.append('type', 'IMAGE_DETAIL');
                        formData.append('dataType', 'product');
                        detailFormDataList.push(formData);
                    });

                    let responseCnt = 0;
                    if (formDataList.length > 0) {
                        for (let i = 0; i < formDataList.length; i++) {
                            let formData = formDataList[i];
                            uploadImage(formData, (response) => {
                                if (response.status != 'OK') {
                                    alert("????????? ??????????????????.");
                                    removeSpinner('SAVE_FOOD');
                                    removeOverlay('SAVE_FOOD');
                                    return;
                                }
    
                                responseCnt++;
                                if (responseCnt == formDataList.length) {
                                    responseCnt = 0;
                                    if (detailFormDataList.length > 0) {
                                        for (let j = 0; j < detailFormDataList.length; j++) {
                                            let formData = detailFormDataList[j];
                                            uploadImage(formData, (response) => {
                                                if (response.status != 'OK') {
                                                    alert("????????? ??????????????????.");
                                                    removeSpinner('SAVE_FOOD');
                                                    removeOverlay('SAVE_FOOD');
                                                    return;
                                                }
                    
                                                responseCnt++;
                                                if (responseCnt == detailFormDataList.length) {
                                                    checkUploadImageAndDelete();
                                                }
                                            });
                                        }
                                    } else {
                                        checkUploadImageAndDelete();
                                    }
                                }
                            });
                        }
                    } else {
                        if (detailFormDataList.length > 0) {
                            for (let j = 0; j < detailFormDataList.length; j++) {
                                let formData = detailFormDataList[j];
                                uploadImage(formData, (response) => {
                                    if (response.status != 'OK') {
                                        alert("????????? ??????????????????.");
                                        removeSpinner('SAVE_FOOD');
                                        removeOverlay('SAVE_FOOD');
                                        return;
                                    }
        
                                    responseCnt++;
                                    if (responseCnt == detailFormDataList.length) {
                                        checkUploadImageAndDelete();
                                    }
                                });
                            }
                        } else {
                            checkUploadImageAndDelete();
                        }
                    }
                }
            });
        });
    }
    
    if (divThumbnail) {
        divThumbnail.addEventListener('click', () => {
            inputThumbnail.click();
        });

        inputThumbnail.addEventListener('change', (event) => {
            changeInputImage(event, (error, result) => {
                if (error) {
                    divThumbnail.style.backgroundImage = 'url()';
                    return;
                }
                divThumbnail.style.backgroundImage = 'url(' + result + ')';
            });
        });
    }

    if (buttonImageAdd) {
        buttonImageAdd.addEventListener('click', () => {
            let html = '';
            html += '<div class="js-div-image-wrapper image-wrapper">';
            html +=     '<form method="post" enctype="multipart/form-data"><input class="js-input-image" name="image" type="file" accept="image/jpeg,image/png" /></form>';
            html +=     '<div class="js-div-remove remove"><i class="fal fa-times"></i></div>';
            html +=     '<div class="js-div-image image"></div>';
            html += '</div>';

            buttonImageAdd.insertAdjacentHTML('beforebegin', html);

            let divImageWrapperList = divImageBox.querySelectorAll('.js-div-image-wrapper');
            let divImageWrapper = divImageWrapperList[divImageWrapperList.length - 1];
            divImageWrapper.querySelector('.js-div-remove').addEventListener('click', function() {
                divImageWrapper.remove();
            });
            divImageWrapper.querySelector('.js-div-image').addEventListener('click', () => {
                divImageWrapper.querySelector('.js-input-image').click();
            });
            divImageWrapper.querySelector('.js-input-image').addEventListener('change', (event) => {
                changeInputImage(event, (error, result) => {
                    if (error) {
                        divImageWrapper.querySelector('.js-div-image').style.backgroundImage = 'url()';
                        return;
                    }
                    divImageWrapper.querySelector('.js-div-image').style.backgroundImage = 'url(' + result + ')';
                });
            });
        });
    }

    if (buttonImageDetailAdd) {
        buttonImageDetailAdd.addEventListener('click', () => {
            let html = '';
            html += '<div class="js-div-image-wrapper image-wrapper">';
            html +=     '<form method="post" enctype="multipart/form-data"><input class="js-input-image" name="image" type="file" accept="image/jpeg,image/png" /></form>';
            html +=     '<div class="js-div-remove remove"><i class="fal fa-times"></i></div>';
            html +=     '<div class="js-div-image image"></div>';
            html += '</div>';

            buttonImageDetailAdd.insertAdjacentHTML('beforebegin', html);

            let divImageWrapperList = divImageDetailBox.querySelectorAll('.js-div-image-wrapper');
            let divImageWrapper = divImageWrapperList[divImageWrapperList.length - 1];
            divImageWrapper.querySelector('.js-div-remove').addEventListener('click', function() {
                divImageWrapper.remove();
            });
            divImageWrapper.querySelector('.js-div-image').addEventListener('click', () => {
                divImageWrapper.querySelector('.js-input-image').click();
            });
            divImageWrapper.querySelector('.js-input-image').addEventListener('change', (event) => {
                changeInputImage(event, (error, result) => {
                    if (error) {
                        divImageWrapper.querySelector('.js-div-image').style.backgroundImage = 'url()';
                        return;
                    }
                    divImageWrapper.querySelector('.js-div-image').style.backgroundImage = 'url(' + result + ')';
                });
            });
        });
    }

    if (buttonProductCategoryAdd) {
        buttonProductCategoryAdd.addEventListener('click', () => {
            let value = prompt('???????????? ????????? ??????????????????.');
            if (!value) return;
            let name = value.trim();
            if (name == '') {
                alert('???????????? ????????? ??????????????????.');
                return;
            }

            saveProductCategory('ADD', null, name, (response) => {
                alert('?????? ??????????????? ?????????????????????.');
                location.reload();
            });
        });
    }

    if (buttonProductBrandAdd) {
        buttonProductBrandAdd.addEventListener('click', () => {
            let value = prompt('????????? ????????? ??????????????????.').trim();
            if (!value) return;
            let name = value.trim();
            if (name == '') {
                alert('????????? ????????? ??????????????????.');
                return;
            }

            saveProductBrand('ADD', null, name, (response) => {
                alert('?????? ???????????? ?????????????????????.');
                location.reload();
            });
        });
    }

    if (selectCategory) {
        getProductCategoryList((response) => {
            let html = '';
            let categoryList = response.result;
            for (let i = 0; i < categoryList.length; i++) {
                let category = categoryList[i];
                html += '<option value="' + category.pc_id + '">' + category.pc_name + '(' + category.pc_id + ')</option>';
            }
            selectCategory.innerHTML = html;

            // value ?????? (ADD??? 1, DETAIL?????? ???????????? ??????)
            if (menu == 'product_add') selectCategory.value = 1;
            else if (menu == 'product_detail') selectCategory.value = inputHiddenPcId.value;
            selectCategory.dispatchEvent(new Event('change')); // select event trigger
        });

        selectCategory.addEventListener('change', function() {
            let pbId = this.value;
            if (pbId == 1) { // ????????? ??????
                let html = '';
                html += '<div class="form-box">';
                html +=     '<p>?????? ?????? (%)</p>';
                html +=     '<table class="js-table-feed-nutrient-wrapper feed-nutrient-wrapper">';
                html +=         '<thead>';
                html +=             '<tr><th>?????????</th><th>?????????</th><th>?????????</th><th>?????????</th><th>??????</th><th>???</th><th>??????</th></tr>';
                html +=         '</thead>';
                html +=         '<tbody>';
                html +=             '<tr>';
                html +=                 '<td><input class="js-input-prot default" type="text" value="' + ((inputHiddenFnProt) ? inputHiddenFnProt.value: '') + '" /></td>';
                html +=                 '<td><input class="js-input-fat default" type="text" value="' + ((inputHiddenFnFat) ? inputHiddenFnFat.value: '') + '" /></td>';
                html +=                 '<td><input class="js-input-fibe default" type="text" value="' + ((inputHiddenFnFibe) ? inputHiddenFnFibe.value: '') + '" /></td>';
                html +=                 '<td><input class="js-input-ash default" type="text" value="' + ((inputHiddenFnAsh) ? inputHiddenFnAsh.value: '') + '" /></td>';
                html +=                 '<td><input class="js-input-calc default" type="text" value="' + ((inputHiddenFnCalc) ? inputHiddenFnCalc.value: '') + '" /></td>';
                html +=                 '<td><input class="js-input-phos default" type="text" value="' + ((inputHiddenFnPhos) ? inputHiddenFnPhos.value: '') + '" /></td>';
                html +=                 '<td><input class="js-input-mois default" type="text" value="' + ((inputHiddenFnMois) ? inputHiddenFnMois.value: '') + '" /></td>';
                html +=             '</tr>';
                html +=         '</tbody>';
                html +=     '</table>';
                html += '</div>';
                
                selectCategory.parentElement.insertAdjacentHTML('afterend', html);

                let tableFeedNutrientWrapper = document.querySelector('.js-table-feed-nutrient-wrapper');
                tableFeedNutrientWrapper.querySelectorAll('input').forEach((input) => {
                    input.addEventListener('keyup', checkNumber);
                }); 

                // ?????? ??????????????? ??? ???????????? ???????????????
                if (menu == 'product_detail') {

                }
            } else {
                let tableFeedNutrientWrapper = document.querySelector('.js-table-feed-nutrient-wrapper');
                if (tableFeedNutrientWrapper) tableFeedNutrientWrapper.parentElement.remove();
            }
        });
    }

    if (selectBrand) {
        getProductBrandList((response) => {
            let html = '';
            let brandList = response.result;
            for (let i = 0; i < brandList.length; i++) {
                let brand = brandList[i];
                html += '<option value="' + brand.pb_id + '" ' + ((menu == 'product_add') ? ((i == 0) ? 'selected' : '') : ((brand.pb_id == inputHiddenPbId.value) ? 'selected' : '')) + '>' + brand.pb_name + '(' + brand.pb_id + ')</option>';
            }
            selectBrand.innerHTML = html;
        });
    }

    if (inputPrice) {
        inputPrice.addEventListener('keyup', checkNumber);
    }

    if (buttonFoodNutrientAdd) {
        buttonFoodNutrientAdd.addEventListener('click', () => {
            document.querySelector('body').insertAdjacentHTML('beforeend', '<div class="js-div-overlay overlay" key="DIALOG_SEARCH_RELATIONSHIP" style="z-index: 999;"></div>');

            let html = '';
            html += '<div class="js-div-dialog-search-relationship dialog-search-relationship">';
            html +=     '<div class="header">';
            html +=         '<h1 class="title">?????? ??? ????????? ??????</h1>';
            html +=         '<i class="js-i-close fal fa-times"></i>';
            html +=     '</div>';
            html +=     '<div class="body">';
            html +=         '<div class="tab-wrapper">';
            html +=             '<div class="js-div-tab tab" dataType="FOOD">??????</div>';
            html +=             '<div class="js-div-tab tab" dataType="NUTRIENT">?????????</div>';
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

                        trHeader.innerHTML = '<th>ID</th><th>??????</th><th>?????????</th><th>??????</th>';
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
            
                                        let html = '<button class="js-button-food-nutrient relationship default" fId="' + fId + '" dataType="FOOD">' + fName + ' <span>(??????)</span></button>';
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

                        trHeader.innerHTML = '<th>ID</th><th>??????</th>';
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
            
                                        let html = '<button class="js-button-food-nutrient relationship default" nId="' + nId + '" dataType="NUTRIENT">' + nName + ' <span>(?????????)</span></button>';
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
}
initProduct();
