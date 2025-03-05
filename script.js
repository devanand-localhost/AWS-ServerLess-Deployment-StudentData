// API Endpoint configuration
var API_ENDPOINT = "https://1gde3qh9uc.execute-api.ap-south-1.amazonaws.com/prod";

// Utility function to create loading spinner
function createLoadingSpinner() {
    return `
        <div class="loading-spinner">
            <div class="spinner"></div>
        </div>
    `;
}

// Utility function to create skeleton loader rows
function createSkeletonLoaderRows(count = 5) {
    let rows = '';
    for (let i = 0; i < count; i++) {
        rows += `
            <tr>
                <td class="skeleton-loader">&nbsp;</td>
                <td class="skeleton-loader">&nbsp;</td>
                <td class="skeleton-loader">&nbsp;</td>
                <td class="skeleton-loader">&nbsp;</td>
            </tr>
        `;
    }
    return rows;
}

$(document).ready(function() {
    // Save student data
    $("#savestudent").on('click', function() {
        // Disable button and show loading
        const $button = $(this);
        const $statusMessage = $("#studentSaved");
        
        // Validate inputs
        const studentId = $('#studentid').val().trim();
        const name = $('#name').val().trim();
        const studentClass = $('#class').val().trim();
        const age = $('#age').val().trim();

        // Input validation
        if (!studentId || !name || !studentClass || !age) {
            $statusMessage.text("Please fill in all fields").css('color', 'red');
            return;
        }

        // Disable button and show loading
        $button.addClass('btn-disabled');
        $('body').append(createLoadingSpinner());

        // Prepare input data
        var inputData = {
            "studentid": studentId,
            "name": name,
            "class": studentClass,
            "age": age
        };

        // AJAX POST request to save student data
        $.ajax({
            url: API_ENDPOINT,
            type: 'POST',
            data: JSON.stringify(inputData),
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                $statusMessage.text("Student Data Saved!").css('color', 'green');
                $('#studentDataForm')[0].reset();
            },
            error: function (xhr, status, error) {
                $statusMessage.text("Error saving student data: " + error).css('color', 'red');
            },
            complete: function() {
                // Remove loading spinner and re-enable button
                $('.loading-spinner').remove();
                $button.removeClass('btn-disabled');
            }
        });
    });

    // Retrieve all students
    $("#getstudents").on('click', function() {
        const $button = $(this);
        const $tableBody = $('#studentTableBody');
        const $statusMessage = $("#studentSaved");

        // Disable button and show loading
        $button.addClass('btn-disabled');
        
        // Clear existing rows and add skeleton loader
        $tableBody.html(createSkeletonLoaderRows());
        
        // Add loading spinner to body
        $('body').append(createLoadingSpinner());

        // AJAX GET request to retrieve students
        $.ajax({
            url: API_ENDPOINT,
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                // Clear skeleton loader
                $tableBody.empty();

                // Check if response is empty
                if (!response || response.length === 0) {
                    $tableBody.append('<tr><td colspan="4" class="text-center">No students found</td></tr>');
                    return;
                }

                // Populate table with student data with fade-in effect
                $.each(response, function(i, data) {
                    const $row = $(`
                        <tr class="fade-in">
                            <td>${data.studentid}</td>
                            <td>${data.name}</td>
                            <td>${data.class}</td>
                            <td>${data.age}</td>
                        </tr>
                    `);
                    $tableBody.append($row);
                });
            },
            error: function (xhr, status, error) {
                $tableBody.empty();
                $tableBody.append(`
                    <tr>
                        <td colspan="4" class="text-center" style="color: red;">
                            Error retrieving student data: ${error}
                        </td>
                    </tr>
                `);
            },
            complete: function() {
                // Remove loading spinner and re-enable button
                $('.loading-spinner').remove();
                $button.removeClass('btn-disabled');
            }
        });
    });
});