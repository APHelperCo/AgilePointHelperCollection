/*
 * JQuery WYSIWYG Web Form Designer
 * Copyright 2015 AgilePoint Inc
 */

/* Add your JS code Here (Press Ctrl+Space keys for intellisense) */

function getAuthDetails() {
    let authDetails;

    eFormHelper.getLoggedInUserDetails({}, (result) => {
        authDetails = result.data;
    });

    return authDetails;
}

function logInUser() {
    let userName = getAuthDetails().UserDetails.UserName;
    return userName;
}

function getLoginUserFullName()
{
    let userName = getAuthDetails().UserDetails.FullName;
    return userName;
}

function getUserName()
{
    return getAuthDetails().userName;
}

function getRegisteredUserByName(name) {
    let options = {};
    // The value Admin/GetRegisterUsers shows 
    // the relative path of the Get Registered User by Name method.
    options.relativePath = "Admin/GetRegisterUser";
    // The API options required to retrieve the data from the specified path.
    // Example: headers, referrer, mode, cache, redirect.		
    options.apiOptions = {
        headers: { "Content-Type": "application/json;" }
    };

    options.data = {
        userName: name
    };

    return new Promise((resolve, reject) => {
        eFormHelper.agilePointAPI.post(options, function (result) {
            // Checks if the method is successful.
            if (result.isSuccess) {
                resolve(result.data);
            }
            else {
                reject(result.error);
            }
        });
    });
}

function getUuid() {
    let options = {};
    let outputResult;
    // The value Admin/GetRegisterUsers shows 
    // the relative path of the Get Registered User by Name method.
    options.relativePath = "Workflow/GetUUID";

    // The API options required to retrieve the data from the specified path.
    // Example: headers, referrer, mode, cache, redirect.		
    options.apiOptions = {
        headers: { "Content-Type": "application/json;" }
    };

    return new Promise((resolve, reject) => {
        eFormHelper.agilePointAPI.get(options, function (result) {
            // Checks if the method is successful.
            if (result.isSuccess) {
                // Logs the data retrieved from the Get API method.
                // console.log(result.data);
                resolve(result.data);
            }
            else {
                // Logs errors and error descriptions.
                // console.log(result.error);
                reject(result.error);
            }
        });
    });

}

function getReleasedProcessID(processName) {
    let options = {};
    let outputResult;
    // The value Admin/GetRegisterUsers shows 
    // the relative path of the Get Registered User by Name method.
    options.relativePath = "Workflow/GetReleasedPID/" + processName;

    // The API options required to retrieve the data from the specified path.
    // Example: headers, referrer, mode, cache, redirect.		
    options.apiOptions = {
        headers: { "Content-Type": "application/json;" }
    };

    return new Promise((resolve, reject) => {
        eFormHelper.agilePointAPI.get(options, function (result) {
            // Checks if the method is successful.
            if (result.isSuccess) {
                resolve(result.data);
            }
            else {
                reject(result.error);
            }
        });
    });
}

function getProcessInstance(processInstanceID) {
    let options = {};
    // The value Admin/GetRegisterUsers shows
    // the relative path of the Get Registered User by Name method.
    options.relativePath = "Workflow/GetProcInst/" + processInstanceID;

    // The API options required to retrieve the data from the specified path.
    // Example: headers, referrer, mode, cache, redirect.
    options.apiOptions = {
        headers: { "Content-Type": "application/json;" }
    };


    return new Promise(function (resolve, reject) {
        eFormHelper.agilePointAPI.get(options, function (result) {
            // Checks if the method is successful.
            if (result.isSuccess) {
                // Logs the data retrieved from the Get API method.
                // console.log(result.data);
                resolve(result.data);
            }
            else {
                // Logs errors and error descriptions.
                // console.log(result.error);
                reject(result.error);
            }
        });
    });
}

