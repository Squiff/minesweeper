/** Only include the SVGs that are used, instead of the entire "font" */

import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { faBomb, faFlag, faMedal, faMousePointer } from '@fortawesome/free-solid-svg-icons';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

// only package up these icons
library.add(faQuestionCircle, faBomb, faFlag, faMedal, faMousePointer, faGithub);

// Replace any existing <i> tags with <svg> and set up a MutationObserver to
// continue doing this as the DOM changes.
export function watchIcons() {
    dom.watch();
}
