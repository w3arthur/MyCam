// event shortcut functions
export function getElement(id){if(typeof id === 'string') return document.getElementById(id);if(typeof id === 'object') return id;}
export function clickEvent(id, externalFunction ){ if(typeof id == 'string') return getElement(id).addEventListener('click', (e)=>{ externalFunction(e) } ); }
export function changeEvent(element, externalFunction ){ return getElement(element).addEventListener('change', (e)=>{ externalFunction(e) } ); }