function createProcessInstance(initiator, processName, attributesArray) {

    return new Promise((resolve, reject) => {
        //get uuid
        getUuid()
            .then((result) => {
                let uuid = result.GetUUIDResult;

                //get released process pid with process name
                getReleasedProcessID(processName)
                    .then((result) => {
                        let releasedProcessId = result.GetReleasedPIDResult;

                        let options = {};
                        // The value Admin/GetRegisterUsers shows
                        // the relative path of the Get Registered User by Name method.
                        options.relativePath = "Workflow/CreateProcInst";

                        // The API options required to retrieve the data from the specified path.
                        // Example: headers, referrer, mode, cache, redirect.
                        options.apiOptions = {
                            headers: { "Content-Type": "application/json;" }
                        };

                        options.data = {
                            "Attributes": attributesArray,
                            "blnStartImmediately": true,
                            "CustomID": uuid,
                            "Initiator": initiator,
                            "ProcessID": releasedProcessId,
                            "ProcessInstID": uuid,
                            "ProcInstName": processName + " " + Date.now().toString(),
                            "SuperProcInstID": null,
                            "WorkObjID": uuid,
                            "WorkObjInfo": null
                        };


                        eFormHelper.agilePointAPI.post(options, function (result) {
                            // Checks if the method is successful.
                            if (result.isSuccess) {
                                // Logs the data retrieved from the Get API method.
                                console.log(result.data);
                                resolve(result);
                            }
                            else {
                                // Logs errors and error descriptions.
                                console.log(result.error);
                                reject(result);
                            }
                        });
                    })
                    .catch((error) => {
                        console.error("getReleasedProcessID() Error : "+error);
                        reject(error);
                    });
            }).catch((error) => {
            console.error("getUuid() Error : "+error);
            reject(error);
        });
    });

}

function queryProcInsts(columnName, operator, whereClause, isValue) {
    let options = {};
    let outputResult;
    // The value Admin/GetRegisterUsers shows
    // the relative path of the Get Registered User by Name method.
    options.relativePath = "Workflow/QueryProcInsts";

    // The API options required to retrieve the data from the specified path.
    // Example: headers, referrer, mode, cache, redirect.
    options.apiOptions = {
        headers: { "Content-Type": "application/json;" }
    };

    options.data = {
        ColumnName: columnName,
        Operator: operator,
        WhereClause: whereClause,
        IsValue: isValue
    }

    return new Promise((resolve, reject) => {
        eFormHelper.agilePointAPI.post(options, function (result) {
            // Checks if the method is successful.
            if (result.isSuccess) {
                // Logs the data retrieved from the Get API method.
                // console.log(result.data);
                resolve(result);
            }
            else {
                // Logs errors and error descriptions.
                // console.log(result.error);
                reject(result.error);
            }
        });
    });
}

async function queryProcInstsByAppName(appName)
{
    return await queryProcInsts("APPL_NAME", "EQ", appName, true);
}

function queryProcInstsUsingSql(sqlWhereClauseText) {
    let options = {};
    let outputResult;
    // The value Admin/GetRegisterUsers shows
    // the relative path of the Get Registered User by Name method.
    options.relativePath = "Workflow/QueryProcInstsUsingSQL";

    // The API options required to retrieve the data from the specified path.
    // Example: headers, referrer, mode, cache, redirect.
    options.apiOptions = {
        headers: { "Content-Type": "application/json;" }
    };

    options.data = {
        sqlWhereClause: sqlWhereClauseText
    }

    return new Promise((resolve, reject) => {
        eFormHelper.agilePointAPI.post(options, function (result) {
            // Checks if the method is successful.
            if (result.isSuccess) {
                // Logs the data retrieved from the Get API method.
                // console.log(result.data);
                resolve(result);
            }
            else {
                // Logs errors and error descriptions.
                // console.log(result.error);
                reject(result.error);
            }
        });
    });
}

function getCustomAttrsByWorkObjectID(workObjectID) {
    let options = {};
    let outputResult;
    // The value Admin/GetRegisterUsers shows
    // the relative path of the Get Registered User by Name method.
    options.relativePath = "Workflow/GetCustomAttrsByID/"+workObjectID;

    // The API options required to retrieve the data from the specified path.
    // Example: headers, referrer, mode, cache, redirect.
    options.apiOptions = {
        headers: { "Content-Type": "application/json;" }
    };

    options.data = {};

    return new Promise((resolve, reject) => {
        eFormHelper.agilePointAPI.get(options, function (result) {
            // Checks if the method is successful.
            if (result.isSuccess) {
                // Logs the data retrieved from the Get API method.
                // console.log(result.data);
                resolve(result);
            }
            else {
                // Logs errors and error descriptions.
                // console.log(result.error);
                reject(result.error);
            }
        });
    });
}

