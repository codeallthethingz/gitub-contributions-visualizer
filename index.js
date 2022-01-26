let username = "codeallthethingz";
let startYear = "2000";
let endYear = new Date().getFullYear();

getGithubContributions();

async function getGithubContributions() {
  let foundStartingYear = false;
  for (let year = startYear; year <= endYear; year++) {
    let commitsInYear = 0;
    document.getElementById("loading").innerHTML = `<h2>Loading ${year}</h2>`;

    await fetch(`https://api.github.com/graphql`, {
      method: "POST",
      headers: {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `query {
                  user(login: "${username}") {
                    name
                    contributionsCollection(from: "${year}-01-01T00:00:00Z", to: "${year}-12-31T23:59:59Z") {
                    contributionCalendar {
                        colors
                        totalContributions
                        weeks {
                        contributionDays {
                            color
                            contributionCount
                            date
                            weekday
                        }
                        firstDay
                        }
                    }
                    }
                }
            }`,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        let totalContributions =
          data.data.user.contributionsCollection.contributionCalendar
            .totalContributions;
        // format to add commas to totalContributions
        let formattedTotalContributions = totalContributions
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        let results = `<div class="year"><h2>${year} <span class="contributions">${formattedTotalContributions} contributions</span></h2>
        <div class="month">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
            <span>Oct</span>
            <span>Nov</span>
            <span>Dec</span>
        </div>`;
        // iterate over the weeks
        data.data.user.contributionsCollection.contributionCalendar.weeks.forEach(
          (week) => {
            results += `<div class="week">`;
            // iterate over the days
            let started = false;
            week.contributionDays.forEach((day) => {
              let borderColor = calculateBorderColor(
                day.color,
                day.contributionCount
              );
              commitsInYear += day.contributionCount;
              results += `<div title="${day.date}" class="day" style="background-color:${day.color}; border:1px solid ${borderColor}">&nbsp;</div>`;
            });
            results += `</div>`;
          }
        );
        results += "</div>";
        if (commitsInYear > 0) {
          foundStartingYear = true;
        }
        if (foundStartingYear) {
          document.getElementById("results").innerHTML =
            results + document.getElementById("results").innerHTML;
        }
      });
  }
  let header = `<h1><span class="at">@</span>${username} on GitHub <div id="key">Less&nbsp;&nbsp;`;
  let colors = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];
  for (let i = 0; i < colors.length; i++) {
    let backgroundColor = colors[i];
    let backgroundBorder = calculateBorderColor(backgroundColor);
    header += `<div class="day" style="background-color:${backgroundColor}; border:1px solid ${backgroundBorder}">&nbsp;</div>`;
  }
  header += `&nbsp;&nbsp;More</div></h1>`;
  document.getElementById("results").innerHTML =
    header + document.getElementById("results").innerHTML;
  document.getElementById("loading").style.display = "none";
}
function calculateBorderColor(color, count) {
  let r = parseInt(color.substring(1, 3), 16);
  let g = parseInt(color.substring(3, 5), 16);
  let b = parseInt(color.substring(5, 7), 16);

  // return a slightly darker color
  return `rgb(${r - 20}, ${g - 20}, ${b - 20})`;
}
