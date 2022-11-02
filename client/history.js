import { createMemoryHistory, createBrowserHistory } from 'history';

// createMemoryHistory() allows us to test code that relies on a history object without having to actually test with a browser.
const history =
  process.env.NODE_ENV === 'test'
    ? createMemoryHistory()
    : createBrowserHistory();

export default history;
