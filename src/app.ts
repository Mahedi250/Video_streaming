
require('dotenv').config()

import server from './Provider/HttpServer'

server.get('/',(req,res)=>{
  res.send('video stream');
});

server.listen(process.env.HTTP_PORT, async () => {
  console.log(`HTTP server is running on port: ${process.env.HTTP_PORT}`)
})