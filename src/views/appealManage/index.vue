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
      <el-table-column label="UserID" width="80" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.user_id }}</span>
      </template>
    </el-table-column>
      <el-table-column align="center" label="Reason" width="180">
        <template slot-scope="scope">
          {{ scope.row.reason }}
        </template>
      </el-table-column>
      <el-table-column label="Detail" align="center">
        <template slot-scope="scope">
          {{ scope.row.question }}
        </template>
      </el-table-column>

      <el-table-column label="Target" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.require }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="AppealTime" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.appeal_time }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.appeal_state | statusFilter">{{ status[scope.row.appeal_state] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="Action" width="200">
        <template slot-scope="scope">
          <el-button type="text" :disabled="scope.row.appeal_state" @click="open(scope.row.user_id,scope.row.reason,scope.row.question,scope.row.require,scope.row.appeal_time)">Verify</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button-group>
      <el-button type="primary" icon="el-icon-arrow-left" :disabled="leftDisable" @click="leftClick">Prev</el-button>
      <el-button type="primary" :disabled="rightDisable" @click="rightClick">Next<i class="el-icon-arrow-right el-icon--right" /></el-button>
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
      type: 'all',
      status: ['Pending', 'Passed', 'Failed'],
      pageNum: 1,
      listSize: 0,
      pageSize: 10,
      leftDisable: false,
      rightDisable: false
    }
  },
  watch: {
    pageNum: {
      handler() {
        this.leftDisable = (this.pageNum - 1 <= 0)
        this.rightDisable = (this.pageNum + 1 > Math.ceil(this.listSize / this.pageSize))
      }
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
        url: 'http://101.132.121.193:8899/appeal/appeals',
        params: {
          type: this.type,
          pageNum: this.pageNum
        }
        // headers: { token: window.sessionStorage.getItem('token') }
      }).then(response => {
        this.list = response.data.data.data
        this.listSize = response.data.data.listSize
        this.leftDisable = (this.pageNum - 1 <= 0)
        this.rightDisable = (this.pageNum + 1 > Math.ceil(this.listSize / this.pageSize))
        this.listLoading = false
        console.log(this.list)
      }).catch(() => {
        this.listLoading = false
      })
    },
    leftClick() {
      if (this.pageNum - 1 <= 0) { return } else this.pageNum -= 1
      this.listLoading = true
      this.$axios({
        method: 'get',
        url: 'http://101.132.121.193:8899/appeal/appeals',
        params: {
          type: this.type,
          pageNum: this.pageNum
        }
        // headers: { token: window.sessionStorage.getItem('token') }
      }).then(response => {
        this.list = response.data.data.data
        this.listLoading = false
        console.log(this.list)
      }).catch(() => {
        this.listLoading = false
      })
    },
    rightClick() {
      if (this.pageNum + 1 > (this.listSize / this.pageSize + 1)) { return } else this.pageNum += 1
      this.listLoading = true
      this.$axios({
        method: 'get',
        url: 'http://101.132.121.193:8899/appeal/appeals',
        params: {
          type: this.type,
          pageNum: this.pageNum
        }
        // headers: { token: window.sessionStorage.getItem('token') }
      }).then(response => {
        this.list = response.data.data.data
        this.listLoading = false
        console.log(this.list)
      }).catch(() => {
        this.listLoading = false
      })
    },
    open(user_id, reason, question, require, appeal_time) {
      this.$confirm('Sure to confirm?', 'Waring', {
        distinguishCancelAndClose: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      }).then(() => {
        this.$axios({
          method: 'put',
          url: 'http://101.132.121.193:8899/appeal/appeals',
          params: {
            user_id: user_id,
            type: reason,
            detail: question,
            value: require,
            appeal_time: appeal_time,
            state: 1
          }
        }).then(() => {
          this.$message({
            type: 'success',
            message: 'Success!'
          })
          this.fetchData()
        })
      }).catch((action) => {
        if (action === 'cancel') {
          this.$axios({
            method: 'put',
            url: 'http://101.132.121.193:8899/appeal/appeals',
            params: {
              user_id: user_id,
              type: reason,
              detail: question,
              value: require,
              appeal_time: appeal_time,
              state: 2
            }
          }).then(() => {
            this.$message({
              type: 'error',
              message: 'Denied!'
            })
            this.fetchData()
          })
        } else {
          this.$message({
            type: 'info',
            message: 'Canceled'
          })
        }
      })
    }
  }
}
</script>
