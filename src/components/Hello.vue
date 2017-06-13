<template>
  <div class="hello">
    <h1>Go 语言聊天室</h1>
    <div class="form">
      <div class="form-control">
        <input type="text" placeholder="输入您的昵称">
      </div>
      <div class="form-control">
        <input type="file" placeholder="选择头像">
      </div>
      <div class="btn btn-success">
        开始聊天吧！
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'hello',
    data () {
      return {
        msg: 'Welcome to Your Vue.js App'
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
    overflow: hidden;
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
    }
    .btn.btn-success {
      background: #2ab27b;
      color: #fff;
    }
  }
</style>
