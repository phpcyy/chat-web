<template>
  <div id="chat">
    <div class="users">

    </div>
    <div class="message-wrapper">
      <div class="message-list">
        <div v-for="message in messages" v-html="message">

        </div>
      </div>
      <div class="message-box" contenteditable>
      </div>
      <div class="send" @click="send">
        发送
      </div>
    </div>
  </div>
</template>
<script>
  import hljs from 'highlight.js'
  import 'highlight.js/styles/googlecode.css' //样式文件
  import marked from "marked"
  export default {
    name: "chat",
    data () {
      return {
        username: "phpcyy",
        socket: (function (e) {
          let socket;
          if (e.socket) {
            return e.socket
          } else {
            socket = new WebSocket("ws://127.0.0.1:8888");
            socket.addEventListener("message", function (event) {
              marked.setOptions({
                highlight: function (code) {
                  return require('highlight.js').highlightAuto(code).value;
                }
              });
              e.messages.push(marked(event.data))
            });
            return socket
          }
        })(this),
        messages: []
      }
    },
    methods: {
      send () {
        this.socket.send(document.querySelector(".message-box").innerHTML)
        document.querySelector(".message-box").innerText = ""
      }
    }
  }
</script>
<style lang="less">
  .message-wrapper {
    width: 300px;
    border: 1px solid #d1d1d1;
    margin: 0 auto;
    .message-box {
      width: 100%;
      box-sizing: border-box;
      border: 1px solid #c0c0c0;
      height: 300px;
      outline: none;
    }
    .send {
      background: forestgreen;
      color: #fff;
      padding: 10px 0;
      text-align: center;
    }
  }
</style>
