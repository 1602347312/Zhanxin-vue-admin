<template>
  <div class="app-container">
    <el-form ref="form1" :model="form" label-width="120px">
      <el-form-item label="Video name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="Video cover">
        <el-upload
          ref="upload1"
          class="upload-pic"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="form.coverList"
          :auto-upload="false"
          list-type="picture"
          :limit="1"
          :on-change="addCover"
          :on-exceed="handleExceed"
          accept=".jpg,.png,.bmp"
        >
          <el-button slot="trigger" size="small" type="primary" class="upload-button2">选取文件</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png/bmp文件</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="Video">
        <el-upload
          ref="upload2"
          class="upload-video"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="form.videoList"
          :auto-upload="false"
          list-type="text"
          :limit="1"
          :on-change="addVideo"
          :on-exceed="handleExceed"
          accept=".mp4"
        >
          <el-button slot="trigger" size="small" type="primary" class="upload-button1">选取文件</el-button>
          
          <div slot="tip" class="el-upload__tip">大小限制为50mb</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="Video type">
        <el-radio-group v-model="form.type">
          <el-radio label="fundamental" />
          <el-radio label="financial" />
          <el-radio label="honesty" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Video intro">
        <el-input v-model="form.intro" type="textarea" />
      </el-form-item>
      <el-button size="small" type="success" class="submit-button" :disabled="uploading" @click="submitUpload">上传到服务器</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        type: [],
        intro: '',
        coverList: [],
        videoList: [],
        fd: new FormData()
      },
      uploading: false
    }
  },
  methods: {
    addCover(file, fileList) {
      const fileObj = file.raw // 相当于input里取得的files
      this.form.fd.append('cover', fileObj)// 文件对象
    },
    addVideo(file, fileList) {
      const fileObj = file.raw // 相当于input里取得的files
      this.form.fd.append('video', fileObj)// 文件对象
    },
    submitUpload() {
      this.uploading = true
      this.$refs.upload2.submit()
      this.form.fd.append('title', this.form.name)
      this.form.fd.append('intro', this.form.intro)
      this.form.fd.append('type', this.form.type)
      this.$axios({
        method: 'post',
        url: 'http://101.132.121.193:8899/admin/videos',
        data: this.form.fd
      }).then(response => {
        this.$message({ type: 'success', message: '上传成功' })
        this.$refs.upload1.clearFiles()
        this.$refs.upload2.clearFiles()
        this.$refs.form1.resetFields()
        this.form.fd = new FormData()
        this.form.type = ''
        this.form.intro = ''
        this.form.name = ''
        this.uploading = false
        console.log(response)
      }).catch((reason) => {
        this.$message({ type: 'error', message: '上传失败' })
        this.form.fd = new FormData()
        this.uploading = false
        console.log(reason)
      })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed() {
      this.$message({ type: 'error', message: '最多支持1个附件上传' })
    }
  }
}
</script>

<style scoped>
.upload-button2 {
    /* position: fixed; */
    left: 190px;
    top: 142px;
}
.line{
  text-align: center;
}
/* .upload-button2{
  position: fixed;
  right: 1645px;
  bottom: 800px;
} */
.submit-button{
  /* position: fixed; */
  margin-left: 1050px;
  margin-top: 30px;
}
</style>

