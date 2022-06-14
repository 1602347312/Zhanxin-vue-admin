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
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.fileName"
            :preview-src-list="[scope.row.fileName]"
          >
          </el-image>
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
          <el-input v-model="bank" placeholder="bank" :disabled="Boolean(scope.row.state)"></el-input>
          <el-input v-model="validCount" placeholder="amount" :disabled="Boolean(scope.row.state)" class="input-with-select">
            <el-button slot="append" type="text" :disabled="Boolean(scope.row.state)" class="audit-button" @click="open(scope.row.certicficateId, scope.row.userId)">Verify</el-button>
          </el-input>
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
      type: 'bank',
      status: ['Pending', 'Passed', 'Failed'],
      pageNum: 1,
      listSize: 0,
      pageSize: 10,
      reputationType: 'bank',
      validCount: 0,
      leftDisable: false,
      rightDisable: false,
      bank: ''
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
    open(certificate_id, user_id) {
      this.$confirm('Sure to confirm?', 'Info', {
        distinguishCancelAndClose: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      }).then(() => {
        this.$axios({
          method: 'post',
          url: 'http://101.132.121.193:8899/admin/bankcertificates',
          params: {
            certificate_id: certificate_id,
            user_id: user_id,
            state: 1,
            money: this.validCount,
            bank: this.bank
          }
        }).then(() => {
          this.$message({
            type: 'success',
            message: 'success!'
          })
          this.validCount = 0
          this.bank = ''
          this.fetchData()
        })
      }).catch((action) => {
        if (action === 'cancel') {
          this.$axios({
            method: 'post',
            url: 'http://101.132.121.193:8899/admin/bankcertificates',
            params: {
              certificate_id: certificate_id,
              user_id: user_id,
              state: 2,
              money: this.validCount,
              bank: this.bank
            }
          }).then(() => {
            this.$message({
              type: 'error',
              message: 'denied!'
            })
            this.validCount = 0
            this.bank = ''
            this.fetchData()
          })
        } else {
          this.$message({
            type: 'info',
            message: 'canceled'
          })
        }
      })
    }
  }
}
</script>
