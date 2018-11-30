<template>
  <div class="page-register">
    <article class="header">
      <header>
        <a
          href="/"
          class="site-logo"/>
        <span class="login">
          <em class="bold">已有美团账号？</em>
          <a href="/login">
            <el-button
              type="primary"
              size="small">登录</el-button>
          </a>
        </span>
      </header>
    </article>
    <section>
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px">
        <el-form-item
          label="昵称"
          prop="name">
          <el-input v-model.trim="ruleForm.name"/>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email">
          <el-input v-model.trim="ruleForm.email"/>
          <el-button
            size="mini"
            round
            @click="sendMessage">发送验证码
          </el-button>
          <span class="status">{{ statusMsg }}</span>
        </el-form-item>
        <el-form-item
          label="验证码"
          prop="code">
          <el-input
            v-model.trim="ruleForm.code"
            maxlength="4"/>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="pwd">
          <el-input
            v-model.trim="ruleForm.pwd"
            type="password"/>
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="cpwd">
          <el-input
            v-model.trim="ruleForm.cpwd"
            type="password"/>
        </el-form-item>
        <el-form-item>
          <el-button @click="agreeRegister">同意以下协议并注册</el-button>
          <div class="error">{{ error }}</div>
        </el-form-item>
        <el-form-item>
          <a
            class="f1"
            href="http://www.meituan.com/about/terms"
            target="_blank">《美团网用户协议》</a>
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<script>
  import axios from 'axios';
  import CryptoJS from 'crypto-js';

  export default {
    layout: 'blank',
    data() {
      return {
        rules: {
          name: [{ required: true, type: 'string', message: '请输入昵称', trigger: 'blur' }],
          email: [{ required: true, type: 'email', message: '请输入邮箱', trigger: 'blur' }],
          pwd: [{ required: true, type: 'string', message: '请输入密码', trigger: 'blur' }],
          cpwd: [
            { required: true, type: 'string', message: '确认密码', trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                if (!value) {
                  callback('请再次输入密码');
                } else if (value !== this.ruleForm.pwd) {
                  callback('两次输入的密码不一致');
                } else {
                  callback();
                }
              },
              trigger: 'blur'
            }
          ]
        },
        ruleForm: {
          name: '',
          email: '',
          code: '',
          pwd: '',
          cpwd: ''
        },
        statusMsg: '',
        error: ''
      };
    },
    methods: {
      sendMessage() {
        let that = this;
        let namePass;
        let emailPass;
        if (this.timerid) {
          return false;
        }
        this.$refs['ruleForm'].validateField('name', valid => {
          namePass = valid;
        });
        this.statusMsg = '';
        // 有值则错误
        if (namePass) {
          return false;
        }
        this.$refs['ruleForm'].validateField('email', valid => {
          emailPass = valid;
        });
        let param = {};
        // 处理中文
        param.username = encodeURIComponent(this.ruleForm.name);
        param.email = this.ruleForm.email;
        if (!namePass && !emailPass) {
          axios.post('/users/verity', param).then(({ status, data }) => {
            if (status === 200 && data && data.code === 0) {
              // 发送成功
              let count = 60;
              that.statusMsg = `验证码已发送，剩余${count--}秒`;
              that.timerid = setInterval(() => {
                that.statusMsg = `验证码已发送，剩余${count--}秒`;
                if (count === 0) {
                  clearInterval(that.timerid);
                }
              }, 1000);
            } else {
              //发送错误
              that.statusMsg = data.msg;
            }
          });
        }
      },
      agreeRegister() {
        let that = this;
        this.$refs['ruleForm'].validate(valid => {
          if (valid) {
            let username = encodeURIComponent(that.ruleForm.name);
            let password = CryptoJS.MD5(that.ruleForm.pwd).toString();
            let param = {};
            param.username = username;
            param.password = password;
            param.email = that.ruleForm.email;
            param.code = that.ruleForm.code;
            axios.post('/users/signup', param).then(({ status, data }) => {
              if (status === 200) {
                if (data && data.code === 0) {
                  location.href = '/login';
                } else {
                  that.error = data.msg;
                }
              } else {
                that.error = `服务器出错，错误码: ${status}`;
              }
              setTimeout(() => {
                that.error = '';
              }, 1500);
            });
          }
        });
      }
    }
  };
</script>

<style lang="scss">
  @import '@/assets/css/register/index.scss';
</style>
