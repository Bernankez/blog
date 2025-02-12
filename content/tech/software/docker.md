---
title: Docker速查
---

# Docker速查

## 管理

```sh
# 启动
systemctl start docker

# 重启
systemctl restart docker

# 查看状态
systemctl status docker

# 停止
systemctl stop docker
```

## 镜像

```sh
# 查看列表
docker image ls

# 拉取
docker pull <image-name>

# 删除
docker image rm <image-name>
```

## 容器

```sh
# 查看列表（运行中的）
docker ps

# 查看列表（全部的）
docker ps -a

# 启动
docker run [--rm] [--detach|-d] [--name <name>] [--env-file=<file>] [--volume <LOCAL_PATH:CONTAINER_PATH>] [--publish|-p <HOST_PORT:CONTAINER_PORT>] <image-name>

# 停止
docker stop <container-name>

# 删除
docker rm <container-id>
```

> `--rm`：容器退出时自动删除
>
> `--detach|-d`：后台运行
>
> `--name <name>`：指定容器名称
>
> `--env-file=<file>`：环境文件
>
> `--volume <LOCAL_PATH:CONTAINER_PATH>`：数据持久化。本地路径:容器内路径
>
> `--publish|-p <LOCAL_PORT:CONTAINER_PORT>`：端口映射。本机端口:容器内端口
>
> `image-name`：镜像名

```sh
# 进入运行中的容器
docker exec [-u <user-id>] -it <container-name|container-id> [command]
```

> `-it`：映射标准输入输出并分配终端
>
> `-u <user-id>`：`-u`指定登录用户，`-u 0`使用root用户进入容器
>
> `command`：一般是bash

## Compose

### 文件格式

:::code-group

```yml [docker-compose.yml]
services:
  <server-name>:
    image: <image-name>
    container_name: <container-name>
    env_file:
      - <env_file_path>
    depends_on:
      <another-server-name>:
        condition: service_healthy
    ports:
      - LOCAL_PORT:CONTAINER_PATH
    volumes:
      - LOCAL_PATH:CONTAINER_PATH[:ro]
      - type: bind
        source: LOCAL_PATH
        target: CONTAINER_PATH
      - example-data:/data
    healthcheck:
      test: [CMD-SHELL, "curl http://localhost:3000/v1/health"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - example-network
    extra_hosts:
      - "host.docker.internal:host-gateway"

volumes:
  example-data:

networks:
  example-network:
```

:::

```sh
# 启动
docker compose up [--build] [--detach|-d]

# 重启（整个compose）
docker compose restart

# 重启（compose中某一服务）
docker compose restart <server-name>

# 停止
docker compose down [-v]

# 查看某服务日志
docker compose logs <server-name>
```

> `--build`：重新构建
>
> `--detach|-d`：后台运行
>
> `-v`：use `-v` to remove volumes
