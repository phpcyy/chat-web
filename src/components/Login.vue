<template>
  <div id="login">
    <div class="login" v-show="status == 1">
      <h1>登录 CodeChat</h1>
      <div class="form">
        <div class="form-control">
          <input type="text" v-model="email" placeholder="邮箱">
        </div>
        <div class="form-control">
          <input type="password" v-model="password" placeholder="密码">
        </div>
        <div class="btn btn-success" @click="tryLogin">
          登录
        </div>
        <p class="form-tip" @click="switchStatus(2)">没有账号？注册一个！</p>
      </div>
    </div>
    <div class="register" v-show="status == 2">
      <h1>加入 LetChat</h1>
      <div class="form">
        <div class="form-control">
          <input type="text" v-model="email" placeholder="邮箱">
        </div>
        <div class="btn btn-success" @click="tryLogin">
          发送邮件
        </div>
        <p class="form-tip" @click="switchStatus(1)">已有账号？直接登录！</p>
      </div>
    </div>
  </div>
</template>
<script>
  import api from "../service/api"

  export default {
    name: "hello",
    data () {
      return {
        email: "",
        password: "",
        status: 1
      }
    },
    methods: {
      switchStatus (status) {
          this.status = status
      },
      tryLogin () {
        api.post("/user/login", {
          email: this.email,
          password: this.password
        }).then(function (rep) {
          if (rep.status === 200) {
            console.log(rep.data.data.token)
          } else {
            alert(rep.statusText)
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  h1 {
    text-align: center;
    margin: 40px 0;
  }

  .form {
    margin: 20px auto;
    width: 400px;
    overflow: hidden;
    .form-tip{
      font-size: 14px;
      text-align: right;
      text-indent: 20px;
      color: #3684FD;
      cursor: pointer;
      margin-top: 20px;
    }
    .form-control {
      &:not(:last-of-type) {
        margin-top: 40px;
      }
      input {
        height: 50px;
        line-height: 50px;
        text-indent: 8px;
        width: 100%;
        border: 1px solid #ddd;
        outline: none;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        font-size: 18px;
        border-radius: 2px;
        &:focus {
          border: 1px solid #bbb;
        }
      }
    }
    .btn {
      display: block;
      text-align: center;
      height: 50px;
      line-height: 50px;
      margin-top: 40px;
    }
    .btn.btn-success {
      background: #2ab27b;
      color: #fff;
    }
  }
</style>
