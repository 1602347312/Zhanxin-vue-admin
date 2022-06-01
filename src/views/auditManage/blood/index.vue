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
          {{ scope.row.certicficateId }}
        </template>
      </el-table-column>
      <el-table-column label="Certificate">
        <template slot-scope="scope">
          {{ scope.row.fileName }}
        </template>
      </el-table-column>
      <el-table-column label="UserID" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Type" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.certificate }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state | statusFilter">{{ status[scope.row.state] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="Action" width="200">
        <template slot-scope="scope">
          <el-input v-model="validCount" placeholder="请输入内容" :disabled="Boolean(scope.row.state)" class="input-with-select">
            <el-button slot="append" type="text" :disabled="Boolean(scope.row.state)" class="audit-button" @click="open(scope.row.certicficateId)">审核</el-button>
          </el-input>
        </template>
      </el-table-column>
    </el-table>
    <el-button-group>
      <el-button type="primary" icon="el-icon-arrow-left" :disabled="leftDisable" @click="leftClick">上一页</el-button>
      <el-button type="primary" :disabled="rightDisable" @click="rightClick">下一页<i class="el-icon-arrow-right el-icon--right" /></el-button>
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
      type: 'blood',
      status: ['待审核', '已通过', '未通过'],
      pageNum: 1,
      listSize: 0,
      pageSize: 10,
      reputationType: 'blood_donation',
      validCount: 0,
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
        url: 'http://101.132.121.193:8899/admin/certificates',
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
        url: 'http://101.132.121.193:8899/admin/certificates',
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
        url: 'http://101.132.121.193:8899/admin/certificates',
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
    open(id) {
      this.$confirm('是否通过该证件的审核', '提示', {
        distinguishCancelAndClose: true,
        confirmButtonText: '通过',
        cancelButtonText: '不通过',
        type: 'warning'
      }).then(() => {
        this.$axios({
          method: 'put',
          url: 'http://101.132.121.193:8899/admin/certificates',
          params: {
            id: id,
            state: 1,
            num: this.validCount,
            type: this.reputationType
          }
        }).then(() => {
          this.$message({
            type: 'success',
            message: '审核通过!'
          })
          this.validCount = 0
          this.fetchData()
        })
      }).catch((action) => {
        if (action === 'cancel') {
          this.$axios({
            method: 'put',
            url: 'http://101.132.121.193:8899/admin/certificates',
            params: {
              id: id,
              state: 2,
              num: 0,
              type: this.reputationType
            }
          }).then(() => {
            this.$message({
              type: 'error',
              message: '审核不通过!'
            })
            this.validCount = 0
            this.fetchData()
          })
        } else {
          this.$message({
            type: 'info',
            message: '操作取消'
          })
        }
      })
    }
  }
}
</script>
