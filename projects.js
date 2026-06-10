// projects.js — Dynamic project renderer from projects.json
// Drop new projects into projects.json + add cover images to images/projects/
(function () {
  const container = document.getElementById('projects-container');
  if (!container) return;

  fetch('projects.json?' + Date.now())
    .then(function (res) { return res.json(); })
    .then(function (data) {
      render(data.projects);
    })
    .catch(function (err) {
      console.error('Failed to load projects.json:', err);
      container.innerHTML =
        '<p class="project-error">Could not load projects. Check projects.json.</p>';
    });

  function render(projects) {
    container.innerHTML = '';

    var label = document.createElement('p');
    label.className = 'work-label';
    label.textContent = 'Selected Work';
    container.appendChild(label);

    projects.forEach(function (project, i) {
      var card = buildCard(project, i === 0, i === projects.length - 1);
      container.appendChild(card);
    });
  }

  function buildCard(p, isFirst, isLast) {
    var card = document.createElement('div');
    card.className = 'project-card';
    card.id = 'project-' + p.id;

    // Top divider (skip for first)
    if (!isFirst) {
      var topDiv = document.createElement('div');
      topDiv.className = 'project-divider';
      card.appendChild(topDiv);
    }

    // Cover image
    var cover = document.createElement('div');
    cover.className = 'project-cover';
    var img = document.createElement('img');
    img.src = p.cover;
    img.alt = p.title;
    img.loading = 'lazy';
    img.onerror = function () {
      cover.classList.add('project-cover-missing');
    };
    cover.appendChild(img);
    card.appendChild(cover);

    // Meta row
    var metaDiv = document.createElement('div');
    metaDiv.className = 'project-divider';
    card.appendChild(metaDiv);

    var row = document.createElement('div');
    row.className = 'project-row';

    // Left column — title + date
    var left = document.createElement('div');
    left.className = 'project-left';

    var title = document.createElement('h2');
    title.className = 'project-title';
    title.textContent = p.title;
    left.appendChild(title);

    var date = document.createElement('p');
    date.className = 'project-date';
    date.textContent = p.date;
    left.appendChild(date);

    // Right column — industry, category, summary
    var right = document.createElement('div');
    right.className = 'project-right';

    var tags = document.createElement('p');
    tags.className = 'project-tags';
    tags.textContent = p.industry + ' · ' + p.category;
    right.appendChild(tags);

    var summary = document.createElement('p');
    summary.className = 'project-summary';
    summary.textContent = p.summary;
    right.appendChild(summary);

    row.appendChild(left);
    row.appendChild(right);
    card.appendChild(row);

    // Bottom divider
    var botDiv = document.createElement('div');
    botDiv.className = 'project-divider';
    card.appendChild(botDiv);

    // Expandable details
    var details = document.createElement('div');
    details.className = 'project-details';
    var detailsP = document.createElement('p');
    detailsP.textContent = p.details;
    details.appendChild(detailsP);
    details.style.display = 'none';
    card.appendChild(details);

    // Click to expand / collapse
    row.addEventListener('click', function () {
      var wasOpen = card.classList.contains('open');

      // Close all others
      var allCards = document.querySelectorAll('.project-card.open');
      for (var i = 0; i < allCards.length; i++) {
        allCards[i].classList.remove('open');
      }
      var allDetails = document.querySelectorAll('.project-details.open');
      for (var j = 0; j < allDetails.length; j++) {
        allDetails[j].classList.remove('open');
        allDetails[j].style.display = 'none';
      }

      if (!wasOpen) {
        card.classList.add('open');
        details.classList.add('open');
        details.style.display = 'block';
      }
    });

    // Hover cursor indicator
    row.style.cursor = 'pointer';

    return card;
  }
})();