function getCustomAttribute(workObjectID, attributeName) {
    let options = {};
    let outputResult;
    // The value Admin/GetRegisterUsers shows
    // the relative path of the Get Registered User by Name method.
    options.relativePath = "Workflow/GetCustomAttr/"+workObjectID;

    // The API options required to retrieve the data from the specified path.
    // Example: headers, referrer, mode, cache, redirect.
    options.apiOptions = {
        headers: { "Content-Type": "application/json;" }
    };

    options.data = {
        attrName: attributeName
    }

    return new Promise((resolve, reject) => {
        eFormHelper.agilePointAPI.post(options, function (result) {
            // Checks if the method is successful.
            if (result.isSuccess) {
                // Logs the data retrieved from the Get API method.
                // console.log(result.data);
                resolve(result);
            }
            else {
                // Logs errors and error descriptions.
                // console.log(result.error);
                reject(result.error);
            }
        });
    });
}

function setCustomAttribute(workObjectID, attributeName, attributeValue) {
    let options = {};
    let outputResult;
    // The value Admin/GetRegisterUsers shows
    // the relative path of the Get Registered User by Name method.
    options.relativePath = "Workflow/SetCustomAttrs/"+workObjectID;

    // The API options required to retrieve the data from the specified path.
    // Example: headers, referrer, mode, cache, redirect.
    options.apiOptions = {
        headers: { "Content-Type": "application/json;" }
    };

    options.data = {
        "attributes": [
            {
                "Name": attributeName,
                "Value": attributeValue
            }
        ]
    };

    return new Promise((resolve, reject) => {
        eFormHelper.agilePointAPI.post(options, function (result) {
            // Checks if the method is successful.
            if (result.isSuccess) {
                // Logs the data retrieved from the Get API method.
                // console.log(result.data);
                resolve(result);
            }
            else {
                // Logs errors and error descriptions.
                // console.log(result.error);
                reject(result.error);
            }
        });
    });
}
function suspendProcessInstance(processInstanceID)
{
    let options = {};
    let outputResult;
    // The value Admin/GetRegisterUsers shows
    // the relative path of the Get Registered User by Name method.
    options.relativePath = "Workflow/SuspendProcInst/"+processInstanceID;

    // The API options required to retrieve the data from the specified path.
    // Example: headers, referrer, mode, cache, redirect.
    options.apiOptions = {
        headers: { "Content-Type": "application/json;" }
    };

    options.data = {}

    return new Promise((resolve, reject) => {
        eFormHelper.agilePointAPI.post(options, function (result) {
            // Checks if the method is successful.
            if (result.isSuccess) {
                // Logs the data retrieved from the Get API method.
                // console.log(result.data);
                resolve(result.data);
            }
            else {
                // Logs errors and error descriptions.
                // console.log(result.error);
                reject(result.error);
            }
        });
    });
}

function resumeProcessInstance(processInstanceID)
{
    let options = {};
    let outputResult;
    // The value Admin/GetRegisterUsers shows
    // the relative path of the Get Registered User by Name method.
    options.relativePath = "Workflow/ResumeProcInst/"+processInstanceID;

    // The API options required to retrieve the data from the specified path.
    // Example: headers, referrer, mode, cache, redirect.
    options.apiOptions = {
        headers: { "Content-Type": "application/json;" }
    };

    options.data = {
        Date: new Date().toString()
    };

    return new Promise((resolve, reject) => {
        eFormHelper.agilePointAPI.post(options, function (result) {
            // Checks if the method is successful.
            if (result.isSuccess) {
                // Logs the data retrieved from the Get API method.
                // console.log(result.data);
                resolve(result.data);
            }
            else {
                // Logs errors and error descriptions.
                // console.log(result.error);
                reject(result.error);
            }
        });
    });
}

