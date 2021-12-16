import {LitElement, html, css} from 'lit';
import {check, saveToStorage, loadFromStorage, clearStorage} from './api/rand';

export class MyElement extends LitElement {
  static get styles() {
    return css`
      :host {
        display: flex;
      }
      .container {
        width: 100%;
        display: grid;
        padding: 84px;
        gap: 52px;
        grid-template-columns: 1fr 3fr 1fr;
      }
      
      .container > div {
        display: flex;
        flex-direction: column;
        border-bottom: 1px solid rgb(223, 223, 223);
        box-shadow: rgb(0 0 0 / 20%) 0px 0px 12px;
        border-radius: 12px;
        padding: 12px;
      }
      
      .left {
        display: grid;
        grid-gap: 24px;
      }
      
      .left > span {
        display: flex;
        justify-content: space-between;
        gap: 12px;
      }
      
      .tweet {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        margin-bottom: 12px;
        border-bottom: 1px solid grey;
      }
      
      .title {
        font-size: 14px;
        font-weight: bold;
      }
      
      .post {
        font-size: 22px;
        color: gray;
      }
    `;
  }

  render() {
    return html`
      <div class='container'>
        <div class='left'>
          <span>          Name:
          <input @input="${this.nameInput}" .value="${this.nameToTweet}">
          </span>
          <span>
          Post:
          <textarea @input='${this.postInput}' .value="${this.postToTweet}"></textarea>
          </span>
          <span >
          <button @click='${this.postTweet}'>Tweet</button>
          </span>
        </div>
        <div class='middle'>
          ${this.tweets.map((item, index)=> html`
            <div class='tweet'>
              <div class='title'>${item.name}</div>
              <div class='post'>${item.post}</div>
              <span style='color: red; cursor: pointer' @click='${()=> this.DeleteTweet(index)}'>Delete</span>
            </div>
          `)}
        </div>
        <div class='right'>
          Posted <span style='font-weight: bold'>${this.postCount || 0}</span> tweet
        </div>
      </div>
    `;
  }

  static get properties() {
    return {
      tweets: {
        type: Array,
      },
      postCount: {
        type: Number,
      },
      nameToTweet:{type:String,},
      postToTweet:{type:String,}
    };
  }

  constructor() {
    super();
    this.tweets = loadFromStorage();
    this.postCount=this.tweets.length;
    this.nameToTweet='';
    this.postToTweet='';
    //საჩვენებლად (უნდა შეარჩიოთ სწორი ფუნქცია, სწორი ადგილი "check"ის გამოსაძახებლად)
    // საჭიროებისთვის გაარჩიე then, catch და promise
    // check()
    //   .then(r=> console.log(r))
    //   .catch(r=> console.error(r))
  }

  nameInput(event){
    const value = event.target.value;
    this.nameToTweet = value;
  }
  postInput(event){
    const value = event.target.value;
    this.postToTweet = value;
  }

  inputsValidator(){
    let isValid = true;

    if(this.nameToTweet.trim().length === 0 || this.postToTweet.trim().length === 0) isValid=false;

    return isValid;
  }

  postTweet(){
    let validationResult = this.inputsValidator();

    if(validationResult){
      check()
      .then((res)=>{
        const tweet = {
          name:this.nameToTweet,
          post:this.postToTweet
        };
        this.tweets.push(tweet);
        saveToStorage(this.tweets);
        this.tweets = loadFromStorage();
        this.rewriteCount();
        this.postToTweet='';
        this.nameToTweet='';
      })
      .catch((error)=>{   
        alert(error)    
      });
    }
    else alert('ველები არ უნდა იყოს ცარიელი');
  }

  async DeleteTweet(index){
    await check()
    .then(res=>{
      this.tweets.splice(index,1);
      let list = [...this.tweets];
      this.tweets=saveToStorage(list)
      this.tweets = loadFromStorage();
      this.rewriteCount();
    })
    .catch(error=>{
      alert('delete error')
    })
  }

  rewriteCount(){
    this.postCount=this.tweets.length;
  }

}

window.customElements.define('my-element', MyElement);
