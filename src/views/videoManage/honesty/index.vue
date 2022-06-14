<template>
  <div class="app-container">
    <el-backtop >
      <i class="el-icon-caret-top"/>
    </el-backtop>
    <el-row v-loading="listLoading">
      <el-col v-for="(video, index) in videoList" :key="index" :span="5" :offset="2">
        <el-card :body-style="{ padding: '0px' }">
          <img :src="video.videoCover" class="image">
          <div style="padding: 14px;">
            <span>{{ video.videoName }}</span>
            <div class="bottom clearfix">
              <time class="time">{{ video.videoTime }}</time>
              <el-popconfirm
                title="Sure to delete？"
                @onConfirm="deleteVideo(video.videoId)"
              >
                <el-button slot="reference" type="text" class="button">delete</el-button>
              </el-popconfirm>
<!--              <el-button type="text" class="button" @click="deleteVideo(video.videoId)">删除视频</el-button>-->
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-button type="primary" class="jump-to-upload" @click="jump">upload<i class="el-icon-upload el-icon--right"></i></el-button>
  </div>
</template>

<script>
export default {

  data() {
    return {
      type: 'honesty',
      title: '',
      uploadTime: '',
      coverUrl: '',
      videoList: [],
      listLoading: true
    }
  },
  created() {
    this.getVideoList()
  },
  methods: {
    getVideoList() {
      this.listLoading = true
      this.$axios({
        method: 'get',
        url: 'http://101.132.121.193:8899/common/videos' + '/' + this.type
        // headers: { token: window.sessionStorage.getItem('token') }
      }).then(response => {
        this.videoList = response.data.data
        // this.listSize = response.data.data.listSize
        this.listLoading = false
        console.log(this.videoList)
      })
    },
    deleteVideo(id) {
      this.$axios({
        method: 'delete',
        url: 'http://101.132.121.193:8899/admin/videos' + '/' + id
        // headers: { token: window.sessionStorage.getItem('token') }
      }).then(response => {
        alert('success')
        this.getVideoList()
      })
    },
    jump() {
      this.$router.push('/videos/upload')
    }
  }
}
</script>

<style>
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
  color: red;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.jump-to-upload{
  position: fixed;
  right: 20px;
  bottom: 100px;
}
</style>
