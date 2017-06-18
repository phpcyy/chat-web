<template>
  <div id="chat">
    <div class="users">
      <div class="header">
        <img v-bind:src="domain + headimgurl" alt="">
        {{username}}
      </div>
      <ul class="contact-list">
        <li v-for="contact in contacts" v-bind:class="{ active: chatting == contact.username }"
            @click="selectTalk(contact.username, contact.headimgurl)">
          <div class="avatar">
            <img v-bind:src="domain + contact.headimgurl" alt="">
          </div>
          <div class="prev">
            <p>{{contact.username}}</p>
            <p class="message">
              {{contact.message.length > 20 ? contact.message.substr(0, 20) + "..." : contact.message}}</p>
          </div>
        </li>
      </ul>
    </div>
    <div class="message-wrapper">
      <p class="no-message" v-if="chatting == ''">您还未选中或发起聊天，快去跟好友聊一聊吧</p>
      <div class="message-list" v-if="chatting != ''">
        <div v-for="message in messages">
          <div v-if="message.username != username" class="message">
            <img class="avatar" v-bind:src="domain + message.headimgurl"
                 @click="talkTo(message.username, message.headimgurl)" alt="">
            <div class="message-content markdown-body" v-html="message.message"></div>
          </div>
          <div v-if="message.username == username" class="message-mine">
            <img class="avatar" v-bind:src="domain + message.headimgurl" alt="">
            <div class="message-content markdown-body" v-html="message.message"></div>
          </div>
        </div>
      </div>
      <textarea v-show="chatting != ''" class="message-box" @keyup="keyup" @keydown.tab.stop="tab"></textarea>
    </div>
  </div>
</template>
<script>
  import 'highlight.js/styles/solarized-dark.css' //样式文件
  import marked from "marked"
  import hljs from "highlight.js"

  export default {
    name: "chat",
    data () {
      return {
        domain: "https://git.gonever.com",
        wsURL: "wss://git.gonever.com/chat",
        username: "",
        headimgurl: "",
        contacts: [],
        chatting: "",
        messages: [],
        messageLists: {},
        socket: "",
        getSocket: function (e) {
          let socket;
          if (e.socket && e.socket.readyState === 1) {
            return e.socket
          } else {
            socket = new WebSocket(e.wsURL);
            socket.addEventListener('open', function (event) {
              socket.send(JSON.stringify({
                action: "connect",
                token: localStorage.getItem("token")
              }));
            });
            socket.addEventListener("message", function (event) {
              marked.setOptions({
                highlight: function (code) {
                  return hljs.highlightAuto(code).value;
                }
              });
              let message = JSON.parse(event.data);
              switch (message.action) {
                case "connected":
                  e.username = message.username;
                  e.headimgurl = message.headimgurl;
                  break;
                case "message":
                  message.message = marked(message.message);
                  if (message.to === e.username) {
                    e.chatting = message.username;
                  } else {
                    e.chatting = message.to;
                  }
                  let found = false;
                  e.contacts.forEach(function (value, index) {
                    if (value.username === e.chatting) {
                      e.contacts.splice(index, 1);
                      value.message = message.message.replace(/<.*?>/g, "");
                      e.contacts.unshift(value);
                      found = true;
                      return false;
                    }
                  });
                  if (!found) {
                    e.contacts.unshift({
                      headimgurl: message.headimgurl,
                      username: message.username,
                      message: message.message.replace(/<.*?>/g, "")
                    });
                  }
                  e.messageLists[e.chatting] = e.messageLists[e.chatting] || [];
                  e.messageLists[e.chatting].push(message);
                  localStorage.setItem("messageLists", JSON.stringify(e.messageLists))
                  e.messages = e.messageLists[e.chatting] || [];
                  break;
                case "close":
                  localStorage.removeItem("token");
                  location.href = "/";
                  break;
              }
            });
            socket.addEventListener("close", function () {
              socket.send(JSON.stringify({
                action: "close"
              }))
            });
            return socket
          }
        },
      }
    },
    watch: {
      messages () {
        this.$nextTick(() => {
          let list = document.querySelector(".message-list");
          list.scrollTop = list.scrollHeight
        })
      },
      contacts () {
        this.$nextTick(() => {
          localStorage.setItem("contacts", JSON.stringify(this.contacts))
        })
      },
      messageLists () {
        this.$nextTick(() => {
          localStorage.setItem("messageLists", JSON.stringify(this.messageLists))
        })
      }
    },
    mounted: function () {
      if (localStorage.getItem("token") === null) {
        location.href = '/';
      }
      if (localStorage.getItem("contacts") !== null) {
        this.contacts = JSON.parse(localStorage.getItem("contacts"));
      } else {
        this.contacts.push({
          username: "Go语言讨论组",
          headimgurl: "/uploads/all.png",
          message: "欢迎加入Go语言讨论组"
        });
      }
      if (localStorage.getItem("messageLists") !== null) {
        this.messageLists = JSON.parse(localStorage.getItem("messageLists"));
      }
    },
    methods: {
      keyup(e)
      {
        if (e.ctrlKey && e.which === 13) {
          this.send()
        } else if (e.which === 9) {
          e.preventDefault()
        }
      },
      tab(e)
      {
        let el = document.querySelector('.message-box');
        let start = el.selectionStart, end = el.selectionEnd;
        el.value = el.value.substring(0, start) + "\t" + el.value.substring(end);
        el.selectionStart = el.selectionEnd = start + 1;
        e.preventDefault()
      },
      send()
      {
        let msg = document.querySelector(".message-box").value;
        if (msg.length > 0) {
          this.getSocket(this).send(JSON.stringify({
            message: msg,
            token: localStorage.getItem("token"),
            action: "message",
            to: this.chatting
          }));
          document.querySelector(".message-box").value = ""
        }
      },
      selectTalk(username, headimgurl){
        this.chatting = username;
        this.messages = this.messageLists[username] || [];
      },
      talkTo(username, headimgurl){
        this.contacts = this.contacts.filter(function (contact) {
          return contact.username !== username
        });
        this.contacts.unshift({
          username, headimgurl, message: ""
        });
        this.chatting = username;
        this.messages = this.messageLists[username] || [];
      }
    }
  }
