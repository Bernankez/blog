---
title: 在Linux上释放你的磁盘空间
---

# 在Linux上释放你的磁盘空间

## 使用[`ncdu`](https://dev.yorhel.nl/ncdu)分析磁盘空间占用

### 安装

::: code-group

```sh [ubuntu]
sudo apt install ncdu
```

```sh [centos]
sudo yum install ncdu
```

:::

### 使用

```sh
# 统计当前所在目录及子目录的文件占用情况
ncdu
```

## Docker容器占用空间过大

Docker容器日志一般存放在`/var/lib/docker/containers/container_id/`下

### 清理Docker容器日志（治标）

::: code-group

```sh [clean_docker_log.sh]
#!/bin/sh
echo "======== start clean docker containers logs ========"

logs=$(find /var/lib/docker/containers/ -name *-json.log)

for log in $logs
  do
    echo "clean logs : $log"
    cat /dev/null > $log
  done

echo "======== end clean docker containers logs ========"
```

:::

```sh
chmod +x clean_docker_log.sh

./clean_docker_log.sh
```

### 设置Docker容器日志大小（治本）

#### 设置单个容器

配置容器docker-compose的max-size选项

::: code-group

```yml [docker-compose.yaml]
nginx:
  image: nginx:1.12.1
  restart: always
  logging:
    driver: "json-file",
    options:
      # 5g / 500m etc.
      max-size: "5g" # [!code highlight]
```

:::

重启容器后，日志文件大小会被限制在设定范围内

#### 全局设置

在`/etc/docker/daemon.json`中编辑：

::: code-group

```json [daemon.json]
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "500m",
    "max-file": "3"
  }
}
```

:::

max-size=500m，意味着一个容器日志大小上限是 500M。

max-file=3，意味着一个容器有三个日志，分别是 id+.json、id+1.json、id+2.json。

```sh
// 重启docker守护进程
systemctl daemon-reload
systemctl restart docker
```

设置的日志大小，只对新建的容器有效。

## 清理Linux系统`/var/log/journal/`垃圾日志

```sh
# 只保留最近一周的日志
journalctl --vacuum-time=1w

# 只保留500MB日志
journalctl --vacuum-size=500M
```
