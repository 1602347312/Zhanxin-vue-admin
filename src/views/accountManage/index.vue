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
      <el-table-column align="center" prop="created_at" label="Action" width="200">
        <template slot-scope="scope">
          <el-button type="text" :disabled="scope.row.state" class="modify-authority-button" @click="modifyAuthority(scope.row.userID, 1)">modify</el-button>
          <el-button type="text" :disabled="scope.row.state" class="cancel-account-button" @click="cancelAccount">delete</el-button>
          <el-dialog title="Two-factor authentication" :visible.sync="dialogVisible" center width="20%">
            <div style="display: flex;flex-direction: column;align-items: center;justify-content: center;">
              <el-form :inline="true">
                <el-form-item>
                  <el-input v-model="managerEmail" placeholder="admin account" clearable></el-input>
                  <el-input v-model="managerPassword" placeholder="password" clearable></el-input>
                </el-form-item>
              </el-form>
              <p style="color: #f00;">Waring: Need to verify identity!</p>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">cancel</el-button>
              <el-button type="primary" @click="verifyIdentity(scope.row.userID)">verify</el-button>
            </span>
          </el-dialog>
        </template>
      </el-table-column>
    </el-table>
    <el-button-group>
      <el-button type="primary" icon="el-icon-arrow-left" :disabled="leftDisable" @click="leftClick">Prev</el-button>
      <el-button type="primary" :disabled="rightDisable" @click="rightClick" >Next<i class="el-icon-arrow-right el-icon--right"></i></el-button>
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
      status: ['Normal', 'Admin'],
      pageNum: 1,
      listSize: 0,
      pageSize: 10,
      dialogVisible: false,
      managerEmail: '',
      managerPassword: '',
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
        url: 'http://101.132.121.193:8899/admin/accounts',
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
        console.log(this.listSize)
        this.listLoading = false
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
    },
    modifyAuthority(id, authority) {
      this.$confirm('Sure to upgrade to admin?', 'Waring', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      }).then(() => {
        this.$axios({
          method: 'put',
          url: 'http://101.132.121.193:8899/admin/accounts',
          params: {
            id: id,
            authority: authority
          }
        }).then(response => {
          this.$message({
            type: 'success',
            message: 'Success!'
          })
          if (this.pageNum > Math.ceil((this.listSize - 1) / this.pageSize)) { this.pageNum -= 1 }
          this.fetchData()
        }).catch(reason => {
          this.$message({
            type: 'error',
            message: 'Failed!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Canceled!'
        })
      })
    },
    cancelAccount() {
      this.$confirm('Sure to delete the account?', 'Waring', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      }).then(() => {
        this.dialogVisible = true
        // this.$axios({
        //   method: 'delete',
        //   url: 'http://101.132.121.193:8899/admin/accounts',
        //   params: {
        //     id: id
        //   }
        // }).then(response => {
        //   this.$message({
        //     type: 'success',
        //     message: '账号已注销!'
        //   })
        //   this.fetchData()
        // }).catch(reason => {
        //   this.$message({
        //     type: 'error',
        //     message: '注销失败!'
        //   })
        // })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Canceled!'
        })
      })
    },
    verifyIdentity(id) {
      this.$axios({
        method: 'get',
        url: 'http://101.132.121.193:8899/user/verify',
        params: {
          userEmail: this.managerEmail,
          userPassword: this.managerPassword
        }
      }).then(response => {
        if (response.data.code === '200') {
          this.$axios({
            method: 'delete',
            url: 'http://101.132.121.193:8899/admin/accounts',
            params: {
              id: id
            }
          }).then(response => {
            this.$message({
              type: 'success',
              message: 'Success!'
            })
            this.dialogVisible = false
            this.managerEmail = ''
            this.managerPassword = ''
            if (this.pageNum > Math.ceil((this.listSize - 1) / this.pageSize)) { this.pageNum -= 1 }
            this.fetchData()
          }).catch(reason => {
            this.$message({
              type: 'error',
              message: 'Failed!'
            })
          })
        } else {
          this.$message({
            type: 'error',
            message: 'Verification failed!'
          })
        }
      }).catch(reason => {
        this.$message({
          type: 'error',
          message: 'Network error!'
        })
      })
    }
  }
}
</script>

<style>
.cancel-account-button{
  color: red;
}
</style>
