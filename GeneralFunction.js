/*
 * JQuery WYSIWYG Web Form Designer
 * Copyright 2015 AgilePoint Inc
 */

/* Add your JS code Here (Press Ctrl+Space keys for intellisense) */

// Get Field value
function getFormFieldValue(field) {
    let res;
    eFormHelper.getFieldValue({fieldId: field}, function (result) {
        if (result.isSuccess) {
            res = result.data;
        } else {
            console.error(result.error + " : " + field);
        }
    });
    return res;
}

// Get System Value
function getSystemValue(fieldArr) {
    //fieldArr can be array or string
    let res;
    eFormHelper.getSystemData({tokenNames: fieldArr}, function (result) {
        if (result.isSuccess) {
            res = result.data;
        } else {
            console.error(result.error);
        }
    });
    return res;
}

// Get User Info
function getUserInfo() {
    let userInfo;
    eFormHelper.getLoggedInUserDetails({}, function (result) {
        if (result.isSuccess) {
            userInfo = result.data;
        } else {
            console.error(result.error);
        }
    });
    return userInfo;
}

// Get Uploaded Files from File Upload Form
function getUploadedFiles(field) {
    let data;
    eFormHelper.getUploadedFiles({fieldId: field}, function (res) {
        if (res.isSuccess) {
            data = res.data[field];
        } else {
            console.error(result.error + " : " + field);
        }
    });
    return data;
}

// Set Field value
function setFormFieldValue(field, value) {
    eFormHelper.setFieldValue({fieldId: field, value: value}, function (result) {
        if (!result.isSuccess) {
            console.error(result.error + " : " + field);
        }
    });
}

// Update form field properties
function updateProps(field, settings, value) {
    // Fixed property names from agilepoint
    let props = ["Mandatory", "Visible", "Enabled"];
    try {
        if (props.includes(settings)) {
            if (typeof value === "boolean") {
                eFormHelper.updateFieldProperty({
                    fieldId: field,
                    propertyName: eFormHelper.constants.fieldProperty[settings],
                    value: value,
                });
            } else {
                throw new Error("Only accept booleans");
            }
        } else {
            throw new Error('Invalid settings, only "Mandatory", "Visible", or "Enabled" only');
        }
    } catch (e) {
        console.error(e);
    }
}

// Get all datas in subform
function getSubFormData(fieldName) {
    let data;
    eFormHelper.getSubFormData({fieldId: fieldName, rowIndex: "*"}, function (res) {
        if (res.isSuccess) {
            data = res.data;
        }
    });
    return data;
}

// Get all files in file upload form
function getUploadedFiles(fieldName) {
    try {
        let files;
        eFormHelper.getUploadedFiles({fieldId: fieldName}, function (res) {
            if (res.isSuccess) {
                files = res.data;
            } else {
                throw new Error(res);
            }
        });
        return files;
    } catch (e) {
        console.error(e);
    }
}

