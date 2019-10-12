<template>
  <div>
    <div class="global-nav fixed-top">
      <div id="container">
        <div class="navbar">
          <div id="left-nav">
            <router-link class="navText" to="/">Jonathan Hellberg</router-link>
            <div v-for="reca in getAllReports" v-bind:key="reca.id">
              <router-link class="navText" :id="'link' + reca.id" v-on:click="report" :to="'/reports/week/' + reca.id">Week {{reca.id}}</router-link>
            </div>
            <router-link class="navText" to="/chat">Chat</router-link>
          </div>
          <div id="right-nav">
            <div v-if="auther">
              Logged in
              </div>
            <div v-else>
            <span id="login" class="navText" v-on:click="showLogin"> Login</span>
            <span class="navText" v-on:click="show"> Register</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="chat">
    <div class="chat__wrapper" v-if="user.name">
      <div class="chat__conversation">
        <span class='v' v-for="reca in this.mes" v-bind:key="reca._id">
          {{ reca.username }}: {{ reca.date }} {{reca.text}}
        </span>
        <chat-conversation :socket="socket">
        </chat-conversation>
        <div class="chat__controls">
          <input @keyup="onKeyUp" class="chat__input" v-model="message" />
          <button class="chat__button" @click="sendMessage">Send</button>
        </div>
      </div>
      <div class="chat__participants">
        <chat-user-list :socket="socket"></chat-user-list>
      </div>
    </div>
    <div class="chat__error" v-else>
      Error, reload page and provide valid username!
    </div>
      </div>
      <modal name="hello-world" :height="600">
    <div class="reg-block">
      <h2>Register</h2>
    </div>
    <div class="reg-model"><br>

      <validation-provider rules="required" v-slot="{ errors }">
          <label for="">Name</label><br>
          <input v-model="username" required type="text"><br>
          <span class="error">{{ errors[0] }}</span>
      </validation-provider><br><br>
      
        <validation-provider rules="required: true | email: true" v-slot="{ errors }">
        <label for="">Email</label><br>
        <input v-model="email" name="myinput" type="email" /><br>
        <span class="error">{{ errors[0] }}</span>
      </validation-provider><br><br>
      <label>Birthday</label>
        <validation-provider rules="required" v-slot="{ errors }">
        <div class="select">
        <select class="select-text" v-model="currentYear" required>
          <option v-for="cYear in year" v-bind:key="cYear">
            {{ cYear }}
          </option>
        </select>
        </div>
      </validation-provider>

        <validation-provider rules="required" v-slot="{ errors }">
          <div class="select">
            
          <select class="select-text" v-model="currentMonth" required>
          <option v-for="cMonth in month" v-bind:key="cMonth">
            {{ cMonth }}
          </option>
        </select>
          </div>
      </validation-provider>

        <validation-provider rules="required" v-slot="{ errors }">
          <div class="select">
          <select class="select-text" v-model="currentDay" required>
            <option v-for="cDays in daysInMonth" v-bind:key="cDays">
              {{ cDays }}
            </option>
            </select>
          </div>
      </validation-provider><br><br><br><br>

      <validation-provider rules="required" v-slot="{ errors }">
        <label for="">Password</label><br>
        <input v-model="password" name="myinput" type="password" /><br>
        <span class="error">{{ errors[0] }}</span>
      </validation-provider><br><br>

      <button v-on:click="register()" class="btn btn--stripe">Button</button>
    </div>
</modal>

<modal name="login" :height="450">
    <div class="reg-block">
      <h2>Login</h2>
    </div>
    <div class="reg-model"><br>
      
      <validation-provider rules="required: true | email: true" v-slot="{ errors }">
        <label for="">Email</label><br>
        <input v-model="email" name="myinput" type="email" /><br>
        <span class="error">{{ errors[0] }}</span>
      </validation-provider><br><br>

      <validation-provider rules="required" v-slot="{ errors }">
        <label for="">Password</label><br>
        <input v-model="password" name="myinput" type="password" /><br>
        <span class="error">{{ errors[0] }}</span>
      </validation-provider><br><br>

      <button v-on:click="login()" class="btn btn--stripe">Button</button>
    </div>
</modal>
  </div>
</template>
<script>
import io from 'socket.io-client';
import ChatConversation from './../components/ChatConversation.vue';
import ChatUserList from './../components/ChatUserList.vue';
import { Component, Vue } from 'vue-property-decorator';
import { ValidationProvider, extend } from 'vee-validate';
import { required, email } from 'vee-validate/dist/rules';
import axios from 'axios';

