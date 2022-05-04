<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.userID }}
        </template>
      </el-table-column>
      <el-table-column label="userEmail">
        <template slot-scope="scope">
          {{ scope.row.userEmail }}
        </template>
      </el-table-column>
      <el-table-column label="UserName" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Type" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.userType | statusFilter">{{ status[scope.row.userType] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="registerTime" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.userRegisterTime }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-button-group>
      <el-button type="primary" icon="el-icon-arrow-left" @click="leftClick">上一页</el-button>
      <el-button type="primary" @click="rightClick" >下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button>
    </el-button-group>
  </div>
</template>

<script>

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'gray',
        1: 'success',
        2: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      type: '0',
      status: ['普通用户', '管理员'],
      pageNum: 1,
      listSize: 0,
      pageSize: 10
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      this.$axios({
        method: 'get',
        url: 'http://101.132.121.193:8899/admin/accounts',
        params: {
          type: this.type,
          pageNum: this.pageNum
        }
        // headers: { token: window.sessionStorage.getItem('token') }
      }).then(response => {
        this.list = response.data.data.data
        this.listSize = response.data.data.listSize
        this.listLoading = false
        console.log(this.list)
      })
    },
    leftClick() {
      if (this.pageNum - 1 <= 0) { return } else this.pageNum -= 1
      this.listLoading = true
      this.$axios({
        method: 'get',
        url: 'http://101.132.121.193:8899/admin/accounts',
        params: {
          type: this.type,
          pageNum: this.pageNum
        }
        // headers: { token: window.sessionStorage.getItem('token') }
      }).then(response => {
        this.list = response.data.data.data
        this.listLoading = false
        console.log(this.list)
      })
    },
    rightClick() {
      if (this.pageNum + 1 > (this.listSize / this.pageSize + 1)) { return } else this.pageNum += 1
      this.listLoading = true
      this.$axios({
        method: 'get',
        url: 'http://101.132.121.193:8899/admin/accounts',
        params: {
          type: this.type,
          pageNum: this.pageNum
        }
        // headers: { token: window.sessionStorage.getItem('token') }
      }).then(response => {
        this.list = response.data.data.data
        this.listLoading = false
        console.log(this.list)
      })
    }
  }
}
</script>
