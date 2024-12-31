export default {
    props : ['title',  'service_id',"description","baseprice","getspecificservices"],
    template : `
    <div class="card text-bg-primary mb-3" style="max-width: 18rem;" @click="getspecificservices(service_id)">
  <div class="card-header"><h3>{{title}}</h3></div>
  <div class="card-body">
  <h6 class="card-title" >{{description}}</h6>
    <p class="card-text">Base Price: $ {{baseprice}}</p>
  </div>
</div>
    `,
    computed: {
        formattedDate(){
            return new Date(this.date).toLocaleString();
        }
    }
}