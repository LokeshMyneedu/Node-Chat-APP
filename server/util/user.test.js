const expect = require('expect');
let{Users}= require('./users');



describe('Users',()=>{
    let users;
beforeEach(()=>{
    users = new Users();
    users.Users =[{
        id:'1',
        name:'lokesh',
        room:'node course'
    },{
        id:'2',
        name:'spoorthy',
        room:'react course'
    },{
        id:'3',
        name:'spoorthy lokesh',
        room:'Xamarin course'
    }];
});
it('should add new user',()=>{
    let users = new Users();
    let user ={
        id:'123',
        name:'lokesh',
        room:'suits'
    }
    users.addUser(user.id,user.name,user.room);
    expect(users.users).toEqual([user]);
});
});