@Component({
  name: 'app',
  components: {
    ChatConversation,
    ChatUserList
  },
})
export default class Home extends Vue {

  time = [];
  mo = [];
  currentYear = 2019;
  currentMonth = 'January';
  currentDay = 1;
  days = [];
  re = '';
  username = '';
  email = '';
  password = '';
  text = '';
  links = [];
  token = '';
  auther = false;
  message = '';
  socket = null;
  user = {
    name: null
  };
  mes = [];

  created() {
    this.messages();
    this.auth();
    this.user.name = prompt('Please enter your username:', '');
    if (this.user.name) {
      this.socket = io('https://socket-server.jhellberg.me');
      this.socket.on('connect', () => {
        this.connect();
      });
    }
  }

  updated() {
    this.auth();
  }

  messages() {
    axios.get('https://me-api.jhellberg.me/chat/get')
    .then((response) => {
      this.mes = response.data;
    });
  }

  auth() {
    axios.get('https://me-api.jhellberg.me/reports/auth', { headers: { 'x-access-token': this.token } })
    .then((response) => {
      this.auther = response.data.data;
    });
  }

  connect() {
    this.socket.emit('connected', this.user);
    this.socket.emit('joined', {
      user: this.user,
      message: 'connected to chat!',
      time: new Date().toLocaleString()
    });
  }

  sendMessage() {
    this.socket.emit('chat message', {
      user: this.user,
      message: this.message,
      time: new Date().toLocaleString()
    });
    axios.post('https://me-api.jhellberg.me/chat/save', {
      username: this.user.name,
      date: new Date().toLocaleString(),
      text: this.message,
    });
    this.message = '';
  }

  onKeyUp(event) {
    if (event.keyCode === 13) {
      console.log("Test")
      this.sendMessage();
    }
  }

  beforeDestroy() {
    if (this.socket) {
      this.socket.emit('disconnected', {
        user: this.user
      });
    }
  }

  get getAllReports() {
    return this.links;
  }

  add() {
    axios.post('https://me-api.jhellberg.me/reports/add', {
      tx: '',
    }, { headers: { 'x-access-token': this.token } })
    .then((response) => {
      this.allReports();
    });
    this.allReports();
  }

  edit() {
    axios.post('https://me-api.jhellberg.me/reports/update', {
      id: this.$route.params.id,
      tx: this.text,
    }, { headers: { 'x-access-token': this.token } })
    .then((response) => {
      this.re = this.text;
    });
    this.hideEdit();
  }

  register() {
    axios.post('https://me-api.jhellberg.me/register', {
      username: this.username,
      email: this.email,
      birthday: this.currentYear.toString() + '-' + this.currentMonth + '-' + this.currentDay.toString(),
      password: this.password,
    });
    this.hide();
  }

  login() {
    axios.post('https://me-api.jhellberg.me/login', {
      email: this.email,
      password: this.password,
    })
    .then((response) => {
      this.token = response.data.token;
      this.auther = true;
    });
    this.hideLogin();
  }

  show() {
    this.$modal.show('hello-world');
  }

  hide() {
    this.$modal.hide('hello-world');
  }

  showLogin() {
    this.$modal.show('login');
  }

  hideLogin() {
    this.$modal.hide('login');
  }

  showEdit() {
    this.$modal.show('edit');
  }

  hideEdit() {
    this.$modal.hide('edit');
  }

  sortNumber(a, b) {
    return b - a;
  }

  getMonthFromString(mon) {

   const d = Date.parse(mon + '1, 2012');
   if (!isNaN(d)) {
      return new Date(d).getMonth() + 1;
   }
   return -1;
 }

  get year() {
    let startYear = 1900;
    const currentYear = new Date().getFullYear();

    startYear = startYear || 1980;
    while ( startYear <= currentYear ) {
      this.time.push(startYear++);
    }
    return this.time.sort(this.sortNumber);
  }

  get month() {
    this.mo[0] = 'January';
    this.mo[1] = 'February';
    this.mo[2] = 'March';
    this.mo[3] = 'April';
    this.mo[4] = 'May';
    this.mo[5] = 'June';
    this.mo[6] = 'July';
    this.mo[7] = 'August';
    this.mo[8] = 'September';
    this.mo[9] = 'October';
    this.mo[10] = 'November';
    this.mo[11] = 'December';
    return this.mo;
  }

