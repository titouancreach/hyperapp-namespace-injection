function isPlainObject(obj) {
  
    // Basic check for Type object that's not null
    if (typeof obj == 'object' && obj !== null) {
  
      // If Object.getPrototypeOf supported, use it
      if (typeof Object.getPrototypeOf == 'function') {
        var proto = Object.getPrototypeOf(obj);
        return proto === Object.prototype || proto === null;
      }
      
      // Otherwise, use internal class
      // This should be reliable as if getPrototypeOf not supported, is pre-ES5
      return Object.prototype.toString.call(obj) == '[object Object]';
    }
    
    // Not an object
    return false;
  }

function inject(rootActions, arrayAction) {
  const namespaces = arrayAction.slice(0, -1);
  const action = arrayAction.slice(-1)[0];
  const injection = namespaces.map(namespace => rootActions[namespace])
  return action.bind(null, ...injection);
}

function enhanceAction(actions) {
  const enhanceActionRec = (actions, rootActions) => {
    return Object.entries(actions).map(([actionKey, actionValue]) => {
      if (isPlainObject(actionValue)) {
        return [actionKey, enhanceActionRec(actionValue, rootActions)]
      }
      if (Array.isArray(actionValue)) {
        return [actionKey, inject(rootActions, actionValue)]
      }
      return [actionKey, actionValue];
    }).reduce((acc, [k, v]) => ({...acc, [k]: v}), {})
  }
  return enhanceActionRec(actions, actions);
}


export default function(app) {
  return (state, actions, view, dom) => {
    const enhancedActions = enhanceAction(actions);
    console.log('enhanced', enhancedActions);
    app(state, enhancedActions, view, dom)
  }
}
