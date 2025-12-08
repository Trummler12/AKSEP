/**
 * /start — Landingpage
 * @param {{ path: string, params: object, query: URLSearchParams }} context
 */
export function createStartView(context) {
  const container = document.createElement('div');
  container.className = 'view view--start';

  const heading = document.createElement('h1');
  heading.textContent = 'Welcome to Schoolsystem2';

  const intro = document.createElement('p');
  intro.textContent =
    'Discover topics, explore curated resources (like YouTube videos), and let the interest search suggest what fits you.';

  const featuresList = document.createElement('ul');
  featuresList.className = 'view-start__features';

  const liTopics = document.createElement('li');
  liTopics.innerHTML =
    '<strong>Browse topics</strong>: Filter, search & explore the full topic catalog.';

  const liDetail = document.createElement('li');
  liDetail.innerHTML =
    '<strong>Topic details</strong>: See relevant resources scored by tag matches and watch videos right on the page.';

  const liInterest = document.createElement('li');
  liInterest.innerHTML =
    '<strong>Interest search</strong>: Describe what you like and get a sorted list of matching topics.';

  featuresList.appendChild(liTopics);
  featuresList.appendChild(liDetail);
  featuresList.appendChild(liInterest);

  container.appendChild(heading);
  container.appendChild(intro);
  container.appendChild(featuresList);

  return container;
}