function getWorkListByUserID(taskStatus = "Assigned")
{
    let options = {};
    let outputResult;
    // The value Admin/GetRegisterUsers shows
    // the relative path of the Get Registered User by Name method.
    options.relativePath = "Workflow/GetWorkListByUserID";

    // The API options required to retrieve the data from the specified path.
    // Example: headers, referrer, mode, cache, redirect.
    options.apiOptions = {
        headers: { "Content-Type": "application/json;" }
    };

    options.data = {
        UserName : logInUser(),
        Status: taskStatus
    }

    return new Promise((resolve, reject) => {
        eFormHelper.agilePointAPI.post(options, function (result) {
            // Checks if the method is successful.
            if (result.isSuccess) {
                // Logs the data retrieved from the Get API method.
                // console.log(result.data);
                resolve(result);
            }
            else {
                // Logs errors and error descriptions.
                // console.log(result.error);
                reject(result.error);
            }
        });
    });
}

function queryWorkList(processInstanceId)
{
    let options = {};
    let outputResult;
    // The value Admin/GetRegisterUsers shows
    // the relative path of the Get Registered User by Name method.
    options.relativePath = "Workflow/QueryWorkList";

    // The API options required to retrieve the data from the specified path.
    // Example: headers, referrer, mode, cache, redirect.
    options.apiOptions = {
        headers: { "Content-Type": "application/json;" }
    };

    options.data = {
        ColumnName : 'PROC_INST_ID',
        Operator: 'EQ',
        WhereClause: processInstanceId,
        IsValue: true
    }

    return new Promise((resolve, reject) => {
        eFormHelper.agilePointAPI.post(options, function (result) {
            // Checks if the method is successful.
            if (result.isSuccess) {
                // Logs the data retrieved from the Get API method.
                // console.log(result.data);
                resolve(result);
            }
            else {
                // Logs errors and error descriptions.
                // console.log(result.error);
                reject(result.error);
            }
        });
    });
}

function getActivityInstanceStatus(processInstanceID)
{
    let options = {};
    let outputResult;
    // The value Admin/GetRegisterUsers shows
    // the relative path of the Get Registered User by Name method.
    options.relativePath = "Workflow/GetActivityInstStatus/"+processInstanceID;

    // The API options required to retrieve the data from the specified path.
    // Example: headers, referrer, mode, cache, redirect.
    options.apiOptions = {
        headers: { "Content-Type": "application/json;" }
    };

    options.data = {}

    return new Promise((resolve, reject) => {
        eFormHelper.agilePointAPI.get(options, function (result) {
            // Checks if the method is successful.
            if (result.isSuccess) {
                // Logs the data retrieved from the Get API method.
                // console.log(result.data);
                resolve(result.data);
            }
            else {
                // Logs errors and error descriptions.
                // console.log(result.error);
                reject(result.error);
            }
        });
    });
}

function queryWorkListUsingSQL(taskStatus = ['New', 'Assigned', 'Reassigned'])
{
    let options = {};
    let outputResult;
    // The value Admin/GetRegisterUsers shows
    // the relative path of the Get Registered User by Name method.
    options.relativePath = "Workflow/QueryWorkListUsingSQL";

    // The API options required to retrieve the data from the specified path.
    // Example: headers, referrer, mode, cache, redirect.
    options.apiOptions = {
        headers: { "Content-Type": "application/json;" }
    };

    let statusString = "'"+taskStatus.join('\',\'')+"'";

    options.data = {
        sqlWhereClause: "WF_MANUAL_WORKITEMS.USER_ID='"+logInUser()+"' AND WF_MANUAL_WORKITEMS.STATUS IN ("+statusString+")",
    }

    return new Promise((resolve, reject) => {
        eFormHelper.agilePointAPI.post(options, function (result) {
            // Checks if the method is successful.
            if (result.isSuccess) {
                // Logs the data retrieved from the Get API method.
                // console.log(result.data);
                resolve(result);
            }
            else {
                // Logs errors and error descriptions.
                // console.log(result.error);
                reject(result.error);
            }
        });
    });
}

