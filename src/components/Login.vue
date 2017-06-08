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
    import api from "../service/api"

    export default {
        name: "hello",
        data () {
            return {
                email: "",
                password: ""
            }
        },
        methods: {
            tryLogin () {
                api.get("/user/login").then(function (rep) {
                    if (rep.status === 200){
                        console.log(rep.data.data.token)
                    }else{
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
                :focus {
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