<template>
  <div id="chat">
    <div class="users">

    </div>
    <div class="message-wrapper">
      <div class="message-list">
        <div v-for="message in messages">
          <div class="message">
            <img class="avatar" v-bind:src="'http://localhost:10080/' + message.headimgurl" alt="">
            <div class="message-content" v-html="message.message">

            </div>
          </div>
        </div>
      </div>
      <textarea class="message-box" @keyup="keyup" @keydown.tab.stop="tab"></textarea>
    </div>
  </div>
</template>
<script>
  import 'highlight.js/styles/googlecode.css' //样式文件
  import marked from "marked"
  import hljs from "highlight.js"

  export default {
    name: "chat",
    data () {
      return {
        username: "phpcyy",
        toUsername: '',
        socket: (function (e) {
          let socket;
          if (e.socket) {
            return e.socket
          } else {
            socket = new WebSocket("ws://127.0.0.1:10080/chat");
            socket.addEventListener('open', function (event) {
              socket.send(JSON.stringify({
                action: "connect",
                user: e.username
              }));
            });
            socket.addEventListener("message", function (event) {
              marked.setOptions({
                highlight: function (code) {
                  return hljs.highlightAuto(code).value;
                }
              });
              let message = JSON.parse(event.data);
              message.message = marked(message.message);
              e.messages.push(message);
            });
            socket.addEventListener("close", function () {
              socket.send(JSON.stringify({
                action: "close"
              }))
            });
            return socket
          }
        })(this),
        messages: []
      }
    },
    methods: {
      keyup (e){
        if (e.ctrlKey && e.which === 13) {
          this.send()
        } else if (e.which === 9) {
          e.preventDefault()
        }
      },
      tab(e){
        let el = document.querySelector('.message-box');
        let start = el.selectionStart, end = el.selectionEnd;

        el.value = el.value.substring(0, start) + "\t" + el.value.substring(end);

        el.selectionStart = el.selectionEnd = start + 1;
        e.preventDefault()
      },
      send () {
        let msg = document.querySelector(".message-box").value;
        if (msg.length > 0) {
          this.socket.send(JSON.stringify({
            message: msg,
            token: localStorage.getItem("token"),
            action: "message",
            to: this.toUsername
          }));
          document.querySelector(".message-box").value = ""
        }
      }
    }
  }
</script>
<style lang="less">
  .users {
    width: 350px;
    float: left;
    height: 800px;
  }

  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-thumb {
    background: #A7ADB9;
    width: 6px;
    border-radius: 3px;
  }

  .message-wrapper {
    box-sizing: border-box;
    width: 650px;
    height: 800px;
    border-left: 1px solid #ddd;
    float: left;
    background: #eee;
    overflow: hidden;
    .message-list {
      height: 550px;
      overflow-y: scroll;
    }
    .message{
      .avatar{
        display: inline-block;
        vertical-align: top;
        height: 30px;
        width: 30px;
        margin-top: 12px;
        margin-left: 15px;
      }
      .message-content {
        background: #fff;
        max-width: 400px;
        margin-top: 12px;
        margin-left: 20px;
        padding: 3px 20px;
        border-radius: 6px;
        position: relative;
        display: inline-block;
        vertical-align: top;
        &::before{
          position: absolute;
          content: '';
          left: -16px;
          top: 5px;
          display: block;
          width:0;
          height:0;
          border-top: 8px solid #fff;
          border-right: 8px solid #fff;
          border-bottom: 8px solid transparent;
          border-left: 8px solid transparent;
        }
      }
    }

    .message-box {
      width: 100%;
      box-sizing: border-box;
      border: none;
      border-top: 1px solid #ddd;
      height: 250px;
      outline: none;
      padding: 5px 10px;
      line-height: 1.6;
      font-size: inherit;
      resize: none;
    }
  }
</style>