function getActivityInstance(activityInstanceID)
{
    let options = {};
    let outputResult;
    // The value Admin/GetRegisterUsers shows
    // the relative path of the Get Registered User by Name method.
    options.relativePath = "Workflow/GetActivityInst/"+activityInstanceID;

    // The API options required to retrieve the data from the specified path.
    // Example: headers, referrer, mode, cache, redirect.
    options.apiOptions = {
        headers: { "Content-Type": "application/json;" }
    };

    options.data = {}

    return new Promise((resolve, reject) => {
        eFormHelper.agilePointAPI.get(options, function (result) {
            // Checks if the method is successful.
            if (result.isSuccess) {
                // Logs the data retrieved from the Get API method.
                // console.log(result.data);
                resolve(result.data);
            }
            else {
                // Logs errors and error descriptions.
                // console.log(result.error);
                reject(result.error);
            }
        });
    });
}

//get the base id for the App
function getBaseProcessDefinitionID(processDefinitionName)
{
    let options = {};
    let outputResult;
    // The value Admin/GetRegisterUsers shows
    // the relative path of the Get Registered User by Name method.
    options.relativePath = "Workflow/GetBaseProcDefID/"+processDefinitionName;

    // The API options required to retrieve the data from the specified path.
    // Example: headers, referrer, mode, cache, redirect.
    options.apiOptions = {
        headers: { "Content-Type": "application/json;" }
    };

    options.data = {}

    return new Promise((resolve, reject) => {
        eFormHelper.agilePointAPI.get(options, function (result) {
            // Checks if the method is successful.
            if (result.isSuccess) {
                // Logs the data retrieved from the Get API method.
                // console.log(result.data);
                resolve(result.data);
            }
            else {
                // Logs errors and error descriptions.
                // console.log(result.error);
                reject(result.error);
            }
        });
    });
}

//get all definition about the same App
function getProcessDefinitionByBaseID(processDefBaseID)
{
    let options = {};
    let outputResult;
    // The value Admin/GetRegisterUsers shows
    // the relative path of the Get Registered User by Name method.
    options.relativePath = "Workflow/GetProcDefByBasePID/"+processDefBaseID;

    // The API options required to retrieve the data from the specified path.
    // Example: headers, referrer, mode, cache, redirect.
    options.apiOptions = {
        headers: { "Content-Type": "application/json;" }
    };

    options.data = {}

    return new Promise((resolve, reject) => {
        eFormHelper.agilePointAPI.get(options, function (result) {
            // Checks if the method is successful.
            if (result.isSuccess) {
                // Logs the data retrieved from the Get API method.
                // console.log(result.data);
                resolve(result.data);
            }
            else {
                // Logs errors and error descriptions.
                // console.log(result.error);
                reject(result.error);
            }
        });
    });
}

//get all app process in running
function getAllProcessDefinition()
{
    let options = {};
    let outputResult;
    // The value Admin/GetRegisterUsers shows
    // the relative path of the Get Registered User by Name method.
    options.relativePath = "Workflow/GetProcDefs";

    // The API options required to retrieve the data from the specified path.
    // Example: headers, referrer, mode, cache, redirect.
    options.apiOptions = {
        headers: { "Content-Type": "application/json;" }
    };

    options.data = {}

    return new Promise((resolve, reject) => {
        eFormHelper.agilePointAPI.get(options, function (result) {
            // Checks if the method is successful.
            if (result.isSuccess) {
                // Logs the data retrieved from the Get API method.
                // console.log(result.data);
                resolve(result.data);
            }
            else {
                // Logs errors and error descriptions.
                // console.log(result.error);
                reject(result.error);
            }
        });
    });
}

async function compileMatchingActivityDefinition(processInstanceID)
{
    let allActivityStatus = await getActivityInstanceStatus(processInstanceID);

    let allMatchingActivities = [];

    for(let x in allActivityStatus.GetActivityInstStatusResult)
    {
        let matchingActivity = {
            CurrentActivated: false,
            SourceName: allActivityStatus.GetActivityInstStatusResult[x].Key,
            TargetName: allActivityStatus.GetActivityInstStatusResult[x].Key
        };

        if(allActivityStatus.GetActivityInstStatusResult[x].Value == "Pending" ||
            allActivityStatus.GetActivityInstStatusResult[x].Value == "Active")
        {
            matchingActivity.CurrentActivated = true;
        }

        if(matchingActivity.SourceName != 'start'
            && matchingActivity.SourceName != 'stop')
        {
            allMatchingActivities.push(matchingActivity);
        }
    }

    return allMatchingActivities;
}

