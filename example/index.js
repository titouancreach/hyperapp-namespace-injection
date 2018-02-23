import {h, app} from 'hyperapp';
import withNamespaceInjection from '../src';

const delay = (time) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, time);
  })
}

const state = {
  counter: {
    count: 0
  },
  loading: {
    isLoading: false
  }
}

const actions = {
  counter: {
    downAsync: ['loading', (loading, value) => (state, action) => {

      console.log('loading', loading);

      loading.setIsLoading(true);
      console.log(action);
      
      return delay(500)
        .then(() => {
          action.down(value)
        })
        .then(() => {
          loading.setIsLoading(false)
        })
    }],

    down: value => state => ({count: state.count - value}), 
    
    up: value => state => ({count: state.count + value})
  },
  loading: {
    setIsLoading: v => state => {
      return {
        isLoading: v
      }
    }
  }
}

const view = (state, actions) => (
  <div>
    <h1>{state.counter.count}</h1>
    <button onclick={() => actions.counter.downAsync(1)}>-</button>
    <button onclick={() => actions.counter.up(1)}>+</button>
    <div>{state.loading.isLoading ? "loading..." : "NO"}</div>
  </div>
)

withNamespaceInjection(app)(state, actions, view, document.getElementById('app'));
