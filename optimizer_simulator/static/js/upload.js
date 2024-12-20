document.addEventListener("DOMContentLoaded", function () {
    const uploadForm = document.getElementById("upload-form");
    const uploadMessages = document.getElementById("upload-messages");

    if (uploadForm) {
        uploadForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const formData = new FormData(this);
            const submitButton = this.querySelector('button[type="submit"]');

            // Disable form submission while uploading
            submitButton.disabled = true;
            submitButton.innerHTML = "Uploading...";

            try {
                const response = await fetch(this.action, {
                    method: "POST",
                    headers: {
                        "X-CSRFToken": document.querySelector(
                            "[name=csrfmiddlewaretoken]"
                        ).value,
                    },
                    body: formData,
                });

                const data = await response.json();

                if (data.success) {
                    // Parse player CSV and preload player images if function exists
                    if (window.preloadAllPlayerImages) {
                        fetch("/media/uploads/player_ids.csv")
                            .then((response) => response.text())
                            .then((csvText) => {
                                const playerData = csvText
                                    .split("\n")
                                    .slice(1)
                                    .filter((line) => line.trim())
                                    .map((line) => {
                                        const [position, _, name] =
                                            line.split(",");
                                        return { position, name };
                                    });
                                preloadAllPlayerImages(playerData);
                            });
                    }

                    // Close modal if it exists and redirect
                    const modalElement =
                        document.getElementById("upload-modal");
                    const modal = bootstrap.Modal.getInstance(modalElement);

                    if (modal) {
                        modal.hide();
                        window.location.href = data.redirect_url;
                    } else {
                        window.location.href = data.redirect_url;
                    }
                } else {
                    alert(data.error || "Error uploading files");
                }
            } catch (error) {
                console.error("Upload error:", error);
                alert("Error uploading files: " + error.message);
            } finally {
                // Reset button to original state
                submitButton.disabled = false;
                submitButton.innerHTML = "Upload Files";
            }
        });
    }

    // Handle skip button to bypass file upload
    const skipButton = document.getElementById("skip-upload");
    if (skipButton) {
        skipButton.addEventListener("click", function () {
            window.location.href = "/optimizer_simulator/optimizer/";
        });
    }
});