async function migrateProcessInstance(processInstanceID)
{
    await suspendProcessInstance(processInstanceID);

    let processDefID  = null;
    let processInstance = await getProcessInstance(processInstanceID);

    processDefID = processInstance.GetProcInstResult.DefID;

    let processDefName = processInstance.GetProcInstResult.DefName;

    let baseProcessDef = await getBaseProcessDefinitionID(processDefName);

    let baseProcessDefList = await getProcessDefinitionByBaseID(baseProcessDef.GetBaseProcDefIDResult);

    let sortedProcessDefList = baseProcessDefList.GetProcDefByBasePIDResult.sort((a, b) => {
        return a.Version - b.Version;
    });

    let targetDefID = sortedProcessDefList[sortedProcessDefList.length-1].DefID;

    let options = {};
    let outputResult;
    // The value Admin/GetRegisterUsers shows
    // the relative path of the Get Registered User by Name method.
    options.relativePath = "Workflow/MigrateProcInst/"+processInstanceID+"/null";

    // The API options required to retrieve the data from the specified path.
    // Example: headers, referrer, mode, cache, redirect.
    options.apiOptions = {
        headers: { "Content-Type": "application/json;" }
    };

    options.data = {
        Action: "0",
        IncludeXmlData: true,
        MatchingActivityDefinitions: await compileMatchingActivityDefinition(processInstanceID),
        SourceProcessDefinitionID: processDefID,
        TargetProcessDefinitionID: targetDefID,
    };

    return new Promise((resolve, reject) => {
        eFormHelper.agilePointAPI.post(options, async function (result) {
            await resumeProcessInstance(processInstanceID);
            resolve(true);
        });
    });
}

function getAllAppName()
{
    let options = {};
    let outputResult;
    // The value Admin/GetRegisterUsers shows
    // the relative path of the Get Registered User by Name method.
    options.relativePath = "Extension/GetReleasedMyApps/false";

    // The API options required to retrieve the data from the specified path.
    // Example: headers, referrer, mode, cache, redirect.
    options.apiOptions = {
        headers: { "Content-Type": "application/json;" }
    };

    options.data = {};

    return new Promise((resolve, reject) => {
        eFormHelper.agilePointAPI.get(options, function (result) {
            // Checks if the method is successful.
            if (result.isSuccess) {
                // Logs the data retrieved from the Get API method.
                // console.log(result.data);
                resolve(result.data);
            }
            else {
                // Logs errors and error descriptions.
                // console.log(result.error);
                reject(result.error);
            }
        });
    });
}

function getProcessDefinitionNameAndVersion(procDefByBasePID)
{
    let options = {};
    let outputResult;
    // The value Admin/GetRegisterUsers shows
    // the relative path of the Get Registered User by Name method.
    options.relativePath = "Workflow/GetProcDefNameVersion/"+procDefByBasePID;

    // The API options required to retrieve the data from the specified path.
    // Example: headers, referrer, mode, cache, redirect.
    options.apiOptions = {
        headers: { "Content-Type": "application/json;" }
    };

    options.data = {};

    return new Promise((resolve, reject) => {
        eFormHelper.agilePointAPI.get(options, function (result) {
            // Checks if the method is successful.
            if (result.isSuccess) {
                // Logs the data retrieved from the Get API method.
                // console.log(result.data);
                resolve(result.data);
            }
            else {
                // Logs errors and error descriptions.
                // console.log(result.error);
                reject(result.error);
            }
        });
    });
}

