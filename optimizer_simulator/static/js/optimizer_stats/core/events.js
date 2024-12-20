// Add at the top of the file with other event handlers

// Function to handle returning to optimizer page
function returnToOptimizer() {
    // Store the current stats data if needed
    sessionStorage.setItem(
        "optimizerStatsData",
        JSON.stringify(window.statsData)
    );

    // Use history to go back instead of refreshing
    window.history.back();

    // If history.back() doesn't work (no history), fall back to regular navigation
    setTimeout(() => {
        window.location.href = optimizerUrl; // We'll get this from a global variable
    }, 100);
}

// Function to render charts for a specific tab
function renderChartsForTab(tabId) {
    if (!tabId) return;

    try {
        const renderPromises = [];

        switch (tabId) {
            case "summary-section":
                if (document.getElementById("summary-metrics")) {
                    renderPromises.push(
                        createSummaryMetrics(window.statsData.summary_stats)
                    );
                }
                if (document.getElementById("performance-chart")) {
                    renderPromises.push(
                        createPerformanceChart(
                            "performance-chart",
                            window.statsData.summary_stats
                        )
                    );
                }
                if (document.getElementById("salary-histogram")) {
                    renderPromises.push(
                        createSalaryDistribution(
                            "salary-histogram",
                            window.statsData.summary_stats
                        )
                    );
                }
                break;

            case "player-section":
                console.log(
                    "Player Stats Data:",
                    window.statsData.player_stats
                );

                if (document.getElementById("player-exposure-chart")) {
                    renderPromises.push(
                        createPlayerExposureChart(window.statsData.player_stats)
                    );
                }
                if (document.getElementById("leverage-scatter-plot")) {
                    renderPromises.push(
                        createLeverageScatterPlot(window.statsData.player_stats)
                    );
                }
                if (document.getElementById("position-donut-chart")) {
                    renderPromises.push(
                        createPositionDonutChart(window.statsData.player_stats)
                    );
                }
                if (document.getElementById("player-usage-treemap")) {
                    renderPromises.push(
                        createPlayerUsageTreemap(window.statsData.player_stats)
                    );
                }
                break;

            case "team-section":
                if (document.getElementById("team-stacking-chart")) {
                    renderPromises.push(
                        createTeamStackingChart(window.statsData.team_stats)
                    );
                }
                break;

            case "correlation-section":
                if (document.getElementById("correlation-matrix")) {
                    renderPromises.push(
                        createCorrelationMatrix(
                            window.statsData.player_stats,
                            window.statsData.correlation_stats,
                            "correlation-matrix"
                        )
                    );
                }
                break;
        }

        Promise.all(renderPromises)
            .then(() => {
                // Call addEnlargeIcons after all charts are rendered
                addEnlargeIcons();
            })
            .catch((error) => {
                console.error(
                    `Error rendering charts for tab ${tabId}:`,
                    error
                );
            });
    } catch (error) {
        console.error(`Error rendering charts for tab ${tabId}:`, error);
    }
}

// Function to add enlarge icons to chart containers
function addEnlargeIcons() {
    const chartContainers = document.querySelectorAll(".chart-container");

    chartContainers.forEach((container) => {
        // Avoid adding multiple buttons if the icon already exists
        if (container.querySelector(".enlarge-btn")) {
            return;
        }

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (
                    mutation.type === "childList" ||
                    mutation.type === "attributes"
                ) {
                    // Create or update the enlarge button
                    createOrUpdateEnlargeButton(container);
                }
            });
        });

        observer.observe(container, { childList: true, attributes: true });

        // Create or update the enlarge button initially
        createOrUpdateEnlargeButton(container);
    });

    // Also watch for changes to the tab content
    const tabContent = document.querySelector(".tab-content");
    if (tabContent) {
        const tabContentObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === "childList") {
                    // Update enlarge buttons for all chart containers
                    chartContainers.forEach((container) => {
                        createOrUpdateEnlargeButton(container);
                    });
                }
            });
        });

        tabContentObserver.observe(tabContent, { childList: true });
    }
}

// Function to create or update the enlarge button
function createOrUpdateEnlargeButton(container) {
    let button = container.querySelector(".enlarge-btn");

    if (!button) {
        button = document.createElement("button");
        button.classList.add("enlarge-btn");
        button.setAttribute("aria-label", "Enlarge Chart");
        button.innerHTML = '<i class="bi bi-arrows-angle-expand"></i>';

        container.style.position = "relative";
        container.appendChild(button);

        // Pass the container element itself, not its innerHTML
        button.addEventListener("click", () => {
            openEnlargeModal(container, container.getAttribute("data-title"));
        });
    } else {
        button.style.bottom = "10px";
        button.style.right = "10px";
    }
}

