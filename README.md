Optimum An NFL DFS Optimization and Simulation System
* **Author**: Daniel Hawkin, github: [dhawkins44](www.github.com/dhawkins44)
* **Major**: Computer Science
* **Year**: 2024

# Type of project

This is a web-based DFS (Daily Fantasy Sports) lineup optimizer and simulator application, specifically focused on NFL fantasy football. It helps users create and analyze optimal fantasy football lineups.

# Purpose (including intended audience)

Daily Fantasy Sports (DFS) participants face complex decisions when building lineups, needing to consider player projections, salary constraints, ownership projections, and correlations between players. Optimum provides a comprehensive tool that helps users optimize their DFS strategy through two main components:

- An **Optimizer** that generates optimal lineups while respecting salary caps, position
requirements, and team stacking rules.
- A **Simulator** that tests lineup performance across thousands of simulated contests,
helping users understand their risk exposure and expected returns.

Both components feature interactive data visualizations that make complex data easily digestible, including a player correlation matrix, interactive team stacking analysis, ownership leverage scatter plots, FLEX position usage breakdowns, player usage treemaps, and many more.

By combining optimization algorithms with statistical simulation and intuitive data visualization, this tool enables data-driven decision-making in DFS contests while accounting for real-world variance and player correlations.

# Explanation of files

There are too many files to list, but I will list the important ones:

Input Data Files:

- ```media/uploads/player_ids.csv```: Contains player information including names, positions, salaries, and game details for all available players in the contest.
- ```media/uploads/projections.csv```: Provides fantasy point projections, ownership percentages, and game-related metrics (like moneylines and over/unders) for each player.
- ```media/uploads/contest_structure.csv```: Defines the tournament's payout structure, showing prize amounts for different finishing positions in a 147,058-player contest with a $20 entry fee. This is the tournament structure used when the "Use Contest Payout Data" box is checked.

Core Functionality:

- ```optimizer_simulator/utils/optimizer.py```: A Python-based NFL lineup optimizer that uses PuLP for linear programming to generate optimal DFS lineups by processing player data through CSV/JSON inputs, applying complex roster construction rules and salary constraints.
- ```optimizer_simulator/utils/simulator.py```: A GPP (Guaranteed Prize Pool) tournament simulator that leverages NumPy, Pandas and SciPy to perform Monte Carlo simulations of contest outcomes by analyzing player correlations, ownership projections and variance calculations through CSV/JSON data processing.

Data Visualization:

- ```optimizer_simulator/js/optimizer_stats/charts/summary.js``` -  Creates a simple dashboard-style display of key metrics (Total Lineups, Average Points, and Average Salary) using D3 to generate card-like elements with large numbers and labels.

- ```optimizer_simulator/js/optimizer_stats/charts/team.js``` - Implements team-related visualizations including stacking charts and team distribution graphs using D3.js.

- ```optimizer_simulator/js/optimizer_stats/charts/player.js``` - Creates player-specific visualizations including exposure charts, position donut charts, and usage treemaps using D3.js.

-  ```optimizer_simulator/js/optimizer_stats/charts/correlation.js``` - Generates an interactive correlation matrix visualization showing relationships between players using D3.js and matrix calculations.
 
- ```optimizer_simulator/js/optimizer_stats/charts/summary.js``` - To be completed. It will include visualizations of player matchup data, matchup exposure, and game performance.

The remaining python, javascript, html, and css files conssist of the backend and frontend of the project. They combine 

The rest of the files 

# Completion status

The core functionality of the project is complete, but there are pieces I would like to finish/add:

- [ ] Finish all of the data visualizations

## Enhancements: 
<List at least 2>

- [ ] Add persistent storage
- [ ] Add support for other DFS sites beyond DraftKings

# Can someone else work on this project? 

No

# Public Display/dissemination

The project is deployed at [Optimum](https://optimum-production.up.railway.app/optimizer_simulator/)

# License
