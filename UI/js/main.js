let tempProcesses = [];

let loginModel = {
    shouldShow: ko.observable(false)
}

function cloneObservable(observableObject) {
    return ko.toJS(observableObject);
}

let processModel = {
    query: ko.observable(''),
    shouldShow: ko.observable(true),
    processData: ko.observableArray([]),
    search: function (value) {
        processModel.processData.removeAll();
        for (var x in tempProcesses) {
            if (tempProcesses[x].dataPoolProcess.toLowerCase().indexOf(value.toLowerCase()) >= 0 ||
                tempProcesses[x].description.toLowerCase().indexOf(value.toLowerCase()) >= 0 ||
                tempProcesses[x].requisiteCode.toLowerCase().indexOf(value.toLowerCase()) >= 0 ||
                tempProcesses[x].processCode.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                processModel.processData.push(tempProcesses[x]);
            }
        }
    }
}

let signupModel = {
    shouldShow: ko.observable(false),
}

let genValues = {
    selectedEnv: ko.observable('TEST'),
    envs: ko.observableArray([
        { env: 'TEST' }, { env: "TEST2" }, { env: "TEST3" }])
}

function loginPage() {
    console.log("function called!");
    loginModel.shouldShow = true;
    signupModel.shouldShow = false;
    processModel.shouldShow = false;
    console.log(loginModel.shouldShow);
    console.log(signupModel.shouldShow);
    console.log(processModel.shouldShow);
}

function initializeProcessModel() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: 'http://localhost:8080/SIT/home',
            method: 'GET',
            contentType: "application/json"
        })
            .done(function (data) {
                processModel.processData = ko.mapping.fromJS(data);
                tempProcesses = cloneObservable(processModel.processData);
                resolve();
            })
            .fail(function (err) {
                console.log(err);
                reject(err);
            })
    });
}

function filterResults(FilterString, data) {
    var records = [];
    console.log(data.length);
    for (var i = 0; i < data.length; i++) {
        if (data[i].dataPoolProcess.toUpperCase().includes(FilterString) ||
            data[i].description.toUpperCase().includes(FilterString) ||
            data[i].processCode.toUpperCase().includes(FilterString) ||
            data[i].requisiteCode.toUpperCase().includes(FilterString)) {
            records.push(data[i]);
        }
    }
    console.log(records);
    return records;
}


$(document).ready(function () {
    ko.applyBindings(loginModel, document.getElementById('loginPage'));
    ko.applyBindings(genValues, document.getElementById('main'));
    ko.applyBindings(signupModel, document.getElementById('signupPage'));

    initializeProcessModel()
        .then(function () {
            ko.applyBindings(processModel, document.getElementById('processTable'));
        });

    processModel.query.subscribe(processModel.search);

});