const Docker = require('dockerode');
const fs = require('fs');
const path = require('path');
const os = require('os');

class ShellSandbox {
  constructor(options = {}) {
    this.docker = new Docker();
    this.options = {
      image: 'alpine:latest',
      memory: '256m',
      cpuQuota: 50000, // 50% CPU
      timeout: 30000,
      networkDisabled: true,
      readOnlyRootfs: true,
      allowedCommands: ['ls', 'cat', 'echo', 'grep', 'awk', 'sed', 'find'],
      maxOutputSize: 1024 * 1024, // 1MB
      ...options
    };
  }

  async executeShellScript(scriptContent, envVars = {}) {
    const tempDir = await this.createTempDirectory();
    const scriptPath = path.join(tempDir, 'script.sh');
    
    try {
      // 写入脚本文件
      await fs.promises.writeFile(scriptPath, scriptContent, { mode: 0o755 });
      
      // 创建容器配置
      const container = await this.createContainer(tempDir, envVars);
      
      // 启动并执行
      const result = await this.runContainer(container);
      
      return result;
    } finally {
      // 清理临时目录
      await this.cleanupTempDirectory(tempDir);
    }
  }

  async createTempDirectory() {
    const tempDir = path.join(os.tmpdir(), `shell-sandbox-${Date.now()}-${Math.random().toString(36).substr(2)}`);
    await fs.promises.mkdir(tempDir, { recursive: true });
    return tempDir;
  }

  async createContainer(tempDir, envVars) {
    // 准备环境变量数组
    const env = Object.entries(envVars).map(([key, value]) => `${key}=${value}`);
    
    const containerConfig = {
      Image: this.options.image,
      Cmd: ['/bin/sh', '/sandbox/script.sh'],
      HostConfig: {
        Memory: parseInt(this.options.memory) * 1024 * 1024,
        MemorySwap: parseInt(this.options.memory) * 1024 * 1024, // 禁用swap
        CpuPeriod: 100000,
        CpuQuota: this.options.cpuQuota,
        CpusetCpus: '0', // 限制使用特定CPU核心
        BlkioWeight: 10,
        PidsLimit: 50,
        NetworkMode: this.options.networkDisabled ? 'none' : 'bridge',
        ReadonlyRootfs: this.options.readOnlyRootfs,
        Binds: [
          `${tempDir}:/sandbox:ro`, // 只读挂载
          '/dev/null:/dev/null:rw',
          '/dev/zero:/dev/zero:rw',
          '/dev/random:/dev/random:ro',
          '/dev/urandom:/dev/urandom:ro'
        ],
        // 安全配置
        CapDrop: ['ALL'],
        CapAdd: ['CHOWN', 'DAC_OVERRIDE', 'FOWNER', 'SETGID', 'SETUID'],
        SecurityOpt: [
          'no-new-privileges:true',
          'seccomp=' + JSON.stringify(this.getSeccompProfile())
        ],
        Ulimits: [
          { Name: 'nproc', Soft: 50, Hard: 50 },
          { Name: 'nofile', Soft: 100, Hard: 100 }
        ]
      },
      Env: [
        'PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
        'HOME=/tmp',
        'TERM=xterm',
        ...env
      ],
      WorkingDir: '/sandbox',
      User: 'nobody:nogroup',
      AttachStdout: true,
      AttachStderr: true,
      Tty: false,
      OpenStdin: false,
      StdinOnce: false
    };

    return await this.docker.createContainer(containerConfig);
  }

  getSeccompProfile() {
    return {
      defaultAction: "SCMP_ACT_ERRNO",
      architectures: ["SCMP_ARCH_X86_64", "SCMP_ARCH_X86", "SCMP_ARCH_X32"],
      syscalls: [
        {
          names: [
            "accept", "access", "alarm", "arch_prctl", "bind", "brk",
            "capget", "capset", "chdir", "chmod", "chown", "chown32",
            "clock_gettime", "clone", "close", "connect", "dup", "dup2",
            "execve", "exit", "exit_group", "faccessat", "fchdir", "fchmod",
            "fchown", "fchown32", "fcntl", "fcntl64", "fdatasync", "flock",
            "fstat", "fstat64", "fstatat64", "fsync", "ftruncate", "ftruncate64",
            "futex", "getcwd", "getdents", "getdents64", "getegid", "getegid32",
            "geteuid", "geteuid32", "getgid", "getgid32", "getgroups", "getgroups32",
            "getpeername", "getpgid", "getpgrp", "getpid", "getppid", "getpriority",
            "getrandom", "getresgid", "getresgid32", "getresuid", "getresuid32",
            "getrlimit", "getrusage", "getsid", "getsockname", "getsockopt",
            "gettid", "gettimeofday", "getuid", "getuid32", "getxattr", "ioctl",
            "kill", "lchown", "lchown32", "lgetxattr", "link", "linkat", "listen",
            "listxattr", "llistxattr", "lremovexattr", "lseek", "lsetxattr",
            "lstat", "lstat64", "madvise", "memfd_create", "mincore", "mkdir",
            "mkdirat", "mmap", "mmap2", "mprotect", "mremap", "msync", "munmap",
            "nanosleep", "newfstatat", "open", "openat", "pause", "pipe", "pipe2",
            "poll", "pread64", "prlimit64", "pwrite64", "read", "readlink",
            "readlinkat", "recvfrom", "recvmsg", "rename", "renameat",
            "renameat2", "rmdir", "rt_sigaction", "rt_sigprocmask",
            "rt_sigreturn", "sched_getaffinity", "sched_getparam",
            "sched_getscheduler", "sched_setscheduler", "sched_yield",
            "select", "sendmsg", "sendto", "set_robust_list", "set_tid_address",
            "setgid", "setgid32", "setgroups", "setgroups32", "setpgid",
            "setpriority", "setregid", "setregid32", "setresgid", "setresgid32",
            "setresuid", "setresuid32", "setreuid", "setreuid32", "setsid",
            "setsockopt", "setuid", "setuid32", "shutdown", "sigaltstack",
            "socket", "socketpair", "stat", "stat64", "statfs", "statfs64",
            "symlink", "symlinkat", "sysinfo", "tgkill", "time", "tkill",
            "umask", "uname", "unlink", "unlinkat", "wait4", "waitpid",
            "write", "writev"
          ],
          action: "SCMP_ACT_ALLOW"
        }
      ]
    };
  }

