const HERO_INTRO_STATE_ATTRIBUTE = 'data-hero-intro-state';
const HERO_HEADER_SELECTOR = '.site-header';

function getBody() {
  return document.body;
}

function setHeroIntroState(state: 'pending' | 'active' | 'released') {
  getBody().dataset.heroIntroState = state;
}

function setHeaderInert(isInert: boolean) {
  const header = getBody().querySelector(HERO_HEADER_SELECTOR);

  if (!header) {
    return;
  }

  if (isInert) {
    header.setAttribute('inert', '');
    return;
  }

  header.removeAttribute('inert');
}

export function enterPendingIntro() {
  setHeaderInert(false);
  setHeroIntroState('pending');
}

export function activateIntro() {
  setHeroIntroState('active');
  setHeaderInert(true);
}

export function releaseIntro() {
  setHeroIntroState('released');
  setHeaderInert(false);
}

export function failOpenIntro() {
  releaseIntro();
}

export { HERO_INTRO_STATE_ATTRIBUTE };
