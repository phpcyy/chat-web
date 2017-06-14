<template>
  <div class="hello">
    <h1>Go 语言聊天室</h1>
    <div class="form">
      <div class="form-control">
        <input type="text" v-model.trim="nickname" placeholder="输入您的昵称">
      </div>
      <div class="form-control">
        <input type="file" accept="image/*" class="file" v-on:change="previewImg" style="display: none">
        <div class="mask">
          <img src="/static/images/add.png" @click="selectImg" v-bind:src="avator" alt="">
        </div>
      </div>
      <div class="btn btn-success" @click="getToken">
        开始聊天吧！
      </div>
    </div>
  </div>
</template>

<script>
  import api from "../service/api.js"
  export default {
    name: 'hello',
    data () {
      return {
        nickname: "",
        avator: "/static/images/add.png",
        msg: 'Welcome to Your Vue.js App'
      }
    },
    methods: {
      selectImg () {
        document.querySelector(".file").click();
      },
      previewImg (e) {
        let files = e.target.files;
        if (files.length > 0) {
          let file = files[0];
          if (file && !/image\/\w+/.test(file.type)) {
            alert("请选择图片！")
          }
          let reader = new FileReader();
          let scope = this;
          reader.onload = function (e) {
            scope.avator = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      },
      getToken (){
        if (this.nickname.length === 0) {
          return alert("请填写昵称")
        }
        if (document.querySelector(".file").files.length === 0) {
          return alert("请选择头像")
        }
        let scope = this
        api.file("/getToken", {
          username: this.nickname,
          headimg: document.querySelector(".file").files[0]
        }).then(function (res) {
            console.log(res)
          localStorage.setItem("token", res.data.token);
          scope.$router.push({name: 'chat'});
        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  h1 {
    text-align: center;
    margin: 40px 0;
    border: none;
  }

  .form {
    overflow: hidden;
    margin: 20px auto;
    width: 400px;
    .form-tip {
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
      cursor: pointer;
    }
    .btn.btn-success {
      background: #2ab27b;
      color: #fff;
    }
    .mask {
      height: 120px;
      width: 120px;
      line-height: 120px;
      text-align: center;
      margin: 0 auto;
      border: 1px solid #ddd;
      position: relative;
      img {
        position: absolute;
        left: 25%;
        top: 25%;
        width: 50%;
        height: 50%;
        cursor: pointer;
      }
    }
  }
</style>