  async runContainer(container) {
    const startTime = Date.now();
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(async () => {
        try {
          await container.stop({ t: 0 });
          reject(new Error('Execution timeout'));
        } catch (err) {
          reject(err);
        }
      }, this.options.timeout);

      container.start(async (err) => {
        if (err) {
          clearTimeout(timeout);
          return reject(err);
        }

        container.wait(async (err, data) => {
          clearTimeout(timeout);
          
          if (err) {
            return reject(err);
          }

          try {
            const logs = await container.logs({
              stdout: true,
              stderr: true,
              timestamps: false
            });
            
            const output = logs.toString('utf8', 8); // 跳过Docker日志头
            
            // 限制输出大小
            const truncatedOutput = output.length > this.options.maxOutputSize 
              ? output.substring(0, this.options.maxOutputSize) + '\n...(output truncated)'
              : output;

            resolve({
              exitCode: data.StatusCode,
              output: truncatedOutput,
              executionTime: Date.now() - startTime,
              error: data.Error ? data.Error : null
            });
          } catch (logErr) {
            resolve({
              exitCode: data.StatusCode,
              output: '',
              executionTime: Date.now() - startTime,
              error: logErr.message
            });
          } finally {
            // 清理容器
            try {
              await container.remove({ force: true });
            } catch (removeErr) {
              console.warn('Failed to remove container:', removeErr.message);
            }
          }
        });
      });
    });
  }

  async cleanupTempDirectory(tempDir) {
    try {
      await fs.promises.rm(tempDir, { recursive: true, force: true });
    } catch (err) {
      console.warn('Failed to cleanup temp directory:', err.message);
    }
  }

  // 验证脚本安全性
  static validateShellScript(scriptContent) {
    const dangerousPatterns = [
      /rm\s+-rf\s+\/\s*/,           // rm -rf /
      /dd\s+if=.*of=\/dev\/sda/,    // 直接写磁盘
      /mkfs\./,                     // 格式化命令
      /fdisk\s+/,                   // 分区工具
      /:\(\)\{\s*:\|\:&\s*\};:/,    // Fork炸弹
      /exec\s+\$\{SHELL:-.*\}/,     // 执行任意shell
      /nc\s+-l/,                    // 网络监听
      /wget\s+.*\|\s*sh/,           // 下载并执行
      /curl\s+.*\|\s*sh/,           // 下载并执行
      /chmod\s+[0-7]{3,4}\s+\/bin/, // 修改系统二进制权限
      /chown\s+root:root\s+\/bin/,  // 修改系统文件所有权
      /mount\s+/,                   // 挂载文件系统
      /umount\s+/,                  // 卸载文件系统
      /crontab\s+/,                 // 修改crontab
      /service\s+/,                 // 系统服务操作
      /systemctl\s+/,               // systemd操作
      /iptables\s+/,                // 防火墙规则
      />\s*\/dev\/tcp\//,           // bash TCP重定向
      />\s*\/dev\/udp\//,           // bash UDP重定向
      /\$\(.*\$\(.*\)\)/,           // 嵌套命令替换
      /eval\s+\$/,                  // eval变量
      /exec\s+<\s*&[0-9]+/,         // 文件描述符操作
      /mknod\s+/,                   // 创建设备文件
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(scriptContent)) {
        return {
          valid: false,
          reason: `Dangerous pattern detected: ${pattern.source}`
        };
      }
    }

    // 检查是否包含未授权的命令
    const commands = scriptContent.match(/\b[a-zA-Z_][a-zA-Z0-9_-]*\b/g) || [];
    const unauthorizedCommands = commands.filter(cmd => 
      /^[a-z]+$/i.test(cmd) && 
      !this.allowedCommands.includes(cmd)
    );

    if (unauthorizedCommands.length > 0) {
      return {
        valid: false,
        reason: `Unauthorized commands: ${unauthorizedCommands.join(', ')}`
      };
    }

    return { valid: true };
  }
}

module.exports = ShellSandbox;