function getAllEnabledApplications()
{
    let options = {};
    let outputResult;
    // The value Admin/GetRegisterUsers shows
    // the relative path of the Get Registered User by Name method.
    options.relativePath = "Extension/GetAllEnabledApplications"+"?_="+new Date().getTime();

    // The API options required to retrieve the data from the specified path.
    // Example: headers, referrer, mode, cache, redirect.
    options.apiOptions = {
        headers: { "Content-Type": "application/json;" }
    };

    options.data = {};

    return new Promise((resolve, reject) => {
        eFormHelper.agilePointAPI.get(options, function (result) {
            // Checks if the method is successful.
            if (result.isSuccess) {
                // Logs the data retrieved from the Get API method.
                // console.log(result.data);
                resolve(result.data);
            }
            else {
                // Logs errors and error descriptions.
                // console.log(result.error);
                reject(result.error);
            }
        });
    });
}

function getEnabledApplication(appID)
{
    let options = {};
    let outputResult;
    // The value Admin/GetRegisterUsers shows
    // the relative path of the Get Registered User by Name method.
    options.relativePath = "Extension/GetEnabledApplication/"+appID+"/False"+"?_="+new Date().getTime();

    // The API options required to retrieve the data from the specified path.
    // Example: headers, referrer, mode, cache, redirect.
    options.apiOptions = {
        headers: { "Content-Type": "application/json;" }
    };

    options.data = {}

    return new Promise((resolve, reject) => {
        eFormHelper.agilePointAPI.get(options, function (result) {
            // Checks if the method is successful.
            if (result.isSuccess) {
                // Logs the data retrieved from the Get API method.
                // console.log(result.data);
                resolve(result.data);
            }
            else {
                // Logs errors and error descriptions.
                // console.log(result.error);
                reject(result.error);
            }
        });
    });
}

function getAppSettingEntry(baseFileID)
{
    let options = {};
    let outputResult;
    // The value Admin/GetRegisterUsers shows
    // the relative path of the Get Registered User by Name method.
    options.relativePath = "Extension/GetAppSettingEntry/"+baseFileID+"?_="+new Date().getTime();

    // The API options required to retrieve the data from the specified path.
    // Example: headers, referrer, mode, cache, redirect.
    options.apiOptions = {
        headers: { "Content-Type": "application/json;" }
    };

    options.data = {}

    return new Promise((resolve, reject) => {
        eFormHelper.agilePointAPI.get(options, function (result) {
            // Checks if the method is successful.
            if (result.isSuccess) {
                // Logs the data retrieved from the Get API method.
                // console.log(result.data);
                resolve(result.data);
            }
            else {
                // Logs errors and error descriptions.
                // console.log(result.error);
                reject(result.error);
            }
        });
    });
}

async function searchAppAccessToken()
{
    let appListObj = [];
    let allApps = await getAllEnabledApplications();

    for(let x in allApps.GetAllEnabledApplicationsResult)
    {
        let app = allApps.GetAllEnabledApplicationsResult[x];
        let appFiles = await getEnabledApplication(app.AppID);

        let sharedResourceFolder = appFiles.GetEnabledApplicationResult.Folders.filter((r) => {
            return r.FolderName.toLowerCase() == 'shared resources';
        });

        if(sharedResourceFolder[0].SubFolders?.length > 0)
        {
            let accessTokens = sharedResourceFolder[0].SubFolders.filter((r) => {
                return r.FolderName.toLowerCase() == 'access tokens';
            });

            if(accessTokens)
            {
                if(accessTokens.length > 0)
                {
                    for(let x in accessTokens[0].Files)
                    {
                        let currentToken = accessTokens[0].Files[x];
                        ;
                        let appSettingEntry = await getAppSettingEntry(currentToken.BaseFileID);

                        let matchIsQuickConfig = appSettingEntry.GetAppSettingEntryResult.Value.match('<IsQuickConfigConnectionString>true</IsQuickConfigConnectionString>');
                        let matchMySQLDbVendor = appSettingEntry.GetAppSettingEntryResult.Value.match('<DBVendor>MySQL</DBVendor>');

                        if(matchIsQuickConfig &&  matchMySQLDbVendor)
                        {
                            console.log("App Name : "+appSettingEntry.GetAppSettingEntryResult.AppName +" | Token : "+
                                appSettingEntry.GetAppSettingEntryResult.Key);

                            appListObj.push(appSettingEntry.GetAppSettingEntryResult);
                        }
                    }
                }
            }
        }
    }

    return {
        appListObj: appListObj
    };
}