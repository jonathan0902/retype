<template>
  <div class="chat">
    <div class="chat__wrapper" v-if="user.name">
      <div class="chat__conversation">
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
</template>

<script>
import io from 'socket.io-client';
import ChatConversation from '../components/ChatCoversation.vue';
import ChatUserList from '../components/ChatUserList.vue';

export default {
  name: 'app',
  components: {
    ChatConversation,
    ChatUserList
  },
  data() {
    return {
      message: '',
      socket: null,
      user: {
        name: null
      }
    };
  },
  created() {
    this.user.name = prompt('Please enter your username:', '');
    if (this.user.name) {
      this.socket = io('https://socket-server.jhellberg.me');
      this.socket.on('connect', () => {
        this.connect();
      });
    }
  },
  methods: {
    connect() {
      this.socket.emit('connected', this.user);
    },
    sendMessage() {
      this.socket.emit('message', {
        user: this.user,
        message: this.message
      });
      this.message = '';
    },
    onKeyUp(event) {
      if (event.keyCode === 13) {
        this.sendMessage();
      }
    }
  },
  beforeDestroy() {
    if (this.socket) {
      this.socket.emit('disconnected', {
        user: this.user
      });
    }
  },
}
</script>