// Function to open the modal with the enlarged chart
function openEnlargeModal(container, chartTitle) {
    const modalElement = document.getElementById("enlargeChartModal");
    if (!modalElement) return;

    // Remove any existing modal backdrop
    const existingBackdrop = document.querySelector(".modal-backdrop");
    if (existingBackdrop) {
        existingBackdrop.remove();
    }

    const modal = new bootstrap.Modal(modalElement, {
        backdrop: true,
        keyboard: true,
        focus: true,
    });

    const modalTitle = modalElement.querySelector(".modal-title");
    modalTitle.textContent = chartTitle || "Enlarged Chart";
    modalTitle.style.fontSize = "24px";
    modalTitle.style.fontWeight = "600";
    modalTitle.style.color = "var(--primary)";

    const modalBody = modalElement.querySelector(".modal-body");
    modalBody.innerHTML = "";

    // Generate unique ID for modal chart container
    const modalChartId = `modal-${container.id}`;

    // Create new container with full dimensions
    const enlargedContainer = document.createElement("div");
    enlargedContainer.className = "chart-container";
    enlargedContainer.id = modalChartId;
    enlargedContainer.style.height = "80vh"; // Use viewport height
    enlargedContainer.style.width = "100%";
    modalBody.appendChild(enlargedContainer);

    // Show modal and recreate chart after animation
    modal.show();

    modalElement.addEventListener(
        "shown.bs.modal",
        function () {
            // Recreate chart with proper dimensions
            if (container.id.includes("performance-chart")) {
                createPerformanceChart(
                    modalChartId,
                    window.statsData.summary_stats
                );
            } else if (container.id.includes("salary-histogram")) {
                createSalaryDistribution(
                    modalChartId,
                    window.statsData.summary_stats
                );
            } else if (container.id.includes("player-exposure")) {
                createPlayerExposureChart(
                    window.statsData.player_stats,
                    modalChartId
                );
            } else if (container.id.includes("leverage-scatter")) {
                createLeverageScatterPlot(
                    window.statsData.player_stats,
                    modalChartId
                );
            } else if (container.id.includes("team-stacking")) {
                createTeamStackingChart(
                    window.statsData.team_stats,
                    modalChartId
                );
            } else if (container.id.includes("correlation-matrix")) {
                createCorrelationMatrix(
                    window.statsData.player_stats,
                    window.statsData.correlation_stats,
                    modalChartId
                );
            } else if (container.id.includes("player-usage-treemap")) {
                createPlayerUsageTreemap(
                    window.statsData.player_stats,
                    modalChartId
                );
            } else if (container.id.includes("position-donut")) {
                createPositionDonutChart(
                    window.statsData.player_stats,
                    modalChartId
                );
            } else {
                console.warn(
                    `No chart function found for container ID: ${container.id}`
                );
            }
        },
        { once: true }
    );

    // Cleanup on modal close
    modalElement.addEventListener(
        "hidden.bs.modal",
        function () {
            modalBody.innerHTML = "";
        },
        { once: true }
    );
}

// Store initial state
let currentState = {
    tab: "summary-section",
    previousTab: null,
};

// Function to render charts for current tab
function renderCurrentTab() {
    const activeTab = document.querySelector(".tab-pane.active");
    if (activeTab) {
        renderChartsForTab(activeTab.id);
    }
}

// Initialize charts when data is available
document.addEventListener("DOMContentLoaded", function () {
    // Initial render of the default tab
    renderCurrentTab();

    // Set up tab change listeners using Bootstrap's events
    document.querySelectorAll('a[data-bs-toggle="tab"]').forEach((tab) => {
        tab.addEventListener("shown.bs.tab", function (event) {
            const targetId = event.target.getAttribute("href").substring(1);

            // Update state
            currentState = {
                tab: targetId,
                previousTab: currentState.tab,
            };

            // Update URL without affecting history
            history.replaceState(currentState, "", `?tab=${targetId}`);

            // Render charts for the new tab
            renderChartsForTab(targetId);
        });
    });
});

// Handle back button
window.addEventListener("popstate", function (event) {
    if (event.state && event.state.tab) {
        // Get the tab element
        const tabElement = document.querySelector(
            `a[href="#${event.state.tab}"]`
        );
        if (tabElement) {
            // Use Bootstrap's tab API to show the tab
            const tab = new bootstrap.Tab(tabElement);
            tab.show();
        }
        currentState = event.state;
    }
});
