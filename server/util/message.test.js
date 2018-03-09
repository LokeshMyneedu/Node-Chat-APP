const expect = require('expect');
let {generateMessage} = require('./message');

describe('generateMessage',()=>{
    it('should generate corrent message object',()=>{
        let message = generateMessage('Lokesh','Myneedu');
        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({
           from: 'Lokesh',
           text: 'Myneedu'
        }) 
    })
})