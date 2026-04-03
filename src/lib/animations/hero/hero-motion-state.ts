const HERO_INTRO_STATE_ATTRIBUTE = 'data-hero-intro-state';
const HERO_HEADER_SELECTOR = '.site-header';
const HERO_SCROLL_SELECTOR = '[data-hero-scroll]';

type HeroIntroState = 'pending' | 'active' | 'released';

function getBody() {
  return document.body;
}

function getHeroIntroState(): HeroIntroState | undefined {
  return getBody().dataset.heroIntroState as HeroIntroState | undefined;
}

function setHeroIntroState(state: HeroIntroState) {
  if (getHeroIntroState() === state) {
    return;
  }

  getBody().dataset.heroIntroState = state;
}

function setElementInert(selector: string, isInert: boolean) {
  const element = getBody().querySelector(selector);

  if (!element) {
    return;
  }

  if (isInert) {
    element.setAttribute('inert', '');
    return;
  }

  element.removeAttribute('inert');
}

function setGatedAffordancesInert(isInert: boolean) {
  setElementInert(HERO_HEADER_SELECTOR, isInert);
  setElementInert(HERO_SCROLL_SELECTOR, isInert);
}

export function enterPendingIntro() {
  setGatedAffordancesInert(false);
  setHeroIntroState('pending');
}

export function activateIntro() {
  if (getHeroIntroState() === 'released') {
    return;
  }

  setHeroIntroState('active');
  setGatedAffordancesInert(true);
}

export function releaseIntro() {
  setGatedAffordancesInert(false);
  setHeroIntroState('released');
}

export function failOpenIntro() {
  releaseIntro();
}

export { HERO_INTRO_STATE_ATTRIBUTE };
