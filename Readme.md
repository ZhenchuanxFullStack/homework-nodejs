hotload：
下列所有路径为hotload所在位置的相对路径
--file: 监听的文件改动会重新reload 这个文件 // 默认./src/app.js
--watchDir: 你想监听哪个文件夹下的文件(会递归所有文件) // 默认src
--delay: 在--delay时间内保存多次只会执行一次(ms)