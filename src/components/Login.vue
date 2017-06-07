<template>
    <div class="login">
        <h1>登录 LetChat</h1>
        <div class="form">
            <div class="form-control">
                <input type="text" v-model="email" placeholder="用户名">
            </div>
            <div class="form-control">
                <input type="password" v-model="password" placeholder="密码">
            </div>
            <div class="btn btn-success" v-on:click="tryLogin">
                登录
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: "hello",
        methods: {
            tryLogin: (e) => {

            }
        },
        data () {
            return {
                email: "",
                password: ""
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
    }

    .form .form-control {
        input{
            font-style: italic;
        }
    }

    .form .form-control:not(:last-of-type) {
        margin-top: 40px;
    }

    .form .form-control input {
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
    }

    .form .form-control input:focus {
        border: 1px solid #bbb;
    }

    .form .btn {
        display: block;
        text-align: center;
        height: 50px;
        line-height: 50px;
        margin-top: 40px;
    }

    .form .btn.btn-success {
        background: #2ab27b;
        color: #fff;
    }
</style>