// Trigger auto lookup
async function triggerAutoLookup(fieldName, lookupName) {
    // To disable cache for lookup; impacts performance
    // https://www.agilepointnxblog.com/disable-caching-of-lookup-within-a-form-session/
    return new Promise((resolve, reject) => {
        try {
            if (lookupName) {
                eFormCustomSettings.currentForm.lookupCaching.excludeItems.push({
                    fieldId: fieldName,
                    lookupName: lookupName,
                });
            }
            eFormHelper.triggerAutoLookup({fieldId: fieldName}, (result) => {
                if (result.isSuccess) {
                    resolve(result.data);
                } else {
                    console.error("triggerAutoLookup(\"" + fieldName + "\") failed", result);
                    reject(result.error);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

// Trigger Control Rule in field
async function triggerControlRule(fieldId) {
    return new Promise((resolve, reject) => {
        try {
            let options = {};
            options.fieldId = fieldId;
            eFormHelper.triggerControlRule(options, (result) => {
                if (result.isSuccess) {
                    resolve(result.data);
                } else {
                    reject(result.error);
                }
            });
        } catch (error) {
            console.error('triggerControlRule: ' + fieldId + ' - ' + error);
        }
    });

}


// Trigger Control Validation
function triggerControlValidation(field) {
    try {
        eFormHelper.triggerControlValidation({fieldId: field});
    } catch (e) {
        console.error(e);
    }
}

// Trigger Formula
async function triggerFormula(fieldId) {
    try {
        let options = {};
        options.fieldId = fieldId;
        eFormHelper.triggerFormula(options, await function (result) {
        });
    } catch (error) {
        console.error('triggerFormula: ' + error);
    }
}

// Popup dialog message
async function showDialogMessage(msg, type) {
    return new Promise((resolve, reject) => {
        try {
            const msgTypes = ["Warning", "Error", "Info"];
            if (msgTypes.includes(type)) {
                eFormHelper.showDialogMessage({
                    value: msg,
                    messageType: eFormHelper.constants.messagetype[type],
                }, (result) => {
                    if (result.isSuccess) {
                        resolve(result.data);
                    } else {
                        reject(result.error);
                    }
                });
            } else {
                throw Error('Invalid message type, only "Confirmation", "Warning", "Error", or "Info" only');
            }
        } catch (e) {
            console.error(e);
            reject(e);
        }
    });
}

function confirmDialog(msg, type) {
    return new Promise((accept, reject) => {
        try {
            const msgTypes = ["Warning", "Error", "Info"];
            if (msgTypes.includes(type)) {
                eFormHelper.showDialogMessage(
                    {
                        value: msg,
                        messageType: eFormHelper.constants.messagetype[type],
                    },
                    function (result) {
                        if (result.isSuccess) {
                            accept(result.data);
                        } else {
                            reject(false);
                        }
                    }
                );
            } else {
                throw Error('Invalid message type, only "Confirmation", "Warning", "Error", or "Info" only');
            }
        } catch (e) {
            console.error(e);
            reject(false);
        }
    });
}

// Popup confirmation dialog
// Needs to be in async to allow functions to be in waiting state and prompt user action
function confirmMessage(confirmationMessage) {
    return new Promise((accept, reject) => {
        let options = {};
        options.value = confirmationMessage;
        eFormHelper.confirmMessage(options, function (result) {
            if (result.isSuccess) {
                accept(result.data);
            } else {
                reject(false);
            }
        });
    });
}

// manual loading with message
function showManualLoader(show, msg) {
    if (show) {
        let loader = $("#customLoader");
        if (loader.length <= 0) {
            let loader = $(
                '<div id="customLoader" class="loader" style="background: rgba(0, 0, 0, 0.25);"><div class="loaderMessageWrapper"><div id="msg" style="height: 30px; background: white; margin: auto; width: 450px; text-align: center; line-height: 30px; color: #63666A;"></div><div></div>'
            );
            $(".eFormSurface").append(loader);
        }
        loader.show();
        loader.find("#msg").html(msg);
    } else {
        let loader = $("#customLoader");
        loader.length > 0 && loader.hide();
    }
}

// Initialize loading state
function showLoading(state) {
    try {
        eFormHelper.showLoader({value: state}, function (res) {
            if (res.isSuccess) {
                return;
            } else {
                return new Error("Failed to initialize loading state");
            }
        });
    } catch (e) {
        console.error(e);
    }
}

// Add rows to SubForm
async function addRowsToSubForm(field, arrObj) {
    // values are arrays of objects with internal name as properties
    return new Promise(async (resolve, reject) => {
        try {
            eFormHelper.addRowsToSubForm({fieldId: field, value: arrObj}, await function (res) {
                if (res.isSuccess) {
                    resolve();
                } else {
                    reject(res.error);
                }
            });
        } catch (e) {
            console.error(e);
            reject(e);
        }
    });
}

// delete rows at SubForm
async function deleteRowsToSubform(field, index) {
    // index can be "*" for all rows, or "1,2,3"
    return new Promise((resolve, reject) => {
        try {
            eFormHelper.deleteRowsFromSubForm({fieldId: field, rowIndex: index}, function (res) {
                if (res.isSuccess) {
                    resolve();
                } else {
                    reject("Failed to delete " + field);
                }
            });
        } catch (e) {
            console.error(e);
            reject(e);
        }
    });
}

// Import libraries via jsDelivr/unpkg CDN
// https://helpdesk.agilepoint.com/hc/en-us/community/posts/7857312328851-Possible-to-use-npm-libraries-in-eForms-
function importLib(url) {
    let scriptEle = document.createElement("script");
    scriptEle.setAttribute("src", url);
    document.body.appendChild(scriptEle);
}

function enableControl(fieldID, value) {
    return new Promise((resolve, reject) => {
        eFormHelper.updateFieldProperty({
            fieldId: fieldID,
            propertyName: eFormHelper.constants.fieldProperty.Enabled,
            value: value
        }, (result) => {
            if (result.isSuccess) {
                resolve(result);
            } else {
                reject(result.error);
            }
        });
    });
}

function bindDataToCollectionControls(fieldId, arrayList) {
    let options = {};
    options.fieldId = fieldId;

    //Specifies the value as an array of objects as name/value pair.
    options.value = arrayList;

    return new Promise((accept, reject) => {
        eFormHelper.bindDataToCollectionControls(options, function (result) {
            if (result.isSuccess) //Checks if the method completes successfully and returns a response.
            {
                //Logs the data and displays an array of variable names and values.
                accept(result.data);
            } else {
                //Logs the error and error description, if any.
                reject(result.error);
            }
        });
    });
}

function removeCurrentRow() {
    //this is for remove the current row of subform
    //only work in subform, must enable delete function in subform settings
    let targetElement = $($(this).context.activeElement)
        .parents(".subFormContentRowChildWrapper")
        .find(".deleteSubFormRow").click();
}

async function sendApiCall(url, method, payload) {
    let retryLimit = 3;
    return new Promise(function (resolve, reject) {
        try {

            let ajaxOptions = {
                url: url,
                method: method,
                dataType: "json",
                contentType: "application/json",
                retryLimit: retryLimit,
                tryCount: 0,
                success: (result) => {
                    resolve(result);
                },
                error: (result) => {
                    this.tryCount++;
                    if (this.tryCount < this.retryLimit) {
                        //try again
                        let currentAjax = this;
                        setTimeout(function () {
                            $.ajax(currentAjax);
                        }, 300);
                    } else {
                        reject(result);
                    }
                }
            }

            if (method.toLowerCase() == "post") {
                ajaxOptions.data = JSON.stringify(payload);
            }

            $.ajax(ajaxOptions);
        } catch (err) {
            console.error("Ajax Call Error : " + err);
            reject(err);
        }
    });
}

function isFormValid() {
    let isValid = false;
    eFormHelper.validateForm((result) => {
        if (result.isSuccess) {
            isValid = result.data.isValid;
        } else {
            console.error(result.error);
        }
    });

    return isValid;
}

function dayDifferent(d1, d2) {
    // Define the two dates
    let date1Obj = new Date(d1);
    let date1 = new Date(date1Obj.getFullYear(), date1Obj.getMonth(), date1Obj.getDate(), 0, 0, 0);
    let date2Obj = new Date(d2);
    let date2 = new Date(date2Obj.getFullYear(), date2Obj.getMonth(), date2Obj.getDate(), 0, 0, 0);
    if(date1 > date2)
    {
        let tmp = date2;
        date2 = date1;
        date1 = tmp;
    }

    const diffTime = Math.abs(date2 - date1);

    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays+1;
}

function getMiddlewareHostName() {

    if (eFormHelper.formConfiguration.currentRenderMode == 'runtime') {
        return fetchSystemVariableValue("BARISTA_MIDDLEWARE");
    }

    return "http://" + window.location.hostname + ":8090";
}

function calculateAge(dateOfBirth, targetDate) {
    dateOfBirth = new Date(dateOfBirth);
    targetDate = new Date(targetDate);

    let year = targetDate.getFullYear() - dateOfBirth.getFullYear() - 1;

    if (targetDate.getMonth() == dateOfBirth.getMonth() && targetDate.getDate() >= dateOfBirth.getDate()) {
        year += 1;
    } else if (targetDate.getMonth() > dateOfBirth.getMonth()) {
        year += 1;
    }

    return year;
}

function getDateOfBirthFromNewIC(newIcNo) {
    if (newIcNo) {
        let dobYear = newIcNo.substring(0, 2);
        let dobMonth = parseInt(newIcNo.substring(2, 4)) - 1;
        let dobDay = parseInt(newIcNo.substring(4, 6));

        let currentYearNum = new Date().getFullYear().toString().substring(2, 4);

        //check if the year is after current year, it should be 19xx something
        if (dobYear > currentYearNum) {
            dobYear = "19" + dobYear;
            dobYear = parseInt(dobYear);
        } else if (dobYear == currentYearNum
            && new Date(new Date().getFullYear(), dobMonth, dobDay) > new Date()) {
            //if the date of birth month and day is greater than current date, it must be 19xx
            //it would not be a future date of birth
            dobYear = "19" + dobYear;
            dobYear = parseInt(dobYear);
        } else {
            dobYear = "20" + dobYear;
            dobYear = parseInt(dobYear);
        }

        return new Date(dobYear, dobMonth, dobDay);
    } else {
        throw new Error('getDateOfBirthFromNewIC() input is invalid : ' + newIcNo);
    }
}

function isEmptyOrBlank(value) {
    switch (value) {
        case -1 :
            return true;
            break;
        case '-1' :
            return true;
            break;
        case "":
            return true;
            break;
        case "Please Select":
            return true;
            break;
        default:
            if (Array.isArray(value)) {
                if (value.length <= 0) {
                    return true;
                }
            }
            break;
    }
    return false;
}

function viewSubformButton() {
    $($(this).context.activeElement)
        .parents(".subFormContentRowChildWrapper")
        .find(".viewSubFormRow")
        .click();
}

function editSubformButton() {
    $($(this).context.activeElement)
        .parents(".subFormContentRowChildWrapper")
        .find(".viewSubFormRow")
        .click();
}

function deleteSubformButton() {
    $($(this).context.activeElement)
        .parents(".subFormContentRowChildWrapper")
        .find(".deleteSubFormRow")
        .click();
}

function editModernSubformButton(event) {
    let currentTargetId = event.currentTarget.id;
    let parentRow = $("#" + currentTargetId).parents('.ap-fb-subFormContentRowWrapper')
        .find(".ap-fb-subFormColumnActionButtonsWrapper")
        .find(".ap-fb-subFormColumnEditBtn");
    $(parentRow).click();
}

function deleteModernSubformButton(event) {
    let currentTargetId = event.currentTarget.id;
    let parentRow = $("#" + currentTargetId).parents('.ap-fb-subFormContentRowWrapper')
        .find(".ap-fb-subFormColumnActionButtonsWrapper")
        .find(".ap-fb-subFormColumnDeleteBtn");
    $(parentRow).click();
}

function viewModernSubformButton(event) {
    let currentTargetId = event.currentTarget.id;
    let parentRow = $("#" + currentTargetId).parents('.ap-fb-subFormContentRowWrapper')
        .find(".ap-fb-subFormColumnActionButtonsWrapper")
        .find(".ap-fb-subFormColumnViewBtn");
    $(parentRow).click();
}

function removeFromArrayIfExists(item, array) {
    if (array.indexOf(item) === -1) {
        return array;
    } else {
        array.splice(array.indexOf(item), 1);
        return array;
    }
}

function formatDateToYYYYMMDD(inputDate) {
    if (inputDate) {
        let currentDate = new Date(inputDate);
        let year = currentDate.getFullYear();
        let month = String(currentDate.getMonth() + 1).padStart(2, '0');
        let day = String(currentDate.getDate()).padStart(2, '0');

        let formattedDate = year + "-" + month + "-" + day;// Output: 2024-02-21
        return formattedDate;
    } else {
        return "";
    }
}

function formatToSlashDate(inputDate) {
    if (inputDate) {
        let currentDate = new Date(inputDate);
        let year = currentDate.getFullYear();
        let month = String(currentDate.getMonth() + 1).padStart(2, '0');
        let day = String(currentDate.getDate()).padStart(2, '0');

        let formattedDate = day + "/" + month + "/" + year;
        return formattedDate;
    } else {
        return "";
    }
}

function formatSlashDateToStandardDate(date) {
    let day = date.split("/")[0];
    let month = date.split("/")[1];
    let year = date.split("/")[2];
    let newDate = new Date(year + "-" + month + "-" + day);

    return formatDateToYYYYMMDD(newDate);
}

function getMonthNumberFromDate(monthName) {
    let dateStr = monthName + " 1, 2022"; // Assuming a common year (e.g., 2022)
    let parsedDate = new Date(dateStr);
    if (!isNaN(parsedDate)) {
        let month = new Date(parsedDate).getMonth() + 1;
        return month.toString().padStart(2, '0'); // Ensure two-digit format
    }
    return -1; // Invalid month name
}

function fetchSystemVariableValue(name) {
    try {
        let value = getSystemValue(name);
        if (value != undefined && value.length > 0) {
            return value[0].Value;
        }
        return "";
    } catch (e) {
        console.error("fetchSystemVariableValue() Error : " + e);
    }
}

function getQueryString(name) {
    let url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function navigateToSection(sectionName) {
    let options = {};
    options.sectionName = sectionName;
    eFormHelper.navigateToSection(options, function (result) {
        if (result.isSuccess) {
            console.log("Navigate To : " + sectionName); //logs the data holds the empty object
        } else {
            console.error(result.error); // logs the hold exception object
        }
    });
}

function convertAssistDateToISODate(dateString) {
    let year = dateString.substr(0, 4);
    let month = dateString.substr(4, 2);
    let day = dateString.substr(6, 2);

    return year + '-' + month.toString().padStart(2, '0') + '-' + day.toString().padStart(2, '0');
}

function convertISODateToAssistDate(ISODateString) {
    let date = new Date(ISODateString);

    return date.getFullYear() + (date.getMonth() + 1).toString().padStart(2, '0') + date.getDate().toString().padStart(2, '0');
}

async function convertRdIkToName(rdIk) {
    let result = await sendApiCall(getMiddlewareHostName() + "/refdata/v2/option/raw/" + rdIk, 'get', {});
    return {
        value: result?.results?.name1
    };
}

async function convertRdIkToAssistCode(rdIk) {
    let result = await sendApiCall(getMiddlewareHostName() + "/refdata/v2/option/raw/" + rdIk, 'get', {});
    return {
        value: result?.results?.code3
    };
}

async function convertNameToAssistCode(rdName1, rdName2) {
    let result = await sendApiCall(getMiddlewareHostName() + "/refdata/v2/options/raw/" + rdName2, 'get', {});

    let filter = result?.results?.filter((r) => {
        return r.name1 == rdName1;
    });

    if (filter.length <= 0) {
        return {
            value: null
        };
    }

    return {
        value: filter[0].code3
    };
}

async function convertNameToRdIK(rdName1, rdName2) {
    let result = await sendApiCall(getMiddlewareHostName() + "/refdata/v2/options/raw/" + rdName2, 'get', {});

    let filter = result?.results?.filter((r) => {
        return r.name1 == rdName1;
    });

    if (filter.length <= 0) {
        return {
            value: null
        };
    }

    return {
        value: filter[0].id
    };
}

function bindRefDataOption(fieldId, rdName2) {
    return new Promise((resolve, reject) => {
        sendApiCall(
            getMiddlewareHostName() + "/refdata/v2/options/" + rdName2,
            "get",
            {}
        )
            .then((result) => {
                let optionList = [];
                for (let x in result.results) {
                    optionList.push({
                        Name: result.results[x].name,
                        Value: result.results[x].value
                    });
                }

                bindDataToCollectionControls(fieldId, optionList)
                    .then(() => {
                        resolve();
                    })
                    .catch((error) => {
                        console.error(error);
                        reject(error);
                    });
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
}

function bindRefDataOptionWithFiltered(fieldId, rdName2, rdParentIndex, rdParentValue) {
    return new Promise((resolve, reject) => {
        sendApiCall(
            getMiddlewareHostName() + "/refdata/v2/options/collection/" + rdName2 + "/parent-id/" + rdParentValue + "/parent-id-order/" + rdParentIndex,
            "get",
            {}
        )
            .then((result) => {
                let optionList = [];
                for (let x in result.results) {
                    optionList.push({
                        Name: result.results[x].name,
                        Value: result.results[x].value.toString()
                    });
                }

                bindDataToCollectionControls(fieldId, optionList)
                    .then(() => {
                        resolve();
                    })
                    .catch((error) => {
                        console.error(error);
                        reject(error);
                    });
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
}

function monthDiff(date1, date2) {
    let months;
    let startDate = new Date(date1);
    let endDate = new Date(date2);

    if(startDate > endDate)
    {
        let tmp = endDate;
        endDate = startDate;
        startDate = tmp;
    }

    months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
    months -= startDate.getMonth();
    months += endDate.getMonth();
    return months <= 0 ? 0 : months;
}

function convertTo2DecimalPlace(value)
{
    if(value == "")
    {
        return "";
    }
    let parseValue = parseFloat(value);
    return parseValue.toFixed(2);
}