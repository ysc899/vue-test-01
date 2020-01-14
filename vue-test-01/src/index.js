Vue.component('todo-items',{
    props: ['todo'],
    template:'<li>{{todo.text}}</li>'
});

setTimeout(function(){


var app = new Vue({ 
    el: '#app',
    data(){
        return{
            info:null,
            loading:true,
            errored:false,
            message: 'Hello Vue!',
            firstname : "Rij",
            lastname : "Singh",
            address : "Mumbai",
            htmlcontent:"<div><h1>Vue Js Template</h1></div>",
            imgsrc:"https://cdn.pixabay.com/photo/2013/07/21/13/00/rose-165819_960_720.jpg",
            todos:[
                {text : 'Learn JavaScript'},
                {text : 'Learn Vue'},
                {text : 'Build something awesome'}
            ],
            groceryList:[
                { id: 0, text: 'Vegetables'},
                { id: 1, text: 'Cheese'},
                { id: 2, text: 'Whatever else humans are supposed to eat'}
            ]
              
          }
     },   
     mounted(){
         axios
            .get('https://api.coindesk.com/v1/bpi/currentprice.json')
            .then(response => {
                this.info = response.data.bpi
                console.log("aaaaa === " , response.data.bpi)
            })
            .catch(error => {
                console.log(error)
                this.errored = true
            })
            .finally(() => this.loading = false)

     },
    methods: {
        reverseMessage:function(){
            this.message = this.message.split('').reverse().join('');
        },
        mydetails : function(){
            return "I am " + this.firstname + " " + this.lastname;
        }
    }
});
},5000);

app.message = "Changed Data! Hello Vue!!!"

app.todos.push({text:'New item'})