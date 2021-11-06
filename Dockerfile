# 设置基础镜像,基于node:14.0.0版本
FROM node:14.0.0

# 配置环境变量
ENV NODE_ENV production

# 配置阿里性能平台参数
# Node.js 性能平台给您的项目生成的 appid
ENV ADMIN_DEMO_ALINODE_APPID appid
# Node.js 性能平台给您的项目生成的 secret
ENV ADMIN_DEMO_ALINODE_APPSECRET secret

# 创建工作目录
RUN mkdir -p /usr/src/app

# 指定工作目录
WORKDIR /usr/src/app

# 拷贝package.json文件到工作目录
# !!重要：package.json需要单独添加。
# Docker在构建镜像的时候，是一层一层构建的，仅当这一层有变化时，重新构建对应的层。
# 如果package.json和源代码一起添加到镜像，则每次修改源码都需要重新安装npm模块，这样木有必要。
# 所以，正确的顺序是: 添加package.json；安装npm模块；添加源代码。
COPY package.json /usr/src/app/package.json

# 安装runtime
RUN npm i nodeinstall -g
RUN nodeinstall --install-alinode ^3

# 安装项目依赖
RUN npm install

# 拷贝所有文件到工作目录
COPY . /usr/src/app

# 暴露端口(可忽略,在启动时指定)
EXPOSE 7002

# 启动项目
CMD npm start
