document.addEventListener('DOMContentLoaded', () => {
    const reportForm = document.getElementById('reportForm');
    const photoInput = document.getElementById('reportPhoto');
    const previewContainer = document.getElementById('photoPreviewContainer');
    const imagePreview = document.getElementById('imagePreview');
    const fileNameDisplay = document.getElementById('previewFileName');

    // --- 1. පින්තූරයක් තේරූ විට Preview එක පෙන්වීම ---
    if (photoInput) {
        photoInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                // පින්තූරය කියවීම සඳහා FileReader භාවිතා කිරීම
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.src = e.target.result;
                    fileNameDisplay.innerText = file.name;
                    // Preview කොටස පෙන්වීම
                    previewContainer.classList.remove('hidden');
                }
                reader.readAsDataURL(file);
            }
        });
    }

    // --- 2. Form Submission (දත්ත Backend එකට යැවීම) ---
    if (reportForm) {
        reportForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Submit Button එක Disable කිරීම
            const submitBtn = reportForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = "SUBMITTING...";
            submitBtn.disabled = true;

            // FormData සාදා ගැනීම (Multipart Form Data සඳහා)
            const formData = new FormData();
            formData.append('passengerName', document.getElementById('reportName').value);
            formData.append('email', document.getElementById('reportEmail').value);
            formData.append('passportNumber', document.getElementById('reportPassport').value);
            formData.append('flightNumber', document.getElementById('reportFlight').value);
            formData.append('description', document.getElementById('reportDesc').value);

            // පින්තූරයක් තේරූ ඇත්නම් එය එකතු කිරීම
            if (photoInput.files.length > 0) {
                formData.append('photo', photoInput.files[0]);
            }

            try {
                const response = await fetch('http://localhost:8080/api/v1/baggage/report', {
                    method: 'POST',
                    body: formData
                    // Content-Type Header එක manually දැමීම අවශ්‍ය නැත
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log('Success:', result);

                    alert("Report Submitted Successfully! Your tracking ID will be sent via email.");

                    // සාර්ථක වූ පසු Form එක සම්පූර්ණයෙන් Reset කිරීම
                    closeReportModal();
                } else {
                    const errorData = await response.text();
                    throw new Error(errorData || "Submission failed");
                }

            } catch (error) {
                console.error('Error:', error);
                alert("Error: " + error.message);
            } finally {
                // Button එක යථා තත්ත්වයට පත් කිරීම
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});

/**
 * Modal එක පෙන්වන Function එක
 */
window.openReportModal = function() {
    const modal = document.getElementById('reportModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
};

/**
 * Modal එක වසා දමන සහ දත්ත Reset කරන Function එක
 */
window.closeReportModal = function() {
    const modal = document.getElementById('reportModal');
    const reportForm = document.getElementById('reportForm');

    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';

        // Form එක සහ පින්තූර Preview එක සම්පූර්ණයෙන් ඉවත් කිරීම
        if (reportForm) reportForm.reset();
        removeSelectedPhoto();
    }
};

/**
 * තෝරාගත් පින්තූරය ඉවත් කිරීම
 */
window.removeSelectedPhoto = function() {
    const photoInput = document.getElementById('reportPhoto');
    const previewContainer = document.getElementById('photoPreviewContainer');

    if (photoInput) photoInput.value = ""; // Input එක හිස් කිරීම
    if (previewContainer) previewContainer.classList.add('hidden'); // Preview එක සැඟවීම
};