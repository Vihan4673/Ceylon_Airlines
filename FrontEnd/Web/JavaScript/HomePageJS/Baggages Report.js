document.addEventListener('DOMContentLoaded', () => {
    const reportForm = document.getElementById('reportForm');
    const photoInput = document.getElementById('reportPhoto');
    const previewContainer = document.getElementById('photoPreviewContainer');
    const imagePreview = document.getElementById('imagePreview');
    const fileNameDisplay = document.getElementById('previewFileName');

    if (photoInput) {
        photoInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.src = e.target.result;
                    fileNameDisplay.innerText = file.name;
                    previewContainer.classList.remove('hidden');
                }
                reader.readAsDataURL(file);
            }
        });
    }
    if (reportForm) {
        reportForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = reportForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = "SUBMITTING...";
            submitBtn.disabled = true;

            const formData = new FormData();
            formData.append('passengerName', document.getElementById('reportName').value);
            formData.append('email', document.getElementById('reportEmail').value);
            formData.append('passportNumber', document.getElementById('reportPassport').value);
            formData.append('flightNumber', document.getElementById('reportFlight').value);
            formData.append('description', document.getElementById('reportDesc').value);

            if (photoInput.files.length > 0) {
                formData.append('photo', photoInput.files[0]);
            }

            try {
                const response = await fetch('http://localhost:8080/api/v1/baggage/report', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log('Success:', result);

                    alert("Report Submitted Successfully! Your tracking ID will be sent via email.");

                    closeReportModal();
                } else {
                    const errorData = await response.text();
                    throw new Error(errorData || "Submission failed");
                }

            } catch (error) {
                console.error('Error:', error);
                alert("Error: " + error.message);
            } finally {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});

window.openReportModal = function() {
    const modal = document.getElementById('reportModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
};

window.closeReportModal = function() {
    const modal = document.getElementById('reportModal');
    const reportForm = document.getElementById('reportForm');

    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';

        if (reportForm) reportForm.reset();
        removeSelectedPhoto();
    }
};

window.removeSelectedPhoto = function() {
    const photoInput = document.getElementById('reportPhoto');
    const previewContainer = document.getElementById('photoPreviewContainer');

    if (photoInput) photoInput.value = "";
    if (previewContainer) previewContainer.classList.add('hidden');
};