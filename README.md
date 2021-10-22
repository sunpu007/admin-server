# admin-server



## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### Docker Deploy

```bash
# 由于在项目中使用了hosts,所以需要需要在启动的时候追加数据库指向,也可在项目配置中将其修改成IP
docker run -itd --net=host --name admin-server --add-host=adminDemodb:<数据库地址> admin-server
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.

[egg]: https://eggjs.org