  get daysInMonth() {
    this.days = [];
    const int = new Date(this.currentYear, this.getMonthFromString(this.currentMonth), 0).getDate();
    for (let i = 1; i < int + 1; i++) {
      this.days.push(i);
    }

    return this.days;
  }
}
</script>

<style scoped lang="scss">

#home {
  height: 100%;
  width: 100%;
}

.reg-model {
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
}

.error {
  color: #ff0a3a;
}

.reg-block {
  background-color: #191919;
  color: #fff;
  padding: 20px;
  text-align: center;
  margin-bottom: 25px;
}

.reg-block h2 {
  padding: 0;
  margin: 0;
}

.label-container{
	position:fixed;
	bottom:48px;
	right:105px;
	display:table;
	visibility: hidden;
}

.label-text{
	color:#FFF;
	background:rgba(51,51,51,0.5);
	display:table-cell;
	vertical-align:middle;
	padding:10px;
	border-radius:3px;
}

.label-arrow{
	display:table-cell;
	vertical-align:middle;
	color:#333;
	opacity:0.5;
}

.float{
	position:fixed;
	width:60px;
	height:60px;
	bottom:40px;
	right:40px;
	background-color:#F33;
	color:#FFF;
	border-radius:50px;
	text-align:center;
	box-shadow: 2px 2px 3px #999;
	z-index:1000;
	animation: bot-to-top 2s ease-out;
}

ul{
	position:fixed;
	right:40px;
	padding-bottom:20px;
	bottom:80px;
	z-index:100;
}

ul li{
	list-style:none;
	margin-bottom:10px;
}

ul li a{
	background-color:#F33;
	color:#FFF;
	border-radius:50px;
	text-align:center;
	box-shadow: 2px 2px 3px #999;
	width:60px;
	height:60px;
	display:block;
}

ul:hover{
	visibility:visible!important;
	opacity:1!important;
}


.my-float{
	font-size:24px;
	margin-top:18px;
}

a#menu-share + ul{
  visibility: hidden;
}

a#menu-share:hover + ul{
  visibility: visible;
  animation: scale-in 0.5s;
}

a#menu-share i{
	animation: rotate-in 0.5s;
}

a#menu-share:hover > i{
	animation: rotate-out 0.5s;
}

@keyframes bot-to-top {
    0%   {bottom:-40px}
    50%  {bottom:40px}
}

@keyframes scale-in {
    from {transform: scale(0);opacity: 0;}
    to {transform: scale(1);opacity: 1;}
}

@keyframes rotate-in {
    from {transform: rotate(0deg);}
    to {transform: rotate(360deg);}
}

@keyframes rotate-out {
    from {transform: rotate(360deg);}
    to {transform: rotate(0deg);}
}

.img {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: url(../assets/test.jpg) no-repeat center center fixed; 
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  z-index: 2;
}

.container-block {
  margin-top: 250px;
}

.block {
  width: 100%;
  height: 100vh;
  z-index: 1;
}

.text-block {
  width: 100%;
  height: 400px;
  background: #191919;
  color: #fff;
}

.footer-block {
  width: 100%;
  height: 300px;
  background: #191919;
  color: #fff;
}

.quote-block {
  width: 100%;
  height: 600px;
  background: #ffffff;
}

.quote-text {
  top: 100%;
  font-size: 1.9rem;
  color: #444444;
}

.quote-user {
  font-size: 1.3rem;
  float: right;
  color: #777777;
}

.vertcal-center {
  margin-top: 200px;
}

.center {
  text-align: center;
}

.text-about {
  font-size: 1em;
  letter-spacing: 1px;
  margin: 0px;
}

.list {
  display: inline;
  list-style-type: none;
  padding: 0;
}

.list li {
  display: inline;
}

.list li:last-child {
  margin-left: 20px;
}

h1 {
  font-weight: 100;
  color: #fff;
}

h3 {
  margin: 0;
  font-family: "Gravity-Regular";
  letter-spacing: 10px;
  padding-bottom: 60px;
  font-weight: 100;
  font-size: 1.75em;
  padding-top: 25px;
}

#read-more {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0);
  text-align: center;
  z-index: 5;
}

.read-more-text {
  display: block;
  color: white;
  outline: 0;
  -webkit-text-decoration: none;
  text-decoration: none;
  margin-bottom: .5rem;
  font-family: inherit;
  font-weight: 500;
  line-height: 1.1;
  font-size: 1.5em;
}

