const actionLog = new Array();

export class Action {
  constructor(action, payload) {
    this.action = action;
    this.payload = payload;
  }

  merge(olderAction) {
    if (this.payload.id == olderAction.payload.id) {
      // delete has priority
      if (this.action.includes('DELETE')) {
        return this; // this = newerAction
      } else {
        // merge payload
        return new Action(
          olderAction.action,
          Object.assign(olderAction.payload, this.payload)
        );
      }
    }
    return false;
  }

  static add(action, payload) {
    const currAction = new Action(action, payload);
    actionLog.push(currAction);
    return currAction;
  }

  static getFrom(action) {
    let index = actionLog.findIndex( (currAction) => {
      return action === currAction;
    });
    index++;
    
    let newLog = new Array();
    for (let i = actionLog.length-1; i >= index; i--) {
      const olderAction = actionLog[i];
      let isNew = true;
      newLog = newLog.map( (newerAction) => {
        let mergedAction = newerAction.merge(olderAction);
        if (!mergedAction) {
          return newerAction;
        } else {
          isNew = false;
        }
        return mergedAction;
      });

      if (isNew) {
        newLog.unshift(olderAction);
      }
    }

    return [newLog, Action.getLastAction()];
  }

  static getLastAction() {
    return actionLog[actionLog.length - 1];
  }

  static purgeActionLog(actionList) {
    let lowestIndex = actionLog.length - 1;
    actionList.forEach( (action) => {
      const index = actionLog.indexOf(action);
      if (!!~index && index < lowestIndex) {
        lowestIndex = index;
      }
    });

    actionLog.splice(0, lowestIndex + 1);
  }
}
