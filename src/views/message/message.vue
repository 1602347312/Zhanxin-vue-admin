<template>
  <div class="message-container">
    <div id="box" class="block">&ensp;</div><div class="block" style="margin: 5px 0px 0px 20px;">Publish Message</div>
    <div class="messageBody">
      <el-row id="inputtitle">
        <el-input placeholder="title" v-model="textarea1">please enter title</el-input>
      </el-row>
      <el-row id="inputtext">
        <el-input type="textarea" :autosize="{ minRows: 10, maxRows: 15}" placeholder="content" v-model="textarea2"></el-input>
      </el-row>
      <el-row id="el-button">
        <el-button @click="clear">clear</el-button>
        <el-button @click="release">publish</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      textarea1: '',
      textarea2: ''
    }
  },
  methods: {
    open1() {
      this.$notify({
        title: 'success',
        message: 'Success！',
        type: 'success'
      })
    },
    clear() {
      this.textarea1 = ''
      this.textarea2 = ''
    },
    release() {
      this.$axios({
        method: 'post',
        url: 'http://localhost:8899/systemMessage/releaseMessage',
        params: {
          messageTitle: this.textarea1,
          messageContent: this.textarea2
        }
      }).then(res => {
        console.log(res)
        if (res.data.data.computeResult === 1) {
          this.textarea1 = ''
          this.textarea2 = ''
          this.open1()
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
#inputtitle {
    width: 80%;
    margin: 50px 20px 30px 50px;
}
#inputtext {
    width: 80%;
    margin: 20px 20px 30px 50px;
}
#el-button {
    text-align: right;
    margin-right: 270px;
}
.block {
    vertical-align: top;
    display: inline-block;
}
#box {
    width:5px;
    height: 30px;
    background-color: #313451;
}
.message {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