</script>
<style lang="less">
  .users {
    width: 350px;
    float: left;
    height: 800px;
    .header {
      background: #292B2E;
      color: #fff;
      line-height: 72px;
      img {
        display: inline-block;
        height: 50px;
        width: 50px;
        margin: 0 10px;
        border-radius: 50%;
        vertical-align: middle;
        line-height: 72px;
      }
    }
    .contact-list {
      background: #33353A;
      height: 730px;
      list-style: none;
      box-sizing: border-box;
      padding-top: 20px;
      li.active {
        background: #292B2E;
      }
      li {
        height: 80px;
        cursor: pointer;
        border-bottom: 1px #2c2e31 solid;
        border-top: 1px solid transparent;
        .avatar {
          height: 50px;
          width: 50px;
          border-radius: 50%;
          margin: 15px 10px;
          display: inline-block;
          vertical-align: top;
          img {
            border-radius: 50%;
            height: 100%;
            width: 100%;
          }
        }
        .prev {
          height: 52px;
          padding: 14px 0;
          width: 250px;
          color: #fff;
          margin-left: 5px;
          display: inline-block;
          vertical-align: top;
          .message {
            font-size: 14px;
            margin-top: 5px;
            color: gray;
          }
        }
      }
    }
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
    .no-message {
      text-align: center;
      line-height: 80px;
    }
    .message-list {
      height: 550px;
      overflow-y: scroll;
    }
    .message {
      .avatar {
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
        &::before {
          position: absolute;
          content: '';
          left: -16px;
          top: 5px;
          display: block;
          width: 0;
          height: 0;
          border-top: 8px solid #fff;
          border-right: 8px solid #fff;
          border-bottom: 8px solid transparent;
          border-left: 8px solid transparent;
        }
      }
    }
    .message-mine {
      overflow: hidden;
      .avatar {
        display: inline-block;
        vertical-align: top;
        height: 30px;
        width: 30px;
        margin-top: 12px;
        margin-left: 15px;
        float: right;
      }
      .message-content {
        background: #fff;
        max-width: 400px;
        margin-top: 12px;
        margin-right: 10px;
        padding: 3px 20px;
        border-radius: 6px;
        position: relative;
        display: inline-block;
        vertical-align: top;
        float: right;
        &::after {
          position: absolute;
          content: '';
          right: -16px;
          top: 5px;
          display: block;
          width: 0;
          height: 0;
          border-top: 8px solid #fff;
          border-right: 8px solid transparent;
          border-bottom: 8px solid transparent;
          border-left: 8px solid #fff;
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
