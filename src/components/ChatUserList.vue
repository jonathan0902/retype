<template>
  <div class="chat-user-list">
    <div class="chat-user-list__user" v-for="user in users" v-bind:key="user.name">
      {{ user.name }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'chat-user-list',
  props: {
    socket: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      users: {}
    };
  },
  mounted() {
    this.socket.on('users', (users) => {
      this.users = users;
    });
    this.socket.on('disconnect', () => {
      this.users = {};
    });
  }
}
</script>

<style lang="scss">
.chat-user-list {
  padding: 10px 0;
  &__user {
    padding: 0 10px;
    text-align: left;
  }
}
</style>