.space-text {
  letter-spacing: 0.3em;
}

.space-text:last-child {
  letter-spacing: 0em;
}

#left-nav {
  display: flex;
  margin-right: auto !important;
}

#right-nav {
  display: flex;
  flex-direction: row;
  padding-left: 0;
  margin-bottom: 0;
}

.links {
  position: absolute;
  top: 50%;
  list-style-type: none;
  z-index: 5;
}

.links li {
  margin-top: 8px;
}

#container {
  display: flex;
  flex-wrap: nowrap;
  margin-right: auto;
  margin-left: auto;
  padding-right: 15px;
  padding-left: 15px;
  width: 100%;
  max-width: 1140px;
  align-items: center;
  justify-content: space-between;
  padding: .5rem 1rem;
}

#contain {
  margin-right: auto;
  margin-left: auto;
  padding-right: 15px;
  padding-left: 15px;
  width: 100%;
  max-width: 1140px;
  padding: .5rem 1rem;
}

.global-nav {
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  height: 120px;
}

.fixed-top {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 40;
}

.navText, .navText:hover {
  font-size: 1em;
  color: black;
  font-family: 'Gravity-Regular';
  text-decoration: none;
  padding-right: 10px;
  padding-left: 10px;
}

.navbar {
  display: flex !important;
  flex-basis: 100%;
  align-items: center;
}

.btn {
  overflow: visible;
  background: transparent;
  font: inherit;
  cursor: pointer;
  display: block;
  text-decoration: none;
  text-transform: uppercase;
  padding: 10px 30px 16px;
  background-color: #fff;
  color: #666;
  border: 2px solid #666;
  border-radius: 6px;
  margin-bottom: 16px;
  margin: auto;
  transition: all .5s ease;
}
.btn:-moz-focus-inner {
  padding: 0;
  border: 0;
}
.btn--stripe {
  overflow: hidden;
  position: relative;
}
.btn--stripe:after {
  content: '';
  display: block;
  height: 7px;
  width: 100%;
  background-image: repeating-linear-gradient(45deg, #666, #666 1px, transparent 2px, transparent 5px);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  border-top: 1px solid #666;
  position: absolute;
  left: 0;
  bottom: 0;
  background-size: 7px 7px;
}
.btn--stripe:hover {
  background-color: #666;
  color: #fff;
  border-color: #000;
}
.btn--stripe:hover:after {
  background-image: repeating-linear-gradient(45deg, #fff, #fff 1px, transparent 2px, transparent 5px);
  border-top: 1px solid #000;
}

select {
  margin: 3px;
}

input {
  border: 0;
  border-bottom: solid 1px rgba(0,0,0, 0.12);
}

input:focus {
  border-bottom: 1px solid #133c94;
}

.select-text {
	position: relative;
	font-family: inherit;
	background-color: transparent;
	padding: 10px 10px 10px 0;
	font-size: 16px;
	border-radius: 0;
	border: none;
	border-bottom: 1px solid rgba(0,0,0, 0.12);
  float: left;
}

/* Remove focus */
.select-text:focus {
	outline: none;
	border-bottom: 1px solid #133c94;
}

	/* Use custom arrow */
.select .select-text {
	appearance: none;
	-webkit-appearance:none
}
html {
  box-sizing: border-box;
  font-size: 16px;
}
*, *:before, *:after {
  box-sizing: inherit;
}
html, body {
  height: 100%;
}
body, h1, h2, h3, h4, h5, h6, p, ol, ul {
  margin: 0;
  padding: 0;
  font-weight: normal;
}
.chat {
  height: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 300px;
  margin-top: 175px;
  &__wrapper {
    display: flex;
    flex-direction: row;
    flex: 1;
    border: 1px solid #ccc;
  }
  &__conversation {
    flex: 4;
    display: flex;
    flex-direction: column;
    height: 500px;
  }
  &__participants {
    flex: 1;
    height: 500px;
    border-left: 1px solid #ccc;
  }
  &__controls {
    height: 30px;
    display: flex;
    margin-top: auto;
  }
  &__input {
    height: 30px;
    padding: 0 10px;
    flex: 12;
    border: none;
    border-top: 1px solid #ccc;
    border-right: 1px solid #ccc;
    outline: none;
  }
  &__button {
    height: 30px;
    flex: 1;
    border: 0;
    background: white;
    border-top: 1px solid #ccc
  }
  &__error {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .nocenter {
    text-align: none;
    align-items: none;
  }
}
</style>