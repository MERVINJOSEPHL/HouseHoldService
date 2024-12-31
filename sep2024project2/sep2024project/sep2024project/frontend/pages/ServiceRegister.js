import router from "../utils/router.js"

const ServiceRegister = {
    props:{
        services:Array
    },
    template : `
    <div class="mb-3">
    <form class="mb-3">
    <div class="mb-3">
      <label for="fullname" class="form-label">Full Name</label>
      <input type="text" class="form-control" id="fullname" v-model="fullname" >
    </div>
    <div class="mb-3">
       <label for="username" class="form-label">User Name</label>
       <input type="text" class="form-control" id="username" v-model="username">
    </div>
    <div class="mb-3">
        <label for="pincode" class="form-label">Pin Code</label>
        <input type="text" class="form-control" id="pincode" v v-model="pincode">
    </div>
    <div class="mb-3">
        <label for="exampleFormControlTextarea1" class="form-label">Address</label>
        <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" v-model="address"></textarea>
    </div>
    <div class="mb-3">
      <label for="exampleInputEmail1" class="form-label">Email address</label>
      <input type="email" class="form-control" id="exampleInputEmail1" v-model="email" aria-describedby="emailHelp">
    </div>
    <div class="mb-3">
      <label for="exampleInputPassword1" class="form-label">Password</label>
      <input type="password" class="form-control" v-model="password" id="exampleInputPassword1">
    </div>
    <div class="mb-3">
     <label for="customRange1" class="form-label">Experience</label>
     <input type="number" placeholder="experience"  min=0 v-model="experience">
    </div>
    <div class="mb-3">
    <select class="form-select" aria-label="Default select example" v-model="selectedservice">
        <option value="Select Service" disabled hidden>Select Service</option>
        <option v-for="service in services" :key="service.id" :value="service">
        {{ service.service_name }}
        </option>
    </select>
    </div>
    <button type="submit"  @click="submitLogin" class="btn btn-primary">Register</button>
  </form>
    </div>
    </div>
    `,
    data(){
        return {
            selectedservice:"Select Service",
            fullname:null,
            username:null,
            address:null,
            pincode:null,
            email : null,
            password : null,
            document:null,
            experience:0,
            role : "serviceprovider",
        } 
    },
    methods : {
        async submitLogin(){
            const res = await fetch(location.origin+'/Signup', 
                {method : 'POST', 
                    headers: {'Content-Type' : 'application/json','Access-Token': this.$store.state.auth_token}, 
                    body:JSON.stringify({
                        "username":this.username,
                        "address":this.address,
                        "fullname":this.fullname,
                        "pincode":this.pincode,
                        "email":this.email,
                        "password":this.password,
                        "document":this.document,
                        "service":this.selectedservice.service_name,
                        "roles":this.role,
                        "experience":this.experience
                      })
                    }
                    )
                
            if (res.ok){
                router.push("/login")
            }
        }
    }
}
export default ServiceRegister