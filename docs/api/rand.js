export function check(){
  const pr = new Promise((resolve, reject) => {
    setTimeout(() => {
      const rand = Math.floor(Math.random() * 10);
      if(rand > 3)resolve('success');
      else reject('error');
    }, 1000);
  })
  return pr;
}

export function saveToStorage(tweets){
  window.localStorage.setItem('tweets', JSON.stringify(tweets))
}

export function loadFromStorage() {
  const tweets = window.localStorage.getItem('tweets')
  if (tweets)
    return JSON.parse(tweets)
  else return [];
}

export function clearStorage() {
  window.localStorage.removeItem('tweets')
}
