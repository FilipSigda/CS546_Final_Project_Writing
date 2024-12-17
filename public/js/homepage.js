(function ($) {
    let searchForm = $('#searchBar');

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
    };

    searchForm.submit(function (event){
        let name = $('#searchName'),
            startDate = $('#searchStartDate'),
            endDate = $('#searchEndDate'),
            status = $('#searchStatus'),
            excludeStatus = $('#searchExcludeStatus'),
            maxRating = $('#searchMaxRating'),
            minRating = $('#searchMinRating'),
            maxReviews = $('#searchMaxReviews'),
            minReviews = $('#searchMinReviews'),
            maxChar = $('#searchMaxChar'),
            minChar = $('#searchMinChar'),
            groupAssociation = $('#searchAssociation'),
            tags = $('#searchTags'),
            excludeTags = $('#searchExcludeTags');

        let errorReport = $('#searchErrors');
        errorReport.hide();
        let errors = [];

        try{
            checkString(name.val(), "name", true);
        }
        catch(e){
            errors.push(e);
        }
        try{
            checkString(startDate.val(), "start date", true);
        }
        catch(e){
            errors.push(e);
        }
        try{
            checkString(endDate.val(), "end date", true);
        }
        catch(e){
            errors.push(e);
        }
        try{
            if(endDate.val() !== "" && startDate.val() > endDate.val()){
                throw new Error("Start date must be less than end date.");
            }
        }
        catch(e){
            errors.push(e);
        }            
        try{
            checkString(status.val(), "status", true);
            if(status.val() !== "" && status.val() !== "ongoing" && status.val() !== "complete" && status.val() !== "dropped"){
                console.log(status.val());
                throw new Error("Invalid status selected.");
            }
        }
        catch(e){
            errors.push(e);
        }
        try{
            checkString(excludeStatus.val(), "excluded status", true);
            if(excludeStatus.val() !== "" && excludeStatus.val() !== "ongoing" && excludeStatus.val() !== "complete" && excludeStatus.val() !== "dropped"){
                throw new Error("Invalid excluded status selected.");
            }
        }
        catch(e){
            errors.push(e);
        }
        try{
            checkString(maxRating.val(), "maximum rating", true);
        }
        catch(e){
            errors.push(e);
        }
        try{
            checkString(minRating.val(), "minimum rating", true);
        }
        catch(e){
            errors.push(e);
        }
        try{
            if(maxRating.val() !== "" && minRating.val() > maxRating.val()){
                throw new Error("Minimum rating must not exceed maximum rating.");
            }
        }
        catch(e){
            errors.push(e);
        }
        try{
            checkString(maxReviews.val(), "maximum reviews", true);
        }
        catch(e){
            errors.push(e);
        }
        try{
            checkString(minReviews.val(), "minimum reviews", true);
        }
        catch(e){
            errors.push(e);
        }
        try{
            if(maxReviews.val() !== "" && maxReviews.val() < minReviews.val()){
                throw new Error("Minimum reviews must not exceed maximum reviews.");
            }
        }
        catch(e){
            errors.push(e);
        }
        try{
            checkString(maxChar.val(), "maximum characters", true);
        }
        catch(e){
            errors.push(e);
        }
        try{
            checkString(minChar.val(), "minimum characters", true);
        }
        catch(e){
            errors.push(e);
        }
        try{
            if(maxChar.val() !== "" && minChar.val() > maxChar.val()){
                throw new Error("Minimum characters must not exceed maximum characters.");
            }
        }
        catch(e){
            errors.push(e);
        }
        try{
            checkString(groupAssociation.val(), "group association", true);
            if(groupAssociation.val() !== "" && groupAssociation.val() !== "group" && groupAssociation.val() !== "individual"){
                throw new Error("Invalid group association selected.");
            }
        }
        catch(e){
            errors.push(e);
        }
        try{
            checkString(tags.val(), "tags", true);
        }
        catch(e){
            errors.push(e);
        }
        try{
            checkString(excludeTags.val(), "excluded tags", true);
        }
        catch(e){
            errors.push(e);
        }

        if(errors.length !== 0){
            event.preventDefault();
            errorReport.show();

            event.preventDefault();
            errorReport.empty();
            errorReport.show();

            let myUl = $(`<ul></ul>`);

            for (let x of errors){
                let element = $(`<li>${x}</li>`)
                myUl.append(element);
            }

            errorReport.append(myUl);
        }
    });
})(window.jQuery);