export default {
    template : `

    <form>
  <div class="mb-3">
    <label for="exampleInputEmail1" class="form-label">Email address</label>
    <input type="email" class="form-control" id="exampleInputEmail1" v-model="email" aria-describedby="emailHelp">
    <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div class="mb-3">
    <label for="exampleInputPassword1" class="form-label">Password</label>
    <input type="password" class="form-control" v-model="password" id="exampleInputPassword1">
  </div>
  <button type="submit"  @click="submitLogin" class="btn btn-primary">Login</button>
</form>
    `,
    data(){
        return {
            email : null,
            password : null,
        } 
    },
    methods : {
        async submitLogin(){
            const res = await fetch(location.origin+'/login', 
                {
                    method : 'POST', 
                    headers: {'Content-Type' : 'application/json'}, 
                    body : JSON.stringify({'email': this.email,'password': this.password})
                })
            if (res.ok){
                console.log('we are logged in')
                const data = await res.json()
              
                localStorage.setItem('user', JSON.stringify(data))
                
                this.$store.commit('setUser')
                if(this.$store.state.role =="admin"){
                this.$router.push('/admindashboard')
                }
                else if(this.$store.state.role =="user"){
                    this.$router.push('/userdashboard')
                }
                else if(this.$store.state.role =="serviceprovider"){
                    this.$router.push('/servicedashboard')
                }
                else{
                    this.$router.push('/login')
                }
            }
        }
    }
}